applyBtn.addEventListener('click', async () => {
  if (!uploadedFile) return alert("Please upload an image first!");

  const formData = new FormData();
  formData.append("image", uploadedFile);
  formData.append("width", widthInput.value || uploadedFile.width);
  formData.append("height", heightInput.value || uploadedFile.height);

  try {
    const res = await fetch("https://image-resizer-backend-bm2n.onrender.com", {
      method: "POST",
      body: formData
    });

    if (!res.ok) throw new Error("Image processing failed");

    // Get image as Blob
    const blob = await res.blob();
    const imageUrl = URL.createObjectURL(blob);

    preview.src = imageUrl;
    downloadLink.href = imageUrl;
    downloadLink.style.display = 'inline-block';
  } catch (err) {
    console.error("Error resizing image:", err);
    alert("Server error! Check console for details.");
  }
});
