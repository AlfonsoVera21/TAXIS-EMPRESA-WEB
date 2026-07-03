import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

import { TaxiDataService } from '../../core/services/taxi-data.service';
import { KpiCardComponent } from '../../shared/components/kpi-card.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [BaseChartDirective, ButtonModule, CurrencyPipe, FormsModule, KpiCardComponent, PageHeaderComponent, StatusBadgeComponent, TableModule],
  template: `
    <section class="space-y-5">
      <app-page-header title="Módulo de Reportes e Indicadores" [breadcrumb]="['Inicio', 'Reportes']">
        <div class="flex gap-2">
          <p-button label="Exportar Excel" icon="pi pi-file-excel" size="small" severity="secondary" />
          <p-button label="Exportar PDF" icon="pi pi-download" size="small" severity="secondary" />
        </div>
      </app-page-header>

      <div class="grid grid-cols-1 gap-4 xl:grid-cols-4">
        <aside class="app-card space-y-4 p-5">
          <h3 class="text-sm font-semibold text-brand-dark">Filtros</h3>
          <div>
            <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Tipo de reporte</p>
            <div class="space-y-1">
              @for (item of reportes; track item.id) {
                <button
                  class="w-full rounded-lg px-3 py-2 text-left text-sm transition"
                  [class.bg-brand-soft]="reporte() === item.id"
                  [class.font-semibold]="reporte() === item.id"
                  [class.text-brand-dark]="reporte() === item.id"
                  [class.text-muted]="reporte() !== item.id"
                  (click)="reporte.set(item.id)"
                >
                  {{ item.label }}
                </button>
              }
            </div>
          </div>
          <div class="space-y-3 border-t border-border pt-3">
            <select class="control" [(ngModel)]="empresa"><option value="">Empresa: Todas</option><option>ARCA</option><option>TONI</option><option>INALECSA</option></select>
            <input type="month" class="control" [(ngModel)]="periodo" />
            <p-button label="Aplicar filtros" icon="pi pi-filter" styleClass="w-full justify-center" />
          </div>
        </aside>

        <div class="space-y-4 xl:col-span-3">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <app-kpi-card title="Total solicitudes" value="124" icon="local_taxi" color="#ba0029" sub="Julio 2026" />
            <app-kpi-card title="Costo total" value="$12,436" icon="attach_money" color="#047481" sub="Facturado" />
            <app-kpi-card title="Tasa aprobación" value="87%" icon="fact_check" color="#047481" sub="Del total" />
          </div>

          <article class="app-card p-5">
            <h3 class="mb-4 text-sm font-semibold text-brand-dark">Solicitudes por empresa — {{ periodo }}</h3>
            <div class="h-72"><canvas baseChart [data]="barData" [options]="chartOptions" type="bar"></canvas></div>
          </article>

          <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <article class="app-card p-5">
              <h3 class="mb-4 text-sm font-semibold text-brand-dark">Distribución por estado</h3>
              <div class="h-56"><canvas baseChart [data]="pieData" [options]="chartOptions" type="pie"></canvas></div>
            </article>
            <article class="app-card p-5">
              <h3 class="mb-4 text-sm font-semibold text-brand-dark">Top proveedores (USD)</h3>
              <div class="h-56"><canvas baseChart [data]="providersData" [options]="chartOptions" type="bar"></canvas></div>
            </article>
          </div>

          <article class="app-card table-shell overflow-hidden">
            <div class="flex items-center justify-between border-b border-border px-5 py-4">
              <h3 class="text-sm font-semibold text-brand-dark">Detalle de solicitudes</h3>
              <p-button label="Descargar" icon="pi pi-download" size="small" severity="secondary" />
            </div>
            <p-table [value]="data.solicitudes()" [paginator]="true" [rows]="5" responsiveLayout="scroll">
              <ng-template pTemplate="header"><tr><th>Solicitud</th><th>Empresa</th><th>Área</th><th>Solicitante</th><th>Fecha</th><th>Valor</th><th>Estado</th></tr></ng-template>
              <ng-template pTemplate="body" let-item>
                <tr>
                  <td class="font-semibold text-brand">{{ item.id }}</td>
                  <td><span class="rounded bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand-dark">{{ item.empresa }}</span></td>
                  <td class="text-muted">{{ item.area }}</td>
                  <td>{{ item.solicitante }}</td>
                  <td class="text-muted">{{ item.fecha }}</td>
                  <td class="font-semibold">{{ item.valorEstimado | currency:'USD':'symbol':'1.2-2' }}</td>
                  <td><app-status-badge [status]="item.estado" /></td>
                </tr>
              </ng-template>
            </p-table>
          </article>
        </div>
      </div>
    </section>
  `,
})
export class ReportesComponent {
  readonly data = inject(TaxiDataService);
  readonly reporte = signal('solicitudes-empresa');
  empresa = '';
  periodo = '2026-07';

  readonly reportes = [
    { id: 'solicitudes-empresa', label: 'Solicitudes por empresa' },
    { id: 'solicitudes-area', label: 'Solicitudes por área' },
    { id: 'aprobaciones', label: 'Aprobaciones y rechazos' },
    { id: 'presupuesto', label: 'Consumo presupuestario' },
    { id: 'proveedor', label: 'Consumo por proveedor' },
    { id: 'vencidas', label: 'Solicitudes vencidas' },
    { id: 'desembolsos', label: 'Desembolsos' },
  ];

  readonly barData: ChartConfiguration<'bar'>['data'] = {
    labels: this.data.monthlyData.map((item) => item.mes),
    datasets: [
      { data: this.data.monthlyData.map((item) => item.ARCA), label: 'ARCA', backgroundColor: '#ba0029' },
      { data: this.data.monthlyData.map((item) => item.TONI), label: 'TONI', backgroundColor: '#047481' },
      { data: this.data.monthlyData.map((item) => item.INALECSA), label: 'INALECSA', backgroundColor: '#9c4221' },
    ],
  };

  readonly pieData: ChartConfiguration<'pie'>['data'] = {
    labels: this.data.solicitudesStatusData.map((item) => item.name),
    datasets: [{ data: this.data.solicitudesStatusData.map((item) => item.value), backgroundColor: this.data.solicitudesStatusData.map((item) => item.color) }],
  };

  readonly providersData: ChartConfiguration<'bar'>['data'] = {
    labels: this.data.proveedorChartData.map((item) => item.name),
    datasets: [{ data: this.data.proveedorChartData.map((item) => item.valor), label: 'Facturado', backgroundColor: '#ba0029', borderRadius: 6 }],
  };

  readonly chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
  };
}
