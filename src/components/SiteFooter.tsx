import { Mail, Phone, MapPin } from "lucide-react";

export const SiteFooter = () => {
  return (
    <footer id="contato" className="bg-primary text-primary-foreground">
      <div className="container grid gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <h3 className="font-display text-2xl font-bold">Company <span className="text-accent">Contábil</span></h3>
          <p className="mt-3 max-w-md text-sm text-primary-foreground/80">
            Contabilidade consultiva para empresas que querem crescer com segurança fiscal e estratégica.
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">Contato</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/85">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-accent" /> (11) 9 9999-9999</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-accent" /> contato@companycontabil.com.br</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-accent" /> São Paulo — SP</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">Atendimento</h4>
          <p className="text-sm text-primary-foreground/85">Segunda a sexta<br />09h às 18h</p>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 text-xs text-primary-foreground/60 md:flex-row">
          <p>© {new Date().getFullYear()} Company Contábil. Todos os direitos reservados.</p>
          <p>CRC/SP 000.000/O-0</p>
        </div>
      </div>
    </footer>
  );
};
