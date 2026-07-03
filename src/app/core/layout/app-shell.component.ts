import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthMockService } from '../services/auth-mock.service';
import { NavigationService } from '../services/navigation.service';
import { ArcaLogoComponent } from '../../shared/components/arca-logo.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [ArcaLogoComponent, CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="flex h-screen overflow-hidden bg-page">
      @if (navigation.mobileMenuOpen()) {
        <button
          type="button"
          aria-label="Cerrar menú"
          class="fixed inset-0 z-40 bg-black/50 lg:hidden"
          (click)="navigation.closeMobileMenu()"
        ></button>
      }

      <aside
        class="fixed z-50 flex h-full w-[260px] shrink-0 flex-col gap-1 border-r border-border bg-white py-6 text-ink transition-all duration-300 lg:relative lg:translate-x-0"
        [class.translate-x-0]="navigation.mobileMenuOpen()"
        [class.-translate-x-full]="!navigation.mobileMenuOpen()"
      >
        <div class="px-6 pb-8">
          <div class="flex flex-col gap-4">
            <app-arca-logo [size]="48" />
            <div>
              <h1 class="font-heading text-xl font-bold leading-7 text-brand">Gestión de Taxis</h1>
              <p class="font-heading text-xs font-bold uppercase tracking-[0.05em] text-muted opacity-70">Panel Corporativo</p>
            </div>
          </div>
        </div>

        <nav class="flex-1 overflow-y-auto">
          @for (item of navigation.menu; track item.route) {
            <a
              [routerLink]="item.route"
              routerLinkActive="arca-nav-active"
              class="font-heading flex items-center gap-4 border-l-4 border-transparent px-6 py-3 text-xs font-bold uppercase tracking-[0.05em] text-muted transition hover:bg-surface-high hover:text-brand"
              (click)="navigation.closeMobileMenu()"
            >
              <span class="material-symbols-outlined">{{ item.icon }}</span>
              <span class="truncate">{{ item.label }}</span>
            </a>
          }

          @for (item of navigation.adminMenu; track item.route) {
            <a
              [routerLink]="item.route"
              routerLinkActive="arca-nav-active"
              class="font-heading flex items-center gap-4 border-l-4 border-transparent px-6 py-3 text-xs font-bold uppercase tracking-[0.05em] text-muted transition hover:bg-surface-high hover:text-brand"
              (click)="navigation.closeMobileMenu()"
            >
              <span class="material-symbols-outlined">{{ item.icon }}</span>
              <span class="truncate">{{ item.label }}</span>
            </a>
          }
        </nav>

        <div class="mt-auto border-t border-border px-6 pt-6">
          <div class="flex cursor-pointer items-center gap-3 transition hover:opacity-80">
            <img
              class="h-10 w-10 rounded-full object-cover"
              alt="Ana Rodríguez"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAEU6SwVe8ZEbuSaM7reRUDhFiJjnQIhh_bzRTwk8pO8Aq8w8vvcNt1V4Iprp1EJoBKN4d9suqxl_G0HIvEDhhFlr4ZNeqDWZBos4cEqrrpjkYW_thzm64iBkoX0zLl3Gk-xUefDGHcv0fZQHlLLSG5X5mkMK2cNFt8eXppvYWGgiy9OdA7f2xdgBfQlAfgt6ql5X1-jZeTWmjV8vRLXY-9P5m87_vsxjn-n7tQzkNuZNWqDcch-Jseg"
            />
            <div class="min-w-0">
              <p class="font-heading truncate text-base font-semibold leading-6 text-ink">{{ auth.currentUser().nombre }}</p>
              <p class="truncate text-xs leading-4 text-muted">{{ auth.currentUser().rol }}</p>
            </div>
          </div>
        </div>
      </aside>

      <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header class="relative z-30 flex h-16 shrink-0 items-center justify-between border-b border-border bg-white px-6">
          <div class="flex items-center gap-3">
            <button
              type="button"
              class="rounded-md p-2 text-muted transition hover:bg-surface-low hover:text-brand lg:hidden"
              (click)="navigation.toggleMobileMenu()"
              aria-label="Abrir menú"
            >
              <span class="material-symbols-outlined text-xl">menu</span>
            </button>
            <div class="relative hidden w-full max-w-md md:block">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted">search</span>
              <input
                class="w-96 rounded-lg border border-border bg-surface-low py-2 pl-10 pr-4 text-sm outline-none transition focus:border-brand focus:bg-white focus:ring-1 focus:ring-brand"
                placeholder="Buscar solicitudes, vouchers..."
              />
            </div>
          </div>

          <div class="flex items-center gap-2">
            <div class="relative">
              <button
                type="button"
                class="relative rounded-lg p-2 text-muted transition hover:bg-surface-low hover:text-brand"
                (click)="toggleNotifications()"
                aria-label="Notificaciones"
              >
                <span class="material-symbols-outlined">notifications</span>
                <span class="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger"></span>
              </button>
              @if (notificationsOpen()) {
                <div class="absolute right-0 top-12 w-80 overflow-hidden rounded-xl border border-border bg-white shadow-xl">
                  <div class="flex items-center justify-between border-b border-border px-4 py-3">
                    <span class="font-heading text-sm font-semibold text-brand">Notificaciones</span>
                    <span class="rounded-full bg-danger px-2 py-0.5 text-xs font-semibold text-white">4</span>
                  </div>
                  @for (item of notifications; track item.text) {
                    <div class="flex items-start gap-3 border-b border-border px-4 py-3 last:border-0">
                      <span class="mt-1.5 h-2 w-2 shrink-0 rounded-full" [class]="item.color"></span>
                      <p class="text-xs text-ink">{{ item.text }}</p>
                    </div>
                  }
                </div>
              }
            </div>

            <div class="relative">
              <button
                type="button"
                class="flex items-center gap-2.5 rounded-lg py-1.5 pl-2 pr-3 transition hover:bg-surface-low"
                (click)="toggleProfile()"
              >
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                  {{ initials }}
                </div>
                <div class="hidden text-left sm:block">
                  <p class="text-sm font-semibold leading-tight text-ink">{{ auth.currentUser().nombre }}</p>
                  <p class="text-xs leading-tight text-muted">{{ auth.currentUser().rol }} · {{ auth.currentUser().empresa }}</p>
                </div>
                <span class="material-symbols-outlined hidden text-base text-muted sm:block">expand_more</span>
              </button>
              @if (profileOpen()) {
                <div class="absolute right-0 top-12 w-56 overflow-hidden rounded-xl border border-border bg-white shadow-xl">
                  <div class="border-b border-border px-4 py-3">
                    <p class="text-sm font-semibold text-ink">{{ auth.currentUser().nombre }}</p>
                    <p class="text-xs text-muted">{{ auth.currentUser().rol }}</p>
                  </div>
                  <button class="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-ink hover:bg-surface-low">
                    <span class="material-symbols-outlined text-base">person</span> Mi perfil
                  </button>
                  <button class="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-ink hover:bg-surface-low">
                    <span class="material-symbols-outlined text-base">settings</span> Configuración
                  </button>
                  <button class="flex w-full items-center gap-2.5 border-t border-border px-4 py-2.5 text-sm text-danger hover:bg-error-container" (click)="auth.logout()">
                    <span class="material-symbols-outlined text-base">logout</span> Cerrar sesión
                  </button>
                </div>
              }
            </div>
          </div>
        </header>

        <main class="flex-1 overflow-y-auto bg-page p-4 md:p-6">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class AppShellComponent {
  readonly auth = inject(AuthMockService);
  readonly navigation = inject(NavigationService);
  readonly profileOpen = signal(false);
  readonly notificationsOpen = signal(false);

  readonly notifications = [
    { text: 'SOL-2026-001 vence en 2 horas', color: 'bg-danger' },
    { text: 'Área Tecnología excedió presupuesto', color: 'bg-danger' },
    { text: 'Contrato CityTaxi vence en 60 días', color: 'bg-warning' },
    { text: 'Nueva solicitud de desembolso pendiente', color: 'bg-brand' },
  ];

  get initials(): string {
    return this.auth.currentUser().nombre
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2);
  }

  toggleProfile(): void {
    this.profileOpen.update((open) => !open);
    this.notificationsOpen.set(false);
  }

  toggleNotifications(): void {
    this.notificationsOpen.update((open) => !open);
    this.profileOpen.set(false);
  }
}
