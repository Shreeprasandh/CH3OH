import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface QuickExpenseWidgetProps {
  balancePaise?: number; // e.g. +142000 for +1,420
  groupName?: string;
}

export function QuickExpenseWidget({
  balancePaise = 142000,
  groupName = 'Apartment 402',
}: QuickExpenseWidgetProps) {
  const isPositive = balancePaise >= 0;
  const balanceRupees = Math.abs(balancePaise / 100).toLocaleString('en-IN');
  const balanceText = isPositive ? `+₹${balanceRupees}` : `-₹${balanceRupees}`;
  const statusLabel = isPositive ? 'You are owed' : 'You owe';
  const balanceColor = isPositive ? '#3F6E4E' : '#964937';

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#F9F6F0',
        borderRadius: 24,
        borderColor: '#EAE4DA',
        borderWidth: 1,
        padding: 16,
        justifyContent: 'space-between',
      }}
      clickAction="OPEN_APP"
    >
      {/* Header */}
      <FlexWidget
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: 'match_parent',
        }}
      >
        <FlexWidget style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextWidget
            text="CH3OH"
            style={{
              fontSize: 11,
              fontWeight: '700',
              color: '#657350',
              letterSpacing: 1.2,
            }}
          />
        </FlexWidget>

        <TextWidget
          text={groupName}
          style={{
            fontSize: 10,
            color: '#757973',
            fontWeight: '500',
          }}
        />
      </FlexWidget>

      {/* Main Focus: Tactile Balance */}
      <FlexWidget style={{ marginVertical: 8 }}>
        <TextWidget
          text={statusLabel}
          style={{
            fontSize: 11,
            color: '#757973',
            fontWeight: '500',
            marginBottom: 2,
          }}
        />
        <TextWidget
          text={balanceText}
          style={{
            fontSize: 26,
            fontWeight: '700',
            color: balanceColor,
          }}
        />
      </FlexWidget>

      {/* Footer Pill Action */}
      <FlexWidget
        style={{
          backgroundColor: '#657350',
          borderRadius: 14,
          paddingVertical: 8,
          paddingHorizontal: 12,
          alignItems: 'center',
          justifyContent: 'center',
          width: 'match_parent',
        }}
        clickAction="ADD_EXPENSE"
      >
        <TextWidget
          text="+ Split Expense"
          style={{
            fontSize: 12,
            fontWeight: '600',
            color: '#FFFFFF',
          }}
        />
      </FlexWidget>
    </FlexWidget>
  );
}
