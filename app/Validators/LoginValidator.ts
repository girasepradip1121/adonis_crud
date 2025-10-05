import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LoginValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({}, [rules.email()]),
    password: schema.string({}, [rules.minLength(6)]),
  })

  public messages = {
    'email.email': 'Invalid email',
    'password.minLength': 'Password should be at least 6 chars',
  }
}
