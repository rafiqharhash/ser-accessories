"use client";

import * as React from "react";
import { format, subDays, startOfMonth, subMonths, endOfMonth, startOfYear } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DateRangePicker({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const startParam = searchParams.get("start");
  const endParam = searchParams.get("end");

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: startParam ? new Date(startParam) : subDays(new Date(), 30),
    to: endParam ? new Date(endParam) : new Date(),
  });

  const [isOpen, setIsOpen] = React.useState(false);

  // Sync state to URL
  const applyDateRange = (range: DateRange | undefined) => {
    setDate(range);
    if (range?.from && range?.to) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("start", range.from.toISOString());
      params.set("end", range.to.toISOString());
      router.push(`?${params.toString()}`);
      setIsOpen(false);
    }
  };

  const presets = [
    { label: "Today", getRange: () => ({ from: new Date(), to: new Date() }) },
    { label: "Yesterday", getRange: () => ({ from: subDays(new Date(), 1), to: subDays(new Date(), 1) }) },
    { label: "Last 7 Days", getRange: () => ({ from: subDays(new Date(), 7), to: new Date() }) },
    { label: "Last 30 Days", getRange: () => ({ from: subDays(new Date(), 30), to: new Date() }) },
    { label: "This Month", getRange: () => ({ from: startOfMonth(new Date()), to: new Date() }) },
    { label: "Last Month", getRange: () => {
        const lastMonth = subMonths(new Date(), 1);
        return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
      } 
    },
    { label: "This Year", getRange: () => ({ from: startOfYear(new Date()), to: new Date() }) },
  ];

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 flex" align="end">
          <div className="flex flex-col border-r border-border p-2 gap-1 bg-muted/20 min-w-[120px]">
            {presets.map((preset) => (
              <Button
                key={preset.label}
                variant="ghost"
                className="justify-start text-xs h-8"
                onClick={() => applyDateRange(preset.getRange())}
              >
                {preset.label}
              </Button>
            ))}
          </div>
          <div className="p-2">
            <Calendar
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
            <div className="flex justify-end pt-2 border-t mt-2">
              <Button 
                size="sm" 
                onClick={() => applyDateRange(date)}
                disabled={!date?.from || !date?.to}
              >
                Apply Custom Range
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
