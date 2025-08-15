import { auth } from "@/lib/auth";
import { OnboardForm } from "@/modules/onboarding/components/onboard-form";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUser } from "../(business)/dashboard/page";

const OnboardingPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/auth/login");
  }
  const user = await getUser(session.user.email);
  if (!user) {
    redirect("/auth/login");
  }
  if (user.name && user.image) {
    redirect("/dashboard");
  }
  return <OnboardForm />;
};

export default OnboardingPage;
