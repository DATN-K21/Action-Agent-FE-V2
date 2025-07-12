import { USER_ENDPOINT, HttpMethod } from '@/constants/response-constant';
import { ILoginReponse, IRegisterReponse } from '@/types/auth';
import { createUserAuthHeaders, sendRequest } from '@/lib/utils';
import { User } from 'next-auth';

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

export const login = async (params: ILoginParams): Promise<IResponse<ILoginReponse>> => {
  try {
    if (!params.email) throw new Error("Missing 'email'");
    if (!params.password) throw new Error("Missing 'password'");

    // No user object available for login, so no auth headers
    const response: IResponse<ILoginReponse> = await sendRequest({
      url: `${USER_ENDPOINT}/access/login`,
      method: HttpMethod.POST,
      body: {
        email: params.email,
        password: params.password,
      },
    });

    return response;
  } catch (error) {
    console.error('Error login: ', error);
    throw error;
  }
};

export const register = async (params: IRegisterParams): Promise<IResponse<IRegisterReponse>> => {
  try {
    if (!params.email) throw new Error("Missing 'email'");
    if (!params.username) throw new Error("Missing 'username'");
    if (!params.firstName) throw new Error("Missing 'firstName'");
    if (!params.lastName) throw new Error("Missing 'lastName'");

    // No user object available for register, so no auth headers
    const response: IResponse<IRegisterReponse> = await sendRequest({
      url: `${USER_ENDPOINT}/access/signup`,
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
    console.error('Error register: ', error);
    throw error;
  }
};

export const refreshToken = async (params: IRefreshTokenParams): Promise<IResponse<null>> => {
  try {
    console.log(`[refreshToken] userId=${params.userId}`);
    if (!params.refreshToken) throw new Error("Missing 'refreshToken'");
    if (!params.accessToken) throw new Error("Missing 'accessToken'");
    if (!params.userId) throw new Error("Missing 'userId'");

    const headers: Record<string, string> = {
      Authorization: `Bearer ${params.accessToken}`,
    };

    const response: IResponse<null> = await sendRequest({
      url: `${USER_ENDPOINT}/access/invoke-new-tokens`,
      method: HttpMethod.POST,
      body: {
        refreshToken: params.refreshToken,
      },
      headers: headers,
    });

    return response;
  } catch (error) {
    console.error('Error refresh token: ', error);
    throw error;
  }
};

export const sendAccountActivationEmail = async (email: string): Promise<IResponse<null>> => {
  try {
    if (!email) throw new Error("Missing 'email'");

    // No user object available for activation email, so no auth headers
    const response: IResponse<null> = await sendRequest({
      url: `${USER_ENDPOINT}/access/activate/send-link`,
      method: HttpMethod.POST,
      body: {
        email,
      },
    });

    return response;
  } catch (error) {
    console.error('Error sending account activation email: ', error);
    throw error;
  }
};

export const activateAccount = async (token: string): Promise<any> => {
  try {
    if (!token) throw new Error("Missing 'token'");

    // No user object available for activation, so no auth headers
    const response: IResponse<null> = await sendRequest({
      url: `${USER_ENDPOINT}/access/activate/confirm`,
      method: HttpMethod.POST,
      body: {
        activationToken: token,
      },
    });

    if (response.status === 200) {
      return { message: 'Account activated successfully' };
    } else {
      throw new Error('Account activation failed. Please request a new link.');
    }
  } catch (error) {
    console.error('Error activating account: ', error);
    throw error;
  }
};

export const sendResetPasswordOTP = async (email: string): Promise<IResponse<null>> => {
  try {
    if (!email) throw new Error("Missing 'email'");

    // No user object available for reset password OTP, so no auth headers
    const response: IResponse<null> = await sendRequest({
      url: `${USER_ENDPOINT}/access/reset-password/send-otp`,
      method: HttpMethod.POST,
      body: {
        email,
      },
    });

    return response;
  } catch (error) {
    console.error('Error send reset password OTP: ', error);
    throw error;
  }
};

export const confirmResetPasswordOTP = async (
  email: string,
  otp: string,
): Promise<IResponse<IConfirmResetPasswordOTPResponse>> => {
  try {
    if (!email) throw new Error("Missing 'email'");
    if (!otp) throw new Error("Missing 'otp'");

    // No user object available for confirm OTP, so no auth headers
    const response: IResponse<IConfirmResetPasswordOTPResponse> = await sendRequest({
      url: `${USER_ENDPOINT}/access/reset-password/confirm-otp`,
      method: HttpMethod.POST,
      body: {
        email,
        otp,
      },
    });

    return response;
  } catch (error) {
    console.error('Error confirm OTP: ', error);
    throw error;
  }
};

export const resetPassword = async (params: IResetPasswordParams): Promise<IResponse<null>> => {
  try {
    if (!params.newPassword) throw new Error("Missing 'newPassword'");
    if (!params.newConfirmPassword) throw new Error("Missing 'newConfirmPassword'");
    if (!params.forgotPasswordInfo) throw new Error("Missing 'forgotPasswordInfo'");
    if (!params.forgotPasswordInfo.resetPasswordToken)
      throw new Error("Missing 'resetPasswordToken'");
    if (!params.forgotPasswordInfo.userId) throw new Error("Missing 'userId'");

    const headers = {
      Authorization: `Bearer ${params.forgotPasswordInfo.resetPasswordToken}`,
      'x-client-id': params.forgotPasswordInfo.userId,
    };

    const response: IResponse<null> = await sendRequest({
      url: `${USER_ENDPOINT}/access/reset-password`,
      method: HttpMethod.POST,
      body: {
        newPassword: params.newPassword,
        confirmNewPassword: params.newConfirmPassword,
      },
      headers: headers,
    });

    return response;
  } catch (error) {
    console.error('Error reset password: ', error);
    throw error;
  }
};

export const loginWithGoogle = async (id_token: string): Promise<IResponse<ILoginReponse>> => {
  try {
    if (!id_token) throw new Error("Missing 'id_token'");

    // No user object available for Google login, so no auth headers
    const response: IResponse<ILoginReponse> = await sendRequest({
      url: `${USER_ENDPOINT}/access/google/auth`,
      method: HttpMethod.POST,
      body: {
        id_token,
      },
    });

    return response;
  } catch (error) {
    console.error('Error login with google: ', error);
    throw error;
  }
};

export const logout = async (user: User): Promise<IResponse<null>> => {
  try {
    if (!user.accessToken) throw new Error("Missing 'accessToken'");
    if (!user.id) throw new Error("Missing 'userId'");

    const headers: Record<string, string> = createUserAuthHeaders(user);
    const response: IResponse<null> = await sendRequest({
      url: `${USER_ENDPOINT}/access/logout`,
      method: HttpMethod.POST,
      headers: headers,
    });

    return response;
  } catch (error) {
    console.error('Error logout: ', error);
    throw error;
  }
};
