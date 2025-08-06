/**
 * Convierte un texto a mayúscula completa
 * @param text - El texto a convertir
 * @returns El texto en mayúscula completa
 */
export const toUpperCase = (text: string | undefined | null): string => {
  if (!text) return "";
  return text.toUpperCase();
};

/**
 * Convierte el nombre completo de una persona a mayúscula completa
 * @param nombres - Los nombres de la persona
 * @param apellidos - Los apellidos de la persona
 * @returns El nombre completo en mayúscula
 */
export const upperCaseFullName = (
  nombres: string | undefined | null,
  apellidos: string | undefined | null,
): string => {
  const upperNombres = toUpperCase(nombres);
  const upperApellidos = toUpperCase(apellidos);

  return `${upperNombres} ${upperApellidos}`.trim();
};
