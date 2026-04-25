import { Mail, Phone, MapPin } from "lucide-react";

export const SiteFooter = () => {
  const mapsQuery = encodeURIComponent("Rua Sete de Setembro, 160 - Parangaba, Fortaleza - CE, 60720-080");
  return (
    <footer id="contato" className="bg-primary text-primary-foreground">
      <div className="container grid gap-10 py-16 md:grid-cols-3">
        <div>
          <h3 className="font-display text-2xl font-bold">Company <span className="text-accent">Contábil</span></h3>
          <p className="mt-3 max-w-md text-sm text-primary-foreground/80">
            Contabilidade consultiva para empresas que querem crescer com segurança fiscal e estratégica.
          </p>
          <h4 className="mt-6 mb-3 font-semibold">Atendimento</h4>
          <p className="text-sm text-primary-foreground/85">Segunda a sexta<br />09h às 18h</p>
        </div>

        <div>
          <h4 className="mb-3 font-semibold">Contato</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/85">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-accent" />
              <a href="https://wa.me/5585999154055" target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                (85) 99915-4055
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-accent" />
              <a href="mailto:comercial@companycontabil.com.br" className="hover:text-accent break-all">
                comercial@companycontabil.com.br
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-accent mt-0.5" />
              <span>
                Rua Sete de Setembro, 160<br />
                Parangaba — Fortaleza/CE<br />
                CEP 60720-080
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold">Onde estamos</h4>
          <div className="overflow-hidden rounded-xl border border-primary-foreground/10 shadow-elegant">
            <iframe
              title="Localização Company Contábil"
              src={`https://www.google.com/maps?q=${mapsQuery}&output=embed`}
              width="100%"
              height="220"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block w-full border-0"
            />
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
          >
            Abrir no Google Maps →
          </a>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 text-xs text-primary-foreground/60 md:flex-row">
          <p>© {new Date().getFullYear()} Company Contábil. Todos os direitos reservados.</p>
          <p>CRC/CE 000.000/O-0</p>
        </div>
      </div>
    </footer>
  );
};
