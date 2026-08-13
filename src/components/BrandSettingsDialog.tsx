import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  BrandSettings,
  DEFAULT_BRAND,
  loadBrand,
  saveBrand,
  clearBrand,
} from "@/lib/pdfReport";
import { Settings, Upload, Trash2, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export const BrandSettingsDialog = ({ open, onOpenChange }: Props) => {
  const [brand, setBrand] = useState<BrandSettings>(DEFAULT_BRAND);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setBrand(loadBrand());
  }, [open]);

  const update = <K extends keyof BrandSettings>(k: K, v: BrandSettings[K]) =>
    setBrand((b) => ({ ...b, [k]: v }));

  const handleLogo = (file: File) => {
    if (file.size > 1024 * 1024) {
      toast({
        title: "Logo muito grande",
        description: "Use uma imagem de até 1 MB.",
        variant: "destructive",
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => update("logoDataUrl", String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    saveBrand(brand);
    toast({
      title: "Configurações salvas",
      description: "Os próximos relatórios usarão a sua marca.",
    });
    onOpenChange(false);
  };

  const handleReset = () => {
    clearBrand();
    setBrand(DEFAULT_BRAND);
    toast({ title: "Padrão restaurado" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-accent text-accent-foreground">
            <Settings className="h-6 w-6" />
          </div>
          <DialogTitle className="font-display text-2xl text-primary">
            Personalizar relatórios em PDF
          </DialogTitle>
          <DialogDescription>
            Configure a marca aplicada ao cabeçalho e rodapé de todos os PDFs
            gerados (recibo de RPA, custo de funcionário, INSS, pró-labore e
            simulador tributário). As informações ficam salvas neste navegador.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Logo */}
          <div>
            <Label>Logo da empresa</Label>
            <div className="mt-2 flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/30">
                {brand.logoDataUrl ? (
                  <img
                    src={brand.logoDataUrl}
                    alt="Logo"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-muted-foreground">Sem logo</span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleLogo(f);
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" /> Enviar logo
                </Button>
                {brand.logoDataUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => update("logoDataUrl", "")}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Remover
                  </Button>
                )}
                <p className="text-xs text-muted-foreground">
                  PNG ou JPG, até 1 MB. Recomendado: quadrado.
                </p>
              </div>
            </div>
          </div>

          {/* Identidade */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="b-nome">Nome / Razão social</Label>
              <Input
                id="b-nome"
                value={brand.companyName}
                onChange={(e) => update("companyName", e.target.value)}
                maxLength={80}
              />
            </div>
            <div>
              <Label htmlFor="b-tag">Frase do cabeçalho</Label>
              <Input
                id="b-tag"
                value={brand.tagline || ""}
                onChange={(e) => update("tagline", e.target.value)}
                placeholder="Ex: Relatório de cortesia"
                maxLength={80}
              />
            </div>
            <div>
              <Label htmlFor="b-tel">Telefone / WhatsApp</Label>
              <Input
                id="b-tel"
                value={brand.phone || ""}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="(11) 99999-9999"
                maxLength={30}
              />
            </div>
            <div>
              <Label htmlFor="b-mail">E-mail</Label>
              <Input
                id="b-mail"
                type="email"
                value={brand.email || ""}
                onChange={(e) => update("email", e.target.value)}
                placeholder="contato@empresa.com.br"
                maxLength={80}
              />
            </div>
            <div>
              <Label htmlFor="b-site">Site</Label>
              <Input
                id="b-site"
                value={brand.website || ""}
                onChange={(e) => update("website", e.target.value)}
                placeholder="www.empresa.com.br"
                maxLength={80}
              />
            </div>
            <div>
              <Label htmlFor="b-end">Endereço (rodapé)</Label>
              <Input
                id="b-end"
                value={brand.address || ""}
                onChange={(e) => update("address", e.target.value)}
                placeholder="Rua, nº, cidade/UF"
                maxLength={120}
              />
            </div>
          </div>

          {/* Cores */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="b-pri">Cor primária (cabeçalho)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="b-pri"
                  type="color"
                  className="h-10 w-16 cursor-pointer p-1"
                  value={brand.primaryColor || "#0F2048"}
                  onChange={(e) => update("primaryColor", e.target.value)}
                />
                <Input
                  value={brand.primaryColor || ""}
                  onChange={(e) => update("primaryColor", e.target.value)}
                  maxLength={7}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="b-acc">Cor de destaque</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="b-acc"
                  type="color"
                  className="h-10 w-16 cursor-pointer p-1"
                  value={brand.accentColor || "#F59E0B"}
                  onChange={(e) => update("accentColor", e.target.value)}
                />
                <Input
                  value={brand.accentColor || ""}
                  onChange={(e) => update("accentColor", e.target.value)}
                  maxLength={7}
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-lg border border-border overflow-hidden">
            <div
              className="flex items-center gap-3 p-3 text-white"
              style={{ backgroundColor: brand.primaryColor || "#0F2048" }}
            >
              {brand.logoDataUrl && (
                <img
                  src={brand.logoDataUrl}
                  alt=""
                  className="h-10 w-10 rounded bg-white object-contain p-0.5"
                />
              )}
              <div className="flex-1">
                <p className="font-bold text-sm uppercase">{brand.companyName}</p>
                <p className="text-xs opacity-90">Pré-visualização do cabeçalho</p>
              </div>
              <div className="text-right text-[10px] opacity-90">
                {brand.phone && <div>{brand.phone}</div>}
                {brand.email && <div>{brand.email}</div>}
                {brand.website && <div>{brand.website}</div>}
              </div>
            </div>
            <div className="p-3 text-xs text-muted-foreground">
              <span
                className="inline-block rounded px-2 py-0.5 font-bold text-white"
                style={{ backgroundColor: brand.accentColor || "#F59E0B" }}
              >
                Linha de destaque
              </span>{" "}
              — exemplo de como ficarão valores em destaque no relatório.
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row">
          <Button
            onClick={handleSave}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Save className="mr-2 h-4 w-4" /> Salvar configurações
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Restaurar padrão
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
