document.addEventListener('DOMContentLoaded', function() {
    const ocrSpaceApiKey = document.getElementById('ocrSpaceApiKey');
    const visionApiKey = document.getElementById('visionApiKey');
    const saveOcrSpaceApiKey = document.getElementById('saveOcrSpaceApiKey');
    const saveVisionApiKey = document.getElementById('saveVisionApiKey');

    // Load saved API keys
    chrome.storage.sync.get(['ocrSpaceApiKey', 'visionApiKey'], function(result) {
        ocrSpaceApiKey.value = result.ocrSpaceApiKey ? '••••••••' : '';
        visionApiKey.value = result.visionApiKey ? '••••••••' : '';
    });

    saveOcrSpaceApiKey.addEventListener('click', function() {
        chrome.storage.sync.set({
            ocrSpaceApiKey: ocrSpaceApiKey.value
        }, function() {
            alert('OCRSpace API Key saved');
            ocrSpaceApiKey.value = '••••••••';
        });
    });

    saveVisionApiKey.addEventListener('click', function() {
        chrome.storage.sync.set({
            visionApiKey: visionApiKey.value
        }, function() {
            alert('Vision API Key saved');
            visionApiKey.value = '••••••••';
        });
    });

    ocrSpaceApiKey.addEventListener('focus', function() {
        if (this.value === '••••••••') {
            this.value = '';
        }
    });

    visionApiKey.addEventListener('focus', function() {
        if (this.value === '••••••••') {
            this.value = '';
        }
    });
});
