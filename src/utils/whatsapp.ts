import { WorkOrder, ShopSettings, STATUS_CONFIG } from '../types/os';

/**
 * Normalizes Brazilian phone numbers to WhatsApp international format (55 + DDD + number)
 */
export function formatPhoneForWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';

  // If already starts with 55 and has 12 or 13 digits (55 + 2 digits DDD + 8/9 digits)
  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
    return digits;
  }

  // If has DDD + phone (10 or 11 digits)
  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }

  // Fallback
  return digits;
}

/**
 * Generates an online tracking URL for this work order
 */
export function getOnlineTrackingUrl(os: WorkOrder): string {
  // Use current origin or location
  const baseUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'https://os-celular.app';
  
  // Compact encoded payload to allow any client on any phone/browser to view complete OS even without cloud sync
  try {
    const compactData = {
      i: os.id,
      c: os.client.name,
      p: os.client.phone,
      d: `${os.device.brand} ${os.device.model}`,
      cr: os.device.color,
      st: os.status,
      df: os.reportedIssue,
      ld: os.technicalDiagnosis || '',
      tt: os.total,
      w: os.warrantyDays,
      dt: os.createdAt,
      sv: os.servicesAndParts.map(s => ({ d: s.description, p: s.unitPrice, q: s.quantity })),
      ck: os.checklist
    };
    const jsonStr = JSON.stringify(compactData);
    // Base64 safe
    const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(jsonStr))));
    return `${baseUrl}?os=${os.id}&data=${encoded}`;
  } catch {
    return `${baseUrl}?os=${os.id}`;
  }
}

export type WhatsAppMessageType = 
  | 'abertura' 
  | 'orcamento' 
  | 'pronto' 
  | 'finalizada' 
  | 'personalizada';

export function buildWhatsAppMessage(
  os: WorkOrder, 
  settings: ShopSettings, 
  type: WhatsAppMessageType = 'abertura',
  customNote = ''
): string {
  const clientFirstName = os.client.name.split(' ')[0] || os.client.name;
  const trackingUrl = getOnlineTrackingUrl(os);
  const statusInfo = STATUS_CONFIG[os.status];
  const formattedTotal = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(os.total);

  switch (type) {
    case 'abertura':
      return [
        `Olá, *${clientFirstName}*! Tudo bem? 📱✨`,
        `Aqui é da *${settings.shopName}*.`,
        ``,
        `Sua Ordem de Serviço foi gerada com sucesso!`,
        `📋 *Ordem de Serviço:* #${os.id}`,
        `📱 *Aparelho:* ${os.device.brand} ${os.device.model} (${os.device.color})`,
        `🔧 *Defeito informado:* ${os.reportedIssue}`,
        `⚡ *Status atual:* ${statusInfo.label}`,
        ``,
        `Acompanhe o andamento da sua OS em tempo real pelo link:`,
        `👉 ${trackingUrl}`,
        ``,
        `Assim que concluirmos o diagnóstico técnico, entraremos em contato com você aqui pelo WhatsApp!`,
        `Qualquer dúvida, estamos à disposição.`
      ].join('\n');

    case 'orcamento':
      return [
        `Olá, *${clientFirstName}*! 🛠️`,
        `Aqui é da *${settings.shopName}*.`,
        ``,
        `O laudo técnico do seu *${os.device.brand} ${os.device.model}* está pronto!`,
        `📋 *OS:* #${os.id}`,
        `🔍 *Diagnóstico:* ${os.technicalDiagnosis || 'Avaliação completa realizada'}`,
        `💰 *Valor Total:* ${formattedTotal}`,
        `🛡️ *Garantia:* ${os.warrantyDays} dias para peças e serviços`,
        ``,
        `Veja todos os detalhes e aprove seu orçamento pelo link:`,
        `👉 ${trackingUrl}`,
        ``,
        `Você autoriza o início do conserto? Basta responder esta mensagem com *SIM, APROVADO*.`
      ].join('\n');

    case 'pronto':
      return [
        `Ótima notícia, *${clientFirstName}*! 🎉📱`,
        `Seu *${os.device.brand} ${os.device.model}* está *PRONTO PARA RETIRADA*!`,
        ``,
        `📋 *OS:* #${os.id}`,
        `💰 *Valor final:* ${formattedTotal}`,
        os.paymentMethod ? `💳 *Forma de pagamento:* ${os.paymentMethod.toUpperCase()}` : '',
        settings.shopPixKey ? `🔑 *Chave PIX para pagamento:* ${settings.shopPixKey}` : '',
        ``,
        `📍 *Endereço para retirada:*`,
        `${settings.shopAddress}`,
        ``,
        `Consulte o comprovante completo online:`,
        `👉 ${trackingUrl}`,
        ``,
        `Aguardamos sua visita!`
      ].filter(line => line !== '').join('\n');

    case 'finalizada':
      return [
        `Olá, *${clientFirstName}*! Agradecemos pela preferência! 🙏`,
        `Aqui está o comprovante final e termo de garantia do seu *${os.device.brand} ${os.device.model}*.`,
        ``,
        `📋 *OS:* #${os.id}`,
        `🛡️ *Garantia:* Válida por ${os.warrantyDays} dias a contar de hoje`,
        `💰 *Total pago:* ${formattedTotal}`,
        ``,
        `Guarde o link do seu comprovante com validade jurídica:`,
        `👉 ${trackingUrl}`,
        ``,
        `Conte sempre com a *${settings.shopName}*!`
      ].join('\n');

    case 'personalizada':
      return [
        `Olá, *${clientFirstName}*! (${settings.shopName})`,
        ``,
        customNote,
        ``,
        `📋 *OS:* #${os.id} | ${os.device.brand} ${os.device.model}`,
        `👉 Consulte online: ${trackingUrl}`
      ].join('\n');
  }
}

/**
 * Creates the direct WhatsApp URL
 */
export function getWhatsAppUrl(phone: string, text: string): string {
  const cleanPhone = formatPhoneForWhatsApp(phone);
  const encodedText = encodeURIComponent(text);
  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
}
