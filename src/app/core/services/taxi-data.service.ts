import { Injectable, computed, signal } from '@angular/core';

import {
  CONTRATOS_DATA,
  DESEMBOLSOS_DATA,
  MONTHLY_DATA,
  PRESUPUESTOS_DATA,
  PROVEEDOR_CHART_DATA,
  PROVEEDORES_DATA,
  SOLICITUDES_DATA,
  SOLICITUDES_STATUS_DATA,
  TARIFAS_DATA,
  USUARIOS_DATA,
} from '../../data/mock-data';
import {
  Desembolso,
  EstadoVoucher,
  SolicitudTaxi,
} from '../../data/models';

@Injectable({ providedIn: 'root' })
export class TaxiDataService {
  private readonly solicitudesSignal = signal<SolicitudTaxi[]>([...SOLICITUDES_DATA]);
  private readonly desembolsosSignal = signal<Desembolso[]>([...DESEMBOLSOS_DATA]);

  readonly solicitudes = computed(() => this.solicitudesSignal());
  readonly presupuestos = signal([...PRESUPUESTOS_DATA]).asReadonly();
  readonly proveedores = signal([...PROVEEDORES_DATA]).asReadonly();
  readonly contratos = signal([...CONTRATOS_DATA]).asReadonly();
  readonly tarifas = signal([...TARIFAS_DATA]).asReadonly();
  readonly usuarios = signal([...USUARIOS_DATA]).asReadonly();
  readonly desembolsos = computed(() => this.desembolsosSignal());

  readonly monthlyData = MONTHLY_DATA;
  readonly solicitudesStatusData = SOLICITUDES_STATUS_DATA;
  readonly proveedorChartData = PROVEEDOR_CHART_DATA;

  readonly solicitudesPendientes = computed(() =>
    this.solicitudesSignal().filter((solicitud) => solicitud.estado === 'Pendiente'),
  );

  readonly dashboardTotals = computed(() => {
    const solicitudes = this.solicitudesSignal();
    const presupuestos = PRESUPUESTOS_DATA;
    const presupuestoTotal = presupuestos.reduce((sum, item) => sum + item.presupuesto, 0);
    const presupuestoConsumido = presupuestos.reduce((sum, item) => sum + item.consumido, 0);

    return {
      solicitudesMes: 124,
      pendientes: solicitudes.filter((item) => item.estado === 'Pendiente').length,
      aprobadas: solicitudes.filter((item) => item.estado === 'Aprobada').length + 40,
      rechazadas: solicitudes.filter((item) => item.estado === 'Rechazada').length + 7,
      canceladas: solicitudes.filter((item) => item.estado === 'Cancelada').length + 4,
      presupuestoTotal,
      presupuestoConsumido,
      presupuestoDisponible: presupuestoTotal - presupuestoConsumido,
      desembolsosPendientes: this.desembolsosSignal().filter((item) => item.estado === 'Pendiente').length,
    };
  });

  solicitudById(id: string | null): SolicitudTaxi | undefined {
    if (!id) {
      return undefined;
    }

    return this.solicitudesSignal().find((solicitud) => solicitud.id === id);
  }

  approveSolicitud(id: string): void {
    this.solicitudesSignal.update((items) =>
      items.map((item) =>
        item.id === id ? { ...item, estado: 'Aprobada', aprobador: item.aprobador || 'Ana Rodríguez' } : item,
      ),
    );
  }

  rejectSolicitud(id: string, comment: string): void {
    this.solicitudesSignal.update((items) =>
      items.map((item) =>
        item.id === id ? { ...item, estado: 'Rechazada', comentarioRechazo: comment } : item,
      ),
    );
  }

  createSolicitud(payload: Partial<SolicitudTaxi>): SolicitudTaxi {
    const next = this.solicitudesSignal().length + 1;
    const empresa = payload.empresa ?? 'ARCA';
    const solicitud: SolicitudTaxi = {
      id: `SOL-2026-${String(next).padStart(3, '0')}`,
      voucher: `VCH-${empresa}-2026-${String(next).padStart(6, '0')}`,
      empresa,
      area: payload.area ?? 'Recursos Humanos',
      cc: payload.cc ?? 'CC-RH-001',
      solicitante: payload.solicitante ?? 'Nuevo solicitante',
      cargo: payload.cargo ?? 'Colaborador',
      jefeInmediato: payload.jefeInmediato ?? 'Jefe inmediato',
      fecha: payload.fecha ?? '2026-07-03',
      hora: payload.hora ?? '09:00',
      origen: payload.origen ?? 'Oficina corporativa',
      destino: payload.destino ?? 'Destino corporativo',
      motivo: payload.motivo ?? 'Viaje de negocios',
      pasajeros: payload.pasajeros ?? 1,
      proveedor: payload.proveedor ?? 'TaxiSeguro Cía. Ltda.',
      valorEstimado: payload.valorEstimado ?? 35,
      estado: 'Pendiente',
      aprobador: payload.aprobador ?? 'Jefe inmediato',
      tipoUsuario: payload.tipoUsuario ?? 'Colaborador',
      contrato: payload.contrato ?? 'CONT-2026-001',
      createdAt: '2026-07-03 16:00',
    };

    this.solicitudesSignal.update((items) => [solicitud, ...items]);
    return solicitud;
  }

  voucherEstado(solicitud: SolicitudTaxi): EstadoVoucher {
    if (solicitud.estado === 'Finalizada') {
      return 'Usado';
    }
    if (solicitud.estado === 'Cancelada' || solicitud.estado === 'Rechazada') {
      return 'Anulado';
    }
    if (solicitud.estado === 'Aprobada' || solicitud.estado === 'En servicio') {
      return 'Aprobado';
    }
    return 'Generado';
  }

  createDesembolso(payload: Omit<Desembolso, 'id' | 'estado' | 'fecha'>): void {
    const next = this.desembolsosSignal().length + 1;
    this.desembolsosSignal.update((items) => [
      {
        ...payload,
        id: `DES-2026-${String(next).padStart(3, '0')}`,
        estado: 'Pendiente',
        fecha: '2026-07-03',
      },
      ...items,
    ]);
  }
}

