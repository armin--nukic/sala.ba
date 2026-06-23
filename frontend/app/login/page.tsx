import { AuthForm } from "@/components/AuthForm";

export default function LoginPage() {
  return <section className="section"><div className="container" style={{ display: "grid", placeItems: "center" }}><AuthForm mode="login" /></div></section>;
}
