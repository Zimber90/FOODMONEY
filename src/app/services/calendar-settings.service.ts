import { Injectable } from '@angular/core';

export interface CalendarSettings {
  fontSize: 'small' | 'medium' | 'large';
  highlightColor: string;
  borderRadius: '0px' | '8px' | '20px';
  showWeekNumbers: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CalendarSettingsService {
  private settings: CalendarSettings = {
    fontSize: 'medium',
    highlightColor: '#6366f1',
    borderRadius: '8px',
    showWeekNumbers: false
  };

  constructor() {
    const saved = localStorage.getItem('calendar_settings');
    if (saved) {
      this.settings = JSON.parse(saved);
    }
  }

  getSettings() {
    return this.settings;
  }

  updateSetting(key: keyof CalendarSettings, value: any) {
    this.settings = { ...this.settings, [key]: value };
    localStorage.setItem('calendar_settings', JSON.stringify(this.settings));
  }
}