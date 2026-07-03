export type Empresa = 'ARCA' | 'TONI' | 'INALECSA';

export type EstadoSolicitud =
  | 'Pendiente'
  | 'Aprobada'
  | 'Rechazada'
  | 'Cancelada'
  | 'Vencida'
  | 'En servicio'
  | 'Finalizada';

export type EstadoVoucher = 'Generado' | 'Aprobado' | 'Usado' | 'Anulado' | 'Vencido';
export type EstadoContrato = 'Vigente' | 'Por vencer' | 'Inactivo';
export type EstadoDesembolso = 'Pendiente' | 'Aprobado' | 'Rechazado' | 'Ejecutado';
export type EstadoGeneral = 'Activo' | 'Inactivo';

export interface SolicitudTaxi {
  id: string;
  voucher: string;
  empresa: Empresa;
  area: string;
  cc: string;
  solicitante: string;
  cargo: string;
  jefeInmediato: string;
  fecha: string;
  hora: string;
  origen: string;
  destino: string;
  motivo: string;
  pasajeros: number;
  proveedor: string;
  valorEstimado: number;
  estado: EstadoSolicitud;
  aprobador: string;
  tipoUsuario: 'Colaborador' | 'Gerente' | 'Director';
  contrato: string;
  createdAt: string;
  comentarioRechazo?: string;
}

export interface PresupuestoArea {
  area: string;
  empresa: Empresa;
  presupuesto: number;
  consumido: number;
  cc: string;
}

export interface ProveedorTaxi {
  id: string;
  razonSocial: string;
  ruc: string;
  contacto: string;
  telefono: string;
  correo: string;
  estado: EstadoGeneral;
  cobertura: string;
  empresas: Empresa[];
  servicios: number;
  monto: number;
  cumplimiento: number;
}

export interface ContratoTaxi {
  id: string;
  proveedor: string;
  numero: string;
  fechaInicio: string;
  fechaFin: string;
  estado: EstadoContrato;
  empresas: Empresa[];
  responsable: string;
}

export interface TarifaTaxi {
  tipo: string;
  ciudad: string;
  origen: string;
  destino: string;
  valor: number;
  vigencia: string;
  proveedor: string;
}

export interface Desembolso {
  id: string;
  empresa: Empresa;
  area: string;
  mes: string;
  presupuesto: number;
  consumo: number;
  solicitado: number;
  justificacion: string;
  responsable: string;
  estado: EstadoDesembolso;
  fecha: string;
}

export interface UsuarioSistema {
  id: string;
  nombre: string;
  correo: string;
  empresa: Empresa;
  area: string;
  rol: string;
  estado: EstadoGeneral;
}

export interface ChartDatum {
  [key: string]: string | number;
}

