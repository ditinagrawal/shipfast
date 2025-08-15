import { auth } from "@/lib/auth";
import { LoginForm } from "@/modules/auth/components/login-form";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session?.user && session.user.emailVerified) {
    redirect("/dashboard");
  }
  if (session?.user && !session.user.emailVerified) {
    redirect(`/auth/verify?email=${session.user.email}`);
  }
  return <LoginForm />;
};

export default LoginPage;
