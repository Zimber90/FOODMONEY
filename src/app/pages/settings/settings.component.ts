import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, ChevronLeft } from 'lucide-angular';
import { ThemeService, ThemeType } from '../../services/theme.service';
import { CalendarSettingsService } from '../../services/calendar-settings.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <div class="settings-container">
      <header class="settings-header">
        <button class="back-btn" routerLink="/">
          <lucide-icon [name]="backIcon" size="24"></lucide-icon>
        </button>
        <h1 class="title">Impostazioni</h1>
      </header>

      <div class="settings-list">
        <!-- Sezione Tema -->
        <div class="menu-group">
          <div class="setting-item" (click)="toggleMenu('theme')">
            <div class="circle blue"></div>
            <span>Tema</span>
          </div>
          
          @if (openMenu === 'theme') {
            <div class="dropdown">
              <div class="theme-option" (click)="selectTheme('light')">Light</div>
              <div class="theme-option" (click)="selectTheme('dark')">Dark</div>
              <div class="theme-option" (click)="selectTheme('orange')">Orange</div>
              <div class="theme-option" (click)="selectTheme('green')">Green</div>
              <div class="theme-option" (click)="selectTheme('purple')">Purple</div>
            </div>
          }
        </div>
        
        <!-- Sezione Calendario -->
        <div class="menu-group">
          <div class="setting-item" (click)="toggleMenu('calendar')">
            <div class="circle teal"></div>
            <span>Impostazione calendario</span>
          </div>
          
          @if (openMenu === 'calendar') {
            <div class="dropdown calendar-options">
              <div class="option-row">
                <label>Grandezza numeri</label>
                <div class="btn-group">
                  <button (click)="updateCal('fontSize', 'small')" [class.active]="calSettings.fontSize === 'small'">A</button>
                  <button (click)="updateCal('fontSize', 'medium')" [class.active]="calSettings.fontSize === 'medium'">A+</button>
                  <button (click)="updateCal('fontSize', 'large')" [class.active]="calSettings.fontSize === 'large'">A++</button>
                </div>
              </div>

              <div class="option-row">
                <label>Colore evidenziatore</label>
                <div class="color-group">
                  @for (color of highlightColors; track color) {
                    <div 
                      class="color-pick" 
                      [style.backgroundColor]="color"
                      [class.selected]="calSettings.highlightColor === color"
                      (click)="updateCal('highlightColor', color)">
                    </div>
                  }
                </div>
              </div>

              <div class="option-row">
                <label>Stile angoli</label>
                <div class="btn-group">
                  <button (click)="updateCal('borderRadius', '0px')" [class.active]="calSettings.borderRadius === '0px'">Squadrati</button>
                  <button (click)="updateCal('borderRadius', '20px')" [class.active]="calSettings.borderRadius === '20px'">Arrotondati</button>
                </div>
              </div>
            </div>
          }
        </div>
        
        <div class="setting-item">
          <div class="circle green"></div>
          <span>Altro</span>
        </div>
        
        <div class="setting-item">
          <div class="circle purple"></div>
          <span>Info app</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      height: 100vh;
      background-color: var(--bg-color);
      padding: 20px;
      transition: background-color 0.3s ease;
    }

    .settings-header {
      background-color: var(--header-bg);
      border-radius: 50px;
      display: flex;
      align-items: center;
      padding: 10px 20px;
      color: var(--header-text);
      margin-bottom: 40px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }

    .back-btn {
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 0;
      margin-right: 10px;
    }

    .title {
      flex: 1;
      text-align: center;
      font-size: 1.4rem;
      font-weight: 800;
      margin: 0;
      margin-right: 34px;
    }

    .settings-list {
      display: flex;
      flex-direction: column;
      gap: 25px;
      padding-left: 10px;
    }

    .setting-item {
      display: flex;
      align-items: center;
      gap: 20px;
      cursor: pointer;
    }

    .setting-item span {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-color);
    }

    .circle {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .circle.blue { background-color: #5d7a99; }
    .circle.teal { background-color: #14918b; }
    .circle.green { background-color: #b8d0a0; }
    .circle.purple { background-color: #c596c5; }

    .dropdown {
      margin-top: 15px;
      margin-left: 10px;
      margin-right: 10px;
      border: 3px solid var(--border-color);
      border-radius: 15px;
      padding: 15px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      animation: slideDown 0.2s ease-out;
    }

    .theme-option {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-color);
      cursor: pointer;
      padding: 4px 0;
    }

    .calendar-options {
      gap: 20px;
    }

    .option-row {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .option-row label {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--text-color);
      opacity: 0.8;
    }

    .btn-group {
      display: flex;
      gap: 8px;
    }

    .btn-group button {
      flex: 1;
      padding: 8px;
      border: 2px solid var(--border-color);
      background: transparent;
      color: var(--text-color);
      border-radius: 10px;
      font-weight: 700;
      cursor: pointer;
    }

    .btn-group button.active {
      background: var(--header-bg);
      color: var(--header-text);
      border-color: var(--header-bg);
    }

    .color-group {
      display: flex;
      gap: 12px;
    }

    .color-pick {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      cursor: pointer;
      border: 2px solid transparent;
    }

    .color-pick.selected {
      border-color: var(--text-color);
      transform: scale(1.1);
    }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class SettingsComponent {
  private themeService = inject(ThemeService);
  private calendarService = inject(CalendarSettingsService);
  
  readonly backIcon = ChevronLeft;
  openMenu: 'theme' | 'calendar' | null = null;
  
  highlightColors = ['#6366f1', '#ef4444', '#10b981', '#f59e0b', '#ec4899'];

  get calSettings() {
    return this.calendarService.getSettings();
  }

  toggleMenu(menu: 'theme' | 'calendar') {
    this.openMenu = this.openMenu === menu ? null : menu;
  }

  selectTheme(theme: ThemeType) {
    this.themeService.setTheme(theme);
  }

  updateCal(key: any, value: any) {
    this.calendarService.updateSetting(key, value);
  }
}