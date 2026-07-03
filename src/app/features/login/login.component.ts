import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthMockService } from '../../core/services/auth-mock.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <main class="login-page flex min-h-screen flex-col font-sans text-ink transition-all duration-500">
      <section class="flex flex-grow items-center justify-center p-4">
        <div class="login-card flex w-full max-w-[420px] flex-col gap-8 rounded-lg border border-border bg-white p-10">
          <header class="flex flex-col items-center gap-4 text-center">
            <div class="mb-2 w-48">
              <img
                class="h-full w-full object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEvAxrufjW_sYiPZygNcDpBnmzxeM1WymupjvqbISnRgrqNklYZhcUq0D19NQdIhG0R3kQrl7m_ah9p7Q8FlkQ-i9xfs6Xt3AcF01S5ASdkfNK4DQh6VCu2Poaaoc9V7R4OYrkzaRLuIFiXSJ3xo4Asc_Kex3L_UHgUC-pzQvgKwNGJ8ZvsQCvHhjhMV3WkvMmJcbKPLLQmFKRqzAIhRaA4t3AP-ou6b84R4uHfcRlk1bbiXhDtT4ycDx5C1bdGwo9wP4"
                alt="Arca Continental"
              />
            </div>
            <div class="flex flex-col gap-1">
              <h1 class="font-heading text-xl font-semibold leading-7 text-brand">Taxis Corporativos</h1>
              <p class="text-sm leading-5 text-muted">Gestión de Movilidad Arca Continental</p>
            </div>
          </header>

          <form class="flex flex-col gap-6" [formGroup]="form" (ngSubmit)="submit()">
            <label class="flex flex-col gap-2">
              <span class="login-label">Correo Corporativo</span>
              <span class="login-field relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline transition-colors">mail</span>
                <input
                  class="login-input"
                  type="email"
                  formControlName="email"
                  placeholder="usuario@arcacontal.com"
                  autocomplete="email"
                />
              </span>
            </label>

            <label class="flex flex-col gap-2">
              <span class="flex items-center justify-between gap-4">
                <span class="login-label">Contraseña</span>
                <button type="button" class="text-[12px] font-semibold text-brand transition hover:text-brand-hover hover:underline">
                  ¿Olvidó su contraseña?
                </button>
              </span>
              <span class="login-field relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline transition-colors">lock</span>
                <input
                  class="login-input"
                  type="password"
                  formControlName="password"
                  placeholder="••••••••"
                  autocomplete="current-password"
                />
              </span>
            </label>

            <label class="flex cursor-pointer items-center gap-2 text-sm leading-5 text-muted">
              <input class="login-checkbox h-4 w-4 rounded border-border" type="checkbox" />
              Recordar sesión
            </label>

            <button
              class="login-submit group flex w-full items-center justify-center gap-2 rounded bg-brand-container py-4 font-heading text-base font-semibold leading-6 text-white transition-colors hover:bg-brand active:opacity-90 disabled:cursor-wait disabled:opacity-75"
              type="submit"
              [disabled]="loading()"
            >
              @if (loading()) {
                <span class="material-symbols-outlined login-spinner">refresh</span>
                <span>Verificando...</span>
              } @else {
                <span>Iniciar Sesión</span>
                <span class="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
              }
            </button>
          </form>

          <footer class="border-t border-border pt-4 text-center">
            <p class="text-[12px] leading-5 text-outline">
              Acceso exclusivo para colaboradores autorizados.<br />
              Sistema de Gestión Logística v2.4.0
            </p>
          </footer>
        </div>
      </section>

      <div class="pointer-events-none fixed bottom-0 right-0 hidden p-8 opacity-[0.03] lg:block">
        <span class="material-symbols-outlined login-taxi-icon text-brand-dark">local_taxi</span>
      </div>
    </main>
  `,
  styles: `
    .material-symbols-outlined {
      font-variation-settings:
        'FILL' 0,
        'wght' 400,
        'GRAD' 0,
        'opsz' 24;
      vertical-align: middle;
    }

    .login-page {
      background-color: #f7f9ff;
      background-image: radial-gradient(#e6bdbb 0.5px, transparent 0.5px);
      background-size: 24px 24px;
    }

    .login-card {
      box-shadow:
        0 4px 6px -1px rgb(0 0 0 / 0.1),
        0 2px 4px -2px rgb(0 0 0 / 0.1);
    }

    .login-label {
      color: #5d3f3f;
      font-family: var(--font-heading);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.05em;
      line-height: 16px;
      text-transform: uppercase;
    }

    .login-input {
      width: 100%;
      border: 1px solid #e6bdbb;
      border-radius: 0.25rem;
      background: #ffffff;
      padding: 0.75rem 1rem 0.75rem 2.5rem;
      color: #181c20;
      font-size: 14px;
      line-height: 20px;
      outline: none;
      transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
    }

    .login-input::placeholder {
      color: rgb(145 111 110 / 0.5);
    }

    .login-input:focus {
      border-color: #ba0029;
      box-shadow: 0 0 0 1px rgb(227 29 59 / 0.2);
    }

    .login-field:focus-within .material-symbols-outlined {
      color: #ba0029;
    }

    .login-checkbox {
      accent-color: #ba0029;
    }

    .login-taxi-icon {
      font-size: 320px;
      font-variation-settings: 'wght' 100;
    }

    .login-spinner {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthMockService);

  readonly loading = signal(false);
  readonly form = this.fb.nonNullable.group({
    email: ['ana.rodriguez@arca.ec', [Validators.required, Validators.email]],
    password: ['Admin2026#', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    window.setTimeout(() => {
      this.loading.set(false);
      this.auth.login();
    }, 600);
  }
}
