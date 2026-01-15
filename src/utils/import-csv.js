import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse";

const inputPath = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : path.resolve(process.cwd(), "tasks.csv");

const parser = fs.createReadStream(inputPath).pipe(
  parse({
    columns: true,
    trim: true,
    skip_empty_lines: true,
  })
);

for await (const record of parser) {
  const payload = {
    title: record.title,
    description: record.description,
  };

  await fetch("http://localhost:3333/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
