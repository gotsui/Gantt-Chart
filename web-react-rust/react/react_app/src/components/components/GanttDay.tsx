import React from "react";

const GanttDay: React.FC<any> = ({calendars, blockSize}) => {
    return (
        <div id="gantt-day" className="relative h-12">
            {calendars.map((calendar: any, index: number) => {
                return (
                    <div key={index}>
                        {calendar.days.map((day: any, index: number) => {
                            return (
                                <div key={index}>
                                    <div className={`border-r h-12 absolute flex items-center justify-center flex-col font-bold text-xs 
                                    ${day.dayOfWeek === '土' ? 'bg-blue-100' : ''} ${day.dayOfWeek === '日' ? 'bg-red-100' : ''}`}
                                    style={{width: `${blockSize}px`, left: `${day.blockNumber * blockSize}px`}}>
                                        <span>{day.day}</span>
                                        <span>{day.dayOfWeek}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
}

export { GanttDay };
