"use client";

import { startTransition, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import {
  buildOpenStreetMapEmbedUrl,
  buildSchematicPoints,
  filterEcopoints,
  materialLabelMap
} from "@/lib/ecopoints";
import type { Ecopoint, MaterialCatalogItem } from "@/lib/types";

type EcopointsExplorerProps = {
  points: Ecopoint[];
  materials: MaterialCatalogItem[];
};

function EcopointMap({
  points,
  activeIndex,
  onSelect
}: {
  points: Ecopoint[];
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  const activePoint = points[activeIndex];

  const schematicPoints = useMemo(() => buildSchematicPoints(points), [points]);

  if (!activePoint) {
    return (
      <div className="card-surface p-6 text-sm leading-7 text-slate-600">
        Nenhum ponto corresponde aos filtros atuais.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <MapFrame
        key={activePoint.id}
        activeIndex={activeIndex}
        activePoint={activePoint}
        points={schematicPoints}
        onSelect={onSelect}
      />

      <div className="grid gap-3 md:grid-cols-2">
        {points.map((point, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={point.id}
              type="button"
              className={`rounded-[28px] border px-5 py-5 text-left shadow-[0_16px_36px_rgba(15,23,42,0.05)] transition ${
                isActive
                  ? "border-emerald-300 bg-[linear-gradient(180deg,rgba(240,253,244,0.95),rgba(255,255,255,0.98))] ring-1 ring-emerald-200/70"
                  : "border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/80"
              }`}
              onClick={() => onSelect(index)}
            >
              <div className="grid grid-cols-[3rem_1fr] items-start gap-4">
                <span
                  className={`inline-flex h-14 w-11 items-center justify-center rounded-[18px] text-lg font-extrabold tracking-tight shadow-sm ${
                    isActive
                      ? "bg-gradient-to-b from-emerald-600 to-emerald-700 text-white"
                      : "bg-slate-900 text-white"
                  }`}
                >
                  {index + 1}
                </span>
                <div className="space-y-2">
                  <p className="font-display text-2xl font-semibold leading-[1.15] text-slate-950">{point.name}</p>
                  <p className="text-[1.08rem] leading-8 text-slate-600">{point.address}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MapFrame({
  activeIndex,
  activePoint,
  points,
  onSelect
}: {
  activeIndex: number;
  activePoint: Ecopoint;
  points: Array<Ecopoint & { markerX: number; markerY: number }>;
  onSelect: (index: number) => void;
}) {
  const [showFallback, setShowFallback] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    timerRef.current = window.setTimeout(() => {
      setShowFallback(true);
    }, 4500);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  if (!showFallback) {
    return (
      <div className="card-surface overflow-hidden">
        <iframe
          src={buildOpenStreetMapEmbedUrl(activePoint)}
          title={`Mapa real de ${activePoint.name}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-[320px] w-full border-0 md:h-[380px]"
          onLoad={() => {
            if (timerRef.current) {
              window.clearTimeout(timerRef.current);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="card-surface map-grid relative h-[320px] overflow-hidden p-6 md:h-[380px]">
      {points.map((point, index) => (
        <button
          key={point.id}
          type="button"
          className={`absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white text-sm font-extrabold text-white shadow-lg ${
            activeIndex === index ? "bg-emerald-600" : "bg-slate-800"
          }`}
          style={{
            left: `${point.markerX}%`,
            top: `${point.markerY}%`
          }}
          onClick={() => onSelect(index)}
          aria-label={`Selecionar ${point.name}`}
        >
          {index + 1}
        </button>
      ))}

      <div className="absolute inset-x-6 bottom-6 rounded-[24px] bg-white/92 p-4 shadow-lg backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Mapa de reserva</p>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          O mapa real não respondeu a tempo. A visualização esquemática continua mostrando a posição relativa dos
          pontos visíveis.
        </p>
      </div>
    </div>
  );
}

export function EcopointsExplorer({ points, materials }: EcopointsExplorerProps) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"all" | Ecopoint["type"]>("all");
  const [material, setMaterial] = useState("all");
  const [selectedPointId, setSelectedPointId] = useState(points[0]?.id ?? "");
  const deferredQuery = useDeferredValue(query);
  const materialLookup = useMemo(() => materialLabelMap(materials), [materials]);

  const filteredPoints = useMemo(
    () =>
      filterEcopoints(points, {
        query: deferredQuery,
        type,
        material
      }),
    [deferredQuery, material, points, type]
  );

  const activeMaterialLabel = material === "all" ? "" : materialLookup.get(material) || "";
  const activeIndex = Math.max(
    0,
    filteredPoints.findIndex((point) => point.id === selectedPointId)
  );

  return (
    <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <div className="section-panel space-y-6 px-5 py-5 md:px-6">
          <div className="grid gap-4 md:grid-cols-[1.5fr_0.9fr]">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Buscar por endereço, bairro ou material</span>
              <input
                type="search"
                value={query}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  startTransition(() => setQuery(nextValue));
                }}
                placeholder="Ex.: bateria, Fundadores, Aviação"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none transition focus:border-emerald-300"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Tipo de ponto</span>
              <select
                value={type}
                onChange={(event) => setType(event.target.value as "all" | Ecopoint["type"])}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none transition focus:border-emerald-300"
              >
                <option value="all">Todos os pontos</option>
                <option value="ecoponto">Somente ecopontos</option>
                <option value="pev">Somente PEV</option>
              </select>
            </label>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-700">Filtrar por material aceito</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setMaterial("all")}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  material === "all"
                    ? "bg-emerald-600 text-white shadow-[0_10px_24px_rgba(5,150,105,0.22)]"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Todos os materiais
              </button>
              {materials.map((item) => {
                const active = material === item.key;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setMaterial(item.key)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      active
                        ? "bg-emerald-600 text-white shadow-[0_10px_24px_rgba(5,150,105,0.22)]"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="rounded-[24px] bg-slate-950 px-4 py-3 text-sm font-medium text-white">
            {filteredPoints.length === 0
              ? activeMaterialLabel
                ? `Nenhum ponto corresponde aos filtros atuais para ${activeMaterialLabel.toLowerCase()}.`
                : "Nenhum ponto corresponde aos filtros atuais. Tente outro termo ou escolha outro tipo."
              : filteredPoints.length === points.length
                ? activeMaterialLabel
                  ? `${filteredPoints.length} pontos aceitam ${activeMaterialLabel.toLowerCase()} em Araçatuba-SP.`
                  : `${filteredPoints.length} pontos disponíveis para descarte em Araçatuba-SP.`
                : activeMaterialLabel
                  ? `${filteredPoints.length} de ${points.length} pontos correspondem aos filtros para ${activeMaterialLabel.toLowerCase()}.`
                  : `${filteredPoints.length} de ${points.length} pontos correspondem aos filtros atuais.`}
          </p>
        </div>

        <div className="grid gap-4">
          {filteredPoints.map((point) => {
            const labels = point.materialKeys.map((key) => materialLookup.get(key) || key);

            return (
              <article key={point.id} className="card-surface content-auto p-5 md:p-6">
                <div className="flex flex-col gap-5 md:flex-row md:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                        {point.type === "pev" ? "PEV" : "Ecoponto"}
                      </span>
                      <span className="rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">
                        Araçatuba-SP
                      </span>
                    </div>
                    <h3 className="font-display text-2xl font-semibold text-slate-950">{point.name}</h3>
                    <p className="text-sm leading-7 text-slate-600">{point.address}</p>
                    <p className="text-sm font-semibold text-emerald-700">{point.hours}</p>
                  </div>

                  <div className="flex flex-wrap items-start gap-2 md:max-w-sm md:justify-end">
                    {labels.map((label) => (
                      <span
                        key={`${point.id}-${label}`}
                        className="rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={point.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button-primary"
                  >
                    Abrir localização
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <aside className="space-y-5">
        <div className="section-panel space-y-3 px-5 py-5 md:px-6">
          <p className="section-label">Mapa interativo</p>
          <h3 className="font-display text-3xl font-semibold text-slate-950">Mapa real com reserva esquemática</h3>
          <p className="text-sm leading-7 text-slate-600">
            O painel abre um mapa real do ponto selecionado. Se a visualização externa falhar, o site mostra um mapa
            simplificado para manter a apresentação funcionando.
          </p>
        </div>

        <EcopointMap
          points={filteredPoints}
          activeIndex={Math.min(activeIndex, Math.max(filteredPoints.length - 1, 0))}
          onSelect={(index) => {
            const nextPoint = filteredPoints[index];

            if (nextPoint) {
              setSelectedPointId(nextPoint.id);
            }
          }}
        />
      </aside>
    </div>
  );
}
