/**
 * Contract source: https://git.io/Jte3v
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import User from 'App/Models/User'
import { actions, policies } from '../start/bouncer'

declare module '@ioc:Adonis/Addons/Bouncer' {
	type ApplicationActions = ExtractActionsTypes<typeof actions>
	type ApplicationPolicies = ExtractPoliciesTypes<typeof policies>

	 interface ActionsList {
    isAdmin: (user: User | null) => boolean | Promise<boolean>
    manageUsers: (user: User | null) => boolean | Promise<boolean>
  }

  interface PoliciesList {}
}
