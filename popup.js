document.addEventListener('DOMContentLoaded', function() {
    const imageUpload = document.getElementById('imageUpload');
    const pasteImage = document.getElementById('pasteImage');
    const imagePreview = document.getElementById('imagePreview');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const dropText = document.getElementById('dropText');
    const extractButton = document.getElementById('extractButton');
    const describeButton = document.getElementById('describeButton');
    const outputText = document.getElementById('outputText');
    const downloadButton = document.getElementById('downloadButton');
    const copyButton = document.getElementById('copyButton');
    const settingsButton = document.getElementById('settingsButton');
    const settingsPanel = document.getElementById('settingsPanel');
    const loadingSpinner = document.querySelector('.loading');
    const darkModeToggle = document.getElementById('darkModeToggle');

    imageUpload.addEventListener('change', handleImageUpload);
    pasteImage.addEventListener('click', handleImagePaste);
    extractButton.addEventListener('click', extractText);
    describeButton.addEventListener('click', describeImage);
    downloadButton.addEventListener('click', downloadText);
    copyButton.addEventListener('click', copyText);
    settingsButton.addEventListener('click', toggleSettings);
    darkModeToggle.addEventListener('change', toggleDarkMode);

    // Initialize dark mode
    chrome.storage.sync.get(['darkMode'], function(result) {
        if (result.darkMode) {
            document.body.classList.add('dark');
            darkModeToggle.checked = true;
        }
    });

    // Drag and drop functionality
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        imagePreviewContainer.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        imagePreviewContainer.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        imagePreviewContainer.addEventListener(eventName, unhighlight, false);
    });

    imagePreviewContainer.addEventListener('drop', handleDrop, false);

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight() {
        imagePreviewContainer.classList.add('bg-blue-100', 'dark:bg-blue-800');
    }

    function unhighlight() {
        imagePreviewContainer.classList.remove('bg-blue-100', 'dark:bg-blue-800');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        handleImageFile(file);
    }

    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            handleImageFile(file);
        }
    }

    function handleImageFile(file) {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.classList.remove('hidden');
                dropText.classList.add('hidden');
            }
            reader.readAsDataURL(file);
        } else {
            showError('Please select a valid image file.');
        }
    }

    function handleImagePaste() {
        navigator.clipboard.read().then(clipboardItems => {
            for (const clipboardItem of clipboardItems) {
                for (const type of clipboardItem.types) {
                    if (type.startsWith('image/')) {
                        clipboardItem.getType(type).then(blob => {
                            handleImageFile(blob);
                        });
                        return;
                    }
                }
            }
            showError('No image found in clipboard.');
        }).catch(error => {
            showError('Failed to paste image: ' + error.message);
        });
    }

    function extractText() {
        if (!imagePreview.src) {
            showError('Please upload an image first.');
            return;
        }

        chrome.storage.sync.get(['ocrSpaceApiKey'], function(result) {
            if (!result.ocrSpaceApiKey) {
                showError('Please set your OCRSpace API key in the settings.');
                return;
            }

            showLoading();
            const apiKey = result.ocrSpaceApiKey;
            const imageData = imagePreview.src;

            fetch('https://api.ocr.space/parse/image', {
                method: 'POST',
                headers: {
                    'apikey': apiKey,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `base64Image=${encodeURIComponent(imageData)}&language=eng&isOverlayRequired=false`
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                hideLoading();
                if (data.IsErroredOnProcessing) {
                    throw new Error(data.ErrorMessage || 'Unknown error occurred during OCR processing');
                }
                if (data.ParsedResults && data.ParsedResults.length > 0) {
                    outputText.value = data.ParsedResults[0].ParsedText || "No text found in the image.";
                } else {
                    outputText.value = "No text found in the image.";
                }
            })
            .catch(error => {
                hideLoading();
                showError('Error during OCR processing: ' + error.message);
            });
        });
    }

    function describeImage() {
        if (!imagePreview.src) {
            showError('Please upload an image first.');
            return;
        }

        chrome.storage.sync.get(['mistralApiKey'], function(result) {
            if (!result.mistralApiKey) {
                showError('Please set your Mistral API key in the settings.');
                return;
            }

            showLoading();
            const apiKey = result.mistralApiKey;
            const imageData = imagePreview.src.split(',')[1];

            fetch('https://api.mistral.ai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "pixtral-12b",
                    messages: [
                        {
                            role: "user",
                            content: [
                                {
                                    type: "text",
                                    text: "Describe this image in detail."
                                },
                                {
                                    type: "image_url",
                                    image_url: {
                                        url: `data:image/jpeg;base64,${imageData}`
                                    }
                                }
                            ]
                        }
                    ],
                    max_tokens: 500
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                hideLoading();
                if (data.choices && data.choices.length > 0) {
                    outputText.value = data.choices[0].message.content;
                } else {
                    outputText.value = "No description generated.";
                }
            })
            .catch(error => {
                hideLoading();
                showError('Error during image description: ' + error.message);
            });
        });
    }

    function downloadText() {
        const text = outputText.value;
        if (!text) {
            showError('No text to download.');
            return;
        }
        const blob = new Blob([text], {type: 'text/plain'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'output.txt';
        a.click();
        URL.revokeObjectURL(url);
    }

    function copyText() {
        const text = outputText.value;
        if (!text) {
            showError('No text to copy.');
            return;
        }
        navigator.clipboard.writeText(text).then(() => {
            showMessage('Text copied to clipboard!');
        }).catch(err => {
            showError('Failed to copy text: ' + err);
        });
    }

    function toggleSettings() {
        settingsPanel.classList.toggle('active');
    }

    function toggleDarkMode() {
        document.body.classList.toggle('dark');
        chrome.storage.sync.set({darkMode: darkModeToggle.checked});
    }

    function showLoading() {
        loadingSpinner.style.display = 'flex';
    }

    function hideLoading() {
        loadingSpinner.style.display = 'none';
    }

    function showError(message) {
        outputText.value = 'Error: ' + message;
        outputText.classList.add('text-red-500', 'dark:text-red-400');
        setTimeout(() => {
            outputText.classList.remove('text-red-500', 'dark:text-red-400');
        }, 3000);
    }

    function showMessage(message) {
        const originalText = outputText.value;
        outputText.value = message;
        outputText.classList.add('text-green-500', 'dark:text-green-400');
        setTimeout(() => {
            outputText.value = originalText;
            outputText.classList.remove('text-green-500', 'dark:text-green-400');
        }, 2000);
    }
});
