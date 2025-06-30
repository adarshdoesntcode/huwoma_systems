export function MonthCalander({ displayMonth, onMonthChange }) {
  return (
    <div className="flex items-center justify-center p-2 space-x-2">
      <select
        value={displayMonth.getMonth()}
        onChange={(e) => {
          const newMonth = new Date(displayMonth);
          newMonth.setMonth(Number(e.target.value));
          onMonthChange?.(newMonth);
        }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <option key={i} value={i}>
            {new Date(0, i).toLocaleString("default", { month: "long" })}
          </option>
        ))}
      </select>
      <select
        value={displayMonth.getFullYear()}
        onChange={(e) => {
          const newDate = new Date(displayMonth);
          newDate.setFullYear(Number(e.target.value));
          onMonthChange?.(newDate);
        }}
      >
        {Array.from({ length: 11 }).map((_, i) => {
          const year = 2020 + i;
          return (
            <option key={year} value={year}>
              {year}
            </option>
          );
        })}
      </select>
    </div>
  );
}
