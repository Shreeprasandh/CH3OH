"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bike as BikeIcon,
  Fuel,
  Shield,
  AlertTriangle,
  FileText,
  User,
  Check,
  Plus,
  X,
  Gauge,
  Wrench,
  Users,
} from "lucide-react";
import {
  Bike,
  Ride,
  FuelLog,
  verifyOdometerStart,
  calculateMemberMobility,
  calculateMileage,
  getMaintenanceAlarms,
} from "@/lib/bike-engine";
import { formatCurrency } from "@/lib/split-engine";

interface BikeModuleProps {
  bike: Bike;
  rides: Ride[];
  fuelLogs: FuelLog[];
  members: Array<{ id: string; name: string }>;
  currentUserId: string;
  onAddRide: (ride: {
    bikeId: string;
    riderId: string;
    startOdometer: number;
    endOdometer: number;
    passengers: string[];
    notes?: string;
  }) => void;
  onAddFuel: (fuel: {
    bikeId: string;
    litres: number;
    totalCostPaise: number;
    odometerAtFill: number;
    isFullTank: boolean;
  }) => void;
}

export const BikeModule: React.FC<BikeModuleProps> = ({
  bike,
  rides,
  fuelLogs,
  members,
  currentUserId,
  onAddRide,
  onAddFuel,
}) => {
  const [isRideModalOpen, setIsRideModalOpen] = useState(false);
  const [isFuelModalOpen, setIsFuelModalOpen] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);

  // Ride Form State
  const [startOdo, setStartOdo] = useState<string>(bike.currentOdometer.toString());
  const [endOdo, setEndOdo] = useState<string>("");
  const [selectedPassengers, setSelectedPassengers] = useState<string[]>([]);
  const [rideNotes, setRideNotes] = useState<string>("");

  // Fuel Form State
  const [fuelLitres, setFuelLitres] = useState<string>("");
  const [fuelCostRupees, setFuelCostRupees] = useState<string>("");
  const [fuelOdo, setFuelOdo] = useState<string>(bike.currentOdometer.toString());
  const [isFullTank, setIsFullTank] = useState<boolean>(true);

  // Computations
  const memberMobility = calculateMemberMobility(
    rides,
    members.map((m) => m.id)
  );
  const rollingMileage = calculateMileage(fuelLogs);
  const maintenanceAlarms = getMaintenanceAlarms(bike.currentOdometer);

  // Odometer Verification
  const verification = verifyOdometerStart(bike.currentOdometer, parseFloat(startOdo) || bike.currentOdometer);

  const handleStartStopRide = (e: React.FormEvent) => {
    e.preventDefault();
    const start = parseFloat(startOdo);
    const end = parseFloat(endOdo);
    if (isNaN(start) || isNaN(end) || end < start) return;

    onAddRide({
      bikeId: bike.id,
      riderId: currentUserId,
      startOdometer: start,
      endOdometer: end,
      passengers: selectedPassengers,
      notes: rideNotes,
    });

    setIsRideModalOpen(false);
    setEndOdo("");
    setRideNotes("");
    setSelectedPassengers([]);
  };

  const handleLogFuel = (e: React.FormEvent) => {
    e.preventDefault();
    const litres = parseFloat(fuelLitres);
    const costRupees = parseFloat(fuelCostRupees);
    const odo = parseFloat(fuelOdo);
    if (isNaN(litres) || isNaN(costRupees) || isNaN(odo)) return;

    onAddFuel({
      bikeId: bike.id,
      litres,
      totalCostPaise: Math.round(costRupees * 100),
      odometerAtFill: odo,
      isFullTank,
    });

    setIsFuelModalOpen(false);
    setFuelLitres("");
    setFuelCostRupees("");
  };

  const togglePassenger = (id: string) => {
    setSelectedPassengers((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full flex flex-col gap-4 select-none">
      {/* 1. Main Bike Hero Card */}
      <div className="p-5 rounded-3xl bg-[#EAE2D6] border border-[#DDD4C6]/80 shadow-xs flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#8B9A6E] text-white flex items-center justify-center shadow-xs">
              <BikeIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#1C241B] tracking-tight">{bike.name}</h2>
              <div className="text-xs text-[#535D4D] font-medium flex items-center gap-1.5 mt-0.5">
                <span className="font-mono font-bold text-[#1C241B] bg-[#F7F2EB] px-2 py-0.5 rounded-md border border-[#DDD4C6]/60">
                  {bike.regNumber}
                </span>
                <span>•</span>
                <span>{bike.model}</span>
              </div>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F7F2EB] text-xs font-bold uppercase tracking-wider text-[#3F633B]">
            <span className="w-2 h-2 rounded-full bg-[#3F633B] animate-pulse" />
            {bike.status}
          </span>
        </div>

        {/* Telemetry Numbers Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <div className="p-3 rounded-2xl bg-[#F7F2EB] border border-[#DDD4C6]/60">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#535D4D]">
              Current Odometer
            </div>
            <div className="text-xl font-black text-[#1C241B] tabular-nums mt-0.5">
              {bike.currentOdometer.toLocaleString()}{" "}
              <span className="text-xs font-semibold text-[#535D4D]">km</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#F7F2EB] border border-[#DDD4C6]/60">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#535D4D]">
              Rolling Mileage
            </div>
            <div className="text-xl font-black text-[#3F633B] tabular-nums mt-0.5">
              {rollingMileage}{" "}
              <span className="text-xs font-semibold text-[#535D4D]">km/L</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#F7F2EB] border border-[#DDD4C6]/60 col-span-2 sm:col-span-1">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#535D4D]">
              Last Handover By
            </div>
            <div className="text-sm font-bold text-[#1C241B] truncate mt-1">
              {members.find((m) => m.id === bike.lastParkedBy)?.name || "Group Pool"}
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={() => {
              setStartOdo(bike.currentOdometer.toString());
              setIsRideModalOpen(true);
            }}
            className="py-2.5 px-3 rounded-2xl bg-[#8B9A6E] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs hover:bg-[#647348] transition-colors"
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>Log Ride</span>
          </button>

          <button
            onClick={() => {
              setFuelOdo(bike.currentOdometer.toString());
              setIsFuelModalOpen(true);
            }}
            className="py-2.5 px-3 rounded-2xl bg-[#F7F2EB] text-[#1C241B] border border-[#DDD4C6] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#EAE2D6] transition-colors"
          >
            <Fuel className="w-3.5 h-3.5 text-[#8B9A6E]" />
            <span>Add Petrol</span>
          </button>

          <button
            onClick={() => setIsVaultOpen(true)}
            className="py-2.5 px-3 rounded-2xl bg-[#F7F2EB] text-[#1C241B] border border-[#DDD4C6] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#EAE2D6] transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-[#8B9A6E]" />
            <span>Doc Vault</span>
          </button>
        </div>
      </div>

      {/* 2. Suspicious Odometer Gap Warning Card */}
      {verification.isGapSuspicious && (
        <div className="p-4 rounded-3xl bg-[#984A3B]/10 border border-[#984A3B]/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#984A3B] shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-[#984A3B] block">Odometer Anomaly Detected</span>
            <p className="text-[#535D4D] mt-0.5">{verification.message}</p>
          </div>
        </div>
      )}

      {/* 3. Individual Member Mobility Ledger (Km Ridden as Rider vs Passenger) */}
      <div className="p-5 rounded-3xl bg-[#EAE2D6] border border-[#DDD4C6]/80 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#535D4D]">
            Individual Mobility Ledger (Km Share)
          </span>
          <Users className="w-4 h-4 text-[#8B9A6E]" />
        </div>

        <div className="flex flex-col gap-2">
          {members.map((member) => {
            const stats = memberMobility.get(member.id) || {
              totalRiderKm: 0,
              totalPassengerKm: 0,
              totalMobilityKm: 0,
              tripCount: 0,
            };

            return (
              <div
                key={member.id}
                className="p-3 rounded-2xl bg-[#F7F2EB] border border-[#DDD4C6]/60 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-[#1C241B]">
                    {member.name} {member.id === currentUserId && "(You)"}
                  </div>
                  <div className="text-[10px] text-[#535D4D] flex items-center gap-2 mt-0.5">
                    <span>Rider: {stats.totalRiderKm} km</span>
                    <span>•</span>
                    <span>Pillion: {stats.totalPassengerKm} km</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black tabular-nums text-[#1C241B]">
                    {stats.totalMobilityKm} km
                  </div>
                  <div className="text-[10px] text-[#848F7E] font-medium">
                    {stats.tripCount} trips
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Maintenance Service Intervals */}
      <div className="p-4 rounded-3xl bg-[#EAE2D6] border border-[#DDD4C6]/80 shadow-xs flex flex-col gap-2.5">
        <div className="text-[10px] font-bold tracking-widest uppercase text-[#535D4D] flex items-center gap-1.5">
          <Wrench className="w-3.5 h-3.5 text-[#8B9A6E]" />
          <span>Scheduled Service Countdown</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {maintenanceAlarms.map((alarm, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-[#F7F2EB] border border-[#DDD4C6]/50 flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-semibold text-[#1C241B]">{alarm.serviceName}</div>
                <div className="text-[10px] text-[#535D4D]">Every {alarm.intervalKm} km</div>
              </div>
              <span
                className={`font-black tabular-nums ${
                  alarm.isDue ? "text-[#984A3B]" : "text-[#3F633B]"
                }`}
              >
                in {alarm.remainingKm} km
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Start/Stop Ride Modal */}
      <AnimatePresence>
        {isRideModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-3xl bg-[#F7F2EB] border border-[#DDD4C6] shadow-2xl flex flex-col gap-4 select-none"
            >
              <div className="flex items-center justify-between border-b border-[#DDD4C6]/60 pb-3">
                <div className="flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-[#8B9A6E]" />
                  <h3 className="text-base font-bold text-[#1C241B]">Log Bike Ride Handover</h3>
                </div>
                <button
                  onClick={() => setIsRideModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#EAE2D6] flex items-center justify-center text-[#535D4D]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleStartStopRide} className="flex flex-col gap-3">
                <div>
                  <label className="text-[10px] font-bold tracking-widest uppercase text-[#535D4D] block mb-1">
                    Start Odometer (Handover Confirmation)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={startOdo}
                    onChange={(e) => setStartOdo(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-2xl bg-[#EAE2D6] border border-[#DDD4C6] font-bold text-sm text-[#1C241B]"
                  />
                  <span className="text-[10px] text-[#535D4D] mt-1 block">
                    Last parked at: {bike.currentOdometer} km
                  </span>
                </div>

                <div>
                  <label className="text-[10px] font-bold tracking-widest uppercase text-[#535D4D] block mb-1">
                    End Odometer (Upon Stopping)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min={parseFloat(startOdo) || bike.currentOdometer}
                    value={endOdo}
                    onChange={(e) => setEndOdo(e.target.value)}
                    placeholder="Enter final meter reading"
                    required
                    className="w-full px-3 py-2 rounded-2xl bg-[#EAE2D6] border border-[#DDD4C6] font-bold text-sm text-[#1C241B]"
                  />
                </div>

                {/* Co-Riders / Passengers */}
                <div>
                  <label className="text-[10px] font-bold tracking-widest uppercase text-[#535D4D] block mb-1">
                    Who rode with you? (Pillion / Co-Riders)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {members
                      .filter((m) => m.id !== currentUserId)
                      .map((m) => {
                        const isSelected = selectedPassengers.includes(m.id);
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => togglePassenger(m.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                              isSelected
                                ? "bg-[#8B9A6E] text-white shadow-2xs"
                                : "bg-[#EAE2D6] text-[#535D4D] hover:bg-[#DDD4C6]"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                            <span>{m.name}</span>
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Trip Distance Preview */}
                {parseFloat(endOdo) > parseFloat(startOdo) && (
                  <div className="p-3 rounded-2xl bg-[#8B9A6E]/15 border border-[#8B9A6E]/30 text-center text-xs">
                    <span className="text-[#535D4D]">Total Trip Distance: </span>
                    <span className="font-black text-[#1C241B]">
                      {(parseFloat(endOdo) - parseFloat(startOdo)).toFixed(1)} km
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-[#8B9A6E] text-white font-bold text-sm shadow-xs hover:bg-[#647348] mt-2 transition-colors cursor-pointer"
                >
                  Confirm & Commit Ride
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. Fuel Log Modal */}
      <AnimatePresence>
        {isFuelModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-3xl bg-[#F7F2EB] border border-[#DDD4C6] shadow-2xl flex flex-col gap-4 select-none"
            >
              <div className="flex items-center justify-between border-b border-[#DDD4C6]/60 pb-3">
                <div className="flex items-center gap-2">
                  <Fuel className="w-5 h-5 text-[#8B9A6E]" />
                  <h3 className="text-base font-bold text-[#1C241B]">Log Petrol / Fuel Refill</h3>
                </div>
                <button
                  onClick={() => setIsFuelModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#EAE2D6] flex items-center justify-center text-[#535D4D]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleLogFuel} className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold tracking-widest uppercase text-[#535D4D] block mb-1">
                      Litres Filled
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 5.4"
                      value={fuelLitres}
                      onChange={(e) => setFuelLitres(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-2xl bg-[#EAE2D6] border border-[#DDD4C6] font-bold text-sm text-[#1C241B]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold tracking-widest uppercase text-[#535D4D] block mb-1">
                      Total Cost (₹)
                    </label>
                    <input
                      type="number"
                      step="1"
                      placeholder="e.g. 550"
                      value={fuelCostRupees}
                      onChange={(e) => setFuelCostRupees(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-2xl bg-[#EAE2D6] border border-[#DDD4C6] font-bold text-sm text-[#1C241B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold tracking-widest uppercase text-[#535D4D] block mb-1">
                    Odometer at Fuel Pump
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={fuelOdo}
                    onChange={(e) => setFuelOdo(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-2xl bg-[#EAE2D6] border border-[#DDD4C6] font-bold text-sm text-[#1C241B]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="fullTank"
                    checked={isFullTank}
                    onChange={(e) => setIsFullTank(e.target.checked)}
                    className="accent-[#8B9A6E] rounded-md cursor-pointer"
                  />
                  <label htmlFor="fullTank" className="text-xs font-semibold text-[#1C241B] cursor-pointer">
                    Full Tank (Used to accurately calculate true mileage)
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-[#8B9A6E] text-white font-bold text-sm shadow-xs hover:bg-[#647348] mt-2 transition-colors cursor-pointer"
                >
                  Record Fuel & Add to Group
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. Document Vault Modal */}
      <AnimatePresence>
        {isVaultOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-3xl bg-[#F7F2EB] border border-[#DDD4C6] shadow-2xl flex flex-col gap-4 select-none"
            >
              <div className="flex items-center justify-between border-b border-[#DDD4C6]/60 pb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#8B9A6E]" />
                  <div>
                    <h3 className="text-base font-bold text-[#1C241B]">Encrypted Document Vault</h3>
                    <p className="text-[10px] text-[#535D4D]">Emergency Roadside Documents</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsVaultOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#EAE2D6] flex items-center justify-center text-[#535D4D]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {[
                  { title: "Registration Certificate (RC)", status: "Active · Signed Token", expiry: "2031-08-14" },
                  { title: "Comprehensive Insurance", status: "Active · Policy #BA-84920", expiry: "2027-04-12" },
                  { title: "Pollution Under Control (PUC)", status: "Valid until 2027-01-10", expiry: "2027-01-10" },
                ].map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-[#EAE2D6] border border-[#DDD4C6]/60 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-[#8B9A6E]" />
                      <div>
                        <div className="font-bold text-[#1C241B]">{doc.title}</div>
                        <div className="text-[10px] text-[#535D4D]">{doc.status}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Opening secure signed URL for ${doc.title}`)}
                      className="px-2.5 py-1 rounded-lg bg-[#8B9A6E] text-white text-[10px] font-bold shadow-2xs hover:bg-[#647348]"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => alert("Upload document flow with RLS")}
                className="w-full py-2.5 rounded-2xl bg-[#F7F2EB] text-[#1C241B] border border-[#DDD4C6] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#EAE2D6]"
              >
                <Plus className="w-3.5 h-3.5 text-[#8B9A6E]" />
                <span>Upload New Certificate</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
