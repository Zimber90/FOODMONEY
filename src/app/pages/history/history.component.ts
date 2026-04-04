import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, ChevronLeft, History as HistoryIcon } from 'lucide-angular';
import { StorageService } from '../../services/storage.service';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <div class="history-container">
      <header class="history-header">
        <button class="back-btn" routerLink="/main">
          <lucide-icon [name]="backIcon" size="24"></lucide-icon>
        </button>
        <h1 class="title">Storico Note</h1>
      </header>

      <div class="history-list">
        @for (note of allNotes; track note.id) {
          <div class="history-item" [style.borderLeftColor]="note.color">
            <div class="item-info">
              <h3>{{ note.title }}</h3>
              <p>{{ note.date | date:'dd MMM yyyy, HH:mm' }}</p>
            </div>
            <lucide-icon [name]="historyIcon" size="18" class="icon-dim"></lucide-icon>
          </div>
        } @empty {
          <div class="empty-state">
            <p>Nessuna nota salvata nello storico.</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .history-container {
      height: 100vh;
      background-color: var(--bg-color);
      padding: 20px;
      transition: background-color 0.3s ease;
      overflow-y: auto;
    }

    .history-header {
      background-color: var(--header-bg);
      border-radius: 50px;
      display: flex;
      align-items: center;
      padding: 10px 20px;
      color: var(--header-text);
      margin-bottom: 30px;
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

    .history-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .history-item {
      background: var(--card-bg);
      padding: 15px 20px;
      border-radius: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-left: 6px solid transparent;
      box-shadow: 0 4px 12px var(--card-shadow);
      transition: transform 0.2s;
    }

    .history-item:active {
      transform: scale(0.98);
    }

    .item-info h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-color);
    }

    .item-info p {
      margin: 4px 0 0;
      font-size: 0.8rem;
      opacity: 0.6;
      color: var(--text-color);
    }

    .icon-dim {
      opacity: 0.3;
      color: var(--text-color);
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      opacity: 0.5;
      color: var(--text-color);
    }
  `]
})
export class HistoryComponent implements OnInit {
  private storage = inject(StorageService);
  
  readonly backIcon = ChevronLeft;
  readonly historyIcon = HistoryIcon;

  allNotes: Note[] = [];

  ngOnInit() {
    this.allNotes = this.storage.getNotes();
  }
}