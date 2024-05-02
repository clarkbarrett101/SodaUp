const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;
let modifier = 1;
function colorStart() {
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const r = 125 + (125 * x) / canvas.width;
      const g = -50 + y / canvas.height;
      const b = (175 * y) / canvas.height;
      imageData = replacePixel(imageData, x, y, r, g, b);
    }
  }
  console.log(imageData);
  ctx.putImageData(imageData, 0, 0);
}
colorStart();
colorWaves();
function colorWaves() {
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      let [r, g, b] = getPixel(imageData, x, y);
      let [l, u, v] = RGB2LUV(r, g, b);
      let newRGB = LUV2RGB([
        Math.sin(modifier / 2) + 1 + (y - canvas.height) / canvas.height,
        (Math.sin(modifier) * 255 * (y - canvas.height)) / canvas.height,
        (Math.cos(modifier) * 255 * (y - canvas.height)) / canvas.height,
      ]);
      replacePixel(imageData, x, y, newRGB[0], newRGB[1], newRGB[2]);
    }
  }
  ctx.putImageData(imageData, 0, 0);
  modifier += 0.01;
  requestAnimationFrame(colorWaves);
}
function RGB2LUV(r, g, b) {
  let l = 0.299 * r + 0.587 * g + 0.114 * b;
  let u = -0.14713 * r - 0.28886 * g + 0.436 * b;
  let v = 0.615 * r - 0.51499 * g - 0.10001 * b;
  l = Math.round(l * 1000) / 1000;
  u = Math.round(u * 1000) / 1000;
  v = Math.round(v * 1000) / 1000;
  return [l, u, v];
}
function LUV2RGB(luv) {
  let l = luv[0];
  let u = luv[1];
  let v = luv[2];
  let r = l + 1.13983 * v;
  let g = l - 0.39465 * u - 0.5806 * v;
  let b = l + 2.03211 * u;
  r = Math.round(r * 1000) / 1000;
  g = Math.round(g * 1000) / 1000;
  b = Math.round(b * 1000) / 1000;
  return [r, g, b];
}
function replacePixel(imageData, x, y, r, g, b) {
  const index = (y * canvas.width + x) * 4;
  imageData.data[index] = r;
  imageData.data[index + 1] = g;
  imageData.data[index + 2] = b;
  imageData.data[index + 3] = 255;
  return imageData;
}
function getPixel(imageData, x, y) {
  const index = (y * canvas.width + x) * 4;
  return [
    imageData.data[index],
    imageData.data[index + 1],
    imageData.data[index + 2],
  ];
}
