import { useEffect, useState } from "react";

function getRemaining(targetDate) {
  const diff = targetDate.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: false,
  };
}

function Countdown({ targetDate, compact = false }) {
  const [remaining, setRemaining] = useState(() => getRemaining(targetDate));

  useEffect(() => {
    const timer = setInterval(() => setRemaining(getRemaining(targetDate)), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (remaining.done) return <span className="countdown-done">Started</span>;

  if (compact) {
    return (
      <span className="countdown-compact">
        {remaining.days}d {remaining.hours}h {remaining.minutes}m
      </span>
    );
  }

  return (
    <div className="countdown-blocks">
      {[["Days", remaining.days], ["Hrs", remaining.hours], ["Min", remaining.minutes], ["Sec", remaining.seconds]].map(([label, val]) => (
        <div className="countdown-block" key={label}>
          <span>{String(val).padStart(2, "0")}</span>
          <label>{label}</label>
        </div>
      ))}
    </div>
  );
}

export default Countdown;
