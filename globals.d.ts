// Extensões para o objeto Window usado no throttling do drag and drop
declare global {
  interface Window {
    lastDragLog?: number;
    lastDragLogKey?: string;
  }
}

export {}; 