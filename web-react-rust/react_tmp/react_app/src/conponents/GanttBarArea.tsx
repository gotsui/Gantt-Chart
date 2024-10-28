import React from "react";

const GanttBarArea: React.FC<any> = ({calendarSize, taskBars, onMouseDownMove, onMouseDownResize}) => {
    return (
        <div id="gantt-bar-area" className="relative" style={{width: `${calendarSize.width}px`, height: `${calendarSize.height}px`}}>
            {taskBars.map((bar: any, index: any) => {
                return (
                    <div key={index}>
                        {bar.task.cat === 'task' &&
                        <div style={bar.style} className="rounded-lg absolute h-5 bg-yellow-100" onMouseDown={(e) => onMouseDownMove(e, bar.task)}>
                            <div className="w-full h-full" style={{pointerEvents: "none"}}>
                                <div className={`h-full bg-yellow-500 rounded-l-lg ${bar.task.percentage === 100 ? 'rounded-r-lg' : ''}`}
                                style={{pointerEvents: "none", width: `${bar.task.percentage}%`}}>
                                </div>
                            </div>
                            <div className="absolute w-2 h-2 bg-gray-300 border border-black" draggable="false"
                            style={{top: "6px", left: "-6px", cursor: "col-resize"}} onMouseDown={(e) => onMouseDownResize(e, bar.task, 'left')}>
                            </div>
                            <div className="absolute w-2 h-2 bg-gray-300 border border-black"
                            style={{top: "6px", right: "-6px", cursor: "col-resize"}} onMouseDown={(e) => onMouseDownResize(e, bar.task, 'right')}>
                            </div>
                        </div>
                        }
                    </div>
                )
            })}
        </div>
    )
}

export { GanttBarArea };
