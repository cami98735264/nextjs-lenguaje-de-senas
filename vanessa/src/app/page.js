"use client";
import Image from 'next/image'
import axios, {isCancel, AxiosError} from 'axios';
import { useEffect, useState } from 'react';
import { parseGIF, decompressFrames } from 'gifuct-js';
const wait = time => new Promise((resolve) => setTimeout(resolve, time));

export default function Home() {
  const [senas, setSenas] = useState([]);
  function eliminarAcentos(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  useEffect(() => {
    axios.get('http://localhost:5001/api/utils/senas_files')
    .then(res => {
      setSenas(res.data.message);
    })
    .catch(err => {
      console.log(err);
    })
  }, []);
  const onSubmit = async (event) => {
    event.preventDefault();
    console.log(senas);
    try {
    const req = await axios.get('http://localhost:5001/api/translate', {
      params: {
        text: event.target[0].value
      }
    })
    window.alert(req.data.message.map(x => x.value).join(" "));
    const img = document.getElementById('img');
    for (const wordArray of req.data.message) {
      if(wordArray.type === "word") {
        const sena_word = senas.find(x => {
          const arrayValue = x.value.replace(/\([^)]*\)/g, '').replace(".gif", "").trim().split(",");
          console.log(arrayValue);
          const value = arrayValue.includes(wordArray.value) || arrayValue.includes(eliminarAcentos(wordArray.value));
          console.log(value);
          return value;
        })
        console.log(sena_word);
        if(!sena_word) {
          for(const letter of wordArray.value) {
            img.src = `https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/${letter}.gif`;
            await wait(1000);
          }
        } else {
          img.src = `/${sena_word.value}`;
          await wait(sena_word.durationInMs); // Lo mismo aquí, la promesa wait se detiene y espera a que se cumpla el tiempo de la expresión. Para así mismo continuar iterando entre las palabras encontradas.
        }
      }
      else if(wordArray.type === "expression") {
        const found_expression = senas.find(x => {
          const arrayValue = x.value.replace(/\([^)]*\)/g, '').replace(".gif", "").trim().split(",");
          const value = arrayValue.includes(wordArray.value) || arrayValue.includes(eliminarAcentos(wordArray.value));
          return value;
        })
        if(!found_expression) {
          for(const letter of wordArray.value) {
            const response = await fetch(`https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/${letter}.gif`);
            if(response.status === 404) {
              img.src = `/default-img.png`;
            } else {
            img.src = `https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/${letter}.gif`;
            await wait(found_expression.durationInMs); // Esperará ms segundos de la expresión con base a la propiedad y su valor.
            }
          }
        } else {
          img.src = `/${found_expression.value}`;
          await wait(1000);
        }
      }
      else if(wordArray.type === "punctuation") {
        await wait(1000);
      }
    }
  } catch(err) {
    if(isCancel(err)) {
      window.alert("Request canceled");
    } else {
      console.log(err);
      window.alert("An error ocurred");
    }
  }
  };
  
  return (
    <div>
      <form className='formulario-senas' onSubmit={onSubmit}>
        <div>
          <img src='default-img.png' id='img'></img>
        </div>
        <div className="mb-6">
  <label
    htmlFor="default-input"
    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
  >
    Default input
  </label>
  <input
    type="text"
    id="senas-input" required
    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  />
</div>

      </form>
    </div>
  )
}
