import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import fs from "fs";
import express from "express";
import cors from "cors";
import 'dotenv/config';
import OpenAI from "openai";
const path = require('path');
const app = express();
const lds_input = fs.readFileSync("lds_input.txt", "utf8");


// Useful functions (tokenizers)
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
          archivosGif.push(archivo);
        }
      });
  
      callback(null, archivosGif);
    });
  }
  const directorio = '../vanessa/public'; // Reemplaza con la ruta de tu directorio


    const expresiones = ["alto final", "golb", "te amo", "con gusto"];
  
  

// OpenAI API Key
const openai = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"], // defaults to process.env["OPENAI_API_KEY"]
  });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/api/translate", async (req, res) => {
    if(!req.query.text) {
        return res.status(400).send({success: false, message: "No text provided"});
    }
    const text = req.query.text;
    const tokenizedText = tokenizarTextoConExpresiones(text, expresiones, true).map(x => x.value).join(" ");
    try {
        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-16k",
            messages: [{role: "system", content: lds_input}, {role: "assistant", content: '{ "message": "Entendido, a partir de ahora responderé en LSM. Por favor, proporciona la oración que deseas traducir.", "success": true }'}, {role: "user", content: "Sentence to translate: " + tokenizedText }],
            temperature: 0.5
        })
        const plainText = JSON.parse(chatCompletion.choices[0].message.content);
        if(!plainText.success) {
          throw new Error(plainText.errorMessage ? plainText.errorMessage : "Translation couldn't be resolved");
        } else {
          console.log(plainText.message.toLowerCase().replace(/DTT:|["']/g, ''))
          res.status(200).send({
              message: tokenizarTextoConExpresiones(plainText.message.toLowerCase().replace(/DTT:|["']/g, ''), expresiones, false),
              success: true
          })
        }
    } catch(err) {
        console.log(err);
        return res.status(500).send({success: false, message: err.message});
    }
});

app.get("/api/utils/senas_files", (req, res) => { 
  obtenerArchivos(directorio, (err, archivos) => {
    if (err) {
      res.status(501).send({
        message: "A server-side error has ocurred. Please try again later.",
        status: 501
      
      })
    } else {
      res.status(200).send({
        message: archivos,
        status: 200
      })
    }
  });
})


app.listen(5001, () => console.log("Server running on port 5001"))