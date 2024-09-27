
**Title:**  
**Image Insight**

**Overview:**  
Create a Chrome extension that allows users to upload or paste images, extract text from the image (with OCRSpace API), and generate descriptions of the image (with Pixtral 12B API). The extension will have two primary buttons: "Extract" and "Describe." The output will appear in a text box below the image, and users will have options to download the text or copy it to the clipboard. Additionally, there will be a settings button to allow users to enter their API keys for both the OCR and Vision APIs.

---

### Features & Specifications:

#### 1. **Image Upload & Paste from Clipboard**
   - **Image Upload:**  
     Users can upload images through a standard file input.
   - **Paste from Clipboard:**  
     Next to the file input, provide a small button that allows users to paste an image from their clipboard (if an image is present in the clipboard).

#### 2. **Buttons**
   - **Extract Button:**  
     When clicked, the extension will extract text from the uploaded image using an OCR API and display the text in a text box below the image.
   - **Describe Button:**  
     When clicked, the extension will send the image to a Vision API to generate a description of the image and display the description in the same text box.
   
#### 3. **Text Output Box**
   - The text box below the image will display the extracted text or description.
   - There will be options to:
     - **Download the text** as a `.txt` file.
     - **Copy the text** to the clipboard using a "Copy" button.

#### 4. **Settings Button**
   - A settings icon will allow users to input their API keys for the OCR and Vision APIs.
   - The settings page will include:
     - A text input field for each API key (e.g., "Enter your OCR API key" and "Enter your Vision API key").
     - Save button to store the API keys locally.

---

### UI Design:

1. **Main Popup Layout** (Extension UI):
   - **File Input:**  
     - A button labeled "Upload Image" and next to it a smaller button labeled "Paste Image."
   - **Image Display:**  
     - Once uploaded or pasted, the image is displayed in a preview area.
   - **Buttons:**  
     - Two buttons below the image:  
       - **"Extract"** (for OCR text extraction)
       - **"Describe"** (for generating the description)
   - **Text Output Box:**  
     - Below the buttons, there will be a text area that displays the extracted text or the description.
     - Below the text box, provide two buttons:  
       - **"Download"** (to save the text as a `.txt` file)
       - **"Copy"** (to copy the text to the clipboard)

2. **Settings Page:**
   - Accessible via a small gear icon at the top-right corner of the extension popup.
   - It should include:
     - **Text Input Fields** for the OCR and Vision API keys.
     - **Save Button** to store the API keys.
     - Both API key fields should be validated to ensure they are in the correct format (e.g., alphanumeric with no spaces).
     - The API keys should be saved in the browser's `localStorage` or `chrome.storage.sync` to persist across sessions.
     - The API keys should be hidden from the user (e.g., using asterisks or dots) to prevent them from being easily accessed.

---

### Implementation Details:

1. **HTML Structure:**
   - File input for image upload and paste button next to it.
   - Image preview area.
   - Extract and Describe buttons.
   - Text area for displaying the extracted/description text.
   - Download and Copy buttons for the text area.
   - Settings page with API key fields.

2. **JavaScript Functions:**
   - **Image Upload & Preview:** Handle displaying the uploaded/pasted image.
   - **Extract Function:**  
     - Use the OCR API (e.g., Tesseract.js or any other API) to extract text from the image.
     - Display the text in the output box.
   - **Describe Function:**  
     - Use the Vision API (e.g., Google Vision API) to generate a description of the image.
     - Display the description in the output box.
   - **Clipboard Image Paste:**  
     - Detect if an image is available in the clipboard and paste it into the upload area when the "Paste" button is clicked.
   - **Download Function:**  
     - Enable users to download the text in the text box as a `.txt` file.
   - **Copy to Clipboard Function:**  
     - Copy the text in the output box to the clipboard.
   - **API Key Handling:**  
     - Save the user's OCR and Vision API keys in the browser's `localStorage`.
     - Ensure these keys are used in the appropriate API calls during the "Extract" and "Describe" operations.

3. **CSS Styling:**
   - Create a simple, user-friendly interface with clearly defined sections.
   - Ensure proper layout for buttons and text areas to provide a clean user experience.

---

### Additional Considerations:

- **Error Handling:**  
  Display error messages if the user uploads an invalid file type or if the API call fails (e.g., due to incorrect API keys).
  
- **Clipboard Handling Permissions:**  
  Ensure that the necessary permissions are requested for handling images from the clipboard.

- **Extension Storage:**  
  Use `chrome.storage.sync` or `localStorage` to store the API keys and any other user preferences.

---

### Example Structure of Files:

1. `manifest.json`:  
   Contains the extension metadata, permissions (like clipboard and storage), and references to the HTML, JS, and CSS files.

2. `popup.html`:  
   The main interface for the extension with the image upload, buttons, text area, etc.

3. `popup.js`:  
   Contains the logic for handling image uploads, pasting from clipboard, interacting with the OCR and Vision APIs, and displaying the output.

4. `options.html`:  
   The settings page where users input and save their API keys.

5. `options.js`:  
   Handles saving and retrieving the API keys from `localStorage` or `chrome.storage.sync`.

---

This prompt provides a full description of the Chrome extension you want to create. If you'd like more detail on any specific part, feel free to ask!