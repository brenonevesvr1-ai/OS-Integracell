import React, { useRef, useState } from 'react';
import { Printer, ArrowLeft, Download, Check, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { WorkOrder, ShopSettings, STATUS_CONFIG, CHECKLIST_ITEMS } from '../types/os';
import { getOnlineTrackingUrl } from '../utils/whatsapp';
import { generateQRCodeSVG } from '../utils/qrCode';
import { PatternLock } from './PatternLock';
import { IntegracellLogo } from './IntegracellLogo';

interface WorkOrderPrintProps {
  os: WorkOrder;
  settings: ShopSettings;
  onBack: () => void;
}

export const WorkOrderPrint: React.FC<WorkOrderPrintProps> = ({
  os,
  settings,
  onBack,
}) => {
  const onlineUrl = getOnlineTrackingUrl(os);
  const statusCfg = STATUS_CONFIG[os.status];
  const printSheetRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handlePrintOrPdf = async () => {
    // 1. Try browser window.print() first in case environment allows it
    try {
      window.print();
    } catch (err) {
      console.warn('Native window.print blocked by iframe sandbox, downloading PDF file', err);
    }

    // 2. Generate and download high-resolution PDF file using html2canvas & jsPDF
    if (!printSheetRef.current) return;

    try {
      setIsGeneratingPdf(true);
      const element = printSheetRef.current;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`OS-${os.id}-Integracell.pdf`);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback: download standalone printable HTML file
      if (printSheetRef.current) {
        const content = printSheetRef.current.innerHTML;
        const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>OS ${os.id} - ${settings.shopName}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; margin: 20px; color: #0f172a; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  ${content}
</body>
</html>`;
        const blob = new Blob([fullHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `OS-${os.id}-Integracell.html`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8">
      {/* Top action controls (hidden on print) */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between no-print">
        <button
          type="button"
          onClick={onBack}
          className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>

        <button
          type="button"
          onClick={handlePrintOrPdf}
          disabled={isGeneratingPdf}
          className={`px-5 py-2.5 text-xs font-bold text-white rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95 ${
            downloadSuccess
              ? 'bg-emerald-600 shadow-emerald-600/25'
              : 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-orange-500/25'
          } ${isGeneratingPdf ? 'opacity-85 cursor-wait' : ''}`}
        >
          {isGeneratingPdf ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : downloadSuccess ? (
            <Check className="w-4 h-4" />
          ) : (
            <Printer className="w-4 h-4" />
          )}
          <span>
            {isGeneratingPdf
              ? 'Gerando PDF Oficial...'
              : downloadSuccess
              ? 'PDF Baixado com Sucesso!'
              : 'Imprimir / Salvar PDF'}
          </span>
        </button>
      </div>

      {/* Printable Sheet (A4 / Thermal style printable page) */}
      <div
        ref={printSheetRef}
        className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-slate-300 print:border-none print:shadow-none print:p-0 text-slate-900 text-xs font-sans print-break-inside-avoid"
      >
        {/* Header Loja */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
          <div className="flex items-center gap-4">
            <IntegracellLogo variant="badge-full" size={68} />
            <div className="space-y-0.5">
              <h1 className="text-2xl font-black italic tracking-tight text-slate-900 leading-tight">
                Íntegra<span className="text-orange-500">cell</span>
              </h1>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-800 block">
                Reparo de Celular · Assistência Técnica Especializada
              </span>
              <p className="text-[11px] text-slate-600 pt-0.5">
                CNPJ: {settings.shopCnpj} · Tel/WhatsApp: {settings.shopPhone}
              </p>
              <p className="text-[11px] text-slate-600">
                {settings.shopAddress}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="font-mono text-xl font-black bg-slate-900 text-white px-3 py-1 rounded inline-block">
              {os.id}
            </div>
            <div className="text-[11px] font-bold text-slate-700 uppercase mt-1">
              Status: {statusCfg.label}
            </div>
            <div className="text-[10px] text-slate-500">
              Emissão: {new Date(os.createdAt).toLocaleDateString('pt-BR')} às {new Date(os.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        {/* Section: Cliente & Aparelho */}
        <div className="grid grid-cols-2 gap-4 py-3 border-b border-slate-200">
          <div>
            <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500 block mb-1">
              Dados do Cliente
            </span>
            <p><strong>Nome:</strong> {os.client.name}</p>
            <p><strong>WhatsApp:</strong> {os.client.phone}</p>
            {os.client.cpf && <p><strong>CPF:</strong> {os.client.cpf}</p>}
            {os.client.email && <p><strong>E-mail:</strong> {os.client.email}</p>}
          </div>

          <div>
            <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500 block mb-1">
              Dados do Aparelho
            </span>
            <p><strong>Marca / Modelo:</strong> {os.device.brand} {os.device.model}</p>
            <p><strong>Cor:</strong> {os.device.color}</p>
            {os.device.imei && <p><strong>IMEI / Serial:</strong> {os.device.imei}</p>}
            <p>
              <strong>Acessórios:</strong> {os.device.accessories.length > 0 ? os.device.accessories.join(', ') : 'Nenhum'}
            </p>
            {os.device.passwordType === 'pin' && (
              <p><strong>Senha / PIN:</strong> <span className="font-mono">{os.device.passwordPin}</span></p>
            )}
          </div>
        </div>

        {/* Unlock pattern if present */}
        {os.device.passwordType === 'pattern' && (
          <div className="py-2 border-b border-slate-200 flex items-center justify-between">
            <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500">
              Padrão de Desbloqueio:
            </span>
            <div className="flex items-center gap-3">
              <PatternLock value={os.device.passwordPattern} readOnly size={80} />
              <span className="text-[10px] text-slate-600 font-mono">
                {os.device.passwordPattern?.map(n => n + 1).join(' → ')}
              </span>
            </div>
          </div>
        )}

        {/* Defeito e Diagnóstico */}
        <div className="py-3 border-b border-slate-200 space-y-2">
          <div>
            <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500 block">
              Defeito Reclamado pelo Cliente:
            </span>
            <p className="bg-slate-50 p-2 rounded border border-slate-200 text-slate-800 mt-1">
              {os.reportedIssue}
            </p>
          </div>

          {os.technicalDiagnosis && (
            <div>
              <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500 block">
                Laudo Técnico / Diagnóstico:
              </span>
              <p className="bg-slate-50 p-2 rounded border border-slate-200 text-slate-800 mt-1">
                {os.technicalDiagnosis}
              </p>
            </div>
          )}
        </div>

        {/* Checklist */}
        <div className="py-3 border-b border-slate-200">
          <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500 block mb-1.5">
            Checklist de Entrada (Inspeção Técnica)
          </span>
          <div className="grid grid-cols-4 gap-1.5 text-[10px]">
            {CHECKLIST_ITEMS.map((item) => {
              const val = os.checklist[item.key];
              return (
                <div key={item.key} className="flex items-center justify-between border border-slate-200 px-1.5 py-0.5 rounded bg-slate-50">
                  <span className="truncate">{item.label}:</span>
                  <span className={`font-bold ${val === 'ok' ? 'text-emerald-700' : val === 'defeito' ? 'text-rose-700' : 'text-slate-500'}`}>
                    {val === 'ok' ? 'OK' : val === 'defeito' ? 'DEF' : 'N/T'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Peças e Serviços */}
        <div className="py-3 border-b border-slate-200">
          <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500 block mb-1">
            Peças e Serviços / Orçamento
          </span>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-300 text-[10px] text-slate-500">
                <th className="py-1">Tipo</th>
                <th className="py-1">Descrição</th>
                <th className="py-1 text-center">Qtd</th>
                <th className="py-1 text-right">Unitário</th>
                <th className="py-1 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {os.servicesAndParts.map((item, idx) => (
                <tr key={idx} className="border-b border-slate-100 text-[11px]">
                  <td className="py-1 uppercase text-slate-500 text-[10px]">{item.type}</td>
                  <td className="py-1 font-medium">{item.description}</td>
                  <td className="py-1 text-center">{item.quantity}</td>
                  <td className="py-1 text-right font-mono">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unitPrice)}
                  </td>
                  <td className="py-1 text-right font-mono font-semibold">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unitPrice * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end gap-6 pt-2 font-mono">
            {os.discount > 0 && <span>Desconto: -R$ {os.discount.toFixed(2)}</span>}
            <span className="font-bold text-sm">
              TOTAL: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(os.total)}
            </span>
          </div>
        </div>

        {/* Termos de Garantia & QR Code */}
        <div className="py-3 border-b border-slate-200 flex items-start gap-4">
          <div className="flex-1 space-y-1">
            <span className="font-bold uppercase tracking-wider text-[10px] text-slate-700 block">
              Termos de Garantia ({os.warrantyDays} dias pelo CDC)
            </span>
            <p className="text-[9px] text-slate-600 leading-tight whitespace-pre-line">
              {settings.warrantyTerms}
            </p>
          </div>

          <div className="text-center shrink-0 w-28 flex flex-col items-center">
            <div 
              className="w-20 h-20 bg-white border border-slate-300 p-1 rounded"
              dangerouslySetInnerHTML={{ __html: generateQRCodeSVG(onlineUrl, 72) }}
            />
            <span className="text-[9px] text-slate-600 font-bold mt-1 block">
              Consulte Online
            </span>
          </div>
        </div>

        {/* Assinaturas */}
        <div className="pt-6 grid grid-cols-2 gap-8 text-center">
          <div>
            {os.clientSignature ? (
              <img
                src={os.clientSignature}
                alt="Assinatura Cliente"
                className="h-10 mx-auto object-contain mb-1"
              />
            ) : (
              <div className="h-10" />
            )}
            <div className="border-t border-slate-400 pt-1 text-[11px] font-medium text-slate-700">
              {os.client.name} (Cliente)
            </div>
          </div>

          <div>
            <div className="h-10" />
            <div className="border-t border-slate-400 pt-1 text-[11px] font-medium text-slate-700">
              {os.technicianName || settings.shopName} (Técnico Responsável)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
