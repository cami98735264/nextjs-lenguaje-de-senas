import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const path = require('path');

import fs from 'fs';

function tokenizarTextoConExpresiones(texto, expresiones, dtt_check) {
    const expresionesEscapadas = expresiones.map(expresion =>
      expresion.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
    );
    
    // Modifica la expresión regular para incluir signos de puntuación que indican una pausa breve
    const signosDePuntuacion = "[.,;!?]";
    const expresion = new RegExp(
      `(\\b(?:${expresionesEscapadas.join('|')})\\b)|\\s+|(${signosDePuntuacion})`,
      'g'
    );
  
    const tokens = texto.split(expresion).filter(Boolean);
    const resultado = [];
  
    for (const token of tokens) {
      if (expresiones.includes(token)) {
        resultado.push({ type: "expression", value: dtt_check ? '"' + "DTT: " + token.toLowerCase().split(" ").join("_") + '"' : token.toLowerCase().split(" ").join("_") });
      } else if (signosDePuntuacion.includes(token)) {
        resultado.push({ type: "punctuation", value: token });
      } else {
        resultado.push({ type: "word", value: token.toLowerCase() });
      }
    }
  
    return resultado;
  }
  const obtenerArchivos = (directorio, callback) => {
    const archivosGif = [];
  
    fs.readdir(directorio, (err, archivos) => {
      if (err) {
        callback(err, null);
        return;
      }
  
      archivos.forEach((archivo) => {
        const extension = path.extname(archivo);
        if (extension === '.gif') {
          archivosGif.push(archivo.toLowerCase());
        }
      });
  
      callback(null, archivosGif);
    });
  }

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

function getImageAsUint8Array(imagePath) {
  const imageBuffer = fs.readFileSync(imagePath);
  const uint8Array = new Uint8Array(imageBuffer);
  return uint8Array;
}

export { tokenizarTextoConExpresiones, obtenerArchivos, isGifAnimated, getImageAsUint8Array }