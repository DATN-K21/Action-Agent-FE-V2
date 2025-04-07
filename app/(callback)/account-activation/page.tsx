import { redirect } from 'next/navigation';
import { ActivateAccount } from '@/services/auth-service';


export default async function CallbackAccountActivationPage({
    searchParams,
}: {
    searchParams: Promise<{ token?: string }>;
}) {
    const {token } = await searchParams;

    if (!token) {
        redirect('/login?activated=error');
      }
    
      const success = await ActivateAccount(token)
      .then(() => true)
      .catch(() => false);
    
      if (success) {
        redirect('/login?activated=success');
      } else {
        redirect('/login?activated=error');
      }
}