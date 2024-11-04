import ScratchAuthProvider from "@scratch-auth/nextjs/src/components/provider";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ScratchAuthProvider>{children}</ScratchAuthProvider>;
}
