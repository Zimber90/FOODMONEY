import { Injectable } from '@angular/core';

export type ThemeType = 'light' | 'dark' | 'orange' | 'green' | 'purple';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme: ThemeType = 'light';

  constructor() {
    const savedTheme = localStorage.getItem('app_theme') as ThemeType;
    if (savedTheme) {
      this.setTheme(savedTheme);
    }
  }

  setTheme(theme: ThemeType) {
    this.currentTheme = theme;
    localStorage.setItem('app_theme', theme);
    document.body.setAttribute('data-theme', theme);
  }

  getTheme(): ThemeType {
    return this.currentTheme;
  }
}