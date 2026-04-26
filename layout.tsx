import "./globals.css";

export const metadata = {
  title: "Finance AI App",
  description: "Personal finance dashboard with AI and Telegram-ready structure"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
