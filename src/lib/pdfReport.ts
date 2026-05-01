import { jsPDF } from "jspdf";

export type ReportRow =
  | { label: string; value: string; highlight?: boolean }
  | { divider: true }
  | { note: string };

export interface ReportSection {
  title: string;
  rows: ReportRow[];
}

export interface ReportOptions {
  title: string;
  subtitle?: string;
  sections: ReportSection[];
  fileName: string;
  footer?: string;
}

/**
 * Gera um relatório padronizado em PDF com cabeçalho azul-marinho e rodapé,
 * usado pelas calculadoras gratuitas do site.
 */
export function gerarRelatorioPDF(opts: ReportOptions) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = 210;
  const pageH = 297;
  const margin = 18;
  let y = margin;

  // Header
  doc.setFillColor(15, 32, 72);
  doc.rect(0, 0, pageW, 24, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text(opts.title.toUpperCase(), pageW / 2, 13, { align: "center" });
  if (opts.subtitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(opts.subtitle, pageW / 2, 19, { align: "center" });
  }

  y = 34;
  doc.setTextColor(20, 20, 20);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    `Emitido em: ${new Date().toLocaleString("pt-BR")}`,
    pageW - margin,
    y,
    { align: "right" },
  );
  doc.text("Company Contábil — Relatório de Cortesia", margin, y);
  y += 8;

  const ensurePage = (needed = 10) => {
    if (y + needed > pageH - 18) {
      doc.addPage();
      y = margin;
    }
  };

  for (const section of opts.sections) {
    ensurePage(14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(15, 32, 72);
    doc.text(section.title, margin, y);
    y += 2;
    doc.setDrawColor(15, 32, 72);
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
        doc.setFillColor(245, 158, 11);
        doc.setTextColor(255, 255, 255);
        doc.rect(margin - 1, y - 4.5, pageW - margin * 2 + 2, 7, "F");
      }
      doc.text(row.label, margin + 1, y);
      doc.text(row.value, pageW - margin - 1, y, { align: "right" });
      if (row.highlight) {
        doc.setTextColor(20, 20, 20);
      }
      y += 7;
    }
    y += 4;
  }

  // Footer em todas as páginas
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(
      opts.footer ||
        "Documento informativo gerado pelas calculadoras gratuitas da Company Contábil. Os valores são estimativas; a apuração oficial depende da legislação vigente e da situação tributária do contribuinte.",
      pageW / 2,
      pageH - 10,
      { align: "center", maxWidth: pageW - margin * 2 },
    );
    doc.text(`Página ${i} de ${pageCount}`, pageW - margin, pageH - 5, {
      align: "right",
    });
  }

  doc.save(opts.fileName);
}
