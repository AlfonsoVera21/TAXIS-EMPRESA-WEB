import { CurrencyPipe } from '@angular/common';
import { NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { TaxiDataService } from '../../core/services/taxi-data.service';
import { ProveedorTaxi } from '../../data/models';
import { KpiCardComponent } from '../../shared/components/kpi-card.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [ButtonModule, CurrencyPipe, DialogModule, KpiCardComponent, NgClass, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <section class="space-y-5">
      <app-page-header title="Módulo de Proveedores" [breadcrumb]="['Inicio', 'Proveedores']">
        <p-button label="Nuevo proveedor" icon="pi pi-plus" (onClick)="newOpen.set(true)" />
      </app-page-header>

      <div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div class="space-y-3" [ngClass]="selected() ? 'xl:col-span-1' : 'xl:col-span-3'">
          @for (proveedor of data.proveedores(); track proveedor.id) {
            <article
              class="app-card cursor-pointer p-4 transition hover:shadow-md"
              [class.border-brand]="selected()?.id === proveedor.id"
              (click)="toggle(proveedor)"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft text-brand"><span class="material-symbols-outlined">local_taxi</span></div>
                  <div>
                    <p class="text-sm font-semibold text-ink">{{ proveedor.razonSocial }}</p>
                    <p class="text-xs text-muted">RUC: {{ proveedor.ruc }}</p>
                  </div>
                </div>
                <app-status-badge [status]="proveedor.estado" />
              </div>
              @if (!selected()) {
                <div class="mt-3 grid grid-cols-3 gap-3 border-t border-border pt-3 text-center">
                  <div><p class="text-lg font-bold text-brand">{{ proveedor.servicios }}</p><p class="text-xs text-muted">Servicios</p></div>
                  <div><p class="text-lg font-bold">{{ proveedor.monto | currency:'USD':'symbol':'1.0-0' }}</p><p class="text-xs text-muted">Facturado</p></div>
                  <div><p class="text-lg font-bold text-success">{{ proveedor.cumplimiento }}%</p><p class="text-xs text-muted">Cumplimiento</p></div>
                </div>
              }
            </article>
          }
        </div>

        @if (selected()) {
          <div class="space-y-4 xl:col-span-2">
            <article class="app-card p-5">
              <div class="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div class="flex items-center gap-3">
                  <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand"><span class="material-symbols-outlined text-3xl">business_center</span></div>
                  <div>
                    <h3 class="font-bold text-brand-dark">{{ selected()?.razonSocial }}</h3>
                    <p class="text-sm text-muted">RUC: {{ selected()?.ruc }}</p>
                  </div>
                </div>
                <div class="flex gap-2">
                  <p-button label="Editar" icon="pi pi-pencil" size="small" severity="secondary" (onClick)="editOpen.set(true)" />
                  <p-button [label]="selected()?.estado === 'Activo' ? 'Desactivar' : 'Activar'" [icon]="selected()?.estado === 'Activo' ? 'pi pi-ban' : 'pi pi-check'" size="small" [severity]="selected()?.estado === 'Activo' ? 'danger' : 'success'" />
                </div>
              </div>
              <div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                <div><p class="text-xs text-muted">Contacto</p><p class="font-medium">{{ selected()?.contacto }}</p></div>
                <div><p class="text-xs text-muted">Teléfono</p><p class="font-medium">{{ selected()?.telefono }}</p></div>
                <div><p class="text-xs text-muted">Correo</p><p class="font-medium">{{ selected()?.correo }}</p></div>
                <div><p class="text-xs text-muted">Cobertura</p><p class="font-medium">{{ selected()?.cobertura }}</p></div>
              </div>
              <div class="mt-4 border-t border-border pt-4">
                <p class="mb-2 text-xs text-muted">Empresas contratantes</p>
                <div class="flex flex-wrap gap-2">
                  @for (empresa of selected()?.empresas ?? []; track empresa) {
                    <span class="rounded bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand-dark">{{ empresa }}</span>
                  }
                </div>
              </div>
            </article>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <app-kpi-card title="Servicios realizados" [value]="selected()?.servicios ?? 0" icon="local_taxi" color="#ba0029" />
              <app-kpi-card title="Monto facturado" [value]="selected()?.monto | currency:'USD':'symbol':'1.0-0'" icon="attach_money" color="#047481" />
              <app-kpi-card title="Cumplimiento tarifa" [value]="(selected()?.cumplimiento ?? 0) + '%'" icon="verified" color="#9c4221" />
            </div>
          </div>
        }
      </div>

      <p-dialog header="Nuevo proveedor" [(visible)]="newDialogVisible" [modal]="true" [style]="{ width: 'min(94vw, 42rem)' }">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input class="control sm:col-span-2" placeholder="Razón social" />
          <input class="control" placeholder="RUC" />
          <input class="control" placeholder="Contacto" />
          <input class="control" placeholder="Teléfono" />
          <input class="control" placeholder="Correo" />
          <input class="control sm:col-span-2" placeholder="Cobertura" />
        </div>
        <div class="mt-4 flex justify-end gap-2">
          <p-button label="Cancelar" severity="secondary" (onClick)="newOpen.set(false)" />
          <p-button label="Guardar proveedor" icon="pi pi-save" (onClick)="newOpen.set(false)" />
        </div>
      </p-dialog>
    </section>
  `,
})
export class ProveedoresComponent {
  readonly data = inject(TaxiDataService);
  readonly selected = signal<ProveedorTaxi | null>(null);
  readonly newOpen = signal(false);
  readonly editOpen = signal(false);

  get newDialogVisible(): boolean {
    return this.newOpen();
  }

  set newDialogVisible(value: boolean) {
    this.newOpen.set(value);
  }

  toggle(proveedor: ProveedorTaxi): void {
    this.selected.set(this.selected()?.id === proveedor.id ? null : proveedor);
  }
}
