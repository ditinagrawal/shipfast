import { auth } from "@/lib/auth";
import { VerifyForm } from "@/modules/auth/components/verify-form";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const VerifyPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session?.user && session.user.emailVerified) {
    redirect("/dashboard");
  }
  return <VerifyForm />;
};

export default VerifyPage;
