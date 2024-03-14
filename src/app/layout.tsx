import { Inter } from "next/font/google";
import Navbar from "@/components/navbar/Navbar";
import { cookieToInitialState } from "wagmi";
import { config } from '@/config'
import { headers } from 'next/headers'
import { ContextProvider } from "@/context/ContextProvider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config, headers().get('cookie'))
  
  return (
    <html lang="en">
      <body className={`${inter.className} px-6 flex flex-col min-h-screen mx-auto md:px-0 md:w-[680px] items-center`}>
        <ContextProvider initialState={initialState}>
            <Navbar />
            {children}
        </ContextProvider>
      </body>
    </html>
  );
}
