import { AdvancedColorPicker } from "@/components/advanced-color-picker";
import { useState, useEffect, useRef } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

enum Status {
  Start = "start",
  Middle = "middle",
  End = "end",
}

type Evento = {
  id: string;
  nome: string;
  status?: Status;
  duracao?: number;
  color: string;
  end: Date;
  start: Date;
}
interface DayInfo {
  day: number;
  isCurrentMonth: boolean;
  monthIndex: number;
  fullDate: Date;
  eventos?: Evento[];
}

function CalendarTable({ year, month, evento }: { year: number; month: number, evento?: Evento[] }): JSX.Element {
  const daysOfWeek: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today: Date = new Date();
  const [weeks, setWeeks] = useState<DayInfo[][]>([]);
  const [eventos, setEventos] = useState(evento);

  useEffect(() => {
    setEventos(evento);
  }, [evento])

  useEffect(() => {
    const daysInMonth: number = new Date(year, month + 1, 0).getDate();
    const firstDay: number = new Date(year, month, 1).getDay();
    const prevMonthDays: number = new Date(year, month, 0).getDate();
    const newWeeks: DayInfo[][] = [];
    let currentWeek: DayInfo[] = [];

    for (let i = firstDay; i > 0; i--) {
      const fullDate = new Date(year, month - 1, prevMonthDays - i + 1);
      const dayEvents = eventos?.flatMap((e) => {
        const duracao = Math.ceil((e.end.getTime() - e.start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        if (fullDate.toDateString() === e.start.toDateString()) {
          return [{ ...e, nome: e.nome, status: Status.Start, duracao, id: e.id, color: e.color, }];
        } else if (fullDate > e.start && fullDate < e.end) {
          return [{ ...e, nome: e.nome, status: Status.Middle, id: e.id }];
        } else if (fullDate.toDateString() === e.end.toDateString()) {
          return [{ ...e, nome: e.nome, status: Status.End, id: e.id }];
        }
        return [];
      });
      currentWeek.push({
        day: prevMonthDays - i + 1,
        isCurrentMonth: false,
        monthIndex: month,
        fullDate,
        eventos: dayEvents,
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const fullDate = new Date(year, month, day);
      const dayEvents = eventos?.flatMap((e) => {
        const duracao = Math.ceil((e.end.getTime() - e.start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        if (fullDate.toDateString() === e.start.toDateString()) {
          return [{ ...e, nome: e.nome, status: Status.Start, duracao, id: e.id, color: e.color }];
        } else if (fullDate > e.start && fullDate < e.end) {
          return [{ ...e, nome: e.nome, status: Status.Middle, id: e.id }];
        } else if (fullDate.toDateString() === e.end.toDateString()) {
          return [{ ...e, nome: e.nome, status: Status.End, id: e.id }];
        }
        return [];
      });
      currentWeek.push({
        day,
        isCurrentMonth: true,
        monthIndex: month,
        fullDate,
        eventos: dayEvents,
      });
      if (currentWeek.length === 7) {
        newWeeks.push(currentWeek);
        currentWeek = [];
      }
    }

    let nextMonthDay = 1;
    while (currentWeek.length < 7) {
      const fullDate = new Date(year, month + 1, nextMonthDay);
      const dayEvents = eventos?.flatMap((e) => {
        const duracao = Math.ceil((e.end.getTime() - e.start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        if (fullDate.toDateString() === e.start.toDateString()) {
          return [{ ...e, nome: e.nome, status: Status.Start, duracao, id: e.id, color: e.color }];
        } else if (fullDate > e.start && fullDate < e.end) {
          return [{ ...e, nome: e.nome, status: Status.Middle, id: e.id }];
        } else if (fullDate.toDateString() === e.end.toDateString()) {
          return [{ ...e, nome: e.nome, status: Status.End, id: e.id }];
        }
        return [];
      });
      currentWeek.push({
        day: nextMonthDay++,
        isCurrentMonth: false,
        monthIndex: month,
        fullDate,
        eventos: dayEvents,
      });
    }
    newWeeks.push(currentWeek);
    setWeeks(newWeeks);
  }, [year, month, eventos]);

  const handleDragEnd = (result: any) => {
    let { source, destination, draggableId } = result;

    if (!eventos) return
    if (!destination) return
    if (!draggableId) return

    const draggable = draggableId.split("/");

    draggableId = draggable[0]

    const newEventos = [...eventos.filter((e) => e.id !== draggableId)];

    const editEvento = eventos.find((e) => e.id === draggableId);

    if (editEvento && destination) {
      const duracao = Math.ceil((editEvento.end.getTime() - editEvento.start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const newStartDate = new Date(destination.droppableId);
      const newEndDate = new Date(newStartDate);
      newEndDate.setDate(newStartDate.getDate() + duracao - 1);
      newEventos.push({
        ...editEvento,
        start: newStartDate,
        end: newEndDate,
      });
    }
    setEventos(newEventos);
  };

  const droppableRef = useRef<HTMLDivElement | null>(null);
  const [droppableWidth, setDroppableWidth] = useState<number | null>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (droppableRef.current) {
        const width = droppableRef.current.offsetWidth;
        setDroppableWidth(width);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);


  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="overflow-hidden text-text-foreground border-collapse border-table-border w-full">
        <div className="flex w-full">
          {daysOfWeek.map((day) => (
            <div ref={(el) => { droppableRef.current = el }} key={day} className="border bg-background-white border-table-border p-2 h-12 w-full">
              {day}
            </div>
          ))}
        </div>
        <div className="flex flex-col w-full">
          {weeks.map((week, index) => (
            <div key={index} className="h-36 w-full flex">
              {week.map(({ day, isCurrentMonth, fullDate, eventos }, idx) => (
                <Droppable key={idx} droppableId={fullDate.toDateString()} type="EVENT">
                  {(provided) => (
                    <div
                      ref={(el) => {
                        provided.innerRef(el);
                      }}
                      {...provided.droppableProps}
                      className={`border flex flex-col overflow-visible border-table-border align-text-top text-right ${isCurrentMonth ? "text-text" : "text-text-foreground"
                        }`}
                      style={{
                        width: droppableWidth ? `${droppableWidth}px` : "auto",
                      }}
                    >
                      <div className="p-2">{day}</div>
                      <div className="flex flex-col gap-2">
                        {eventos &&
                          eventos.map((task, i) => (
                            <Draggable key={task.id + "/" + i} draggableId={task.id + "/" + i} index={i}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    ...provided.draggableProps.style,
                                    backgroundColor: task.color,
                                    width: `${droppableWidth && `${droppableWidth * (task.duracao || 1)}px`}`,
                                    zIndex: snapshot.isDragging ? 1000 : 1,
                                  }}
                                  className={`draggable-task flex px-2 h-6 bg-red-500 
                                    ${task.status === Status.Start && "rounded-l-sm "} 
                                    ${task.status === Status.Middle && "scale-x-105"} 
                                    ${task.status === Status.End && "rounded-r-sm "} 
                                    ${snapshot.isDragging ? "shadow-lg scale-105" : ""}`}
                                >
                                  {task.nome}
                                </div>
                              )}
                            </Draggable>
                          ))}
                      </div>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
}

export default CalendarTable;