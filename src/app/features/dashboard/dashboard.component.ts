import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
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
  selector: 'app-dashboard',
  standalone: true,
  imports: [BaseChartDirective, ButtonModule, CurrencyPipe, KpiCardComponent, PageHeaderComponent, RouterLink, StatusBadgeComponent, TableModule],
  template: `
    <section class="space-y-6">
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <app-page-header title="Dashboard" [breadcrumb]="['Inicio', 'Dashboard']" />
          <p class="-mt-4 text-sm text-muted">Bienvenida, <strong>Ana Rodríguez</strong> · Julio 2026</p>
        </div>
        <div class="flex flex-wrap gap-2">
          @for (empresa of empresaOptions; track empresa) {
            <button
              class="rounded-md border px-3 py-1.5 text-xs font-semibold transition"
              [class.bg-brand]="empresaSeleccionada() === empresa"
              [class.text-white]="empresaSeleccionada() === empresa"
              [class.border-brand]="empresaSeleccionada() === empresa"
              [class.bg-white]="empresaSeleccionada() !== empresa"
              [class.text-ink]="empresaSeleccionada() !== empresa"
              [class.border-border]="empresaSeleccionada() !== empresa"
              (click)="empresaSeleccionada.set(empresa)"
            >
              {{ empresa }}
            </button>
          }
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <app-kpi-card title="Solicitudes del mes" [value]="totals().solicitudesMes" sub="Total julio 2026" icon="local_taxi" color="#ba0029" trend="↑ 12% vs mes anterior" />
        <app-kpi-card title="Pendientes de aprobación" [value]="totals().pendientes" sub="Requieren acción" icon="schedule" color="#9c4221" />
        <app-kpi-card title="Aprobadas" [value]="totals().aprobadas" sub="Este mes" icon="fact_check" color="#047481" trend="↑ 8% vs anterior" />
        <app-kpi-card title="Rechazadas" [value]="totals().rechazadas" sub="Este mes" icon="cancel" color="#ba1a1a" />
        <app-kpi-card title="Canceladas por vencimiento" [value]="totals().canceladas" sub="Sin aprobación 24h" icon="warning" color="#ba1a1a" />
        <app-kpi-card title="Presupuesto consumido" [value]="totals().presupuestoConsumido | currency:'USD':'symbol':'1.0-0'" sub="de presupuesto asignado" icon="attach_money" color="#ba0029" />
        <app-kpi-card title="Presupuesto disponible" [value]="totals().presupuestoDisponible | currency:'USD':'symbol':'1.0-0'" sub="Saldo actual" icon="monitoring" color="#047481" />
        <app-kpi-card title="Desembolsos pendientes" [value]="totals().desembolsosPendientes" sub="Por aprobar" icon="request_quote" color="#9c4221" />
      </div>

      <div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <article class="app-card p-5 xl:col-span-2">
          <h3 class="mb-4 text-sm font-semibold text-brand-dark">Consumo mensual por empresa (USD)</h3>
          <div class="h-72">
            <canvas baseChart [data]="lineData" [options]="chartOptions" type="line"></canvas>
          </div>
        </article>

        <article class="app-card p-5">
          <h3 class="mb-4 text-sm font-semibold text-brand-dark">Estado de solicitudes</h3>
          <div class="h-56">
            <canvas baseChart [data]="doughnutData" [options]="doughnutOptions" type="doughnut"></canvas>
          </div>
        </article>
      </div>

      <div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <article class="app-card p-5 xl:col-span-2">
          <h3 class="mb-4 text-sm font-semibold text-brand-dark">Consumo por proveedor (USD)</h3>
          <div class="h-60">
            <canvas baseChart [data]="barData" [options]="chartOptions" type="bar"></canvas>
          </div>
        </article>

        <article class="app-card p-5">
          <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold text-brand-dark">
            <span class="material-symbols-outlined text-warning">warning</span> Alertas activas
          </h3>
          <div class="space-y-2.5">
            @for (alert of alerts; track alert.message) {
              <div class="rounded-lg p-2.5 text-xs" [class]="alert.bg">
                <p [class]="alert.color">{{ alert.message }}</p>
              </div>
            }
          </div>
        </article>
      </div>

      <article class="app-card table-shell overflow-hidden">
        <div class="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 class="text-sm font-semibold text-brand-dark">Últimas solicitudes</h3>
          <a routerLink="/solicitudes" class="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-surface-low">
            Ver todas <span class="material-symbols-outlined text-base leading-none">chevron_right</span>
          </a>
        </div>
        <p-table [value]="data.solicitudes().slice(0, 5)" responsiveLayout="scroll">
          <ng-template pTemplate="header">
            <tr>
              <th>Solicitud</th>
              <th>Solicitante</th>
              <th>Empresa</th>
              <th>Destino</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-solicitud>
            <tr>
              <td class="font-semibold text-brand">{{ solicitud.id }}</td>
              <td>{{ solicitud.solicitante }}</td>
              <td><span class="rounded bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand-dark">{{ solicitud.empresa }}</span></td>
              <td class="max-w-48 truncate text-muted">{{ solicitud.destino }}</td>
              <td class="text-muted">{{ solicitud.fecha }}</td>
              <td><app-status-badge [status]="solicitud.estado" /></td>
              <td>
                <a [routerLink]="['/solicitudes', solicitud.id]" class="rounded-md p-2 text-muted transition hover:bg-surface-low hover:text-brand">
                  <span class="material-symbols-outlined text-xl">visibility</span>
                </a>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </article>
    </section>
  `,
})
export class DashboardComponent {
  readonly data = inject(TaxiDataService);
  readonly empresaSeleccionada = signal<'Todas' | 'ARCA' | 'TONI' | 'INALECSA'>('Todas');
  readonly empresaOptions = ['Todas', 'ARCA', 'TONI', 'INALECSA'] as const;
  readonly totals = this.data.dashboardTotals;

  readonly alerts = [
    { message: 'SOL-2026-001 · Vence en 2h sin aprobación', bg: 'bg-error-container', color: 'text-danger' },
    { message: 'SOL-2026-005 · Vence en 18h sin aprobación', bg: 'bg-warning-bg', color: 'text-warning' },
    { message: 'Área Tecnología ARCA · Presupuesto excedido', bg: 'bg-error-container', color: 'text-danger' },
    { message: 'Contrato CityTaxi · Vence en 60 días', bg: 'bg-warning-bg', color: 'text-warning' },
  ];

  readonly lineData: ChartConfiguration<'line'>['data'] = {
    labels: this.data.monthlyData.map((item) => item.mes),
    datasets: [
      { data: this.data.monthlyData.map((item) => item.ARCA), label: 'ARCA', borderColor: '#ba0029', backgroundColor: 'rgba(186, 0, 41, 0.12)', tension: 0.35, fill: true },
      { data: this.data.monthlyData.map((item) => item.TONI), label: 'TONI', borderColor: '#047481', backgroundColor: 'rgba(4, 116, 129, 0.12)', tension: 0.35, fill: true },
      { data: this.data.monthlyData.map((item) => item.INALECSA), label: 'INALECSA', borderColor: '#9c4221', backgroundColor: 'rgba(156, 66, 33, 0.12)', tension: 0.35, fill: true },
    ],
  };

  readonly doughnutData: ChartConfiguration<'doughnut'>['data'] = {
    labels: this.data.solicitudesStatusData.map((item) => item.name),
    datasets: [{ data: this.data.solicitudesStatusData.map((item) => item.value), backgroundColor: this.data.solicitudesStatusData.map((item) => item.color) }],
  };

  readonly barData: ChartConfiguration<'bar'>['data'] = {
    labels: this.data.proveedorChartData.map((item) => item.name),
    datasets: [{ data: this.data.proveedorChartData.map((item) => item.valor), label: 'Facturado', backgroundColor: '#ba0029', borderRadius: 6 }],
  };

  readonly chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
  };

  readonly doughnutOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
  };
}
