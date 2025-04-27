import fs from 'fs';

function getImageAsUint8Array(imagePath) {
  const imageBuffer = fs.readFileSync(imagePath);
  const uint8Array = new Uint8Array(imageBuffer);
  return uint8Array;
}

const imageUint8Array = getImageAsUint8Array('../vanessa/public/alto-final.gif');

console.log(isGifAnimated(imageUint8Array))

/** @param {Uint8Array} uint8 */
function isGifAnimated (uint8) {
  let duration = 0
  for (let i = 0, len = uint8.length; i < len; i++) {
    if (uint8[i] == 0x21
      && uint8[i + 1] == 0xF9
      && uint8[i + 2] == 0x04
      && uint8[i + 7] == 0x00) 
    {
      const delay = (uint8[i + 5] << 8) | (uint8[i + 4] & 0xFF)
      duration += delay < 2 ? 10 : delay
    }
  }
  return duration / 100
}