import React from "react";

const GanttHeight: React.FC<any> = ({calendars, calendarSize, blockSize}) => {
    return (
        <div id="gantt-height" className="relative">
            {calendars.map((calendar: any, index: number) => {
                return (
                    <div key={index}>
                        {calendar.days.map((day: any, index: number) => {
                            return (
                                <div key={index}>
                                    <div className={`border-r border-b absolute 
                                    ${day.dayOfWeek === '土' ? 'bg-blue-100' : ''} ${day.dayOfWeek === '日' ? 'bg-red-100' : ''}`}
                                    style={{width: `${blockSize}px`, left: `${day.blockNumber * blockSize}px`, height: `${calendarSize.height}px`}}>
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

export { GanttHeight };
