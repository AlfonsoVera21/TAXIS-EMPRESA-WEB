import { Injectable, signal } from '@angular/core';

export interface NavigationItem {
  label: string;
  route: string;
  icon: string;
}

@Injectable({ providedIn: 'root' })
export class NavigationService {
  readonly mobileMenuOpen = signal(false);

  readonly menu: NavigationItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Solicitudes', route: '/solicitudes', icon: 'local_taxi' },
    { label: 'Aprobaciones', route: '/aprobaciones', icon: 'fact_check' },
    { label: 'Vouchers', route: '/vouchers', icon: 'receipt_long' },
    { label: 'Presupuestos', route: '/presupuestos', icon: 'account_balance_wallet' },
    { label: 'Proveedores', route: '/proveedores', icon: 'business_center' },
    { label: 'Contratos', route: '/contratos', icon: 'description' },
    { label: 'Reportes', route: '/reportes', icon: 'assessment' },
  ];

  readonly adminMenu: NavigationItem[] = [
    { label: 'Administración', route: '/administracion', icon: 'admin_panel_settings' },
  ];

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((value) => !value);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
