import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AlgoGo · CodeTop 100 闯关",
  description: "像玩游戏一样掌握 CodeTop 高频算法题。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
