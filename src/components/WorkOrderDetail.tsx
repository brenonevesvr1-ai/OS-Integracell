import React from 'react';
import { 
  ArrowLeft, 
  Send, 
  Printer, 
  Edit3, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Clock, 
  Calendar, 
  User, 
  Smartphone, 
  Wrench, 
  ShieldCheck, 
  Lock, 
  Tag, 
  QrCode as QrCodeIcon 
} from 'lucide-react';
import { WorkOrder, ShopSettings, STATUS_CONFIG, CHECKLIST_ITEMS, OSStatus } from '../types/os';
import { getOnlineTrackingUrl } from '../utils/whatsapp';
import { generateQRCodeSVG } from '../utils/qrCode';
import { PatternLock } from './PatternLock';

interface WorkOrderDetailProps {
  os: WorkOrder;
  settings: ShopSettings;
  onBack: () => void;
  onEdit: () => void;
  onSendWhatsApp: () => void;
  onPrint: () => void;
  onOpenOnlineView: () => void;
  onStatusChange: (newStatus: OSStatus) => void;
}

export const WorkOrderDetail: React.FC<WorkOrderDetailProps> = ({
  os,
  settings,
  onBack,
  onEdit,
  onSendWhatsApp,
  onPrint,
  onOpenOnlineView,
  onStatusChange,
}) => {
  const statusCfg = STATUS_CONFIG[os.status];
  const onlineUrl = getOnlineTrackingUrl(os);
  const formattedCreated = new Date(os.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Lista de OS</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenOnlineView}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-xs"
            title="Ver como o cliente enxerga no celular"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span>Ver Como o Cliente Vê</span>
          </button>

          <button
            type="button"
            onClick={onPrint}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Imprimir / PDF</span>
          </button>

          <button
            type="button"
            onClick={onEdit}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Editar</span>
          </button>

          <button
            type="button"
            onClick={onSendWhatsApp}
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 active:scale-95 rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Enviar no WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-mono font-bold text-base bg-slate-900 text-white px-2.5 py-0.5 rounded-lg">
              {os.id}
            </span>
            <span className={`px-3 py-1 rounded-full font-semibold border ${statusCfg.bg} ${statusCfg.color} ${statusCfg.border}`}>
              {statusCfg.label}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formattedCreated}
            </span>
            {os.estimatedDelivery && (
              <>
                <span className="text-slate-400">·</span>
                <span className="text-slate-700 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Previsão: {new Date(os.estimatedDelivery).toLocaleDateString('pt-BR')}
                </span>
              </>
            )}
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            {os.device.brand} {os.device.model}
          </h2>
          <p className="text-xs text-slate-600">
            Cliente: <strong className="text-slate-900">{os.client.name}</strong> · WhatsApp: <span className="font-mono text-emerald-700 font-semibold">{os.client.phone}</span>
          </p>
        </div>

        {/* Quick Status Alteration Box */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 w-full md:w-auto flex flex-col gap-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Alterar Status da OS:
          </span>
          <select
            value={os.status}
            onChange={(e) => onStatusChange(e.target.value as OSStatus)}
            className="text-xs font-semibold bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 shadow-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="aberta">🟡 Em Análise</option>
            <option value="aguardando_aprovacao">🔵 Aguardando Aprovação</option>
            <option value="aprovada">🟣 Aprovada pelo Cliente</option>
            <option value="aguardando_peca">📦 Aguardando Peça</option>
            <option value="em_manutencao">🛠️ Em Manutenção</option>
            <option value="pronta">🟢 Pronta para Retirada</option>
            <option value="finalizada">✅ Finalizada e Entregue</option>
            <option value="cancelada">❌ Cancelada</option>
          </select>
        </div>
      </div>

      {/* Grid: Client, Device, Unlock */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Client */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-900 font-semibold text-xs uppercase tracking-wider">
            <User className="w-4 h-4 text-emerald-600" />
            <span>Dados do Cliente</span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-600">
            <p><span className="text-slate-400">Nome:</span> <strong className="text-slate-900">{os.client.name}</strong></p>
            <p><span className="text-slate-400">WhatsApp:</span> <strong className="text-slate-900 font-mono">{os.client.phone}</strong></p>
            {os.client.cpf && <p><span className="text-slate-400">CPF:</span> <span className="font-mono text-slate-700">{os.client.cpf}</span></p>}
            {os.client.email && <p><span className="text-slate-400">E-mail:</span> <span className="text-slate-700">{os.client.email}</span></p>}
          </div>
        </div>

        {/* Device */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-900 font-semibold text-xs uppercase tracking-wider">
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>Dados do Aparelho</span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-600">
            <p><span className="text-slate-400">Marca:</span> <strong className="text-slate-900">{os.device.brand}</strong></p>
            <p><span className="text-slate-400">Modelo:</span> <strong className="text-slate-900">{os.device.model}</strong></p>
            <p><span className="text-slate-400">Cor:</span> <span className="text-slate-700">{os.device.color}</span></p>
            {os.device.imei && <p><span className="text-slate-400">IMEI:</span> <span className="font-mono text-slate-700">{os.device.imei}</span></p>}
            <p>
              <span className="text-slate-400">Acessórios:</span>{' '}
              <span className="text-slate-700">
                {os.device.accessories.length > 0 ? os.device.accessories.join(', ') : 'Nenhum acessório'}
              </span>
            </p>
          </div>
        </div>

        {/* Password / Pattern */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-900 font-semibold text-xs uppercase tracking-wider">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>Segurança / Desbloqueio</span>
          </div>
          
          {os.device.passwordType === 'pin' && (
            <div className="text-center py-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 uppercase block mb-1">Senha Numérica / PIN</span>
              <span className="font-mono font-bold text-lg text-slate-900 tracking-wider">
                {os.device.passwordPin || '(não informada)'}
              </span>
            </div>
          )}

          {os.device.passwordType === 'pattern' && (
            <div className="flex flex-col items-center">
              <PatternLock value={os.device.passwordPattern} readOnly size={130} />
              <span className="text-[10px] text-slate-500 mt-1 font-mono">
                Sequência: {os.device.passwordPattern?.map(n => n + 1).join(' → ') || 'Nenhum'}
              </span>
            </div>
          )}

          {os.device.passwordType === 'none' && (
            <div className="text-center py-6 text-xs text-slate-400 italic">
              Sem senha ou não fornecida.
            </div>
          )}
        </div>
      </div>

      {/* Defeito Reclamado & Laudo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Defeito Reclamado (Cliente)
          </h3>
          <p className="text-xs text-slate-800 bg-amber-50/50 p-3 rounded-xl border border-amber-200/60 leading-relaxed">
            {os.reportedIssue}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Laudo Técnico / Diagnóstico da Bancada
          </h3>
          <p className="text-xs text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
            {os.technicalDiagnosis || 'Diagnóstico em andamento pelo corpo técnico.'}
          </p>
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-900 font-semibold text-sm">
          <Wrench className="w-4 h-4 text-emerald-600" />
          <span>Checklist Técnico de Entrada</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {CHECKLIST_ITEMS.map((item) => {
            const val = os.checklist[item.key];
            return (
              <div
                key={item.key}
                className="p-2 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between items-center text-center gap-1"
              >
                <span className="text-[10px] font-medium text-slate-700 line-clamp-1">
                  {item.label}
                </span>

                {val === 'ok' && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    <CheckCircle2 className="w-2.5 h-2.5" /> OK
                  </span>
                )}
                {val === 'defeito' && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                    <XCircle className="w-2.5 h-2.5" /> DEFEITO
                  </span>
                )}
                {val === 'nao_testado' && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">
                    N/T
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Services & Financials */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">
            Peças e Serviços Executados
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            Garantia: {os.warrantyDays} dias
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {os.servicesAndParts.map((item, idx) => (
            <div key={item.id || idx} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {item.type === 'peca' ? 'Peça' : 'Serviço'}
                </span>
                <span className="font-medium text-slate-800">{item.description}</span>
                <span className="text-slate-400">× {item.quantity}</span>
              </div>
              <span className="font-mono font-semibold text-slate-900 tabular-nums">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unitPrice * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-end sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Forma de Pagamento: <strong className="text-slate-800 uppercase">{os.paymentMethod || 'A Combinar'}</strong>
            {os.discount > 0 && <span className="ml-3 text-emerald-600">Desconto: -R$ {os.discount.toFixed(2)}</span>}
          </div>

          <div className="bg-slate-900 text-white px-5 py-2.5 rounded-xl flex items-center gap-4">
            <span className="text-xs text-slate-300">Total a Pagar:</span>
            <span className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(os.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Online Access & QR Code Preview */}
      <div className="bg-gradient-to-r from-sky-50 to-orange-50/50 p-5 rounded-2xl border border-sky-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div 
            className="w-20 h-20 bg-white p-1 rounded-xl border border-sky-300 shadow-xs shrink-0"
            dangerouslySetInnerHTML={{ __html: generateQRCodeSVG(onlineUrl, 80) }}
          />
          <div>
            <h4 className="text-sm font-bold text-slate-900">Acompanhamento Online Íntegracell Ativo</h4>
            <p className="text-xs text-slate-600 mt-0.5 max-w-md">
              Esta Ordem de Serviço possui link público da Íntegracell para o cliente acompanhar pelo celular. Ao enviar no WhatsApp, o link é adicionado automaticamente!
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onSendWhatsApp}
          className="px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 active:scale-95 rounded-xl transition-all shadow-md shadow-orange-500/25 flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Enviar OS no WhatsApp</span>
        </button>
      </div>
    </div>
  );
};
