import { Gender, CivilStatus, UserStatus, UserFamilyType } from "./enums";

export type User = {
  apellidos: string | null;
  direccion: string | null;
  email: string | null;
  escribe: boolean | null;
  estado: UserStatus | null;
  estado_civil: CivilStatus | null;
  fecha_nacimiento: string | null;
  fecha_registro: string | null;
  genero: Gender | null;
  grado_escolaridad: string | null;
  ha_estado_en_otro_centro: boolean | null;
  id_usuario: number | null;
  lee: boolean | null;
  lugar_nacimiento: string | null;
  lugar_procedencia: string | null;
  n_documento: string | null;
  nombres: string | null;
  nucleo_familiar: UserFamilyType | null;
  ocupacion_quedesempeño: string | null;
  origen_otrocentro: string | null;
  proteccion_exequial: boolean | null;
  regimen_seguridad_social: string | null;
  telefono: string | null;
  tipo_afiliacion: string | null;
};

export type AuthorizedUser = {
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  password: string;
};

export type Login = {
  access_token: string;
  token_type: "bearer";
};
