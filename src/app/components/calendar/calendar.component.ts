import { Component, inject, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarSettingsService } from '../../services/calendar-settings.service';
import { LucideAngularModule, ChevronLeft, ChevronRight } from 'lucide-angular';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="calendar-card" [style.borderRadius]="settings.borderRadius">
      <div class="calendar-header">
        <button (click)="changeMonth(-1)" class="nav-btn">
          <lucide-icon [name]="prevIcon" size="20"></lucide-icon>
        </button>
        <h3 class="month-title">{{ monthNames[currentDate.getMonth()] }} {{ currentDate.getFullYear() }}</h3>
        <button (click)="changeMonth(1)" class="nav-btn">
          <lucide-icon [name]="nextIcon" size="20"></lucide-icon>
        </button>
      </div>

      <div class="calendar-grid" [ngClass]="settings.fontSize">
        <div class="weekday" *ngFor="let day of weekDays">{{ day }}</div>
        
        <div *ngFor="let empty of emptyDays" class="day empty"></div>
        
        <div *ngFor="let day of daysInMonth" 
             class="day" 
             [class.today]="isToday(day)"
             [class.has-note]="getDayNoteColor(day)"
             [style.borderRadius]="isToday(day) ? settings.borderRadius : '50%'"
             [style.backgroundColor]="isToday(day) ? settings.highlightColor : getDayNoteColor(day)"
             [style.color]="(isToday(day) || getDayNoteColor(day)) ? '#fff' : 'var(--text-color)'">
          {{ day }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .calendar-card {
      background: var(--card-bg);
      padding: 20px;
      box-shadow: 0 10px 30px var(--card-shadow);
      border: 1px solid rgba(128, 128, 128, 0.1);
      width: 100%;
      max-width: 400px;
      margin: 0 auto;
      transition: background-color 0.3s ease, box-shadow 0.3s ease;
    }

    .calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .month-title {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 800;
      text-transform: capitalize;
      color: var(--text-color);
    }

    .nav-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--text-color);
      opacity: 0.6;
      padding: 5px;
      display: flex;
      align-items: center;
    }

    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 5px;
      text-align: center;
    }

    .weekday {
      font-size: 0.75rem;
      font-weight: 700;
      opacity: 0.4;
      padding-bottom: 10px;
      text-transform: uppercase;
      color: var(--text-color);
    }

    .day {
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      color: var(--text-color);
      position: relative;
      z-index: 1;
    }

    /* Font Sizes */
    .small .day { font-size: 0.85rem; }
    .medium .day { font-size: 1rem; }
    .large .day { font-size: 1.2rem; }

    .today {
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }

    .has-note {
      /* Il cerchio è gestito dal background-color dinamico e border-radius 50% */
    }

    .empty {
      cursor: default;
    }
  `]
})
export class CalendarComponent implements OnInit, OnChanges {
  @Input() notes: Note[] = [];
  
  private calendarService = inject(CalendarSettingsService);
  
  readonly prevIcon = ChevronLeft;
  readonly nextIcon = ChevronRight;

  currentDate = new Date();
  weekDays = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
  monthNames = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];

  emptyDays: number[] = [];
  daysInMonth: number[] = [];

  get settings() {
    return this.calendarService.getSettings();
  }

  ngOnInit() {
    this.generateCalendar();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['notes']) {
      // Ricarica se necessario, ma il template reagisce già
    }
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    
    this.emptyDays = Array(offset).fill(0);
    
    const lastDay = new Date(year, month + 1, 0).getDate();
    this.daysInMonth = Array.from({ length: lastDay }, (_, i) => i + 1);
  }

  changeMonth(delta: number) {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + delta,
      1
    );
    this.generateCalendar();
  }

  isToday(day: number): boolean {
    const today = new Date();
    return (
      day === today.getDate() &&
      this.currentDate.getMonth() === today.getMonth() &&
      this.currentDate.getFullYear() === today.getFullYear()
    );
  }

  getDayNoteColor(day: number): string | null {
    if (!this.notes) return null;
    
    const year = this.currentDate.getFullYear();
    const month = (this.currentDate.getMonth() + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    const dateKey = `${year}-${month}-${dayStr}`;

    const note = this.notes.find(n => n.visitDate === dateKey);
    return note ? note.color : null;
  }
}