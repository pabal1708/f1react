import React from "react";
import SidebarLayout from "../(dashboard)/components/sidebar";
import {
  HomeOutlined,
  TeamOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

export const metadata = { title: "F1 Dashboard" };

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const items = [
    { key: "home", label: "Inicio", href: "/", icon: <HomeOutlined /> },
    { key: "teams", label: "Teams", href: "/teams", icon: <TeamOutlined /> },
    { key: "drivers", label: "Drivers", href: "/drivers", icon: <TeamOutlined /> },
    { key: "charts", label: "Charts", href: "/charts", icon: <BarChartOutlined /> },

  ];

  return (
    <SidebarLayout title="F1 for React" items={items}>
      {children}
    </SidebarLayout>
  );
};

export default DashboardLayout;
