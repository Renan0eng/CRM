import { z } from "zod";

export const taskSchema = z.object({
  taskName: z.string().min(1, "Task name is required"),
  taskTag: z.string().optional(),
  taskDescription: z.string().optional(),
  taskImage: z.string().optional(),
});
