import {
  ContratoTaxi,
  Desembolso,
  PresupuestoArea,
  ProveedorTaxi,
  SolicitudTaxi,
  TarifaTaxi,
  UsuarioSistema,
} from './models';

export const SOLICITUDES_DATA: SolicitudTaxi[] = [
  { id: 'SOL-2026-001', voucher: 'VCH-ARCA-2026-000001', empresa: 'ARCA', area: 'Recursos Humanos', cc: 'CC-RH-001', solicitante: 'María García', cargo: 'Analista', jefeInmediato: 'Carlos Mendoza', fecha: '2026-07-03', hora: '09:00', origen: 'Av. República del Salvador N34-183', destino: 'Aeropuerto Mariscal Sucre', motivo: 'Viaje de negocios', pasajeros: 1, proveedor: 'TaxiSeguro Cía. Ltda.', valorEstimado: 45, estado: 'Pendiente', aprobador: 'Carlos Mendoza', tipoUsuario: 'Colaborador', contrato: 'CONT-2026-001', createdAt: '2026-07-03 07:30' },
  { id: 'SOL-2026-002', voucher: 'VCH-TONI-2026-000001', empresa: 'TONI', area: 'Ventas', cc: 'CC-VEN-002', solicitante: 'Roberto Salazar', cargo: 'Gerente de Ventas', jefeInmediato: '—', fecha: '2026-07-02', hora: '14:00', origen: 'Oficinas TONI - Quito Norte', destino: 'Hotel Marriott - Orellana', motivo: 'Reunión con cliente', pasajeros: 2, proveedor: 'CityTaxi S.A.', valorEstimado: 28, estado: 'Aprobada', aprobador: 'Roberto Salazar', tipoUsuario: 'Gerente', contrato: 'CONT-2026-002', createdAt: '2026-07-02 10:15' },
  { id: 'SOL-2026-003', voucher: 'VCH-INALECSA-2026-000001', empresa: 'INALECSA', area: 'Finanzas', cc: 'CC-FIN-003', solicitante: 'Lucía Torres', cargo: 'Directora Financiera', jefeInmediato: '—', fecha: '2026-07-01', hora: '08:00', origen: 'Residencia - Cumbayá', destino: 'Matriz INALECSA - Guayaquil', motivo: 'Auditoría interna', pasajeros: 1, proveedor: 'TaxiSeguro Cía. Ltda.', valorEstimado: 120, estado: 'En servicio', aprobador: 'Patricia Vega (Asistente)', tipoUsuario: 'Director', contrato: 'CONT-2026-001', createdAt: '2026-06-30 16:00' },
  { id: 'SOL-2026-004', voucher: 'VCH-ARCA-2026-000002', empresa: 'ARCA', area: 'Operaciones', cc: 'CC-OPS-004', solicitante: 'Diego Ramírez', cargo: 'Analista de Operaciones', jefeInmediato: 'Sofía López', fecha: '2026-06-30', hora: '11:00', origen: 'ARCA Norte - Quito', destino: 'Bodega Sur - Villaflora', motivo: 'Traslado de documentos', pasajeros: 1, proveedor: 'ExpressTaxi EC', valorEstimado: 18.5, estado: 'Rechazada', aprobador: 'Sofía López', tipoUsuario: 'Colaborador', contrato: 'CONT-2026-003', createdAt: '2026-06-30 08:00', comentarioRechazo: 'No corresponde a traslado corporativo aprobado.' },
  { id: 'SOL-2026-005', voucher: 'VCH-TONI-2026-000002', empresa: 'TONI', area: 'Marketing', cc: 'CC-MKT-005', solicitante: 'Camila Herrera', cargo: 'Coordinadora de Marca', jefeInmediato: 'Eduardo Paz', fecha: '2026-07-04', hora: '10:30', origen: 'Oficinas TONI', destino: 'Agencia Publicitaria - Iñaquito', motivo: 'Presentación de campaña', pasajeros: 3, proveedor: 'CityTaxi S.A.', valorEstimado: 22, estado: 'Pendiente', aprobador: 'Eduardo Paz', tipoUsuario: 'Colaborador', contrato: 'CONT-2026-002', createdAt: '2026-07-03 15:20' },
  { id: 'SOL-2026-006', voucher: 'VCH-ARCA-2026-000003', empresa: 'ARCA', area: 'Tecnología', cc: 'CC-TEC-006', solicitante: 'Andrés Vidal', cargo: 'Arquitecto de Software', jefeInmediato: 'Isabel Cruz', fecha: '2026-07-02', hora: '16:00', origen: 'Oficina ARCA - Quito', destino: 'DataCenter CenturyLink', motivo: 'Mantenimiento de servidores', pasajeros: 1, proveedor: 'TaxiSeguro Cía. Ltda.', valorEstimado: 35, estado: 'Finalizada', aprobador: 'Isabel Cruz', tipoUsuario: 'Colaborador', contrato: 'CONT-2026-001', createdAt: '2026-07-01 13:00' },
  { id: 'SOL-2026-007', voucher: 'VCH-INALECSA-2026-000002', empresa: 'INALECSA', area: 'Legal', cc: 'CC-LEG-007', solicitante: 'Felipe Mora', cargo: 'Asesor Legal', jefeInmediato: 'Vanessa Ríos', fecha: '2026-06-29', hora: '09:30', origen: 'INALECSA Guayaquil', destino: 'Notaría Primera - Centro', motivo: 'Firma de contratos', pasajeros: 1, proveedor: 'ExpressTaxi EC', valorEstimado: 15, estado: 'Cancelada', aprobador: '—', tipoUsuario: 'Colaborador', contrato: 'CONT-2026-003', createdAt: '2026-06-28 17:00' },
  { id: 'SOL-2026-008', voucher: 'VCH-ARCA-2026-000004', empresa: 'ARCA', area: 'Ventas', cc: 'CC-VEN-008', solicitante: 'Patricia Andrade', cargo: 'Ejecutiva Comercial', jefeInmediato: 'Jorge Salas', fecha: '2026-07-03', hora: '15:00', origen: 'ARCA Quito Centro', destino: 'Mall El Jardín - Salón de Eventos', motivo: 'Evento corporativo', pasajeros: 2, proveedor: 'CityTaxi S.A.', valorEstimado: 32, estado: 'Pendiente', aprobador: 'Jorge Salas', tipoUsuario: 'Colaborador', contrato: 'CONT-2026-002', createdAt: '2026-07-03 11:00' },
];

export const PRESUPUESTOS_DATA: PresupuestoArea[] = [
  { area: 'Recursos Humanos', empresa: 'ARCA', presupuesto: 2000, consumido: 1456, cc: 'CC-RH-001' },
  { area: 'Ventas', empresa: 'ARCA', presupuesto: 3500, consumido: 3150, cc: 'CC-VEN-002' },
  { area: 'Operaciones', empresa: 'ARCA', presupuesto: 2500, consumido: 980, cc: 'CC-OPS-004' },
  { area: 'Tecnología', empresa: 'ARCA', presupuesto: 1800, consumido: 1850, cc: 'CC-TEC-006' },
  { area: 'Marketing', empresa: 'TONI', presupuesto: 1500, consumido: 420, cc: 'CC-MKT-005' },
  { area: 'Finanzas', empresa: 'INALECSA', presupuesto: 4000, consumido: 2800, cc: 'CC-FIN-003' },
  { area: 'Legal', empresa: 'INALECSA', presupuesto: 800, consumido: 615, cc: 'CC-LEG-007' },
  { area: 'Logística', empresa: 'TONI', presupuesto: 1200, consumido: 310, cc: 'CC-LOG-008' },
];

export const PROVEEDORES_DATA: ProveedorTaxi[] = [
  { id: 'PROV-001', razonSocial: 'TaxiSeguro Cía. Ltda.', ruc: '1791234567001', contacto: 'Jorge Peñafiel', telefono: '02-2345678', correo: 'operaciones@taxiseguro.ec', estado: 'Activo', cobertura: 'Quito, Guayaquil, Cuenca', empresas: ['ARCA', 'INALECSA'], servicios: 145, monto: 8750.5, cumplimiento: 97 },
  { id: 'PROV-002', razonSocial: 'CityTaxi S.A.', ruc: '1790987654001', contacto: 'Mariela Suárez', telefono: '02-3456789', correo: 'admin@citytaxi.ec', estado: 'Activo', cobertura: 'Quito', empresas: ['ARCA', 'TONI'], servicios: 89, monto: 4230, cumplimiento: 94 },
  { id: 'PROV-003', razonSocial: 'ExpressTaxi EC', ruc: '1793456789001', contacto: 'Ramón Vera', telefono: '09-87654321', correo: 'servicios@expresstaxi.ec', estado: 'Activo', cobertura: 'Quito Norte, Cumbayá', empresas: ['ARCA', 'TONI', 'INALECSA'], servicios: 67, monto: 2890.5, cumplimiento: 91 },
  { id: 'PROV-004', razonSocial: 'AeroTransfer Cia.', ruc: '1798765432001', contacto: 'Patricia Molina', telefono: '02-5678901', correo: 'info@aerotransfer.ec', estado: 'Inactivo', cobertura: 'Aeropuerto - Quito', empresas: ['ARCA'], servicios: 23, monto: 3450, cumplimiento: 88 },
];

export const CONTRATOS_DATA: ContratoTaxi[] = [
  { id: 'CONT-2026-001', proveedor: 'TaxiSeguro Cía. Ltda.', numero: 'CTR-ARCA-2026-001', fechaInicio: '2026-01-01', fechaFin: '2026-12-31', estado: 'Vigente', empresas: ['ARCA', 'INALECSA'], responsable: 'Ana Rodríguez' },
  { id: 'CONT-2026-002', proveedor: 'CityTaxi S.A.', numero: 'CTR-TONI-2026-001', fechaInicio: '2026-03-01', fechaFin: '2026-08-31', estado: 'Por vencer', empresas: ['TONI'], responsable: 'Luis Morales' },
  { id: 'CONT-2026-003', proveedor: 'ExpressTaxi EC', numero: 'CTR-MULTI-2026-001', fechaInicio: '2026-02-01', fechaFin: '2026-12-31', estado: 'Vigente', empresas: ['ARCA', 'TONI', 'INALECSA'], responsable: 'Ana Rodríguez' },
];

export const TARIFAS_DATA: TarifaTaxi[] = [
  { tipo: 'Zona Urbana', ciudad: 'Quito', origen: 'Norte', destino: 'Centro', valor: 15, vigencia: '2026-12-31', proveedor: 'TaxiSeguro Cía. Ltda.' },
  { tipo: 'Aeropuerto', ciudad: 'Quito', origen: 'Ciudad', destino: 'Aeropuerto Mariscal Sucre', valor: 45, vigencia: '2026-12-31', proveedor: 'TaxiSeguro Cía. Ltda.' },
  { tipo: 'Zona Urbana', ciudad: 'Quito', origen: 'Norte', destino: 'Sur', valor: 22, vigencia: '2026-08-31', proveedor: 'CityTaxi S.A.' },
  { tipo: 'Interbarrial', ciudad: 'Quito', origen: 'Cumbayá', destino: 'Centro', valor: 18, vigencia: '2026-12-31', proveedor: 'ExpressTaxi EC' },
  { tipo: 'Zona Urbana', ciudad: 'Guayaquil', origen: 'Urdesa', destino: 'Kennedy', valor: 12, vigencia: '2026-12-31', proveedor: 'TaxiSeguro Cía. Ltda.' },
];

export const DESEMBOLSOS_DATA: Desembolso[] = [
  { id: 'DES-2026-001', empresa: 'ARCA', area: 'Tecnología', mes: 'Julio 2026', presupuesto: 1800, consumo: 1850, solicitado: 500, justificacion: 'Incremento en traslados por migración de servidores', responsable: 'Isabel Cruz', estado: 'Pendiente', fecha: '2026-07-03' },
  { id: 'DES-2026-002', empresa: 'ARCA', area: 'Ventas', mes: 'Junio 2026', presupuesto: 3500, consumo: 3680, solicitado: 600, justificacion: 'Campaña de ventas región Sierra', responsable: 'Jorge Salas', estado: 'Aprobado', fecha: '2026-06-25' },
  { id: 'DES-2026-003', empresa: 'INALECSA', area: 'Finanzas', mes: 'Mayo 2026', presupuesto: 4000, consumo: 4150, solicitado: 800, justificacion: 'Auditoría externa - desplazamientos auditores', responsable: 'Lucía Torres', estado: 'Ejecutado', fecha: '2026-05-28' },
];

export const USUARIOS_DATA: UsuarioSistema[] = [
  { id: 'USR-001', nombre: 'Ana Rodríguez', correo: 'ana.rodriguez@arca.ec', empresa: 'ARCA', area: 'Administración', rol: 'Administrador', estado: 'Activo' },
  { id: 'USR-002', nombre: 'Carlos Mendoza', correo: 'carlos.mendoza@arca.ec', empresa: 'ARCA', area: 'Recursos Humanos', rol: 'Jefe Inmediato', estado: 'Activo' },
  { id: 'USR-003', nombre: 'Roberto Salazar', correo: 'roberto.salazar@toni.ec', empresa: 'TONI', area: 'Ventas', rol: 'Gerente', estado: 'Activo' },
  { id: 'USR-004', nombre: 'Lucía Torres', correo: 'lucia.torres@inalecsa.ec', empresa: 'INALECSA', area: 'Finanzas', rol: 'Director', estado: 'Activo' },
  { id: 'USR-005', nombre: 'Patricia Vega', correo: 'patricia.vega@inalecsa.ec', empresa: 'INALECSA', area: 'Dirección General', rol: 'Asistente', estado: 'Activo' },
  { id: 'USR-006', nombre: 'María García', correo: 'maria.garcia@arca.ec', empresa: 'ARCA', area: 'Recursos Humanos', rol: 'Solicitante', estado: 'Activo' },
  { id: 'USR-007', nombre: 'Sofía López', correo: 'sofia.lopez@arca.ec', empresa: 'ARCA', area: 'Operaciones', rol: 'Jefe Inmediato', estado: 'Activo' },
];

export const MONTHLY_DATA = [
  { mes: 'Ene', ARCA: 4200, TONI: 2100, INALECSA: 3400 },
  { mes: 'Feb', ARCA: 3800, TONI: 1900, INALECSA: 2900 },
  { mes: 'Mar', ARCA: 5100, TONI: 2600, INALECSA: 3800 },
  { mes: 'Abr', ARCA: 4600, TONI: 2300, INALECSA: 4100 },
  { mes: 'May', ARCA: 5400, TONI: 2800, INALECSA: 3600 },
  { mes: 'Jun', ARCA: 4900, TONI: 2400, INALECSA: 4300 },
  { mes: 'Jul', ARCA: 3200, TONI: 1600, INALECSA: 2800 },
];

export const SOLICITUDES_STATUS_DATA = [
  { name: 'Aprobadas', value: 42, color: '#047481' },
  { name: 'Pendientes', value: 15, color: '#9c4221' },
  { name: 'Rechazadas', value: 8, color: '#ba1a1a' },
  { name: 'Canceladas', value: 5, color: '#717182' },
  { name: 'En servicio', value: 6, color: '#ba0029' },
  { name: 'Finalizadas', value: 48, color: '#333333' },
];

export const PROVEEDOR_CHART_DATA = [
  { name: 'TaxiSeguro', valor: 8750 },
  { name: 'CityTaxi', valor: 4230 },
  { name: 'ExpressTaxi', valor: 2890 },
  { name: 'AeroTransfer', valor: 3450 },
];

export const AREAS = ['Recursos Humanos', 'Ventas', 'Operaciones', 'Tecnología', 'Marketing', 'Finanzas', 'Legal', 'Logística'];
export const EMPRESAS = ['ARCA', 'TONI', 'INALECSA'] as const;
export const PROVEEDORES = ['TaxiSeguro Cía. Ltda.', 'CityTaxi S.A.', 'ExpressTaxi EC'];

