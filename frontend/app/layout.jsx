import { Fraunces } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../lib/auth";

export const metadata = {
  title: "Aurum",
  description: "Refine knowledge into mastery.",
};

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-display",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={display.variable}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
