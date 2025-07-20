
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecentUser {
  email: string;
  lastLogin: string;
}

interface RecentUsersSelectProps {
  recentUsers: RecentUser[];
  onSelectUser: (email: string) => void;
  onClearUsers: () => void;
}

const RecentUsersSelect: React.FC<RecentUsersSelectProps> = ({
  recentUsers,
  onSelectUser,
  onClearUsers
}) => {
  if (recentUsers.length === 0) {
    return null;
  }

  const formatLastLogin = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) {
        return 'Há poucos minutos';
      } else if (diffInHours < 24) {
        return `Há ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
      } else {
        const diffInDays = Math.floor(diffInHours / 24);
        return `Há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
      }
    } catch {
      return 'Recente';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="recent-users" className="text-[#0C1C2E] font-medium flex items-center gap-2">
          <Clock className="h-4 w-4 text-[#BC942C]" />
          Usuários Recentes
        </Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClearUsers}
          className="text-xs text-[#BC942C] hover:text-[#B48534] px-2 py-1"
        >
          <X className="h-3 w-3 mr-1" />
          Limpar
        </Button>
      </div>
      <Select onValueChange={onSelectUser}>
        <SelectTrigger className="border-[#BC942C]/30 focus:border-[#BC942C] focus:ring-[#BC942C]/20">
          <SelectValue placeholder="Selecione um usuário recente" />
        </SelectTrigger>
        <SelectContent className="bg-white border-[#BC942C]/30">
          {recentUsers.map((user, index) => (
            <SelectItem 
              key={index} 
              value={user.email}
              className="focus:bg-[#BC942C]/10 focus:text-[#0C1C2E]"
            >
              <div className="flex flex-col">
                <span className="font-medium text-[#0C1C2E]">{user.email}</span>
                <span className="text-xs text-[#0C1C2E]/60">{formatLastLogin(user.lastLogin)}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default RecentUsersSelect;
