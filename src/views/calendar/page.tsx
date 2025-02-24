'use client';

import CalendarTable from "@/components/tables/calendar/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { meses } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useEffect, useState } from "react";

export default function Calendar() {

  const today: Date = new Date();

  const [year, setYear] = useState<number>(today.getFullYear());
  const [month, setMonth] = useState<number>(today.getMonth());

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

  return (
    <Card className="m-4 border-0">
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
            <Button onClick={() => changeMonth(-1)} className="hover:bg-transparent hover:border-primary border-2 hover:[&_svg]:text-primary" variant={"outline"} size={"icon"}><ChevronLeft /></Button>
            <Button onClick={() => changeMonth(1)} className="hover:bg-transparent hover:border-primary border-2 hover:[&_svg]:text-primary" variant={"outline"} size={"icon"}><ChevronRight /></Button>
            <Button onClick={() => {
              setMonth(today.getMonth())
              setYear(today.getFullYear())
            }} variant={"outline"} className="border-primary text-primary hover:text-text hover:bg-primary">Today</Button>
          </div>
          {/* Mes */}
          <div>
            <p className="text-text text-lg font-semibold">
              {meses[month]} {year}
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
        <CalendarTable year={year} month={month} />
      </CardContent>
    </Card>
  )
};
