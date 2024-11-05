import { compareSync, genSaltSync, hashSync } from 'bcryptjs'

/**
 * Proporciona métodos para hashear una contraseña y comparar una
 * contraseña proporcionada con una contraseña previamente hasheada.
 *
 */
export const bcryptAdapter = {
  /**
   * Hashea una contraseña utilizando bcrypt.
   *
   * Genera una sal aleatoria y la utiliza para encriptar la contraseña proporcionada.
   * Este proceso convierte la contraseña en una cadena cifrada, que puede ser almacenada
   * de manera segura.
   *
   * @param {string} password - La contraseña que se desea encriptar.
   * @returns {string} La contraseña hasheada (cifrada) utilizando bcrypt.
   *
   * @example
   * const hashedPassword = bcryptAdapter.hash('miContraseñaSecreta');
   */
  hash: (password: string): string => {
    const salt = genSaltSync()
    return hashSync(password, salt)
  },

  /**
   * Compara una contraseña en texto plano con una versión hasheada de la misma.
   *
   * Utiliza bcrypt para verificar si la contraseña proporcionada coincide con el
   * hash de la contraseña almacenada.
   * Este método es útil para la validación de contraseñas durante el proceso
   * de inicio de sesión.
   *
   * @param {string} password - La contraseña en texto plano que se desea verificar.
   * @param {string} hashedPassword - La contraseña previamente hasheada que se desea comparar.
   * @returns {boolean} `true` si la contraseña proporcionada coincide con el hash, `false` en caso contrario.
   *
   * @example
   * const isMatch = bcryptAdapter.compare('miContraseñaSecreta', hashedPassword);
   */
  compare: (password: string, hashedPassword: string): boolean => {
    return compareSync(password, hashedPassword)
  },
}
