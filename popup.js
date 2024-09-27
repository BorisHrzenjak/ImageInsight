document.addEventListener('DOMContentLoaded', function() {
    const imageUpload = document.getElementById('imageUpload');
    const pasteImage = document.getElementById('pasteImage');
    const imagePreview = document.getElementById('imagePreview');
    const extractButton = document.getElementById('extractButton');
    const describeButton = document.getElementById('describeButton');
    const outputText = document.getElementById('outputText');
    const downloadButton = document.getElementById('downloadButton');
    const copyButton = document.getElementById('copyButton');
    const settingsButton = document.getElementById('settingsButton');

    imageUpload.addEventListener('change', handleImageUpload);
    pasteImage.addEventListener('click', handleImagePaste);
    extractButton.addEventListener('click', extractText);
    describeButton.addEventListener('click', describeImage);
    downloadButton.addEventListener('click', downloadText);
    copyButton.addEventListener('click', copyText);
    settingsButton.addEventListener('click', openSettings);

    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            }
            reader.readAsDataURL(file);
        }
    }

    function handleImagePaste() {
        navigator.clipboard.read().then(clipboardItems => {
            for (const clipboardItem of clipboardItems) {
                for (const type of clipboardItem.types) {
                    if (type.startsWith('image/')) {
                        clipboardItem.getType(type).then(blob => {
                            const reader = new FileReader();
                            reader.onload = function(e) {
                                imagePreview.src = e.target.result;
                                imagePreview.style.display = 'block';
                            }
                            reader.readAsDataURL(blob);
                        });
                        return;
                    }
                }
            }
        });
    }

    function extractText() {
        chrome.storage.sync.get(['ocrSpaceApiKey'], function(result) {
            if (!result.ocrSpaceApiKey) {
                outputText.value = "Please set your OCRSpace API key in the settings.";
                return;
            }

            const apiKey = result.ocrSpaceApiKey;
            const imageData = imagePreview.src; // Keep the full data URL

            console.log('API Key (first 4 chars):', apiKey.substring(0, 4));
            console.log('Image data length:', imageData.length);

            fetch('https://api.ocr.space/parse/image', {
                method: 'POST',
                headers: {
                    'apikey': apiKey,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `base64Image=${encodeURIComponent(imageData)}&language=eng&isOverlayRequired=false`
            })
            .then(response => {
                console.log('Response status:', response.status);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('OCR API response:', JSON.stringify(data, null, 2));
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
                console.error('Error:', error);
                outputText.value = `An error occurred during OCR processing: ${error.message}`;
            });
        });
    }

    function describeImage() {
        chrome.storage.sync.get(['mistralApiKey'], function(result) {
            if (!result.mistralApiKey) {
                outputText.value = "Please set your Mistral API key in the settings.";
                return;
            }

            const apiKey = result.mistralApiKey;
            const imageData = imagePreview.src.split(',')[1]; // Get base64 image data

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
                if (data.choices && data.choices.length > 0) {
                    outputText.value = data.choices[0].message.content;
                } else {
                    outputText.value = "No description generated.";
                }
            })
            .catch(error => {
                console.error('Error:', error);
                outputText.value = `An error occurred during image description: ${error.message}`;
            });
        });
    }

    function downloadText() {
        const text = outputText.value;
        const blob = new Blob([text], {type: 'text/plain'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'output.txt';
        a.click();
        URL.revokeObjectURL(url);
    }

    function copyText() {
        outputText.select();
        document.execCommand('copy');
    }

    function openSettings() {
        chrome.runtime.openOptionsPage();
    }
});
