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
    const expresiones = ["alto final", "golb", "te amo", "con gusto"];
  
    const texto = "De inmediato ellos responder, 'Con gusto'";

    const tokenizedText = tokenizarTextoConExpresiones(texto.toLowerCase().replace(/DTT:|["']/g, ''), expresiones, false)

    console.log(tokenizedText);