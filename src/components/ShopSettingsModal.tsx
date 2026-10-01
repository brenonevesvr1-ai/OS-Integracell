import React, { useState } from 'react';
import { X, Save, Building, Phone, MapPin, Key, Shield, Download, Upload } from 'lucide-react';
import { ShopSettings, WorkOrder } from '../types/os';

interface ShopSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ShopSettings;
  onSaveSettings: (settings: ShopSettings) => void;
  orders: WorkOrder[];
  onImportOrders: (orders: WorkOrder[]) => void;
}

export const ShopSettingsModal: React.FC<ShopSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  orders,
  onImportOrders,
}) => {
  const [formData, setFormData] = useState<ShopSettings>({ ...settings });
  const [importStatus, setImportStatus] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    onClose();
  };

  const handleExportBackup = () => {
    const backupData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      settings: formData,
      orders,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_os_assistencia_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (Array.isArray(data.orders)) {
          onImportOrders(data.orders);
          if (data.settings) {
            setFormData(data.settings);
            onSaveSettings(data.settings);
          }
          setImportStatus(`${data.orders.length} ordens de serviço importadas com sucesso!`);
          setTimeout(() => setImportStatus(''), 4000);
        } else {
          setImportStatus('Arquivo de backup inválido.');
        }
      } catch {
        setImportStatus('Erro ao ler arquivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div 
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
      >
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <Building className="w-5 h-5 text-orange-400" />
            <h2 className="font-bold text-base">Configurações da Assistência Técnica</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Nome da Assistência Técnica / Loja *
            </label>
            <input
              type="text"
              required
              value={formData.shopName}
              onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                WhatsApp de Atendimento *
              </label>
              <input
                type="text"
                required
                value={formData.shopWhatsapp}
                onChange={(e) => setFormData({ ...formData, shopWhatsapp: e.target.value })}
                placeholder="(11) 98765-4321"
                className="w-full p-2.5 rounded-lg border border-slate-300 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                CNPJ ou CPF da Loja
              </label>
              <input
                type="text"
                value={formData.shopCnpj}
                onChange={(e) => setFormData({ ...formData, shopCnpj: e.target.value })}
                placeholder="00.000.000/0001-00"
                className="w-full p-2.5 rounded-lg border border-slate-300 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Endereço Completo (para retirada do aparelho)
            </label>
            <input
              type="text"
              value={formData.shopAddress}
              onChange={(e) => setFormData({ ...formData, shopAddress: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Chave PIX da Loja
              </label>
              <input
                type="text"
                value={formData.shopPixKey}
                onChange={(e) => setFormData({ ...formData, shopPixKey: e.target.value })}
                placeholder="E-mail, CNPJ, Celular ou Aleatória"
                className="w-full p-2.5 rounded-lg border border-slate-300 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Técnico Padrão
              </label>
              <input
                type="text"
                value={formData.technicianDefaultName}
                onChange={(e) => setFormData({ ...formData, technicianDefaultName: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Termos de Garantia (Exibidos na OS impressa e online)
            </label>
            <textarea
              rows={4}
              value={formData.warrantyTerms}
              onChange={(e) => setFormData({ ...formData, warrantyTerms: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-[11px]"
            />
          </div>

          {/* Backup / Export / Import */}
          <div className="pt-3 border-t border-slate-200">
            <span className="font-bold text-slate-700 block mb-2">
              Backup e Exportação de Dados
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleExportBackup}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg flex items-center gap-1.5 font-medium transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar Backup ({orders.length} OS)</span>
              </button>

              <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg flex items-center gap-1.5 font-medium transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Importar Backup</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>
            </div>
            {importStatus && (
              <p className="text-[11px] text-emerald-700 font-semibold mt-1.5">
                {importStatus}
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 active:scale-95 text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-md shadow-orange-500/25 cursor-pointer transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Configurações</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
