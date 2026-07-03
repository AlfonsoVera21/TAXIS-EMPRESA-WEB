import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { TaxiDataService } from '../../core/services/taxi-data.service';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';

@Component({
  selector: 'app-detalle-solicitud',
  standalone: true,
  imports: [ButtonModule, CurrencyPipe, DialogModule, FormsModule, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <section class="mx-auto max-w-6xl space-y-5">
      <app-page-header [title]="'Detalle: ' + solicitud().id" [breadcrumb]="['Inicio', 'Solicitudes', 'Detalle']" backRoute="/solicitudes">
        <div class="flex flex-wrap items-center gap-2">
          <app-status-badge [status]="solicitud().estado" />
          <p-button label="Imprimir" icon="pi pi-print" size="small" severity="secondary" />
          <p-button label="Voucher" icon="pi pi-download" size="small" severity="secondary" />
        </div>
      </app-page-header>

      <div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div class="space-y-4 xl:col-span-2">
          <article class="app-card p-5">
            <div class="mb-4 flex items-start justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wide text-muted">Voucher</p>
                <p class="font-mono text-lg font-bold text-brand">{{ solicitud().voucher }}</p>
              </div>
              <app-status-badge [status]="solicitud().estado" />
            </div>
            <div class="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
              @for (item of solicitanteFields(); track item.label) {
                <div>
                  <p class="text-xs text-muted">{{ item.label }}</p>
                  <p class="font-medium text-ink">{{ item.value }}</p>
                </div>
              }
            </div>
          </article>

          <article class="app-card p-5">
            <h3 class="mb-4 text-sm font-semibold text-brand-dark">Información del viaje</h3>
            <div class="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
              <div><p class="text-xs text-muted">Fecha requerida</p><p class="font-medium">{{ solicitud().fecha }}</p></div>
              <div><p class="text-xs text-muted">Hora requerida</p><p class="font-medium">{{ solicitud().hora }}</p></div>
              <div class="sm:col-span-2"><p class="text-xs text-muted">Origen</p><p class="font-medium"><i class="pi pi-map-marker mr-1 text-brand"></i>{{ solicitud().origen }}</p></div>
              <div class="sm:col-span-2"><p class="text-xs text-muted">Destino</p><p class="font-medium"><i class="pi pi-map-marker mr-1 text-danger"></i>{{ solicitud().destino }}</p></div>
              <div><p class="text-xs text-muted">Motivo</p><p class="font-medium">{{ solicitud().motivo }}</p></div>
              <div><p class="text-xs text-muted">Pasajeros</p><p class="font-medium">{{ solicitud().pasajeros }}</p></div>
              <div><p class="text-xs text-muted">Proveedor</p><p class="font-medium">{{ solicitud().proveedor }}</p></div>
              <div><p class="text-xs text-muted">Valor estimado</p><p class="text-base font-bold text-brand">{{ solicitud().valorEstimado | currency:'USD':'symbol':'1.2-2' }}</p></div>
              <div><p class="text-xs text-muted">Contrato</p><p class="font-medium">{{ solicitud().contrato }}</p></div>
              <div><p class="text-xs text-muted">Aprobador</p><p class="font-medium">{{ solicitud().aprobador }}</p></div>
            </div>
          </article>

          <article class="app-card p-5">
            <h3 class="mb-3 text-sm font-semibold text-brand-dark">Historial de auditoría</h3>
            <div class="space-y-2 text-xs">
              @for (item of auditTrail(); track item.action) {
                <div class="flex items-start gap-3 border-b border-border py-2 last:border-0">
                  <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"></span>
                  <div>
                    <p class="font-medium text-ink">{{ item.action }}</p>
                    <p class="text-muted">{{ item.user }} · {{ item.date }}</p>
                  </div>
                </div>
              }
            </div>
          </article>
        </div>

        <aside class="space-y-4">
          <article class="app-card p-5">
            <h3 class="mb-4 text-sm font-semibold text-brand-dark">Línea de tiempo</h3>
            <div class="space-y-3">
              @for (item of timeline(); track item.label; let last = $last) {
                <div class="flex items-start gap-3">
                  <div class="flex flex-col items-center">
                    <span class="flex h-7 w-7 items-center justify-center rounded-full" [class.bg-success]="item.done" [class.bg-surface-high]="!item.done">
                      @if (item.done) { <i class="pi pi-check text-xs text-white"></i> } @else { <span class="h-2 w-2 rounded-full bg-muted"></span> }
                    </span>
                    @if (!last) { <span class="mt-1 h-6 w-0.5" [class.bg-success]="item.done" [class.bg-surface-high]="!item.done"></span> }
                  </div>
                  <div>
                    <p class="text-xs font-semibold" [class.text-ink]="item.done" [class.text-muted]="!item.done">{{ item.label }}</p>
                    <p class="text-xs text-muted">{{ item.date }}</p>
                  </div>
                </div>
              }
            </div>
          </article>

          <article class="app-card p-5">
            <h3 class="mb-3 text-sm font-semibold text-brand-dark">Acciones</h3>
            <div class="space-y-2">
              @if (solicitud().estado === 'Pendiente') {
                <p-button label="Aprobar" icon="pi pi-check" severity="success" styleClass="w-full justify-center" (onClick)="approve()" />
                <p-button label="Rechazar" icon="pi pi-times-circle" severity="danger" styleClass="w-full justify-center" (onClick)="rejectOpen.set(true)" />
                <p-button label="Cancelar" icon="pi pi-ban" severity="secondary" styleClass="w-full justify-center" />
              }
              <p-button label="Descargar voucher" icon="pi pi-download" severity="secondary" styleClass="w-full justify-center" />
              <p-button label="Ver historial completo" icon="pi pi-history" severity="secondary" styleClass="w-full justify-center" />
            </div>
          </article>
        </aside>
      </div>

      <p-dialog header="Rechazar solicitud" [(visible)]="rejectDialogVisible" [modal]="true" [style]="{ width: 'min(92vw, 32rem)' }">
        <div class="space-y-4">
          <p class="text-sm text-muted">Ingrese el motivo del rechazo. Este comentario será notificado al solicitante.</p>
          <textarea class="control min-h-28 resize-none" [(ngModel)]="rejectComment" placeholder="Motivo del rechazo..."></textarea>
          <div class="flex justify-end gap-2">
            <p-button label="Cancelar" severity="secondary" (onClick)="rejectOpen.set(false)" />
            <p-button label="Confirmar rechazo" icon="pi pi-times-circle" severity="danger" [disabled]="!rejectComment.trim()" (onClick)="reject()" />
          </div>
        </div>
      </p-dialog>
    </section>
  `,
})
export class DetalleSolicitudComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly data = inject(TaxiDataService);

  readonly rejectOpen = signal(false);
  rejectComment = '';

  readonly solicitud = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return this.data.solicitudById(id) ?? this.data.solicitudes()[0];
  });

  get rejectDialogVisible(): boolean {
    return this.rejectOpen();
  }

  set rejectDialogVisible(value: boolean) {
    this.rejectOpen.set(value);
  }

  solicitanteFields() {
    const sol = this.solicitud();
    return [
      { label: 'Solicitante', value: sol.solicitante },
      { label: 'Cargo', value: sol.cargo },
      { label: 'Empresa', value: sol.empresa },
      { label: 'Área · CC', value: `${sol.area} · ${sol.cc}` },
      { label: 'Tipo de usuario', value: sol.tipoUsuario },
      { label: 'Jefe inmediato', value: sol.jefeInmediato },
    ];
  }

  timeline() {
    const sol = this.solicitud();
    return [
      { label: 'Creada', date: sol.createdAt, done: true },
      { label: 'Enviada a aprobación', date: sol.createdAt, done: true },
      { label: sol.estado === 'Rechazada' ? 'Rechazada' : sol.estado === 'Pendiente' ? 'Pendiente aprobación' : 'Aprobada', date: sol.estado === 'Pendiente' ? 'En espera...' : `${sol.fecha} 08:00`, done: sol.estado !== 'Pendiente' && sol.estado !== 'Cancelada' },
      { label: 'Asignada a proveedor', date: sol.estado === 'En servicio' || sol.estado === 'Finalizada' ? `${sol.fecha} 09:30` : '—', done: sol.estado === 'En servicio' || sol.estado === 'Finalizada' },
      { label: 'Servicio realizado', date: sol.estado === 'Finalizada' ? `${sol.fecha} 11:00` : '—', done: sol.estado === 'Finalizada' },
      { label: 'Cerrada', date: sol.estado === 'Finalizada' ? `${sol.fecha} 11:30` : '—', done: sol.estado === 'Finalizada' },
    ];
  }

  auditTrail() {
    const sol = this.solicitud();
    return [
      { action: 'Solicitud creada', user: sol.solicitante, date: sol.createdAt },
      { action: 'Enviada a aprobación', user: 'Sistema', date: sol.createdAt },
      ...(sol.estado !== 'Pendiente'
        ? [{ action: sol.estado === 'Rechazada' ? 'Rechazada con comentario' : `Estado: ${sol.estado}`, user: sol.aprobador, date: `${sol.fecha} 08:05` }]
        : []),
    ];
  }

  approve(): void {
    this.data.approveSolicitud(this.solicitud().id);
  }

  reject(): void {
    this.data.rejectSolicitud(this.solicitud().id, this.rejectComment);
    this.rejectOpen.set(false);
  }
}
