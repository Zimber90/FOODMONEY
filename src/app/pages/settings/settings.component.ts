import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, ChevronLeft, Info, ShieldCheck, Code2 } from 'lucide-angular';
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
        
        <!-- Sezione Info App -->
        <div class="menu-group">
          <div class="setting-item" (click)="toggleMenu('info')">
            <div class="circle purple"></div>
            <span>Info app</span>
          </div>

          @if (openMenu === 'info') {
            <div class="dropdown info-content">
              <div class="info-header">
                <div class="app-icon">
                  <lucide-icon [name]="infoIcon" size="32"></lucide-icon>
                </div>
                <div class="app-details">
                  <h3>Il Mio Spazio</h3>
                  <p>Versione 1.0.0</p>
                </div>
              </div>
              
              <div class="info-section">
                <div class="info-row">
                  <lucide-icon [name]="shieldIcon" size="18"></lucide-icon>
                  <p>I tuoi dati sono salvati localmente e non lasciano mai il dispositivo.</p>
                </div>
                <div class="info-row">
                  <lucide-icon [name]="codeIcon" size="18"></lucide-icon>
                  <p>Sviluppato con Angular 17 e Lucide Icons.</p>
                </div>
              </div>

              <div class="info-footer">
                <p>© 2024 Dyad AI. Tutti i diritti riservati.</p>
              </div>
            </div>
          }
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

    /* Info Styles */
    .info-header {
      display: flex;
      align-items: center;
      gap: 15px;
      padding-bottom: 15px;
      border-bottom: 1px solid var(--border-color);
      opacity: 0.9;
    }

    .app-icon {
      background: var(--header-bg);
      color: var(--header-text);
      padding: 10px;
      border-radius: 12px;
    }

    .app-details h3 {
      margin: 0;
      font-size: 1.1rem;
      color: var(--text-color);
    }

    .app-details p {
      margin: 0;
      font-size: 0.85rem;
      opacity: 0.7;
      color: var(--text-color);
    }

    .info-section {
      display: flex;
      flex-direction: column;
      gap: 15px;
      padding: 10px 0;
    }

    .info-row {
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }

    .info-row p {
      margin: 0;
      font-size: 0.9rem;
      line-height: 1.4;
      color: var(--text-color);
    }

    .info-footer {
      text-align: center;
      padding-top: 10px;
      font-size: 0.75rem;
      opacity: 0.5;
      color: var(--text-color);
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
  readonly infoIcon = Info;
  readonly shieldIcon = ShieldCheck;
  readonly codeIcon = Code2;

  openMenu: 'theme' | 'calendar' | 'info' | null = null;
  
  highlightColors = ['#6366f1', '#ef4444', '#10b981', '#f59e0b', '#ec4899'];

  get calSettings() {
    return this.calendarService.getSettings();
  }

  toggleMenu(menu: 'theme' | 'calendar' | 'info') {
    this.openMenu = this.openMenu === menu ? null : menu;
  }

  selectTheme(theme: ThemeType) {
    this.themeService.setTheme(theme);
  }

  updateCal(key: any, value: any) {
    this.calendarService.updateSetting(key, value);
  }
}