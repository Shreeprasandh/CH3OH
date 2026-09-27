import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { Linking } from 'react-native';
import { QuickExpenseWidget } from './QuickExpenseWidget';
import { BikeTelemetryWidget } from './BikeTelemetryWidget';

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const widgetInfo = props.widgetInfo;
  const widgetAction = props.widgetAction;
  const clickAction = props.clickAction;

  switch (widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED':
      if (widgetInfo.widgetName === 'QuickExpenseWidget') {
        props.renderWidget(
          <QuickExpenseWidget
            balancePaise={142000}
            groupName="Apartment 402"
          />
        );
      } else if (widgetInfo.widgetName === 'BikeStatusWidget') {
        props.renderWidget(
          <BikeTelemetryWidget
            currentKm={14892}
            vehiclePlate="KA-01-MJ-4041"
            currentHolder="You"
            fuelPercent={78}
          />
        );
      }
      break;

    case 'WIDGET_CLICK':
      if (clickAction === 'ADD_EXPENSE') {
        await Linking.openURL('ch3oh://add');
      } else if (clickAction === 'BIKE_HANDOVER') {
        await Linking.openURL('ch3oh://bike');
      } else {
        await Linking.openURL('ch3oh://');
      }
      break;

    default:
      break;
  }
}
