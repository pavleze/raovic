import { Navigate } from "react-router-dom";

/** Stari /vodic linkovi → Blog (prazna nova stranica). */
export function VodicRedirect() {
  return <Navigate to="/blog" replace />;
}
