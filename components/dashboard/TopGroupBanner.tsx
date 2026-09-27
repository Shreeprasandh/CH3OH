"use client";

import React from "react";
import Image from "next/image";
import { Users, Plus, Settings } from "lucide-react";

export interface GroupMember {
  id: string;
  name: string;
  avatarUrl?: string;
  role?: string;
}

export interface GroupData {
  id: string;
  name: string;
  pictureUrl?: string;
  bannerImage?: string;
  currency: string;
  members: GroupMember[];
}

interface TopGroupBannerProps {
  group: GroupData;
  onOpenInviteModal?: () => void;
  onOpenSettings?: () => void;
}

export const TopGroupBanner: React.FC<TopGroupBannerProps> = ({
  group,
  onOpenInviteModal,
  onOpenSettings,
}) => {
  const bannerSrc = group.bannerImage?.startsWith("/")
    ? group.bannerImage
    : `/calendar/${group.bannerImage || "1.jpg"}`;

  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-[#8B9A6E] shadow-sm select-none">
      {/* Background Banner with Soft Mask */}
      <div className="absolute inset-0">
        <Image
          src={bannerSrc}
          alt={group.name}
          fill
          className="object-cover opacity-35 mix-blend-multiply"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#8B9A6E] via-[#8B9A6E]/70 to-transparent" />
      </div>

      {/* Banner Content */}
      <div className="relative z-10 p-5 sm:p-6 text-white flex flex-col justify-between min-h-[160px]">
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 backdrop-blur-xs text-xs font-semibold">
            <Users className="w-3.5 h-3.5 text-[#EAE2D6]" />
            <span>{group.members.length} members</span>
          </div>

          <button
            onClick={onOpenSettings}
            className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-xs flex items-center justify-center hover:bg-black/30 transition-colors"
          >
            <Settings className="w-4 h-4 text-[#F7F2EB]" />
          </button>
        </div>

        {/* Group Name & Avatars */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-4">
          <div className="flex items-center gap-3">
            {group.pictureUrl ? (
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/80 shadow-md">
                <Image src={group.pictureUrl} alt={group.name} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-[#F7F2EB] text-[#1C241B] flex items-center justify-center font-bold text-xl shadow-md border-2 border-white/80">
                {group.name.slice(0, 2).toUpperCase()}
              </div>
            )}

            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-xs">
                {group.name}
              </h1>
              <p className="text-xs text-[#EAE2D6] font-medium tracking-wide">
                Primary Currency: {group.currency} (₹)
              </p>
            </div>
          </div>

          {/* Member Avatars Stack */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {group.members.slice(0, 4).map((member) => (
                <div
                  key={member.id}
                  className="w-8 h-8 rounded-full border-2 border-[#8B9A6E] bg-[#EAE2D6] text-[#1C241B] text-xs font-bold flex items-center justify-center shadow-xs"
                  title={member.name}
                >
                  {member.name.charAt(0).toUpperCase()}
                </div>
              ))}
              {group.members.length > 4 && (
                <div className="w-8 h-8 rounded-full border-2 border-[#8B9A6E] bg-[#535D4D] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  +{group.members.length - 4}
                </div>
              )}
            </div>

            {onOpenInviteModal && (
              <button
                onClick={onOpenInviteModal}
                className="w-8 h-8 rounded-full bg-white text-[#1C241B] flex items-center justify-center shadow-xs hover:bg-[#F7F2EB] transition-colors"
                title="Add Friend to Group"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
