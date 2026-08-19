"use client";

import { useState } from "react";
import styles from "./DatePicker.module.css";

export interface DatePickerProps {
  selectedDate: Date;
  onSelect: (date: Date) => void;
}

const DAY_LABELS = ["L", "M", "X", "J", "V", "S", "D"];
const MONTH_FORMATTER = new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" });

function getMonthGrid(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: { date: Date; inMonth: boolean }[] = [];
  for (let i = startOffset; i > 0; i -= 1) {
    days.push({ date: new Date(year, month, 1 - i), inMonth: false });
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push({ date: new Date(year, month, day), inMonth: true });
  }
  while (days.length % 7 !== 0) {
    const last = days[days.length - 1].date;
    days.push({ date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1), inMonth: false });
  }
  return days;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function DatePicker({ selectedDate, onSelect }: DatePickerProps) {
  const [visibleMonth, setVisibleMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
  const days = getMonthGrid(visibleMonth);

  return (
    <div className={styles.cal}>
      <div className={styles.calHead}>
        <button
          type="button"
          aria-label="Mes anterior"
          onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))}
        >
          ‹
        </button>
        <span>{MONTH_FORMATTER.format(visibleMonth)}</span>
        <button
          type="button"
          aria-label="Mes siguiente"
          onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))}
        >
          ›
        </button>
      </div>
      <div className={styles.grid}>
        {DAY_LABELS.map((day) => (
          <span key={day} className={`hud-label ${styles.dow}`}>
            {day}
          </span>
        ))}
        {days.map(({ date, inMonth }) => (
          <button
            key={date.toISOString()}
            type="button"
            onClick={() => onSelect(date)}
            className={`${styles.day} ${!inMonth ? styles.muted : ""} ${isSameDay(date, selectedDate) ? styles.selected : ""}`}
          >
            {date.getDate()}
          </button>
        ))}
      </div>
    </div>
  );
}
