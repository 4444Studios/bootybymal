/// <reference types="vite/client" />

declare module '*.svg' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

interface ImportMetaEnv {
  readonly VITE_FORM_PROXY_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
