import { Roles } from "@prisma/client";
import { Crown, Shield, Star, User2 } from "lucide-react";

export const getRoleIcon = (role: Roles, size?: number) => {
  switch (role) {
    case "owner": return <Crown size={`${size}`} className="text-yellow-500" />;
    case "admin": return <Shield size={`${size}`} className="text-blue-500" />;
    case "moderator": return <Shield size={`${size}`} className="text-green-500" />;
    case "vip": return <Star size={`${size}`} className="text-purple-500" />;
    default: return <User2 size={`${size}`} />;
  }
}
