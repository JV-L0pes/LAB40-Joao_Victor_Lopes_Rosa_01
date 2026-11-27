// Testes automatizados – Feature 20 (Remoção de duplicados).
// Execute com: npm test  (ou node --test test/feature20.test.js)
const test = require("node:test");
const assert = require("node:assert/strict");
const feature = require("../src/features/feature20");

test("remove repetidos preservando a ordem da primeira ocorrência", () => {
  assert.deepEqual(feature.execute({ valores: [1, 2, 2, 3, 1] }).unicos, [1, 2, 3]);
});

test("mantém a ordem original em repetidos separados", () => {
  assert.deepEqual(feature.execute({ valores: [3, 1, 3, 2, 1] }).unicos, [3, 1, 2]);
});

test("colapsa repetidos consecutivos em um único valor", () => {
  assert.deepEqual(feature.execute({ valores: [5, 5, 5] }).unicos, [5]);
});

test("lista sem repetidos permanece igual", () => {
  assert.deepEqual(feature.execute({ valores: [4, 2, 9] }).unicos, [4, 2, 9]);
});

test("aceita lista vazia e lista com um elemento", () => {
  assert.deepEqual(feature.execute({ valores: [] }).unicos, []);
  assert.deepEqual(feature.execute({ valores: [7] }).unicos, [7]);
});

test("não converte tipos implicitamente em valores mistos simples", () => {
  assert.deepEqual(feature.execute({ valores: [1, "1", 1, "1"] }).unicos, [1, "1"]);
  assert.deepEqual(feature.execute({ valores: [2.5, 2.5, 0, -0] }).unicos, [2.5, 0]);
});

test("distingue strings por caixa e acentuação", () => {
  assert.deepEqual(feature.execute({ valores: ["Ação", "acao", "Ação"] }).unicos, ["Ação", "acao"]);
});

test("não modifica o array de entrada e devolve um novo array", () => {
  const entrada = [1, 2, 2, 3, 1];
  const { unicos } = feature.execute({ valores: entrada });
  assert.deepEqual(entrada, [1, 2, 2, 3, 1]);
  assert.notEqual(unicos, entrada);
});

test("retorna objeto serializável em JSON com a propriedade unicos", () => {
  const resultado = feature.execute({ valores: [1, 1, 2] });
  assert.deepEqual(Object.keys(resultado), ["unicos"]);
  assert.deepEqual(JSON.parse(JSON.stringify(resultado)), { unicos: [1, 2] });
});

test("rejeita entrada que não seja array com mensagem clara", () => {
  for (const input of [{ valores: "1,2" }, { valores: 123 }, { valores: null }, { valores: {} }, {}]) {
    assert.throws(() => feature.execute(input), { name: "Error", message: /array/i });
  }
  assert.throws(() => feature.execute(), { name: "Error", message: /array/i });
});

test("rejeita elementos fora do escopo: arrays, objetos, booleanos e não finitos", () => {
  for (const valores of [[[1]], [{ a: 1 }], [true], [null], [NaN], [Infinity], [1, undefined]]) {
    assert.throws(() => feature.execute({ valores }), { name: "Error", message: /número finito ou uma string simples/ });
  }
});

test("preserva o contrato do módulo e marca implemented=true", () => {
  assert.equal(feature.id, 20);
  assert.equal(feature.name, "Remoção de duplicados");
  assert.equal(feature.description, "Remove valores repetidos preservando a primeira ocorrência.");
  assert.equal(feature.implemented, true);
});
