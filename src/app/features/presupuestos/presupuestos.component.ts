import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

import { TaxiDataService } from '../../core/services/taxi-data.service';
import { KpiCardComponent } from '../../shared/components/kpi-card.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';

@Component({
  selector: 'app-presupuestos',
  standalone: true,
  imports: [BaseChartDirective, ButtonModule, CurrencyPipe, FormsModule, KpiCardComponent, PageHeaderComponent, RouterLink, StatusBadgeComponent, TableModule],
  template: `
    <section class="space-y-5">
      <app-page-header title="Control de Presupuesto por Área" [breadcrumb]="['Inicio', 'Presupuestos']">
        <p-button label="Solicitar desembolso" icon="pi pi-plus" routerLink="/desembolsos" />
      </app-page-header>

      <div class="flex flex-wrap gap-3">
        @for (empresa of empresaOptions; track empresa) {
          <button
            class="rounded-md border px-3 py-1.5 text-xs font-semibold transition"
            [class.bg-brand]="empresaFilter() === empresa"
            [class.text-white]="empresaFilter() === empresa"
            [class.border-brand]="empresaFilter() === empresa"
            [class.bg-white]="empresaFilter() !== empresa"
            [class.text-ink]="empresaFilter() !== empresa"
            [class.border-border]="empresaFilter() !== empresa"
            (click)="empresaFilter.set(empresa)"
          >
            {{ empresa }}
          </button>
        }
        <input type="month" class="control max-w-40 py-1.5 text-xs" [(ngModel)]="periodo" />
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <app-kpi-card title="Presupuesto total" [value]="totalPresupuesto() | currency:'USD':'symbol':'1.0-0'" icon="attach_money" color="#ba0029" sub="Asignado julio 2026" />
        <app-kpi-card title="Consumido" [value]="totalConsumido() | currency:'USD':'symbol':'1.0-0'" icon="monitoring" color="#9c4221" [sub]="pctTotal() + '% del total'" />
        <app-kpi-card title="Disponible" [value]="(totalPresupuesto() - totalConsumido()) | currency:'USD':'symbol':'1.0-0'" icon="account_balance_wallet" [color]="totalPresupuesto() - totalConsumido() < 0 ? '#ba1a1a' : '#047481'" sub="Saldo actual" />
      </div>

      <div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <article class="app-card table-shell overflow-hidden">
          <div class="border-b border-border px-5 py-4">
            <h3 class="text-sm font-semibold text-brand-dark">Control por área</h3>
          </div>
          <p-table [value]="filtered()" responsiveLayout="scroll">
            <ng-template pTemplate="header">
              <tr>
                <th>Área</th>
                <th>Empresa</th>
                <th>Asignado</th>
                <th>Consumido</th>
                <th>Disponible</th>
                <th>% Uso</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-presupuesto>
              <tr>
                <td class="font-medium">{{ presupuesto.area }}</td>
                <td><span class="rounded bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand-dark">{{ presupuesto.empresa }}</span></td>
                <td>{{ presupuesto.presupuesto | currency:'USD':'symbol':'1.0-0' }}</td>
                <td>{{ presupuesto.consumido | currency:'USD':'symbol':'1.0-0' }}</td>
                <td class="font-semibold" [class.text-danger]="disponible(presupuesto) < 0">{{ disponible(presupuesto) | currency:'USD':'symbol':'1.0-0' }}</td>
                <td>
                  <div class="flex items-center gap-2">
                    <div class="h-1.5 w-20 overflow-hidden rounded-full bg-surface-high">
                      <div class="h-full rounded-full" [style.width.%]="pct(presupuesto)" [style.background-color]="estado(presupuesto).color"></div>
                    </div>
                    <span class="text-xs font-bold" [style.color]="estado(presupuesto).color">{{ pct(presupuesto) }}%</span>
                  </div>
                </td>
                <td><app-status-badge [status]="estado(presupuesto).label" /></td>
                <td>@if (disponible(presupuesto) < 0) { <p-button label="Desembolso" size="small" severity="danger" routerLink="/desembolsos" /> }</td>
              </tr>
            </ng-template>
          </p-table>
        </article>

        <article class="app-card p-5">
          <h3 class="mb-4 text-sm font-semibold text-brand-dark">Presupuesto vs consumo por área</h3>
          <div class="h-96">
            <canvas baseChart [data]="barData()" [options]="chartOptions" type="bar"></canvas>
          </div>
        </article>
      </div>
    </section>
  `,
})
export class PresupuestosComponent {
  private readonly data = inject(TaxiDataService);

  readonly empresaFilter = signal<'Todas' | 'ARCA' | 'TONI' | 'INALECSA'>('Todas');
  readonly empresaOptions = ['Todas', 'ARCA', 'TONI', 'INALECSA'] as const;
  periodo = '2026-07';

  readonly filtered = computed(() => this.data.presupuestos().filter((item) => this.empresaFilter() === 'Todas' || item.empresa === this.empresaFilter()));
  readonly totalPresupuesto = computed(() => this.filtered().reduce((sum, item) => sum + item.presupuesto, 0));
  readonly totalConsumido = computed(() => this.filtered().reduce((sum, item) => sum + item.consumido, 0));
  readonly pctTotal = computed(() => Math.round((this.totalConsumido() / this.totalPresupuesto()) * 100));

  readonly barData = computed<ChartConfiguration<'bar'>['data']>(() => ({
    labels: this.filtered().map((item) => item.area),
    datasets: [
      { data: this.filtered().map((item) => item.presupuesto), label: 'Presupuesto', backgroundColor: '#ffdad9', borderColor: '#ba0029', borderWidth: 1 },
      { data: this.filtered().map((item) => item.consumido), label: 'Consumido', backgroundColor: '#ba0029', borderRadius: 6 },
    ],
  }));

  readonly chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: { legend: { position: 'bottom' } },
  };

  disponible(item: { presupuesto: number; consumido: number }): number {
    return item.presupuesto - item.consumido;
  }

  pct(item: { presupuesto: number; consumido: number }): number {
    return Math.min(Math.round((item.consumido / item.presupuesto) * 100), 100);
  }

  estado(item: { presupuesto: number; consumido: number }): { label: string; color: string } {
    const pct = (item.consumido / item.presupuesto) * 100;
    if (pct >= 100) return { label: 'Excedido', color: '#ba1a1a' };
    if (pct >= 80) return { label: 'Crítico', color: '#9c4221' };
    return { label: 'Normal', color: '#047481' };
  }
}
