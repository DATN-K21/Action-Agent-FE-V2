
import { PAYMENT_ENDPOINT } from '@/constants/response-constant';
import { sendRequest, createUserAuthHeaders } from '@/lib/utils';

import type { User } from 'next-auth';

type CreatePaymentIntentParams = {
  user: User;
  amountUsd: number;
};

export async function createPaymentIntent({ user, amountUsd }: CreatePaymentIntentParams) {
  const headers = createUserAuthHeaders(user);
  return sendRequest({
    url: `${PAYMENT_ENDPOINT}/payment/create-intent`,
    method: 'POST',
    headers,
    body: { userId: user.id, amountUsd },
  });
}
