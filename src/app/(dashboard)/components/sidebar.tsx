"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MenuProps } from "antd";
import { Layout, Menu, Grid } from "antd";
import {
  // HomeOutlined,
  // TeamOutlined,
  // SettingOutlined,
  // PieChartOutlined,
  // FileTextOutlined,
  // QuestionCircleOutlined,
} from "@ant-design/icons";

const { Sider, Header, Content } = Layout;
const { useBreakpoint } = Grid;

// --- tiny inline logo related to racing (chequered flag) ---
function RacingLogo({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-label="Racing logo"
      role="img"
    >
      {/* flag pole */}
      <rect x="8" y="8" width="4" height="48" rx="2" fill="currentColor" />
      {/* flag (simple checkered pattern) */}
      <g transform="translate(12,8)">
        <rect x="0" y="0" width="40" height="28" rx="2" fill="currentColor" opacity="0.15" />
        {[0, 1, 2, 3].map((r) =>
          [0, 1, 2, 3, 4].map((c) => (
            <rect
              key={`${r}-${c}`}
              x={c * 8 + (r % 2 === 0 ? 0 : 4)}
              y={r * 7}
              width="6"
              height="6"
              fill="currentColor"
              opacity={(r + c) % 2 === 0 ? 0.8 : 0.4}
              rx="1"
            />
          ))
        )}
      </g>
    </svg>
  );
}

type MenuItem = Required<MenuProps>["items"][number];

type NavItemBase = {
  /** Unique key for AntD Menu */
  key: string;
  /** Visible label */
  label: string;
  /** Optional icon (use @ant-design/icons) */
  icon?: React.ReactNode;
  /** Optional: open link in a new tab */
  target?: "_blank" | "_self" | "_parent" | "_top";
};

type NavLeaf = NavItemBase & {
  href: string; // internal or external
};

type NavBranch = NavItemBase & {
  children: NavNode[];
};

export type NavNode = NavLeaf | NavBranch;

export type SidebarLayoutProps = {
  title?: string;
  logo?: React.ReactNode;
  items: NavNode[];
  children?: React.ReactNode;
  width?: number;
  defaultOpenKeys?: string[];
  headerRight?: React.ReactNode;
  /** If true, header goes across the top and sidebar starts below it */
  headerAcross?: boolean;
};

function mapToAntdItems(nodes: NavNode[]): MenuItem[] {
  return nodes.map((node) => {
    const base = {
      key: node.key,
      icon: node.icon,
      label: "label" in node ? node.label : (node as any).label,
    } as any;

    if ("children" in node) {
      return {
        ...base,
        children: mapToAntdItems(node.children),
      } satisfies MenuItem;
    }

    const leaf = node as NavLeaf;
    const isExternal = /^https?:\/\//i.test(leaf.href);

    return {
      ...base,
      label: isExternal ? (
        <a href={leaf.href} target={leaf.target ?? "_blank"} rel="noreferrer">
          {leaf.label}
        </a>
      ) : (
        <Link href={leaf.href} target={leaf.target} prefetch>
          {leaf.label}
        </Link>
      ),
    } satisfies MenuItem;
  });
}

export default function SidebarLayout({
  title = "App",
  logo,
  items,
  children,
  width = 256,
  defaultOpenKeys,
  headerRight,
  headerAcross = true,
}: SidebarLayoutProps) {
  const pathname = usePathname();
  const screens = useBreakpoint();
  const [collapsed, setCollapsed] = useState(false);
  const HEADER_HEIGHT = 64;


  const { selectedKeys, openKeys } = useMemo(() => {
    const keys: string[] = [];
    const okeys = new Set<string>(defaultOpenKeys ?? []);

    const walk = (nodes: NavNode[], parentKeys: string[] = []) => {
      for (const n of nodes) {
        if ("children" in n) {
          walk(n.children, [...parentKeys, n.key]);
        } else if ("href" in n) {
          if (!/^https?:/i.test(n.href) && pathname?.startsWith(n.href)) {
            keys[0] = n.key;
            parentKeys.forEach((k) => okeys.add(k));
          }
        }
      }
    };

    walk(items);
    return { selectedKeys: keys.length ? keys : undefined, openKeys: Array.from(okeys) };
  }, [items, pathname, defaultOpenKeys]);

  const antdItems = useMemo(() => mapToAntdItems(items), [items]);

  const logoNode = logo ?? (
    <div className="text-white-900">
      <RacingLogo />
    </div>
  );

  if (headerAcross) {
    return (
      <Layout className="min-h-screen">
        <Header
          className="bg-white h-16 px-4 flex items-center justify-between shadow-sm"
          style={{ position: "sticky", top: 0, zIndex: 100, width: "100%" }}
        >
          <div className="font-medium">{title}</div>
          <div>{headerRight}</div>
        </Header>

        <Layout hasSider>
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            width={width}
            breakpoint="lg"
            collapsedWidth={screens.xs ? 0 : 80}
            className="!bg-white"
            style={{
              position: "sticky",
              top: HEADER_HEIGHT,
              height: `calc(100vh - ${HEADER_HEIGHT}px)`,
              overflow: "auto",
            }}
          >
            <div className="flex items-center gap-2 h-16 px-4 border-b border-gray-100">
              {logoNode}
              {!collapsed && <span className="font-semibold truncate app-title">{title}</span>}
            </div>
            <Menu
              mode="inline"
              items={antdItems}
              selectedKeys={selectedKeys}
              defaultOpenKeys={openKeys}
              className="!border-r-0"
            />
          </Sider>

          <Content className="p-4 bg-gray-50" style={{ minHeight: `calc(100vh - ${HEADER_HEIGHT}px)` }}>
            {children}
          </Content>
        </Layout>
      </Layout>
    );
  }

  return (
    <Layout className="min-h-screen">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={width}
        breakpoint="lg"
        collapsedWidth={screens.xs ? 0 : 80}
        className="!bg-white"
      >
        <div className="flex items-center gap-2 h-16 px-4 border-b border-gray-100">
          {logoNode}
          {!collapsed && <span className="font-semibold truncate app-title">{title}</span>}
        </div>
        <Menu
          mode="inline"
          items={antdItems}
          selectedKeys={selectedKeys}
          defaultOpenKeys={openKeys}
          className="!border-r-0"
        />
      </Sider>

      <Layout>
        <Header className="bg-white h-16 px-4 flex items-center justify-between shadow-sm">
          <div className="font-medium app-title">{title}</div>
          <div>{headerRight}</div>
        </Header>
        <Content className="p-4 bg-gray-50 min-h-[calc(100vh-4rem)]">{children}</Content>
      </Layout>
    </Layout>
  );
}


