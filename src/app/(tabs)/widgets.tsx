import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Sparkles,
  Smartphone,
  Plus,
  ArrowRightLeft,
  CheckCircle2,
  Bike,
  Receipt,
  Layers,
} from 'lucide-react-native';
import { Colors, Radii, Spacing } from '../../theme/colors';
import { TactilePressable } from '../../components/TactilePressable';
import { requestPinWidget } from 'react-native-android-widget';

export default function WidgetsStudioScreen() {
  const [activeSize, setActiveSize] = useState<'pill' | 'small' | 'medium' | 'large'>('small');

  const handlePinToHomeScreen = async (widgetName: string, label: string) => {
    if (Platform.OS !== 'android') {
      Alert.alert(
        'Homescreen Widgets',
        'On iOS, long-press your home screen, tap "+", search for CH3OH, and select your preferred widget size.'
      );
      return;
    }

    try {
      const success = await requestPinWidget({ widgetName });
      if (success) {
        Alert.alert(
          'Pinning Widget',
          `The ${label} is being added to your Android Home Screen.`
        );
      } else {
        Alert.alert(
          'Homescreen Widget',
          'To add manually: Long-press your home screen wallpaper, tap "Widgets", search for CH3OH, and drag it to your screen.'
        );
      }
    } catch (e: any) {
      Alert.alert(
        'Homescreen Widget',
        'To add to your home screen: Long press on your home screen, select "Widgets", tap "CH3OH", and place it on your home screen.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerSubtitle}>TACTILE MINIMALISM</Text>
          <Text style={styles.headerTitle}>Homescreen Widgets</Text>
        </View>

        {/* Real Homescreen Pinning Hero */}
        <View style={styles.pinBanner}>
          <View style={styles.pinBadge}>
            <Smartphone size={16} color={Colors.primary} />
            <Text style={styles.pinBadgeText}>NATIVE OS HOMESCREEN WIDGET</Text>
          </View>
          <Text style={styles.pinTitle}>Add CH3OH Directly to Your Mobile Desktop</Text>
          <Text style={styles.pinDesc}>
            Access real-time net balances, split expenses, and verify bike odometers without opening the full application.
          </Text>

          <View style={styles.pinActionsRow}>
            <TactilePressable
              style={styles.pinButtonPrimary}
              onPress={() => handlePinToHomeScreen('QuickExpenseWidget', 'Quick Split Widget')}
            >
              <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.pinButtonPrimaryText}>Pin Expense Widget</Text>
            </TactilePressable>

            <TactilePressable
              style={styles.pinButtonSecondary}
              onPress={() => handlePinToHomeScreen('BikeStatusWidget', 'Bike Telemetry Widget')}
            >
              <Bike size={16} color={Colors.textPrimary} strokeWidth={2} />
              <Text style={styles.pinButtonSecondaryText}>Pin Bike Widget</Text>
            </TactilePressable>
          </View>
        </View>

        {/* Size Selector Bar */}
        <Text style={styles.sectionLabel}>PREVIEW FORM FACTOR</Text>
        <View style={styles.sizePillRow}>
          {[
            { key: 'pill', label: 'Pill' },
            { key: 'small', label: 'Small 1x1' },
            { key: 'medium', label: 'Medium 2x1' },
            { key: 'large', label: 'Large 2x2' },
          ].map((s) => {
            const isSelected = activeSize === s.key;
            return (
              <TactilePressable
                key={s.key}
                style={[
                  styles.sizePill,
                  isSelected && styles.sizePillActive,
                ]}
                onPress={() => setActiveSize(s.key as any)}
              >
                <Text
                  style={[
                    styles.sizePillText,
                    isSelected && styles.sizePillTextActive,
                  ]}
                >
                  {s.label}
                </Text>
              </TactilePressable>
            );
          })}
        </View>

        {/* Live Interactive Preview Canvas */}
        <View style={styles.previewCanvas}>
          {/* Pill Widget */}
          {activeSize === 'pill' && (
            <View style={styles.pillWidgetContainer}>
              <View style={styles.pillDot} />
              <Text style={styles.pillWidgetBrand}>CH3OH</Text>
              <View style={styles.pillWidgetDivider} />
              <Text style={styles.pillWidgetAmount}>+₹1,420</Text>
            </View>
          )}

          {/* Small 1x1 Widget */}
          {activeSize === 'small' && (
            <View style={styles.smallWidgetContainer}>
              <View style={styles.widgetHeaderRow}>
                <Text style={styles.widgetBrand}>CH3OH</Text>
                <Text style={styles.widgetSub}>Apt 402</Text>
              </View>

              <View style={{ marginVertical: 8 }}>
                <Text style={styles.widgetLabel}>YOU ARE OWED</Text>
                <Text style={styles.widgetAmountPositive}>+₹1,420</Text>
              </View>

              <View style={styles.widgetActionPill}>
                <Text style={styles.widgetActionText}>+ Quick Split</Text>
              </View>
            </View>
          )}

          {/* Medium 2x1 Widget */}
          {activeSize === 'medium' && (
            <View style={styles.mediumWidgetContainer}>
              <View style={styles.mediumLeft}>
                <Text style={styles.widgetBrand}>BIKE TELEMETRY</Text>
                <Text style={styles.mediumKm}>14,892 km</Text>
                <Text style={styles.mediumSub}>KA-01-MJ-4041 • You</Text>
              </View>

              <View style={styles.mediumRight}>
                <View style={styles.fuelBadge}>
                  <Text style={styles.fuelText}>Tank 78%</Text>
                </View>
                <View style={styles.widgetActionPillDark}>
                  <Text style={styles.widgetActionText}>Log Handover</Text>
                </View>
              </View>
            </View>
          )}

          {/* Large 2x2 Widget */}
          {activeSize === 'large' && (
            <View style={styles.largeWidgetContainer}>
              <View style={styles.widgetHeaderRow}>
                <Text style={styles.widgetBrand}>FINANCIAL HORIZON</Text>
                <Text style={styles.widgetSub}>Sep 2026</Text>
              </View>

              <View style={styles.largeMetricsRow}>
                <View>
                  <Text style={styles.widgetLabel}>NET POSITION</Text>
                  <Text style={styles.largeAmount}>+₹1,420.00</Text>
                </View>
                <View style={styles.largeTag}>
                  <Text style={styles.largeTagText}>Optimal</Text>
                </View>
              </View>

              <View style={styles.largeOdoRow}>
                <View style={styles.largeOdoLeft}>
                  <Bike size={16} color={Colors.primary} />
                  <Text style={styles.largeOdoText}>14,892 km (Verified)</Text>
                </View>
                <Text style={styles.largeOdoSub}>Zero gaps detected</Text>
              </View>

              <View style={styles.largeFooter}>
                <View style={styles.widgetActionPill}>
                  <Text style={styles.widgetActionText}>+ Add Expense</Text>
                </View>
                <View style={styles.widgetActionPillSecondary}>
                  <Text style={styles.widgetActionTextSecondary}>Bike Handover</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Operating Instructions */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How Homescreen Widgets Work</Text>
          <Text style={styles.infoText}>
            1. Tap &apos;Pin Widget&apos; above or long-press your emulator/phone home screen.{'\n'}
            2. Choose CH3OH from your native widget picker.{'\n'}
            3. Tapping the widget deep-links directly into instant expense splitting or odometer verification.
          </Text>
        </View>
      </ScrollView>
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
  pinBanner: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: 22,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
  },
  pinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  pinBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.1,
  },
  pinTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  pinDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 18,
  },
  pinActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  pinButtonPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: Radii.md,
    gap: 6,
  },
  pinButtonPrimaryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  pinButtonSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 12,
    borderRadius: Radii.md,
    gap: 6,
  },
  pinButtonSecondaryText: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textTertiary,
    letterSpacing: 1,
    marginBottom: 10,
  },
  sizePillRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  sizePill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: Radii.pill,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sizePillActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  sizePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  sizePillTextActive: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  previewCanvas: {
    backgroundColor: Colors.surfaceMuted,
    borderRadius: Radii.xl,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 220,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillWidgetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F6F0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  pillDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginRight: 10,
  },
  pillWidgetBrand: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1,
  },
  pillWidgetDivider: {
    width: 1,
    height: 14,
    backgroundColor: Colors.border,
    marginHorizontal: 12,
  },
  pillWidgetAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.positive,
  },
  smallWidgetContainer: {
    width: 160,
    height: 160,
    backgroundColor: '#F9F6F0',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  widgetHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  widgetBrand: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1,
  },
  widgetSub: {
    fontSize: 10,
    color: Colors.textTertiary,
  },
  widgetLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textTertiary,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  widgetAmountPositive: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.positive,
  },
  widgetActionPill: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 7,
    alignItems: 'center',
  },
  widgetActionPillSecondary: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 7,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  widgetActionText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  widgetActionTextSecondary: {
    color: Colors.textPrimary,
    fontSize: 11,
    fontWeight: '600',
  },
  mediumWidgetContainer: {
    width: '100%',
    backgroundColor: '#F9F6F0',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  mediumLeft: {
    gap: 4,
  },
  mediumKm: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  mediumSub: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  mediumRight: {
    alignItems: 'flex-end',
    gap: 10,
  },
  fuelBadge: {
    backgroundColor: Colors.positiveBg,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: Radii.pill,
  },
  fuelText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.positive,
  },
  widgetActionPillDark: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  largeWidgetContainer: {
    width: '100%',
    backgroundColor: '#F9F6F0',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    gap: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  largeMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  largeAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.positive,
    letterSpacing: -0.5,
  },
  largeTag: {
    backgroundColor: Colors.positiveBg,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: Radii.pill,
  },
  largeTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.positive,
  },
  largeOdoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  largeOdoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  largeOdoText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  largeOdoSub: {
    fontSize: 11,
    color: Colors.positive,
    fontWeight: '500',
  },
  largeFooter: {
    flexDirection: 'row',
    gap: 10,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
