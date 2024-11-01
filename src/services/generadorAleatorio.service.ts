export class GeneradorAleatorio {
  static generarContraseñaAleatoria(longitud: number): string {
    const caracteres =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let contraseña = "";

    for (let i = 0; i < longitud; i++) {
      const indice = Math.floor(Math.random() * caracteres.length);
      contraseña += caracteres[indice];
    }

    return contraseña;
  }
}
