import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowUpRight,
  ArrowDownLeft,
  ChevronDown,
  Sparkles,
  Receipt,
  Coffee,
  Fuel,
  Utensils,
  ShoppingBag,
  Plus,
  ShieldCheck,
} from 'lucide-react-native';
import { Colors, Radii, Spacing } from '../../theme/colors';
import { TactilePressable } from '../../components/TactilePressable';
import { useRouter } from 'expo-router';

export default function LedgerScreen() {
  const router = useRouter();
  const [selectedGroup, setSelectedGroup] = useState('Apartment 402');

  const recentTransactions = [
    {
      id: 'tx-1',
      title: 'Shell Petrol & Chain Lube',
      category: 'fuel',
      Icon: Fuel,
      paidBy: 'You paid',
      amount: '₹650.00',
      splitText: 'You lent ₹325.00',
      isPositive: true,
      date: 'Today, 2:15 PM',
    },
    {
      id: 'tx-2',
      title: 'Third Wave Coffee Roasters',
      category: 'cafe',
      Icon: Coffee,
      paidBy: 'Sarah paid',
      amount: '₹420.00',
      splitText: 'You borrowed ₹140.00',
      isPositive: false,
      date: 'Yesterday',
    },
    {
      id: 'tx-3',
      title: 'Blinkit Weekend Groceries',
      category: 'groceries',
      Icon: ShoppingBag,
      paidBy: 'You paid',
      amount: '₹1,240.00',
      splitText: 'You lent ₹826.67',
      isPositive: true,
      date: '25 Sep',
    },
    {
      id: 'tx-4',
      title: 'Meghana Foods Biryani',
      category: 'food',
      Icon: Utensils,
      paidBy: 'Karthik paid',
      amount: '₹890.00',
      splitText: 'You borrowed ₹296.67',
      isPositive: false,
      date: '24 Sep',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.brandSubtitle}>EXPENSE & TELEMETRY</Text>
            <View style={styles.groupPickerRow}>
              <Text style={styles.brandTitle}>{selectedGroup}</Text>
              <ChevronDown size={18} color={Colors.textPrimary} style={{ marginLeft: 6 }} />
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <TactilePressable
              style={styles.pillBadge}
              onPress={() => router.push('/widgets')}
            >
              <Sparkles size={14} color={Colors.primary} />
              <Text style={styles.pillBadgeText}>Widgets</Text>
            </TactilePressable>

            <TactilePressable
              style={styles.pillBadge}
              onPress={() => router.push('/account')}
            >
              <ShieldCheck size={14} color={Colors.primary} />
              <Text style={styles.pillBadgeText}>Legal</Text>
            </TactilePressable>
          </View>
        </View>

        {/* Hero Net Balance Card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>YOUR NET BALANCE</Text>
          <Text style={styles.heroAmount}>+₹1,420.00</Text>
          <Text style={styles.heroSubtext}>
            You are owed across 3 group members
          </Text>

          {/* Quick Metrics Bar */}
          <View style={styles.metricsBar}>
            <View style={styles.metricItem}>
              <View style={[styles.metricDot, { backgroundColor: Colors.positive }]} />
              <View>
                <Text style={styles.metricLabel}>You lent</Text>
                <Text style={styles.metricValue}>₹3,200.00</Text>
              </View>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricItem}>
              <View style={[styles.metricDot, { backgroundColor: Colors.negative }]} />
              <View>
                <Text style={styles.metricLabel}>You borrowed</Text>
                <Text style={styles.metricValue}>₹1,780.00</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Action Pills */}
        <View style={styles.actionsRow}>
          <TactilePressable
            style={styles.actionButtonPrimary}
            onPress={() => router.push('/add')}
          >
            <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.actionButtonPrimaryText}>Add Expense</Text>
          </TactilePressable>

          <TactilePressable
            style={styles.actionButtonSecondary}
            onPress={() => router.push('/friends')}
          >
            <Text style={styles.actionButtonSecondaryText}>Settle Balances</Text>
          </TactilePressable>
        </View>

        {/* Recent Ledger Activity */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Text style={styles.sectionCount}>4 expenses</Text>
        </View>

        <View style={styles.ledgerList}>
          {recentTransactions.map((tx) => {
            const Icon = tx.Icon;
            return (
              <TactilePressable key={tx.id} style={styles.ledgerCard}>
                <View style={styles.ledgerIconContainer}>
                  <Icon size={20} color={Colors.primary} strokeWidth={2} />
                </View>

                <View style={styles.ledgerContent}>
                  <Text style={styles.ledgerTitle} numberOfLines={1}>
                    {tx.title}
                  </Text>
                  <Text style={styles.ledgerMeta}>
                    {tx.paidBy} • {tx.date}
                  </Text>
                </View>

                <View style={styles.ledgerAmountCol}>
                  <Text
                    style={[
                      styles.ledgerSplit,
                      { color: tx.isPositive ? Colors.positive : Colors.negative },
                    ]}
                  >
                    {tx.splitText}
                  </Text>
                  <Text style={styles.ledgerTotal}>{tx.amount}</Text>
                </View>
              </TactilePressable>
            );
          })}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  brandSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  groupPickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.4,
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  pillBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
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
  heroLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textTertiary,
    letterSpacing: 1.1,
    marginBottom: 6,
  },
  heroAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.positive,
    letterSpacing: -1,
  },
  heroSubtext: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 20,
  },
  metricsBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radii.md,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  metricItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  metricDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  metricDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 10,
  },
  metricLabel: {
    fontSize: 11,
    color: Colors.textTertiary,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 26,
  },
  actionButtonPrimary: {
    flex: 1,
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
  actionButtonPrimaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtonSecondary: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: 14,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionButtonSecondaryText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sectionCount: {
    fontSize: 12,
    color: Colors.textTertiary,
    fontWeight: '500',
  },
  ledgerList: {
    gap: 10,
  },
  ledgerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ledgerIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  ledgerContent: {
    flex: 1,
    marginRight: 10,
  },
  ledgerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  ledgerMeta: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  ledgerAmountCol: {
    alignItems: 'flex-end',
  },
  ledgerSplit: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  ledgerTotal: {
    fontSize: 11,
    color: Colors.textTertiary,
  },
});
