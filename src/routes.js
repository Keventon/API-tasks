import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/build-route-path.js";
import { Database } from "./database.js";
import { parse } from "csv-parse/sync";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;

      const users = database.select(
        "tasks",
        search
          ? {
              title: search,
              description: search,
            }
          : null
      );

      return res.end(JSON.stringify(users));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (request, response) => {
      const contentType = request.headers["content-type"] ?? "";

      if (contentType.includes("text/csv")) {
        if (!request.rawBody) {
          return response.writeHead(400).end();
        }

        const records = parse(request.rawBody, {
          columns: true,
          trim: true,
          skip_empty_lines: true,
        });

        records.forEach((record) => {
          if (!record.title || !record.description) {
            return;
          }

          const task = {
            id: randomUUID(),
            title: record.title,
            description: record.description,
            completed_at: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          database.insert("tasks", task);
        });

        return response.writeHead(201).end();
      }

      const { title, description } = request.body ?? {};

      if (!title || !description) {
        return response.writeHead(400).end();
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      database.insert("tasks", task);

      return response.writeHead(201).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (request, response) => {
      const id = request.params.id;
      const { title, description, created_at, completed_at } = request.body;

      if (id) {
        const tasks = database.select("tasks");
        const existingTask = tasks.find((task) => task.id === id);

        if (!existingTask) {
          return response.writeHead(404).end();
        }

        const updates = {
          ...(title !== undefined ? { title } : null),
          ...(description !== undefined ? { description } : null),
          ...(created_at !== undefined ? { created_at } : null),
          ...(completed_at !== undefined ? { completed_at } : null),
          updated_at: new Date().toISOString(),
        };

        database.update("tasks", id, {
          ...existingTask,
          ...updates,
        });

        return response.writeHead(204).end();
      }

      return response.writeHead(404).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (request, response) => {
      const id = request.params.id;
      const { is_completed } = request.body;

      if (typeof is_completed !== "boolean") {
        return response.writeHead(400).end();
      }

      const tasks = database.select("tasks");
      const existingTask = tasks.find((task) => task.id === id);

      if (!existingTask) {
        return response.writeHead(404).end();
      }

      database.update("tasks", id, {
        ...existingTask,
        completed_at: is_completed ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      });

      return response.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (request, response) => {
      const id = request.params.id;

      database.delete("tasks", id);

      return response.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks"),
    handler: (request, response) => {
      database.deleteAll("tasks");

      return response.writeHead(204).end();
    },
  },
];
