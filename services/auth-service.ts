import { API_ENDPOINT, HttpMethod } from "@/constants/response-constant";
import { ILoginReponse, IRegisterReponse } from "@/types/auth";
import { sendRequest } from "@/lib/utils";
import { User } from "next-auth";

export interface ILoginParams {
  email: string;
  password: string;
}

export interface IRegisterParams {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface IResetPasswordParams {
  newPassword: string;
  newConfirmPassword: string;
  forgotPasswordInfo: {
    resetPasswordToken: string;
    userId: string;
  };
}

export interface IRefreshTokenParams {
  refreshToken: string;
  accessToken: string;
  userId: string;
}

export interface IConfirmResetPasswordOTPResponse {
  userId: string;
  resetPasswordToken: string;
}

export const refreshToken = async (
  params: IRefreshTokenParams
): Promise<IResponse<null>> => {
  try {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${params.accessToken}`,
      "x-client-id": params.userId,
    };

    const response: IResponse<null> = await sendRequest({
      url: `${API_ENDPOINT}/user/access/invoke-new-tokens`,
      method: HttpMethod.POST,
      body: {
        refreshToken: params.refreshToken,
      },
      headers: headers,
    });

    return response;
  } catch (error) {
    console.error("Error refresh token: ", error);
    throw error;
  }
};

export const login = async (
  params: ILoginParams
): Promise<IResponse<ILoginReponse>> => {
  try {
    const response: IResponse<ILoginReponse> = await sendRequest({
      url: `${API_ENDPOINT}/user/access/login`,
      method: HttpMethod.POST,
      body: {
        email: params.email,
        password: params.password,
      },
    });

    return response;
  } catch (error) {
    console.error("Error login: ", error);
    throw error as ILoginReponse;
  }
};

export const register = async (
  params: IRegisterParams
): Promise<IResponse<IRegisterReponse>> => {
  try {
    const response: IResponse<IRegisterReponse> = await sendRequest({
      url: `${API_ENDPOINT}/user/access/signup`,
      method: HttpMethod.POST,
      body: {
        email: params.email,
        username: params.username,
        firstName: params.firstName,
        lastName: params.lastName,
        password: params.password,
      },
    });

    return response;
  } catch (error) {
    console.error("Error register: ", error);
    throw error;
  }
};

export const sendAccountActivationEmail = async (
  email: string
): Promise<IResponse<null>> => {
  try {
    const response: IResponse<null> = await sendRequest({
      url: `${API_ENDPOINT}/user/access/activate/send-link`,
      method: HttpMethod.POST,
      body: {
        email,
      },
    });

    return response;
  } catch (error) {
    console.error("Error sending account activation email: ", error);
    throw error;
  }
};

export const sendResetPasswordOTP = async (
  email: string
): Promise<IResponse<null>> => {
  try {
    const response: IResponse<null> = await sendRequest({
      url: `${API_ENDPOINT}/user/access/reset-password/send-otp`,
      method: HttpMethod.POST,
      body: {
        email,
      },
    });

    return response;
  } catch (error) {
    console.error("Error send reset password OTP: ", error);
    throw error;
  }
};

export const confirmResetPasswordOTP = async (
  email: string,
  otp: string
): Promise<IResponse<IConfirmResetPasswordOTPResponse>> => {
  try {
    const response: IResponse<IConfirmResetPasswordOTPResponse> =
      await sendRequest({
        url: `${API_ENDPOINT}/user/access/reset-password/confirm-otp`,
        method: HttpMethod.POST,
        body: {
          email,
          otp,
        },
      });

    return response;
  } catch (error) {
    console.error("Error confirm OTP: ", error);
    throw error;
  }
};

export const resetPassword = async (
  params: IResetPasswordParams
): Promise<IResponse<null>> => {
  try {
    const headers = {
      Authorization: `Bearer ${params.forgotPasswordInfo.resetPasswordToken}`,
      "x-client-id": params.forgotPasswordInfo.userId,
    };

    const response: IResponse<null> = await sendRequest({
      url: `${API_ENDPOINT}/user/access/reset-password`,
      method: HttpMethod.POST,
      body: {
        newPassword: params.newPassword,
        confirmNewPassword: params.newConfirmPassword,
      },
      headers: headers,
    });

    return response;
  } catch (error) {
    console.error("Error reset password: ", error);
    throw error;
  }
};

export const loginWithGoogle = async (
  id_token: string
): Promise<IResponse<ILoginReponse>> => {
  try {
    const response: IResponse<ILoginReponse> = await sendRequest({
      url: `${API_ENDPOINT}/user/access/google/auth`,
      method: HttpMethod.POST,
      body: {
        id_token,
      },
    });

    return response;
  } catch (error) {
    console.error("Error login with google: ", error);
    throw error;
  }
};

export const logout = async (user: User): Promise<IResponse<null>> => {
  try {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${user.accessToken}`,
      "x-client-id": user.id as string,
    };

    const response: IResponse<null> = await sendRequest({
      url: `${API_ENDPOINT}/user/access/logout`,
      method: HttpMethod.POST,
      headers: headers,
    });

    return response;
  } catch (error) {
    console.error("Error logout: ", error);
    throw error;
  }
};
