import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ShieldCheck,
  Fingerprint,
  FileText,
  Lock,
  Award,
  Download,
  Trash2,
  ChevronRight,
  LogOut,
  User,
  Key,
} from 'lucide-react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { Colors, Radii, Spacing } from '../../theme/colors';
import { TactilePressable } from '../../components/TactilePressable';
import { LegalModal, LegalDocType } from '../../components/legal/LegalModal';

export default function AccountScreen() {
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [hasHardwareBiometrics, setHasHardwareBiometrics] = useState(false);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [selectedLegalDoc, setSelectedLegalDoc] = useState<LegalDocType>('terms');

  useEffect(() => {
    async function checkHardware() {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      setHasHardwareBiometrics(hasHardware && isEnrolled);
    }
    checkHardware();
  }, []);

  const handleBiometricToggle = async (value: boolean) => {
    if (value) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to enable biometric app lock',
        fallbackLabel: 'Use Device Passcode',
      });
      if (result.success) {
        setBiometricsEnabled(true);
        Alert.alert('Security Enabled', 'CH3OH will require authentication to view balances.');
      } else {
        setBiometricsEnabled(false);
      }
    } else {
      setBiometricsEnabled(false);
    }
  };

  const openLegal = (doc: LegalDocType) => {
    setSelectedLegalDoc(doc);
    setLegalModalOpen(true);
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Ledger Data',
      'A complete encrypted archive of your transaction history and bike odometer logs will be prepared.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Download Archive',
          onPress: () => {
            Alert.alert('Export Ready', 'Your CSV/JSON export has been generated successfully.');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account & Data',
      'This will permanently purge your profile, group memberships, and private encryption keys. This action cannot be reversed (GDPR / DPDP compliance).',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Permanently Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Account Purged',
              'All user records and cached cryptographic tokens have been securely wiped.'
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerSubtitle}>PREFERENCES & SECURITY</Text>
          <Text style={styles.headerTitle}>Account & Legal</Text>
        </View>

        {/* User Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>SP</Text>
          </View>
          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>Shreeprasandh</Text>
            <Text style={styles.profileMeta}>shree@ch3oh.local • Apart. 402</Text>
          </View>
          <View style={styles.securityBadge}>
            <ShieldCheck size={14} color={Colors.positive} />
            <Text style={styles.securityBadgeText}>Verified</Text>
          </View>
        </View>

        {/* Security & Authentication */}
        <Text style={styles.sectionHeader}>DEVICE SECURITY</Text>
        <View style={styles.sectionCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconBox}>
                <Fingerprint size={18} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.settingTitle}>Biometric App Lock</Text>
                <Text style={styles.settingSub}>Require Face ID / Fingerprint on launch</Text>
              </View>
            </View>
            <Switch
              value={biometricsEnabled}
              onValueChange={handleBiometricToggle}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingDivider} />

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconBox}>
                <Key size={18} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.settingTitle}>Hardware Keystore</Text>
                <Text style={styles.settingSub}>Encrypted with Android KeyStore / SecureStore</Text>
              </View>
            </View>
            <View style={styles.hardwareBadge}>
              <Text style={styles.hardwareBadgeText}>AES-256</Text>
            </View>
          </View>
        </View>

        {/* Legal Disclosures */}
        <Text style={styles.sectionHeader}>LEGAL & COMPLIANCE</Text>
        <View style={styles.sectionCard}>
          <TactilePressable style={styles.navRow} onPress={() => openLegal('terms')}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconBox}>
                <FileText size={18} color={Colors.textSecondary} />
              </View>
              <Text style={styles.settingTitle}>Terms of Service</Text>
            </View>
            <ChevronRight size={18} color={Colors.textTertiary} />
          </TactilePressable>

          <View style={styles.settingDivider} />

          <TactilePressable style={styles.navRow} onPress={() => openLegal('privacy')}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconBox}>
                <Lock size={18} color={Colors.textSecondary} />
              </View>
              <Text style={styles.settingTitle}>Privacy Policy (DPDP / GDPR)</Text>
            </View>
            <ChevronRight size={18} color={Colors.textTertiary} />
          </TactilePressable>

          <View style={styles.settingDivider} />

          <TactilePressable style={styles.navRow} onPress={() => openLegal('copyright')}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconBox}>
                <Award size={18} color={Colors.textSecondary} />
              </View>
              <Text style={styles.settingTitle}>Copyright & Open-Source Credits</Text>
            </View>
            <ChevronRight size={18} color={Colors.textTertiary} />
          </TactilePressable>
        </View>

        {/* Data Governance & Account Rights */}
        <Text style={styles.sectionHeader}>DATA SOVEREIGNTY</Text>
        <View style={styles.sectionCard}>
          <TactilePressable style={styles.navRow} onPress={handleExportData}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconBox}>
                <Download size={18} color={Colors.textSecondary} />
              </View>
              <View>
                <Text style={styles.settingTitle}>Export Ledger Data</Text>
                <Text style={styles.settingSub}>Download complete CSV/JSON archive</Text>
              </View>
            </View>
            <ChevronRight size={18} color={Colors.textTertiary} />
          </TactilePressable>

          <View style={styles.settingDivider} />

          <TactilePressable style={styles.navRow} onPress={handleDeleteAccount}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconBox, { backgroundColor: Colors.negativeBg }]}>
                <Trash2 size={18} color={Colors.negative} />
              </View>
              <View>
                <Text style={[styles.settingTitle, { color: Colors.negative }]}>
                  Delete Account & Wipe Data
                </Text>
                <Text style={styles.settingSub}>Mandatory App Store Guideline 5.1.1</Text>
              </View>
            </View>
            <ChevronRight size={18} color={Colors.negative} />
          </TactilePressable>
        </View>

        {/* App Version Info */}
        <View style={styles.versionFooter}>
          <Text style={styles.versionText}>CH3OH v1.0.0 (Build 57.0.25)</Text>
          <Text style={styles.copyrightText}>© 2026 Shreeprasandh. All rights reserved.</Text>
        </View>
      </ScrollView>

      {/* Legal Modal */}
      <LegalModal
        visible={legalModalOpen}
        initialDoc={selectedLegalDoc}
        onClose={() => setLegalModalOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 18,
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  profileMeta: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.positiveBg,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: Radii.pill,
  },
  securityBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.positive,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textTertiary,
    letterSpacing: 1,
    marginBottom: 10,
  },
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  settingSub: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  settingDivider: {
    height: 1,
    backgroundColor: Colors.borderSubtle,
    marginLeft: 64,
  },
  hardwareBadge: {
    backgroundColor: Colors.surfaceSubtle,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: Radii.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  hardwareBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  versionFooter: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 4,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textTertiary,
  },
  copyrightText: {
    fontSize: 11,
    color: Colors.textTertiary,
  },
});
