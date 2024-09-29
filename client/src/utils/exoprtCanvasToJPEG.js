function exportCanvasToJPEG(canvas) {
  if (!canvas) return;
  const originalBackgroundColor = canvas.backgroundColor;
  canvas.backgroundColor = "white";

  const timestamp = new Date().toISOString().replace(/:/g, "-");
  const filename = `canvas_${timestamp}.jpg`;
  const link = document.createElement("a");

  link.download = filename;
  link.href = canvas.toDataURL({ format: "jpeg", quality: 0.8 });
  canvas.backgroundColor = originalBackgroundColor;

  link.click();
}

export default exportCanvasToJPEG;
