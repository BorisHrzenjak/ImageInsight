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
        saveApiKey('ocrSpaceApiKey', ocrSpaceApiKey.value, saveOcrSpaceApiKey);
    });

    saveMistralApiKey.addEventListener('click', function() {
        saveApiKey('mistralApiKey', mistralApiKey.value, saveMistralApiKey);
    });

    ocrSpaceApiKey.addEventListener('focus', clearMask);
    mistralApiKey.addEventListener('focus', clearMask);

    ocrSpaceApiKey.addEventListener('blur', applyMask);
    mistralApiKey.addEventListener('blur', applyMask);

    function saveApiKey(keyName, value, button) {
        if (!value) {
            showError(button, 'API key cannot be empty');
            return;
        }

        chrome.storage.sync.set({ [keyName]: value }, function() {
            showSuccess(button, 'API Key saved');
            applyMask({ target: document.getElementById(keyName) });
        });
    }

    function clearMask(event) {
        if (event.target.value === '••••••••') {
            event.target.value = '';
        }
    }

    function applyMask(event) {
        if (event.target.value && event.target.value !== '••••••••') {
            event.target.value = '••••••••';
        }
    }

    function showSuccess(element, message) {
        const originalText = element.textContent;
        element.textContent = message;
        element.classList.add('bg-green-500');
        element.classList.remove('hover:bg-green-600');
        
        setTimeout(() => {
            element.textContent = originalText;
            element.classList.remove('bg-green-500');
            element.classList.add('hover:bg-green-600');
        }, 2000);
    }

    function showError(element, message) {
        const originalText = element.textContent;
        element.textContent = message;
        element.classList.add('bg-red-500');
        element.classList.remove('hover:bg-green-600');
        
        setTimeout(() => {
            element.textContent = originalText;
            element.classList.remove('bg-red-500');
            element.classList.add('hover:bg-green-600');
        }, 2000);
    }
});
