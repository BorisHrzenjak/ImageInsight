document.addEventListener('DOMContentLoaded', function() {
    const ocrApiKey = document.getElementById('ocrApiKey');
    const visionApiKey = document.getElementById('visionApiKey');
    const saveButton = document.getElementById('saveButton');

    // Load saved API keys
    chrome.storage.sync.get(['ocrApiKey', 'visionApiKey'], function(result) {
        ocrApiKey.value = result.ocrApiKey || '';
        visionApiKey.value = result.visionApiKey || '';
    });

    saveButton.addEventListener('click', function() {
        chrome.storage.sync.set({
            ocrApiKey: ocrApiKey.value,
            visionApiKey: visionApiKey.value
        }, function() {
            alert('Settings saved');
        });
    });
});
