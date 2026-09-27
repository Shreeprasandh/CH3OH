/**
 * CH3OH Calendar Synchronization Engine
 * Bridges backdated group expenses, settlements, and rides into the Wall Calendar & Weekly Horizon Strip.
 */

export interface CalendarExpenseEvent {
  id: string;
  groupId: string;
  title: string;
  date: string; // YYYY-MM-DD (Payment date)
  amountPaise: number;
  currency: string;
  category: "expense" | "settlement" | "ride" | "fuel" | "reminder";
  paidByName: string;
  isCurrentUserPayer: boolean;
}

const LOCAL_STORAGE_KEY = "ch3oh_calendar_events";

export function getLocalCalendarEvents(): CalendarExpenseEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveLocalCalendarEvents(events: CalendarExpenseEvent[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(events));
    window.dispatchEvent(new CustomEvent("ch3oh_calendar_update"));
  } catch {}
}

/**
 * Convert an expense into a calendar event anchored by its exact payment date
 */
export function expenseToCalendarEvent(
  expense: {
    id: string;
    groupId: string;
    title: string;
    amount: number;
    currency: string;
    expenseDate: string;
    paidByName: string;
    category?: string;
  },
  currentUserId: string,
  payerId: string
): CalendarExpenseEvent {
  return {
    id: `exp-${expense.id}`,
    groupId: expense.groupId,
    title: `${expense.title} (${expense.currency === "INR" ? "₹" : expense.currency} ${(expense.amount / 100).toFixed(0)})`,
    date: expense.expenseDate,
    amountPaise: expense.amount,
    currency: expense.currency,
    category: "expense",
    paidByName: expense.paidByName,
    isCurrentUserPayer: currentUserId === payerId,
  };
}
