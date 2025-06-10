<script lang="ts">
  import { page } from '$app/stores';
  import { currentUser, isAuthenticated } from '$lib/stores/auth';
  import { 
    Home, 
    User, 
    CreditCard, 
    BookOpen, 
    Calendar, 
    FileText, 
    Settings, 
    HelpCircle,
    GraduationCap,
    ClipboardList,
    BarChart3,
    MessageCircle,
    HelpCircle as Doubts,
    MessageSquare,
    ChevronDown
  } from 'lucide-svelte';

  export let isOpen = true;
  
  const menuItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/courses', label: 'Courses', icon: BookOpen },
    { href: '/assignments', label: 'Assignments', icon: ClipboardList },
    { href: '/lectures', label: 'Lectures', icon: GraduationCap },
    { href: '/attendance', label: 'Attendance', icon: Calendar },
    { href: '/grades', label: 'Grades', icon: BarChart3 },
    { href: '/calendar', label: 'Calendar', icon: Calendar },
    { href: '/chat', label: 'Chat', icon: MessageCircle },
    { href: '/doubts', label: 'Doubts', icon: Doubts },
    { href: '/feedback', label: 'Feedback', icon: MessageSquare },
  ];
  
  const paymentItems = [
    { href: '/payments', label: 'Payment Overview', icon: CreditCard },
    { href: '/payment-methods', label: 'Payment Methods', icon: CreditCard },
    { href: '/transaction-history', label: 'Transaction History', icon: FileText },
    { href: '/invoices', label: 'Invoices & Receipts', icon: FileText },
  ];
  
  const bottomMenuItems = [
    { href: '/settings', label: 'Settings', icon: Settings },
    { href: '/help', label: 'Help & Support', icon: HelpCircle },
  ];

  let isPaymentSectionOpen = false;

  function togglePaymentSection() {
    isPaymentSectionOpen = !isPaymentSectionOpen;
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

  // Check if current path is in payment section
  $: isPaymentPath = $page.url.pathname.startsWith('/payment') || $page.url.pathname === '/payments';
  $: if (isPaymentPath) {
    isPaymentSectionOpen = true;
  }
</script>

{#if $isAuthenticated && $currentUser}
  <aside class="h-screen {isOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-white border-r border-gray-200 flex flex-col">
    <!-- User Profile Section -->
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center space-x-3">
        {#if $currentUser.avatar}
          <img src={$currentUser.avatar} alt="Profile" class="w-12 h-12 rounded-full object-cover" />
        {:else}
          <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <span class="text-purple-600 text-lg font-bold">
              {getInitials($currentUser.name)}
            </span>
          </div>
        {/if}
        {#if isOpen}
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-gray-900 truncate">{$currentUser.name}</h3>
            <p class="text-sm text-gray-600 truncate">{$currentUser.email}</p>
            <div class="flex items-center space-x-2 text-xs text-gray-500 mt-1">
              <span>{$currentUser.totalCourses || 2} courses</span>
              <span class="text-purple-600">{$currentUser.coursesCompleted || 1} completed</span>
            </div>
          </div>
        {/if}
      </div>
    </div>
    
    <!-- Navigation Menu -->
    <nav class="flex-1 px-4 py-6 overflow-y-auto">
      <div class="space-y-1">
        {#each menuItems as item}
          <a 
            href={item.href} 
            class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 {$page.url.pathname === item.href ? 'bg-purple-50 text-purple-600' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}"
          >
            <svelte:component 
              this={item.icon} 
              class="mr-3 h-5 w-5 {$page.url.pathname === item.href ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-500'}" 
            />
            {#if isOpen}
              {item.label}
            {/if}
          </a>
        {/each}
      </div>

      <!-- Payments & Billing Section -->
      <div class="mt-8">
        {#if isOpen}
          <div class="px-3 mb-2">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Payments & Billing</p>
          </div>
        {/if}
        
        <div class="space-y-1">
          <button
            on:click={togglePaymentSection}
            class="w-full group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 {isPaymentPath ? 'bg-purple-50 text-purple-600' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}"
          >
            <CreditCard class="mr-3 h-5 w-5 {isPaymentPath ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-500'}" />
            {#if isOpen}
              <span class="flex-1 text-left">Payment Overview</span>
              <ChevronDown class="h-4 w-4 transition-transform duration-200 {isPaymentSectionOpen ? 'rotate-180' : ''}" />
            {/if}
          </button>

          {#if isPaymentSectionOpen && isOpen}
            <div class="ml-6 space-y-1">
              {#each paymentItems.slice(1) as item}
                <a 
                  href={item.href} 
                  class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 {$page.url.pathname === item.href ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}"
                >
                  <svelte:component 
                    this={item.icon} 
                    class="mr-3 h-4 w-4 {$page.url.pathname === item.href ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-500'}" 
                  />
                  {item.label}
                </a>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    </nav>
    
    <!-- Bottom Menu Items -->
    <div class="p-4 border-t border-gray-200">
      <div class="space-y-1">
        {#each bottomMenuItems as item}
          <a 
            href={item.href} 
            class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 {$page.url.pathname === item.href ? 'bg-purple-50 text-purple-600' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}"
          >
            <svelte:component 
              this={item.icon} 
              class="mr-3 h-5 w-5 {$page.url.pathname === item.href ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-500'}" 
            />
            {#if isOpen}
              {item.label}
            {/if}
          </a>
        {/each}
      </div>
    </div>
  </aside>
{/if}