document.addEventListener('DOMContentLoaded', function() {
    const ocrSpaceApiKey = document.getElementById('ocrSpaceApiKey');
    const mistralApiKey = document.getElementById('mistralApiKey');
    const saveOcrSpaceApiKey = document.getElementById('saveOcrSpaceApiKey');
    const saveMistralApiKey = document.getElementById('saveMistralApiKey');

    // Load saved API keys
    chrome.storage.sync.get(['ocrSpaceApiKey', 'mistralApiKey'], function(result) {
        ocrSpaceApiKey.value = result.ocrSpaceApiKey ? '••••••••' : '';
        mistralApiKey.value = result.mistralApiKey ? '••••••••' : '';
    });

    saveOcrSpaceApiKey.addEventListener('click', function() {
        chrome.storage.sync.set({
            ocrSpaceApiKey: ocrSpaceApiKey.value
        }, function() {
            alert('OCRSpace API Key saved');
            ocrSpaceApiKey.value = '••••••••';
        });
    });

    saveMistralApiKey.addEventListener('click', function() {
        chrome.storage.sync.set({
            mistralApiKey: mistralApiKey.value
        }, function() {
            alert('Mistral API Key saved');
            mistralApiKey.value = '••••••••';
        });
    });

    ocrSpaceApiKey.addEventListener('focus', function() {
        if (this.value === '••••••••') {
            this.value = '';
        }
    });

    mistralApiKey.addEventListener('focus', function() {
        if (this.value === '••••••••') {
            this.value = '';
        }
    });
});
