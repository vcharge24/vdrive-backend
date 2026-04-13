// ══════════════════════════════════════════════════════════════════════════════
//  ADMIN PORTAL — Sample Data
// ══════════════════════════════════════════════════════════════════════════════

export const MERCHANTS = [
  { id: "M001", name: "Al Futtaim Group", type: "Corporate", status: "active", sites: 4, chargers: 48, parkingSlots: 320, vehicles: 890, monthlyRevenue: 287500, contact: "Ahmed Al Futtaim", email: "ahmed@alfuttaim.ae", phone: "+971 4 222 1111", onboarded: "2025-08-15", emirate: "Dubai", plan: "Enterprise" },
  { id: "M002", name: "Aldar Properties", type: "Real Estate", status: "active", sites: 6, chargers: 72, parkingSlots: 540, vehicles: 1450, monthlyRevenue: 412000, contact: "Sara Al Ketbi", email: "sara@aldar.com", phone: "+971 2 810 5555", onboarded: "2025-09-01", emirate: "Abu Dhabi", plan: "Enterprise" },
  { id: "M003", name: "Emaar Hospitality", type: "Hospitality", status: "active", sites: 3, chargers: 24, parkingSlots: 180, vehicles: 520, monthlyRevenue: 156000, contact: "Khalid Emaar", email: "khalid@emaar.com", phone: "+971 4 367 3333", onboarded: "2025-10-12", emirate: "Dubai", plan: "Premium" },
  { id: "M004", name: "ADNOC Distribution", type: "Energy", status: "active", sites: 8, chargers: 96, parkingSlots: 120, vehicles: 2100, monthlyRevenue: 534000, contact: "Fatima Al Mazrouei", email: "fatima@adnoc.ae", phone: "+971 2 602 0000", onboarded: "2025-07-20", emirate: "Abu Dhabi", plan: "Enterprise" },
  { id: "M005", name: "Majid Al Futtaim", type: "Retail", status: "pending", sites: 2, chargers: 0, parkingSlots: 200, vehicles: 0, monthlyRevenue: 0, contact: "Omar MAF", email: "omar@maf.ae", phone: "+971 4 209 6000", onboarded: null, emirate: "Dubai", plan: "Premium" },
  { id: "M006", name: "Sharjah Investment", type: "Government", status: "suspended", sites: 1, chargers: 8, parkingSlots: 60, vehicles: 145, monthlyRevenue: 0, contact: "Hassan Al Qasimi", email: "hassan@shj-invest.ae", phone: "+971 6 512 3456", onboarded: "2025-11-05", emirate: "Sharjah", plan: "Standard" },
];

export const SITES = [
  { id: "S001", name: "Festival City Mall", merchant: "Al Futtaim Group", emirate: "Dubai", zone: "Al Rashidiya", chargers: 16, parking: 120, status: "online", occupancy: 78 },
  { id: "S002", name: "Dubai Festival Plaza", merchant: "Al Futtaim Group", emirate: "Dubai", zone: "Jebel Ali", chargers: 12, parking: 80, status: "online", occupancy: 65 },
  { id: "S003", name: "Yas Mall Parking", merchant: "Aldar Properties", emirate: "Abu Dhabi", zone: "Yas Island", chargers: 24, parking: 200, status: "online", occupancy: 82 },
  { id: "S004", name: "ADNOC HQ Parking", merchant: "ADNOC Distribution", emirate: "Abu Dhabi", zone: "Corniche", chargers: 20, parking: 40, status: "degraded", occupancy: 88 },
];

export const CHARGERS = [
  { id: "CH-001", site: "Festival City Mall", type: "DC Fast", power: 120, connector: "CCS2", status: "charging", sessions24h: 18, kwh24h: 842, uptime: 99.2 },
  { id: "CH-002", site: "Festival City Mall", type: "AC", power: 22, connector: "Type 2", status: "available", sessions24h: 12, kwh24h: 156, uptime: 100 },
  { id: "CH-003", site: "Yas Mall Parking", type: "DC Fast", power: 180, connector: "CCS2", status: "charging", sessions24h: 22, kwh24h: 1240, uptime: 98.7 },
  { id: "CH-004", site: "ADNOC HQ Parking", type: "DC Fast", power: 50, connector: "CHAdeMO", status: "faulted", sessions24h: 0, kwh24h: 0, uptime: 72.1 },
];

export const REVENUE_MONTHLY = [
  { month: "Sep", charging: 180000, parking: 220000, salik: 45000 },
  { month: "Oct", charging: 245000, parking: 265000, salik: 52000 },
  { month: "Nov", charging: 310000, parking: 298000, salik: 61000 },
  { month: "Dec", charging: 380000, parking: 340000, salik: 78000 },
  { month: "Jan", charging: 420000, parking: 355000, salik: 82000 },
  { month: "Feb", charging: 465000, parking: 378000, salik: 89000 },
  { month: "Mar", charging: 520000, parking: 410000, salik: 95000 },
];

export const TRANSACTIONS = [
  { id: "TXN-001", type: "Charging", merchant: "Al Futtaim Group", site: "Festival City Mall", amount: 42.50, method: "SALIK", status: "completed", time: "10:23" },
  { id: "TXN-002", type: "Parking", merchant: "Aldar Properties", site: "Yas Mall Parking", amount: 30.00, method: "Apple Pay", status: "completed", time: "10:18" },
  { id: "TXN-003", type: "Charging", merchant: "ADNOC Distribution", site: "ADNOC HQ Parking", amount: 87.25, method: "SALIK", status: "completed", time: "10:12" },
  { id: "TXN-004", type: "Parking", merchant: "Emaar Hospitality", site: "The Address Downtown", amount: 45.00, method: "Google Pay", status: "pending", time: "10:08" },
];
