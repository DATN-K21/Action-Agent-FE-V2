import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IRankingConnectedExtension } from '@/services/admin-service';

export interface RankingExtensionProps {
  data: IRankingConnectedExtension[];
}

export function RankingExtension(props: RankingExtensionProps) {
  const { data } = props;
  console.log('RankingExtension Data:', data);

  return (
    <div className="space-y-8 min-h-[600px]">
      {data?.map((extension) => (
        <div className="flex items-center" key={extension.id}>
          <Avatar className="size-9">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>{extension.rank}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {extension.displayInfo.extension_name}
            </p>
            <p className="text-sm text-muted-foreground"></p>
          </div>
          <div className="ml-auto font-medium">{extension.score} points</div>
        </div>
      ))}
      {/* Add more user items as needed */}
    </div>
  );
}
