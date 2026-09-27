/**
 * CH3OH Bike Telemetry & Mobility Engine
 * Features:
 * 1. Odometer Monotonicity & Handover Chain
 * 2. Suspicious Gap Detection
 * 3. Individual Rider vs Passenger Distance Tracking
 * 4. Full-Tank Fuel Efficiency & Rolling Cost Allocation
 * 5. Maintenance Service Alarms
 */

export interface Bike {
  id: string;
  groupId: string;
  name: string;
  model: string;
  regNumber: string;
  photoUrl?: string;
  currentOdometer: number; // in km
  lastParkedBy?: string;
  status: "parked" | "in_ride" | "maintenance";
}

export interface Ride {
  id: string;
  bikeId: string;
  riderId: string;
  startOdometer: number;
  endOdometer: number;
  distance: number;
  rideDate: string;
  passengers: string[]; // user IDs
  fuelCostShare?: number; // paise
  notes?: string;
}

export interface FuelLog {
  id: string;
  bikeId: string;
  filledById: string;
  litres: number;
  totalCost: number; // in paise
  odometerAtFill: number;
  isFullTank: boolean;
  loggedAt: string;
}

export interface OdometerVerificationResult {
  isValid: boolean;
  gapDistance: number;
  isGapSuspicious: boolean;
  message: string;
}

export interface MaintenanceAlarm {
  serviceName: string;
  intervalKm: number;
  kmSinceLastService: number;
  isDue: boolean;
  remainingKm: number;
}

export interface MemberMobilityStats {
  userId: string;
  totalRiderKm: number;
  totalPassengerKm: number;
  totalMobilityKm: number;
  tripCount: number;
}

/**
 * Verify start odometer against last parked odometer
 */
export function verifyOdometerStart(
  lastParkedOdometer: number,
  startOdometer: number,
  toleranceKm: number = 0.3
): OdometerVerificationResult {
  const gap = Number((startOdometer - lastParkedOdometer).toFixed(2));

  if (gap < 0) {
    return {
      isValid: false,
      gapDistance: gap,
      isGapSuspicious: true,
      message: `Physical anomaly: Start reading (${startOdometer} km) is lower than last parked reading (${lastParkedOdometer} km). Odometers cannot reverse.`,
    };
  }

  if (gap > toleranceKm) {
    return {
      isValid: true,
      gapDistance: gap,
      isGapSuspicious: true,
      message: `Unverified Odometer Gap of ${gap} km detected. This excursion will be flagged for group co-verification.`,
    };
  }

  return {
    isValid: true,
    gapDistance: gap,
    isGapSuspicious: false,
    message: "Odometer chain verified. Handover confirmed.",
  };
}

/**
 * Calculate individual mobility statistics across rides
 */
export function calculateMemberMobility(
  rides: Ride[],
  memberIds: string[]
): Map<string, MemberMobilityStats> {
  const statsMap = new Map<string, MemberMobilityStats>();

  for (const id of memberIds) {
    statsMap.set(id, {
      userId: id,
      totalRiderKm: 0,
      totalPassengerKm: 0,
      totalMobilityKm: 0,
      tripCount: 0,
    });
  }

  for (const ride of rides) {
    const dist = ride.endOdometer - ride.startOdometer;
    if (dist <= 0) continue;

    // 1. Primary Rider
    const riderStats = statsMap.get(ride.riderId);
    if (riderStats) {
      riderStats.totalRiderKm += dist;
      riderStats.totalMobilityKm += dist;
      riderStats.tripCount += 1;
    }

    // 2. Passengers
    for (const passengerId of ride.passengers) {
      const pStats = statsMap.get(passengerId);
      if (pStats) {
        pStats.totalPassengerKm += dist;
        pStats.totalMobilityKm += dist;
        pStats.tripCount += 1;
      }
    }
  }

  // Format to 1 decimal place
  for (const stats of statsMap.values()) {
    stats.totalRiderKm = Number(stats.totalRiderKm.toFixed(1));
    stats.totalPassengerKm = Number(stats.totalPassengerKm.toFixed(1));
    stats.totalMobilityKm = Number(stats.totalMobilityKm.toFixed(1));
  }

  return statsMap;
}

/**
 * Calculate rolling fuel efficiency (km/L) between consecutive full-tank refills
 */
export function calculateMileage(fuelLogs: FuelLog[]): number {
  const fullTankLogs = fuelLogs
    .filter((log) => log.isFullTank)
    .sort((a, b) => new Date(a.loggedAt).getTime() - new Date(b.loggedAt).getTime());

  if (fullTankLogs.length < 2) {
    return 35.0; // Standard nominal fallback in km/L
  }

  let totalDistance = 0;
  let totalLitres = 0;

  for (let i = 1; i < fullTankLogs.length; i++) {
    const distance = fullTankLogs[i].odometerAtFill - fullTankLogs[i - 1].odometerAtFill;
    if (distance > 0) {
      totalDistance += distance;
      totalLitres += fullTankLogs[i].litres;
    }
  }

  if (totalLitres === 0) return 35.0;
  return Number((totalDistance / totalLitres).toFixed(1));
}

/**
 * Compute scheduled maintenance alarms
 */
export function getMaintenanceAlarms(
  currentOdometer: number,
  lastServicedMap?: Record<string, number>
): MaintenanceAlarm[] {
  const intervals = [
    { serviceName: "Chain Lubrication & Inspection", intervalKm: 1000 },
    { serviceName: "Engine Oil Replacement", intervalKm: 3000 },
    { serviceName: "Air Filter & Spark Plug Cleaning", intervalKm: 5000 },
    { serviceName: "Brake Pad & Fluid Check", intervalKm: 8000 },
  ];

  return intervals.map((item) => {
    const lastServiced = lastServicedMap?.[item.serviceName];
    const kmSinceLast =
      lastServiced !== undefined && lastServiced >= 0
        ? Math.max(0, currentOdometer - lastServiced)
        : currentOdometer % item.intervalKm;

    const remaining = Math.max(0, item.intervalKm - (kmSinceLast % item.intervalKm));
    return {
      serviceName: item.serviceName,
      intervalKm: item.intervalKm,
      kmSinceLastService: Number(kmSinceLast.toFixed(1)),
      isDue: remaining <= 100,
      remainingKm: Number(remaining.toFixed(1)),
    };
  });
}
