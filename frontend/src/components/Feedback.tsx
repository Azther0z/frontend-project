export function LoadingMessage({ children = "Loading…" }: { children?: string }) {
  return <p className="notice" role="status">{children}</p>;
}

export function ErrorMessage({ children }: { children: string }) {
  return <p className="notice notice-error" role="alert">{children}</p>;
}

export function EmptyMessage({ children }: { children: string }) {
  return <p className="notice">{children}</p>;
}
