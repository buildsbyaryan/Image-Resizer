const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const widthInput = document.getElementById('widthInput');
const heightInput = document.getElementById('heightInput');
const applyBtn = document.getElementById('applyBtn');
const downloadLink = document.getElementById('downloadLink');

let originalImage = null;

// Show preview
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    originalImage = new Image();
    originalImage.src = event.target.result;
    preview.src = originalImage.src;
  };
  reader.readAsDataURL(file);
});

// Apply resize
applyBtn.addEventListener('click', () => {
  if (!originalImage) {
    alert("Please upload an image first!");
    return;
  }

  const width = parseInt(widthInput.value) || originalImage.width;
  const height = parseInt(heightInput.value) || originalImage.height;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(originalImage, 0, 0, width, height);

  const resizedDataUrl = canvas.toDataURL("image/png");
  preview.src = resizedDataUrl;

  downloadLink.href = resizedDataUrl;
  downloadLink.style.display = 'block';
});
