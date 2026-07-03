import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';

import { TaxiDataService } from '../../core/services/taxi-data.service';
import { AREAS, EMPRESAS } from '../../data/mock-data';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';

@Component({
  selector: 'app-administracion',
  standalone: true,
  imports: [ButtonModule, CurrencyPipe, DialogModule, PageHeaderComponent, ReactiveFormsModule, StatusBadgeComponent, TableModule],
  template: `
    <section class="space-y-5">
      <app-page-header title="Administración" [breadcrumb]="['Inicio', 'Administración']" />

      <div class="flex w-fit flex-wrap gap-1 rounded-lg border border-border bg-page p-1">
        @for (item of tabs; track item.id) {
          <button class="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-semibold transition" [class.bg-white]="tab() === item.id" [class.text-brand-dark]="tab() === item.id" [class.text-muted]="tab() !== item.id" (click)="tab.set(item.id)">
            <i [class]="item.icon"></i> {{ item.label }}
          </button>
        }
      </div>

      @if (tab() === 'usuarios') {
        <article class="app-card table-shell overflow-hidden">
          <div class="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 class="text-sm font-semibold text-brand-dark">Gestión de usuarios</h3>
            <p-button label="Nuevo usuario" icon="pi pi-plus" size="small" (onClick)="newUserOpen.set(true)" />
          </div>
          <p-table [value]="data.usuarios()" responsiveLayout="scroll">
            <ng-template pTemplate="header"><tr><th>ID</th><th>Nombre</th><th>Correo</th><th>Empresa</th><th>Área</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr></ng-template>
            <ng-template pTemplate="body" let-user>
              <tr>
                <td class="text-xs text-muted">{{ user.id }}</td>
                <td><div class="flex items-center gap-2.5"><span class="flex h-7 w-7 items-center justify-center rounded-full bg-brand-soft text-xs font-bold text-brand">{{ initials(user.nombre) }}</span><span class="font-medium">{{ user.nombre }}</span></div></td>
                <td class="text-muted">{{ user.correo }}</td>
                <td><span class="rounded bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand-dark">{{ user.empresa }}</span></td>
                <td class="text-muted">{{ user.area }}</td>
                <td><span class="rounded border border-border bg-page px-2 py-0.5 text-xs">{{ user.rol }}</span></td>
                <td><app-status-badge [status]="user.estado" /></td>
                <td><button class="rounded-md p-2 text-muted hover:bg-surface-low"><i class="pi pi-pencil"></i></button><button class="rounded-md p-2 text-muted hover:bg-error-container hover:text-danger"><i class="pi pi-ban"></i></button></td>
              </tr>
            </ng-template>
          </p-table>
        </article>
      }

      @if (tab() === 'empresas') {
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          @for (empresa of empresasCards; track empresa.nombre) {
            <article class="app-card p-5">
              <div class="mb-3 flex items-center justify-between">
                <span class="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-sm font-bold text-brand-dark">{{ empresa.nombre }}</span>
                <app-status-badge status="Activo" />
              </div>
              <p class="text-sm font-semibold">{{ empresa.razon }}</p>
              <p class="mt-1 text-xs text-muted">RUC: {{ empresa.ruc }}</p>
              <div class="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted">
                <span>{{ empresa.usuarios }} usuarios</span>
                <button class="text-brand"><i class="pi pi-cog"></i></button>
              </div>
            </article>
          }
        </div>
      }

      @if (tab() === 'areas') {
        <article class="app-card table-shell overflow-hidden">
          <div class="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 class="text-sm font-semibold text-brand-dark">Áreas y centros de costo</h3>
            <p-button label="Nueva área" icon="pi pi-plus" size="small" />
          </div>
          <p-table [value]="data.presupuestos()" responsiveLayout="scroll">
            <ng-template pTemplate="header"><tr><th>Área</th><th>Centro de costo</th><th>Empresa</th><th>Presupuesto</th><th>Estado</th><th>Acciones</th></tr></ng-template>
            <ng-template pTemplate="body" let-area>
              <tr>
                <td class="font-medium">{{ area.area }}</td>
                <td class="font-mono text-xs text-muted">{{ area.cc }}</td>
                <td><span class="rounded bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand-dark">{{ area.empresa }}</span></td>
                <td class="font-semibold">{{ area.presupuesto | currency:'USD':'symbol':'1.0-0' }}/mes</td>
                <td><app-status-badge status="Activo" /></td>
                <td><button class="rounded-md p-2 text-muted hover:bg-surface-low"><i class="pi pi-pencil"></i></button></td>
              </tr>
            </ng-template>
          </p-table>
        </article>
      }

      @if (tab() === 'roles') {
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          @for (role of roles; track role.rol) {
            <article class="app-card p-5">
              <div class="mb-3 flex items-start justify-between">
                <div><p class="font-semibold text-brand-dark">{{ role.rol }}</p><p class="mt-0.5 text-xs text-muted">{{ role.desc }}</p></div>
                <button class="text-muted hover:text-warning"><i class="pi pi-pencil"></i></button>
              </div>
              <div class="space-y-1.5">
                @for (permiso of role.permisos; track permiso) {
                  <p class="flex items-center gap-2 text-xs text-muted"><i class="pi pi-check text-success"></i>{{ permiso }}</p>
                }
              </div>
            </article>
          }
        </div>
      }

      @if (tab() === 'parametros') {
        <div class="grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
          @for (param of parametros; track param.label) {
            <article class="app-card p-5">
              <div class="flex items-start gap-3">
                <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-soft text-brand"><i [class]="param.icon"></i></span>
                <div class="flex-1">
                  <p class="text-sm font-semibold">{{ param.label }}</p>
                  <p class="mt-0.5 text-xs text-muted">{{ param.desc }}</p>
                  <div class="mt-2 flex items-center justify-between">
                    <span class="text-sm font-bold text-brand">{{ param.value }}</span>
                    <button class="text-xs text-brand hover:underline">Editar</button>
                  </div>
                </div>
              </div>
            </article>
          }
        </div>
      }

      <p-dialog header="Nuevo usuario" [(visible)]="dialogVisible" [modal]="true" [style]="{ width: 'min(94vw, 42rem)' }">
        <form class="grid grid-cols-1 gap-4 sm:grid-cols-2" [formGroup]="userForm">
          <input class="control sm:col-span-2" placeholder="Nombre completo" formControlName="nombre" />
          <input class="control sm:col-span-2" placeholder="Correo corporativo" formControlName="correo" />
          <select class="control" formControlName="empresa">@for (empresa of empresas; track empresa) { <option [value]="empresa">{{ empresa }}</option> }</select>
          <select class="control" formControlName="area">@for (area of areas; track area) { <option [value]="area">{{ area }}</option> }</select>
          <select class="control sm:col-span-2" formControlName="rol"><option>Solicitante</option><option>Jefe Inmediato</option><option>Gerente</option><option>Director</option><option>Asistente</option><option>Administrador</option></select>
        </form>
        <div class="mt-4 flex justify-end gap-2">
          <p-button label="Cancelar" severity="secondary" (onClick)="newUserOpen.set(false)" />
          <p-button label="Crear usuario" icon="pi pi-save" (onClick)="newUserOpen.set(false)" />
        </div>
      </p-dialog>
    </section>
  `,
})
export class AdministracionComponent {
  readonly data = inject(TaxiDataService);
  private readonly fb = inject(FormBuilder);

  readonly tab = signal('usuarios');
  readonly newUserOpen = signal(false);
  readonly empresas = EMPRESAS;
  readonly areas = AREAS;

  readonly userForm = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    correo: ['', Validators.required],
    empresa: ['ARCA', Validators.required],
    area: ['Recursos Humanos', Validators.required],
    rol: ['Solicitante', Validators.required],
  });

  readonly tabs = [
    { id: 'usuarios', label: 'Usuarios', icon: 'pi pi-users' },
    { id: 'empresas', label: 'Empresas', icon: 'pi pi-building' },
    { id: 'areas', label: 'Áreas y CC', icon: 'pi pi-briefcase' },
    { id: 'roles', label: 'Roles y Permisos', icon: 'pi pi-shield' },
    { id: 'parametros', label: 'Parámetros', icon: 'pi pi-cog' },
  ];

  readonly empresasCards = [
    { nombre: 'ARCA', razon: 'Arca Continental Ecuador S.A.', ruc: '1790012345001', usuarios: 45 },
    { nombre: 'TONI', razon: 'Toni Alimentos S.A.', ruc: '1790098765001', usuarios: 28 },
    { nombre: 'INALECSA', razon: 'Industrial Lojana de Confecciones S.A.', ruc: '1790567891001', usuarios: 31 },
  ];

  readonly roles = [
    { rol: 'Solicitante', desc: 'Crea y consulta sus propias solicitudes de taxi', permisos: ['Ver solicitudes propias', 'Crear solicitudes', 'Ver sus vouchers'] },
    { rol: 'Jefe Inmediato', desc: 'Aprueba o rechaza solicitudes de sus colaboradores', permisos: ['Aprobar/rechazar solicitudes', 'Ver solicitudes del equipo', 'Ver presupuesto del área'] },
    { rol: 'Gerente', desc: 'Puede autoaprobar sus propias solicitudes', permisos: ['Autoaprobación de solicitudes', 'Ver reportes del área'] },
    { rol: 'Administrador', desc: 'Acceso completo al sistema', permisos: ['Configurar sistema', 'Gestionar usuarios y roles', 'Ver todos los reportes'] },
  ];

  readonly parametros = [
    { label: 'Anticipación mínima de solicitud', value: '30 minutos', desc: 'Tiempo mínimo requerido antes del servicio', icon: 'pi pi-clock' },
    { label: 'Tiempo máximo de aprobación', value: '24 horas', desc: 'Luego se cancela automáticamente', icon: 'pi pi-exclamation-triangle' },
    { label: 'Formato de voucher', value: 'VCH-{EMPRESA}-{AÑO}-{SEQ}', desc: 'Estructura del número generado', icon: 'pi pi-file' },
    { label: 'Alerta de presupuesto', value: '80% consumido', desc: 'Umbral de alerta presupuestaria', icon: 'pi pi-dollar' },
  ];

  get dialogVisible(): boolean {
    return this.newUserOpen();
  }

  set dialogVisible(value: boolean) {
    this.newUserOpen.set(value);
  }

  initials(name: string): string {
    return name.split(' ').map((part) => part[0]).join('').slice(0, 2);
  }
}

