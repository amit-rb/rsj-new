<script lang="ts">
  import { page } from '$app/stores';
  import { currentUser, isAuthenticated, logout } from '$lib/stores/auth';
  import { Bell, Search, ChevronDown } from 'lucide-svelte';
  import { goto } from '$app/navigation';

  let isProfileDropdownOpen = false;
  let searchQuery = '';

  function handleLogout() {
    logout();
    goto('/login');
  }

  function getInitials(name: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  function toggleProfileDropdown() {
    isProfileDropdownOpen = !isProfileDropdownOpen;
  }

  // Close dropdown when clicking outside
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-dropdown')) {
      isProfileDropdownOpen = false;
    }
  }

  // Get current page title
  $: pageTitle = (() => {
    const path = $page.url.pathname;
    if (path === '/profile') return 'Profile';
    if (path === '/payments') return 'Payments';
    if (path === '/courses') return 'Courses';
    if (path === '/assignments') return 'Assignments';
    if (path === '/lectures') return 'Lectures';
    if (path === '/attendance') return 'Attendance';
    if (path === '/grades') return 'Grades';
    if (path === '/calendar') return 'Calendar';
    if (path === '/chat') return 'Chat';
    if (path === '/doubts') return 'Doubts';
    if (path === '/feedback') return 'Feedback';
    if (path === '/settings') return 'Settings';
    return 'Dashboard';
  })();
</script>

<svelte:window on:click={handleClickOutside} />

{#if $isAuthenticated && $currentUser}
  <nav class="bg-white border-b border-gray-200 px-6 py-4">
    <div class="flex items-center justify-between">
      <!-- Left side - Logo and Page Title -->
      <div class="flex items-center space-x-6">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">R</span>
          </div>
          <div>
            <h1 class="text-lg font-bold text-gray-900">Republic School</h1>
            <p class="text-xs text-gray-600">of Journalism</p>
          </div>
        </div>
        
        <div class="text-2xl font-bold text-gray-900">
          {pageTitle}
        </div>
      </div>

      <!-- Center - Search Bar -->
      <div class="flex-1 max-w-lg mx-8">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search class="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="Search courses, assignments..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
          />
        </div>
      </div>

      <!-- Right side - Notifications and Profile -->
      <div class="flex items-center space-x-4">
        <!-- Notifications -->
        <button class="relative p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg">
          <Bell class="h-6 w-6" />
          <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
        </button>

        <!-- Profile Dropdown -->
        <div class="relative profile-dropdown">
          <button
            on:click={toggleProfileDropdown}
            class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {#if $currentUser.avatar}
              <img src={$currentUser.avatar} alt="Profile" class="w-8 h-8 rounded-full object-cover" />
            {:else}
              <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span class="text-purple-600 text-sm font-bold">
                  {getInitials($currentUser.name)}
                </span>
              </div>
            {/if}
            <div class="text-left hidden sm:block">
              <p class="text-sm font-medium text-gray-900">{$currentUser.name}</p>
              <p class="text-xs text-gray-600">{$currentUser.email}</p>
            </div>
            <ChevronDown class="h-4 w-4 text-gray-400" />
          </button>

          {#if isProfileDropdownOpen}
            <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <a
                href="/profile"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                on:click={() => isProfileDropdownOpen = false}
              >
                View Profile
              </a>
              <a
                href="/settings"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                on:click={() => isProfileDropdownOpen = false}
              >
                Settings
              </a>
              <hr class="my-1" />
              <button
                on:click={handleLogout}
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Sign Out
              </button>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </nav>
{/if}