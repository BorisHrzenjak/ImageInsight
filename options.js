document.addEventListener('DOMContentLoaded', function() {
    const ocrSpaceApiKey = document.getElementById('ocrSpaceApiKey');
    const mistralApiKey = document.getElementById('mistralApiKey');
    const saveOcrSpaceApiKey = document.getElementById('saveOcrSpaceApiKey');
    const saveMistralApiKey = document.getElementById('saveMistralApiKey');
    const darkModeToggle = document.getElementById('darkModeToggle');

    // Load saved API keys and dark mode setting
    chrome.storage.sync.get(['ocrSpaceApiKey', 'mistralApiKey', 'darkMode'], function(result) {
        ocrSpaceApiKey.value = result.ocrSpaceApiKey || '';
        mistralApiKey.value = result.mistralApiKey || '';
        darkModeToggle.checked = result.darkMode || false;
        if (result.darkMode) {
            document.body.classList.add('dark');
        }
    });

    saveOcrSpaceApiKey.addEventListener('click', function() {
        saveApiKey('ocrSpaceApiKey', ocrSpaceApiKey.value, saveOcrSpaceApiKey);
    });

    saveMistralApiKey.addEventListener('click', function() {
        saveApiKey('mistralApiKey', mistralApiKey.value, saveMistralApiKey);
    });

    darkModeToggle.addEventListener('change', function() {
        toggleDarkMode();
    });

    function saveApiKey(keyName, value, button) {
        if (!value) {
            showError(button, 'API key cannot be empty');
            return;
        }

        chrome.storage.sync.set({ [keyName]: value }, function() {
            showSuccess(button, 'API Key saved');
        });
    }

    function toggleDarkMode() {
        document.body.classList.toggle('dark');
        chrome.storage.sync.set({darkMode: darkModeToggle.checked});
    }

    function showSuccess(element, message) {
        const originalText = element.textContent;
        element.textContent = message;
        element.classList.add('bg-green-500', 'dark:bg-green-600');
        element.classList.remove('hover:bg-green-600', 'dark:hover:bg-green-700');
        
        setTimeout(() => {
            element.textContent = originalText;
            element.classList.remove('bg-green-500', 'dark:bg-green-600');
            element.classList.add('hover:bg-green-600', 'dark:hover:bg-green-700');
        }, 2000);
    }

    function showError(element, message) {
        const originalText = element.textContent;
        element.textContent = message;
        element.classList.add('bg-red-500', 'dark:bg-red-600');
        element.classList.remove('hover:bg-green-600', 'dark:hover:bg-green-700');
        
        setTimeout(() => {
            element.textContent = originalText;
            element.classList.remove('bg-red-500', 'dark:bg-red-600');
            element.classList.add('hover:bg-green-600', 'dark:hover:bg-green-700');
        }, 2000);
    }
});
