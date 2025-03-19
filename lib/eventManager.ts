/**
 * Central event manager for application-wide events
 * 
 * This provides a consistent API for event handling across components
 */

// Event types supported by the application
export type AppEventType = 
  | 'help-action' 
  | 'ui-action';

// Define all possible actions to ensure type safety
export type AppEventAction =
  | 'close-help'
  | 'toggle-export-panel'
  | 'export-action'
  | 'export'
  | 'show-export-panel'
  | 'hide-export-panel'
  | string; // Allow string for backward compatibility

// Event detail type with strongly-typed action
export interface AppEventDetail {
  action: AppEventAction;
  [key: string]: any; // Additional properties
}

/**
 * Add an event listener for an application event
 * 
 * @param eventType The type of event to listen for
 * @param callback Function to call when the event occurs
 * @returns A cleanup function to remove the listener
 */
export function addEventListener<T extends AppEventDetail = AppEventDetail>(
  eventType: AppEventType,
  callback: (detail: T) => void
): () => void {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent;
    callback(customEvent.detail);
  };
  
  document.addEventListener(eventType, handler);
  
  // Return unsubscribe function
  return () => {
    document.removeEventListener(eventType, handler);
  };
}

/**
 * Dispatch an application event
 * 
 * @param eventType The type of event to dispatch
 * @param detail Event details
 */
export function dispatchEvent<T extends AppEventDetail = AppEventDetail>(
  eventType: AppEventType,
  detail: T
): void {
  try {
    document.dispatchEvent(new CustomEvent(eventType, { detail }));
  } catch (error) {
    console.error(`Error dispatching ${eventType} event:`, error);
  }
}
