import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { TaxiDataService } from '../../core/services/taxi-data.service';
import { AREAS, CONTRATOS_DATA, EMPRESAS, PROVEEDORES } from '../../data/mock-data';
import { Empresa } from '../../data/models';
import { PageHeaderComponent } from '../../shared/components/page-header.component';

@Component({
  selector: 'app-nueva-solicitud',
  standalone: true,
  imports: [ButtonModule, CurrencyPipe, PageHeaderComponent, ReactiveFormsModule, RouterLink],
  template: `
    <section class="mx-auto max-w-4xl space-y-5">
      <app-page-header title="Nueva Solicitud de Taxi" [breadcrumb]="['Inicio', 'Solicitudes de Taxi', 'Nueva solicitud']" backRoute="/solicitudes" />

      @if (submitted()) {
        <article class="app-card mx-auto max-w-xl p-8 text-center">
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-bg text-success">
            <i class="pi pi-check text-3xl"></i>
          </div>
          <h2 class="mt-4 text-xl font-bold text-brand-dark">¡Solicitud enviada exitosamente!</h2>
          <p class="mt-2 text-sm text-muted">Su solicitud ha sido registrada y enviada a aprobación.</p>
          <div class="mt-5 rounded-xl bg-brand-soft p-5 text-left">
            <p class="text-xs font-semibold uppercase tracking-wide text-muted">Voucher generado</p>
            <p class="mt-1 font-mono text-2xl font-bold text-brand">{{ voucher() }}</p>
            <p class="mt-2 text-sm text-muted">Aprobador: <strong>{{ aprobador() }}</strong></p>
            <p class="mt-1 text-xs text-warning">La solicitud se cancelará automáticamente si no es aprobada en 24 horas.</p>
          </div>
          <div class="mt-5 flex justify-center gap-3">
            <p-button label="Ver vouchers" icon="pi pi-file" severity="secondary" routerLink="/vouchers" />
            <p-button label="Ver solicitudes" icon="pi pi-car" routerLink="/solicitudes" />
          </div>
        </article>
      } @else {
        <article class="app-card p-5">
          <div class="flex items-center justify-between gap-2">
            @for (label of steps; track label; let index = $index) {
              <div class="flex flex-1 items-center">
                <div class="flex items-center gap-2">
                  <span
                    class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                    [class.bg-success]="step() > index + 1"
                    [class.bg-brand]="step() === index + 1"
                    [class.bg-surface-low]="step() < index + 1"
                    [class.text-white]="step() >= index + 1"
                    [class.text-muted]="step() < index + 1"
                  >
                    @if (step() > index + 1) { <i class="pi pi-check text-xs"></i> } @else { {{ index + 1 }} }
                  </span>
                  <span class="hidden text-xs font-semibold sm:block" [class.text-brand]="step() === index + 1" [class.text-muted]="step() !== index + 1">{{ label }}</span>
                </div>
                @if (!$last) {
                  <span class="mx-3 h-0.5 flex-1 rounded" [class.bg-success]="step() > index + 1" [class.bg-surface-high]="step() <= index + 1"></span>
                }
              </div>
            }
          </div>
        </article>

        <form class="app-card p-6" [formGroup]="form">
          @if (step() === 1) {
            <div class="space-y-4">
              <h3 class="border-b border-border pb-2 font-semibold text-brand-dark">Datos del solicitante</h3>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label><span class="field-label">Empresa</span><select class="control" formControlName="empresa">@for (item of empresas; track item) { <option [value]="item">{{ item }}</option> }</select></label>
                <label><span class="field-label">Área</span><select class="control" formControlName="area"><option value="">Seleccionar...</option>@for (item of areas; track item) { <option [value]="item">{{ item }}</option> }</select></label>
                <label><span class="field-label">Centro de costo</span><input class="control" formControlName="cc" placeholder="CC-RH-001" /></label>
                <label><span class="field-label">Solicitante</span><input class="control" formControlName="solicitante" placeholder="Nombre completo" /></label>
                <label><span class="field-label">Cargo</span><input class="control" formControlName="cargo" /></label>
                <label><span class="field-label">Jefe inmediato</span><input class="control" formControlName="jefeInmediato" /></label>
                <label><span class="field-label">Tipo de usuario</span><select class="control" formControlName="tipoUsuario"><option>Colaborador</option><option>Gerente</option><option>Director</option></select></label>
              </div>
            </div>
          }

          @if (step() === 2) {
            <div class="space-y-4">
              <h3 class="border-b border-border pb-2 font-semibold text-brand-dark">Datos del viaje</h3>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label><span class="field-label">Fecha requerida</span><input type="date" class="control" formControlName="fecha" /></label>
                <label><span class="field-label">Hora requerida</span><input type="time" class="control" formControlName="hora" /></label>
                <label class="sm:col-span-2"><span class="field-label">Origen</span><input class="control" formControlName="origen" /></label>
                <label class="sm:col-span-2"><span class="field-label">Destino</span><input class="control" formControlName="destino" /></label>
                <label><span class="field-label">Motivo</span><select class="control" formControlName="motivo"><option>Viaje de negocios</option><option>Reunión con cliente</option><option>Evento corporativo</option><option>Traslado de documentos</option><option>Auditoría</option></select></label>
                <label><span class="field-label">Pasajeros adicionales</span><input type="number" class="control" formControlName="pasajeros" /></label>
                <label class="sm:col-span-2"><span class="field-label">Observaciones</span><textarea class="control min-h-24 resize-none" formControlName="observaciones"></textarea></label>
              </div>
              <div class="rounded-lg border border-warning/30 bg-warning-bg p-3 text-sm text-warning">La solicitud debe realizarse con mínimo 30 minutos de anticipación.</div>
            </div>
          }

          @if (step() === 3) {
            <div class="space-y-4">
              <h3 class="border-b border-border pb-2 font-semibold text-brand-dark">Costo y proveedor</h3>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label><span class="field-label">Proveedor sugerido</span><select class="control" formControlName="proveedor">@for (item of proveedores; track item) { <option [value]="item">{{ item }}</option> }</select></label>
                <label><span class="field-label">Tipo de carrera</span><select class="control" formControlName="tipoCarrera"><option>Zona Urbana</option><option>Aeropuerto</option><option>Interbarrial</option><option>Kilométrica</option></select></label>
                <label><span class="field-label">Contrato relacionado</span><select class="control" formControlName="contrato">@for (item of contratos; track item.numero) { <option [value]="item.id">{{ item.numero }}</option> }</select></label>
                <div><span class="field-label">Tarifa estimada</span><div class="control bg-page text-muted">$35.00 (según tarifa pactada)</div></div>
              </div>
              @if (presupuestoActual()) {
                <div class="rounded-lg bg-brand-soft p-4">
                  <div class="flex items-center justify-between text-sm">
                    <span class="font-semibold text-brand-dark">Presupuesto del área: {{ presupuestoActual()?.area }}</span>
                    <span class="font-bold" [class.text-danger]="disponible() < 0" [class.text-warning]="disponible() >= 0 && pct() >= 80" [class.text-success]="pct() < 80">Disponible: {{ disponible() | currency:'USD':'symbol':'1.2-2' }}</span>
                  </div>
                  <div class="mt-2 h-2.5 overflow-hidden rounded-full bg-white">
                    <div class="h-full rounded-full" [style.width.%]="pct()" [class.bg-danger]="pct() >= 100" [class.bg-warning]="pct() >= 80 && pct() < 100" [class.bg-success]="pct() < 80"></div>
                  </div>
                </div>
              }
            </div>
          }

          @if (step() === 4) {
            <div class="space-y-4">
              <h3 class="border-b border-border pb-2 font-semibold text-brand-dark">Flujo de aprobación</h3>
              <div class="rounded-xl bg-brand-soft p-5">
                <p class="font-semibold text-brand-dark">{{ aprobador() }}</p>
                <p class="text-xs text-muted">Aprobador calculado según tipo de usuario</p>
              </div>
              <div class="rounded-lg border border-warning/30 bg-warning-bg p-4 text-sm text-warning">Si la solicitud no es aprobada en 24 horas, será cancelada automáticamente por el sistema.</div>
              <div class="rounded-lg border border-success/30 bg-success-bg p-4 text-xs text-muted">
                <strong class="text-ink">Resumen:</strong> {{ form.value.empresa }} · {{ form.value.area || 'Área pendiente' }} · {{ form.value.origen || 'Origen pendiente' }} → {{ form.value.destino || 'Destino pendiente' }}
              </div>
            </div>
          }

          <div class="mt-6 flex flex-col justify-between gap-3 border-t border-border pt-4 sm:flex-row">
            <div class="flex gap-2">
              @if (step() > 1) { <p-button label="Anterior" icon="pi pi-arrow-left" severity="secondary" (onClick)="previous()" /> }
              <p-button label="Cancelar" icon="pi pi-times" severity="secondary" routerLink="/solicitudes" />
            </div>
            <div class="flex gap-2">
              <p-button label="Guardar borrador" icon="pi pi-save" severity="secondary" />
              @if (step() < 4) {
                <p-button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" (onClick)="next()" />
              } @else {
                <p-button label="Enviar solicitud" icon="pi pi-send" severity="success" (onClick)="submit()" />
              }
            </div>
          </div>
        </form>
      }
    </section>
  `,
})
export class NuevaSolicitudComponent {
  private readonly fb = inject(FormBuilder);
  private readonly data = inject(TaxiDataService);
  private readonly formVersion = signal(0);

  readonly step = signal(1);
  readonly submitted = signal(false);
  readonly voucher = signal('VCH-ARCA-2026-000009');

  readonly empresas = EMPRESAS;
  readonly areas = AREAS;
  readonly proveedores = PROVEEDORES;
  readonly contratos = CONTRATOS_DATA;
  readonly steps = ['Datos del solicitante', 'Datos del viaje', 'Costo y proveedor', 'Flujo de aprobación'];

  readonly form = this.fb.nonNullable.group({
    empresa: ['ARCA', Validators.required],
    area: ['', Validators.required],
    cc: ['', Validators.required],
    solicitante: ['', Validators.required],
    cargo: [''],
    jefeInmediato: [''],
    tipoUsuario: ['Colaborador', Validators.required],
    fecha: ['', Validators.required],
    hora: ['', Validators.required],
    origen: ['', Validators.required],
    destino: ['', Validators.required],
    motivo: ['Viaje de negocios', Validators.required],
    pasajeros: [1],
    observaciones: [''],
    proveedor: ['TaxiSeguro Cía. Ltda.', Validators.required],
    tipoCarrera: ['Zona Urbana'],
    contrato: ['CONT-2026-001'],
  });

  readonly presupuestoActual = computed(() =>
    {
      this.formVersion();
      return this.data.presupuestos().find((item) => item.empresa === this.form.controls.empresa.value && item.area === this.form.controls.area.value);
    },
  );

  readonly disponible = computed(() => {
    const presupuesto = this.presupuestoActual();
    return presupuesto ? presupuesto.presupuesto - presupuesto.consumido : 0;
  });

  readonly pct = computed(() => {
    const presupuesto = this.presupuestoActual();
    return presupuesto ? Math.min(Math.round((presupuesto.consumido / presupuesto.presupuesto) * 100), 100) : 0;
  });

  readonly aprobador = computed(() => {
    this.formVersion();
    const tipo = this.form.controls.tipoUsuario.value;
    if (tipo === 'Gerente') return 'Autoaprobación';
    if (tipo === 'Director') return 'Asistente asignada';
    return this.form.controls.jefeInmediato.value || 'Jefe inmediato';
  });

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.formVersion.update((value) => value + 1);
    });
  }

  next(): void {
    this.step.update((value) => Math.min(value + 1, 4));
  }

  previous(): void {
    this.step.update((value) => Math.max(value - 1, 1));
  }

  submit(): void {
    const created = this.data.createSolicitud({
      empresa: this.form.controls.empresa.value as Empresa,
      area: this.form.controls.area.value,
      cc: this.form.controls.cc.value,
      solicitante: this.form.controls.solicitante.value || 'Nuevo solicitante',
      cargo: this.form.controls.cargo.value,
      jefeInmediato: this.form.controls.jefeInmediato.value,
      fecha: this.form.controls.fecha.value,
      hora: this.form.controls.hora.value,
      origen: this.form.controls.origen.value,
      destino: this.form.controls.destino.value,
      motivo: this.form.controls.motivo.value,
      pasajeros: Number(this.form.controls.pasajeros.value),
      proveedor: this.form.controls.proveedor.value,
      aprobador: this.aprobador(),
      contrato: this.form.controls.contrato.value,
    });
    this.voucher.set(created.voucher);
    this.submitted.set(true);
  }
}
