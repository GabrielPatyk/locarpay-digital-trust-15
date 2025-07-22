import React from 'react';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useNotificacoes } from '@/hooks/useNotificacoes';
import { useNavigate } from 'react-router-dom';

const NotificacoesDropdown = () => {
  const navigate = useNavigate();
  const { 
    notificacoes, 
    totalNaoLidas, 
    marcarComoLida, 
    marcarTodasComoLidas 
  } = useNotificacoes();

  const handleNotificacaoClick = (notificacao: any) => {
    if (!notificacao.lida) {
      marcarComoLida.mutate(notificacao.id);
    }
    
    // Navegar para a página relacionada se necessário
    if (notificacao.dados_extras?.fianca_id) {
      navigate(`/detalhe-fianca/${notificacao.dados_extras.fianca_id}`);
    }
  };

  const handleMarcarTodasLidas = () => {
    marcarTodasComoLidas.mutate();
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'fianca_aprovada':
        return 'text-green-600';
      case 'fianca_rejeitada':
        return 'text-red-600';
      case 'pagamento_confirmado':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatarData = (data: string) => {
    const date = new Date(data);
    const agora = new Date();
    const diffMinutos = Math.floor((agora.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutos < 1) return 'Agora';
    if (diffMinutos < 60) return `${diffMinutos}m`;
    
    const diffHoras = Math.floor(diffMinutos / 60);
    if (diffHoras < 24) return `${diffHoras}h`;
    
    const diffDias = Math.floor(diffHoras / 24);
    if (diffDias < 7) return `${diffDias}d`;
    
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {totalNaoLidas > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {totalNaoLidas > 99 ? '99+' : totalNaoLidas}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificações</span>
          {totalNaoLidas > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarcarTodasLidas}
              className="h-6 px-2 text-xs"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Marcar todas como lidas
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notificacoes.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            Nenhuma notificação encontrada
          </div>
        ) : (
          notificacoes.slice(0, 10).map((notificacao) => (
            <DropdownMenuItem
              key={notificacao.id}
              className={`flex flex-col items-start p-3 cursor-pointer ${
                !notificacao.lida ? 'bg-blue-50' : ''
              }`}
              onClick={() => handleNotificacaoClick(notificacao)}
            >
              <div className="flex items-start justify-between w-full">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className={`font-medium text-sm ${getTipoColor(notificacao.tipo)}`}>
                      {notificacao.titulo}
                    </p>
                    {!notificacao.lida && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {notificacao.mensagem}
                  </p>
                </div>
                <span className="text-xs text-gray-400 ml-2">
                  {formatarData(notificacao.data_criacao)}
                </span>
              </div>
            </DropdownMenuItem>
          ))
        )}
        
        {notificacoes.length > 10 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-sm text-gray-500 cursor-default">
              Mostrando 10 de {notificacoes.length} notificações
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificacoesDropdown;