"use client";

import React, { useState } from "react";
import {
  User,
  MapPin,
  Calendar,
  QrCode,
  Sparkles,
  Bell,
  Lock,
  HelpCircle,
  Star,
  Trash2,
  Check,
  Loader2,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

export interface UserProfile {
  name: string;
  birthday: string;
  address: string;
  avatarUrl?: string;
  email: string;
}

interface AccountTabProps {
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onOpenWidgetStudio: () => void;
  onDeleteAccount: () => void;
}

export const AccountTab: React.FC<AccountTabProps> = ({
  profile,
  onUpdateProfile,
  onOpenWidgetStudio,
  onDeleteAccount,
}) => {
  const [name, setName] = useState(profile.name);
  const [birthday, setBirthday] = useState(profile.birthday || "2002-05-18");
  const [address, setAddress] = useState(profile.address || "");
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Real-time Address Fetch using HTML5 Geolocation + Reverse Geocoding
  const handleFetchRealTimeLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsFetchingLocation(true);
    setLocationSuccess(false);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "User-Agent": "CH3OH-App/1.0" } }
          );
          const data = await res.json();
          const displayAddress =
            data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setAddress(displayAddress);
          setLocationSuccess(true);
          setTimeout(() => setLocationSuccess(false), 3000);
        } catch {
          setAddress(`Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`);
        } finally {
          setIsFetchingLocation(false);
        }
      },
      (err) => {
        console.warn("Geolocation error:", err);
        setIsFetchingLocation(false);
        alert("Could not access location. Please check browser permissions.");
      },
      { timeout: 10000 }
    );
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name, birthday, address });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="w-full flex flex-col gap-5 select-none">
      <div>
        <h2 className="text-lg font-bold text-[#1C241B]">Account & Identity</h2>
        <p className="text-xs text-[#535D4D]">Personal preferences and security</p>
      </div>

      {/* 1. Profile Edit Form */}
      <form
        onSubmit={handleSaveProfile}
        className="p-5 rounded-3xl bg-[#EAE2D6] border border-[#DDD4C6]/80 shadow-xs flex flex-col gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-[#8B9A6E] text-white flex items-center justify-center font-bold text-xl shadow-xs">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-base font-bold text-[#1C241B]">{name}</div>
            <div className="text-xs text-[#535D4D]">{profile.email}</div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-[10px] font-bold tracking-widest uppercase text-[#535D4D] block mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-2xl bg-[#F7F2EB] border border-[#DDD4C6] text-xs font-semibold text-[#1C241B]"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold tracking-widest uppercase text-[#535D4D] block mb-1">
              Birthday
            </label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full px-3 py-2 rounded-2xl bg-[#F7F2EB] border border-[#DDD4C6] text-xs font-semibold text-[#1C241B]"
            />
          </div>

          {/* Address with Real-Time Fetch Button */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-bold tracking-widest uppercase text-[#535D4D]">
                Address
              </label>
              <button
                type="button"
                onClick={handleFetchRealTimeLocation}
                disabled={isFetchingLocation}
                className="inline-flex items-center gap-1 text-[10px] font-bold text-[#8B9A6E] hover:text-[#647348] cursor-pointer"
              >
                {isFetchingLocation ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Locating...</span>
                  </>
                ) : locationSuccess ? (
                  <>
                    <Check className="w-3 h-3 text-[#3F633B]" />
                    <span className="text-[#3F633B]">Location Fetched</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-3 h-3" />
                    <span>Fetch Live Address</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address or tap 'Fetch Live Address' above"
              className="w-full px-3 py-2 rounded-2xl bg-[#F7F2EB] border border-[#DDD4C6] text-xs font-medium text-[#1C241B] resize-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-2xl bg-[#8B9A6E] text-white text-xs font-bold shadow-xs hover:bg-[#647348] transition-colors flex items-center justify-center gap-1.5"
        >
          {savedSuccess ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Saved Successfully</span>
            </>
          ) : (
            <span>Save Profile</span>
          )}
        </button>
      </form>

      {/* 2. Feature Hub Buttons */}
      <div className="flex flex-col gap-2">
        {/* QR Code Button */}
        <button
          onClick={() => setIsQRModalOpen(true)}
          className="p-3.5 rounded-2xl bg-[#EAE2D6] border border-[#DDD4C6]/60 flex items-center justify-between text-xs hover:bg-[#DDD4C6]/40 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F7F2EB] flex items-center justify-center text-[#8B9A6E]">
              <QrCode className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="font-bold text-[#1C241B]">Personal QR Code</div>
              <div className="text-[10px] text-[#535D4D]">Instant friend scan & add</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#848F7E]" />
        </button>

        {/* Widget Studio Button */}
        <button
          onClick={onOpenWidgetStudio}
          className="p-3.5 rounded-2xl bg-[#EAE2D6] border border-[#DDD4C6]/60 flex items-center justify-between text-xs hover:bg-[#DDD4C6]/40 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F7F2EB] flex items-center justify-center text-[#8B9A6E]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="font-bold text-[#1C241B]">Tactile Widget Studio</div>
              <div className="text-[10px] text-[#535D4D]">Configure Small, Medium & Large widgets</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#848F7E]" />
        </button>

        {/* Security / Password */}
        <button
          onClick={() => alert("Password reset link sent to registered email")}
          className="p-3.5 rounded-2xl bg-[#EAE2D6] border border-[#DDD4C6]/60 flex items-center justify-between text-xs hover:bg-[#DDD4C6]/40 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F7F2EB] flex items-center justify-center text-[#8B9A6E]">
              <Lock className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="font-bold text-[#1C241B]">Password & Security</div>
              <div className="text-[10px] text-[#535D4D]">Update authentication credentials</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#848F7E]" />
        </button>
      </div>

      {/* 3. Account Deletion (GDPR) */}
      <div className="pt-2">
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="w-full p-3 rounded-2xl bg-[#984A3B]/10 border border-[#984A3B]/30 text-xs font-bold text-[#984A3B] flex items-center justify-center gap-1.5 hover:bg-[#984A3B]/20 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete Account Permanently</span>
        </button>
      </div>

      {/* QR Code Modal */}
      {isQRModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-xs p-6 rounded-3xl bg-[#F7F2EB] border border-[#DDD4C6] shadow-xl flex flex-col items-center gap-4 text-center">
            <h3 className="text-sm font-bold text-[#1C241B]">Your Friend Add QR</h3>
            <div className="p-4 rounded-2xl bg-white border border-[#DDD4C6] shadow-xs">
              {/* Synthetic Clean SVG QR representation */}
              <div className="w-40 h-40 bg-[#1C241B] flex items-center justify-center text-white text-xs font-mono p-2 text-center rounded-lg">
                CH3OH://USER/{profile.email.split("@")[0]}
              </div>
            </div>
            <p className="text-[11px] text-[#535D4D]">
              Show this QR code to a friend to instantly connect your ledgers.
            </p>
            <button
              onClick={() => setIsQRModalOpen(false)}
              className="w-full py-2 rounded-xl bg-[#EAE2D6] text-xs font-bold text-[#1C241B]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Account Deletion Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-sm p-6 rounded-3xl bg-[#F7F2EB] border border-[#984A3B]/50 shadow-xl flex flex-col gap-4">
            <div className="flex items-center gap-2 text-[#984A3B]">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="text-base font-bold">Irreversible Deletion</h3>
            </div>
            <p className="text-xs text-[#535D4D] leading-relaxed">
              Deleting your account purges your personal identity (name, email, birthday, address).
              Historical group transactions remain mathematically preserved via anonymized vouchers so your friends' ledgers do not break.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-1/2 py-2.5 rounded-2xl bg-[#EAE2D6] text-xs font-bold text-[#535D4D]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteAccount();
                  setIsDeleteModalOpen(false);
                }}
                className="w-1/2 py-2.5 rounded-2xl bg-[#984A3B] text-white text-xs font-bold shadow-xs hover:bg-[#80382B]"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
