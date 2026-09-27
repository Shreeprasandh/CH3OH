import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface BikeTelemetryWidgetProps {
  currentKm?: number;
  vehiclePlate?: string;
  currentHolder?: string;
  fuelPercent?: number;
}

export function BikeTelemetryWidget({
  currentKm = 14892,
  vehiclePlate = 'KA-01-MJ-4041',
  currentHolder = 'You',
  fuelPercent = 78,
}: BikeTelemetryWidgetProps) {
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
        <TextWidget
          text="BIKE TELEMETRY"
          style={{
            fontSize: 10,
            fontWeight: '700',
            color: '#657350',
            letterSpacing: 1.1,
          }}
        />
        <TextWidget
          text={vehiclePlate}
          style={{
            fontSize: 10,
            color: '#757973',
            fontWeight: '500',
          }}
        />
      </FlexWidget>

      {/* Main Odometer Reading */}
      <FlexWidget style={{ marginVertical: 6 }}>
        <TextWidget
          text={`${currentKm.toLocaleString()} km`}
          style={{
            fontSize: 24,
            fontWeight: '700',
            color: '#1C1F1D',
          }}
        />
        <TextWidget
          text={`Holder: ${currentHolder} • Fuel: ${fuelPercent}%`}
          style={{
            fontSize: 11,
            color: '#757973',
            marginTop: 2,
          }}
        />
      </FlexWidget>

      {/* Footer Pill Action */}
      <FlexWidget
        style={{
          backgroundColor: '#38432E',
          borderRadius: 14,
          paddingVertical: 8,
          paddingHorizontal: 12,
          alignItems: 'center',
          justifyContent: 'center',
          width: 'match_parent',
        }}
        clickAction="BIKE_HANDOVER"
      >
        <TextWidget
          text="Log Handover"
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
