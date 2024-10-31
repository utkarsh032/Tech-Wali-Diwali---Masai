const bgColorInput = document.getElementById('bgColor');
const fontColorInput = document.getElementById('fontColor');
const fontFamilySelect = document.getElementById('fontSelect');
const fontSizeSelect = document.getElementById('fontSize');
const textInput = document.getElementById('textInput');
const uploadImageInput = document.getElementById('uploadImage');
const downloadBtn = document.getElementById('downloadBtn');
const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');
const resetBtn = document.getElementById('resetBtn');
const imageBoard = document.getElementById('imageBoard');
const galleryImages = document.querySelectorAll('.gallery-image');
const galleryContainer = document.getElementById('galleryContainer');

let undoStack = [];
let redoStack = [];

// Function to save the current state
function saveState() {
  undoStack.push({
    backgroundColor: imageBoard.style.backgroundColor,
    image: imageBoard.innerHTML,
    text: Array.from(imageBoard.querySelectorAll('.draggable-text')).map(textElem => ({
      content: textElem.textContent,
      color: textElem.style.color,
      fontSize: textElem.style.fontSize,
      fontFamily: textElem.style.fontFamily,
      left: textElem.style.left,
      top: textElem.style.top,
    })),
  });
  redoStack = [];
}

// Change background color
bgColorInput.addEventListener('input', function () {
  saveState();
  imageBoard.style.backgroundColor = bgColorInput.value;
});

// Handle image selection from gallery
galleryImages.forEach(image => {
  image.addEventListener('click', function () {
    saveState();
    imageBoard.style.backgroundColor = 'transparent';
    imageBoard.innerHTML = '';
    const newImage = document.createElement('img');
    newImage.src = this.src;
    newImage.style.width = '100%';
    imageBoard.appendChild(newImage);
  });
});

// Upload image
uploadImageInput.addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      saveState();
      imageBoard.style.backgroundColor = 'transparent';
      imageBoard.innerHTML = '';
      const newImage = document.createElement('img');
      newImage.src = e.target.result;
      newImage.style.width = '100%';
      imageBoard.appendChild(newImage);

      // Add the uploaded image to the gallery
      const galleryImage = document.createElement('img');
      galleryImage.src = e.target.result;
      galleryImage.classList.add('gallery-image'); // Use the same class for gallery images
      galleryImage.style.cursor = 'pointer';
      galleryImage.addEventListener('click', function () {
        saveState();
        imageBoard.innerHTML = '';
        const newImgInBoard = document.createElement('img');
        newImgInBoard.src = this.src;
        newImgInBoard.style.width = '100%';
        imageBoard.appendChild(newImgInBoard);
      });
      galleryContainer.appendChild(galleryImage); // Append to gallery
    };
    reader.readAsDataURL(file);
  }
});

// Add text to image board
textInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    const textValue = textInput.value;
    const textColor = fontColorInput.value;
    const fontFamily = fontFamilySelect.value;
    const fontSize = fontSizeSelect.value;

    if (textValue) {
      saveState();
      const newText = document.createElement('div');
      newText.textContent = textValue;
      newText.className = 'draggable-text';
      newText.style.color = textColor;
      newText.style.fontFamily = fontFamily;
      newText.style.fontSize = fontSize;
      newText.style.position = 'absolute';
      newText.style.left = '50px';
      newText.style.top = '50px';
      newText.setAttribute('contenteditable', 'true');
      newText.addEventListener('mousedown', initiateDrag);
      imageBoard.appendChild(newText);
      textInput.value = '';
    }
  }
});

// Drag functionality
function initiateDrag(e) {
  const textElement = e.target;
  let offsetX = e.clientX - textElement.getBoundingClientRect().left;
  let offsetY = e.clientY - textElement.getBoundingClientRect().top;

  function dragMove(e) {
    textElement.style.left = e.clientX - offsetX + 'px';
    textElement.style.top = e.clientY - offsetY + 'px';
  }

  function dragEnd() {
    document.removeEventListener('mousemove', dragMove);
    document.removeEventListener('mouseup', dragEnd);
  }

  document.addEventListener('mousemove', dragMove);
  document.addEventListener('mouseup', dragEnd);
}

// Undo action
undoBtn.addEventListener('click', function () {
  if (undoStack.length > 0) {
    const lastState = undoStack.pop();
    redoStack.push({
      backgroundColor: imageBoard.style.backgroundColor,
      image: imageBoard.innerHTML,
      text: Array.from(imageBoard.querySelectorAll('.draggable-text')).map(textElem => ({
        content: textElem.textContent,
        color: textElem.style.color,
        fontSize: textElem.style.fontSize,
        fontFamily: textElem.style.fontFamily,
        left: textElem.style.left,
        top: textElem.style.top,
      })),
    });

    imageBoard.style.backgroundColor = lastState.backgroundColor;
    imageBoard.innerHTML = lastState.image;

    lastState.text.forEach(textData => {
      const newText = document.createElement('div');
      newText.textContent = textData.content;
      newText.className = 'draggable-text';
      newText.style.color = textData.color;
      newText.style.fontSize = textData.fontSize;
      newText.style.fontFamily = textData.fontFamily;
      newText.style.position = 'absolute';
      newText.style.left = textData.left;
      newText.style.top = textData.top;
      newText.setAttribute('contenteditable', 'true');
      newText.addEventListener('mousedown', initiateDrag);
      imageBoard.appendChild(newText);
    });
  }
});

// Redo action
redoBtn.addEventListener('click', function () {
  if (redoStack.length > 0) {
    const redoState = redoStack.pop();
    undoStack.push({
      backgroundColor: imageBoard.style.backgroundColor,
      image: imageBoard.innerHTML,
      text: Array.from(imageBoard.querySelectorAll('.draggable-text')).map(textElem => ({
        content: textElem.textContent,
        color: textElem.style.color,
        fontSize: textElem.style.fontSize,
        fontFamily: textElem.style.fontFamily,
        left: textElem.style.left,
        top: textElem.style.top,
      })),
    });

    imageBoard.style.backgroundColor = redoState.backgroundColor;
    imageBoard.innerHTML = redoState.image;

    redoState.text.forEach(textData => {
      const newText = document.createElement('div');
      newText.textContent = textData.content;
      newText.className = 'draggable-text';
      newText.style.color = textData.color;
      newText.style.fontSize = textData.fontSize;
      newText.style.fontFamily = textData.fontFamily;
      newText.style.position = 'absolute';
      newText.style.left = textData.left;
      newText.style.top = textData.top;
      newText.setAttribute('contenteditable', 'true');
      newText.addEventListener('mousedown', initiateDrag);
      imageBoard.appendChild(newText);
    });
  }
});

// Reset action
resetBtn.addEventListener('click', function () {
  imageBoard.style.backgroundColor = 'transparent';
  imageBoard.innerHTML = ''; // Clear image board
});

// Download action
downloadBtn.addEventListener('click', function () {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const boardRect = imageBoard.getBoundingClientRect();

  // Set canvas dimensions
  canvas.width = boardRect.width;
  canvas.height = boardRect.height;

  // Draw background color
  context.fillStyle = imageBoard.style.backgroundColor || '#fff';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Draw images in the image board
  const images = imageBoard.getElementsByTagName('img');
  for (let img of images) {
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
  }

  // Draw text in the image board
  const texts = imageBoard.getElementsByClassName('draggable-text');
  for (let textElem of texts) {
    context.font = `${textElem.style.fontSize} ${textElem.style.fontFamily}`;
    context.fillStyle = textElem.style.color;
    context.fillText(
      textElem.textContent,
      parseFloat(textElem.style.left),
      parseFloat(textElem.style.top) + parseFloat(textElem.style.fontSize) // Adjust for text height
    );
  }

  // Create download link
  canvas.toBlob(function (blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'imageBoard.png'; // Set the file name
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, 'image/png');
});

// Upload image
uploadImageInput.addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      saveState();
      const newImage = document.createElement('img');
      newImage.src = e.target.result;
      newImage.style.width = '100px';
      newImage.style.borderRadius = '50%';
      newImage.style.position = 'absolute';
      newImage.style.right = '10px';
      newImage.style.bottom = '10px';
      newImage.style.objectFit = 'cover';
      imageBoard.appendChild(newImage);

      // Add the uploaded image to the gallery (optional)
      const galleryImage = document.createElement('img');
      galleryImage.src = e.target.result;
      galleryImage.classList.add('gallery-image');
      galleryImage.style.cursor = 'pointer';
      galleryImage.addEventListener('click', function () {
        saveState();
        imageBoard.innerHTML = '';
        const newImgInBoard = document.createElement('img');
        newImgInBoard.src = this.src;
        newImgInBoard.style.width = '100%';
        imageBoard.appendChild(newImgInBoard);
      });
      galleryContainer.appendChild(galleryImage);
    };
    reader.readAsDataURL(file);
  }
});

