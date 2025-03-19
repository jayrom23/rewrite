/**
 * Central event manager for application-wide events
 * 
 * This provides a consistent API for event handling across components
 */

// Event types supported by the application
export type AppEventType = 
  | 'guide-action'
  | 'help-action' 
  | 'ui-action'
  | 'guide-completed';

// Event action types
export interface AppEventDetail {
  action: string;
  [key: string]: any; // Additional properties
}

/**
 * Add an event listener for an application event
 * 
 * @param eventType The type of event to listen for
 * @param callback Function to call when the event occurs
 * @returns A cleanup function to remove the listener
 */
export function addEventListener(
  eventType: AppEventType,
  callback: (detail: AppEventDetail) => void
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
export function dispatchEvent(
  eventType: AppEventType,
  detail: AppEventDetail
): void {
  try {
    document.dispatchEvent(new CustomEvent(eventType, { detail }));
  } catch (error) {
    console.error(`Error dispatching ${eventType} event:`, error);
  }
}
