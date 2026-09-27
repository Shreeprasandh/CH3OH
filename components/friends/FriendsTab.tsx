"use client";

import React, { useState } from "react";
import { UserPlus, Search, Phone, Share2, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "@/lib/split-engine";

export interface FriendItem {
  id: string;
  name: string;
  phone: string;
  balancePaise: number; // positive = owes you, negative = you owe
}

interface FriendsTabProps {
  friends: FriendItem[];
  onAddFriend: (name: string, phone: string) => void;
  onSettleFriend: (friendId: string, amountPaise: number) => void;
}

export const FriendsTab: React.FC<FriendsTabProps> = ({
  friends,
  onAddFriend,
  onSettleFriend,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newFriendName, setNewFriendName] = useState("");
  const [newFriendPhone, setNewFriendPhone] = useState("");

  const filtered = friends.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.phone.includes(searchQuery)
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFriendName.trim() || !newFriendPhone.trim()) return;
    onAddFriend(newFriendName.trim(), newFriendPhone.trim());
    setNewFriendName("");
    setNewFriendPhone("");
    setIsAddModalOpen(false);
  };

  return (
    <div className="w-full flex flex-col gap-4 select-none">
      {/* Header & Quick Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#1C241B]">Friends & Direct Balances</h2>
          <p className="text-xs text-[#535D4D]">Individual pairwise ledgers</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-2 rounded-2xl bg-[#8B9A6E] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs hover:bg-[#647348] transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Friend</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-[#848F7E]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search friends by name or phone..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#EAE2D6] border border-[#DDD4C6] text-xs font-medium text-[#1C241B] placeholder-[#848F7E] focus:outline-none focus:border-[#8B9A6E]"
        />
      </div>

      {/* Friends List */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="p-8 rounded-3xl bg-[#EAE2D6] text-center text-xs text-[#848F7E]">
            No friends found matching your search.
          </div>
        ) : (
          filtered.map((friend) => {
            const owesYou = friend.balancePaise > 0;
            const settled = friend.balancePaise === 0;

            return (
              <div
                key={friend.id}
                className="p-3.5 rounded-2xl bg-[#EAE2D6] border border-[#DDD4C6]/60 shadow-2xs flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#F7F2EB] text-[#1C241B] font-bold flex items-center justify-center text-sm shadow-2xs">
                    {friend.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-[#1C241B]">{friend.name}</div>
                    <div className="text-[10px] text-[#535D4D] flex items-center gap-1">
                      <Phone className="w-2.5 h-2.5" />
                      <span>{friend.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    {settled ? (
                      <span className="text-[11px] font-semibold text-[#848F7E]">Settled</span>
                    ) : (
                      <>
                        <div
                          className={`text-sm font-black tabular-nums ${
                            owesYou ? "text-[#3F633B]" : "text-[#984A3B]"
                          }`}
                        >
                          {formatCurrency(Math.abs(friend.balancePaise))}
                        </div>
                        <div className="text-[9px] text-[#535D4D] uppercase font-bold tracking-wider">
                          {owesYou ? "owes you" : "you owe"}
                        </div>
                      </>
                    )}
                  </div>

                  {!settled && (
                    <button
                      onClick={() => onSettleFriend(friend.id, Math.abs(friend.balancePaise))}
                      className="px-2.5 py-1.5 rounded-xl bg-[#8B9A6E] text-white text-[10px] font-bold shadow-2xs hover:bg-[#647348] transition-colors"
                    >
                      Settle
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Friend Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-sm p-6 rounded-3xl bg-[#F7F2EB] border border-[#DDD4C6] shadow-xl flex flex-col gap-4">
            <h3 className="text-base font-bold text-[#1C241B]">Add Friend to Network</h3>
            <form onSubmit={handleAddSubmit} className="flex flex-col gap-3">
              <div>
                <label className="text-[10px] font-bold tracking-widest uppercase text-[#535D4D] block mb-1">
                  Friend's Full Name
                </label>
                <input
                  type="text"
                  value={newFriendName}
                  onChange={(e) => setNewFriendName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  required
                  className="w-full px-3 py-2 rounded-2xl bg-[#EAE2D6] border border-[#DDD4C6] text-xs font-semibold text-[#1C241B]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold tracking-widest uppercase text-[#535D4D] block mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={newFriendPhone}
                  onChange={(e) => setNewFriendPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                  className="w-full px-3 py-2 rounded-2xl bg-[#EAE2D6] border border-[#DDD4C6] text-xs font-semibold text-[#1C241B]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-2xl bg-[#EAE2D6] text-xs font-bold text-[#535D4D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-2xl bg-[#8B9A6E] text-white text-xs font-bold shadow-xs hover:bg-[#647348]"
                >
                  Save Friend
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
