import React from "react";
import { GanttYearMonth } from "./GanttYearMonth";
import { GanttDay } from "./GanttDay";
import { GanttHeight } from "./GanttHeight";

const GanttDate: React.FC<any> = ({calendars, calendarSize, blockSize}) => {
    return (
        <div id="gantt-date" className="h-20">
            <GanttYearMonth calendars={calendars} blockSize={blockSize} />
            <GanttDay calendars={calendars} blockSize={blockSize} />
            <GanttHeight calendars={calendars} calendarSize={calendarSize} blockSize={blockSize} />
        </div>
    )
}

export { GanttDate };
