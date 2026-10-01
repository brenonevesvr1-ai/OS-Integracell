import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Copy, 
  Check, 
  ExternalLink, 
  MessageSquare, 
  Smartphone, 
  Sparkles, 
  QrCode as QrCodeIcon 
} from 'lucide-react';
import { WorkOrder, ShopSettings } from '../types/os';
import { 
  buildWhatsAppMessage, 
  getWhatsAppUrl, 
  getOnlineTrackingUrl, 
  WhatsAppMessageType, 
  formatPhoneForWhatsApp 
} from '../utils/whatsapp';
import { generateQRCodeSVG } from '../utils/qrCode';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  os: WorkOrder;
  settings: ShopSettings;
  initialType?: WhatsAppMessageType;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  os,
  settings,
  initialType = 'abertura',
}) => {
  const [selectedType, setSelectedType] = useState<WhatsAppMessageType>(initialType);
  const [customNote, setCustomNote] = useState('');
  const [customPhone, setCustomPhone] = useState(os.client.phone);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  const currentMessage = buildWhatsAppMessage(os, settings, selectedType, customNote);
  const trackingUrl = getOnlineTrackingUrl(os);
  const cleanPhone = formatPhoneForWhatsApp(customPhone);
  const waUrl = getWhatsAppUrl(customPhone, currentMessage);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(currentMessage);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(trackingUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleSendWhatsApp = () => {
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const templates: { id: WhatsAppMessageType; label: string; desc: string }[] = [
    { id: 'abertura', label: '1. Abertura / Entrada', desc: 'Comprovante inicial com link de acompanhamento' },
    { id: 'orcamento', label: '2. Orçamento & Laudo', desc: 'Detalhes de peças, valor e link para aprovação' },
    { id: 'pronto', label: '3. Pronto p/ Retirada', desc: 'Aviso de conclusão, chave PIX e endereço da loja' },
    { id: 'finalizada', label: '4. Comprovante & Garantia', desc: 'Certificado de garantia de 90 dias' },
    { id: 'personalizada', label: '5. Personalizada', desc: 'Adicionar mensagem livre do técnico' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-600 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-700/60 rounded-xl text-white">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight">Enviar OS no WhatsApp do Cliente</h2>
              <p className="text-emerald-100 text-xs mt-0.5">
                {os.id} · {os.device.brand} {os.device.model} ({os.client.name})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Destination phone check */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Número de Destino (WhatsApp)
              </span>
              <div className="flex items-center gap-2 mt-1">
                <Smartphone className="w-4 h-4 text-emerald-600 shrink-0" />
                <input
                  type="text"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  className="bg-white border border-slate-300 rounded px-2.5 py-1 text-sm font-mono font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="(11) 98765-4321"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowQr(!showQr)}
                className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                <QrCodeIcon className="w-3.5 h-3.5 text-slate-600" />
                {showQr ? 'Ocultar QR Code' : 'Ver QR Code'}
              </button>
              <button
                type="button"
                onClick={handleCopyLink}
                className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                {copiedLink ? 'Link Copiado!' : 'Copiar Link da OS'}
              </button>
            </div>
          </div>

          {/* QR Code Collapsible */}
          {showQr && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
              <div 
                className="w-32 h-32 bg-white p-2 rounded-lg border border-slate-300 shadow-xs shrink-0"
                dangerouslySetTransformedHtml-disabled
                dangerouslySetInnerHTML={{ __html: generateQRCodeSVG(trackingUrl, 128) }}
              />
              <div className="text-center sm:text-left">
                <h4 className="text-sm font-semibold text-slate-900">QR Code da Consulta Online</h4>
                <p className="text-xs text-slate-600 mt-1">
                  O cliente pode escanear agora mesmo na bancada com a câmera do celular para abrir a OS em tempo real.
                </p>
                <a
                  href={trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-800 font-medium mt-2"
                >
                  <ExternalLink className="w-3 h-3" />
                  Abrir link em nova aba
                </a>
              </div>
            </div>
          )}

          {/* Template Selection Tabs */}
          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-2">
              Escolha o Modelo de Mensagem:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setSelectedType(tpl.id)}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                    selectedType === tpl.id
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-semibold shadow-xs ring-1 ring-emerald-600'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="font-medium text-slate-900 truncate">{tpl.label}</div>
                  <div className="text-[11px] text-slate-600 font-normal line-clamp-1 mt-0.5">{tpl.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* If custom template, show text field */}
          {selectedType === 'personalizada' && (
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Recado Adicional do Técnico:
              </label>
              <textarea
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Ex: Seu aparelho já passou pelos testes finais e a bateria foi 100% carregada."
                rows={3}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          )}

          {/* Message Preview (WhatsApp chat styling) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Pré-visualização da Mensagem (WhatsApp)
              </span>
              <button
                type="button"
                onClick={handleCopyText}
                className="text-xs flex items-center gap-1 text-slate-600 hover:text-slate-900"
              >
                {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedText ? 'Texto Copiado!' : 'Copiar Texto'}</span>
              </button>
            </div>

            <div className="bg-[#e5ddd5] p-3.5 rounded-xl border border-slate-300/80 shadow-inner">
              <div className="bg-white rounded-lg p-3 text-xs text-slate-800 shadow-xs max-w-lg space-y-2 whitespace-pre-wrap font-sans leading-relaxed border-l-4 border-l-emerald-500">
                {currentMessage}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Fechar
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopyText}
              className="flex-1 sm:flex-initial px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
            >
              {copiedText ? 'Copiado!' : 'Copiar Texto'}
            </button>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-6 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer no-underline"
            >
              <Send className="w-4 h-4" />
              <span>Abrir no WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
