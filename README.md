# Image Insight

Image Insight is a Chrome extension that allows users to extract text from images and generate detailed descriptions using OCRSpace service and Pixtral 12B model from Mistral.

## Features

- **Image Upload**: Easily upload images through file selection or drag-and-drop.
- **Clipboard Paste**: Quickly paste images directly from your clipboard.
- **Text Extraction**: Extract text from images using OCR technology.
- **Image Description**: Generate detailed descriptions of images using AI.
- **Dark Mode**: Toggle between light and dark themes for comfortable viewing.
- **Download & Copy**: Save extracted text or copy it to your clipboard with ease.
- **API Integration**: Utilizes OCRSpace for text extraction and Mistral AI for image description.

## Installation

1. Clone this repository or download the ZIP file.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory containing the extension files.

## Usage

1. Click on the Image Insight icon in your Chrome toolbar.
2. Upload an image using the "Upload Image" button or paste from clipboard.
3. Click "Extract" to extract text from the image or "Describe" to generate a description.
4. View the results in the text area below.
5. Use the "Download" or "Copy" buttons to save or copy the output.

## Configuration

Before using the extension, you need to set up your API keys:

1. Click the "Settings" button in the extension popup.
2. Enter your OCRSpace API key and Mistral API key in the respective fields.
   a) OCRSpace API = https://ocr.space/OCRAPI
   b) Mistral API = https://console.mistral.ai/
4. Click "Save" for each API key.

## Development

The extension is built using HTML, CSS (with Tailwind), and JavaScript. Key files include:

- `popup.html`: Main extension interface
- `popup.js`: Core functionality for the extension
- `options.js`: Handles settings and API key management
- `styles.css`: Custom styles on top of Tailwind CSS

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgements

- OCRSpace for text extraction API
- Mistral AI for image description API
- Tailwind CSS for styling
