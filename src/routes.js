import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/build-route-path.js";
import { Database } from "./database.js";

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
      const { title, description } = request.body;

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
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (request, response) => {
      const id = request.params.id;

      database.delete("tasks", id);

      return response.writeHead(204).end();
    },
  },
];
