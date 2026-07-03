import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';

import { TaxiDataService } from '../../core/services/taxi-data.service';
import { AREAS, EMPRESAS } from '../../data/mock-data';
import { Empresa } from '../../data/models';
import { KpiCardComponent } from '../../shared/components/kpi-card.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';

@Component({
  selector: 'app-desembolsos',
  standalone: true,
  imports: [ButtonModule, CurrencyPipe, DialogModule, KpiCardComponent, PageHeaderComponent, ReactiveFormsModule, StatusBadgeComponent, TableModule],
  template: `
    <section class="space-y-5">
      <app-page-header title="Solicitudes de Desembolso" [breadcrumb]="['Inicio', 'Solicitudes de Desembolso']">
        <p-button label="Nueva solicitud" icon="pi pi-plus" (onClick)="newOpen.set(true)" />
      </app-page-header>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <app-kpi-card title="Pendientes" value="1" icon="schedule" color="#9c4221" sub="Por aprobar" />
        <app-kpi-card title="Aprobados este mes" value="1" icon="fact_check" color="#047481" sub="Julio 2026" />
        <app-kpi-card title="Monto total solicitado" value="$1,900" icon="attach_money" color="#ba0029" sub="2026" />
      </div>

      <article class="app-card table-shell overflow-hidden">
        <p-table [value]="data.desembolsos()" responsiveLayout="scroll">
          <ng-template pTemplate="header">
            <tr>
              <th>ID</th><th>Empresa</th><th>Área</th><th>Mes</th><th>Presupuesto</th><th>Consumo</th><th>Solicitado</th><th>Responsable</th><th>Estado</th><th>Fecha</th><th>Acciones</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-item>
            <tr>
              <td class="font-semibold text-brand">{{ item.id }}</td>
              <td><span class="rounded bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand-dark">{{ item.empresa }}</span></td>
              <td class="text-muted">{{ item.area }}</td>
              <td class="text-muted">{{ item.mes }}</td>
              <td>{{ item.presupuesto | currency:'USD':'symbol':'1.0-0' }}</td>
              <td class="font-medium text-danger">{{ item.consumo | currency:'USD':'symbol':'1.0-0' }}</td>
              <td class="font-bold text-brand">{{ item.solicitado | currency:'USD':'symbol':'1.0-0' }}</td>
              <td class="whitespace-nowrap text-muted">{{ item.responsable }}</td>
              <td><app-status-badge [status]="item.estado" /></td>
              <td class="text-muted">{{ item.fecha }}</td>
              <td><button class="rounded-md p-2 text-muted transition hover:bg-surface-low hover:text-brand"><i class="pi pi-eye"></i></button></td>
            </tr>
          </ng-template>
        </p-table>
      </article>

      <p-dialog header="Nueva Solicitud de Desembolso" [(visible)]="dialogVisible" [modal]="true" [style]="{ width: 'min(94vw, 48rem)' }">
        <form class="space-y-4" [formGroup]="form">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label><span class="field-label">Empresa</span><select class="control" formControlName="empresa">@for (item of empresas; track item) { <option [value]="item">{{ item }}</option> }</select></label>
            <label><span class="field-label">Área</span><select class="control" formControlName="area">@for (item of areas; track item) { <option [value]="item">{{ item }}</option> }</select></label>
            <label><span class="field-label">Mes</span><input class="control" type="month" formControlName="mes" /></label>
            <label><span class="field-label">Valor solicitado</span><input class="control" type="number" formControlName="solicitado" /></label>
            <label><span class="field-label">Responsable</span><input class="control" formControlName="responsable" /></label>
          </div>
          <label><span class="field-label">Justificación</span><textarea class="control min-h-28 resize-none" formControlName="justificacion"></textarea></label>
          <div class="flex justify-end gap-2">
            <p-button label="Cancelar" severity="secondary" (onClick)="newOpen.set(false)" />
            <p-button label="Enviar solicitud" icon="pi pi-send" (onClick)="submit()" />
          </div>
        </form>
      </p-dialog>
    </section>
  `,
})
export class DesembolsosComponent {
  readonly data = inject(TaxiDataService);
  private readonly fb = inject(FormBuilder);
  readonly newOpen = signal(false);
  readonly empresas = EMPRESAS;
  readonly areas = AREAS;

  readonly form = this.fb.nonNullable.group({
    empresa: ['ARCA', Validators.required],
    area: ['Tecnología', Validators.required],
    mes: ['2026-07', Validators.required],
    solicitado: [500, Validators.required],
    responsable: ['Isabel Cruz', Validators.required],
    justificacion: ['Incremento operativo no planificado', Validators.required],
  });

  get dialogVisible(): boolean {
    return this.newOpen();
  }

  set dialogVisible(value: boolean) {
    this.newOpen.set(value);
  }

  submit(): void {
    this.data.createDesembolso({
      empresa: this.form.controls.empresa.value as Empresa,
      area: this.form.controls.area.value,
      mes: this.form.controls.mes.value,
      presupuesto: 1800,
      consumo: 1850,
      solicitado: Number(this.form.controls.solicitado.value),
      responsable: this.form.controls.responsable.value,
      justificacion: this.form.controls.justificacion.value,
    });
    this.newOpen.set(false);
  }
}
