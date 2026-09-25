// ==============================
// DELIVERY ZONES
// ==============================

export type DeliveryZone = {
  name: string;
  prefixes: string[];
  pincodes: string[];
  deliveryDays: [number, number];
  deliveryFee: number;
  freeAbove: number;
  discount: number;
  offerMessage?: string;
};

export const deliveryZones: DeliveryZone[] = [
  {
    name: "Amroha Local",
    prefixes: ["2442"],
    pincodes: ["244221", "244222", "244223", "244231", "244235", "244241"],
    deliveryDays: [1, 2],
    deliveryFee: 0,
    freeAbove: 0,
    discount: 5,
    offerMessage: "🎉 Amroha me FREE Delivery + 5% OFF!",
  },
  {
    name: "Uttar Pradesh",
    prefixes: ["2"],
    pincodes: [],
    deliveryDays: [2, 4],
    deliveryFee: 50,
    freeAbove: 500,
    discount: 0,
    offerMessage: "",
  },
  {
    name: "Pan India",
    prefixes: ["1", "3", "4", "5", "6", "7", "8", "9"],
    pincodes: [],
    deliveryDays: [4, 7],
    deliveryFee: 80,
    freeAbove: 800,
    discount: 0,
    offerMessage: "",
  },
];

// ==============================
// COD BLACKLIST (High Fraud / RTO / Remote)
// ==============================

export const codBlacklistPincodes: string[] = [
  // Haryana, Rajasthan, UP Border - High Fraud
  "122107", // Nuh
  "122108", // Punhana
  "122104", // Ferozepur Jhirka
  "122105", // Tauru
  "321204", // Kaman, Bharatpur
  "281403", // Kosi Kalan, Mathura

  // Remote Islands (Andaman & Lakshadweep)
  "744101", // Port Blair
  "744202", // Mayabunder
  "744301", // Car Nicobar
  "744304", // Campbell Bay
  "682551", // Kavaratti
  "682553", // Androth
  "682554", // Minicoy
  "682555", // Agatti

  // Extreme High-Altitude (Ladakh & J&K)
  "194101", // Leh
  "194102", // Diskit
  "194301", // Kargil
  "194302", // Drass
  "193222", // Kupwara Border
  "192230", // Kishtwar Interiors

  // Remote Mountain (Arunachal, Manipur, Nagaland)
  "791102", // Tawang
  "791111", // Ziro
  "792110", // Changlang
  "795142", // Ukhrul
  "797112", // Mon

  // High RTO (Bihar, Jharkhand, Chhattisgarh)
  "855107", // Kishanganj
  "855113", // Thakurganj
  "854311", // Purnia Rural
  "829204", // Latehar
  "822114", // Garhwa
  "494001", // Bastar
  "494444", // Bijapur
];

// ==============================
// HELPER FUNCTIONS
// ==============================

export function isCodAvailable(pincode: string): boolean {
  return !codBlacklistPincodes.includes(pincode);
}

export function getDeliveryZone(pincode: string): DeliveryZone | null {
  // Exact pincode match first
  for (const zone of deliveryZones) {
    if (zone.pincodes.includes(pincode)) return zone;
  }
  // Then prefix match
  for (const zone of deliveryZones) {
    for (const prefix of zone.prefixes) {
      if (pincode.startsWith(prefix)) return zone;
    }
  }
  return null;
}

export function getDeliveryInfo(pincode: string) {
  const zone = getDeliveryZone(pincode);
  if (!zone) {
    return {
      available: false,
      message: "❌ Is pincode pe delivery available nahi hai",
    };
  }

  const codAvailable = isCodAvailable(pincode);

  return {
    available: true,
    zone: zone.name,
    deliveryDays: zone.deliveryDays,
    deliveryFee: zone.deliveryFee,
    freeAbove: zone.freeAbove,
    discount: zone.discount,
    offerMessage: zone.offerMessage,
    codAvailable: codAvailable,
    message: codAvailable
      ? `✅ Delivery available in ${zone.name}`
      : `⚠️ Delivery available, par COD available nahi hai`,
  };
}

// ==============================
// VALIDATE PINCODE (India Post API)
// ==============================

export async function validatePincode(pincode: string): Promise<{
  valid: boolean;
  city?: string;
  district?: string;
  state?: string;
}> {
  try {
    const res = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`
    );
    const data = await res.json();

    if (
      data &&
      data[0] &&
      data[0].Status === "Success" &&
      data[0].PostOffice &&
      data[0].PostOffice.length > 0
    ) {
      const po = data[0].PostOffice[0];
      return {
        valid: true,
        city: po.Name,
        district: po.District,
        state: po.State,
      };
    }
    return { valid: false };
  } catch (err) {
    console.error("Pincode validation error:", err);
    // Fail open — agar API down ho toh allow karo
    return { valid: true };
  }
}

// ==============================
// GET DELIVERY DATE
// ==============================

export function getDeliveryDate(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}
