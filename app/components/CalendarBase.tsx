import React from "react";

type Month = {
  name: string;
  year: number;
  firstDay: Date;
  weekIndex: number;
};

type Week = Array<{ date: Date; count: number }>;

type CalendarBaseProps = {
  title: string;
  months: Month[];
  weeks: Week[];
  getColorClass: (count: number) => string;
  tooltipText: (count: number, date: Date) => string;
  isEmpty?: boolean;
  emptyText?: string;
};

const CalendarBase: React.FC<CalendarBaseProps> = ({
  title,
  months,
  weeks,
  getColorClass,
  tooltipText,
  isEmpty = false,
  emptyText = "No data available",
}) => {
  if (isEmpty) {
    return (
      <div className="w-full rounded-lg border border-border bg-card p-4 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">{title}</h3>
        <div className="flex h-[150px] items-center justify-center text-muted-foreground">
          {emptyText}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-x-auto rounded-lg border border-border bg-card p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-semibold tracking-tight">{title}</h3>
      <div className="relative min-w-[750px] md:min-w-[800px]">
        {/* Months */}
        <div className="mb-4 relative h-8 pl-10">
          <div className="absolute left-0 right-0 z-10">
            {months.map((month, index) => {
              const weekWidth = 15; // Width of each week (13px + 2px gap)
              const position = month.weekIndex * weekWidth;
              return (
                <div
                  key={`${month.name}-${month.year}-${index}`}
                  className="absolute whitespace-nowrap text-xs font-medium text-muted-foreground"
                  style={{
                    left: `${position}px`,
                    minWidth: "30px",
                  }}
                >
                  {month.name}
                  {month.year !== months[0].year ? ` ${month.year}` : ""}
                </div>
              );
            })}
          </div>
        </div>

        {/* Calendar grid */}
        <div className="flex text-xs">
          {/* Days of week */}
          <div className="flex flex-col justify-between pr-3 pt-[2px] text-muted-foreground font-medium">
            <span className="h-[13px]">Sun</span>
            <span className="h-[13px]">Mon</span>
            <span className="h-[13px]">Tue</span>
            <span className="h-[13px]">Wed</span>
            <span className="h-[13px]">Thu</span>
            <span className="h-[13px]">Fri</span>
            <span className="h-[13px]">Sat</span>
          </div>

          {/* Weeks */}
          <div className="flex flex-1 gap-[2px]">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-1 flex-col gap-[2px]">
                {week.map((day, dayIndex) => {
                  const isToday =
                    day.date.toDateString() === new Date().toDateString();
                  return (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`group relative h-[13px] w-[13px] rounded-sm transition-colors duration-200 ${getColorClass(
                        day.count
                      )} ${isToday ? "ring-1 ring-ring ring-offset-1" : ""}`}
                      title={tooltipText(day.count, day.date)}
                    >
                      <div className="absolute left-1/2 bottom-full z-[60] mb-2 -translate-x-1/2 hidden group-hover:block">
                        <div className="relative px-2 py-1.5 text-xs leading-none text-popover-foreground bg-popover rounded-md shadow-md whitespace-nowrap border border-border/50">
                          {tooltipText(day.count, day.date)}
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-popover"></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarBase;
