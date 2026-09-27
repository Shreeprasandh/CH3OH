import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { X, ShieldCheck, FileText, Lock, Award } from 'lucide-react-native';
import { Colors, Radii, Spacing } from '../../theme/colors';
import { TactilePressable } from '../TactilePressable';

export type LegalDocType = 'terms' | 'privacy' | 'copyright';

interface LegalModalProps {
  visible: boolean;
  initialDoc?: LegalDocType;
  onClose: () => void;
}

export function LegalModal({
  visible,
  initialDoc = 'terms',
  onClose,
}: LegalModalProps) {
  const [activeTab, setActiveTab] = useState<LegalDocType>(initialDoc);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <ShieldCheck size={18} color={Colors.primary} />
            <Text style={styles.headerTitle}>Legal & Compliance</Text>
          </View>
          <TactilePressable style={styles.closeButton} onPress={onClose}>
            <X size={20} color={Colors.textPrimary} />
          </TactilePressable>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabRow}>
          {[
            { key: 'terms', label: 'Terms of Service', icon: FileText },
            { key: 'privacy', label: 'Privacy Policy', icon: Lock },
            { key: 'copyright', label: 'Copyright', icon: Award },
          ].map((tab) => {
            const isSelected = activeTab === tab.key;
            const TabIcon = tab.icon;
            return (
              <TactilePressable
                key={tab.key}
                style={[
                  styles.tabButton,
                  isSelected && styles.tabButtonActive,
                ]}
                onPress={() => setActiveTab(tab.key as LegalDocType)}
              >
                <TabIcon
                  size={14}
                  color={isSelected ? Colors.primaryDark : Colors.textTertiary}
                />
                <Text
                  style={[
                    styles.tabButtonText,
                    isSelected && styles.tabButtonTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TactilePressable>
            );
          })}
        </View>

        {/* Content */}
        <ScrollView
          contentContainerStyle={styles.contentScroll}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'terms' && (
            <View style={styles.section}>
              <Text style={styles.docUpdated}>Effective Date: September 2026</Text>

              <Text style={styles.clauseTitle}>1. Non-Custodial Financial Ledger</Text>
              <Text style={styles.clauseBody}>
                CH3OH (Methanol) operates strictly as a mathematical ledger and peer-to-peer expense calculation engine. CH3OH is not a bank, escrow provider, or licensed remittance entity. All financial settlements recorded in the application represent peer-to-peer agreements between trusted group members. No client funds are held or processed by CH3OH servers.
              </Text>

              <Text style={styles.clauseTitle}>2. Vehicle Telemetry & Co-Ownership</Text>
              <Text style={styles.clauseBody}>
                The bike telemetry and odometer handover chain are designed for transparent expense allocation between co-owners. Users agree to enter truthful, verifiable odometer readings. CH3OH disclaims all liability for vehicle roadworthiness, mechanical failures, traffic citations, or accidents occurring during shared custody.
              </Text>

              <Text style={styles.clauseTitle}>3. Mathematical Precision & Fair Use</Text>
              <Text style={styles.clauseBody}>
                All expense allocations use zero-float integer paise arithmetic to eliminate rounding discrepancies. By creating a group, you certify that all participants have consented to share expense ledger history.
              </Text>
            </View>
          )}

          {activeTab === 'privacy' && (
            <View style={styles.section}>
              <Text style={styles.docUpdated}>
                Compliance: DPDP Act 2023 (India) & GDPR (EU)
              </Text>

              <Text style={styles.clauseTitle}>1. On-Device First Architecture</Text>
              <Text style={styles.clauseBody}>
                We prioritize on-device calculation and local encryption. Authentication credentials and session tokens are encrypted within your device&apos;s native hardware keystore (Android KeyStore / iOS Keychain via SecureStore).
              </Text>

              <Text style={styles.clauseTitle}>2. Device Permissions & Purpose</Text>
              <Text style={styles.clauseBody}>
                • <Text style={styles.boldText}>Camera</Text>: Utilized exclusively for optical odometer dashboard verification and paper receipt scanning. Images are processed locally or stored encrypted in your private Supabase vault.{'\n'}
                • <Text style={styles.boldText}>Location</Text>: Used strictly on-demand to identify nearby fuel stations during expense logging. Real-time background tracking is never enabled.{'\n'}
                • <Text style={styles.boldText}>Contacts</Text>: Read on-device to simplify adding peer co-owners. Your contact address book is never sold or synchronized with external marketing networks.
              </Text>

              <Text style={styles.clauseTitle}>3. Zero Data Sale Guarantee</Text>
              <Text style={styles.clauseBody}>
                CH3OH will never sell, lease, or distribute your personal financial data, mobility history, or ride telemetry to third-party ad brokers or credit bureaus.
              </Text>

              <Text style={styles.clauseTitle}>4. Right to Erasure & Export</Text>
              <Text style={styles.clauseBody}>
                You retain full sovereignty over your data. You may download a complete ledger export (CSV/JSON) or permanently purge your account and historical records at any time.
              </Text>
            </View>
          )}

          {activeTab === 'copyright' && (
            <View style={styles.section}>
              <Text style={styles.docUpdated}>Intellectual Property Notice</Text>

              <View style={styles.copyrightHeroCard}>
                <Text style={styles.copyrightHeroTitle}>
                  © 2026 Shreeprasandh
                </Text>
                <Text style={styles.copyrightHeroSub}>
                  All rights reserved. CH3OH, Methanol Ledger, and the 3D Wallet Brandmark are proprietary intellectual property.
                </Text>
              </View>

              <Text style={styles.clauseTitle}>Open-Source Attributions</Text>
              <Text style={styles.clauseBody}>
                The CH3OH mobile client utilizes world-class open-source software libraries, including:{'\n'}
                • React Native (MIT License — Meta Platforms, Inc.){'\n'}
                • Expo SDK (MIT License — 650 Industries, Inc.){'\n'}
                • Lucide Icons (ISC License — Lucide Contributors){'\n'}
                • Supabase JavaScript Client (MIT License — Supabase, Inc.){'\n'}
                • React Native Reanimated (MIT License — Software Mansion)
              </Text>

              <Text style={styles.clauseTitle}>Software License</Text>
              <Text style={styles.clauseBody}>
                Core calculation engines and algorithms are licensed under the standard MIT License as published in the root repository.
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: Radii.pill,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabButtonActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  tabButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabButtonTextActive: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  contentScroll: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  section: {
    gap: 16,
  },
  docUpdated: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  clauseTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 6,
  },
  clauseBody: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  boldText: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  copyrightHeroCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginVertical: 4,
  },
  copyrightHeroTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  copyrightHeroSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
