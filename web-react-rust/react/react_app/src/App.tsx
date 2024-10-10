import React, { ChangeEvent, SyntheticEvent } from 'react';
import logo from './logo.svg';
import './App.css';
import './style.css';
import { start } from "repl";
import { GanttDate } from "./conponents/GanttDate";
import { GanttBarArea } from "./conponents/GanttBarArea";

function App() {
	function getDays(year: number, month: number, blockNumber: number) {
		const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];

		let date = new Date(`${year}-${month}-01`);
		let lastDateOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
		let days = [];

		for (let i = 0; i < lastDateOfMonth.getDate(); i++) {
			days.push({
				day: date.getDate(),
				dayOfWeek: daysOfWeek[date.getDay()],
				blockNumber: blockNumber + i,
			});
	
			date.setDate(date.getDate() + 1);
		}

		return days;
	}

	function getCalendar(startDate: Date, endDate: Date) {
		let yearDiff = endDate.getFullYear() - startDate.getFullYear();
		let monthDiff = endDate.getMonth() + (12 * yearDiff) - startDate.getMonth();

		let calendars = [];
		let date = new Date(startDate);
		let blockNumber = 0;

		for (let i = 0; i <= monthDiff; i++) {
			let month = date.getMonth() + 1;
			let days = getDays(date.getFullYear(), month, blockNumber);
			let yearMonth = `${date.getFullYear()}年${month}月`

			calendars.push({
				date: yearMonth,
				year: date.getFullYear(),
				month: month,
				startBlockNumber: blockNumber,
				calendar: days.length,
				days: days,
			});

			date.setMonth(date.getMonth() + 1);
			blockNumber = days[days.length - 1].blockNumber + 1;
		}

		return calendars;
	}

	function getCalendarSize() {
		const scrollBarHeight = 20;
		const headerHeight = 48;

		const taskElement = document.getElementById("gantt-task-title");
		const taskWidth = taskElement ? taskElement.offsetWidth : 0;
		const taskHeight = taskElement ? taskElement.offsetHeight : 0;

		const calendarWidth = window.innerWidth - taskWidth;
		const calendarHeight = window.innerHeight - taskHeight - headerHeight - scrollBarHeight;

		return {width: calendarWidth, height: calendarHeight};
	}

	function getTasks() {
		let obj = {
			categories: [
				{
					id: 1,
					name: 'テストA',
					collapsed: false,
				},
				{
					id: 2,
					name: 'テストB',
					collapsed: false,
				}
			],
			tasks: [
				{
					id: 1,
					category_id: 1,
					name: 'テスト1',
					start_date: '2020-11-18',
					end_date: '2020-11-20',
					incharge_user: '鈴木',
					percentage: 100,
					},
				{
					id: 2,
					category_id: 1,
					name: 'テスト2',
					start_date: '2020-11-19',
					end_date: '2020-11-23',
					incharge_user: '佐藤',
					percentage: 90,
				},
				{
					id: 3,
					category_id: 1,
					name: 'テスト3',
					start_date: '2020-11-19',
					end_date: '2020-12-04',
					incharge_user: '鈴木',
					percentage: 40,
				},
				{
					id: 4,
					category_id: 1,
					name: 'テスト4',
					start_date: '2020-11-21',
					end_date: '2020-11-30',
					incharge_user: '山下',
					percentage: 60,
				},
				{
					id: 5,
					category_id: 1,
					name: 'テスト5',
					start_date: '2020-11-25',
					end_date: '2020-12-04',
					incharge_user: '佐藤',
					percentage: 5,
				},
				{
					id: 6,
					category_id: 2,
					name: 'テスト6',
					start_date: '2020-11-28',
					end_date: '2020-12-08',
					incharge_user: '佐藤',
					percentage: 0,
				},
			],
		}

		let arr: any = [];
		obj.categories.map((category) => {
			arr.push({cat: 'category', ...category});

			obj.tasks.map((task) => {
				if (task.category_id === category.id) {
					arr.push({cat: 'task', ...task});
				}
			});
		});

		return arr;
	}

	function getTaskBars(startDate: Date, tasks: any, blockSize: number) {
		let top = 10;

		let taskBars = tasks.map((task: any) => {
			let style = {};

			if (task.cat === 'task') {
				let date_from: Date = new Date(task.start_date);
				let date_to: Date = new Date(task.end_date);
				let diff: number = Math.floor((date_to.getTime() - date_from.getTime()) / (24 * 60 * 60 * 1000));
				let between: number = diff + 1;
				let start: number = Math.floor((date_from.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
				let left: number = start * blockSize;

				style = {
					top: `${top}px`,
					left: `${left}px`,
					width: `${blockSize * between}px`,
				};
			}

			top += 40;

			return {
				style,
				task,
			};
		});

		return taskBars;
	}

	function getDisplayTasks(tasks: any, positionId: number, calendarHeight: number) {
		const displayTaskNumber = Math.floor(calendarHeight / 40);
		return tasks.slice(positionId, positionId + displayTaskNumber);
	}

	const startDate = new Date('2020-11-01');
	const endDate = new Date('2021-01-01');
	const blockSize = 30;
	let calendars = getCalendar(startDate, endDate);
	let positionId = 0;
	const fps = 1000 / 30;

	const [calendarSize, setCalendarSize] = React.useState({width: 0, height: 0});
	const [tasks, setTasks] = React.useState(getTasks());
	const [displayTasks, setDisplayTasks] = React.useState([]);
	const [taskBars, setTaskBars] = React.useState([]);

	let moved: {
		dragging: boolean,
		pageX: number,
		element: HTMLElement | null,
		left: string,
		taskId: number,
		width: string,
		leftResizing: boolean,
		rightResizing: boolean
	} = {
		dragging: false,
		pageX: 0,
		element: null,
		left: '',
		taskId: -1,
		width: '',
		leftResizing: false,
		rightResizing: false,
	}

	let movingPageX = 0;

	function handleMouseDownMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>, task: any) {
		if (e.target instanceof HTMLElement) {
			moved = {
				dragging: true,
				pageX: e.pageX,
				element: e.target,
				left: e.target.style.left,
				taskId: task.id,
				width: '',
				leftResizing: false,
				rightResizing: false,
			};

			movingPageX = e.pageX;
			animation();
		}
	}

	function handleMouseDownResize(e: React.MouseEvent<HTMLDivElement, MouseEvent>, task: any, direction: string) {
		if (e.target instanceof HTMLElement) {
			direction === 'left' ? moved.leftResizing = true : moved.rightResizing = true;
			moved.pageX = e.pageX;
			moved.taskId = task.id;

			let width = e.target.parentElement?.style.width;
			let left = e.target.parentElement?.style.left;

			moved.element = e.target.parentElement;

			if (width !== undefined) {
				moved.width = width;
			}

			if (left !== undefined) {
				moved.left = left;
			}

			movingPageX = e.pageX;
			animation();
		}

		e.stopPropagation();
	}

	React.useEffect(() => {
		const nowCalendarSize = getCalendarSize();
		const nowDisplayTasks = getDisplayTasks(tasks, positionId, nowCalendarSize.height);
		const nowTaskBars = getTaskBars(startDate, nowDisplayTasks, blockSize);
		setCalendarSize(nowCalendarSize);
		setDisplayTasks(nowDisplayTasks);
		setTaskBars(nowTaskBars);
	}, []);

	window.addEventListener('resize', () => {
		setCalendarSize(getCalendarSize());
	});

	window.addEventListener('wheel', (e) => {
		let height = tasks.length - positionId;

		if (e.deltaY > 0 && height * 40 > calendarSize.height) {
			positionId++;
		} else if (e.deltaY < 0 && positionId !== 0) {
			positionId--;
		}

		const nowDisplayTasks = getDisplayTasks(tasks, positionId, calendarSize.height);
		const nowTaskBars = getTaskBars(startDate, nowDisplayTasks, blockSize);
		setDisplayTasks(nowDisplayTasks);
		setTaskBars(nowTaskBars);
	});

	window.addEventListener('mousemove', (e) => {
		movingPageX = e.pageX;
	});

	window.addEventListener('mouseup', (e) => {
		if (moved.dragging) {
			let diff = moved.pageX - e.pageX;
			let days = Math.ceil(diff / blockSize);

			if (days !== 0) {
				let newTasks = tasks.map((task: any) => {
					if (task.id === moved.taskId && task.cat === 'task') {
						let startDate = new Date(task.start_date);
						startDate.setDate(startDate.getDate() - days);
						let endDate = new Date(task.end_date);
						endDate.setDate(endDate.getDate() - days);

						task.start_date = `${startDate.getFullYear()}-${('0' + (startDate.getMonth() + 1)).slice(-2)}-${('0' + startDate.getDate()).slice(-2)}`;
						task.end_date = `${endDate.getFullYear()}-${('0' + (endDate.getMonth() + 1)).slice(-2)}-${('0' + endDate.getDate()).slice(-2)}`;
					}

					return task;
				});

				let newDisplayTasks = getDisplayTasks(newTasks, positionId, calendarSize.height);
				let newTaskBars = getTaskBars(startDate, newDisplayTasks, blockSize);
				setTasks(newTasks);
				setDisplayTasks(newDisplayTasks);
				setTaskBars(newTaskBars);
			} else if (moved.element) {
				moved.element.style.left = `${moved.left.replace('px', '')}px`;
			}
		}

		if (moved.leftResizing) {
			let diff = moved.pageX - e.pageX;
			let days = Math.ceil(diff / blockSize);

			if (days !== 0) {
				let newTasks = tasks.map((task: any) => {
					if (task.id === moved.taskId && task.cat === 'task') {
						let startDate = new Date(task.start_date);
						startDate.setDate(startDate.getDate() - days);
						let endDate = new Date(task.end_date);
						let diffDate: number = Math.floor((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));

						if (diffDate <= 0) {
							task.start_date = `${endDate.getFullYear()}-${('0' + (endDate.getMonth() + 1)).slice(-2)}-${('0' + endDate.getDate()).slice(-2)}`;
						} else {
							task.start_date = `${startDate.getFullYear()}-${('0' + (startDate.getMonth() + 1)).slice(-2)}-${('0' + startDate.getDate()).slice(-2)}`;
						}
					}

					return task;
				});

				let newDisplayTasks = getDisplayTasks(newTasks, positionId, calendarSize.height);
				let newTaskBars = getTaskBars(startDate, newDisplayTasks, blockSize);
				setTasks(newTasks);
				setDisplayTasks(newDisplayTasks);
				setTaskBars(newTaskBars);
			} else if (moved.element) {
				moved.element.style.width = moved.width;
				moved.element.style.left = `${moved.left.replace('px', '')}px`;
			}
		}

		if (moved.rightResizing) {
			let diff = moved.pageX - e.pageX;
			let days = Math.ceil(diff / blockSize);

			if (days === 1) {
				if (moved.element) {
					moved.element.style.width = `${parseInt(moved.width.replace('px', ''))}px`;
				}
			} else if (days <= 2) {
				days--;

				let newTasks = tasks.map((task: any) => {
					if (task.id === moved.taskId && task.cat === 'task') {
						let endDate = new Date(task.end_date);
						endDate.setDate(endDate.getDate() - days);
						task.end_date = `${endDate.getFullYear()}-${('0' + (endDate.getMonth() + 1)).slice(-2)}-${('0' + endDate.getDate()).slice(-2)}`;
					}

					return task;
				});

				let newDisplayTasks = getDisplayTasks(newTasks, positionId, calendarSize.height);
				let newTaskBars = getTaskBars(startDate, newDisplayTasks, blockSize);
				setTasks(newTasks);
				setDisplayTasks(newDisplayTasks);
				setTaskBars(newTaskBars);
			} else {
				let newTasks = tasks.map((task: any) => {
					if (task.id === moved.taskId && task.cat === 'task') {
						let startDate = new Date(task.start_date);
						let endDate = new Date(task.end_date);
						endDate.setDate(endDate.getDate() - days);
						let diffDate: number = Math.floor((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));

						if (diffDate < 0) {
							task.end_date = `${startDate.getFullYear()}-${('0' + (startDate.getMonth() + 1)).slice(-2)}-${('0' + startDate.getDate()).slice(-2)}`;
						} else {
							task.end_date = `${endDate.getFullYear()}-${('0' + (endDate.getMonth() + 1)).slice(-2)}-${('0' + endDate.getDate()).slice(-2)}`;
						}
					}

					return task;
				});

				let newDisplayTasks = getDisplayTasks(newTasks, positionId, calendarSize.height);
				let newTaskBars = getTaskBars(startDate, newDisplayTasks, blockSize);
				setTasks(newTasks);
				setDisplayTasks(newDisplayTasks);
				setTaskBars(newTaskBars);
			}
		}

		moved.dragging = false;
		moved.leftResizing = false;
		moved.rightResizing = false;
	});

	// タスクバーのドラッグイベントを禁止する
	window.addEventListener('dragstart', (e) => {
		e.preventDefault();
	});

	function animation() {
		if (!moved.dragging && !moved.leftResizing && !moved.rightResizing) {
			return;
		}

		if (moved.dragging) {
			let diff = moved.pageX - movingPageX;

			if (moved.element) {
				moved.element.style.left = `${parseInt(moved.left.replace('px', '')) - diff}px`;
			}
		}

		if (moved.leftResizing) {
			let diff = moved.pageX - movingPageX;
			let width = parseInt(moved.width.replace('px', ''));
			let left = parseInt(moved.left.replace('px', ''));

			if (width + diff > blockSize) {
				if (moved.element) {
					moved.element.style.width = `${width + diff}px`;
					moved.element.style.left = `${left - diff}px`;
				}
			}
		}

		if (moved.rightResizing) {
			let diff = moved.pageX - movingPageX;
			let width = parseInt(moved.width.replace('px', ''));

			if (width - diff > blockSize) {
				if (moved.element) {
					moved.element.style.width = `${width - diff}px`;
				}
			}
		}

		setTimeout(animation, fps);
	}

	return (
		<div>
			<div id="app">
				<div id="gantt-header" className="h-12 p-2 flex items-center">
					<h1 className="text-xl font-bold">ガントチャート</h1>
					<div className="ml-20">表示範囲</div>
					<select className="border mx-2 p-1">
						<option>2020</option>
						<option>2021</option>
						<option>2022</option>
						<option>2023</option>
						<option>2024</option>
						<option>2025</option>
					</select>
					年
					<select className="border mx-2 p-1">
						<option>01</option>
						<option>02</option>
						<option>03</option>
						<option>04</option>
						<option>05</option>
						<option>06</option>
						<option>07</option>
						<option>08</option>
						<option>09</option>
						<option>10</option>
						<option>11</option>
						<option>12</option>
					</select>
					月～
					<select className="border mx-2 p-1">
						<option>2020</option>
						<option>2021</option>
						<option>2022</option>
						<option>2023</option>
						<option>2024</option>
						<option>2025</option>
					</select>
					年
					<select className="border mx-2 p-1">
						<option>01</option>
						<option>02</option>
						<option>03</option>
						<option>04</option>
						<option>05</option>
						<option>06</option>
						<option>07</option>
						<option>08</option>
						<option>09</option>
						<option>10</option>
						<option>11</option>
						<option>12</option>
					</select>
					月
				</div>
				<div id="gantt-content" className="flex">
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
					<div id="gantt-calendar" className="overflow-x-scroll overflow-y-hidden border-l" style={{width: `${calendarSize.width}px`}}>
						<GanttDate calendars={calendars} calendarSize={calendarSize} blockSize={blockSize} />
						<GanttBarArea calendarSize={calendarSize} taskBars={taskBars} onMouseDownMove={handleMouseDownMove} onMouseDownResize={handleMouseDownResize} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
