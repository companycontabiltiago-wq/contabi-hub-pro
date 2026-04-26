// Utilitário para abrir o WhatsApp pelo link universal, compatível com
// WhatsApp normal, WhatsApp Business, celular e desktop.

export const WHATSAPP_NUMBER = "5585999154055";
export const WHATSAPP_DEFAULT_MESSAGE = "Como podemos ajudar você hoje?";

export const buildWhatsAppUrl = (
  message: string = WHATSAPP_DEFAULT_MESSAGE,
  number: string = WHATSAPP_NUMBER
) => {
  const text = encodeURIComponent(message);
  const phone = number.replace(/\D/g, "");

  return `https://wa.me/${phone}?text=${text}`;
};

export const openWhatsApp = (
  message: string = WHATSAPP_DEFAULT_MESSAGE,
  number: string = WHATSAPP_NUMBER
) => {
  const url = buildWhatsAppUrl(message, number);
  const win = window.open(url, "_blank", "noopener,noreferrer");

  if (!win) {
    window.location.assign(url);
  }
};