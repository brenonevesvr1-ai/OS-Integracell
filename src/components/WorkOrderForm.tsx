import React, { useState } from 'react';
import { 
  Save, 
  Send, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Smartphone, 
  User, 
  Wrench, 
  DollarSign, 
  ShieldCheck, 
  FileText,
  Lock,
  Grid
} from 'lucide-react';
import { 
  WorkOrder, 
  ShopSettings, 
  CheckStatus, 
  CHECKLIST_ITEMS, 
  COMMON_BRANDS, 
  COMMON_ACCESSORIES,
  ServiceItem,
  OSStatus,
  PasswordType
} from '../types/os';
import { DEFAULT_CHECKLIST } from '../utils/storage';
import { PatternLock } from './PatternLock';
import { SignaturePad } from './SignaturePad';

interface WorkOrderFormProps {
  initialData?: WorkOrder | null;
  onSave: (data: WorkOrder, sendWhatsAppImmediately: boolean) => void;
  onCancel: () => void;
  nextId: string;
  settings: ShopSettings;
}

export const WorkOrderForm: React.FC<WorkOrderFormProps> = ({
  initialData,
  onSave,
  onCancel,
  nextId,
  settings,
}) => {
  const isEditing = Boolean(initialData);

  // Form State
  const [status, setStatus] = useState<OSStatus>(initialData?.status || 'aberta');
  const [estimatedDelivery, setEstimatedDelivery] = useState(initialData?.estimatedDelivery || '');
  
  // Client
  const [clientName, setClientName] = useState(initialData?.client.name || '');
  const [clientPhone, setClientPhone] = useState(initialData?.client.phone || '');
  const [clientCpf, setClientCpf] = useState(initialData?.client.cpf || '');
  const [clientEmail, setClientEmail] = useState(initialData?.client.email || '');

  // Device
  const [brand, setBrand] = useState(initialData?.device.brand || 'Apple');
  const [model, setModel] = useState(initialData?.device.model || '');
  const [color, setColor] = useState(initialData?.device.color || '');
  const [imei, setImei] = useState(initialData?.device.imei || '');
  const [passwordType, setPasswordType] = useState<PasswordType>(initialData?.device.passwordType || 'none');
  const [passwordPin, setPasswordPin] = useState(initialData?.device.passwordPin || '');
  const [passwordPattern, setPasswordPattern] = useState<number[]>(initialData?.device.passwordPattern || []);
  const [accessories, setAccessories] = useState<string[]>(initialData?.device.accessories || []);

  // Checklist
  const [checklist, setChecklist] = useState(initialData?.checklist || { ...DEFAULT_CHECKLIST });

  // Issues & Diagnosis
  const [reportedIssue, setReportedIssue] = useState(initialData?.reportedIssue || '');
  const [technicalDiagnosis, setTechnicalDiagnosis] = useState(initialData?.technicalDiagnosis || '');

  // Services & Parts
  const [servicesAndParts, setServicesAndParts] = useState<ServiceItem[]>(
    initialData?.servicesAndParts && initialData.servicesAndParts.length > 0
      ? initialData.servicesAndParts
      : [{ id: 'item-1', description: 'Troca de tela / Manutenção', type: 'servico', quantity: 1, unitPrice: 0 }]
  );
  const [discount, setDiscount] = useState<number>(initialData?.discount || 0);
  const [paymentMethod, setPaymentMethod] = useState(initialData?.paymentMethod || 'a_combinar');
  const [warrantyDays, setWarrantyDays] = useState<number>(initialData?.warrantyDays ?? 90);
  const [technicianName, setTechnicianName] = useState(initialData?.technicianName || settings.technicianDefaultName);
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [clientSignature, setClientSignature] = useState<string | null>(initialData?.clientSignature || null);

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculation of Subtotal & Total
  const subtotal = servicesAndParts.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const total = Math.max(0, subtotal - discount);

  // Handlers for Checklist
  const handleChecklistChange = (key: keyof typeof checklist, value: CheckStatus) => {
    setChecklist(prev => ({ ...prev, [key]: value }));
  };

  const handleMarkAllChecklistOk = () => {
    const allOk: typeof checklist = { ...checklist };
    (Object.keys(allOk) as (keyof typeof checklist)[]).forEach(k => {
      allOk[k] = 'ok';
    });
    setChecklist(allOk);
  };

  // Handlers for Services & Parts
  const handleAddItem = (type: 'peca' | 'servico') => {
    const newItem: ServiceItem = {
      id: `item-${Date.now()}`,
      description: type === 'peca' ? 'Peça de reposição' : 'Mão de obra técnica',
      type,
      quantity: 1,
      unitPrice: 0
    };
    setServicesAndParts([...servicesAndParts, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setServicesAndParts(servicesAndParts.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof ServiceItem, value: any) => {
    setServicesAndParts(servicesAndParts.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  // Toggle Accessory
  const toggleAccessory = (acc: string) => {
    if (accessories.includes(acc)) {
      setAccessories(accessories.filter(a => a !== acc));
    } else {
      setAccessories([...accessories, acc]);
    }
  };

  // Phone auto mask
  const handlePhoneChange = (val: string) => {
    const digits = val.replace(/\D/g, '');
    let formatted = digits;
    if (digits.length <= 10) {
      // (XX) XXXX-XXXX
      formatted = digits.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
      // (XX) XXXXX-XXXX
      formatted = digits.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
    setClientPhone(formatted);
  };

  const handleSubmit = (sendWhatsAppImmediately: boolean) => {
    const newErrors: Record<string, string> = {};
    if (!clientName.trim()) newErrors.clientName = 'Nome do cliente é obrigatório';
    if (!clientPhone.trim()) newErrors.clientPhone = 'WhatsApp / Telefone é obrigatório';
    if (!model.trim()) newErrors.model = 'Modelo do aparelho é obrigatório';
    if (!reportedIssue.trim()) newErrors.reportedIssue = 'Defeito reclamado é obrigatório';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    const orderData: WorkOrder = {
      id: initialData?.id || nextId,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDelivery: estimatedDelivery || undefined,
      status,
      client: {
        name: clientName.trim(),
        phone: clientPhone.trim(),
        cpf: clientCpf.trim() || undefined,
        email: clientEmail.trim() || undefined,
      },
      device: {
        brand,
        model: model.trim(),
        color: color.trim() || 'Padrão',
        imei: imei.trim() || undefined,
        passwordType,
        passwordPin: passwordType === 'pin' ? passwordPin : undefined,
        passwordPattern: passwordType === 'pattern' ? passwordPattern : undefined,
        accessories,
      },
      checklist,
      reportedIssue: reportedIssue.trim(),
      technicalDiagnosis: technicalDiagnosis.trim() || undefined,
      servicesAndParts: servicesAndParts.filter(s => s.description.trim() !== ''),
      discount: Number(discount) || 0,
      total,
      paymentMethod: paymentMethod as any,
      warrantyDays: Number(warrantyDays) || 90,
      technicianName: technicianName.trim(),
      clientSignature: clientSignature || undefined,
      notes: notes.trim() || undefined,
    };

    onSave(orderData, sendWhatsAppImmediately);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Top Banner / Form Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold bg-slate-900 text-white px-2.5 py-1 rounded-md">
              {initialData?.id || nextId}
            </span>
            <h1 className="text-xl font-bold text-slate-900">
              {isEditing ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Preencha os dados de entrada, teste os itens do aparelho e gere a OS online com link direto para o WhatsApp.
          </p>
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600 uppercase">Status:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as OSStatus)}
            className="text-xs font-medium bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="aberta">Em Análise (Aberta)</option>
            <option value="aguardando_aprovacao">Aguardando Aprovação</option>
            <option value="aprovada">Aprovada pelo Cliente</option>
            <option value="aguardando_peca">Aguardando Peça</option>
            <option value="em_manutencao">Em Manutenção</option>
            <option value="pronta">Pronta para Retirada</option>
            <option value="finalizada">Finalizada e Entregue</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
      </div>

      {/* Grid: Client & Device */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Client Data */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-900 font-semibold text-sm">
            <User className="w-4 h-4 text-emerald-600" />
            <span>Dados do Cliente</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">
                Nome Completo *
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ex: João da Silva"
                className={`w-full text-xs p-2.5 rounded-lg border ${
                  errors.clientName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                } focus:ring-2 focus:ring-emerald-500 focus:outline-none`}
              />
              {errors.clientName && (
                <span className="text-[11px] text-rose-600 mt-1 block">{errors.clientName}</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  WhatsApp / Celular *
                </label>
                <input
                  type="text"
                  value={clientPhone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="(11) 98765-4321"
                  className={`w-full text-xs p-2.5 rounded-lg border font-mono ${
                    errors.clientPhone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                  } focus:ring-2 focus:ring-emerald-500 focus:outline-none`}
                />
                {errors.clientPhone && (
                  <span className="text-[11px] text-rose-600 mt-1 block">{errors.clientPhone}</span>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  CPF (Opcional)
                </label>
                <input
                  type="text"
                  value={clientCpf}
                  onChange={(e) => setClientCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">
                E-mail (Opcional)
              </label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="cliente@email.com"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Device Data */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-900 font-semibold text-sm">
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>Dados do Aparelho</span>
          </div>

          <div className="space-y-3">
            {/* Quick Brand selection */}
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">Marca</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {COMMON_BRANDS.map(b => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBrand(b)}
                    className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition-colors ${
                      brand === b
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Modelo *</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Ex: iPhone 13 Pro 128GB"
                  className={`w-full text-xs p-2.5 rounded-lg border ${
                    errors.model ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                  } focus:ring-2 focus:ring-emerald-500 focus:outline-none`}
                />
                {errors.model && (
                  <span className="text-[11px] text-rose-600 mt-1 block">{errors.model}</span>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Cor</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="Ex: Azul Meia-noite"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">
                IMEI / Número de Série (Opcional)
              </label>
              <input
                type="text"
                value={imei}
                onChange={(e) => setImei(e.target.value)}
                placeholder="Disque *#06# no celular para ver o IMEI"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Screen Unlock & Accessories Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Unlock password / Pattern */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Senha de Desbloqueio</span>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setPasswordType('none')}
                className={`px-2 py-1 rounded font-medium ${
                  passwordType === 'none' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Sem Senha
              </button>
              <button
                type="button"
                onClick={() => setPasswordType('pin')}
                className={`px-2 py-1 rounded font-medium ${
                  passwordType === 'pin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                PIN / Numérica
              </button>
              <button
                type="button"
                onClick={() => setPasswordType('pattern')}
                className={`px-2 py-1 rounded font-medium ${
                  passwordType === 'pattern' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Desenho / Padrão
              </button>
            </div>
          </div>

          {passwordType === 'pin' && (
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">
                Senha ou PIN do Aparelho
              </label>
              <input
                type="text"
                value={passwordPin}
                onChange={(e) => setPasswordPin(e.target.value)}
                placeholder="Ex: 1234 ou senha alfa"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-mono tracking-widest focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-600 mt-1 block">
                Necessária para testar câmeras, áudio e touch antes da entrega.
              </span>
            </div>
          )}

          {passwordType === 'pattern' && (
            <div className="pt-1">
              <PatternLock
                value={passwordPattern}
                onChange={(newSeq) => setPasswordPattern(newSeq)}
              />
            </div>
          )}

          {passwordType === 'none' && (
            <div className="text-xs text-slate-600 italic py-4 text-center">
              Aparelho sem senha ou cliente optou por não fornecer senha no check-in.
            </div>
          )}
        </div>

        {/* Accessories */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-900 font-semibold text-sm">
            <Grid className="w-4 h-4 text-emerald-600" />
            <span>Acessórios Deixados pelo Cliente</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {COMMON_ACCESSORIES.map(acc => {
              const isChecked = accessories.includes(acc);
              return (
                <button
                  key={acc}
                  type="button"
                  onClick={() => toggleAccessory(acc)}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                    isChecked
                      ? 'border-emerald-500 bg-emerald-50/60 text-emerald-950 font-medium'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{acc}</span>
                  {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="pt-2">
            <label className="text-xs font-medium text-slate-700 block mb-1">Previsão de Entrega</label>
            <input
              type="date"
              value={estimatedDelivery}
              onChange={(e) => setEstimatedDelivery(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Technical Checklist */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
              <Wrench className="w-4 h-4 text-emerald-600" />
              <span>Checklist de Inspeção e Testes (Check-in)</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Proteja sua assistência registrando o estado de cada componente antes de abrir o aparelho.
            </p>
          </div>

          <button
            type="button"
            onClick={handleMarkAllChecklistOk}
            className="self-start sm:self-auto text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
          >
            Marcar Todos como OK
          </button>
        </div>

        {/* Checklist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CHECKLIST_ITEMS.map((item) => {
            const currentStatus = checklist[item.key];
            return (
              <div
                key={item.key}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between gap-2"
              >
                <span className="text-xs font-medium text-slate-800 leading-tight">
                  {item.label}
                </span>

                <div className="grid grid-cols-3 gap-1">
                  <button
                    type="button"
                    onClick={() => handleChecklistChange(item.key, 'ok')}
                    className={`py-1 text-[11px] rounded font-semibold transition-colors flex items-center justify-center gap-0.5 ${
                      currentStatus === 'ok'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    OK
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChecklistChange(item.key, 'defeito')}
                    className={`py-1 text-[11px] rounded font-semibold transition-colors flex items-center justify-center gap-0.5 ${
                      currentStatus === 'defeito'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Defeito
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChecklistChange(item.key, 'nao_testado')}
                    className={`py-1 text-[10px] rounded font-medium transition-colors flex items-center justify-center ${
                      currentStatus === 'nao_testado'
                        ? 'bg-slate-700 text-white'
                        : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    N/T
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 4: Issue & Diagnosis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-900 font-semibold text-sm">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Defeito Reclamado pelo Cliente *</span>
          </div>
          <textarea
            value={reportedIssue}
            onChange={(e) => setReportedIssue(e.target.value)}
            placeholder="Ex: Aparelho caiu na piscina, não liga mais e esquenta ao conectar no carregador."
            rows={4}
            className={`w-full text-xs p-3 rounded-lg border ${
              errors.reportedIssue ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
            } focus:ring-2 focus:ring-emerald-500 focus:outline-none`}
          />
          {errors.reportedIssue && (
            <span className="text-[11px] text-rose-600 block">{errors.reportedIssue}</span>
          )}
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-900 font-semibold text-sm">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Diagnóstico Técnico / Laudo</span>
          </div>
          <textarea
            value={technicalDiagnosis}
            onChange={(e) => setTechnicalDiagnosis(e.target.value)}
            placeholder="Ex: Curto-circuito na linha secundária de alimentação VDD_MAIN. Necessário reballing do CI de carga."
            rows={4}
            className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Section 5: Services & Parts Table */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Serviços e Peças (Orçamento)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleAddItem('peca')}
              className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-medium transition-colors flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Adicionar Peça</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddItem('servico')}
              className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-medium transition-colors flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Adicionar Mão de Obra</span>
            </button>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-2">
          {servicesAndParts.map((item, idx) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50/50"
            >
              <select
                value={item.type}
                onChange={(e) => handleItemChange(item.id, 'type', e.target.value)}
                className="text-xs font-medium bg-white border border-slate-300 rounded px-2 py-1.5 text-slate-700"
              >
                <option value="servico">Serviço / Mão de Obra</option>
                <option value="peca">Peça de Reposição</option>
              </select>

              <input
                type="text"
                value={item.description}
                onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                placeholder="Descrição do serviço ou peça..."
                className="flex-1 text-xs p-2 bg-white border border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />

              <div className="flex items-center gap-2">
                <div className="w-20">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(item.id, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded font-mono text-center"
                    title="Quantidade"
                  />
                </div>

                <div className="w-28 relative">
                  <span className="absolute left-2.5 top-2 text-xs text-slate-400 font-mono">R$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice || ''}
                    onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                    placeholder="0,00"
                    className="w-full text-xs p-2 pl-7 bg-white border border-slate-300 rounded font-mono text-right"
                  />
                </div>

                <span className="w-24 text-xs font-mono font-semibold text-slate-800 text-right tabular-nums">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.quantity * item.unitPrice)}
                </span>

                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={servicesAndParts.length <= 1}
                  className="p-1.5 text-slate-400 hover:text-rose-600 disabled:opacity-30 disabled:pointer-events-none"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Totals & Financial Row */}
        <div className="pt-4 border-t border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Forma de Pagamento</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5"
              >
                <option value="a_combinar">A Combinar</option>
                <option value="pix">PIX</option>
                <option value="cartao_credito">Cartão de Crédito</option>
                <option value="cartao_debito">Cartão de Débito</option>
                <option value="dinheiro">Dinheiro em Espécie</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Garantia (Dias)</label>
              <input
                type="number"
                min="0"
                value={warrantyDays}
                onChange={(e) => setWarrantyDays(parseInt(e.target.value) || 0)}
                className="w-24 text-xs p-1.5 bg-white border border-slate-300 rounded-lg font-mono text-center"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Desconto (R$)</label>
              <input
                type="number"
                min="0"
                value={discount || ''}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                placeholder="0,00"
                className="w-24 text-xs p-1.5 bg-white border border-slate-300 rounded-lg font-mono text-right"
              />
            </div>
          </div>

          <div className="bg-slate-900 text-white px-5 py-3 rounded-xl flex items-center gap-4 self-stretch md:self-auto justify-between md:justify-end">
            <span className="text-xs text-slate-300 font-medium">Valor Total da OS:</span>
            <span className="text-xl font-bold font-mono tabular-nums text-emerald-400">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
            </span>
          </div>
        </div>
      </div>

      {/* Section 6: Signatures & Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <SignaturePad
            value={clientSignature}
            onChange={(val) => setClientSignature(val)}
            label="Assinatura Digital do Cliente (Check-in)"
          />
          <p className="text-[11px] text-slate-500">
            O cliente concorda com as condições de entrada e defeitos informados.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
            Observações Internas / Técnico
          </label>
          <div className="space-y-2">
            <input
              type="text"
              value={technicianName}
              onChange={(e) => setTechnicianName(e.target.value)}
              placeholder="Nome do Técnico Responsável"
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
            />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anotações internas da bancada (não aparecem para o cliente)..."
              rows={3}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Floating / Sticky Footer Actions */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-300 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
        >
          Cancelar
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            className="flex-1 sm:flex-initial px-5 py-2.5 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4 text-slate-600" />
            <span>Salvar OS</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(true)}
            className="flex-1 sm:flex-initial px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 active:scale-95 rounded-xl transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Salvar e Enviar no WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
