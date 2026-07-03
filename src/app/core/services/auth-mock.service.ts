import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';

import { UsuarioSistema } from '../../data/models';

@Injectable({ providedIn: 'root' })
export class AuthMockService {
  private readonly loggedIn = signal(this.readSession());
  private readonly userSignal = signal<UsuarioSistema>({
    id: 'USR-001',
    nombre: 'Ana Rodríguez',
    correo: 'ana.rodriguez@arca.ec',
    empresa: 'ARCA',
    area: 'Administración',
    rol: 'Administrador',
    estado: 'Activo',
  });

  readonly isLoggedIn = computed(() => this.loggedIn());
  readonly currentUser = computed(() => this.userSignal());

  constructor(private readonly router: Router) {}

  login(): void {
    this.loggedIn.set(true);
    globalThis.sessionStorage?.setItem('taxis-auth', 'true');
    void this.router.navigateByUrl('/dashboard');
  }

  logout(): void {
    this.loggedIn.set(false);
    globalThis.sessionStorage?.removeItem('taxis-auth');
    void this.router.navigateByUrl('/login');
  }

  private readSession(): boolean {
    return globalThis.sessionStorage?.getItem('taxis-auth') === 'true';
  }
}
