import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react-native';
import { Colors, Radii, Spacing } from '../../theme/colors';
import { TactilePressable } from '../../components/TactilePressable';
import { MONTH_DATA, MONTH_NAMES } from '../../../lib/monthImages';

const { width } = Dimensions.get('window');

export default function CalendarScreen() {
  const [currentMonthIdx, setCurrentMonthIdx] = useState(8); // September (0-indexed)
  const [selectedDay, setSelectedDay] = useState(27);

  const monthInfo = MONTH_DATA[currentMonthIdx] || MONTH_DATA[8];

  // Days in current month
  const daysInMonth = 30;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Sample backdated synchronized expenses
  const expenseDays = [4, 12, 18, 24, 25, 27];

  const handlePrevMonth = () => {
    setCurrentMonthIdx((prev) => (prev > 0 ? prev - 1 : 11));
  };

  const handleNextMonth = () => {
    setCurrentMonthIdx((prev) => (prev < 11 ? prev + 1 : 0));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerSubtitle}>FINANCIAL HORIZON</Text>
          <Text style={styles.headerTitle}>Wall Calendar</Text>
        </View>

        {/* 3D Wall Calendar Card */}
        <View style={styles.calendarArtworkCard}>
          <Image
            source={monthInfo.src}
            style={styles.artworkImage}
            resizeMode="cover"
          />

          {/* Month Controller Overlay */}
          <View style={styles.monthController}>
            <TactilePressable style={styles.arrowButton} onPress={handlePrevMonth}>
              <ChevronLeft size={20} color="#FFFFFF" />
            </TactilePressable>

            <View style={styles.monthTitleBox}>
              <Text style={styles.monthName}>{monthInfo.name}</Text>
              <Text style={styles.yearText}>2026</Text>
            </View>

            <TactilePressable style={styles.arrowButton} onPress={handleNextMonth}>
              <ChevronRight size={20} color="#FFFFFF" />
            </TactilePressable>
          </View>
        </View>

        {/* Tactile Day Grid */}
        <View style={styles.gridCard}>
          {/* Weekday headers */}
          <View style={styles.weekHeaderRow}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
              <Text key={idx} style={styles.weekHeaderDay}>
                {day}
              </Text>
            ))}
          </View>

          {/* Day Tiles */}
          <View style={styles.daysGrid}>
            {days.map((day) => {
              const isSelected = selectedDay === day;
              const hasExpense = expenseDays.includes(day);

              return (
                <TactilePressable
                  key={day}
                  style={[
                    styles.dayTile,
                    isSelected && styles.dayTileSelected,
                  ]}
                  onPress={() => setSelectedDay(day)}
                >
                  <Text
                    style={[
                      styles.dayNumber,
                      isSelected && styles.dayNumberSelected,
                    ]}
                  >
                    {day}
                  </Text>

                  {hasExpense && (
                    <View
                      style={[
                        styles.expenseDot,
                        isSelected && { backgroundColor: '#FFFFFF' },
                      ]}
                    />
                  )}
                </TactilePressable>
              );
            })}
          </View>
        </View>

        {/* Synchronized Expenses for Selected Day */}
        <View style={styles.detailCard}>
          <View style={styles.detailHeader}>
            <CalendarIcon size={16} color={Colors.primary} />
            <Text style={styles.detailDate}>
              {selectedDay} {monthInfo.name} 2026
            </Text>
          </View>

          {expenseDays.includes(selectedDay) ? (
            <View style={styles.expenseEntry}>
              <Text style={styles.expenseTitle}>Shell Petrol & Chain Lube</Text>
              <Text style={styles.expenseAmount}>₹650.00</Text>
            </View>
          ) : (
            <Text style={styles.noExpensesText}>No expenses recorded on this day.</Text>
          )}
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
  calendarArtworkCard: {
    height: 220,
    borderRadius: Radii.xl,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
    backgroundColor: Colors.surfaceMuted,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  artworkImage: {
    width: '100%',
    height: '100%',
  },
  monthController: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  arrowButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitleBox: {
    alignItems: 'center',
  },
  monthName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  yearText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  gridCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  weekHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  weekHeaderDay: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textTertiary,
    width: 36,
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    rowGap: 8,
  },
  dayTile: {
    width: 38,
    height: 44,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayTileSelected: {
    backgroundColor: Colors.primary,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  dayNumberSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  expenseDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    marginTop: 3,
  },
  detailCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  detailDate: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  expenseEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    padding: 12,
    borderRadius: Radii.md,
  },
  expenseTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  expenseAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.positive,
  },
  noExpensesText: {
    fontSize: 12,
    color: Colors.textTertiary,
    fontStyle: 'italic',
  },
});
