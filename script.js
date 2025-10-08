const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const widthInput = document.getElementById('widthInput');
const heightInput = document.getElementById('heightInput');
const applyBtn = document.getElementById('applyBtn');
const downloadLink = document.getElementById('downloadLink');

let uploadedFile = null; // Store uploaded file

// Show preview
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  uploadedFile = file; // Save the uploaded file

  const reader = new FileReader();
  reader.onload = (event) => {
    preview.src = event.target.result;
    // Set default width/height
    const img = new Image();
    img.src = event.target.result;
    img.onload = () => {
      widthInput.value = img.width;
      heightInput.value = img.height;
    };
  };
  reader.readAsDataURL(file);
});

// Apply resize via backend
applyBtn.addEventListener('click', async () => {
  if (!uploadedFile) return alert("Please upload an image first!");

  const formData = new FormData();
  formData.append("image", uploadedFile);
  formData.append("width", widthInput.value || uploadedFile.width);
  formData.append("height", heightInput.value || uploadedFile.height);

  try {
    const res = await fetch("https://image-resizer-backend-bm2n.onrender.com/resize", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    if (data.success) {
      preview.src = data.image;         // base64 image
      downloadLink.href = data.image;
      downloadLink.style.display = 'inline-block';
    } else {
      alert("Image processing failed");
    }
  } catch (err) {
    console.error("Error resizing image:", err);
    alert("Server error! Check console for details.");
  }
});
