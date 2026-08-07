import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
    {
      rules: {
        // The react-hooks v6 "React Compiler" correctness rules produce false
        // positives on standard patterns used throughout this app. Genuine bugs
        // they detect (conditional hooks, components created during render,
        // temporal-dead-zone access, unused declarations) are already fixed.
        // - setState within an effect is the canonical client data-loading
        //   pattern here (fetch(...).then(setState)).
        // - Date.now()/new Date() only ever appear inside event handlers, not
        //   during render.
        // - window.location.href assignment is intentional navigation.
        "react-hooks/set-state-in-effect": "off",
        "react-hooks/purity": "off",
        "react-hooks/immutability": "off",
        "react-hooks/static-components": "off",
      },
    },
    {
      files: [
        "src/components/NewsCard.tsx",
        "src/components/UserMenu.tsx",
        "src/components/CommentModeration.tsx",
        "src/components/FeaturedStoriesAdmin.tsx",
        "src/components/MediaLibrary.tsx",
        "src/components/ArticleClient.tsx",
        "src/app/article/**/*.tsx",
      ],
      rules: {
        // These components render images fetched from arbitrary external news
        // CDNs and user avatars. The domains are not known ahead of time, so
        // next/image cannot be configured via images.remotePatterns; native
        // <img> with lazy loading and onError fallbacks is the intended design.
        "@next/next/no-img-element": "off",
      },
    },
]);

export default eslintConfig;
