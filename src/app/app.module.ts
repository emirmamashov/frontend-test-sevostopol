import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
// modules
// primeng
import { ScheduleModule } from 'primeng/primeng';


// localstorage
import { LocalStorageModule, LocalStorageService } from 'angular-2-local-storage';

// services
import { MyLocalStorageService } from './services/local-storage.service';

import { AppComponent } from './app.component';
import { CalendarComponent } from './pages/calendar/calendar.component';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ScheduleModule,
    LocalStorageModule.withConfig({
      prefix: 'app-root',
      storageType: 'localStorage'
    }),
  ],
  providers: [
    LocalStorageService,
    MyLocalStorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
