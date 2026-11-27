# LAB40 – Remoção de duplicados (Feature 20)

Aplicação-base do LAB40 para a avaliação prática de Integração e Entrega Contínua (CI/CD).
Neste repositório foi implementada **somente** a funcionalidade atribuída ao enunciado 20:
`src/features/feature20.js` – **Remoção de duplicados**.

## Requisitos
- Node.js 20 ou superior (validado com Node.js 24).
- npm.
- Docker (opcional, apenas para build local da imagem).

## Instalação e execução
```bash
npm install
npm start
```
Acesse http://localhost:3000. Para desenvolvimento com reinicialização automática: `npm run dev`.

## Endpoints
- `GET /health`: verificação de disponibilidade.
- `GET /api/features`: lista as 40 funcionalidades e o estado `implemented`.
- `POST /api/features/:id`: executa uma funcionalidade, recebendo JSON no corpo.

Executando a funcionalidade 20:
```bash
curl -X POST http://localhost:3000/api/features/20 \
  -H "Content-Type: application/json" \
  -d '{"valores":[1,2,2,3,1]}'
```
Resposta:
```json
{"id":20,"name":"Remoção de duplicados","result":{"unicos":[1,2,3]}}
```
Entrada inválida (`{"valores":"1,2"}`) responde HTTP **400** com mensagem clara, sem derrubar o servidor.

## Funcionalidade implementada (enunciado 20)
- Entrada: `{ valores: [...] }`; saída: `{ unicos: [...] }`.
- Remove valores repetidos preservando a **primeira ocorrência** e a ordem original.
- Aceita números finitos e strings simples, **sem conversão implícita de tipos** (`1` e `"1"` são distintos).
- Não muta o array de entrada; devolve um novo array.
- Lança `Error` com mensagem clara quando `valores` não é array ou quando um elemento está fora do escopo.
- `implemented` passou para `true` somente após implementação e validação.

### Decisões técnicas documentadas
1. **Deduplicação:** `Set` preserva a ordem de inserção e a primeira ocorrência, com custo O(n).
2. **Escopo de elementos:** arrays, objetos, booleanos, `null`, `NaN` e `Infinity` são **rejeitados** com `Error`.
   O enunciado declara arrays/objetos internos fora do escopo; rejeitar evita deduplicar por referência e devolver
   resultados silenciosamente incorretos.
3. **`-0` e `0`:** tratados como equivalentes (semântica *SameValueZero* do `Set`), permanecendo a primeira ocorrência.
4. **Arredondamento monetário:** não se aplica (a funcionalidade não produz valores monetários ou decimais calculados).

## Testes automatizados
```bash
npm test
```
Usa o test runner nativo do Node (`node:test`), sem dependências externas: `test/feature20.test.js`.
Cobertura: caso de referência, repetidos consecutivos, repetidos separados, lista sem duplicados, lista vazia,
lista de um elemento, valores mistos sem conversão de tipo, strings com acento/caixa, imutabilidade da entrada,
contrato/metadados do módulo e rejeição de entradas inválidas (não-array e elementos fora do escopo).

### Smoke test HTTP
```bash
npm run test:smoke
```
Sobe a aplicação em porta efêmera e valida `GET /health`, `GET /api/features` e `POST /api/features/20`
(caminho válido e inválido).

### Roteiro de testes manuais (5 passos)
1. `npm start` e acessar http://localhost:3000 – a interface deve listar os 40 cartões.
2. Em http://localhost:3000/health, conferir `{"status":"ok","application":"LAB40"}`.
3. Selecionar o cartão **20 · Remoção de duplicados** (JSON `{"valores":[1,2,2,3,1]}`) e clicar em executar –
   saída esperada `"unicos": [1, 2, 3]` com `httpStatus: 200`.
4. Alterar o JSON para `{"valores":"1,2"}` e executar – saída esperada `httpStatus: 400` com mensagem sobre array.
5. Repetir o passo 3 pela API: `curl -X POST http://localhost:3000/api/features/20 -H "Content-Type: application/json" -d '{"valores":[1,2,2,3,1]}'`
   – resposta `result.unicos = [1,2,3]`.

## Qualidade e segurança
```bash
npm run lint    # ESLint 10 (flat config em eslint.config.js)
npm run audit   # npm audit --audit-level=high
```
Resultado local: lint sem erros e `npm audit` com **0 vulnerabilidades** (81 pacotes auditados).

## CI/CD (GitHub Actions)
- `.github/workflows/ci.yml` – acionado em **push** e **pull_request**: `npm ci`, ESLint, `npm test`,
  `npm audit`, smoke test e, em job separado, build da imagem Docker, execução do container com validação
  de `/health` e do endpoint da feature 20, publicando a imagem `.tar` como artefato.
- `.github/workflows/cd.yml` – acionado em **push na main** (e manualmente): reexecuta os testes como portão,
  constrói a imagem `lab40:feature20-<sha>`, valida em container efêmero, exporta `.tar` e gera
  `deployment-record.txt` com repositório, referência, commit, tag, execução e digest da imagem como artefato
  `lab40-delivery-record` (CD simulado).

## Docker
```bash
docker build --pull -t lab40:feature20 .
docker run -d --name lab40-container -p 3000:3000 lab40:feature20
curl --fail http://localhost:3000/health
curl --fail -X POST http://localhost:3000/api/features/20 -H "Content-Type: application/json" -d '{"valores":[1,2,2,3,1]}'
docker stop lab40-container && docker rm lab40-container
```

## Estrutura
```text
lab40/
├── .github/workflows/   ci.yml, cd.yml
├── public/              interface web
├── scripts/smoke.js     smoke test HTTP
├── src/
│   ├── app.js
│   ├── server.js
│   └── features/        feature01..feature40 (somente feature20 alterada)
├── test/feature20.test.js
├── Dockerfile
├── eslint.config.js
├── package.json
└── package-lock.json
```

## Contrato de cada módulo
Cada arquivo `src/features/featureNN.js` exporta `id`, `name`, `description`, `implemented` e `execute(input)`.
Enquanto `implemented` for `false`, a API retorna HTTP 501 para aquele módulo. Os demais 39 módulos permanecem
intocados e pendentes, conforme o escopo individual da atividade.
