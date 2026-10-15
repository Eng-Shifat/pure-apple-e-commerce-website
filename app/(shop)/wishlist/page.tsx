import type { Metadata } from "next";
import WishlistPage from "./WishlistPage";

export const metadata: Metadata = {
  title: "My Wishlist — Pure Apple",
  description: "Your saved products on Pure Apple Mobile & Gadget Shop.",
};

export default function Page() {
  return <WishlistPage />;
}
