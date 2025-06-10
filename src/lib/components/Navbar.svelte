<script lang="ts">
  import { page } from '$app/stores';
  import { currentUser, isAuthenticated, logout } from '$lib/stores/auth';
  import { Menu, X, User, LogOut, Bell } from 'lucide-svelte';

  let isMenuOpen = false;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  function handleLogout() {
    logout();
    window.location.href = '/login';
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
</script>

<nav class="bg-white shadow-md">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16">
      <div class="flex">
        <div class="flex-shrink-0 flex items-center">
          <a href="/" class="text-xl font-bold text-blue-600">RSJ</a>
        </div>
        <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
          <a 
            href="/" 
            class="{$page.url.pathname === '/' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
          >
            Dashboard
          </a>
          <a 
            href="/profile" 
            class="{$page.url.pathname === '/profile' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
          >
            Profile
          </a>
          <a 
            href="/payments" 
            class="{$page.url.pathname === '/payments' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
          >
            Payments
          </a>
        </div>
      </div>
      <div class="hidden sm:ml-6 sm:flex sm:items-center">
        <button class="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <span class="sr-only">View notifications</span>
          <Bell class="h-6 w-6" />
        </button>

        <!-- Profile dropdown -->
        {#if $isAuthenticated && $currentUser}
          <div class="ml-3 relative">
            <div>
              <button type="button" class="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                <span class="sr-only">Open user menu</span>
                {#if $currentUser.avatar}
                  <img class="h-8 w-8 rounded-full" src={$currentUser.avatar} alt="User avatar" />
                {:else}
                  <div class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    {getInitials($currentUser.name)}
                  </div>
                {/if}
              </button>
            </div>
          </div>
        {:else}
          <a href="/login" class="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Login
          </a>
        {/if}
      </div>
      <div class="-mr-2 flex items-center sm:hidden">
        <!-- Mobile menu button -->
        <button 
          on:click={toggleMenu}
          type="button" 
          class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500" 
          aria-controls="mobile-menu" 
          aria-expanded="false"
        >
          <span class="sr-only">Open main menu</span>
          {#if isMenuOpen}
            <X class="block h-6 w-6" />
          {:else}
            <Menu class="block h-6 w-6" />
          {/if}
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile menu, show/hide based on menu state. -->
  {#if isMenuOpen}
    <div class="sm:hidden" id="mobile-menu">
      <div class="pt-2 pb-3 space-y-1">
        <a 
          href="/" 
          class="{$page.url.pathname === '/' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
        >
          Dashboard
        </a>
        <a 
          href="/profile" 
          class="{$page.url.pathname === '/profile' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
        >
          Profile
        </a>
        <a 
          href="/payments" 
          class="{$page.url.pathname === '/payments' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
        >
          Payments
        </a>
      </div>
      {#if $isAuthenticated && $currentUser}
        <div class="pt-4 pb-3 border-t border-gray-200">
          <div class="flex items-center px-4">
            <div class="flex-shrink-0">
              {#if $currentUser.avatar}
                <img class="h-10 w-10 rounded-full" src={$currentUser.avatar} alt="User avatar" />
              {:else}
                <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {getInitials($currentUser.name)}
                </div>
              {/if}
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800">{$currentUser.name}</div>
              <div class="text-sm font-medium text-gray-500">{$currentUser.email}</div>
            </div>
          </div>
          <div class="mt-3 space-y-1">
            <a 
              href="/profile" 
              class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            >
              <div class="flex items-center">
                <User class="mr-3 h-5 w-5 text-gray-400" />
                Your Profile
              </div>
            </a>
            <button 
              on:click={handleLogout}
              class="w-full text-left block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            >
              <div class="flex items-center">
                <LogOut class="mr-3 h-5 w-5 text-gray-400" />
                Sign out
              </div>
            </button>
          </div>
        </div>
      {:else}
        <div class="pt-4 pb-3 border-t border-gray-200">
          <div class="flex items-center justify-center">
            <a href="/login" class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Login
            </a>
          </div>
        </div>
      {/if}
    </div>
  {/if}
</nav>