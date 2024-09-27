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
        // TODO: Implement OCR API call
        outputText.value = "OCR text extraction not implemented yet.";
    }

    function describeImage() {
        // TODO: Implement Vision API call
        outputText.value = "Image description not implemented yet.";
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
