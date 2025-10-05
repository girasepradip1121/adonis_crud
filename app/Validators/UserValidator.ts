import { schema, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class UserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({ trim: true }),
    email: schema.string({}, [
      rules.email(),
      rules.unique({ table: "users", column: "email" }),
    ]),
    phone: schema.string.optional({}, [
      rules.minLength(10),
      rules.maxLength(15),
    ]),
    password: schema.string.optional({}, [rules.minLength(6)]),
    role: schema.enum.optional(["admin", "teacher", "student"] as const),
  });

  public messages = {
    "name.required": "Name is required",
    "email.required": "Email is required",
    "email.email": "Email format is invalid",
    "email.unique": "Email already exists",
    "password.minLength": "Password must be at least 6 characters",
    "phone.minLength": "Phone must be at least 10 digits",
    "phone.maxLength": "Phone cannot exceed 15 digits",
  };
}
