import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://puaebozvrhhsoseywzuj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1YWVib3p2cmhoc29zZXl3enVqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTQyOTM3MCwiZXhwIjoyMTA3MDA1MzcwfQ.xa8koskMuDrYrRcJAYE2kD9-Pa6loQHG27HWdauA8bw"
);

// Best 8 — mix of brands, high rating, popular models
const FEATURED_SLUGS = [
  "iphone-16-pro",        // Apple — Best Seller, 4.8★
  "iphone-17-pro-max",    // Apple — Hot, 4.8★
  "galaxy-s25-ultra",     // Samsung — Hot, 4.7★
  "samsung-galaxy-s24-ultra", // Samsung — Best Seller, 4.7★
  "google-pixel-9",       // Google — Best Seller, 4.4★
  "oneplus-12",           // OnePlus — Best Seller, 4.5★
  "vivo-x200-pro",        // Vivo — Hot, 4.6★
  "pixel-10-pro",         // Google — Hot, 4.7★ (google-pixel-10-pro slug)
];

// Fix: google-pixel-10-pro slug টা catalog এ এটাই
const FINAL_SLUGS = [
  "iphone-16-pro",
  "iphone-17-pro-max",
  "galaxy-s25-ultra",
  "samsung-galaxy-s24-ultra",
  "google-pixel-9",
  "oneplus-12",
  "vivo-x200-pro",
  "google-pixel-10-pro",
];

async function run() {
  console.log("\n🌟 Setting Featured Products...\n");

  // আগে সব products এর is_featured = false করো
  const { error: resetErr } = await supabase
    .from("products")
    .update({ is_featured: false })
    .neq("slug", "___none___"); // সব rows

  if (resetErr) {
    console.error("❌ Reset failed:", resetErr.message);
    return;
  }
  console.log("✅ Reset all products → is_featured = false");

  // এরপর selected 8টা featured করো
  for (const slug of FINAL_SLUGS) {
    const { data, error } = await supabase
      .from("products")
      .update({ is_featured: true })
      .eq("slug", slug)
      .select("name")
      .single();

    if (error) {
      console.error(`❌ Failed: ${slug} — ${error.message}`);
    } else {
      console.log(`⭐ Featured: ${data.name}`);
    }
  }

  console.log("\n──────────────────────────────────");
  console.log("✅ Done! Homepage এ Popular Smartphones section এ এই 8টা দেখাবে।");
  console.log("──────────────────────────────────\n");
}

run().catch(console.error);
