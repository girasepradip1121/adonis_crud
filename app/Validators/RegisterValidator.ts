import { schema, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class RegisterValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({ trim: true }),
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.unique({ table: "users", column: "email" }),
    ]),
    phone: schema.string.optional({}, [
      rules.minLength(10),
      rules.maxLength(15),
    ]),
    password: schema.string({}, [rules.minLength(6)]),
    role: schema.enum.optional(["admin", "teacher", "student"] as const),
  });

  public messages = {
    required: "The {{ field }} is required",
    "email.email": "Provide a valid email",
    "email.unique": "Email already exists",
    "password.minLength": "Password must be at least of 6 characters",
  };
}
