import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IRankingUser } from '@/services/admin-service';

interface RankingUserProps {
  data: IRankingUser[];
}
export function RankingUser(props: RankingUserProps) {
  const { data } = props;

  return (
    <div className="space-y-8 min-h-[600px]">
      {data?.map((user) => (
        <div className="flex items-center" key={user.id}>
          <Avatar className="size-9">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>{user.rank}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayInfo.email}</p>
            <p className="text-sm text-muted-foreground"></p>
          </div>
          <div className="ml-auto font-medium">{user.score} points</div>
        </div>
      ))}
      {/* Add more user items as needed */}
    </div>
  );
}
