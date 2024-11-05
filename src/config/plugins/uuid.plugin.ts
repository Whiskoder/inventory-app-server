import { nanoid } from 'nanoid'

/**
 * Clase utilitaria para generar identificadores únicos.
 */
export class UUID {
  /**
   * Genera un identificador único utilizando `nanoid`.
   *
   * @returns {string} Un identificador único generado aleatoriamente.
   */
  public static nanoid = () => nanoid()
}
