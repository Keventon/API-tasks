# API Tasks

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![ECMAScript Modules](https://img.shields.io/badge/ESM-Modules-2E7EEA)](https://nodejs.org/api/esm.html)
[![Status](https://img.shields.io/badge/status-active-2ea44f)](#)

Uma API simples de tarefas (tasks) usando Node.js puro e persistência em arquivo JSON.
Projeto focado em rotas HTTP, manipulação de dados e importação via CSV.

---

## Destaques

- CRUD completo de tasks
- Importação de CSV com `csv-parse` via script dedicado
- Suporte a `POST /tasks` com `application/json` ou `text/csv`
- Rota `PATCH` para completar tarefa com timestamp
- Persistência local em `db.json`

## Stack

- Node.js (ESM)
- HTTP nativo
- `csv-parse`

---

## Requisitos

- Node.js 18+
- npm (ou pnpm/yarn)

## Instalação

```bash
npm install
```

## Executar

```bash
npm run dev
```

Servidor: `http://localhost:3333`

---

## Scripts

```bash
npm run dev        # inicia o servidor
npm run import:csv # importa tasks do CSV (linha a linha)
```

---

## Rotas

### Listar tasks

`GET /tasks`

Query opcional:

- `search`: busca em `title` e `description`

### Criar task (JSON)

`POST /tasks`

Headers:

- `Content-Type: application/json`

Body:

```json
{
  "title": "Minha task",
  "description": "Descrição da task"
}
```

### Criar tasks (CSV)

`POST /tasks`

Headers:

- `Content-Type: text/csv`

Body (exemplo):

```csv
title,description
Task 01,Descrição da Task 01
Task 02,Descrição da Task 02
```

### Atualizar task

`PUT /tasks/:id`

Body (exemplo):

```json
{
  "title": "Novo título",
  "description": "Nova descrição"
}
```

### Concluir task

`PATCH /tasks/:id/complete`

Body:

```json
{
  "is_completed": true
}
```

### Remover task

`DELETE /tasks/:id`

### Remover todas as tasks

`DELETE /tasks`

---

## Importação via CSV (script)

Arquivo padrão: `tasks.csv` na raiz do projeto.

```bash
npm run import:csv
```

Ou passando um caminho:

```bash
node src/utils/import-csv.js caminho/arquivo.csv
```

Formato recomendado:

```csv
title,description
Task 01,Descrição da Task 01
Task 02,Descrição da Task 02
Task 03,Descrição da Task 03
```

---

## Estrutura

```text
.
|-- src
|   |-- middlewares
|   |   `-- json.js
|   |-- utils
|   |   |-- build-route-path.js
|   |   |-- extract-query-params.js
|   |   `-- import-csv.js
|   |-- database.js
|   |-- routes.js
|   `-- server.js
|-- db.json
|-- tasks.csv
|-- package.json
`-- README.md
```

---

## Exemplos rápidos (curl)

Criar task:

```bash
curl -X POST http://localhost:3333/tasks \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Task X\",\"description\":\"Descrição X\"}"
```

Criar tasks via CSV:

```bash
curl -X POST http://localhost:3333/tasks \
  -H "Content-Type: text/csv" \
  --data-binary "@tasks.csv"
```

Listar tasks:

```bash
curl http://localhost:3333/tasks
```

Completar task:

```bash
curl -X PATCH http://localhost:3333/tasks/ID_AQUI/complete \
  -H "Content-Type: application/json" \
  -d "{\"is_completed\": true}"
```

---

## Observações

- `completed_at` recebe timestamp ISO quando `is_completed` for `true`
- `updated_at` é atualizado em `PUT` e `PATCH`
- Dados persistem em `db.json`

---
