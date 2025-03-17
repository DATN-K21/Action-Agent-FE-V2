import { API_ENDPOINT } from '@/constants/response-constant';
import { sendRequest } from '@/lib/utils';
import { IHeader } from '@/types/auth';
import { User } from 'next-auth';
import { ILoginReponse, IRegisterReponse } from '@/types/auth';

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
  confirmNewPassword: string;
  infoForgotPassword: {
    resetPasswordToken: string;
    userId: string;
  };
}

export const Login = async (params: ILoginParams): Promise<ILoginReponse> => {
  try {
    const response: IResponse<ILoginReponse> = await sendRequest({
      url: `${API_ENDPOINT}/user/access/login`,
      method: 'POST',
      body: {
        email: params.email,
        password: params.password,
      },
    });

    return response.data as ILoginReponse;
  } catch (error) {
    console.error('Error sending message: ', error);
    throw error;
  }
};

export const Register = async (params: IRegisterParams): Promise<any> => {
  try {
    const response: IResponse<IRegisterReponse> = await sendRequest({
      url: `${API_ENDPOINT}/user/access/signup`,
      method: 'POST',
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
    console.error('Error sending message: ', error);
    throw error;
  }
};

export const SendLink = async (email: string): Promise<any> => {
  try {
    const response: IResponse<null> = await sendRequest({
      url: `${API_ENDPOINT}/user/access/activate/send-link`,
      method: 'POST',
      body: {
        email,
      },
    });

    return response;
  } catch (error) {
    console.error('Error sending message: ', error);
    throw error;
  }
};

export const SendOTP = async (email: string): Promise<any> => {
  try {
    const response: IResponse<null> = await sendRequest({
      url: `${API_ENDPOINT}/user/access/reset-password/send-otp`,
      method: 'POST',
      body: {
        email,
      },
    });

    return response;
  } catch (error) {
    console.error('Error sending message: ', error);
    throw error;
  }
};

export const ConfirmOTP = async (email: string, otp: string): Promise<any> => {
  try {
    const response: IResponse<null> = await sendRequest({
      url: `${API_ENDPOINT}/user/access/reset-password/confirm-otp`,
      method: 'POST',
      body: {
        email,
        otp,
      },
    });

    return response;
  } catch (error) {
    console.error('Error sending message: ', error);
    throw error;
  }
};

export const ResetPassword = async (params: IResetPasswordParams): Promise<any> => {
  try {
    const headers = {
      Authorization: `Bearer ${params.infoForgotPassword.resetPasswordToken}`,
      'x-client-id': params.infoForgotPassword.userId,
    };
    const response: IResponse<null> = await sendRequest({
      url: `${API_ENDPOINT}/user/access/reset-password`,
      method: 'POST',
      body: {
        newPassword: params.newPassword,
        confirmNewPassword: params.confirmNewPassword,
      },
      headers: headers,
    });

    return response;
  } catch (error) {
    console.error('Error sending message: ', error);
    throw error;
  }
};
