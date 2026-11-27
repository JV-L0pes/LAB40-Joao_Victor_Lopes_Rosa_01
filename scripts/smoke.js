// Smoke test: sobe a aplicação em porta efêmera e valida os endpoints reais.
// Verifica /health, o catálogo /api/features e a execução da feature 20 via HTTP.
const http = require("node:http");
const assert = require("node:assert/strict");
const app = require("../src/app");

async function postJson(base, id, body) {
  const resposta = await fetch(`${base}/api/features/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return { status: resposta.status, corpo: await resposta.json() };
}

async function main() {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;

  try {
    const health = await fetch(`${base}/health`);
    assert.equal(health.status, 200);
    assert.deepEqual(await health.json(), { status: "ok", application: "LAB40" });

    const catalogo = await (await fetch(`${base}/api/features`)).json();
    assert.equal(catalogo.total, 40);
    const alvo = catalogo.items.find((item) => item.id === 20);
    assert.equal(alvo.implemented, true);

    const valido = await postJson(base, 20, { valores: [1, 2, 2, 3, 1] });
    assert.equal(valido.status, 200);
    assert.deepEqual(valido.corpo.result, { unicos: [1, 2, 3] });

    const tipoInvalido = await postJson(base, 20, { valores: "1,2" });
    assert.equal(tipoInvalido.status, 400);
    assert.match(tipoInvalido.corpo.error, /array/i);

    const elementoInvalido = await postJson(base, 20, { valores: [1, [2]] });
    assert.equal(elementoInvalido.status, 400);

    console.log("Smoke OK: /health, /api/features e POST /api/features/20 responderam como esperado.");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

main().catch((error) => {
  console.error(`Smoke FALHOU: ${error.message}`);
  process.exitCode = 1;
});
