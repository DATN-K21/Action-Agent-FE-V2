import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icon';
import { FcGoogle } from 'react-icons/fc';
import { signIn } from 'next-auth/react';
import { Providers } from '@/constants/auth-constant';

interface GoogleButtonProps {
  isLoading: boolean;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ isLoading }) => {
  const handleLoginWithGoogle = async () => {
    await signIn(Providers.Google);
  };

  return (
    <Button
      variant="outline"
      className="w-full"
      disabled={isLoading}
      onClick={handleLoginWithGoogle}
    >
      {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
      <FcGoogle size={28} />
    </Button>
  );
};

export default GoogleButton;
