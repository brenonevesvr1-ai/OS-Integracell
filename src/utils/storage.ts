import { WorkOrder, ShopSettings, ChecklistData } from '../types/os';

const STORAGE_KEY_OS = 'os_celular_orders_v1';
const STORAGE_KEY_SETTINGS = 'os_celular_settings_v1';

export const DEFAULT_CHECKLIST: ChecklistData = {
  liga: 'ok',
  tela: 'ok',
  touch: 'ok',
  conector: 'ok',
  bateria: 'ok',
  cameraFrontal: 'ok',
  cameraTraseira: 'ok',
  altoFalante: 'ok',
  auricular: 'ok',
  microfone: 'ok',
  botoes: 'ok',
  wifi: 'ok',
  rede: 'ok',
  biometria: 'ok',
  carcaca: 'ok',
  molhado: 'ok',
};

export const DEFAULT_SETTINGS: ShopSettings = {
  shopName: 'Íntegracell Reparo de Celular',
  shopPhone: '(11) 98765-4321',
  shopWhatsapp: '11987654321',
  shopCnpj: '48.912.345/0001-80',
  shopAddress: 'Av. Principal, 1000 - Centro',
  shopPixKey: 'pix@integracell.com.br',
  technicianDefaultName: 'Carlos (Técnico Responsável)',
  warrantyTerms: 
    '1. A garantia é válida por 90 (noventa) dias a contar da data de retirada do aparelho, cobrindo estritamente os serviços executados e peças substituídas descritos nesta Ordem de Serviço, nos termos do art. 26 do Código de Defesa do Consumidor.\n' +
    '2. A garantia perderá total validade em casos de: queda física, quebra da tela, amassamento da carcaça, violação do lacre interno, tentativa de conserto por terceiros ou contato com líquidos/umidade.\n' +
    '3. Aparelhos não retirados em até 90 dias após notificação de conclusão poderão ser cobrados com taxa diária de armazenamento ou considerados abandonados na forma da lei civil.'
};

export const INITIAL_ORDERS: WorkOrder[] = [
  {
    id: 'OS-2026-001',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    estimatedDelivery: new Date(Date.now() + 3600000 * 24).toISOString().split('T')[0],
    status: 'pronta',
    client: {
      name: 'Mariana Silveira',
      phone: '(11) 98123-4567',
      cpf: '321.654.987-00',
      email: 'mariana.silveira@email.com'
    },
    device: {
      brand: 'Apple',
      model: 'iPhone 13 Pro 128GB',
      color: 'Grafite',
      imei: '354892019283741',
      passwordType: 'pin',
      passwordPin: '142536',
      accessories: ['Capa de Proteção', 'Película de Vidro (Quebrada)']
    },
    checklist: {
      liga: 'ok',
      tela: 'defeito',
      touch: 'defeito',
      conector: 'ok',
      bateria: 'ok',
      cameraFrontal: 'ok',
      cameraTraseira: 'ok',
      altoFalante: 'ok',
      auricular: 'ok',
      microfone: 'ok',
      botoes: 'ok',
      wifi: 'ok',
      rede: 'ok',
      biometria: 'ok',
      carcaca: 'ok',
      molhado: 'ok'
    },
    reportedIssue: 'Aparelho sofreu queda. Tela trincou e o touch parou de responder na parte superior.',
    technicalDiagnosis: 'Necessária troca do módulo display frontal OLED Premium + limpeza interna dos conectores.',
    servicesAndParts: [
      { id: '1', description: 'Tela Display OLED iPhone 13 Pro Primeira Linha', type: 'peca', quantity: 1, unitPrice: 750 },
      { id: '2', description: 'Mão de obra especializada + Limpeza ultrasônica', type: 'servico', quantity: 1, unitPrice: 150 }
    ],
    discount: 50,
    total: 850,
    paymentMethod: 'pix',
    warrantyDays: 90,
    technicianName: 'Carlos Eduardo',
    notes: 'Cliente solicitou urgência para retirada no período da tarde.'
  },
  {
    id: 'OS-2026-002',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    estimatedDelivery: new Date(Date.now() + 3600000 * 48).toISOString().split('T')[0],
    status: 'aguardando_aprovacao',
    client: {
      name: 'Rodrigo Barbosa',
      phone: '(11) 99456-7890',
      cpf: '456.789.123-11'
    },
    device: {
      brand: 'Samsung',
      model: 'Galaxy S22 5G',
      color: 'Verde',
      imei: '867543029182736',
      passwordType: 'pattern',
      passwordPattern: [0, 1, 2, 5, 8],
      accessories: ['Capa de Proteção', 'Chip SIM']
    },
    checklist: {
      liga: 'ok',
      tela: 'ok',
      touch: 'ok',
      conector: 'defeito',
      bateria: 'defeito',
      cameraFrontal: 'ok',
      cameraTraseira: 'ok',
      altoFalante: 'ok',
      auricular: 'ok',
      microfone: 'ok',
      botoes: 'ok',
      wifi: 'ok',
      rede: 'ok',
      biometria: 'ok',
      carcaca: 'ok',
      molhado: 'ok'
    },
    reportedIssue: 'Não carrega no cabo comum, apenas em carregador sem fio lento.',
    technicalDiagnosis: 'Subplaca de carga danificada com pinos quebrados + oxidação leve no conector Type-C.',
    servicesAndParts: [
      { id: '1', description: 'Subplaca Conector de Carga Tipo C Original Samsung', type: 'peca', quantity: 1, unitPrice: 180 },
      { id: '2', description: 'Mão de obra de substituição e desoxidação', type: 'servico', quantity: 1, unitPrice: 120 }
    ],
    discount: 0,
    total: 300,
    paymentMethod: 'cartao_credito',
    warrantyDays: 90,
    technicianName: 'Carlos Eduardo',
    notes: 'Aguardando aprovação via WhatsApp para solicitar a peça.'
  }
];

export function getStoredOrders(): WorkOrder[] {
  if (typeof window === 'undefined') return INITIAL_ORDERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_OS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_OS, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading orders from localStorage', err);
    return INITIAL_ORDERS;
  }
}

export function saveOrders(orders: WorkOrder[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_OS, JSON.stringify(orders));
  } catch (err) {
    console.error('Error saving orders to localStorage', err);
  }
}

export function getStoredSettings(): ShopSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    const parsed = JSON.parse(raw);
    if (parsed.shopName && parsed.shopName.includes('TechCell')) {
      parsed.shopName = DEFAULT_SETTINGS.shopName;
      if (parsed.shopPixKey?.includes('techcell')) {
        parsed.shopPixKey = DEFAULT_SETTINGS.shopPixKey;
      }
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(parsed));
    }
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (err) {
    console.error('Error reading settings', err);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: ShopSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Error saving settings', err);
  }
}

export function generateNextId(existingOrders: WorkOrder[]): string {
  const currentYear = new Date().getFullYear();
  const yearOrders = existingOrders.filter(o => o.id.startsWith(`OS-${currentYear}-`));
  let maxSeq = 0;
  for (const o of yearOrders) {
    const parts = o.id.split('-');
    if (parts.length === 3) {
      const seq = parseInt(parts[2], 10);
      if (!isNaN(seq) && seq > maxSeq) {
        maxSeq = seq;
      }
    }
  }
  const nextSeq = (maxSeq + 1).toString().padStart(3, '0');
  return `OS-${currentYear}-${nextSeq}`;
}

/**
 * Decodes compressed payload from URL for external/client view
 */
export function decodeCompressedOS(dataStr: string): Partial<WorkOrder> | null {
  try {
    const jsonStr = decodeURIComponent(escape(atob(decodeURIComponent(dataStr))));
    const d = JSON.parse(jsonStr);
    return {
      id: d.i,
      client: { name: d.c, phone: d.p },
      device: {
        brand: d.d?.split(' ')[0] || '',
        model: d.d?.split(' ').slice(1).join(' ') || d.d,
        color: d.cr || '',
        passwordType: 'none',
        accessories: []
      },
      status: d.st,
      reportedIssue: d.df,
      technicalDiagnosis: d.ld,
      total: d.tt,
      warrantyDays: d.w,
      createdAt: d.dt,
      servicesAndParts: (d.sv || []).map((s: { d: string; p: number; q: number }, idx: number) => ({
        id: String(idx),
        description: s.d,
        unitPrice: s.p,
        quantity: s.q,
        type: 'servico' as const
      })),
      checklist: d.ck || DEFAULT_CHECKLIST,
      discount: 0,
      technicianName: 'Assistência Técnica'
    };
  } catch (e) {
    console.error('Failed to decode OS payload from URL', e);
    return null;
  }
}
