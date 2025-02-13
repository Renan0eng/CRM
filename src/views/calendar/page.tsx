'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

export default function Calendar() {
  return (
    <Card className="m-4">
      <CardHeader className="flex flex-col gap-4">
        {/* top */}
        <div className="flex justify-between w-full">
          <p className="text-text text-lg font-semibold">Calendar</p>
          <Button>
            <Plus /> Create Event
          </Button>
        </div>
        {/* actions */}
        <div className="flex justify-between items-center">
          {/* Paginate */}
          <div className="flex items-center gap-3 text-text-foreground [&_svg]:size-6 ">
            <Button className="hover:bg-transparent hover:border-primary border-2 hover:[&_svg]:text-primary" variant={"outline"} size={"icon"}><ChevronLeft /></Button>
            <Button className="hover:bg-transparent hover:border-primary border-2 hover:[&_svg]:text-primary" variant={"outline"} size={"icon"}><ChevronRight /></Button>
            <Button variant={"outline"} className="border-primary text-primary hover:text-text hover:bg-primary">Today</Button>
          </div>
          {/* Mes */}
          <div>
            <p className="text-text text-lg font-semibold">
              December 2024
            </p>
          </div>
          {/* view */}
          <div className="flex gap-3">
            <Button >Month</Button>
            <Button variant={"outline"} className="border-primary text-primary hover:text-text hover:bg-primary">Week</Button>
            <Button variant={"outline"} className="border-primary text-primary hover:text-text hover:bg-primary">Day</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CalendarTable />
      </CardContent>
    </Card>
  )
};


function CalendarTable() {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const daysInMonth = 30;
  const firstDayOffset = 3;

  const weeks = [];
  let currentWeek = new Array(firstDayOffset).fill(null);

  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day);
    if (currentWeek.length === 7 || day === daysInMonth) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  return (
    <table className="text-text-foreground border-collapse border border-table-border w-full">
      <thead>
        <tr>
          {daysOfWeek.map((day) => (
            <th key={day} className="border border-table-border p-2">{day}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {weeks.map((week, index) => (
          <tr key={index}>
            {week.map((day, idx) => (
              <td key={idx} className="border border-table-border p-2 align-text-top text-right h-36">
                {day || ""}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}