import React, { useState } from 'react';
import { 
  Smartphone, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Copy, 
  Check, 
  MessageCircle, 
  ShieldCheck, 
  AlertCircle, 
  Search, 
  Printer, 
  Share2, 
  FileText 
} from 'lucide-react';
import { WorkOrder, ShopSettings, STATUS_CONFIG, OSStatus } from '../types/os';
import { formatPhoneForWhatsApp, getWhatsAppUrl } from '../utils/whatsapp';
import { IntegracellLogo } from './IntegracellLogo';

interface ClientOnlineViewProps {
  os: WorkOrder;
  settings: ShopSettings;
  onSearchAnother?: (code: string) => void;
  onBackToApp?: () => void;
  onPrint?: () => void;
}

export const ClientOnlineView: React.FC<ClientOnlineViewProps> = ({
  os,
  settings,
  onSearchAnother,
  onBackToApp,
  onPrint,
}) => {
  const [copiedPix, setCopiedPix] = useState(false);
  const [searchCode, setSearchCode] = useState('');
  const statusCfg = STATUS_CONFIG[os.status];

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
      return;
    }
    try {
      window.print();
    } catch (e) {
      console.error('Print failed', e);
    }
  };

  const handleCopyPix = async () => {
    if (!settings.shopPixKey) return;
    try {
      await navigator.clipboard.writeText(settings.shopPixKey);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleApproveBudgetWhatsApp = () => {
    const text = `Olá! Sou *${os.client.name}*. Gostaria de *APROVAR O ORÇAMENTO* da Ordem de Serviço *#${os.id}* do aparelho *${os.device.brand} ${os.device.model}* no valor total de R$ ${os.total.toFixed(2)}. Podem prosseguir com o serviço! 👍`;
    const url = getWhatsAppUrl(settings.shopWhatsapp || settings.shopPhone, text);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleContactShopWhatsApp = () => {
    const text = `Olá! Gostaria de tirar uma dúvida sobre a Ordem de Serviço *#${os.id}* (${os.device.brand} ${os.device.model}).`;
    const url = getWhatsAppUrl(settings.shopWhatsapp || settings.shopPhone, text);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Stepper milestones
  const steps: { key: string; label: string; done: boolean; current: boolean }[] = [
    {
      key: 'entrada',
      label: 'Entrada / Análise',
      done: true,
      current: os.status === 'aberta'
    },
    {
      key: 'orcamento',
      label: 'Orçamento',
      done: ['aguardando_aprovacao', 'aprovada', 'aguardando_peca', 'em_manutencao', 'pronta', 'finalizada'].includes(os.status),
      current: os.status === 'aguardando_aprovacao'
    },
    {
      key: 'manutencao',
      label: 'Na Bancada',
      done: ['em_manutencao', 'pronta', 'finalizada'].includes(os.status),
      current: ['aprovada', 'aguardando_peca', 'em_manutencao'].includes(os.status)
    },
    {
      key: 'pronta',
      label: 'Pronto p/ Retirada',
      done: ['pronta', 'finalizada'].includes(os.status),
      current: os.status === 'pronta'
    },
    {
      key: 'entregue',
      label: 'Finalizado',
      done: os.status === 'finalizada',
      current: os.status === 'finalizada'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-900 pb-16 font-sans">
      {/* Top Bar for Client */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-3xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IntegracellLogo size={36} theme="dark" />
          </div>

          {onBackToApp && (
            <button
              type="button"
              onClick={onBackToApp}
              className="text-xs px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            >
              Voltar ao Painel
            </button>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-6 space-y-5">
        {/* Íntegracell Hero Brand Card */}
        <div className="bg-gradient-to-br from-[#07132b] via-[#0b1f48] to-[#081735] text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-sky-900/60 relative overflow-hidden">
          {/* Subtle ambient lighting flares */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-orange-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            {/* 3D Emblem Logo from user's brand */}
            <div className="shrink-0 p-1.5 rounded-2xl bg-slate-900/50 border border-sky-400/20 backdrop-blur-xs shadow-inner">
              <IntegracellLogo variant="badge-full" size={88} />
            </div>

            <div className="flex-1 space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                Ordem de Serviço Oficial
              </div>

              <h2 className="text-xl sm:text-2xl font-black italic tracking-tight text-white">
                Íntegra<span className="text-orange-400">cell</span>{' '}
                <span className="font-sans not-italic text-sm font-bold text-sky-300 block sm:inline">
                  · Reparo de Celular
                </span>
              </h2>

              <p className="text-xs text-slate-300 leading-relaxed max-w-md">
                Acompanhe o status do conserto do seu aparelho em tempo real com garantia de peças e mão de obra especializada.
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-[11px] text-slate-300">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                  Garantia de 90 dias
                </span>
                <span className="text-slate-600">·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  {settings.shopAddress}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                Ordem de Serviço
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-xl font-bold text-slate-900">
                  #{os.id}
                </span>
                <span className={`text-xs px-3 py-1 rounded-full font-bold border ${statusCfg.bg} ${statusCfg.color} ${statusCfg.border}`}>
                  {statusCfg.label}
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block">
                Data de Entrada
              </span>
              <span className="text-xs text-slate-700 font-medium">
                {new Date(os.createdAt).toLocaleDateString('pt-BR')} às {new Date(os.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="pt-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-3">
              Progresso do Reparo:
            </span>
            <div className="grid grid-cols-5 gap-1 relative">
              {steps.map((s, idx) => (
                <div key={s.key} className="flex flex-col items-center text-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      s.done
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : s.current
                        ? 'bg-amber-500 text-white ring-4 ring-amber-100'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {s.done ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                  </div>
                  <span
                    className={`text-[10px] mt-1.5 font-medium leading-tight line-clamp-2 ${
                      s.current ? 'text-amber-800 font-bold' : s.done ? 'text-emerald-700' : 'text-slate-400'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Status Explanation box */}
          <div className={`p-4 rounded-xl border ${statusCfg.bg} ${statusCfg.border}`}>
            <p className={`text-xs ${statusCfg.color} font-medium leading-relaxed`}>
              {statusCfg.desc}
            </p>
          </div>

          {/* Highlight Callout if Ready for Pickup */}
          {os.status === 'pronta' && (
            <div className="bg-emerald-50 border-2 border-emerald-500/50 p-4 rounded-xl text-center space-y-2">
              <h3 className="font-bold text-emerald-900 text-sm">
                🎉 Seu aparelho já está pronto para retirada!
              </h3>
              <p className="text-xs text-emerald-800">
                Você já pode vir até a loja para testar e retirar seu celular.
              </p>
              <div className="text-xs text-emerald-900 pt-1">
                <strong>Endereço:</strong> {settings.shopAddress}
              </div>
            </div>
          )}

          {/* Highlight Callout if Budget awaiting approval */}
          {os.status === 'aguardando_aprovacao' && (
            <div className="bg-blue-50 border-2 border-blue-400 p-4 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-blue-950 font-bold text-sm">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                <span>Orçamento Aguardando Sua Aprovação</span>
              </div>
              <p className="text-xs text-blue-900 leading-relaxed">
                Nossos técnicos avaliaram seu aparelho. Confira os valores abaixo e aprove com 1 clique para começarmos o reparo imediatamente!
              </p>
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleApproveBudgetWhatsApp}
                  className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Aprovar Orçamento pelo WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={handleContactShopWhatsApp}
                  className="py-2.5 px-4 bg-white border border-blue-300 text-blue-900 rounded-xl text-xs font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Tirar Dúvidas</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Device & Client Information */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>Dados do Aparelho & Cliente</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <p><span className="text-slate-400">Cliente:</span> <strong className="text-slate-900">{os.client.name}</strong></p>
              <p><span className="text-slate-400">Telefone:</span> <span className="font-mono text-slate-700">{os.client.phone}</span></p>
            </div>
            <div className="space-y-1.5">
              <p><span className="text-slate-400">Aparelho:</span> <strong className="text-slate-900">{os.device.brand} {os.device.model}</strong></p>
              <p><span className="text-slate-400">Cor:</span> <span className="text-slate-700">{os.device.color}</span></p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
            <div>
              <span className="text-slate-400 font-medium">Defeito Informado no Check-in:</span>
              <p className="text-slate-800 mt-0.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                {os.reportedIssue}
              </p>
            </div>

            {os.technicalDiagnosis && (
              <div>
                <span className="text-slate-400 font-medium">Diagnóstico do Técnico:</span>
                <p className="text-slate-800 mt-0.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  {os.technicalDiagnosis}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Services, Parts & Budget breakdown */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Valores & Peças do Orçamento</span>
            </span>
            <span className="text-[11px] font-normal text-slate-500">
              Garantia: {os.warrantyDays} dias
            </span>
          </h3>

          <div className="divide-y divide-slate-100">
            {os.servicesAndParts.map((item, idx) => (
              <div key={item.id || idx} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-medium text-slate-900">{item.description}</span>
                  <div className="text-[11px] text-slate-400">
                    {item.type === 'peca' ? 'Peça' : 'Serviço'} · Qtd: {item.quantity}
                  </div>
                </div>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Valor Total:</span>
            <span className="font-mono text-xl font-bold text-emerald-600 tabular-nums">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(os.total)}
            </span>
          </div>

          {/* PIX Payment Option */}
          {settings.shopPixKey && (
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Pagamento via PIX da Loja
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={settings.shopPixKey}
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-800"
                />
                <button
                  type="button"
                  onClick={handleCopyPix}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedPix ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPix ? 'Copiado!' : 'Copiar Chave'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Warranty terms */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Garantia & Condições Gerais</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-line">
            {settings.warrantyTerms}
          </p>
        </div>

        {/* Shop Location & Contact Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            {settings.shopName}
          </h4>
          <div className="space-y-1.5 text-xs text-slate-600">
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>{settings.shopAddress}</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Telefone / WhatsApp: {settings.shopPhone}</span>
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={handleContactShopWhatsApp}
              className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Falar com a Assistência no WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
              title="Visualizar e imprimir comprovante completo da OS"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Imprimir OS</span>
            </button>
          </div>
        </div>

        {/* Search Another OS */}
        {onSearchAnother && (
          <div className="p-4 bg-slate-200/60 rounded-xl flex items-center justify-between gap-3">
            <span className="text-xs text-slate-600">Deseja consultar outra Ordem de Serviço?</span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Ex: OS-2026-002"
                className="text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg w-32 font-mono uppercase"
              />
              <button
                type="button"
                onClick={() => searchCode.trim() && onSearchAnother(searchCode.trim())}
                className="px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg hover:bg-slate-900 transition-colors"
              >
                Buscar
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
