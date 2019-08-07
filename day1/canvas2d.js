const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

ctx.fillRect(0, 0, 100, 50);
function fillRect(top, left, width, height) {
  const pixelStore = new Uint8ClampedArray(canvas.width * canvas.height * 4);
  for (let i = 0; i < pixelStore.length; i += 4) {
    pixelStore[i] = 0; // r
    pixelStore[i + 1] = 0; // g
    pixelStore[i + 2] = 200; // b
    pixelStore[i + 3] = 255; // alpha
  }
  const imageData = new ImageData(pixelStore, canvas.width, canvas.height);
  ctx.putImageData(imageData, 0, 0);
}

fillRect();
