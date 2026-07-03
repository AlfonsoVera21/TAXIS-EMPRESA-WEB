import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';

import { AuthMockService } from './core/services/auth-mock.service';

const authGuard: CanActivateFn = () => {
  const auth = inject(AuthMockService);
  const router = inject(Router);
  return auth.isLoggedIn() ? true : router.createUrlTree(['/login']);
};

const loginGuard: CanActivateFn = () => {
  const auth = inject(AuthMockService);
  const router = inject(Router);
  return auth.isLoggedIn() ? router.createUrlTree(['/dashboard']) : true;
};

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [loginGuard],
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./core/layout/app-shell.component').then((m) => m.AppShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent) },
      { path: 'solicitudes', loadComponent: () => import('./features/solicitudes/solicitudes.component').then((m) => m.SolicitudesComponent) },
      { path: 'solicitudes/nueva', loadComponent: () => import('./features/solicitudes/nueva-solicitud.component').then((m) => m.NuevaSolicitudComponent) },
      { path: 'solicitudes/:id', loadComponent: () => import('./features/solicitudes/detalle-solicitud.component').then((m) => m.DetalleSolicitudComponent) },
      { path: 'aprobaciones', loadComponent: () => import('./features/aprobaciones/aprobaciones.component').then((m) => m.AprobacionesComponent) },
      { path: 'vouchers', loadComponent: () => import('./features/vouchers/vouchers.component').then((m) => m.VouchersComponent) },
      { path: 'presupuestos', loadComponent: () => import('./features/presupuestos/presupuestos.component').then((m) => m.PresupuestosComponent) },
      { path: 'desembolsos', loadComponent: () => import('./features/desembolsos/desembolsos.component').then((m) => m.DesembolsosComponent) },
      { path: 'proveedores', loadComponent: () => import('./features/proveedores/proveedores.component').then((m) => m.ProveedoresComponent) },
      { path: 'contratos', loadComponent: () => import('./features/contratos/contratos.component').then((m) => m.ContratosComponent) },
      { path: 'reportes', loadComponent: () => import('./features/reportes/reportes.component').then((m) => m.ReportesComponent) },
      { path: 'administracion', loadComponent: () => import('./features/administracion/administracion.component').then((m) => m.AdministracionComponent) },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];

