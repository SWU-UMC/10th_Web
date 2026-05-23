interface ImportMetaEnv {
  readonly VITE_SERVER_API_URL: string
  // 다른 환경 변수들에 대한 타입 정의...
  readonly DEV: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}