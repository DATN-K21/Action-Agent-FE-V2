import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function RecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback>GM</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Gmail</p>
          <p className="text-sm text-muted-foreground">
            
          </p>
        </div>
        <div className="ml-auto font-medium">2500 times</div>
      </div>
      <div className="flex items-center">
        <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
          <AvatarImage src="/avatars/02.png" alt="Avatar" />
          <AvatarFallback>YT</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Youtube</p>
          {/* <p className="text-sm text-muted-foreground">jackson.lee@email.com</p> */}
        </div>
        <div className="ml-auto font-medium">2000 times</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/03.png" alt="Avatar" />
          <AvatarFallback>N</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Notion</p>
          {/* <p className="text-sm text-muted-foreground">
            isabella.nguyen@email.com
          </p> */}
        </div>
        <div className="ml-auto font-medium">1800 times</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/04.png" alt="Avatar" />
          <AvatarFallback>SL</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Slack</p>
          {/* <p className="text-sm text-muted-foreground">will@email.com</p> */}
        </div>
        <div className="ml-auto font-medium">1500 times</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/05.png" alt="Avatar" />
          <AvatarFallback>GG</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Google Canlendar</p>
          {/* <p className="text-sm text-muted-foreground">sofia.davis@email.com</p> */}
        </div>
        <div className="ml-auto font-medium">1000 times</div>
      </div>
    </div>
  );
}
