// Utilitário para abrir o WhatsApp sem depender de api.whatsapp.com/wa.me,
// evitando bloqueio por iframe no preview e mantendo compatibilidade no site publicado.

export const WHATSAPP_NUMBER = "5585999154055";
export const WHATSAPP_DEFAULT_MESSAGE = "Como podemos ajudar você hoje?";

const isMobileDevice = () =>
  /Android|iPhone|iPad|iPod|Windows Phone/i.test(
    typeof navigator !== "undefined" ? navigator.userAgent : ""
  );

export const buildWhatsAppUrl = (
  message: string = WHATSAPP_DEFAULT_MESSAGE,
  number: string = WHATSAPP_NUMBER
) => {
  const text = encodeURIComponent(message);

  return isMobileDevice()
    ? `whatsapp://send?phone=${number}&text=${text}`
    : `https://web.whatsapp.com/send?phone=${number}&text=${text}`;
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