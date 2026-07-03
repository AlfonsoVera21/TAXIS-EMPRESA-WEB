import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  template: `
    <article class="app-card p-6 transition hover:shadow-md">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0 flex-1">
          <p class="font-heading text-xs font-bold uppercase tracking-[0.08em] text-muted">{{ title }}</p>
          <p class="font-heading mt-1 text-3xl font-bold" [style.color]="color">{{ value }}</p>
          @if (sub) {
            <p class="mt-0.5 text-xs text-muted">{{ sub }}</p>
          }
          @if (trend) {
            <p class="mt-1 text-xs font-medium" [style.color]="color">{{ trend }}</p>
          }
        </div>
        <div
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
          [style.background-color]="color + '18'"
        >
          @if (isPrimeIcon) {
            <i [class]="icon" [style.color]="color"></i>
          } @else {
            <span class="material-symbols-outlined text-2xl" [style.color]="color">{{ icon }}</span>
          }
        </div>
      </div>
    </article>
  `,
})
export class KpiCardComponent {
  @Input({ required: true }) title = '';
  @Input({ required: true }) value: string | number | null = '';
  @Input() sub = '';
  @Input() trend = '';
  @Input() icon = 'monitoring';
  @Input() color = '#ba0029';

  get isPrimeIcon(): boolean {
    return this.icon.startsWith('pi ');
  }
}
