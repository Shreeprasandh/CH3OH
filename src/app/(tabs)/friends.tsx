import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  User,
  ShieldCheck,
} from 'lucide-react-native';
import { Colors, Radii, Spacing } from '../../theme/colors';
import { TactilePressable } from '../../components/TactilePressable';

export default function FriendsScreen() {
  const [settledIds, setSettledIds] = useState<string[]>([]);

  const friends = [
    {
      id: 'f-1',
      name: 'Sarah Jenkins',
      initials: 'SJ',
      netPaise: 84000, // +840.00
      statusText: 'owes you ₹840.00',
      isPositive: true,
      lastInteraction: 'Coffee on Friday',
    },
    {
      id: 'f-2',
      name: 'Karthik Rao',
      initials: 'KR',
      netPaise: -36000, // -360.00
      statusText: 'you owe ₹360.00',
      isPositive: false,
      lastInteraction: 'Biryani dinner',
    },
    {
      id: 'f-3',
      name: 'Rohan Verma',
      initials: 'RV',
      netPaise: 94000, // +940.00
      statusText: 'owes you ₹940.00',
      isPositive: true,
      lastInteraction: 'Petrol refill',
    },
  ];

  const simplifiedDebts = [
    { from: 'Karthik Rao', to: 'You', amount: '₹360.00' },
    { from: 'Sarah Jenkins', to: 'You', amount: '₹840.00' },
    { from: 'Rohan Verma', to: 'You', amount: '₹940.00' },
  ];

  const handleSettle = (friendId: string, name: string, amount: string) => {
    Alert.alert(
      'Settle Balance',
      `Record payment with ${name} for ${amount}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm Settle',
          onPress: () => {
            setSettledIds((prev) => [...prev, friendId]);
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
          <Text style={styles.headerSubtitle}>PEER BALANCES</Text>
          <Text style={styles.headerTitle}>Friends & Debts</Text>
        </View>

        {/* Min-Cash-Flow Optimization Banner */}
        <View style={styles.optimizerCard}>
          <View style={styles.optimizerHeader}>
            <Sparkles size={16} color={Colors.primary} />
            <Text style={styles.optimizerBadge}>MIN-CASH-FLOW SIMPLIFIED</Text>
          </View>
          <Text style={styles.optimizerTitle}>
            3 direct transfers resolve all shared expenses
          </Text>
          <Text style={styles.optimizerDesc}>
            Greedy reduction eliminated 4 redundant cross-payments, preserving 100% mathematical parity.
          </Text>
        </View>

        {/* Friends Ledger List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>1-on-1 Balances</Text>
          <Text style={styles.sectionMeta}>{friends.length} peers</Text>
        </View>

        <View style={styles.friendsList}>
          {friends.map((f) => {
            const isSettled = settledIds.includes(f.id);
            const amountFormatted = `₹${Math.abs(f.netPaise / 100).toFixed(2)}`;

            return (
              <View key={f.id} style={styles.friendCard}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{f.initials}</Text>
                </View>

                <View style={styles.friendInfo}>
                  <Text style={styles.friendName}>{f.name}</Text>
                  <Text style={styles.friendMeta}>
                    {isSettled ? 'Settled up' : f.lastInteraction}
                  </Text>
                </View>

                <View style={styles.friendActionCol}>
                  {isSettled ? (
                    <View style={styles.settledBadge}>
                      <CheckCircle2 size={14} color={Colors.positive} />
                      <Text style={styles.settledText}>Settled</Text>
                    </View>
                  ) : (
                    <>
                      <Text
                        style={[
                          styles.friendAmount,
                          { color: f.isPositive ? Colors.positive : Colors.negative },
                        ]}
                      >
                        {f.isPositive ? `+${amountFormatted}` : `-${amountFormatted}`}
                      </Text>

                      <TactilePressable
                        style={styles.settlePill}
                        onPress={() => handleSettle(f.id, f.name, amountFormatted)}
                      >
                        <Text style={styles.settlePillText}>Settle</Text>
                      </TactilePressable>
                    </>
                  )}
                </View>
              </View>
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
  optimizerCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
  },
  optimizerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  optimizerBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1,
  },
  optimizerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  optimizerDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sectionMeta: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  friendsList: {
    gap: 10,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  friendMeta: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  friendActionCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  friendAmount: {
    fontSize: 14,
    fontWeight: '700',
  },
  settlePill: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: Radii.pill,
  },
  settlePillText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  settledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.positiveBg,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: Radii.pill,
  },
  settledText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.positive,
  },
});
