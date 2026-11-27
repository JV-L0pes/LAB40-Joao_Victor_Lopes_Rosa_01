// Funcionalidade 20: Remoção de duplicados.
// Objetivo: Remove valores repetidos preservando a primeira ocorrência.
// Exemplo de entrada: { valores: [1, 2, 2, 3, 1] }
// Saída esperada: { unicos: [1, 2, 3] }

const implemented = true;

// Escopo do enunciado: apenas números finitos e strings simples.
// Arrays e objetos internos são rejeitados para não deduplicar por referência.
function validarElemento(valor, indice) {
  if (typeof valor === "number" && Number.isFinite(valor)) return;
  if (typeof valor === "string") return;
  throw new Error(`valores[${indice}] deve ser um número finito ou uma string simples.`);
}

function execute(input) {
  const { valores } = input || {};
  if (!Array.isArray(valores)) throw new Error("Informe valores como um array.");

  valores.forEach(validarElemento);

  // Set preserva a ordem de inserção e a primeira ocorrência; a cópia evita mutar a entrada.
  return { unicos: [...new Set(valores)] };
}

// Mantém o contrato de integração utilizado pela API central.
module.exports = {
  id: 20,
  name: "Remoção de duplicados",
  description: "Remove valores repetidos preservando a primeira ocorrência.",
  implemented,
  execute
};
