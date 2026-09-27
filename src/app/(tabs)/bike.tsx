import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Bike as BikeIcon,
  ShieldCheck,
  Fuel,
  Wrench,
  ArrowRightLeft,
  Clock,
  User,
  AlertTriangle,
  Camera,
} from 'lucide-react-native';
import { Colors, Radii, Spacing } from '../../theme/colors';
import { TactilePressable } from '../../components/TactilePressable';

export default function BikeTelemetryScreen() {
  const [currentKm, setCurrentKm] = useState(14892);
  const [currentHolder, setCurrentHolder] = useState('You');
  const [isHandoverOpen, setIsHandoverOpen] = useState(false);
  const [newOdoInput, setNewOdoInput] = useState('');
  const [nextHolder, setNextHolder] = useState('Sarah Jenkins');

  const handleHandoverSubmit = () => {
    const odo = parseInt(newOdoInput, 10);
    if (!odo || odo <= currentKm) {
      Alert.alert(
        'Invalid Reading',
        `New odometer reading must be strictly greater than ${currentKm} km.`
      );
      return;
    }

    const tripDistance = odo - currentKm;
    setCurrentKm(odo);
    setCurrentHolder(nextHolder);
    setIsHandoverOpen(false);
    setNewOdoInput('');

    Alert.alert(
      'Handover Confirmed',
      `Trip of ${tripDistance} km logged. Asset handed over to ${nextHolder}.`
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
          <Text style={styles.headerSubtitle}>ASSET TELEMETRY</Text>
          <Text style={styles.headerTitle}>Shared Vehicle</Text>
        </View>

        {/* Hero Bike Telemetry Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.bikeModel}>Royal Enfield Hunter 350</Text>
              <Text style={styles.bikePlate}>KA-01-MJ-4041</Text>
            </View>

            <View style={styles.verifiedBadge}>
              <ShieldCheck size={14} color={Colors.positive} />
              <Text style={styles.verifiedText}>Chain Verified</Text>
            </View>
          </View>

          {/* Odometer Display */}
          <View style={styles.odometerBox}>
            <Text style={styles.odometerLabel}>CURRENT ODOMETER</Text>
            <Text style={styles.odometerValue}>{currentKm.toLocaleString()} km</Text>
            <Text style={styles.odometerHolder}>
              Held currently by <Text style={{ fontWeight: '700', color: Colors.primaryDark }}>{currentHolder}</Text>
            </Text>
          </View>

          {/* Handover CTA */}
          <TactilePressable
            style={styles.handoverButton}
            onPress={() => setIsHandoverOpen(!isHandoverOpen)}
          >
            <ArrowRightLeft size={16} color="#FFFFFF" />
            <Text style={styles.handoverButtonText}>
              {isHandoverOpen ? 'Close Handover' : 'Log Handover & Trip'}
            </Text>
          </TactilePressable>
        </View>

        {/* Handover Form Accordion */}
        {isHandoverOpen && (
          <View style={styles.handoverFormCard}>
            <Text style={styles.formTitle}>Anti-Tamper Handover</Text>
            <Text style={styles.formDesc}>
              Enter current dashboard reading to maintain odometer continuity.
            </Text>

            <Text style={styles.inputLabel}>NEW ODOMETER READING (KM)</Text>
            <TextInput
              style={styles.inputField}
              placeholder={`Min ${currentKm + 1}`}
              placeholderTextColor={Colors.textTertiary}
              keyboardType="number-pad"
              value={newOdoInput}
              onChangeText={setNewOdoInput}
            />

            <Text style={styles.inputLabel}>HANDING OVER TO</Text>
            <View style={styles.pillRow}>
              {['Sarah Jenkins', 'Karthik Rao', 'You'].map((person) => {
                const isSelected = nextHolder === person;
                return (
                  <TactilePressable
                    key={person}
                    style={[
                      styles.selectorPill,
                      isSelected && styles.selectorPillActive,
                    ]}
                    onPress={() => setNextHolder(person)}
                  >
                    <Text
                      style={[
                        styles.selectorPillText,
                        isSelected && styles.selectorPillTextActive,
                      ]}
                    >
                      {person.split(' ')[0]}
                    </Text>
                  </TactilePressable>
                );
              })}
            </View>

            <TactilePressable
              style={styles.confirmButton}
              onPress={handleHandoverSubmit}
            >
              <Text style={styles.confirmButtonText}>Verify & Transfer</Text>
            </TactilePressable>
          </View>
        )}

        {/* Mobility Breakdown Cards */}
        <View style={styles.metricsGrid}>
          {/* Individual Km Ledger */}
          <View style={styles.metricCard}>
            <User size={18} color={Colors.primary} />
            <Text style={styles.metricCardLabel}>Rider vs Pillion</Text>
            <Text style={styles.metricCardValue}>128 km</Text>
            <Text style={styles.metricCardSub}>+42 km as pillion</Text>
          </View>

          {/* Full-Tank Mileage */}
          <View style={styles.metricCard}>
            <Fuel size={18} color={Colors.primary} />
            <Text style={styles.metricCardLabel}>Efficiency</Text>
            <Text style={styles.metricCardValue}>34.2 km/L</Text>
            <Text style={styles.metricCardSub}>Tank at 78%</Text>
          </View>
        </View>

        {/* Maintenance Telemetry */}
        <View style={styles.maintenanceCard}>
          <View style={styles.maintenanceIconBox}>
            <Wrench size={18} color={Colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.maintenanceTitle}>Chain Lubrication Due</Text>
            <Text style={styles.maintenanceSub}>In 108 km or 12 days</Text>
          </View>
          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>Optimal</Text>
          </View>
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
  heroCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  bikeModel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  bikePlate: {
    fontSize: 13,
    color: Colors.textTertiary,
    marginTop: 2,
    fontWeight: '500',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.positiveBg,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: Radii.pill,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.positive,
  },
  odometerBox: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radii.lg,
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  odometerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textTertiary,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  odometerValue: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  odometerHolder: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 6,
  },
  handoverButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: Radii.lg,
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  handoverButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  handoverFormCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
    marginBottom: 18,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  formDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textTertiary,
    letterSpacing: 1,
    marginBottom: 6,
  },
  inputField: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radii.md,
    padding: 14,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  selectorPill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: Radii.pill,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectorPillActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  selectorPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  selectorPillTextActive: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  confirmButton: {
    backgroundColor: Colors.primaryDark,
    paddingVertical: 14,
    borderRadius: Radii.md,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  metricCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: 18,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  metricCardLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textTertiary,
  },
  metricCardValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  metricCardSub: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  maintenanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  maintenanceIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  maintenanceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  maintenanceSub: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  statusPill: {
    backgroundColor: Colors.positiveBg,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: Radii.pill,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.positive,
  },
});
