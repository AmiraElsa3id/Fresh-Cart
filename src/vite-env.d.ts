/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Absolute origin used for the Stripe checkout-session success/cancel redirect. */
  readonly VITE_APP_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}