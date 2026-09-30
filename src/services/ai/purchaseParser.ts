export interface ParsedPurchase {
  itemName: string;
  amount: number;
  category: string;
  isVehicle: boolean;
  marketNote?: string;
}

/**
 * Intelligent parser that extracts product names, Pakistani Rupee amounts,
 * and realistic market prices from free-text user prompts.
 */
export function parsePurchaseQuery(query: string): ParsedPurchase | null {
  const q = query.toLowerCase();

  // 1. Check for explicit amounts in Pakistani units or standard numbers
  let detectedAmount: number | null = null;

  // Millions / Crore / Lakh matching
  const croreMatch = q.match(/(\d+(?:\.\d+)?)\s*(?:crore|cr)/);
  if (croreMatch) {
    detectedAmount = Math.round(parseFloat(croreMatch[1]) * 10000000);
  }

  const millionMatch = q.match(/(\d+(?:\.\d+)?)\s*(?:million|m\b)/);
  if (!detectedAmount && millionMatch) {
    detectedAmount = Math.round(parseFloat(millionMatch[1]) * 1000000);
  }

  const lakhMatch = q.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac|lacs|lakhs)/);
  if (!detectedAmount && lakhMatch) {
    detectedAmount = Math.round(parseFloat(lakhMatch[1]) * 100000);
  }

  const kMatch = q.match(/(\d+(?:\.\d+)?)\s*k\b/);
  if (!detectedAmount && kMatch) {
    detectedAmount = Math.round(parseFloat(kMatch[1]) * 1000);
  }

  const rawNumberMatch = q.match(/(?:pkr|rs\.?|rs)?\s*([0-9]{2,3}(?:,[0-9]{3})+|[0-9]{4,9})/);
  if (!detectedAmount && rawNumberMatch) {
    const cleaned = rawNumberMatch[1].replace(/,/g, '');
    detectedAmount = parseInt(cleaned, 10);
  }

  // 2. Identify products & Pakistani market baselines if amount not specified
  // Cars & Vehicles
  if (q.includes('civic') || q.includes('honda civic')) {
    const isNew = q.includes('new') || q.includes('2024') || q.includes('2025') || q.includes('2026') || q.includes('rs') || q.includes('oriel');
    const isUsed = q.includes('used') || q.includes('old') || q.includes('reborn') || q.includes('rebirth');
    const defaultPrice = isUsed ? 4500000 : 8500000;
    return {
      itemName: isUsed ? 'Used Honda Civic' : 'Honda Civic (Car)',
      amount: detectedAmount || defaultPrice,
      category: 'Vehicle',
      isVehicle: true,
      marketNote: `Pakistani market baseline for Honda Civic is PKR 8.5M (new) or PKR 4.5M (used).`,
    };
  }

  if (q.includes('corolla') || q.includes('toyota')) {
    return {
      itemName: 'Toyota Corolla',
      amount: detectedAmount || 7500000,
      category: 'Vehicle',
      isVehicle: true,
      marketNote: 'Pakistani market baseline for Toyota Corolla is PKR 6.5M - 7.5M.',
    };
  }

  if (q.includes('alto') || q.includes('suzuki alto')) {
    return {
      itemName: 'Suzuki Alto VXR/VXL',
      amount: detectedAmount || 2900000,
      category: 'Vehicle',
      isVehicle: true,
      marketNote: 'Pakistani market baseline for Suzuki Alto is PKR 2.9M.',
    };
  }

  if (q.includes('car') || q.includes('vehicle') || q.includes('automobile')) {
    return {
      itemName: 'Passenger Car',
      amount: detectedAmount || 4500000,
      category: 'Vehicle',
      isVehicle: true,
    };
  }

  if (q.includes('bike') || q.includes('motorcycle') || q.includes('cd70') || q.includes('cd 70') || q.includes('ybr') || q.includes('125')) {
    const isHeavy = q.includes('ybr') || q.includes('150') || q.includes('heavy');
    return {
      itemName: isHeavy ? 'Yamaha YBR 125G' : 'Honda CD 70 Motorcycle',
      amount: detectedAmount || (isHeavy ? 480000 : 160000),
      category: 'Vehicle',
      isVehicle: true,
    };
  }

  // Electronics & Phones
  if (q.includes('iphone') || q.includes('apple phone')) {
    const isPro = q.includes('pro') || q.includes('16') || q.includes('15');
    return {
      itemName: isPro ? 'iPhone 16 Pro Max (PTA Approved)' : 'iPhone 15 (PTA Approved)',
      amount: detectedAmount || (isPro ? 480000 : 340000),
      category: 'Electronics',
      isVehicle: false,
    };
  }

  if (q.includes('phone') || q.includes('mobile') || q.includes('samsung') || q.includes('galaxy')) {
    return {
      itemName: 'Smartphone Upgrade',
      amount: detectedAmount || 180000,
      category: 'Electronics',
      isVehicle: false,
    };
  }

  if (q.includes('macbook') || q.includes('mac book') || q.includes('apple laptop')) {
    return {
      itemName: 'Apple MacBook Pro M3',
      amount: detectedAmount || 360000,
      category: 'Technology',
      isVehicle: false,
    };
  }

  if (q.includes('laptop') || q.includes('computer') || q.includes('pc')) {
    return {
      itemName: 'Work Laptop Upgrade',
      amount: detectedAmount || 150000,
      category: 'Technology',
      isVehicle: false,
    };
  }

  if (q.includes('ps5') || q.includes('playstation') || q.includes('gaming console')) {
    return {
      itemName: 'Sony PlayStation 5 Console',
      amount: detectedAmount || 175000,
      category: 'Entertainment',
      isVehicle: false,
    };
  }

  // Travel / Life Events
  if (q.includes('dubai') || q.includes('trip') || q.includes('vacation') || q.includes('travel') || q.includes('turkey') || q.includes('umrah')) {
    const isUmrah = q.includes('umrah');
    return {
      itemName: isUmrah ? 'Umrah Pilgrimage Package' : 'International Vacation Trip',
      amount: detectedAmount || (isUmrah ? 450000 : 350000),
      category: 'Travel',
      isVehicle: false,
    };
  }

  if (q.includes('house') || q.includes('apartment') || q.includes('flat') || q.includes('plot')) {
    return {
      itemName: 'Real Estate / Plot Down Payment',
      amount: detectedAmount || 5000000,
      category: 'Property',
      isVehicle: false,
    };
  }

  if (q.includes('wedding') || q.includes('shaadi')) {
    return {
      itemName: 'Wedding Ceremony Budget',
      amount: detectedAmount || 2500000,
      category: 'Life Event',
      isVehicle: false,
    };
  }

  // Generic purchase if amount or keyword was detected
  if (detectedAmount) {
    // Try to extract product name from query
    let cleanItem = query
      .replace(/(?:can i|should i|could i|afford|buy|purchase|spend on|get|pkr|rs\.?|rs|\$)/gi, '')
      .replace(/(?:[0-9]+(?:\.[0-9]+)?\s*(?:crore|cr|million|m|lakh|lac|lacs|lakhs|k)?)/gi, '')
      .replace(/[?!.,]/g, '')
      .trim();

    if (!cleanItem || cleanItem.length < 3) cleanItem = 'Requested Purchase';

    return {
      itemName: cleanItem.charAt(0).toUpperCase() + cleanItem.slice(1),
      amount: detectedAmount,
      category: 'Discretionary Outlay',
      isVehicle: false,
    };
  }

  // If query contains purchase intent words: "buy", "afford", "purchase", "spend", "cost"
  if (
    q.includes('buy') ||
    q.includes('afford') ||
    q.includes('purchase') ||
    q.includes('spend') ||
    q.includes('get a ') ||
    q.includes('cost of')
  ) {
    let cleanItem = query
      .replace(/(?:can i|should i|could i|afford|buy|purchase|spend on|get a|get an|get|cost of|\?)/gi, '')
      .trim();

    if (!cleanItem || cleanItem.length < 2) cleanItem = 'Special Purchase';

    return {
      itemName: cleanItem.charAt(0).toUpperCase() + cleanItem.slice(1),
      amount: 100000, // sensible baseline
      category: 'Discretionary Outlay',
      isVehicle: false,
    };
  }

  return null;
}
