// app/Controllers/Http/UsersController.ts
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Logger from '@ioc:Adonis/Core/Logger'
import UserValidator from 'App/Validators/UserValidator'
import PermissionValidator from 'App/Validators/PermissionValidator'

export default class UsersController {
  // get users
  public async index({ auth, response }: HttpContextContract) {
    try {
      await auth.use('api').authenticate()
      const users = await User.query().select(
        'id',
        'name',
        'email',
        'phone',
        'role',
        'can_manage_users',
        'created_at'
      )
      return response.ok({ success: true, users })
    } catch (error: any) {
      Logger.error(error)
      return response.unauthorized({ success: false, message: 'Unauthorized or failed to fetch users' })
    }
  }

  public async store({ request, auth, bouncer, response }: HttpContextContract) {
    try {
      await auth.use('api').authenticate()
      await bouncer.authorize('manageUsers')

      const data = await request.validate(UserValidator)
      const user = await User.create(data)
      return response.created({ success: true, user })
    } catch (error: any) {
      Logger.error(error)
      if (error.messages) {
        return response.badRequest({ success: false, message: 'Validation failed', errors: error.messages })
      }
      return response.internalServerError({ success: false, message: 'Failed to create user', error: error.message })
    }
  }

  // Update user
  public async update({ params, request, auth, bouncer, response }: HttpContextContract) {
    try {
      await auth.use('api').authenticate()
      await bouncer.authorize('manageUsers')

      const user = await User.findOrFail(params.id)
      const data = await request.validate(UserValidator)
      user.merge(data)
      await user.save()
      return response.ok({ success: true, user })
    } catch (error: any) {
      Logger.error(error)
      if (error.messages) {
        return response.badRequest({ success: false, message: 'Validation failed', errors: error.messages })
      }
      return response.internalServerError({ success: false, message: 'Failed to update user', error: error.message })
    }
  }

  // Delete user
  public async destroy({ params, auth, bouncer, response }: HttpContextContract) {
    try {
      await auth.use('api').authenticate()
      await bouncer.authorize('manageUsers')

      const user = await User.findOrFail(params.id)
      await user.delete()
      return response.ok({ success: true, message: 'User deleted successfully' })
    } catch (error: any) {
      Logger.error(error)
      return response.internalServerError({ success: false, message: 'Failed to delete user', error: error.message })
    }
  }


  public async setPermission({ params, request, auth, response }: HttpContextContract) {
    try {
      await auth.use('api').authenticate()
      const actor = auth.use('api').user!

      if (actor.role !== 'admin') {
        return response.forbidden({ success: false, message: 'Only admin can change permissions' })
      }

      const data = await request.validate(PermissionValidator)
      const user = await User.findOrFail(params.id)
      user.can_manage_users = data.can_manage_users
      await user.save()

      return response.ok({ success: true, user })
    } catch (error: any) {
      Logger.error(error)
      if (error.messages) {
        return response.badRequest({ success: false, message: 'Validation failed', errors: error.messages })
      }
      return response.internalServerError({ success: false, message: 'Failed to update permission', error: error.message })
    }
  }
}
