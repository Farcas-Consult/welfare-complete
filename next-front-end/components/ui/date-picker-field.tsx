"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface DatePickerFieldProps {
  value?: string;
  onChange: (value?: string) => void;
  disabled?: boolean;
  placeholder?: string;
  fromYear?: number;
  toYear?: number;
}

export function DatePickerField({
  value,
  onChange,
  disabled,
  placeholder = "Pick a date",
  fromYear = 1940,
  toYear = new Date().getFullYear(),
}: DatePickerFieldProps) {
  const parsedValue = value ? new Date(value) : undefined;

  const handleSelect = (date?: Date) => {
    onChange(date ? date.toISOString().slice(0, 10) : undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !parsedValue && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 size-4" />
          {parsedValue ? format(parsedValue, "PPP") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={parsedValue}
          onSelect={handleSelect}
          captionLayout="dropdown"
          fromYear={fromYear}
          toYear={toYear}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

