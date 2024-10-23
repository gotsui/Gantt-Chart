import React from "react";

const GanttTask: React.FC<any> = ({displayTasks, calendarSize}) => {
    return (
        <div id="gantt-task">
            <div id="gantt-task-title" className="flex items-center bg-green-600 text-white h-20">
                <div className="border-t border-r border-b flex items-center justify-center font-bold text-xs w-48 h-full">タスク</div>
                <div className="border-t border-r border-b flex items-center justify-center font-bold text-xs w-24 h-full">開始日</div>
                <div className="border-t border-r border-b flex items-center justify-center font-bold text-xs w-24 h-full">終了日</div>
                <div className="border-t border-r border-b flex items-center justify-center font-bold text-xs w-24 h-full">担当者</div>
                <div className="border-t border-r border-b flex items-center justify-center font-bold text-xs w-24 h-full">進捗</div>
            </div>
            <div id="gantt-task-list" className="overflow-y-hidden" style={{height: `${calendarSize.height}px`}}>
                {displayTasks.map((task: any, index: any) => {
                    return (
                        <div key={index} className="flex h-10 border-b">
                            {task.cat === 'category' &&
                                <div className="flex items-center font-bold w-full text-sm pl-2">
                                    {task.name}
                                </div>
                            }
                            {task.cat === 'task' &&
                                <>
                                    <div className="border-r flex items-center font-bold w-48 text-sm pl-4">
                                        {task.name}
                                    </div>
                                    <div className="border-r flex items-center justify-center w-24 text-sm">
                                        {task.start_date}
                                    </div>
                                    <div className="border-r flex items-center justify-center w-24 text-sm">
                                        {task.end_date}
                                    </div>
                                    <div className="border-r flex items-center justify-center w-24 text-sm">
                                        {task.incharge_user}
                                    </div>
                                    <div className="border-r flex items-center justify-center w-24 text-sm">
                                        {task.percentage}%
                                    </div>
                                </>
                            }
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export { GanttTask };
