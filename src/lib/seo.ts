import { useEffect, useState } from "react";
import {
  generateSEOMeta,
  generateNewsArticleJSONLD,
  generateBreadcrumbJSONLD,
  type SEOData,
  type Breadcrumb,
} from "./seo-utils";

export type { SEOData };

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://worldlive.dpdns.org";

interface SEOMetaOptions {
  description?: string;
  content?: string;
  image?: string;
  canonicalPath?: string;
  type?: "article" | "website";
  publishedAt?: string;
  author?: string;
  breadcrumbs?: Breadcrumb[];
}

function upsertMeta(attr: "name" | "property", key: string, value: string) {
  const selector = attr === "name" ? `meta[name="${key}"]` : `meta[property="${key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function upsertCanonical(path: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", `${SITE_URL}${path}`);
}

function upsertJSONLD(jsonld: object) {
  let script = document.head.querySelector<HTMLScriptElement>("#dynamic-jsonld");
  if (!script) {
    script = document.createElement("script");
    script.id = "dynamic-jsonld";
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(jsonld);
}

export function useSEOMeta(title: string, options: SEOMetaOptions = {}) {
  const [seo, setSeo] = useState<SEOData | null>(null);

  useEffect(() => {
    if (!title) return;

    const data = generateSEOMeta(title, options.description, options.content);
    setSeo(data);

    const canonicalPath = options.canonicalPath || "/";

    document.title = data.metaTitle;

    upsertMeta("name", "description", data.metaDescription);
    if (data.keywords.length > 0) {
      upsertMeta("name", "keywords", data.keywords.join(", "));
    }

    upsertMeta("property", "og:title", data.ogTitle);
    upsertMeta("property", "og:description", data.ogDescription);
    upsertMeta("property", "og:type", options.type || "website");
    upsertMeta("property", "og:url", `${SITE_URL}${canonicalPath}`);
    upsertMeta("property", "og:site_name", "WorldLive");
    if (options.image) {
      upsertMeta("property", "og:image", options.image);
      upsertMeta("property", "og:image:width", "1200");
      upsertMeta("property", "og:image:height", "630");
    }

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", data.twitterTitle);
    upsertMeta("name", "twitter:description", data.twitterDescription);
    if (options.image) {
      upsertMeta("name", "twitter:image", options.image);
    }

    upsertCanonical(canonicalPath);

    if (options.type === "article" && options.publishedAt) {
      upsertJSONLD(
        generateNewsArticleJSONLD({
          title,
          description: options.description,
          publishedAt: options.publishedAt,
          author: options.author,
          publisher: "WorldLive",
          url: canonicalPath,
          image: options.image,
        })
      );
    } else if (options.breadcrumbs && options.breadcrumbs.length > 0) {
      upsertJSONLD(generateBreadcrumbJSONLD(options.breadcrumbs));
    }
  }, [title, options.description, options.content, options.image, options.canonicalPath, options.type, options.publishedAt, options.author, options.breadcrumbs]);

  return seo;
}
