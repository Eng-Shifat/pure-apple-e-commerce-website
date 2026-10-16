// SAVE PATH: app/(shop)/layout.tsx
import Navbar from "@/components/shop/Navbar";
import Footer from "@/components/shop/Footer";
import MobileBottomNav from "@/components/shop/MobileBottomNav";
import WhatsAppFloat from "@/components/shop/WhatsAppFloat";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      {/* pb-20 on footer wrapper so fixed MobileBottomNav never covers the footer */}
      <div className="pb-20 md:pb-0 bg-dark-hero">
        <Footer />
      </div>
      <MobileBottomNav />
      <WhatsAppFloat />
    </>
  );
}
