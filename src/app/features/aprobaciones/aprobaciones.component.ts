import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';

import { TaxiDataService } from '../../core/services/taxi-data.service';
import { KpiCardComponent } from '../../shared/components/kpi-card.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';

@Component({
  selector: 'app-aprobaciones',
  standalone: true,
  imports: [ButtonModule, CurrencyPipe, DialogModule, FormsModule, KpiCardComponent, PageHeaderComponent, RouterLink, TableModule],
  template: `
    <section class="space-y-5">
      <app-page-header title="Aprobaciones Pendientes" [breadcrumb]="['Inicio', 'Aprobaciones Pendientes']" />

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <app-kpi-card title="Pendientes" [value]="data.solicitudesPendientes().length" icon="schedule" color="#9c4221" sub="Requieren acción" />
        <app-kpi-card title="Aprobadas hoy" value="3" icon="fact_check" color="#047481" sub="Julio 3, 2026" />
        <app-kpi-card title="Rechazadas hoy" value="1" icon="cancel" color="#ba1a1a" sub="Julio 3, 2026" />
        <app-kpi-card title="Próximas a vencer" value="2" icon="warning" color="#ba1a1a" sub="Menos de 24h" />
      </div>

      <article class="app-card table-shell overflow-hidden">
        <div class="border-b border-border px-5 py-4">
          <h3 class="text-sm font-semibold text-brand-dark">Bandeja de aprobación</h3>
        </div>
        <p-table [value]="data.solicitudesPendientes()" responsiveLayout="scroll">
          <ng-template pTemplate="header">
            <tr>
              <th>Solicitud</th>
              <th>Solicitante</th>
              <th>Área</th>
              <th>Motivo</th>
              <th>Fecha req.</th>
              <th>Costo est.</th>
              <th>Tiempo restante</th>
              <th>Acciones</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-solicitud>
            <tr [class.bg-warning-bg]="nearExpiry(solicitud.id)">
              <td><a [routerLink]="['/solicitudes', solicitud.id]" class="font-semibold text-brand hover:underline">{{ solicitud.id }}</a></td>
              <td><p class="font-medium">{{ solicitud.solicitante }}</p><p class="text-xs text-muted">{{ solicitud.tipoUsuario }}</p></td>
              <td class="text-muted">{{ solicitud.area }}</td>
              <td class="text-muted">{{ solicitud.motivo }}</td>
              <td class="whitespace-nowrap text-muted">{{ solicitud.fecha }} {{ solicitud.hora }}</td>
              <td class="font-semibold">{{ solicitud.valorEstimado | currency:'USD':'symbol':'1.2-2' }}</td>
              <td><span class="text-xs font-semibold" [class.text-danger]="nearExpiry(solicitud.id)" [class.text-warning]="!nearExpiry(solicitud.id)">{{ nearExpiry(solicitud.id) ? '2h restantes' : '18h restantes' }}</span></td>
              <td>
                <div class="flex items-center gap-1.5">
                  <p-button label="Aprobar" icon="pi pi-check" size="small" severity="success" (onClick)="data.approveSolicitud(solicitud.id)" />
                  <p-button label="Rechazar" icon="pi pi-times" size="small" severity="danger" (onClick)="openReject(solicitud.id)" />
                  <a [routerLink]="['/solicitudes', solicitud.id]" class="rounded-md p-2 text-muted transition hover:bg-surface-low"><i class="pi pi-eye"></i></a>
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr><td colspan="8" class="py-12 text-center text-muted">No hay solicitudes pendientes de aprobación</td></tr>
          </ng-template>
        </p-table>
      </article>

      <p-dialog header="Rechazar solicitud" [(visible)]="rejectVisible" [modal]="true" [style]="{ width: 'min(92vw, 32rem)' }">
        <div class="space-y-4">
          <p class="text-sm text-muted">Ingrese el motivo del rechazo para <strong>{{ rejectId() }}</strong>. Es obligatorio.</p>
          <textarea class="control min-h-28 resize-none" [(ngModel)]="rejectComment" placeholder="Motivo del rechazo..."></textarea>
          <div class="flex justify-end gap-2">
            <p-button label="Cancelar" severity="secondary" (onClick)="rejectId.set(null)" />
            <p-button label="Confirmar rechazo" severity="danger" icon="pi pi-times-circle" [disabled]="!rejectComment.trim()" (onClick)="confirmReject()" />
          </div>
        </div>
      </p-dialog>
    </section>
  `,
})
export class AprobacionesComponent {
  readonly data = inject(TaxiDataService);
  readonly rejectId = signal<string | null>(null);
  rejectComment = '';

  get rejectVisible(): boolean {
    return !!this.rejectId();
  }

  set rejectVisible(value: boolean) {
    if (!value) this.rejectId.set(null);
  }

  nearExpiry(id: string): boolean {
    return id === 'SOL-2026-001';
  }

  openReject(id: string): void {
    this.rejectComment = '';
    this.rejectId.set(id);
  }

  confirmReject(): void {
    const id = this.rejectId();
    if (!id) return;
    this.data.rejectSolicitud(id, this.rejectComment);
    this.rejectId.set(null);
  }
}
