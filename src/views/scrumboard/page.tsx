'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Edit, Ellipsis, Plus, Tag, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { formatDateMes } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { createOrEdit, createOrEditColumn, deleteColumnById, deleteTask, getColumns } from "@/models/tasks";
import { Popover } from "@/components/ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { taskSchema } from "@/Schemas/scrumboard";
import { zodResolver } from "@hookform/resolvers/zod";
// import { createOrEditTask } from "@/models/tasks"



export default function TasksPage() {
  const [columns, setColumns] = useState<Columns>({});

  const [newcolumnId, setNewcolumnId] = useState<string>("");

  const [newTaskName, setNewTaskName] = useState<string>("");
  const [newTaskDescription, setNewTaskDescription] = useState<string>("");
  const [newTaskTag, setNewTaskTag] = useState<string>("");
  const [newTaskImage, setNewTaskImage] = useState<string>("");

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    const data = await getColumns();

    console.log("data", data);

    if (data) {

      const formattedData: Columns = data.reduce((acc, column) => {
        acc[column.id] = column;
        return acc;
      }, {} as Columns);


      console.log("formatedData", formattedData);

      setColumns(formattedData)
    }
  }

  const reorder = (list: Task[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    result.map((task, index) => createOrEdit({ ...task, index }))

    return result;
  };

  const reorderColumns = (sourceIndex: number, destinationIndex: number) => {
    const columnIds = Object.keys(columns);
    const reorderedIds = Array.from(columnIds);
    const [removed] = reorderedIds.splice(sourceIndex, 1);
    reorderedIds.splice(destinationIndex, 0, removed);

    const newColumns: Columns = {};
    reorderedIds.forEach((id) => {
      newColumns[id] = columns[id];
    });

    Object.entries(newColumns).forEach(([columnId, column], index) => {
      const { id, name } = column
      createOrEditColumn({
        id,
        name,
        index,
      });
    });

    setColumns(newColumns);
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;

    // Se não houver destino, não fazemos nada
    if (!destination) return;

    // Reordenar colunas
    if (type === "COLUMN") {
      reorderColumns(source.index, destination.index);
      return;
    }

    // Reordenar tarefas dentro das colunas
    if (source.droppableId === destination.droppableId) {
      const column = columns[source.droppableId];
      const reorderedTasks = reorder(column.tasks, source.index, destination.index);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          tasks: reorderedTasks,
        },
      });
    } else {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceTasks = Array.from(sourceColumn.tasks);
      const destTasks = Array.from(destColumn.tasks);
      const [removed] = sourceTasks.splice(source.index, 1);
      destTasks.splice(destination.index, 0, removed);


      sourceTasks.map((task, index) =>
        createOrEdit({
          ...task,
          index,
          column_id: sourceColumn.id
        })
      )
      destTasks.map((task, index) =>
        createOrEdit({
          ...task,
          index,
          column_id: destColumn.id
        })
      )


      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          tasks: sourceTasks,
        },
        [destination.droppableId]: {
          ...destColumn,
          tasks: destTasks,
        },
      });

    }
  };


  const addColumn = async (columnId: string) => {
    const newColumn = await createOrEditColumn({
      name: columnId,
    });

    setColumns((prevColumns) => ({
      ...prevColumns,
      [newColumn.id]: newColumn,
    }));
    setNewcolumnId("");
  };

  const addOrUpadateTaskToColumn = async (
    data: {
      taskName: string;
      taskTag?: string | undefined;
      taskDescription?: string | undefined;
      taskImage?: string | undefined;
    },
    columnId: string,
    id?: string
  ) => {
    const { taskName, taskTag, taskDescription, taskImage } = data;


    const createOrEditTask: CreateOrEditTask = {
      id: id,
      name: taskName,
      image: taskImage || "",
      description: taskDescription || "Descrição padrão",
      tags: taskTag ? taskTag.split(",").map((item) => item.trim()) : [],
      date: new Date(),
      column_id: columnId,
      index: 1
    };

    console.log("createOrEditTask", createOrEditTask);

    const newTask = await createOrEdit(createOrEditTask);

    console.log("newTask", newTask);


    if (newTask) {

      setNewTaskName("")
      setNewTaskTag("")
      setNewTaskDescription("")
      setNewTaskImage("")

      if (columns[columnId]) {
        setColumns((prevColumns) => {
          const column = prevColumns[columnId];
          const taskIndex = column.tasks.findIndex((task) => task.id === id);

          if (taskIndex !== -1 && id) {
            const updatedTasks = [...column.tasks];
            updatedTasks[taskIndex] = {
              ...updatedTasks[taskIndex],
              ...newTask,
            };
            console.log(
              `Tarefa "${updatedTasks[taskIndex].name}" editada na coluna "${column.name}"! ${JSON.stringify(updatedTasks[taskIndex])}`
            );

            return {
              ...prevColumns,
              [columnId]: {
                ...column,
                tasks: updatedTasks,
              },
            };
          } else {
            return {
              ...prevColumns,
              [columnId]: {
                ...column,
                tasks: [...column.tasks, newTask],
              },
            };
          }
        });
        console.log("Columns", columns);
      } else {
        console.error(`Coluna "${columnId}" não encontrada!`);
      }
    } else {
      console.error(`Erro ao criar task! ${newTask}`);

    }
  };

  const deleteTaskColumn = (id: string, columnId: string) => {

    if (columns[columnId]) {
      setColumns((prevColumns) => {
        const column = prevColumns[columnId];
        const updatedTasks = column.tasks.filter((task) => task.id !== id);

        deleteTask(id);

        updatedTasks.map((task, index) => createOrEdit({ ...task, index }))

        if (updatedTasks.length === column.tasks.length) {
          console.warn(`Tarefa com ID "${id}" não encontrada na coluna "${columnId}".`);
        } else {
          console.log(`Tarefa com ID "${id}" removida da coluna "${columnId}".`);
        }



        return {
          ...prevColumns,
          [columnId]: {
            ...column,
            tasks: updatedTasks,
          },
        };
      });
    } else {
      console.error(`Coluna "${columnId}" não encontrada!`);
    }
  };

  const deleteColumn = async (id: string) => {
    if (!columns[id]) {
      console.error(`Coluna "${id}" não encontrada!`);
      return;
    }

    setColumns((prevColumns) => {
      const updatedColumns = { ...prevColumns };
      delete updatedColumns[id]; // Remove a coluna do estado

      return updatedColumns;
    });

    try {
      deleteColumnById(id);
      console.log(`Coluna "${id}" e todas as suas tarefas foram removidas.`);
    } catch (error) {
      console.error("Erro ao excluir a coluna:", error);
    }
  };



  return (
    <div className="w-full p-8 flex flex-col gap-4 max-h-full scrollable overflow-scroll">
      {/* Btn new collun */}
      <AddNewCalumnBtn
        addColumn={addColumn}
        newcolumnId={newcolumnId}
        setNewcolumnId={setNewcolumnId}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="columns" direction="horizontal" type="COLUMN">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex gap-4 flex-row w-full"
            >
              <div className="flex gap-4 flex-row h-fit">
                {Object.entries(columns).map(([id, column], index) => (
                  <Draggable key={id} draggableId={id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="flex flex-col w-80 h-full gap-4 bg-background-foreground p-4 rounded-md"
                      >
                        {/* Área de arraste no topo da coluna */}
                        <div className="flex justify-between items-center" {...provided.dragHandleProps}>
                          <h1 className="text-text-foreground font-semibold">{column.name}</h1>
                          {/* actions */}
                          <ActionsColumn
                            newTaskName={newTaskName}
                            addTaskToColumn={addOrUpadateTaskToColumn}
                            column={column}
                            setNewTaskName={setNewTaskName}
                            newTaskDescription={newTaskDescription}
                            setNewTaskDescription={setNewTaskDescription}
                            newTaskTag={newTaskTag}
                            setNewTaskTag={setNewTaskTag}
                            newTaskImage={newTaskImage}
                            setNewTaskImage={setNewTaskImage}
                            deleteColumn={deleteColumn}
                          />
                        </div>
                        <Droppable droppableId={id} type="TASK">
                          {(provided, snapshot) => (
                            <div key={id}
                            >
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="flex flex-col gap-4  p-4 rounded-lg min-h-"
                              >
                                {column.tasks.map((task, index) => (
                                  <TaskItem
                                    task={task}
                                    index={index}
                                    newTaskName={newTaskName}
                                    UpdateTaskToColumn={addOrUpadateTaskToColumn}
                                    column={column}
                                    setNewTaskName={setNewTaskName}
                                    newTaskDescription={newTaskDescription}
                                    setNewTaskDescription={setNewTaskDescription}
                                    newTaskTag={newTaskTag}
                                    setNewTaskTag={setNewTaskTag}
                                    deleteTaskColumn={deleteTaskColumn}
                                    newTaskImage={newTaskImage}
                                    setNewTaskImage={setNewTaskImage}
                                  />
                                ))}
                                {provided.placeholder}
                              </div>
                            </div>
                          )}
                        </Droppable>
                      </div>
                    )}
                  </Draggable>
                ))}
              </div>

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

function TaskItem({
  task,
  index,
  newTaskName,
  UpdateTaskToColumn,
  column,
  setNewTaskName,
  newTaskDescription,
  setNewTaskDescription,
  newTaskTag,
  setNewTaskTag,
  deleteTaskColumn,
  setNewTaskImage,
  newTaskImage
}: {
  task: Task,
  index: number,
  newTaskName: string,
  UpdateTaskToColumn: (
    data: {
      taskName: string;
      taskTag?: string | undefined;
      taskDescription?: string | undefined;
      taskImage?: string | undefined;
    },
    columnId: string
  ) => void,
  column: Column,
  newTaskDescription: string,
  newTaskTag: string,
  setNewTaskName: React.Dispatch<React.SetStateAction<string>>,
  setNewTaskDescription: React.Dispatch<React.SetStateAction<string>>,
  setNewTaskTag: React.Dispatch<React.SetStateAction<string>>,
  deleteTaskColumn: (id: string, columnId: string) => void,
  setNewTaskImage: React.Dispatch<React.SetStateAction<string>>,
  newTaskImage: string,
}): React.JSX.Element {

  const [openDialog, setOpenDialog] = useState<boolean>(false);

  return <Draggable key={task.id} draggableId={task.id} index={index}>
    {(provided, snapshot) => (
      <div
        className="bg-background-white p-3 gap-4 flex flex-col rounded-sm text-text-foreground"
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={{
          ...provided.draggableProps.style,
        }}
      >
        {task.image && (
          <div className="w-full rounded-sm overflow-hidden relative" style={{ aspectRatio: "16 / 7" }}>
            <Image
              key={task.image}
              src={task.image}
              alt="Task image"
              layout="fill"
              objectFit="cover"
              objectPosition="center"
            />
          </div>
        )}
        <h1 className="text-[16px]">
          {task.name}
        </h1>
        <p className="text-xs">
          {task.description}
        </p>
        {task.tags && <div className="flex flex-wrap gap-3">
          {task.tags.map((tag) => <Button variant='outline' className="p-3 h-8 border-text-foreground text-text-foreground hover:bg-primary/80 hover:text-text hover:border-primary/80">
            <Tag /> {tag}
          </Button>)}
        </div>}
        <div className="flex justify-between">
          {/* date */}
          <span className="[&_svg]:size-4 flex gap-2 items-center">
            <Calendar />
            <p className="text-sm">
              {formatDateMes(task.date)}
            </p>
          </span>
          {/* action */}
          <div>
            <Dialog open={openDialog} onOpenChange={(e) => setOpenDialog(e)}>
              <DialogTrigger asChild>
                <Button
                  className="rounded-full text-text-foreground w-5 h-5 p-0  hover:bg-transparent hover:border-primary/80"
                  variant={"ghost"}
                  onClick={() => {
                    setNewTaskName(task.name)
                    setNewTaskTag(task.tags?.join(", ") || "")
                    setNewTaskDescription(task.description)
                    setNewTaskImage(task.image || "")
                  }}
                >
                  <Edit />
                </Button>
              </DialogTrigger>
              <DialogContent className="w-96 p-0 border-0 bg-transparent">
                <FormTask
                  id={task.id}
                  newTaskName={newTaskName}
                  addOrUpdateTaskToColumn={UpdateTaskToColumn}
                  column={column}
                  setNewTaskName={setNewTaskName}
                  newTaskDescription={newTaskDescription}
                  setNewTaskDescription={setNewTaskDescription}
                  newTaskTag={newTaskTag}
                  setNewTaskTag={setNewTaskTag}
                  newTaskImage={newTaskImage}
                  setNewTaskImage={setNewTaskImage}
                  setOpenDialog={setOpenDialog}
                />
              </DialogContent>
            </Dialog>
            <Button
              className="rounded-full text-text-foreground w-5 h-5 p-0  hover:bg-transparent hover:text-red-500/80"
              variant={"ghost"}
              onClick={() => deleteTaskColumn(task.id, column.id)}
            >
              <Trash />
            </Button>
          </div>
        </div>
      </div>

    )}
  </Draggable>;
}

function ActionsColumn({
  newTaskName,
  addTaskToColumn,
  column,
  setNewTaskName,
  newTaskDescription,
  setNewTaskDescription,
  newTaskTag,
  setNewTaskTag,
  setNewTaskImage,
  newTaskImage,
  deleteColumn
}: {
  newTaskName: string,
  addTaskToColumn: (
    data: {
      taskName: string;
      taskTag?: string | undefined;
      taskDescription?: string | undefined;
      taskImage?: string | undefined;
    },
    columnId: string
  ) => void,
  deleteColumn: (id: string) => void,
  column: Column,
  newTaskDescription: string,
  newTaskTag: string,
  setNewTaskName: React.Dispatch<React.SetStateAction<string>>,
  setNewTaskDescription: React.Dispatch<React.SetStateAction<string>>,
  setNewTaskTag: React.Dispatch<React.SetStateAction<string>>,
  setNewTaskImage: React.Dispatch<React.SetStateAction<string>>,
  newTaskImage: string,
}) {

  const [openDialog, setOpenDialog] = useState<boolean>(false);

  return <div className="flex gap-3">
    <Dialog open={openDialog} onOpenChange={(e) => setOpenDialog(e)}>
      <DialogTrigger asChild>
        <Button
          className="rounded-full text-text w-5 h-5 p-0  [&_svg]:size-3 hover:bg-transparent hover:border-primary/80"
          variant={"outline"}
        >
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-96 p-0 border-0 bg-transparent">
        <FormTask
          newTaskName={newTaskName}
          addOrUpdateTaskToColumn={addTaskToColumn}
          column={column}
          setNewTaskName={setNewTaskName}
          newTaskDescription={newTaskDescription}
          setNewTaskDescription={setNewTaskDescription}
          newTaskTag={newTaskTag}
          setNewTaskTag={setNewTaskTag}
          newTaskImage={newTaskImage}
          setNewTaskImage={setNewTaskImage}
          setOpenDialog={setOpenDialog}
        />
      </DialogContent>
    </Dialog>
    <Popover>
      <PopoverTrigger>
        <Button
          className="rounded-full text-text w-5 h-5 p-0  hover:bg-transparent hover:border-primary/80"
          variant={"ghost"}
        >
          <Ellipsis />
        </Button>
      </PopoverTrigger>
      <PopoverContent >
        <Button variant={"outline"} size={"sm"} className="bg-background-foreground text-text-foreground" onClick={() => deleteColumn(column.id)}>
          <Trash /> Delete
        </Button>
      </PopoverContent>
    </Popover>
  </div>;
}

function FormTask({
  id,
  newTaskName,
  addOrUpdateTaskToColumn,
  column,
  setNewTaskName,
  newTaskDescription,
  newTaskTag,
  newTaskImage,
  setOpenDialog
}: {
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>,
  id?: string,
  newTaskName: string,
  addOrUpdateTaskToColumn: (
    data: {
      taskName: string;
      taskTag?: string | undefined;
      taskDescription?: string | undefined;
      taskImage?: string | undefined;
    },
    columnId: string,
    id?: string
  ) => void,
  column: Column,
  newTaskDescription: string,
  newTaskTag: string,
  setNewTaskName: React.Dispatch<React.SetStateAction<string>>,
  setNewTaskDescription: React.Dispatch<React.SetStateAction<string>>,
  setNewTaskTag: React.Dispatch<React.SetStateAction<string>>,
  setNewTaskImage: React.Dispatch<React.SetStateAction<string>>,
  newTaskImage: string,
}) {

  useEffect(() => {
    if (id) {
      setValue("taskName", newTaskName)
      setValue("taskTag", newTaskTag)
      setValue("taskDescription", newTaskDescription)
      setValue("taskImage", newTaskImage)
    }
  }, [id])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      taskName: "",
      taskTag: "",
      taskDescription: "",
      taskImage: "",
    },
  });

  const onSubmit = (data: z.infer<typeof taskSchema>) => {

    if (id) {
      addOrUpdateTaskToColumn(data, column.id, id);
    } else {
      addOrUpdateTaskToColumn(data, column.id);
    }
    reset(); // Limpa o formulário após o envio
    setOpenDialog(false);
  };

  return <form onSubmit={handleSubmit(onSubmit)}>
    <Card className="w-full text-text border-0">
      <CardHeader>
        <CardTitle>Create task</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          {/* Campo de Nome */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Name of your task"
              {...register("taskName")}
            />
            {errors.taskName && (
              <p className="text-red-500 text-sm">{errors.taskName.message}</p>
            )}
          </div>

          {/* Campo de Tags */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="tag">Tags</Label>
            <Input
              id="tag"
              placeholder="Tags of your task"
              {...register("taskTag")}
            />
          </div>

          {/* Campo de Imagem */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="image">Image (url)</Label>
            <Input
              id="image"
              placeholder="Image url of your task"
              {...register("taskImage")}
            />
            {errors.taskImage && (
              <p className="text-red-500 text-sm">{errors.taskImage.message}</p>
            )}
          </div>

          {/* Campo de Descrição */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Description of your task"
              {...register("taskDescription")}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit" >{id ? "Edit" : "Add"}</Button>
      </CardFooter>
    </Card>
  </form>;
}

function AddNewCalumnBtn({
  addColumn,
  newcolumnId,
  setNewcolumnId
}: {
  addColumn: (columnId: string) => void,
  newcolumnId: string,
  setNewcolumnId: React.Dispatch<React.SetStateAction<string>>
}) {
  return <div>
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          <p className="font-semibold">New</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-80 p-0 border-0 bg-transparent">
        <Card className="w-full text-text border-0">
          <CardHeader>
            <CardTitle>Create Column</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addColumn(newcolumnId);
              }}
            >
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Name of your column"
                    value={newcolumnId}
                    onChange={(e) => setNewcolumnId(e.target.value)} />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <DialogClose asChild>
              <Button
                type="submit"
                onClick={() => addColumn(newcolumnId)} // Chama a função para adicionar a coluna
              >
                Add
              </Button>
            </DialogClose>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog >
  </div >;
}