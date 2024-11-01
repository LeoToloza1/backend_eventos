import { z } from "zod";

// Definición del esquema de validación para la clase Asistente
const AsistenteSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellido: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("El email debe ser válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  telefono: z
    .number()
    .int()
    .positive("El teléfono debe ser un número positivo"),
  dni: z.number().int().positive("El DNI debe ser un número positivo"),
});

// Definición del esquema de validación para la clase Usuario
const UsuarioSchema = z.object({
  id: z.number().positive("El ID debe ser un número positivo"),
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellido: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("El email debe ser válido"),
  telefono: z
    .number()
    .int()
    .positive("El teléfono debe ser un número positivo"),
  dni: z.number().int().positive("El DNI debe ser un número positivo"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  rol_id: z.number().positive("El rol ID debe ser un número positivo"),
  rol: z.object({
    id: z.number().positive(),
    nombre: z.string().min(2),
  }),
});

export default class ValidadorService {
  static validarAsistente(data: IAsistente) {
    return AsistenteSchema.safeParse(data);
  }

  static validarUsuario(data: IUsuario) {
    return UsuarioSchema.safeParse(data);
  }
}
