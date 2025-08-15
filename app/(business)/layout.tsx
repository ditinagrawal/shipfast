import { DashboardLayout as Component } from "@/modules/dashboard/components/dashboard-layout";
import React from "react";

interface iDashboardProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: iDashboardProps) {
  return <Component>{children}</Component>;
}
