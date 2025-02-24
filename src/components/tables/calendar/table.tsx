import { useState, useEffect } from "react";

enum Status {
  Start = "start",
  Middle = "middle",
  End = "end",
}

interface DayInfo {
  day: number;
  isCurrentMonth: boolean;
  monthIndex: number;
  tasks?: {
    nome: string;
    status: Status;
  }[]
}

function CalendarTable({
  year,
  month
}: {
  year: number,
  month: number
}): JSX.Element {
  const daysOfWeek: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today: Date = new Date();
  const currentMonthNumber = today.getMonth() + 1;
  const [weeks, setWeeks] = useState<DayInfo[][]>([]);
  const [firstDayOffset, setFirstDayOffset] = useState<number>(0);

  useEffect(() => {
    const daysInMonth: number = new Date(year, month + 1, 0).getDate();
    const firstDay: number = new Date(year, month, 1).getDay();
    const prevMonthDays: number = new Date(year, month, 0).getDate();
    setFirstDayOffset(firstDay);

    const newWeeks: DayInfo[][] = [];
    let currentWeek: DayInfo[] = [];

    for (let i = firstDay; i > 0; i--) {
      currentWeek.push({ day: prevMonthDays - i + 1, isCurrentMonth: false, monthIndex: month - 1 < 0 ? 11 : month - 1 });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push({
        day, isCurrentMonth: true, monthIndex: month,
      });
      if (currentWeek.length === 7) {
        newWeeks.push(currentWeek);
        currentWeek = [];
      }
    }

    let nextMonthDay = 1;
    while (currentWeek.length < 7) {
      currentWeek.push({ day: nextMonthDay++, isCurrentMonth: false, monthIndex: month + 1 > 11 ? 0 : month + 1 });
    }
    newWeeks.push(currentWeek);

    setWeeks(newWeeks);
  }, [year, month]);

  return (
    <div>
      <table className="text-text-foreground border-collapse border-table-border w-full">
        <thead>
          <tr>
            {daysOfWeek.map((day) => (
              <th key={day} className="border bg-background-white border-table-border p-2">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, index) => (
            <tr key={index}>
              {week.map(({
                day,
                isCurrentMonth,
                monthIndex,
                tasks
              }, idx) => (
                <td
                  key={idx}
                  className={`border border-table-border align-text-top text-right h-36 ${day === today.getDate() && isCurrentMonth && month === today.getMonth() && year === today.getFullYear() ? "bg-background/25 font-bold" : ""} ${isCurrentMonth ? "text-text" : "text-text-foreground"}
                  `}
                >
                  <div className="p-2">
                    {day}
                  </div>
                  {tasks && tasks.map((task) => (<div className="flex w-full h-8 bg-red-500">{task.nome}</div>))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CalendarTable;
