import fs from "fs";
import express from "express";
import cors from "cors";
import 'dotenv/config';
import { tokenizarTextoConExpresiones, obtenerArchivos, isGifAnimated, getImageAsUint8Array } from './util-functions.js';
import OpenAI from "openai";
const app = express();
const lds_input = fs.readFileSync("lds_input.txt", "utf8");
let returnedArray = [];

  const directorio = '../vanessa/public'; // Reemplaza con la ruta de tu directorio


    const expresiones = ["alto final", "golb", "te amo", "con gusto", "hasta luego", "facultad de economía, administración y contaduría", "manejar carro"];
  
  

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
          console.log(plainText.message.toLowerCase().replace(/dtt:|["']/g, ''))
          res.status(200).send({
              message: tokenizarTextoConExpresiones(plainText.message.toLowerCase().replace(/dtt:|["']/g, ''), expresiones, false),
              success: true
          })
        }
    } catch(err) {
        console.log(err);
        return res.status(500).send({success: false, message: err.message});
    }
});

app.get("/api/utils/senas_files", (req, res) => { 
  // Check if returnedArray is empty, if it is, return 404, else return the array
  if(returnedArray.length === 0) {
    return res.status(404).send({success: false, message: "No files found"});
  } else {
    return res.status(200).send({success: true, message: returnedArray});
  }
})


app.listen(5001, () => {
    console.log("Server running on port 5001");
    obtenerArchivos(directorio, (err, archivos) => {
      if (err) {
        console.log(err);
      } else {
        for(const arch of archivos) {
          let uint8array = getImageAsUint8Array("../vanessa/public/" + arch);
          let durationInMs = isGifAnimated(uint8array);
          returnedArray.push({value: arch, durationInMs: durationInMs * 1000 });
  
        }
      }
    });
})