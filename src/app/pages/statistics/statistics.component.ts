import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, ChevronLeft, BarChart3, TrendingUp, Wallet, Search, Calendar, Filter } from 'lucide-angular';
import { StorageService } from '../../services/storage.service';
import { Note } from '../../models/note.model';

type TimeRange = 'all' | 'week' | 'month' | 'year';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LucideAngularModule],
  template: `
    <div class="stats-container">
      <header class="stats-header">
        <button class="back-btn" routerLink="/main">
          <lucide-icon [name]="backIcon" size="24"></lucide-icon>
        </button>
        <h1 class="title">Analisi Spese</h1>
      </header>

      <!-- Barra di Ricerca e Filtri -->
      <div class="filter-section">
        <div class="search-bar">
          <lucide-icon [name]="searchIcon" size="18"></lucide-icon>
          <input 
            [(ngModel)]="searchTerm" 
            (ngModelChange)="applyFilters()" 
            placeholder="Cerca ristorante...">
        </div>

        <div class="time-filters">
          <button 
            [class.active]="activeRange === 'all'" 
            (click)="setRange('all')">Tutto</button>
          <button 
            [class.active]="activeRange === 'year'" 
            (click)="setRange('year')">Anno</button>
          <button 
            [class.active]="activeRange === 'month'" 
            (click)="setRange('month')">Mese</button>
          <button 
            [class.active]="activeRange === 'week'" 
            (click)="setRange('week')">Settimana</button>
        </div>
      </div>

      <div class="stats-content">
        <!-- Riepilogo Numerico -->
        <div class="overview-cards">
          <div class="stat-card main-stat">
            <div class="stat-info">
              <span class="label">Spesa nel periodo</span>
              <h2 class="value">€ {{ totalSpent | number:'1.2-2' }}</h2>
            </div>
            <div class="icon-box blue">
              <lucide-icon [name]="walletIcon" size="28"></lucide-icon>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-info">
              <span class="label">Ordini effettuati</span>
              <h2 class="value">{{ totalOrders }}</h2>
            </div>
            <div class="icon-box green">
              <lucide-icon [name]="chartIcon" size="24"></lucide-icon>
            </div>
          </div>
        </div>

        <!-- Lista Risultati -->
        <div class="section-header">
          <div class="title-with-icon">
            <lucide-icon [name]="trendingIcon" size="20"></lucide-icon>
            <h3>Dettaglio per Ristorante</h3>
          </div>
          <span class="count-badge">{{ restaurantStats.length }} risultati</span>
        </div>

        <div class="restaurant-list">
          @for (item of restaurantStats; track item.name) {
            <div class="res-card" [style.borderLeftColor]="item.color">
              <div class="res-main">
                <div class="res-info">
                  <h4>{{ item.name }}</h4>
                  <p>{{ item.count }} {{ item.count === 1 ? 'ordine' : 'ordini' }}</p>
                </div>
                <div class="res-spent">
                  <span class="amount">€ {{ item.spent | number:'1.2-2' }}</span>
                  <div class="percentage-bar">
                    <div class="fill" [style.width.%]="(item.spent / totalSpent) * 100" [style.backgroundColor]="item.color"></div>
                  </div>
                </div>
              </div>
            </div>
          } @empty {
            <div class="empty-state">
              <lucide-icon [name]="filterIcon" size="48"></lucide-icon>
              <p>Nessun dato trovato per i filtri selezionati.</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-container {
      height: 100vh;
      background-color: var(--bg-color);
      padding: 20px;
      transition: background-color 0.3s ease;
      overflow-y: auto;
    }

    .stats-header {
      background-color: var(--header-bg);
      border-radius: 50px;
      display: flex;
      align-items: center;
      padding: 10px 20px;
      color: var(--header-text);
      margin-bottom: 20px;
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
    }

    .title {
      flex: 1;
      text-align: center;
      font-size: 1.4rem;
      font-weight: 800;
      margin: 0;
      margin-right: 24px;
    }

    /* Filtri */
    .filter-section {
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-bottom: 25px;
    }

    .search-bar {
      background: var(--card-bg);
      border-radius: 16px;
      padding: 12px 18px;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 4px 12px var(--card-shadow);
      border: 1px solid rgba(128,128,128,0.1);
    }

    .search-bar input {
      border: none;
      background: none;
      outline: none;
      width: 100%;
      font-family: inherit;
      font-size: 1rem;
      color: var(--text-color);
    }

    .time-filters {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 5px;
    }

    .time-filters button {
      padding: 8px 16px;
      border-radius: 100px;
      border: 2px solid var(--header-bg);
      background: transparent;
      color: var(--text-color);
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s;
    }

    .time-filters button.active {
      background: var(--header-bg);
      color: white;
    }

    /* Cards */
    .overview-cards {
      display: grid;
      grid-template-columns: 1fr;
      gap: 15px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: var(--card-bg);
      padding: 20px;
      border-radius: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 8px 20px var(--card-shadow);
    }

    .main-stat {
      background: var(--header-bg);
      color: white;
    }

    .main-stat .label { color: rgba(255,255,255,0.8); }
    .main-stat .value { color: white; }
    .main-stat .icon-box { background: rgba(255,255,255,0.2); }

    .stat-info .label {
      font-size: 0.85rem;
      font-weight: 600;
      opacity: 0.6;
      color: var(--text-color);
      display: block;
      margin-bottom: 4px;
    }

    .stat-info .value {
      margin: 0;
      font-size: 1.6rem;
      font-weight: 800;
      color: var(--text-color);
    }

    .icon-box {
      width: 50px;
      height: 50px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .icon-box.blue { background-color: #5d7a99; }
    .icon-box.green { background-color: #15803d; }

    /* Lista */
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .title-with-icon {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--text-color);
    }

    .title-with-icon h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 800;
      text-transform: uppercase;
    }

    .count-badge {
      font-size: 0.75rem;
      font-weight: 700;
      background: rgba(128,128,128,0.1);
      padding: 4px 10px;
      border-radius: 100px;
      color: var(--text-color);
      opacity: 0.6;
    }

    .restaurant-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding-bottom: 40px;
    }

    .res-card {
      background: var(--card-bg);
      padding: 18px;
      border-radius: 20px;
      border-left: 6px solid transparent;
      box-shadow: 0 4px 12px var(--card-shadow);
    }

    .res-main {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .res-info h4 {
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-color);
      text-transform: uppercase;
    }

    .res-info p {
      margin: 4px 0 0;
      font-size: 0.8rem;
      opacity: 0.6;
      color: var(--text-color);
    }

    .res-spent {
      text-align: right;
      min-width: 100px;
    }

    .res-spent .amount {
      font-weight: 800;
      font-size: 1.1rem;
      color: var(--text-color);
      display: block;
      margin-bottom: 6px;
    }

    .percentage-bar {
      height: 4px;
      background: rgba(128,128,128,0.1);
      border-radius: 10px;
      overflow: hidden;
    }

    .percentage-bar .fill {
      height: 100%;
      border-radius: 10px;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      opacity: 0.3;
      color: var(--text-color);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
    }

    @media (min-width: 768px) {
      .overview-cards { grid-template-columns: 1fr 1fr; }
    }
  `]
})
export class StatisticsComponent implements OnInit {
  private storage = inject(StorageService);
  
  readonly backIcon = ChevronLeft;
  readonly chartIcon = BarChart3;
  readonly trendingIcon = TrendingUp;
  readonly walletIcon = Wallet;
  readonly searchIcon = Search;
  readonly calendarIcon = Calendar;
  readonly filterIcon = Filter;

  allNotes: Note[] = [];
  filteredNotes: Note[] = [];
  
  searchTerm = '';
  activeRange: TimeRange = 'all';
  
  totalSpent = 0;
  totalOrders = 0;
  restaurantStats: { name: string, count: number, spent: number, color: string }[] = [];

  ngOnInit() {
    this.allNotes = this.storage.getNotes();
    this.applyFilters();
  }

  setRange(range: TimeRange) {
    this.activeRange = range;
    this.applyFilters();
  }

  applyFilters() {
    const now = new Date();
    
    this.filteredNotes = this.allNotes.filter(note => {
      // Filtro Ricerca
      const matchesSearch = note.restaurantName.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Filtro Temporale
      const noteDate = new Date(note.visitDate);
      let matchesTime = true;

      if (this.activeRange === 'week') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        matchesTime = noteDate >= oneWeekAgo;
      } else if (this.activeRange === 'month') {
        matchesTime = noteDate.getMonth() === now.getMonth() && noteDate.getFullYear() === now.getFullYear();
      } else if (this.activeRange === 'year') {
        matchesTime = noteDate.getFullYear() === now.getFullYear();
      }

      return matchesSearch && matchesTime;
    });

    this.calculateStats();
  }

  calculateStats() {
    this.totalOrders = this.filteredNotes.length;
    this.totalSpent = this.filteredNotes.reduce((acc, note) => acc + parseFloat(note.amount || '0'), 0);

    const statsMap = new Map<string, { count: number, spent: number, color: string }>();

    this.filteredNotes.forEach(note => {
      const name = note.restaurantName.toUpperCase();
      const current = statsMap.get(name) || { count: 0, spent: 0, color: note.color };
      statsMap.set(name, {
        count: current.count + 1,
        spent: current.spent + parseFloat(note.amount || '0'),
        color: current.color
      });
    });

    this.restaurantStats = Array.from(statsMap.entries()).map(([name, data]) => ({
      name,
      ...data
    })).sort((a, b) => b.spent - a.spent);
  }
}