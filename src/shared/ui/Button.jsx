export function Button({ children, variant = "primary", type = "button" }) {
  const className =
    variant === "ghost" ? "button button--ghost" : "button button--primary";

  return (
    <button className={className} type={type}>
      {children}
    </button>
  );
}
