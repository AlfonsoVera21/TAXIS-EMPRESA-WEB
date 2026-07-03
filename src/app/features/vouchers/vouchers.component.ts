import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

import { TaxiDataService } from '../../core/services/taxi-data.service';
import { SolicitudTaxi } from '../../data/models';
import { ArcaLogoComponent } from '../../shared/components/arca-logo.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';

@Component({
  selector: 'app-vouchers',
  standalone: true,
  imports: [ArcaLogoComponent, ButtonModule, CurrencyPipe, FormsModule, PageHeaderComponent, StatusBadgeComponent, TableModule],
  template: `
    @if (selected()) {
      <section class="mx-auto max-w-3xl">
        <div class="no-print mb-4 flex gap-2">
          <p-button label="Volver" icon="pi pi-arrow-left" severity="secondary" (onClick)="selected.set(null)" />
          <p-button label="Imprimir / PDF" icon="pi pi-print" (onClick)="print()" />
        </div>
        <article class="app-card border-2 border-brand/20 p-8">
          <div class="mb-6 flex items-start justify-between border-b-2 border-brand-dark pb-6">
            <div>
              <app-arca-logo [size]="36" />
              <p class="mt-1 text-xs text-muted">Taxis Corporativos · Sistema de Gestión</p>
            </div>
            <div class="text-right">
              <p class="text-xs font-semibold uppercase tracking-widest text-muted">Voucher de Servicio</p>
              <p class="mt-1 font-mono text-xl font-bold text-brand">{{ selected()?.voucher }}</p>
              <app-status-badge [status]="data.voucherEstado(selected()!)" />
            </div>
          </div>

          <div class="mb-6 grid grid-cols-1 gap-6 text-sm sm:grid-cols-2">
            <div class="space-y-3">
              <div><p class="text-xs uppercase tracking-wide text-muted">Solicitante</p><p class="font-semibold">{{ selected()?.solicitante }}</p></div>
              <div><p class="text-xs uppercase tracking-wide text-muted">Cargo</p><p>{{ selected()?.cargo }}</p></div>
              <div><p class="text-xs uppercase tracking-wide text-muted">Empresa</p><p class="font-semibold text-brand-dark">{{ selected()?.empresa }}</p></div>
              <div><p class="text-xs uppercase tracking-wide text-muted">Área</p><p>{{ selected()?.area }}</p></div>
            </div>
            <div class="space-y-3">
              <div><p class="text-xs uppercase tracking-wide text-muted">Fecha y hora</p><p class="font-semibold">{{ selected()?.fecha }} · {{ selected()?.hora }}</p></div>
              <div><p class="text-xs uppercase tracking-wide text-muted">Proveedor asignado</p><p>{{ selected()?.proveedor }}</p></div>
              <div><p class="text-xs uppercase tracking-wide text-muted">Aprobado por</p><p>{{ selected()?.aprobador }}</p></div>
              <div><p class="text-xs uppercase tracking-wide text-muted">Valor autorizado</p><p class="text-lg font-bold text-brand">{{ selected()?.valorEstimado | currency:'USD':'symbol':'1.2-2' }}</p></div>
            </div>
          </div>

          <div class="mb-6 rounded-lg bg-page p-4">
            <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Ruta</p>
            <div class="grid gap-3 text-sm sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <div><p class="text-xs text-muted">Origen</p><p class="font-medium">{{ selected()?.origen }}</p></div>
              <i class="pi pi-angle-right text-muted"></i>
              <div><p class="text-xs text-muted">Destino</p><p class="font-medium">{{ selected()?.destino }}</p></div>
            </div>
          </div>

          <div class="flex items-end justify-between border-t border-border pt-4">
            <div class="rounded-lg bg-page p-4 text-center">
              <div class="grid grid-cols-8 gap-0.5">
                @for (cell of qrCells; track $index) {
                  <span class="h-2.5 w-2.5 rounded-sm" [class.bg-brand-dark]="cell" [class.bg-white]="!cell"></span>
                }
              </div>
              <p class="mt-1 text-xs text-muted">Código QR</p>
            </div>
            <div class="text-right text-xs text-muted">
              <p>Generado por Taxis Corporativos</p>
              <p>Arca Continental · 03/07/2026</p>
              <p class="mt-1 font-mono text-brand">{{ selected()?.id }}</p>
            </div>
          </div>
        </article>
      </section>
    } @else {
      <section class="space-y-5">
        <app-page-header title="Módulo de Vouchers" [breadcrumb]="['Inicio', 'Vouchers']" />
        <div class="app-card p-4">
          <label class="flex items-center gap-2 rounded-md border border-border px-3 py-2">
            <i class="pi pi-search text-sm text-muted"></i>
            <input class="w-full bg-transparent text-sm outline-none" placeholder="Buscar por número de voucher o solicitante" [(ngModel)]="search" />
          </label>
        </div>
        <article class="app-card table-shell overflow-hidden">
          <p-table [value]="filtered()" responsiveLayout="scroll">
            <ng-template pTemplate="header">
              <tr>
                <th>Voucher</th>
                <th>Solicitud</th>
                <th>Empresa</th>
                <th>Solicitante</th>
                <th>Fecha</th>
                <th>Destino</th>
                <th>Proveedor</th>
                <th>Valor</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-solicitud>
              <tr>
                <td class="whitespace-nowrap font-mono text-xs font-bold text-brand">{{ solicitud.voucher }}</td>
                <td class="text-muted">{{ solicitud.id }}</td>
                <td><span class="rounded bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand-dark">{{ solicitud.empresa }}</span></td>
                <td class="whitespace-nowrap font-medium">{{ solicitud.solicitante }}</td>
                <td class="text-muted">{{ solicitud.fecha }}</td>
                <td class="max-w-48 truncate text-muted">{{ solicitud.destino }}</td>
                <td class="whitespace-nowrap text-muted">{{ solicitud.proveedor }}</td>
                <td class="font-semibold">{{ solicitud.valorEstimado | currency:'USD':'symbol':'1.2-2' }}</td>
                <td><app-status-badge [status]="data.voucherEstado(solicitud)" /></td>
                <td>
                  <button class="rounded-md p-2 text-muted transition hover:bg-surface-low hover:text-brand" (click)="selected.set(solicitud)" title="Ver voucher"><i class="pi pi-eye"></i></button>
                  <button class="rounded-md p-2 text-muted transition hover:bg-surface-low" title="Descargar PDF"><i class="pi pi-download"></i></button>
                  <button class="rounded-md p-2 text-muted transition hover:bg-error-container hover:text-danger" title="Anular voucher"><i class="pi pi-ban"></i></button>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </article>
      </section>
    }
  `,
})
export class VouchersComponent {
  readonly data = inject(TaxiDataService);
  readonly selected = signal<SolicitudTaxi | null>(null);
  search = '';

  readonly qrCells = Array.from({ length: 64 }, (_, index) => index % 2 === 0 || index % 7 === 0 || index % 11 === 0);

  filtered() {
    const search = this.search.trim().toLowerCase();
    return this.data.solicitudes().filter((solicitud) => !search || solicitud.voucher.toLowerCase().includes(search) || solicitud.solicitante.toLowerCase().includes(search));
  }

  print(): void {
    window.print();
  }
}
