import { PhoneCall, Pin, User2Icon, Users, VideoIcon } from "lucide-react";
import { useState } from "react";

type IconItem = {
  id: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  active: boolean;
  onClick: () => void;
  tooltip?: string;
};

type IconBarProps = {
  onVoiceCall?: () => void;
  onVideoCall?: () => void;
  onPinnedMessages?: () => void;
  onMembersList?: () => void;
  onUserInfo?: () => void;
  className?: string;
};

export const IconBar = ({
  onVoiceCall = () => console.log("Iniciar chamada de voz"),
  onVideoCall = () => console.log("Iniciar chamada de vídeo"),
  onPinnedMessages = () => console.log("Mostrar mensagens fixadas"),
  onMembersList = () => console.log("Mostrar membros do chat"),
  onUserInfo = () => console.log("Mostrar informações do usuário"),
  className = "",
}: IconBarProps) => {
  const [activeIcon, setActiveIcon] = useState<number | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleIconClick = (iconId: number) => {
    switch (iconId) {
      case 1:
        onVoiceCall();
        break;
      case 2:
        onVideoCall();
        break;
      case 3:
        onPinnedMessages();
        break;
      case 4:
        onMembersList();
        break;
      case 5:
        onUserInfo();
        setIsUserMenuOpen(!isUserMenuOpen);
        return; // Não alteramos o activeIcon para este caso
      default:
        break;
    }

    setActiveIcon(iconId === activeIcon ? null : iconId);
  };

  const iconsList: IconItem[] = [
    {
      id: 1,
      icon: PhoneCall,
      active: activeIcon === 1,
      onClick: () => handleIconClick(1),
      tooltip: "Chamada de voz",
    },
    {
      id: 2,
      icon: VideoIcon,
      active: activeIcon === 2,
      onClick: () => handleIconClick(2),
      tooltip: "Chamada de vídeo",
    },
    {
      id: 3,
      icon: Pin,
      active: activeIcon === 3,
      onClick: () => handleIconClick(3),
      tooltip: "Mensagens fixadas",
    },
    {
      id: 4,
      icon: Users,
      active: activeIcon === 4,
      onClick: () => handleIconClick(4),
      tooltip: "Membros do chat",
    },
    {
      id: 5,
      icon: User2Icon,
      active: isUserMenuOpen,
      onClick: () => handleIconClick(5),
      tooltip: "Informações do usuário",
    },
  ];

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {iconsList.map(({ id, icon: Icon, active, onClick, tooltip }) => (
        <button
          key={id}
          onClick={onClick}
          className={`p-2 rounded-full text-zinc-400 cursor-pointer transition-colors relative group ${active
            ? "bg-zinc-800 text-white"
            : ""
            }`}
          aria-label={tooltip}
        >
          <Icon size={20} />
          {tooltip && (
            <span className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {tooltip}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};