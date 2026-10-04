import Navbar from "@/components/shop/Navbar";
import Footer from "@/components/shop/Footer";
import MobileBottomNav from "@/components/shop/MobileBottomNav";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {/* extra bottom space on mobile so the fixed tab bar never covers content */}
      <div className="pb-20 md:pb-0">
        {children}
        <Footer />
      </div>
      <MobileBottomNav />
    </>
  );
}
