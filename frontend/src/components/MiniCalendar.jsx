import { useState } from "react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function MiniCalendar({ selectedDate, onSelect }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDayOffset = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();

  const changeMonth = (delta) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + delta, 1));
  };

  const isPast = (day) => {
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    return d < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getFullYear() === viewDate.getFullYear() &&
      selectedDate.getMonth() === viewDate.getMonth() &&
      selectedDate.getDate() === day
    );
  };

  return (
    <div className="mini-calendar">
      <div className="calendar-header">
        <button type="button" onClick={() => changeMonth(-1)}>‹</button>
        <span>{MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}</span>
        <button type="button" onClick={() => changeMonth(1)}>›</button>
      </div>
      <div className="calendar-grid calendar-grid-labels">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="calendar-grid">
        {Array.from({ length: firstDayOffset }).map((_, i) => (
          <span key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const past = isPast(day);
          return (
            <button
              type="button"
              key={day}
              disabled={past}
              className={`calendar-day ${isSelected(day) ? "calendar-day-selected" : ""}`}
              onClick={() => onSelect(new Date(viewDate.getFullYear(), viewDate.getMonth(), day))}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default MiniCalendar;
