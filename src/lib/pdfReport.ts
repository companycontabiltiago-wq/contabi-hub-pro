import { jsPDF } from "jspdf";

export type ReportRow =
  | { label: string; value: string; highlight?: boolean }
  | { divider: true }
  | { note: string };

export interface ReportSection {
  title: string;
  rows: ReportRow[];
}

export interface BrandSettings {
  companyName: string;
  tagline?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  /** Data URL (base64) da logo, ou URL pública */
  logoDataUrl?: string;
  /** Cor primária do cabeçalho em hex (#RRGGBB) */
  primaryColor?: string;
  /** Cor de destaque (highlights) em hex */
  accentColor?: string;
}

export interface ReportOptions {
  title: string;
  subtitle?: string;
  sections: ReportSection[];
  fileName: string;
  footer?: string;
  brand?: BrandSettings;
}

const BRAND_KEY = "company-pdf-brand";

export const DEFAULT_BRAND: BrandSettings = {
  companyName: "Company Contábil",
  tagline: "Relatório de cortesia",
  phone: "",
  email: "",
  website: "",
  address: "",
  logoDataUrl: "",
  primaryColor: "#0F2048",
  accentColor: "#F59E0B",
};

export function loadBrand(): BrandSettings {
  if (typeof window === "undefined") return DEFAULT_BRAND;
  try {
    const raw = localStorage.getItem(BRAND_KEY);
    if (!raw) return DEFAULT_BRAND;
    return { ...DEFAULT_BRAND, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_BRAND;
  }
}

export function saveBrand(brand: BrandSettings) {
  if (typeof window === "undefined") return;
  localStorage.setItem(BRAND_KEY, JSON.stringify(brand));
}

export function clearBrand() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(BRAND_KEY);
}

function hexToRgb(hex: string): [number, number, number] {
  const m = hex.replace("#", "");
  const v = m.length === 3
    ? m.split("").map((c) => parseInt(c + c, 16))
    : [0, 2, 4].map((i) => parseInt(m.substring(i, i + 2), 16));
  return [v[0] || 0, v[1] || 0, v[2] || 0];
}

function detectImageFormat(dataUrl: string): "PNG" | "JPEG" {
  if (dataUrl.startsWith("data:image/jpeg") || dataUrl.startsWith("data:image/jpg"))
    return "JPEG";
  return "PNG";
}

/**
 * Gera um relatório padronizado em PDF com cabeçalho colorido, logo opcional,
 * dados de contato da empresa e rodapé com paginação.
 */
export function gerarRelatorioPDF(opts: ReportOptions) {
  const brand: BrandSettings = { ...DEFAULT_BRAND, ...(opts.brand || loadBrand()) };
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = 210;
  const pageH = 297;
  const margin = 18;
  let y = margin;

  const [pr, pg, pb] = hexToRgb(brand.primaryColor || "#0F2048");
  const [ar, ag, ab] = hexToRgb(brand.accentColor || "#F59E0B");

  // Header (altura maior se houver logo)
  const headerH = brand.logoDataUrl ? 32 : 26;
  doc.setFillColor(pr, pg, pb);
  doc.rect(0, 0, pageW, headerH, "F");

  // Logo (à esquerda)
  let textX = pageW / 2;
  let textAlign: "center" | "left" = "center";
  if (brand.logoDataUrl) {
    try {
      doc.addImage(brand.logoDataUrl, detectImageFormat(brand.logoDataUrl), margin, 6, 20, 20);
      textX = margin + 26;
      textAlign = "left";
    } catch {
      // logo inválida — segue sem ela
    }
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(brand.companyName.toUpperCase(), textX, 13, { align: textAlign });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(opts.title, textX, 19, { align: textAlign });
  if (opts.subtitle) {
    doc.setFontSize(8);
    doc.text(opts.subtitle, textX, 24, { align: textAlign });
  }

  // Dados de contato no canto direito do header
  const contatos: string[] = [];
  if (brand.phone) contatos.push(brand.phone);
  if (brand.email) contatos.push(brand.email);
  if (brand.website) contatos.push(brand.website);
  if (contatos.length) {
    doc.setFontSize(8);
    let cy = 10;
    contatos.forEach((c) => {
      doc.text(c, pageW - margin, cy, { align: "right" });
      cy += 4;
    });
  }

  y = headerH + 8;
  doc.setTextColor(20, 20, 20);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Emitido em: ${new Date().toLocaleString("pt-BR")}`, pageW - margin, y, {
    align: "right",
  });
  if (brand.tagline) doc.text(brand.tagline, margin, y);
  y += 8;

  const ensurePage = (needed = 10) => {
    if (y + needed > pageH - 22) {
      doc.addPage();
      y = margin;
    }
  };

  for (const section of opts.sections) {
    ensurePage(14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(pr, pg, pb);
    doc.text(section.title, margin, y);
    y += 2;
    doc.setDrawColor(pr, pg, pb);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageW - margin, y);
    y += 6;

    doc.setTextColor(20, 20, 20);
    doc.setFontSize(10);
    for (const row of section.rows) {
      ensurePage(7);
      if ("divider" in row) {
        doc.setDrawColor(180, 180, 180);
        doc.setLineWidth(0.2);
        doc.line(margin, y - 2, pageW - margin, y - 2);
        y += 3;
        continue;
      }
      if ("note" in row) {
        doc.setFont("helvetica", "italic");
        doc.setTextColor(90, 90, 90);
        const lines = doc.splitTextToSize(row.note, pageW - margin * 2);
        ensurePage(lines.length * 5 + 2);
        doc.text(lines, margin, y);
        y += lines.length * 5 + 2;
        doc.setTextColor(20, 20, 20);
        continue;
      }
      doc.setFont("helvetica", row.highlight ? "bold" : "normal");
      if (row.highlight) {
        doc.setFillColor(ar, ag, ab);
        doc.setTextColor(255, 255, 255);
        doc.rect(margin - 1, y - 4.5, pageW - margin * 2 + 2, 7, "F");
      }
      doc.text(row.label, margin + 1, y);
      doc.text(row.value, pageW - margin - 1, y, { align: "right" });
      if (row.highlight) doc.setTextColor(20, 20, 20);
      y += 7;
    }
    y += 4;
  }

  // Rodapé em todas as páginas
  const pageCount = doc.getNumberOfPages();
  const footerLine =
    opts.footer ||
    [brand.companyName, brand.address, brand.phone, brand.email, brand.website]
      .filter(Boolean)
      .join(" · ") ||
    "Documento informativo gerado pelas calculadoras gratuitas.";

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(pr, pg, pb);
    doc.setLineWidth(0.3);
    doc.line(margin, pageH - 16, pageW - margin, pageH - 16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(footerLine, pageW / 2, pageH - 11, {
      align: "center",
      maxWidth: pageW - margin * 2,
    });
    doc.text(
      "Valores estimativos — sujeitos à legislação vigente.",
      pageW / 2,
      pageH - 7,
      { align: "center" },
    );
    doc.text(`Página ${i} de ${pageCount}`, pageW - margin, pageH - 4, {
      align: "right",
    });
  }

  doc.save(opts.fileName);
}
