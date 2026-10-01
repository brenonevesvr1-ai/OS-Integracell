import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Send, 
  Eye, 
  Printer, 
  Trash2, 
  Filter, 
  Smartphone, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { WorkOrder, OSStatus, STATUS_CONFIG } from '../types/os';

interface WorkOrderListProps {
  orders: WorkOrder[];
  onSelectOrder: (order: WorkOrder) => void;
  onNewOrder: () => void;
  onSendWhatsApp: (order: WorkOrder) => void;
  onPrintOrder: (order: WorkOrder) => void;
  onDeleteOrder: (id: string) => void;
}

export const WorkOrderList: React.FC<WorkOrderListProps> = ({
  orders,
  onSelectOrder,
  onNewOrder,
  onSendWhatsApp,
  onPrintOrder,
  onDeleteOrder,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todas');

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((os) => {
      // Status filter
      if (statusFilter !== 'todas' && os.status !== statusFilter) {
        return false;
      }

      // Search filter
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      const matchId = os.id.toLowerCase().includes(term);
      const matchClient = os.client.name.toLowerCase().includes(term);
      const matchPhone = os.client.phone.replace(/\D/g, '').includes(term.replace(/\D/g, ''));
      const matchDevice = `${os.device.brand} ${os.device.model}`.toLowerCase().includes(term);
      const matchIssue = os.reportedIssue.toLowerCase().includes(term);

      return matchId || matchClient || matchPhone || matchDevice || matchIssue;
    });
  }, [orders, searchTerm, statusFilter]);

  // Metrics
  const activeOrdersCount = orders.filter(o => !['finalizada', 'cancelada'].includes(o.status)).length;
  const readyOrdersCount = orders.filter(o => o.status === 'pronta').length;
  const awaitingApprovalCount = orders.filter(o => o.status === 'aguardando_aprovacao').length;
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelada')
    .reduce((sum, o) => sum + o.total, 0);

  const statusOptions: { id: string; label: string; count?: number }[] = [
    { id: 'todas', label: 'Todas as OS', count: orders.length },
    { id: 'aberta', label: 'Em Análise', count: orders.filter(o => o.status === 'aberta').length },
    { id: 'aguardando_aprovacao', label: 'Aguardando Aprovação', count: awaitingApprovalCount },
    { id: 'em_manutencao', label: 'Na Bancada', count: orders.filter(o => o.status === 'em_manutencao').length },
    { id: 'pronta', label: 'Prontas p/ Retirada', count: readyOrdersCount },
    { id: 'finalizada', label: 'Entregues', count: orders.filter(o => o.status === 'finalizada').length },
  ];

  return (
    <div className="space-y-6">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 border-t-2 border-t-sky-500 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            OS em Aberto / Ativas
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {activeOrdersCount}
            </span>
            <span className="text-xs text-sky-700 font-medium">na bancada</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 border-t-2 border-t-emerald-500 shadow-xs">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">
            Prontas para Retirada
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono text-emerald-600 tabular-nums">
              {readyOrdersCount}
            </span>
            <span className="text-xs text-emerald-700 font-medium">notificar cliente</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 border-t-2 border-t-orange-500 shadow-xs">
          <span className="text-[11px] font-semibold text-orange-700 uppercase tracking-wider block">
            Aguardando Aprovação
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono text-orange-600 tabular-nums">
              {awaitingApprovalCount}
            </span>
            <span className="text-xs text-orange-700 font-medium">orçamentos enviados</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 border-t-2 border-t-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Faturamento Previsto
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold font-mono text-slate-900 tabular-nums truncate">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalRevenue)}
            </span>
            <span className="text-xs text-slate-500">total registrado</span>
          </div>
        </div>
      </div>

      {/* Action Bar: Search, Filters & New OS */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente, WhatsApp, nº de OS ou modelo do aparelho..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
          />
        </div>

        {/* New OS Button */}
        <button
          type="button"
          onClick={onNewOrder}
          className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Ordem de Serviço</span>
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {statusOptions.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setStatusFilter(opt.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              statusFilter === opt.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span>{opt.label}</span>
            {opt.count !== undefined && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                statusFilter === opt.id ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {opt.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders List / Table */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <Smartphone className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">Nenhuma Ordem de Serviço encontrada</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm || statusFilter !== 'todas'
              ? 'Tente ajustar os filtros ou o termo de busca para encontrar o que procura.'
              : 'Comece criando a primeira Ordem de Serviço da sua assistência técnica agora mesmo!'}
          </p>
          <button
            type="button"
            onClick={onNewOrder}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Criar Nova OS</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((os) => {
            const statusCfg = STATUS_CONFIG[os.status];
            const dateStr = new Date(os.createdAt).toLocaleDateString('pt-BR');

            return (
              <div
                key={os.id}
                onClick={() => onSelectOrder(os)}
                className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                {/* Left column: OS info, client, device */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded">
                      {os.id}
                    </span>
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${statusCfg.bg} ${statusCfg.color} ${statusCfg.border}`}>
                      {statusCfg.label}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {dateStr}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {os.device.brand} {os.device.model} ({os.device.color})
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Cliente: <strong className="text-slate-800">{os.client.name}</strong> · WhatsApp: <span className="font-mono text-emerald-700">{os.client.phone}</span>
                    </p>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-1 italic bg-slate-50 px-2 py-1 rounded border border-slate-100 max-w-xl">
                    Defeito: {os.reportedIssue}
                  </p>
                </div>

                {/* Right column: Value & Quick action buttons */}
                <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-left md:text-right pr-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total</span>
                    <span className="font-mono font-bold text-base text-slate-900 tabular-nums">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(os.total)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    {/* Quick WhatsApp Send */}
                    <button
                      type="button"
                      onClick={() => onSendWhatsApp(os)}
                      className="p-2 text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white rounded-xl transition-colors font-medium text-xs flex items-center gap-1"
                      title="Enviar no WhatsApp"
                    >
                      <Send className="w-4 h-4" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </button>

                    {/* View Details */}
                    <button
                      type="button"
                      onClick={() => onSelectOrder(os)}
                      className="p-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                      title="Ver Detalhes da OS"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Print */}
                    <button
                      type="button"
                      onClick={() => onPrintOrder(os)}
                      className="p-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                      title="Imprimir OS"
                    >
                      <Printer className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Tem certeza que deseja excluir a OS #${os.id}?`)) {
                          onDeleteOrder(os.id);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Excluir OS"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
