import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type Props = {
  image: string;
  username: string | undefined;
  isOnline: boolean;
  className?: string;
}

const InforUserImage = ({ image, isOnline, username, className }: Props) => {
  return (
    <div className="relative">
      <Avatar className={`w-20 h-20 relative border-4 border-[#2b2d31] rounded-full ${className}`}>
        <AvatarImage className="rounded-full object-cover" src={image!} alt={username!} />
        <AvatarFallback className="bg-[#313133] text-white">
          {username?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className={`absolute bottom- left-15 top-12.5 ${isOnline ? "bg-green-500" : "bg-zinc-600"} border-2 border-zinc-900 p-2 rounded-full`}></div>
    </div>
  );
}

export default InforUserImage;