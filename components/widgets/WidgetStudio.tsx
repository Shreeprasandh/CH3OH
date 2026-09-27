"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Check, Copy } from "lucide-react";
import { CH3OHWidget, WidgetSize, WidgetVariant, WidgetData } from "./CH3OHWidget";

interface WidgetStudioProps {
  isOpen: boolean;
  onClose: () => void;
  liveData: WidgetData;
}

export const WidgetStudio: React.FC<WidgetStudioProps> = ({ isOpen, onClose, liveData }) => {
  const [selectedSize, setSelectedSize] = useState<WidgetSize>("medium");
  const [selectedVariant, setSelectedVariant] = useState<WidgetVariant>("hybrid");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyConfig = () => {
    const config = JSON.stringify(
      {
        app: "CH3OH",
        size: selectedSize,
        variant: selectedVariant,
        theme: "tactile-linen",
      },
      null,
      2
    );
    navigator.clipboard.writeText(config);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg p-6 rounded-3xl bg-[#F7F2EB] border border-[#DDD4C6] shadow-xl flex flex-col gap-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#DDD4C6]/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#8B9A6E]/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#8B9A6E]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1C241B]">Tactile Widget Studio</h3>
                <p className="text-xs text-[#535D4D]">Minimal, high-density live glances</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#EAE2D6] flex items-center justify-center text-[#535D4D] hover:text-[#1C241B]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Size Selectors */}
          <div>
            <label className="text-[10px] font-bold tracking-widest uppercase text-[#535D4D] block mb-2">
              Form Factor
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(["pill", "small", "medium", "large"] as WidgetSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2 px-3 rounded-2xl text-xs font-semibold capitalize transition-all ${
                    selectedSize === size
                      ? "bg-[#8B9A6E] text-white shadow-xs"
                      : "bg-[#EAE2D6] text-[#535D4D] hover:bg-[#DDD4C6]/60"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Variant Selectors for Small */}
          {selectedSize === "small" && (
            <div>
              <label className="text-[10px] font-bold tracking-widest uppercase text-[#535D4D] block mb-2">
                Glance Focus
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedVariant("balance")}
                  className={`py-2 px-3 rounded-2xl text-xs font-semibold transition-all ${
                    selectedVariant === "balance"
                      ? "bg-[#8B9A6E] text-white"
                      : "bg-[#EAE2D6] text-[#535D4D]"
                  }`}
                >
                  Financial Position
                </button>
                <button
                  onClick={() => setSelectedVariant("bike")}
                  className={`py-2 px-3 rounded-2xl text-xs font-semibold transition-all ${
                    selectedVariant === "bike"
                      ? "bg-[#8B9A6E] text-white"
                      : "bg-[#EAE2D6] text-[#535D4D]"
                  }`}
                >
                  Bike Status
                </button>
              </div>
            </div>
          )}

          {/* Live Preview Canvas */}
          <div className="py-8 px-4 rounded-3xl bg-[#EAE2D6]/40 border border-dashed border-[#DDD4C6] flex items-center justify-center min-h-[220px]">
            <CH3OHWidget size={selectedSize} variant={selectedVariant} data={liveData} />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-[#848F7E]">Renders on home screen & dynamic island</span>
            <button
              onClick={handleCopyConfig}
              className="px-4 py-2 rounded-2xl bg-[#8B9A6E] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs hover:bg-[#647348] transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy Widget Manifest"}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
