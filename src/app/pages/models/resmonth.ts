export class ResMonth {
  days: Array<ShowDay>;
}

export class ShowDay {
  day: number;
  isShow: boolean;
  isShowAddModal: boolean;
  task: Task;
  isToday: boolean;
}

export class Task {
  title: string;
  date: string;
  names: string;
  description: string;
}
