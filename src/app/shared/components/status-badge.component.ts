import { Component, Input } from '@angular/core';

const STATUS_CFG: Record<string, { fg: string; bg: string; border: string }> = {
  Pendiente: { fg: '#9c4221', bg: '#fffaf0', border: '#9c422166' },
  Aprobada: { fg: '#047481', bg: '#e6fffa', border: '#04748166' },
  Rechazada: { fg: '#c53030', bg: '#fff5f5', border: '#c5303066' },
  Cancelada: { fg: '#5d3f3f', bg: '#e0e3e8', border: '#e6bdbb' },
  Vencida: { fg: '#ba1a1a', bg: '#ffdad6', border: '#ba1a1a66' },
  'En servicio': { fg: '#92001e', bg: '#ffdad9', border: '#ba002966' },
  Finalizada: { fg: '#5d3f3f', bg: '#e0e3e8', border: '#e6bdbb' },
  Generado: { fg: '#5d3f3f', bg: '#e0e3e8', border: '#e6bdbb' },
  Aprobado: { fg: '#9c4221', bg: '#fffaf0', border: '#9c422166' },
  Usado: { fg: '#047481', bg: '#e6fffa', border: '#04748166' },
  Anulado: { fg: '#ba1a1a', bg: '#ffdad6', border: '#ba1a1a66' },
  Vigente: { fg: '#047481', bg: '#e6fffa', border: '#04748166' },
  'Por vencer': { fg: '#9c4221', bg: '#fffaf0', border: '#9c422166' },
  Ejecutado: { fg: '#047481', bg: '#e6fffa', border: '#04748166' },
  Activo: { fg: '#047481', bg: '#e6fffa', border: '#04748166' },
  Inactivo: { fg: '#5d3f3f', bg: '#e0e3e8', border: '#e6bdbb' },
  Normal: { fg: '#047481', bg: '#e6fffa', border: '#04748166' },
  Crítico: { fg: '#9c4221', bg: '#fffaf0', border: '#9c422166' },
  Excedido: { fg: '#ba1a1a', bg: '#ffdad6', border: '#ba1a1a66' },
};

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `
    <span
      class="font-heading inline-flex items-center rounded px-3 py-1 text-[11px] font-bold uppercase tracking-[0.04em]"
      [style.color]="config.fg"
      [style.background-color]="config.bg"
      [style.border]="'1px solid ' + config.border"
    >
      {{ status }}
    </span>
  `,
})
export class StatusBadgeComponent {
  @Input({ required: true }) status = '';

  get config(): { fg: string; bg: string; border: string } {
    return STATUS_CFG[this.status] ?? { fg: '#5d3f3f', bg: '#e0e3e8', border: '#e6bdbb' };
  }
}
