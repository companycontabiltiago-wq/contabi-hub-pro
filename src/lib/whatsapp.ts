// Utilitário para abrir o WhatsApp de forma confiável em qualquer dispositivo.
// Em mobile tenta abrir o app nativo; em desktop abre o WhatsApp Web/Desktop.
// Sempre cai no wa.me como fallback universal.

export const WHATSAPP_NUMBER = "5585999154055";
export const WHATSAPP_DEFAULT_MESSAGE = "Como podemos ajudar você hoje?";

export const buildWhatsAppUrl = (
  message: string = WHATSAPP_DEFAULT_MESSAGE,
  number: string = WHATSAPP_NUMBER
) => `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

export const openWhatsApp = (
  message: string = WHATSAPP_DEFAULT_MESSAGE,
  number: string = WHATSAPP_NUMBER
) => {
  const text = encodeURIComponent(message);
  const isMobile = /Android|iPhone|iPad|iPod/i.test(
    typeof navigator !== "undefined" ? navigator.userAgent : ""
  );

  // wa.me é o link oficial e mais compatível — abre o app no mobile e o
  // WhatsApp Web/Desktop no computador.
  const primary = `https://wa.me/${number}?text=${text}`;
  // Fallback para redes que bloqueiem wa.me
  const fallback = isMobile
    ? `whatsapp://send?phone=${number}&text=${text}`
    : `https://web.whatsapp.com/send?phone=${number}&text=${text}`;

  const win = window.open(primary, "_blank", "noopener,noreferrer");
  // Se o navegador bloquear o popup, tenta navegação direta
  if (!win) {
    try {
      window.location.href = primary;
    } catch {
      window.location.href = fallback;
    }
  }
};
