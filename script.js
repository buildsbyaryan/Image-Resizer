const upload = document.getElementById('upload');
const preview = document.getElementById('preview');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const rotationInput = document.getElementById('rotation');
const flipH = document.getElementById('flipH');
const flipV = document.getElementById('flipV');
const maintainRatio = document.getElementById('maintainRatio');
const grayscale = document.getElementById('grayscale');
const brightness = document.getElementById('brightness');
const contrast = document.getElementById('contrast');
const applyBtn = document.getElementById('applyBtn');
const downloadLink = document.getElementById('downloadLink');

let originalWidth, originalHeight;

// Upload Image
upload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    preview.src = reader.result;
    preview.style.display = 'block';

    preview.onload = () => {
      originalWidth = preview.naturalWidth;
      originalHeight = preview.naturalHeight;
      widthInput.value = originalWidth;
      heightInput.value = originalHeight;
    };
  };
  reader.readAsDataURL(file);
});

// Maintain Aspect Ratio
widthInput.addEventListener('input', () => {
  if (maintainRatio.checked) {
    heightInput.value = Math.round((widthInput.value / originalWidth) * originalHeight);
  }
});
heightInput.addEventListener('input', () => {
  if (maintainRatio.checked) {
    widthInput.value = Math.round((heightInput.value / originalHeight) * originalWidth);
  }
});

// Apply Changes
applyBtn.addEventListener('click', () => {
  let w = widthInput.value;
  let h = heightInput.value;
  let rotation = parseInt(rotationInput.value);
  let scaleX = flipH.checked ? -1 : 1;
  let scaleY = flipV.checked ? -1 : 1;

  // Resize & transform
  preview.style.width = w + 'px';
  preview.style.height = h + 'px';
  preview.style.transform = `rotate(${rotation}deg) scaleX(${scaleX}) scaleY(${scaleY})`;
  preview.style.filter = `
    ${grayscale.checked ? 'grayscale(100%)' : ''}
    brightness(${brightness.value}%)
    contrast(${contrast.value}%)
  `;

  // Generate downloadable image via temporary canvas
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = w;
  tempCanvas.height = h;
  const ctx = tempCanvas.getContext('2d');

  const imgTemp = new Image();
  imgTemp.src = preview.src;
  imgTemp.onload = () => {
    ctx.save();
    ctx.translate(w/2, h/2);
    ctx.rotate(rotation * Math.PI/180);
    ctx.scale(scaleX, scaleY);
    ctx.filter = preview.style.filter;
    ctx.drawImage(imgTemp, -w/2, -h/2, w, h);
    ctx.restore();

    downloadLink.href = tempCanvas.toDataURL('image/png');
    downloadLink.style.display = 'block';
  };
});
