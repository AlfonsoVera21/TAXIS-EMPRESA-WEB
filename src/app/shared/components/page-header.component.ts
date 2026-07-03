import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="mb-6">
      @if (breadcrumb.length) {
        <nav class="mb-1 flex flex-wrap items-center gap-1.5 text-xs text-muted">
          @for (item of breadcrumb; track item; let last = $last) {
            @if (!$first) {
              <span class="material-symbols-outlined text-base leading-none">chevron_right</span>
            }
            <span [class.font-semibold]="last" [class.text-ink]="last">{{ item }}</span>
          }
        </nav>
      }
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3">
          @if (backRoute) {
            <a
              [routerLink]="backRoute"
              class="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted transition hover:bg-surface-low hover:text-brand"
              aria-label="Volver"
            >
              <span class="material-symbols-outlined text-xl">arrow_back</span>
            </a>
          }
          <h1 class="font-heading text-[32px] font-bold leading-10 text-brand">{{ title }}</h1>
        </div>
        <ng-content></ng-content>
      </div>
    </header>
  `,
})
export class PageHeaderComponent {
  @Input({ required: true }) title = '';
  @Input() breadcrumb: string[] = [];
  @Input() backRoute = '';
}
