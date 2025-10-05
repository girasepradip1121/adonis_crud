import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import RegisterValidator from "App/Validators/RegisterValidator";
import Logger from "@ioc:Adonis/Core/Logger";
import LoginValidator from "App/Validators/LoginValidator";

export default class AuthController {
  public async signup({ request, response, auth }: HttpContextContract) {
    try {
      const data = await request.validate(RegisterValidator);
      const user = await User.create(data);

      const token = await auth.use("api").attempt(data.email, data.password);

      return response.created({ success: true, user: user.serialize(), token });
    } catch (error) {
      Logger.error(error);
      if (error.messages) {
        return response.badRequest({
          success: false,
          message: "Validation failed",
          errors: error.messages,
        });
      }

      return response.internalServerError({
        success: false,
        message: "Registration failed",
        error: error.message,
      });
    }
  }

  public async login({ request, response, auth }: HttpContextContract) {
    try {
      const data = await request.validate(LoginValidator);
      const token = await auth.use("api").attempt(data.email, data.password);
      return response.ok({ success: true, token });
    } catch (error) {
      Logger.error(error);
      if (error.messages) {
        return response.badRequest({
          success: false,
          message: "Validation failed",
          errors: error.messages,
        });
      }

      return response.unauthorized({
        success: false,
        message: "Invalid credentials",
      });
    }
  }

  public async me({ auth, response }: HttpContextContract) {
    try {
      await auth.use("api").authenticate();
      const user = auth.use("api").user;
      return response.ok({ success: true, user });
    } catch (error: any) {
      Logger.error(error);
      return response.unauthorized({
        success: false,
        message: "You are not logged in ,please login",
      });
    }
  }

  public async logout({ auth, response }: HttpContextContract) {
    try {
      await auth.use("api").logout();
      return response.ok({ success: true, message: "Logged out successfully" });
    } catch (error: any) {
      Logger.error(error);
      return response.internalServerError({
        success: false,
        message: "Logout failed",
        error: error.message,
      });
    }
  }
}
