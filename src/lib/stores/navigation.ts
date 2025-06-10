import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

// Store for the active navigation item
export const activeNavItem = writable<string>('/dashboard');

// Initialize navigation from localStorage or default to dashboard
export function initializeNavigation() {
  if (browser) {
    const storedNavItem = localStorage.getItem('activeNavItem');
    if (storedNavItem) {
      activeNavItem.set(storedNavItem);
    } else {
      // Default to dashboard if no stored value
      activeNavItem.set('/dashboard');
    }
  }
}

// Update active navigation item
export function updateActiveNavigation(path: string) {
  activeNavItem.set(path);
  
  if (browser) {
    localStorage.setItem('activeNavItem', path);
  }
}

// Check if a path is active
export function isPathActive(path: string): boolean {
  let currentPath: string;
  
  // Get the current value from the store
  activeNavItem.subscribe(value => {
    currentPath = value;
  })();
  
  // Exact match
  if (path === currentPath) {
    return true;
  }
  
  // Check if it's a parent path (e.g., /courses is active for /courses/123)
  if (path !== '/' && currentPath.startsWith(path)) {
    return true;
  }
  
  return false;
}

// CSS classes for active and inactive nav items
export const navItemActiveClass = 'bg-red-50 text-primary-600';
export const navItemInactiveClass = 'text-gray-700 hover:bg-gray-100 hover:text-gray-900';