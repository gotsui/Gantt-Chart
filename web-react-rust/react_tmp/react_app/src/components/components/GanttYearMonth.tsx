import React from "react";

const GanttYearMonth: React.FC<any> = ({calendars, blockSize}) => {
    return (
        <div id="gantt-year-month" className="relative h-8">
            {calendars.map((calendar: any, index: number) => {
                return (
                    <div key={index}>
                        <div className="bg-indigo-700 text-white border-b border-r border-t h-8 absolute font-bold text-sm flex items-center justify-center"
                        style={{width: `${calendar.calendar * blockSize}px`, left: `${calendar.startBlockNumber * blockSize}px`}}>
                            {calendar.date}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export { GanttYearMonth };