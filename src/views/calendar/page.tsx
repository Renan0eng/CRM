'use client';

import CalendarTable from "@/components/tables/calendar/table";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn, meses } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AdvancedColorPicker } from "@/components/advanced-color-picker";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";


export default function Agenda() {

  const today: Date = new Date();

  const [year, setYear] = useState<number>(today.getFullYear());
  const [month, setMonth] = useState<number>(today.getMonth());
  const [evento, setEvento] = useState([
    {
      id: "sdasd",
      nome: "Faculdade",
      start: new Date(year, month, 10),
      end: new Date(year, month, 11),
      color: "#FF5733",
    },
    {
      id: "sdasd2",
      nome: "Reunião",
      start: new Date(year, month, 15),
      end: new Date(year, month, 17),
      color: "#86ae4c",
    },
  ]);

  const changeMonth = (offset: number) => {
    let newMonth = month + offset;
    let newYear = year;
    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }
    setMonth(newMonth);
    setYear(newYear);
  };


  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const addOrUpdateEvento = (data: {
    id?: string;
    nome: string;
    start: Date;
    end: Date;
    color: string;
  }) => {
    if (data.id) {
      console.log("Iddata: ", data);

      setEvento((prevEventos) =>
        prevEventos.map((evento) =>
          evento.id === data.id ? { ...evento, ...data } : evento
        )
      );
    } else {
      const newId = Math.random().toString(36).substr(2, 9);
      console.log("data: ", newId);
      setEvento((prevEventos) => [
        ...prevEventos,
        { ...data, id: newId },
      ]);
      console.log("evento: ", evento);

    }
  };

  return (
    <Card className="m-4 border-0 ">
      <CardHeader className="flex flex-col gap-4">
        {/* top */}
        <div className="flex justify-between w-full">
          <p className="text-text text-lg font-semibold">Calendar</p>

          <Dialog open={openDialog} onOpenChange={(e) => setOpenDialog(e)} >
            <DialogTrigger asChild >
              <Button>
                <Plus /> Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="w-96 p-0 border-0 bg-transparent">
              <FormTask
                addOrUpdateEvento={addOrUpdateEvento}
                setOpenDialog={setOpenDialog}
              />
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 text-text-foreground [&_svg]:size-6 ">
            <Button onClick={() => changeMonth(-1)} className="hover:bg-transparent hover:border-primary border-2 hover:[&_svg]:text-primary" variant={"outline"} size={"icon"}><ChevronLeft /></Button>
            <Button onClick={() => changeMonth(1)} className="hover:bg-transparent hover:border-primary border-2 hover:[&_svg]:text-primary" variant={"outline"} size={"icon"}><ChevronRight /></Button>
            <Button onClick={() => {
              setMonth(today.getMonth())
              setYear(today.getFullYear())
            }} variant={"outline"} className="border-primary text-primary hover:text-text hover:bg-primary">Today</Button>
          </div>
          <div>
            <p className="text-text text-lg font-semibold">
              {meses[month]} {year}
            </p>
          </div>
          <div className="flex gap-3">
            <Button >Month</Button>
            <Button variant={"outline"} className="border-primary text-primary hover:text-text hover:bg-primary">Week</Button>
            <Button variant={"outline"} className="border-primary text-primary hover:text-text hover:bg-primary">Day</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CalendarTable year={year} month={month} evento={evento} />
      </CardContent>
    </Card>
  )
};



const taskSchema = z.object({
  nome: z.string().min(1, { message: "O nome é obrigatório" }),
  dateRange: z.object({
    start: z.date({ required_error: "A data de início é obrigatória" }),
    end: z.date({ required_error: "A data de término é obrigatória" }),
  }),
  color: z.string().min(1, { message: "A cor é obrigatória" }),
});

type TaskFormData = z.infer<typeof taskSchema>;

function FormTask({
  id,
  addOrUpdateEvento,
  setOpenDialog,
}: {
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  id?: string;
  addOrUpdateEvento: (
    data: {
      id?: string;
      nome: string;
      start: Date;
      end: Date;
      color: string;
    }
  ) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    control,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      nome: "",
      dateRange: {
        start: new Date(),
        end: new Date(),
      },
      color: "#FF5733",
    },
  });

  useEffect(() => {
    if (id) {
      setValue("nome", "Faculdade");
      // setValue("dateRange", {end: new Date(2023, 9, 10)});
      setValue("color", "#FF5733");
    }
  }, [id, setValue]);

  // Função para lidar com o envio do formulário
  const onSubmit = async (data: TaskFormData) => {
    console.log("data: ", data);

    addOrUpdateEvento({
      id,
      nome: data.nome,
      start: data.dateRange.start,
      end: data.dateRange.end,
      color: data.color,
    });
    reset();
    setOpenDialog(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-full text-text border-0">
        <CardHeader>
          <CardTitle>{id ? "Editar Evento" : "Criar Evento"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            {/* Campo de Nome */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                placeholder="Nome do evento"
                {...register("nome")}
              />
              {errors.nome && (
                <p className="text-red-500 text-sm">{errors.nome.message}</p>
              )}
            </div>

            {/* Campo de Data de Início */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="start">Data de Início</Label>
              <Controller
                name="dateRange"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="dateRange"
                        variant={"outline"}
                        className={cn(
                          "w-[300px] justify-start text-left font-normal",
                          !field.value?.start && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value?.start ? (
                          field.value?.end ? (
                            <>
                              {format(field.value.start, "LLL dd, y")} -{" "}
                              {format(field.value.end, "LLL dd, y")}
                            </>
                          ) : (
                            format(field.value.start, "LLL dd, y")
                          )
                        ) : (
                          <span>Selecione um intervalo de datas</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={field.value?.start}
                        selected={{ from: field.value.start, to: field.value.end }}
                        onSelect={(e) => field.onChange({
                          start: e?.from, end: e?.to
                        })}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.dateRange && (
                <p className="text-red-500 text-sm">{errors.dateRange.message}</p>
              )}
            </div>


            {/* Campo de Cor */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="color">Cor</Label>
              <Controller
                name="color"
                control={control}
                render={({ field }) => (
                  <AdvancedColorPicker

                    color={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.color && (
                <p className="text-red-500 text-sm">{errors.color.message}</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button type="submit">{id ? "Editar" : "Adicionar"}</Button>
        </CardFooter>
      </Card>
    </form>
  );
}

