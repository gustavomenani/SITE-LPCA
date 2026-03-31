import Link from "next/link";

export default function NotFound() {
  return (
    <section className="px-4 md:px-6">
      <div className="shell">
        <div className="hero-panel px-6 py-10 text-center md:px-10 md:py-14">
          <div className="mx-auto max-w-2xl space-y-4">
            <div className="eyebrow mx-auto">Página não encontrada</div>
            <h1 className="font-display text-4xl font-semibold text-slate-950 md:text-5xl">
              Esse caminho não faz parte do projeto EcoTech.
            </h1>
            <p className="text-lg leading-8 text-slate-600">
              Use o menu para voltar ao conteúdo principal ou abrir a página de ecopontos.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/" className="button-primary">
                Voltar ao início
              </Link>
              <Link href="/ecopontos" className="button-secondary">
                Ver ecopontos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
