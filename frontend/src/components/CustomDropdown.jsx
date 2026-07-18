import { useEffect, useRef, useState } from "react";

function CustomDropdown({ options, value, onChange, label }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="custom-dropdown" ref={ref}>
      {label && <span className="dropdown-label">{label}</span>}
      <button
        type="button"
        className={`dropdown-trigger ${open ? "dropdown-trigger-open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        {value}
        <span className="dropdown-arrow">▾</span>
      </button>
      {open && (
        <div className="dropdown-menu">
          {options.map((opt) => (
            <div
              key={opt}
              className={`dropdown-option ${opt === value ? "dropdown-option-active" : ""}`}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomDropdown;
