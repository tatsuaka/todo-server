import express from "express";
import type { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const app: Express = express();
const PORT = 8080;
app.use(express.json()); // JSONミドルウェアを使ってリクエストボディを解析
app.use(cors());

const prisma = new PrismaClient();

app.get("/allTodos", async (req:Request, res:Response) => {
  const allTodos = await prisma.todo.findMany();
  return res.json(allTodos);
});

app.post("/createTodo", async (req: Request, res: Response) => {
  try {
    const { title, isCompleted } = req.body;
    if (!title) { // titleが必須であることをチェック
      return res.status(400).json({ error: "Title is required." });
    }
    // Prismaを使ってデータベースに新しいTodoを作成
    const createTodo = await prisma.todo.create({
      data: {
        title,
        isCompleted: isCompleted || false // isCompletedが未指定の場合はデフォルトでfalseを設定
      }
    });
    return res.json(createTodo);
  } catch (error) {
    // エラーが発生した場合は500 Internal Server Errorを返す
    console.error("Failed to create todo:", error);
    return res.status(500).json({ error: "An error occurred while creating the todo." });
  }
});

app.put("/editTodo/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { title, isCompleted } = req.body;
    const createTodo = await prisma.todo.update({
      where:{ id },
      data: {
        title,
        isCompleted: isCompleted || false // isCompletedが未指定の場合はデフォルトでfalseを設定
      }
    });
    return res.json(createTodo);
  } catch (error) {
    // エラーが発生した場合は500 Internal Server Errorを返す
    console.error("Failed to update todo:", error);
    return res.status(400).json(error);
  }
});

app.delete("/deleteTodo/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const createTodo = await prisma.todo.delete({
      where:{ id },
    });
    return res.json(createTodo);
  } catch (error) {
    // エラーが発生した場合は500 Internal Server Errorを返す
    console.error("Failed to delete todo:", error);
    return res.status(400).json(error);
  }
});

app.listen(PORT, () => console.log("server is running"));