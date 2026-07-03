import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';

import { TaxiDataService } from '../../core/services/taxi-data.service';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';

@Component({
  selector: 'app-contratos',
  standalone: true,
  imports: [ButtonModule, CurrencyPipe, DialogModule, PageHeaderComponent, StatusBadgeComponent, TableModule],
  template: `
    <section class="space-y-5">
      <app-page-header title="Módulo de Contratos y Tarifas" [breadcrumb]="['Inicio', 'Contratos']">
        <p-button label="Nuevo contrato" icon="pi pi-plus" (onClick)="newOpen.set(true)" />
      </app-page-header>

      <div class="rounded-lg border border-brand/20 bg-brand-soft p-3 text-sm text-brand-dark">
        <i class="pi pi-exclamation-triangle mr-2 text-warning"></i>
        El contrato <strong>CTR-TONI-2026-001</strong> con CityTaxi S.A. vence el <strong>31 agosto 2026</strong>.
      </div>

      <div class="flex w-fit gap-1 rounded-lg border border-border bg-page p-1">
        <button class="rounded-md px-4 py-2 text-sm font-semibold" [class.bg-white]="tab() === 'contratos'" [class.text-brand-dark]="tab() === 'contratos'" [class.text-muted]="tab() !== 'contratos'" (click)="tab.set('contratos')">Contratos</button>
        <button class="rounded-md px-4 py-2 text-sm font-semibold" [class.bg-white]="tab() === 'tarifas'" [class.text-brand-dark]="tab() === 'tarifas'" [class.text-muted]="tab() !== 'tarifas'" (click)="tab.set('tarifas')">Tarifas</button>
      </div>

      @if (tab() === 'contratos') {
        <article class="app-card table-shell overflow-hidden">
          <p-table [value]="data.contratos()" responsiveLayout="scroll">
            <ng-template pTemplate="header"><tr><th>ID</th><th>Proveedor</th><th>N° Contrato</th><th>Inicio</th><th>Vencimiento</th><th>Estado</th><th>Empresas</th><th>Responsable</th><th>Acciones</th></tr></ng-template>
            <ng-template pTemplate="body" let-item>
              <tr>
                <td class="font-semibold text-brand">{{ item.id }}</td>
                <td class="font-medium">{{ item.proveedor }}</td>
                <td class="font-mono text-xs text-muted">{{ item.numero }}</td>
                <td class="text-muted">{{ item.fechaInicio }}</td>
                <td class="text-muted">{{ item.fechaFin }}</td>
                <td><app-status-badge [status]="item.estado" /></td>
                <td><div class="flex flex-wrap gap-1">@for (empresa of item.empresas; track empresa) { <span class="rounded bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand-dark">{{ empresa }}</span> }</div></td>
                <td class="text-muted">{{ item.responsable }}</td>
                <td><button class="rounded-md p-2 text-muted hover:bg-surface-low"><i class="pi pi-eye"></i></button><button class="rounded-md p-2 text-muted hover:bg-surface-low"><i class="pi pi-pencil"></i></button></td>
              </tr>
            </ng-template>
          </p-table>
        </article>
      } @else {
        <article class="app-card table-shell overflow-hidden">
          <div class="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 class="text-sm font-semibold text-brand-dark">Tarifas pactadas</h3>
            <p-button label="Nueva tarifa" icon="pi pi-plus" size="small" severity="secondary" />
          </div>
          <p-table [value]="data.tarifas()" responsiveLayout="scroll">
            <ng-template pTemplate="header"><tr><th>Tipo</th><th>Ciudad</th><th>Origen</th><th>Destino</th><th>Valor pactado</th><th>Vigencia</th><th>Proveedor</th><th>Acciones</th></tr></ng-template>
            <ng-template pTemplate="body" let-item>
              <tr>
                <td><span class="rounded border border-border bg-page px-2 py-0.5 text-xs">{{ item.tipo }}</span></td>
                <td class="text-muted">{{ item.ciudad }}</td>
                <td class="text-muted">{{ item.origen }}</td>
                <td class="text-muted">{{ item.destino }}</td>
                <td class="font-bold text-brand">{{ item.valor | currency:'USD':'symbol':'1.2-2' }}</td>
                <td class="text-muted">{{ item.vigencia }}</td>
                <td class="text-muted">{{ item.proveedor }}</td>
                <td><button class="rounded-md p-2 text-muted hover:bg-surface-low"><i class="pi pi-pencil"></i></button><button class="rounded-md p-2 text-muted hover:bg-error-container hover:text-danger"><i class="pi pi-times-circle"></i></button></td>
              </tr>
            </ng-template>
          </p-table>
        </article>
      }

      <p-dialog header="Nuevo contrato" [(visible)]="dialogVisible" [modal]="true" [style]="{ width: 'min(94vw, 42rem)' }">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <select class="control">@for (proveedor of data.proveedores(); track proveedor.id) { <option>{{ proveedor.razonSocial }}</option> }</select>
          <input class="control" placeholder="CTR-XXXX-2026-001" />
          <input type="date" class="control" />
          <input type="date" class="control" />
          <input class="control sm:col-span-2" placeholder="Responsable" />
        </div>
        <div class="mt-4 flex justify-end gap-2">
          <p-button label="Cancelar" severity="secondary" (onClick)="newOpen.set(false)" />
          <p-button label="Guardar contrato" icon="pi pi-save" (onClick)="newOpen.set(false)" />
        </div>
      </p-dialog>
    </section>
  `,
})
export class ContratosComponent {
  readonly data = inject(TaxiDataService);
  readonly tab = signal<'contratos' | 'tarifas'>('contratos');
  readonly newOpen = signal(false);

  get dialogVisible(): boolean {
    return this.newOpen();
  }

  set dialogVisible(value: boolean) {
    this.newOpen.set(value);
  }
}
