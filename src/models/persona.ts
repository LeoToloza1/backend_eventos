abstract class Persona {
  // Getters
  abstract get id(): number;

  abstract get nombre(): string;

  abstract get apellido(): string;
  abstract get email(): string;

  abstract get telefono(): number;
  abstract get dni(): number;
  // Setters
  abstract set id(value: number);

  abstract set nombre(value: string);

  abstract set apellido(value: string);

  abstract set email(value: string);

  abstract set telefono(value: number);

  abstract set dni(value: number);

  abstract getNombreCompleto(): string;
}
