// ══════════════════════════════════════════════════════════════════════════════
//  MERCHANT PORTAL — Sample Data (Corporate / Commercial Building Tower)
// ══════════════════════════════════════════════════════════════════════════════

export const MERCHANT = {
  id: "M001", name: "Al Futtaim Tower", fullName: "Al Futtaim Group",
  type: "Corporate", subType: "Commercial Building Tower", emirate: "Dubai",
  zone: "Festival City", address: "Dubai Festival City, Al Rebat Street",
  contact: "Ahmed Al Futtaim", email: "ahmed@alfuttaim.ae", phone: "+971 4 222 1111",
  plan: "Enterprise", status: "active", onboarded: "2025-08-15",
};

export const initBasementLevels = [
  { id: "B1", name: "Basement 1", level: -1, totalSlots: 120, evSlots: 24, handicapSlots: 6, status: "active", occupancy: 78, chargers: 8 },
  { id: "B2", name: "Basement 2", level: -2, totalSlots: 100, evSlots: 16, handicapSlots: 4, status: "active", occupancy: 62, chargers: 6 },
  { id: "B3", name: "Basement 3", level: -3, totalSlots: 80, evSlots: 8, handicapSlots: 4, status: "active", occupancy: 45, chargers: 4 },
];

export const initGates = [
  { id: "G001", name: "Main Entrance A", type: "entrance", level: "B1", camera: "CAM-ENT-A", status: "online", barrier: "up", vehiclesPerHour: 120, lastEvent: "10:24:03" },
  { id: "G002", name: "Main Entrance B", type: "entrance", level: "B1", camera: "CAM-ENT-B", status: "online", barrier: "up", vehiclesPerHour: 95, lastEvent: "10:23:48" },
  { id: "G003", name: "VIP Entrance", type: "entrance", level: "B1", camera: "CAM-VIP-E", status: "online", barrier: "up", vehiclesPerHour: 28, lastEvent: "10:18:30" },
  { id: "G004", name: "Exit Gate 1", type: "exit", level: "B1", camera: "CAM-EXT-1", status: "online", barrier: "up", vehiclesPerHour: 110, lastEvent: "10:22:15" },
  { id: "G005", name: "Exit Gate 2", type: "exit", level: "B1", camera: "CAM-EXT-2", status: "degraded", barrier: "up", vehiclesPerHour: 88, lastEvent: "10:20:05" },
  { id: "G006", name: "Service Exit", type: "exit", level: "B2", camera: "CAM-SRV-X", status: "online", barrier: "down", vehiclesPerHour: 12, lastEvent: "09:45:20" },
];

export const initTenants = [
  { id: "T001", name: "Al Futtaim Motors", floor: "1-3", type: "Automotive", contact: "Mohammed Ali", email: "mohammed@alfuttaim-motors.ae", phone: "+971 4 222 2001", status: "active", allocatedSlots: 45, vehicles: 38, monthlyFee: 22500, leaseEnd: "2027-08-15" },
  { id: "T002", name: "IKEA Regional Office", floor: "4-6", type: "Retail HQ", contact: "Sara Jensen", email: "sara.j@ikea-me.com", phone: "+971 4 222 2002", status: "active", allocatedSlots: 35, vehicles: 28, monthlyFee: 17500, leaseEnd: "2028-01-31" },
  { id: "T003", name: "Emirates NBD Branch", floor: "7", type: "Banking", contact: "Khalid Al Suwaidi", email: "khalid@emiratesnbd.ae", phone: "+971 4 222 2003", status: "active", allocatedSlots: 20, vehicles: 16, monthlyFee: 10000, leaseEnd: "2027-06-30" },
  { id: "T004", name: "Deloitte ME", floor: "8-10", type: "Consulting", contact: "James Wilson", email: "jwilson@deloitte.ae", phone: "+971 4 222 2004", status: "active", allocatedSlots: 50, vehicles: 42, monthlyFee: 25000, leaseEnd: "2028-03-15" },
  { id: "T005", name: "DHL Express Hub", floor: "11", type: "Logistics", contact: "Priya Sharma", email: "priya.sharma@dhl.ae", phone: "+971 4 222 2005", status: "active", allocatedSlots: 15, vehicles: 12, monthlyFee: 7500, leaseEnd: "2027-11-30" },
  { id: "T006", name: "WeWork Co-Working", floor: "12-14", type: "Co-Working", contact: "Alex Turner", email: "alex.t@wework.ae", phone: "+971 4 222 2006", status: "active", allocatedSlots: 30, vehicles: 22, monthlyFee: 15000, leaseEnd: "2027-09-30" },
  { id: "T007", name: "Siemens Energy", floor: "15-16", type: "Energy", contact: "Hans Mueller", email: "hans.m@siemens.ae", phone: "+971 4 222 2007", status: "pending", allocatedSlots: 25, vehicles: 0, monthlyFee: 12500, leaseEnd: "2028-06-30" },
];

export const initVehicles = [
  { id: "VH001", plate: "A 12345 DXB", make: "Tesla", model: "Model 3", color: "White", year: 2025, ev: true, tenantId: "T001", driver: "Youssef Al Rashid", phone: "+971 50 123 4567", passType: "Monthly", status: "active", registered: "2025-09-10", lastEntry: "2026-04-13 08:15", lastExit: null, currentlyParked: true, level: "B1", slot: "B1-042" },
  { id: "VH002", plate: "B 98765 AUH", make: "BMW", model: "iX", color: "Black", year: 2024, ev: true, tenantId: "T002", driver: "Fatima Al Mansoori", phone: "+971 55 987 6543", passType: "Monthly", status: "active", registered: "2025-10-05", lastEntry: "2026-04-13 07:50", lastExit: null, currentlyParked: true, level: "B2", slot: "B2-018" },
  { id: "VH003", plate: "C 44321 SHJ", make: "Toyota", model: "Camry", color: "Silver", year: 2023, ev: false, tenantId: "T003", driver: "Hassan Al Qasimi", phone: "+971 52 443 2100", passType: "Monthly", status: "active", registered: "2025-11-20", lastEntry: "2026-04-13 09:02", lastExit: null, currentlyParked: true, level: "B1", slot: "B1-078" },
  { id: "VH004", plate: "A 55678 DXB", make: "Mercedes", model: "EQS", color: "Grey", year: 2025, ev: true, tenantId: "T004", driver: "Sara Khalifa", phone: "+971 50 556 7890", passType: "Monthly", status: "active", registered: "2025-12-01", lastEntry: "2026-04-13 08:45", lastExit: null, currentlyParked: true, level: "B1", slot: "B1-105" },
  { id: "VH005", plate: "D 77890 AJM", make: "Nissan", model: "Patrol", color: "White", year: 2022, ev: false, tenantId: null, driver: "Khalid bin Omar", phone: "+971 56 778 9012", passType: "Visitor", status: "active", registered: "2026-04-13", lastEntry: "2026-04-13 09:30", lastExit: null, currentlyParked: true, level: "B3", slot: "B3-005" },
  { id: "VH006", plate: "A 33210 DXB", make: "BYD", model: "Seal", color: "Blue", year: 2025, ev: true, tenantId: "T004", driver: "Noura Al Shamsi", phone: "+971 50 332 1098", passType: "Monthly", status: "active", registered: "2026-01-15", lastEntry: "2026-04-13 07:30", lastExit: null, currentlyParked: true, level: "B2", slot: "B2-033" },
  { id: "VH007", plate: "B 11223 AUH", make: "Audi", model: "Q8 e-tron", color: "Black", year: 2024, ev: true, tenantId: "T005", driver: "Mohammed Al Dhaheri", phone: "+971 55 112 2334", passType: "Monthly", status: "active", registered: "2025-08-22", lastEntry: "2026-04-12 17:45", lastExit: "2026-04-12 18:30", currentlyParked: false, level: null, slot: null },
  { id: "VH008", plate: "A 66543 DXB", make: "Porsche", model: "Taycan", color: "Red", year: 2025, ev: true, tenantId: "T001", driver: "Layla Hassan", phone: "+971 50 665 4321", passType: "Monthly", status: "active", registered: "2026-02-10", lastEntry: "2026-04-13 09:15", lastExit: null, currentlyParked: true, level: "B1", slot: "B1-012" },
  { id: "VH009", plate: "C 88901 SHJ", make: "Hyundai", model: "Tucson", color: "White", year: 2023, ev: false, tenantId: "T006", driver: "Ahmad Bakr", phone: "+971 52 889 0123", passType: "Monthly", status: "active", registered: "2026-01-08", lastEntry: "2026-04-13 10:05", lastExit: null, currentlyParked: true, level: "B3", slot: "B3-022" },
  { id: "VH010", plate: "X 99999 DXB", make: "Lexus", model: "LX 600", color: "Pearl", year: 2024, ev: false, tenantId: null, driver: "Unknown", phone: null, passType: "Unregistered", status: "flagged", registered: null, lastEntry: "2026-04-13 10:18", lastExit: null, currentlyParked: true, level: "B2", slot: "B2-071" },
  { id: "VH011", plate: "A 99887 DXB", make: "Tesla", model: "Model Y", color: "Black", year: 2024, ev: true, tenantId: "T002", driver: "Omar Tariq", phone: "+971 50 998 8765", passType: "Monthly", status: "active", registered: "2026-02-01", lastEntry: "2026-04-13 08:00", lastExit: null, currentlyParked: true, level: "B1", slot: "B1-056" },
  { id: "VH012", plate: "B 45678 AUH", make: "Range Rover", model: "Velar", color: "Green", year: 2023, ev: false, tenantId: "T004", driver: "Aisha Al Mazrouei", phone: "+971 55 456 7890", passType: "Monthly", status: "blocked", registered: "2025-11-10", lastEntry: null, lastExit: null, currentlyParked: false, level: null, slot: null },
];

export const initAnprEvents = [
  { id: 1, time: "10:24:03", plate: "A 12345 DXB", gate: "Main Entrance A", camera: "CAM-ENT-A", action: "Entry", confidence: 99.2, match: "registered", tenant: "Al Futtaim Motors", driver: "Youssef Al Rashid", level: "B1" },
  { id: 2, time: "10:22:58", plate: "B 98765 AUH", gate: "Main Entrance B", camera: "CAM-ENT-B", action: "Entry", confidence: 98.7, match: "registered", tenant: "IKEA Regional Office", driver: "Fatima Al Mansoori", level: "B2" },
  { id: 3, time: "10:21:15", plate: "X 99999 DXB", gate: "Main Entrance A", camera: "CAM-ENT-A", action: "Entry", confidence: 94.1, match: "unregistered", tenant: null, driver: null, level: "B2" },
  { id: 4, time: "10:19:42", plate: "A 55678 DXB", gate: "Exit Gate 1", camera: "CAM-EXT-1", action: "Exit", confidence: 99.8, match: "registered", tenant: "Deloitte ME", driver: "Sara Khalifa", level: null },
  { id: 5, time: "10:18:30", plate: "D 77890 AJM", gate: "VIP Entrance", camera: "CAM-VIP-E", action: "Entry", confidence: 97.5, match: "visitor", tenant: null, driver: "Khalid bin Omar", level: "B3" },
  { id: 6, time: "10:15:12", plate: "A 33210 DXB", gate: "Main Entrance A", camera: "CAM-ENT-A", action: "Entry", confidence: 99.9, match: "registered", tenant: "Deloitte ME", driver: "Noura Al Shamsi", level: "B2" },
  { id: 7, time: "10:12:45", plate: "C 88901 SHJ", gate: "Main Entrance B", camera: "CAM-ENT-B", action: "Entry", confidence: 96.3, match: "registered", tenant: "WeWork Co-Working", driver: "Ahmad Bakr", level: "B3" },
  { id: 8, time: "10:08:20", plate: "A 99887 DXB", gate: "Main Entrance A", camera: "CAM-ENT-A", action: "Entry", confidence: 99.5, match: "registered", tenant: "IKEA Regional Office", driver: "Omar Tariq", level: "B1" },
  { id: 9, time: "09:55:33", plate: "A 66543 DXB", gate: "Main Entrance A", camera: "CAM-ENT-A", action: "Entry", confidence: 98.2, match: "registered", tenant: "Al Futtaim Motors", driver: "Layla Hassan", level: "B1" },
  { id: 10, time: "09:48:10", plate: "B 45678 AUH", gate: "Main Entrance B", camera: "CAM-ENT-B", action: "Denied", confidence: 99.1, match: "blocked", tenant: "Deloitte ME", driver: "Aisha Al Mazrouei", level: null },
  { id: 11, time: "09:30:00", plate: "UNKNOWN", gate: "Main Entrance A", camera: "CAM-ENT-A", action: "Failed Read", confidence: 32.0, match: "unreadable", tenant: null, driver: null, level: null },
];

export const HOURLY_TRAFFIC = [
  { hour: "06", entries: 12, exits: 2 }, { hour: "07", entries: 68, exits: 5 },
  { hour: "08", entries: 145, exits: 12 }, { hour: "09", entries: 98, exits: 18 },
  { hour: "10", entries: 45, exits: 22 }, { hour: "11", entries: 28, exits: 15 },
  { hour: "12", entries: 18, exits: 35 }, { hour: "13", entries: 22, exits: 42 },
  { hour: "14", entries: 15, exits: 28 }, { hour: "15", entries: 12, exits: 35 },
  { hour: "16", entries: 8, exits: 55 }, { hour: "17", entries: 5, exits: 120 },
  { hour: "18", entries: 3, exits: 85 }, { hour: "19", entries: 2, exits: 25 },
];

export const DAILY_REVENUE = [
  { day: "Mon", parking: 8500, charging: 3200 }, { day: "Tue", parking: 9200, charging: 3800 },
  { day: "Wed", parking: 8800, charging: 3500 }, { day: "Thu", parking: 9500, charging: 4100 },
  { day: "Fri", parking: 4200, charging: 1800 }, { day: "Sat", parking: 3800, charging: 1500 },
  { day: "Sun", parking: 6500, charging: 2800 },
];
