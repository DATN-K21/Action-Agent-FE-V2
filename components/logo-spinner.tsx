import Image from 'next/image';

export function LogoSpinner() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center">
        <span className="absolute inline-flex h-16 w-16 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 opacity-30 animate-ping"></span>
        <Image
          src="/images/logo_symbol.png"
          alt="Loading..."
          width={48}
          height={48}
          className="z-10"
          priority
        />
      </div>
    </div>
  );
}
