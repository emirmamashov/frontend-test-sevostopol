import { Component, OnInit } from '@angular/core';

// config
import { Year, Days, Months, Cells } from '../../config';

// models
import { Month } from '../models/month';
import { ResMonth, ShowDay, Task } from '../models/resmonth';

// services
import { MyLocalStorageService } from '../../services/local-storage.service';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  currentMonth: Month;
  currentMonthIndex: number = new Date().getMonth();
  prevMonth: Month;
  nextMonth: Month;

  year: number = Year;
  days: Array<string> = Days;
  months: Array<Month> = Months;
  cells: number = Cells;
  monthWeeks = [0, 1, 2, 3, 4];
  weekDays = [0, 1, 2, 3, 4, 5, 6];

  resMonths = new Array<ResMonth>();

  addTask = new Task();
  tasks = new Array<Task>();
  searchResultTasks = new Array<Task>();

  isAddNewTask = false;
  today = new ShowDay();

  constructor(
    private localStorage: MyLocalStorageService
  ) { }

  ngOnInit() {
    this.setCurrentMonth();
    this.setNextMonth();
    this.setPrevMonth();
    this.chunkMonth();
  }

  doNextMonth() {
    console.log('-----doNextMonth----');
    this.currentMonthIndex = (this.currentMonthIndex >= this.months.length - 1) ? 0 : this.currentMonthIndex + 1;
    this.setCurrentMonth();
    this.setNextMonth();
    this.setPrevMonth();
    this.chunkMonth();
  }

  doPrevMonth() {
    console.log('-----doPrevMonth----');
    this.currentMonthIndex = (this.currentMonthIndex === 0) ? this.months.length - 1 : this.currentMonthIndex - 1;
    this.setCurrentMonth();
    this.setNextMonth();
    this.setPrevMonth();
    this.chunkMonth();
  }

  doReturnCurrentMonth() {
    console.log('-----doReturnCurrentMonth----');
    this.currentMonthIndex = new Date().getMonth();
    this.setCurrentMonth();
    this.setNextMonth();
    this.setPrevMonth();
    this.chunkMonth();
  }

  doToMonth(date: string) {
    console.log('-----doToMonth----');
    const dateArr = date.split('.');
    const month: number = parseInt(dateArr[1]);
    this.currentMonthIndex = month;
    this.setCurrentMonth();
    this.setNextMonth();
    this.setPrevMonth();
    this.chunkMonth();
  }

  getAllTasks() {
    this.tasks = this.localStorage.getTasks();
    console.log(this.tasks);
  }

  setTaskToWeekDay(resMonth: ResMonth) {
    this.tasks.forEach(task => {
      resMonth.days.forEach(day => {
          const taskDate = day.day + '.' + this.currentMonthIndex + '.' + this.year;
          if (day.isShow && taskDate === task.date) {
            day.task = new Task();
            day.task = task;
          }
      });
    });
  }

  setCurrentMonth() {
    this.currentMonth = this.months[this.currentMonthIndex];
    console.log(this.currentMonth);
  }

  setPrevMonth() {
    this.prevMonth = this.months[this.currentMonthIndex - 1];
  }

  setNextMonth() {
    this.nextMonth = this.months[this.currentMonthIndex + 1];
  }

  setToday(newShowDay: ShowDay) {
    const nowDate = new Date();
    if (this.currentMonthIndex === nowDate.getMonth()) {
      if (nowDate.getDate() === newShowDay.day) {
        newShowDay.isToday = true;
        this.today = newShowDay;
      }
    }
  }
  chunkMonth() {
    let daysCount = 0;
    let prevMonthDayCount = this.prevMonth.days - this.currentMonth.beginDayIndex;
    let nextMonthDayCount = 0;
    this.getAllTasks();
    this.resMonths = new Array<ResMonth>();

    this.monthWeeks.forEach(week => {
      const newMonth = new ResMonth();
      newMonth.days = new Array<ShowDay>();
      this.weekDays.forEach(day => {
        if (week === 0) {
          if (this.currentMonth.beginDayIndex <= day) {
            daysCount = daysCount + 1;
            const newShowDay = new ShowDay();
            newShowDay.day = daysCount;
            newShowDay.isShow = true;
            newMonth.days.push(newShowDay);

            this.setToday(newShowDay);
          } else {
            prevMonthDayCount = prevMonthDayCount + 1;
            const newShowDay = new ShowDay();
            newShowDay.day = prevMonthDayCount;
            newShowDay.isShow = false;
            newMonth.days.push(newShowDay);
            this.setToday(newShowDay);
          }
        } else if (week === this.monthWeeks[this.monthWeeks.length - 1]) {
          if (this.currentMonth.days > daysCount) {
            daysCount = daysCount + 1;
            const newShowDay = new ShowDay();
            newShowDay.day = daysCount;
            newShowDay.isShow = true;
            newMonth.days.push(newShowDay);
            this.setToday(newShowDay);
          } else {
            nextMonthDayCount = nextMonthDayCount + 1;
            const newShowDay = new ShowDay();
            newShowDay.day = nextMonthDayCount;
            newShowDay.isShow = false;
            newMonth.days.push(newShowDay);
            this.setToday(newShowDay);
          }
        } else {
          daysCount = daysCount + 1;
          const newShowDay = new ShowDay();
          newShowDay.day = daysCount;
          newShowDay.isShow = true;
          newMonth.days.push(newShowDay);
          this.setToday(newShowDay);
        }
      });

      this.resMonths.push(newMonth);
      this.setTaskToWeekDay(newMonth);
    });
  }

  doAddTask(day: ShowDay, task: Task) {
    console.log(day);
    task.date = day.day + '.' + this.currentMonthIndex + '.' + this.year;
    day.task = task;
    day.isShowAddModal = false;
    this.addTask = new Task();
    this.tasks = this.tasks.filter(x => x.date !== task.date);
    this.tasks.push(task);
    this.setAllTasksInLocalStorage(this.tasks);
  }

  doAddTaskToday(task: Task) {
    console.log(this.today);
    this.today.task = task || new Task();
    this.isAddNewTask = false;

    this.tasks = this.tasks.filter(x => x.date !== task.date);
    this.tasks.push(task);
    this.setAllTasksInLocalStorage(this.tasks);
  }

  doRemoveTaskToday() {
    this.today.task = new Task();
    this.isAddNewTask = false;
  }

  setAllTasksInLocalStorage(tasks: Array<Task>) {
    this.localStorage.setTasks(tasks);
  }

  deleteTask(day: ShowDay) {
    day.isShowAddModal = false;

    this.tasks = this.tasks.filter(x => x.date !== day.task.date);
    this.setAllTasksInLocalStorage(this.tasks);

    day.task = new Task();
    this.addTask = new Task();
  }

  setTask(task: Task) {
    const newtask = new Task();
    newtask.title = task.title;
    newtask.names = task.names;
    newtask.description = task.description;
    this.addTask = newtask || new Task();
  }
  searchTask(text: string) {
    this.searchResultTasks = new Array<Task>();
    if (text) {
      this.tasks.map((task) => {
        if (task.title.search(text) >= 0 || task.description.search(text) >= 0 || task.names.search(text) >= 0) {
          this.searchResultTasks.push(task);
        }
      });
    }
  }

}
