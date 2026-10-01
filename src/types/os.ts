export type OSStatus = 
  | 'aberta'               // Aberta / Em Análise
  | 'aguardando_aprovacao' // Orçamento Pronto - Aguardando Cliente
  | 'aprovada'             // Orçamento Aprovado
  | 'aguardando_peca'      // Aguardando Peça
  | 'em_manutencao'        // Em Bancada / Manutenção
  | 'pronta'               // Pronta para Retirada
  | 'finalizada'           // Entregue e Finalizada
  | 'cancelada';           // Cancelada / Não Aprovada

export interface ClientData {
  name: string;
  phone: string; // WhatsApp: (11) 98765-4321
  cpf?: string;
  email?: string;
}

export type PasswordType = 'pin' | 'pattern' | 'none';

export interface DeviceData {
  brand: string;
  model: string;
  color: string;
  imei?: string;
  passwordType: PasswordType;
  passwordPin?: string;
  passwordPattern?: number[]; // Sequence of node indices (0 to 8)
  accessories: string[];
}

export type CheckStatus = 'ok' | 'defeito' | 'nao_testado';

export interface ChecklistData {
  liga: CheckStatus;
  tela: CheckStatus;
  touch: CheckStatus;
  conector: CheckStatus;
  bateria: CheckStatus;
  cameraFrontal: CheckStatus;
  cameraTraseira: CheckStatus;
  altoFalante: CheckStatus;
  auricular: CheckStatus;
  microfone: CheckStatus;
  botoes: CheckStatus;
  wifi: CheckStatus;
  rede: CheckStatus;
  biometria: CheckStatus;
  carcaca: CheckStatus;
  molhado: CheckStatus;
}

export interface ServiceItem {
  id: string;
  description: string;
  type: 'peca' | 'servico';
  quantity: number;
  unitPrice: number;
}

export interface WorkOrder {
  id: string; // e.g. OS-2026-001
  createdAt: string; // ISO date
  updatedAt: string;
  estimatedDelivery?: string;
  status: OSStatus;
  client: ClientData;
  device: DeviceData;
  checklist: ChecklistData;
  reportedIssue: string; // Defeito reclamado
  technicalDiagnosis?: string; // Laudo / Diagnóstico
  servicesAndParts: ServiceItem[];
  discount: number;
  total: number;
  paymentMethod?: 'dinheiro' | 'pix' | 'cartao_credito' | 'cartao_debito' | 'a_combinar';
  warrantyDays: number; // Padrão 90 dias
  technicianName: string;
  clientSignature?: string | null; // Data URL PNG
  notes?: string;
}

export interface ShopSettings {
  shopName: string;
  shopPhone: string;
  shopWhatsapp: string;
  shopCnpj: string;
  shopAddress: string;
  shopPixKey: string;
  technicianDefaultName: string;
  warrantyTerms: string;
}

export const STATUS_CONFIG: Record<OSStatus, { label: string; color: string; bg: string; border: string; desc: string }> = {
  aberta: {
    label: 'Em Análise',
    color: 'text-amber-800',
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    desc: 'Aparelho recebido na assistência, em processo de avaliação técnica.'
  },
  aguardando_aprovacao: {
    label: 'Aguardando Aprovação',
    color: 'text-blue-800',
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    desc: 'Orçamento concluído. Aguardando a aprovação do cliente para iniciar o serviço.'
  },
  aprovada: {
    label: 'Aprovada',
    color: 'text-indigo-800',
    bg: 'bg-indigo-50',
    border: 'border-indigo-300',
    desc: 'Orçamento aprovado pelo cliente. Serviço pronto para iniciar.'
  },
  aguardando_peca: {
    label: 'Aguardando Peça',
    color: 'text-purple-800',
    bg: 'bg-purple-50',
    border: 'border-purple-300',
    desc: 'Aguardando chegada das peças de reposição necessárias.'
  },
  em_manutencao: {
    label: 'Em Manutenção',
    color: 'text-sky-800',
    bg: 'bg-sky-50',
    border: 'border-sky-300',
    desc: 'Aparelho na bancada com o técnico sendo consertado.'
  },
  pronta: {
    label: 'Pronta para Retirada',
    color: 'text-emerald-800',
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    desc: 'Conserto finalizado com sucesso! O aparelho já pode ser retirado na loja.'
  },
  finalizada: {
    label: 'Entregue / Concluída',
    color: 'text-slate-800',
    bg: 'bg-slate-100',
    border: 'border-slate-300',
    desc: 'Aparelho entregue ao cliente com garantia ativada.'
  },
  cancelada: {
    label: 'Cancelada',
    color: 'text-rose-800',
    bg: 'bg-rose-50',
    border: 'border-rose-300',
    desc: 'Orçamento recusado ou serviço cancelado.'
  }
};

export const CHECKLIST_ITEMS: { key: keyof ChecklistData; label: string; iconName?: string }[] = [
  { key: 'liga', label: 'Liga / Dá Imagem' },
  { key: 'tela', label: 'Display (Manchas/Listras)' },
  { key: 'touch', label: 'Touch Screen' },
  { key: 'conector', label: 'Conector de Carga' },
  { key: 'bateria', label: 'Bateria (Carrega/Saúde)' },
  { key: 'cameraFrontal', label: 'Câmera Frontal' },
  { key: 'cameraTraseira', label: 'Câmera Traseira' },
  { key: 'altoFalante', label: 'Alto-Falante Principal' },
  { key: 'auricular', label: 'Auricular (Chamadas)' },
  { key: 'microfone', label: 'Microfone' },
  { key: 'botoes', label: 'Botões (Power/Volume)' },
  { key: 'wifi', label: 'Wi-Fi / Bluetooth' },
  { key: 'rede', label: 'Sinal de Operadora/SIM' },
  { key: 'biometria', label: 'Face ID / Biometria' },
  { key: 'carcaca', label: 'Carcaça / Tampa Traseira' },
  { key: 'molhado', label: 'Sem Oxidação / Seco' },
];

export const COMMON_BRANDS = [
  'Apple',
  'Samsung',
  'Motorola',
  'Xiaomi',
  'Realme',
  'Asus',
  'LG',
  'Huawei',
  'Poco',
  'Infinix',
  'Outro'
];

export const COMMON_ACCESSORIES = [
  'Capa de Proteção',
  'Película de Vidro',
  'Chip SIM',
  'Cartão MicroSD',
  'Carregador / Cabo',
  'Gaveta de Chip'
];
