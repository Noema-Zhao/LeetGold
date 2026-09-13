import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeetGold · CodeTop 100 黄金矿工闯关",
  description: "逐行挖掘算法：题干、动画、代码排序、变量理解与三轮代码默写。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
