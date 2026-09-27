import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Check,
  Receipt,
  Users,
  Percent,
  Divide,
  Scale,
  SlidersHorizontal,
} from 'lucide-react-native';
import { Colors, Radii, Spacing } from '../../theme/colors';
import { TactilePressable } from '../../components/TactilePressable';
import { matchCategoryFromTitle } from '../../../lib/category-icons';
import { useRouter } from 'expo-router';

export default function AddExpenseScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [splitMode, setSplitMode] = useState<'equal' | 'exact' | 'percentage' | 'shares'>('equal');
  const [paidBy, setPaidBy] = useState('You');

  const { IconComponent, category } = matchCategoryFromTitle(title);

  const members = ['You', 'Sarah', 'Karthik'];

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Missing Description', 'Please give this expense a short title.');
      return;
    }
    const num = parseFloat(amountStr);
    if (!num || num <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid expense amount.');
      return;
    }

    Alert.alert('Expense Recorded', `₹${num.toFixed(2)} recorded for ${title}.`, [
      {
        text: 'View Ledger',
        onPress: () => {
          setTitle('');
          setAmountStr('');
          router.push('/(tabs)');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerSubtitle}>NEW TRANSACTION</Text>
          <Text style={styles.headerTitle}>Add Expense</Text>
        </View>

        {/* Dynamic Icon & Title Card */}
        <View style={styles.inputCard}>
          <View style={styles.categoryIconCircle}>
            <IconComponent size={22} color={Colors.primary} strokeWidth={2} />
          </View>

          <TextInput
            style={styles.titleInput}
            placeholder="What was this for? (e.g. Petrol, Coffee)"
            placeholderTextColor={Colors.textTertiary}
            value={title}
            onChangeText={setTitle}
            maxLength={60}
          />
        </View>

        {/* Tactile Amount Card */}
        <View style={styles.amountCard}>
          <Text style={styles.amountPrefix}>₹</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0"
            placeholderTextColor={Colors.textTertiary}
            keyboardType="decimal-pad"
            value={amountStr}
            onChangeText={setAmountStr}
            maxLength={8}
          />
        </View>

        {/* Payer Selector */}
        <Text style={styles.sectionLabel}>PAID BY</Text>
        <View style={styles.pillRow}>
          {members.map((m) => {
            const isSelected = paidBy === m;
            return (
              <TactilePressable
                key={m}
                style={[
                  styles.selectorPill,
                  isSelected && styles.selectorPillActive,
                ]}
                onPress={() => setPaidBy(m)}
              >
                <Text
                  style={[
                    styles.selectorPillText,
                    isSelected && styles.selectorPillTextActive,
                  ]}
                >
                  {m}
                </Text>
              </TactilePressable>
            );
          })}
        </View>

        {/* Split Mode Selector */}
        <Text style={styles.sectionLabel}>SPLIT METHOD</Text>
        <View style={styles.splitGrid}>
          {[
            { key: 'equal', label: 'Equally', icon: Divide },
            { key: 'exact', label: 'Exact ₹', icon: Receipt },
            { key: 'percentage', label: 'Percent %', icon: Percent },
            { key: 'shares', label: 'Shares', icon: Scale },
          ].map((mode) => {
            const isSelected = splitMode === mode.key;
            const ModeIcon = mode.icon;
            return (
              <TactilePressable
                key={mode.key}
                style={[
                  styles.splitCard,
                  isSelected && styles.splitCardActive,
                ]}
                onPress={() => setSplitMode(mode.key as any)}
              >
                <ModeIcon
                  size={18}
                  color={isSelected ? Colors.primary : Colors.textTertiary}
                  strokeWidth={2}
                />
                <Text
                  style={[
                    styles.splitCardText,
                    isSelected && styles.splitCardTextActive,
                  ]}
                >
                  {mode.label}
                </Text>
              </TactilePressable>
            );
          })}
        </View>

        {/* Split Preview */}
        {amountStr && parseFloat(amountStr) > 0 && (
          <View style={styles.previewBox}>
            <Text style={styles.previewLabel}>CALCULATED SHARE</Text>
            <Text style={styles.previewText}>
              ₹{(parseFloat(amountStr) / 3).toFixed(2)} per person (3 members)
            </Text>
          </View>
        )}

        {/* Save Button */}
        <TactilePressable style={styles.saveButton} onPress={handleSave}>
          <Check size={18} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.saveButtonText}>Record Expense</Text>
        </TactilePressable>
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
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 14,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  categoryIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  amountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
  },
  amountPrefix: {
    fontSize: 32,
    fontWeight: '600',
    color: Colors.textTertiary,
    marginRight: 8,
  },
  amountInput: {
    fontSize: 44,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textTertiary,
    letterSpacing: 1,
    marginBottom: 10,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  selectorPill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: Radii.pill,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectorPillActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  selectorPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  selectorPillTextActive: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  splitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  splitCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.surface,
    padding: 14,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  splitCardActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  splitCardText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  splitCardTextActive: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  previewBox: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radii.md,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    marginBottom: 24,
  },
  previewLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  previewText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: Radii.lg,
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
