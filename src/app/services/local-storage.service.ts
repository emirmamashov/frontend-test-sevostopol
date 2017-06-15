import { Injectable } from '@angular/core';

// services
import { LocalStorageService } from 'angular-2-local-storage';

// models
import { Task } from '../pages/models/resmonth';

@Injectable()
export class MyLocalStorageService {

  constructor(
    private localStorageService: LocalStorageService
  ) { }

  private get(name: string): any {
    return this.localStorageService.get(name);
  }

  private set(name: string, value: any): any {
    if (this.localStorageService.get(name)) {
      this.localStorageService.set(name, value);
    } else {
      this.localStorageService.add(name, value);
    }
  }

  getTasks() {
    return this.get('tasks') || new Array<Task>();
  }

  setTasks(tasks: Array<Task>) {
    this.set('tasks', tasks);
  }
}
