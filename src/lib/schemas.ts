import { z } from "zod";

export const navItemSchema = z.object({
  href: z.string().min(1),
  label: z.string().min(1)
});

export const pageSeoSchema = z.object({
  path: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  schemaType: z.string().min(1)
});

export const siteConfigSchema = z.object({
  siteName: z.string().min(1),
  organizationName: z.string().min(1),
  author: z.string().min(1),
  siteUrl: z.string().url(),
  language: z.string().min(1),
  themeColor: z.string().min(1),
  backgroundColor: z.string().min(1),
  socialImage: z.string().min(1),
  socialImageAlt: z.string().min(1),
  twitterCard: z.string().min(1),
  footerDescription: z.string().min(1),
  footerNote: z.string().min(1),
  manifestDescription: z.string().min(1),
  nav: z.array(navItemSchema).min(1),
  pages: z.array(pageSeoSchema).min(1)
});

export const materialCatalogItemSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1)
});

export const ecopointSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["ecoponto", "pev"]),
  name: z.string().min(1),
  address: z.string().min(1),
  materialKeys: z.array(z.string().min(1)).min(1),
  hours: z.string().min(1),
  mapsUrl: z.string().url(),
  lat: z.number(),
  lon: z.number()
});

export const ecopointsDocumentSchema = z.object({
  city: z.string().min(1),
  sourceName: z.string().min(1),
  sourceUrl: z.string().url(),
  consultedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  consultedAtDisplay: z.string().min(1),
  materialsCatalog: z.array(materialCatalogItemSchema).min(1),
  points: z.array(ecopointSchema).min(1)
});

export const resourceContextSchema = z.object({
  badge: z.string().min(1),
  title: z.string().min(1),
  kicker: z.string().min(1),
  description: z.string().min(1).optional(),
  featured: z.boolean().optional()
});

export const resourceItemSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(["article", "video"]),
  cta: z.string().min(1),
  url: z.string().url(),
  media: z.object({
    src: z.string().min(1),
    alt: z.string().min(1),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    label: z.string().min(1)
  }),
  home: resourceContextSchema,
  sources: resourceContextSchema
});

export const sourcePanelSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  url: z.string().url(),
  cta: z.string().min(1)
});

export const resourcesDocumentSchema = z.object({
  consultedAtDisplay: z.string().min(1),
  homeResourceIds: z.array(z.string().min(1)).min(1),
  homeSpotlightIds: z.array(z.string().min(1)).min(1),
  sourcesFeaturedIds: z.array(z.string().min(1)).min(1),
  sourcesVideoIds: z.array(z.string().min(1)).min(1),
  sourcePanels: z.array(sourcePanelSchema).min(1),
  items: z.array(resourceItemSchema).min(1)
});

export const geoPointSchema = z.object({
  id: z.string().min(1),
  lat: z.number(),
  lon: z.number(),
  aliases: z.array(z.string().min(1)).min(1)
});

export const ecopointsGeoDocumentSchema = z.object({
  points: z.array(geoPointSchema).min(1)
});
