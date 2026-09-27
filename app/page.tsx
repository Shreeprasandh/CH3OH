"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserCheck,
  Activity,
  User,
  Plus,
  Bike,
  Sparkles,
  CheckCircle2,
  X,
  CreditCard,
  Banknote,
  Send,
} from "lucide-react";

// Components
import { TopGroupBanner, GroupData } from "@/components/dashboard/TopGroupBanner";
import { BalanceSummary, MemberBalance } from "@/components/dashboard/BalanceSummary";
import { ExpenseLog, ExpenseItem } from "@/components/dashboard/ExpenseLog";
import { AddExpenseModal } from "@/components/dashboard/AddExpenseModal";
import { WeeklyCalendarStrip } from "@/components/calendar/WeeklyCalendarStrip";
import { WallCalendarModal } from "@/components/calendar/WallCalendarModal";
import { BikeModule } from "@/components/bike/BikeModule";
import { FriendsTab, FriendItem } from "@/components/friends/FriendsTab";
import { ActivityTab, ActivityEvent } from "@/components/activity/ActivityTab";
import { AccountTab, UserProfile } from "@/components/account/AccountTab";
import { CH3OHWidget, WidgetData } from "@/components/widgets/CH3OHWidget";
import { WidgetStudio } from "@/components/widgets/WidgetStudio";

// Engines
import { simplifyDebts, SimplifiedTransaction, SplitMode, formatCurrency } from "@/lib/split-engine";
import { Bike as BikeType, Ride, FuelLog } from "@/lib/bike-engine";
import { expenseToCalendarEvent, saveLocalCalendarEvents } from "@/lib/calendar-sync";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"group" | "friends" | "activity" | "account">("group");
  const [groupSubTab, setGroupSubTab] = useState<"expenses" | "bike">("expenses");

  // Modals
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isWallCalendarOpen, setIsWallCalendarOpen] = useState(false);
  const [isWidgetStudioOpen, setIsWidgetStudioOpen] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | undefined>();
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [settleTarget, setSettleTarget] = useState<{ userId?: string; amountPaise?: number }>({});
  const [settleMethod, setSettleMethod] = useState("UPI");

  // Current User
  const currentUserId = "user-me";
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Sir",
    birthday: "2002-05-18",
    address: "MG Road, Indiranagar, Bengaluru, Karnataka",
    email: "shree@ch3oh.internal",
  });

  // Master Group State
  const [group, setGroup] = useState<GroupData>({
    id: "grp-1",
    name: "The Fellowship Apartment",
    bannerImage: "1.jpg",
    currency: "INR",
    members: [
      { id: "user-me", name: "Sir (You)" },
      { id: "user-alex", name: "Alex" },
      { id: "user-brian", name: "Brian" },
      { id: "user-chloe", name: "Chloe" },
    ],
  });

  // Master Expense State
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    {
      id: "exp-1",
      title: "Shell V-Power Petrol Refill",
      category: "fuel",
      amountPaise: 55000, // ₹550.00
      currency: "INR",
      paidByName: "Sir (You)",
      expenseDate: "2026-09-24",
      splitMode: "equal",
      splits: [
        { userId: "user-me", userName: "Sir (You)", amountPaise: 13750 },
        { userId: "user-alex", userName: "Alex", amountPaise: 13750 },
        { userId: "user-brian", userName: "Brian", amountPaise: 13750 },
        { userId: "user-chloe", userName: "Chloe", amountPaise: 13750 },
      ],
      createdAt: "2026-09-24T18:30:00Z",
    },
    {
      id: "exp-2",
      title: "Weekend Dinner & Biryani",
      category: "food",
      amountPaise: 180000, // ₹1,800.00
      currency: "INR",
      paidByName: "Alex",
      expenseDate: "2026-09-26",
      splitMode: "equal",
      splits: [
        { userId: "user-me", userName: "Sir (You)", amountPaise: 45000 },
        { userId: "user-alex", userName: "Alex", amountPaise: 45000 },
        { userId: "user-brian", userName: "Brian", amountPaise: 45000 },
        { userId: "user-chloe", userName: "Chloe", amountPaise: 45000 },
      ],
      createdAt: "2026-09-26T21:15:00Z",
    },
  ]);

  // Master Bike State
  const [bike, setBike] = useState<BikeType>({
    id: "bike-1",
    groupId: "grp-1",
    name: "Royal Enfield Hunter 350",
    model: "Hunter 350 Dapper Ash",
    regNumber: "KA-04-ME-4821",
    currentOdometer: 14285.4,
    lastParkedBy: "user-alex",
    status: "parked",
  });

  const [bikeRides, setBikeRides] = useState<Ride[]>([
    {
      id: "ride-1",
      bikeId: "bike-1",
      riderId: "user-alex",
      startOdometer: 14240.0,
      endOdometer: 14285.4,
      distance: 45.4,
      rideDate: "2026-09-25",
      passengers: ["user-brian"],
      notes: "Airport road commute",
    },
  ]);

  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([
    {
      id: "fuel-1",
      bikeId: "bike-1",
      filledById: "user-me",
      litres: 12.5,
      totalCost: 125000,
      odometerAtFill: 13850.0,
      isFullTank: true,
      loggedAt: "2026-09-15T10:00:00Z",
    },
    {
      id: "fuel-2",
      bikeId: "bike-1",
      filledById: "user-me",
      litres: 11.2,
      totalCost: 112000,
      odometerAtFill: 14240.0,
      isFullTank: true,
      loggedAt: "2026-09-24T18:30:00Z",
    },
  ]);

  // Friends State
  const [friends, setFriends] = useState<FriendItem[]>([
    { id: "user-alex", name: "Alex", phone: "+91 98450 11223", balancePaise: -31250 },
    { id: "user-brian", name: "Brian", phone: "+91 98765 22334", balancePaise: 13750 },
    { id: "user-chloe", name: "Chloe", phone: "+91 97400 33445", balancePaise: 13750 },
  ]);

  // Activity Feed State
  const [activities, setActivities] = useState<ActivityEvent[]>([
    {
      id: "act-1",
      type: "expense",
      title: "Weekend Dinner & Biryani added",
      description: "Alex added ₹1,800.00 split equally among 4 members",
      amountPaise: 180000,
      timestamp: "Yesterday, 9:15 PM",
    },
    {
      id: "act-2",
      type: "fuel",
      title: "Petrol Refill for Hunter 350",
      description: "Sir filled 11.2L (₹1,120.00) at 14,240.0 km",
      amountPaise: 112000,
      timestamp: "3 days ago",
    },
    {
      id: "act-3",
      type: "ride",
      title: "Bike Ride Logged",
      description: "Alex completed 45.4 km with Brian (Pillion)",
      timestamp: "2 days ago",
    },
  ]);

  // Settlements State
  const [settlements, setSettlements] = useState<
    Array<{ id: string; payerId: string; payeeId: string; amountPaise: number }>
  >([]);

  // Dynamic Member Names Map
  const memberNames: Record<string, string> = useMemo(() => {
    const map: Record<string, string> = {};
    group.members.forEach((m) => {
      map[m.id] = m.name;
    });
    return map;
  }, [group.members]);

  // Dynamic Pairwise Member Balances
  const memberBalances: MemberBalance[] = useMemo(() => {
    return group.members
      .filter((m) => m.id !== currentUserId)
      .map((member) => {
        let balance = 0;

        // Calculate from expenses
        for (const exp of expenses) {
          const payerId = exp.paidById || (exp.paidByName.includes("Sir") ? "user-me" : "user-alex");
          if (payerId === currentUserId) {
            const split = exp.splits.find((s) => s.userId === member.id);
            if (split) balance += split.amountPaise;
          } else if (payerId === member.id) {
            const split = exp.splits.find((s) => s.userId === currentUserId);
            if (split) balance -= split.amountPaise;
          }
        }

        // Calculate from settlements
        for (const set of settlements) {
          if (set.payerId === currentUserId && set.payeeId === member.id) {
            balance += set.amountPaise;
          } else if (set.payerId === member.id && set.payeeId === currentUserId) {
            balance -= set.amountPaise;
          }
        }

        return {
          userId: member.id,
          name: member.name,
          amountPaise: balance,
        };
      });
  }, [group.members, expenses, settlements, currentUserId]);

  const totalOwedToYou = useMemo(() => {
    return memberBalances
      .filter((m) => m.amountPaise > 0)
      .reduce((sum, m) => sum + m.amountPaise, 0);
  }, [memberBalances]);

  const totalYouOwe = useMemo(() => {
    return memberBalances
      .filter((m) => m.amountPaise < 0)
      .reduce((sum, m) => sum + Math.abs(m.amountPaise), 0);
  }, [memberBalances]);

  const netBalancePaise = totalOwedToYou - totalYouOwe;

  // Dynamic Net Balances Map across all members for Min-Cash-Flow Simplification
  const netBalanceMap = useMemo(() => {
    const map = new Map<string, number>();
    group.members.forEach((m) => map.set(m.id, 0));

    for (const exp of expenses) {
      const payerId = exp.paidById || (exp.paidByName.includes("Sir") ? "user-me" : "user-alex");
      map.set(payerId, (map.get(payerId) || 0) + exp.amountPaise);
      for (const s of exp.splits) {
        map.set(s.userId, (map.get(s.userId) || 0) - s.amountPaise);
      }
    }

    for (const set of settlements) {
      map.set(set.payerId, (map.get(set.payerId) || 0) + set.amountPaise);
      map.set(set.payeeId, (map.get(set.payeeId) || 0) - set.amountPaise);
    }

    return map;
  }, [group.members, expenses, settlements]);

  const simplifiedTransactions: SimplifiedTransaction[] = useMemo(() => {
    return simplifyDebts(netBalanceMap);
  }, [netBalanceMap]);

  // Live Widget Data
  const widgetData: WidgetData = {
    netBalancePaise,
    pendingDebtsCount: memberBalances.filter((m) => m.amountPaise !== 0).length,
    bikeName: bike.name,
    bikeOdometer: bike.currentOdometer,
    bikeStatus: bike.status,
    bikeMileage: 34.8,
    onAddExpense: () => setIsAddExpenseOpen(true),
    onStartRide: () => {
      setActiveTab("group");
      setGroupSubTab("bike");
    },
    onSettleUp: () => setIsSettleModalOpen(true),
  };

  // Add Expense Handler
  const handleAddExpense = (newExp: any) => {
    const expenseItem: ExpenseItem = {
      id: `exp-${Date.now()}`,
      title: newExp.title,
      category: newExp.category,
      amountPaise: newExp.amountPaise,
      currency: newExp.currency,
      paidById: newExp.paidById,
      paidByName: memberNames[newExp.paidById] || "Unknown",
      expenseDate: newExp.expenseDate,
      splitMode: newExp.splitMode,
      splits: newExp.splits.map((s: any) => ({
        userId: s.userId,
        userName: memberNames[s.userId] || "Unknown",
        amountPaise: s.amount,
      })),
      createdAt: new Date().toISOString(),
    };

    setExpenses([expenseItem, ...expenses]);

    // Sync to Calendar
    const calEvent = expenseToCalendarEvent(
      {
        id: expenseItem.id,
        groupId: group.id,
        title: expenseItem.title,
        amount: expenseItem.amountPaise,
        currency: expenseItem.currency,
        expenseDate: expenseItem.expenseDate,
        paidByName: expenseItem.paidByName,
      },
      currentUserId,
      newExp.paidById
    );
    saveLocalCalendarEvents([calEvent]);

    // Add Activity
    setActivities([
      {
        id: `act-${Date.now()}`,
        type: "expense",
        title: `${newExp.title} added`,
        description: `Logged on ${newExp.expenseDate} (${newExp.currency} ${(newExp.amountPaise / 100).toFixed(0)})`,
        amountPaise: newExp.amountPaise,
        timestamp: "Just now",
      },
      ...activities,
    ]);
  };

  // Add Bike Ride Handler
  const handleAddRide = (rideData: any) => {
    const dist = Number((rideData.endOdometer - rideData.startOdometer).toFixed(1));
    const newRide: Ride = {
      id: `ride-${Date.now()}`,
      bikeId: rideData.bikeId,
      riderId: rideData.riderId,
      startOdometer: rideData.startOdometer,
      endOdometer: rideData.endOdometer,
      distance: dist,
      rideDate: new Date().toISOString().split("T")[0],
      passengers: rideData.passengers,
      notes: rideData.notes,
    };

    setBikeRides([newRide, ...bikeRides]);
    setBike((prev) => ({
      ...prev,
      currentOdometer: rideData.endOdometer,
      lastParkedBy: rideData.riderId,
    }));

    setActivities([
      {
        id: `act-${Date.now()}`,
        type: "ride",
        title: `Ride Logged: +${dist} km`,
        description: `Ended at ${rideData.endOdometer} km with ${rideData.passengers.length} passengers`,
        timestamp: "Just now",
      },
      ...activities,
    ]);
  };

  // Add Fuel Handler
  const handleAddFuel = (fuelData: any) => {
    const newFuel: FuelLog = {
      id: `fuel-${Date.now()}`,
      bikeId: fuelData.bikeId,
      filledById: currentUserId,
      litres: fuelData.litres,
      totalCost: fuelData.totalCostPaise,
      odometerAtFill: fuelData.odometerAtFill,
      isFullTank: fuelData.isFullTank,
      loggedAt: new Date().toISOString(),
    };

    setFuelLogs([newFuel, ...fuelLogs]);
    setActivities([
      {
        id: `act-${Date.now()}`,
        type: "fuel",
        title: `Fuel Refill: ${fuelData.litres}L`,
        description: `Cost: ₹${(fuelData.totalCostPaise / 100).toFixed(0)} at ${fuelData.odometerAtFill} km`,
        amountPaise: fuelData.totalCostPaise,
        timestamp: "Just now",
      },
      ...activities,
    ]);
  };

  // Settle Up Submit
  const handleSettleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = settleTarget.amountPaise || 31250;
    const targetId = settleTarget.userId || "user-alex";

    // Record settlement in dynamic ledger
    setSettlements((prev) => [
      ...prev,
      {
        id: `set-${Date.now()}`,
        payerId: currentUserId,
        payeeId: targetId,
        amountPaise: amt,
      },
    ]);

    setIsSettleModalOpen(false);
    setActivities([
      {
        id: `act-${Date.now()}`,
        type: "settlement",
        title: "Settlement Voucher Sealed",
        description: `Paid ${formatCurrency(amt)} to ${memberNames[targetId] || "Member"} via ${settleMethod}`,
        amountPaise: amt,
        timestamp: "Just now",
      },
      ...activities,
    ]);
  };

  return (
    <div className="min-h-screen bg-[#F7F2EB] flex flex-col items-center">
      {/* 1. Header Bar with Logo and Mini Pill Widget */}
      <header className="sticky top-0 z-40 w-full max-w-xl bg-[#F7F2EB]/90 backdrop-blur-md px-4 py-3 border-b border-[#DDD4C6]/70 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-xl overflow-hidden shadow-2xs">
            <Image
              src="/logo/logowithouttextandbg.png"
              alt="CH3OH Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <span className="text-sm font-black tracking-widest text-[#1C241B]">CH3OH</span>
            <span className="text-[9px] uppercase tracking-wider block text-[#535D4D] font-bold">
              Ledger & Mobility
            </span>
          </div>
        </div>

        {/* Minimal Pill Widget */}
        <CH3OHWidget
          size="pill"
          data={widgetData}
          className="cursor-pointer"
          onClick={() => setIsWidgetStudioOpen(true)}
        />
      </header>

      {/* 2. Main Content Container */}
      <main className="w-full max-w-xl p-4 sm:p-5 flex flex-col gap-5 pb-24">
        {/* GROUP TAB (Home) */}
        {activeTab === "group" && (
          <div className="flex flex-col gap-4">
            {/* Top Banner with Artwork Backdrop */}
            <TopGroupBanner group={group} onOpenInviteModal={() => setActiveTab("friends")} />

            {/* Sub-Tab Navigation: Expenses vs Bike */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#EAE2D6] border border-[#DDD4C6]">
              <button
                onClick={() => setGroupSubTab("expenses")}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  groupSubTab === "expenses"
                    ? "bg-[#8B9A6E] text-white shadow-xs"
                    : "text-[#535D4D] hover:text-[#1C241B]"
                }`}
              >
                Expenses & Schedule
              </button>
              <button
                onClick={() => setGroupSubTab("bike")}
                className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  groupSubTab === "bike"
                    ? "bg-[#8B9A6E] text-white shadow-xs"
                    : "text-[#535D4D] hover:text-[#1C241B]"
                }`}
              >
                <Bike className="w-3.5 h-3.5" />
                <span>Group Bike</span>
              </button>
            </div>

            {/* Expenses Sub-Tab */}
            {groupSubTab === "expenses" && (
              <div className="flex flex-col gap-4">
                {/* 7-Day Weekly Calendar Strip */}
                <WeeklyCalendarStrip onOpenFullCalendar={() => setIsWallCalendarOpen(true)} />

                {/* Balances Summary & Simplification Toggle */}
                <BalanceSummary
                  totalOwedToYouPaise={totalOwedToYou}
                  totalYouOwePaise={totalYouOwe}
                  memberBalances={memberBalances}
                  simplifiedTransactions={simplifiedTransactions}
                  memberNames={memberNames}
                  currentUserId={currentUserId}
                  onOpenSettleModal={(targetId, amt) => {
                    setSettleTarget({ userId: targetId, amountPaise: amt });
                    setIsSettleModalOpen(true);
                  }}
                  onToggleChartView={() => alert("Spending by Category: 52% Food, 28% Petrol, 20% Rent")}
                />

                {/* Expense Log List */}
                <ExpenseLog expenses={expenses} />
              </div>
            )}

            {/* Bike Sub-Tab */}
            {groupSubTab === "bike" && (
              <BikeModule
                bike={bike}
                rides={bikeRides}
                fuelLogs={fuelLogs}
                members={group.members}
                currentUserId={currentUserId}
                onAddRide={handleAddRide}
                onAddFuel={handleAddFuel}
              />
            )}
          </div>
        )}

        {/* FRIENDS TAB */}
        {activeTab === "friends" && (
          <FriendsTab
            friends={friends}
            onAddFriend={(name, phone) => {
              const newFriend: FriendItem = {
                id: `usr-${Date.now()}`,
                name,
                phone,
                balancePaise: 0,
              };
              setFriends([...friends, newFriend]);
            }}
            onSettleFriend={(id, amt) => {
              setSettleTarget({ userId: id, amountPaise: amt });
              setIsSettleModalOpen(true);
            }}
          />
        )}

        {/* ACTIVITY TAB */}
        {activeTab === "activity" && <ActivityTab events={activities} />}

        {/* ACCOUNT TAB */}
        {activeTab === "account" && (
          <AccountTab
            profile={userProfile}
            onUpdateProfile={(updated) => setUserProfile({ ...userProfile, ...updated })}
            onOpenWidgetStudio={() => setIsWidgetStudioOpen(true)}
            onDeleteAccount={() => alert("Account anonymized. Historical ledger preserved.")}
          />
        )}
      </main>

      {/* 3. Floating Bottom Navigation Bar */}
      <nav className="fixed bottom-4 z-40 w-full max-w-sm px-4">
        <div className="p-2 rounded-full bg-[#EAE2D6]/95 backdrop-blur-md border border-[#DDD4C6] shadow-xl flex items-center justify-between px-3">
          {[
            { id: "group", label: "Group", icon: Users },
            { id: "friends", label: "Friends", icon: UserCheck },
            { id: "add", label: "Add", icon: Plus, isAction: true },
            { id: "activity", label: "Activity", icon: Activity },
            { id: "account", label: "Account", icon: User },
          ].map((tab) => {
            const Icon = tab.icon;

            if (tab.isAction) {
              return (
                <button
                  key={tab.id}
                  onClick={() => setIsAddExpenseOpen(true)}
                  className="w-11 h-11 rounded-full bg-[#8B9A6E] text-white flex items-center justify-center shadow-md hover:bg-[#647348] transition-transform active:scale-95 cursor-pointer -my-2"
                  title="Add Expense"
                >
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                </button>
              );
            }

            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-full transition-all ${
                  isActive ? "text-[#8B9A6E] font-bold" : "text-[#535D4D] hover:text-[#1C241B]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "stroke-[2.5]" : "stroke-2"}`} />
                <span className="text-[9px] uppercase tracking-wider">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 4. Modals */}
      {/* Add Expense Drawer */}
      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => {
          setIsAddExpenseOpen(false);
          setSelectedCalendarDate(undefined);
        }}
        groupId={group.id}
        members={group.members}
        currentUserId={currentUserId}
        initialDate={selectedCalendarDate}
        onAddExpense={handleAddExpense}
      />

      {/* 3D Wall Calendar Modal */}
      <WallCalendarModal
        isOpen={isWallCalendarOpen}
        onClose={() => setIsWallCalendarOpen(false)}
        onSelectDateToAddExpense={(dateStr) => {
          setSelectedCalendarDate(dateStr);
          setIsAddExpenseOpen(true);
        }}
      />

      {/* Tactile Widget Studio */}
      <WidgetStudio
        isOpen={isWidgetStudioOpen}
        onClose={() => setIsWidgetStudioOpen(false)}
        liveData={widgetData}
      />

      {/* Settle Up Voucher Modal */}
      <AnimatePresence>
        {isSettleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm p-6 rounded-3xl bg-[#F7F2EB] border border-[#DDD4C6] shadow-2xl flex flex-col gap-4"
            >
              <div className="flex items-center justify-between border-b border-[#DDD4C6]/60 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#8B9A6E]" />
                  <h3 className="text-base font-bold text-[#1C241B]">Settle Balance</h3>
                </div>
                <button
                  onClick={() => setIsSettleModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#EAE2D6] flex items-center justify-center text-[#535D4D]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSettleSubmit} className="flex flex-col gap-3">
                <div className="p-4 rounded-2xl bg-[#EAE2D6] border border-[#DDD4C6]/60 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#535D4D]">
                    Settlement Amount
                  </span>
                  <div className="text-2xl font-black text-[#1C241B] tabular-nums mt-1">
                    {formatCurrency(settleTarget.amountPaise || 31250)}
                  </div>
                  <span className="text-xs text-[#535D4D] mt-1 block">
                    Between Sir (You) and {memberNames[settleTarget.userId || "user-alex"]}
                  </span>
                </div>

                <div>
                  <label className="text-[10px] font-bold tracking-widest uppercase text-[#535D4D] block mb-1">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {["UPI", "Cash", "Transfer"].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setSettleMethod(m)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all ${
                          settleMethod === m
                            ? "bg-[#8B9A6E] text-white shadow-2xs"
                            : "bg-[#EAE2D6] text-[#535D4D]"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-[#8B9A6E] text-white font-bold text-sm shadow-xs hover:bg-[#647348] mt-2 transition-colors cursor-pointer"
                >
                  Record Payment & Clear Ledger
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
