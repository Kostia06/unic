import "./global.css";
import SupabaseProvider from "@/lib/supabase";
import BasicNavbar from "../components/BasicNavbar";
import LuxuryFooter from "../components/Footer";
import { GlobalContextProvider } from "../container/GlobalContext";
import { TranslationProvider } from "@/lib/translation-context";

export const metadata = {
    title: "UNIC México - Luxury Jewelry | Joyería de Lujo Mexicana",
    description: "Discover exquisite handcrafted luxury jewelry from Mexico. Each piece tells a unique story of elegance and sophistication. | Descubre joyería de lujo artesanal excepcional de México.",
    keywords: "luxury jewelry, Mexican jewelry, handcrafted, artisan, rings, necklaces, earrings, joyería de lujo, joyería mexicana",
};

export default function RootLayout({ children }) {
    return (
        <html lang="es">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body className="min-h-screen flex flex-col">
                <SupabaseProvider>
                    <GlobalContextProvider>
                        <TranslationProvider>
                            <BasicNavbar />
                            <main className="flex-grow">
                                {children}
                            </main>
                            <LuxuryFooter />
                        </TranslationProvider>
                    </GlobalContextProvider>
                </SupabaseProvider>
            </body>
        </html>
    );
}
