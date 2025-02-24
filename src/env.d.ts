/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_API_BASE: string
    readonly VITE_SANCTUM_BASE: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
} 