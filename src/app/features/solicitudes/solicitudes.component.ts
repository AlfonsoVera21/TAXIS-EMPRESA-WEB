import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

import { TaxiDataService } from '../../core/services/taxi-data.service';
import { EMPRESAS, PROVEEDORES } from '../../data/mock-data';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [ButtonModule, CurrencyPipe, FormsModule, PageHeaderComponent, RouterLink, StatusBadgeComponent, TableModule],
  template: `
    <section class="space-y-5">
      <app-page-header title="Solicitudes de Taxi" [breadcrumb]="['Inicio', 'Solicitudes de Taxi']">
        <p-button label="Nueva solicitud" icon="pi pi-plus" routerLink="/solicitudes/nueva" />
      </app-page-header>

      <div class="app-card p-4">
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <label class="flex items-center gap-2 rounded-md border border-border bg-white px-3 py-2 xl:col-span-2">
            <i class="pi pi-search text-sm text-muted"></i>
            <input class="w-full bg-transparent text-sm outline-none" placeholder="Buscar por solicitud, solicitante o voucher" [(ngModel)]="search" />
          </label>
          <select class="control" [(ngModel)]="filterEmpresa">
            <option value="">Empresa: Todas</option>
            @for (empresa of empresas; track empresa) {
              <option [value]="empresa">{{ empresa }}</option>
            }
          </select>
          <select class="control" [(ngModel)]="filterEstado">
            <option value="">Estado: Todos</option>
            @for (estado of estados; track estado) {
              <option [value]="estado">{{ estado }}</option>
            }
          </select>
          <select class="control" [(ngModel)]="filterProveedor">
            <option value="">Proveedor: Todos</option>
            @for (proveedor of proveedores; track proveedor) {
              <option [value]="proveedor">{{ proveedor }}</option>
            }
          </select>
        </div>
      </div>

      <article class="app-card table-shell overflow-hidden">
        <p-table [value]="filtered()" [paginator]="true" [rows]="5" responsiveLayout="scroll">
          <ng-template pTemplate="header">
            <tr>
              <th>Solicitud</th>
              <th>Voucher</th>
              <th>Empresa</th>
              <th>Área</th>
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
              <td class="whitespace-nowrap font-semibold text-brand">{{ solicitud.id }}</td>
              <td class="whitespace-nowrap font-mono text-xs text-muted">{{ solicitud.voucher }}</td>
              <td><span class="rounded bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand-dark">{{ solicitud.empresa }}</span></td>
              <td class="whitespace-nowrap text-muted">{{ solicitud.area }}</td>
              <td class="whitespace-nowrap font-medium">{{ solicitud.solicitante }}</td>
              <td class="whitespace-nowrap text-muted">{{ solicitud.fecha }} {{ solicitud.hora }}</td>
              <td class="max-w-48 truncate text-muted">{{ solicitud.destino }}</td>
              <td class="whitespace-nowrap text-muted">{{ solicitud.proveedor }}</td>
              <td class="whitespace-nowrap font-semibold">{{ solicitud.valorEstimado | currency:'USD':'symbol':'1.2-2' }}</td>
              <td><app-status-badge [status]="solicitud.estado" /></td>
              <td>
                <div class="flex items-center gap-1">
                  <a [routerLink]="['/solicitudes', solicitud.id]" class="rounded-md p-2 text-muted transition hover:bg-surface-low hover:text-brand" title="Ver detalle"><i class="pi pi-eye"></i></a>
                  <button class="rounded-md p-2 text-muted transition hover:bg-surface-low hover:text-warning" title="Editar"><i class="pi pi-pencil"></i></button>
                  <button class="rounded-md p-2 text-muted transition hover:bg-surface-low hover:text-success" title="Duplicar"><i class="pi pi-copy"></i></button>
                  <button class="rounded-md p-2 text-muted transition hover:bg-surface-low" title="Descargar voucher"><i class="pi pi-download"></i></button>
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="11" class="py-12 text-center text-muted">No se encontraron solicitudes</td>
            </tr>
          </ng-template>
        </p-table>
      </article>
    </section>
  `,
})
export class SolicitudesComponent {
  private readonly data = inject(TaxiDataService);

  search = '';
  filterEmpresa = '';
  filterEstado = '';
  filterProveedor = '';

  readonly empresas = EMPRESAS;
  readonly proveedores = PROVEEDORES;
  readonly estados = ['Pendiente', 'Aprobada', 'Rechazada', 'Cancelada', 'En servicio', 'Finalizada'];

  filtered() {
    const search = this.search.trim().toLowerCase();
    return this.data.solicitudes().filter((solicitud) => {
      const matchesSearch =
        !search ||
        solicitud.id.toLowerCase().includes(search) ||
        solicitud.solicitante.toLowerCase().includes(search) ||
        solicitud.voucher.toLowerCase().includes(search);

      return (
        matchesSearch &&
        (!this.filterEmpresa || solicitud.empresa === this.filterEmpresa) &&
        (!this.filterEstado || solicitud.estado === this.filterEstado) &&
        (!this.filterProveedor || solicitud.proveedor === this.filterProveedor)
      );
    });
  }
}
