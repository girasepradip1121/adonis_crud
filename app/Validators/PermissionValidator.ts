import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PermissionValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    can_manage_users: schema.boolean(),
  })

  public messages = {
    'can_manage_users.required': 'Permission value is required',
    'can_manage_users.boolean': 'Permission must be a boolean value',
  }
}
