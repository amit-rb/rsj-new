<script lang="ts">
  import { page } from '$app/stores';
  import { 
    Home, 
    User, 
    CreditCard, 
    BookOpen, 
    Calendar, 
    FileText, 
    Settings, 
    HelpCircle 
  } from 'lucide-svelte';

  export let isOpen = true;
  
  const menuItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/payments', label: 'Payments', icon: CreditCard },
    { href: '/courses', label: 'Courses', icon: BookOpen },
    { href: '/schedule', label: 'Schedule', icon: Calendar },
    { href: '/resources', label: 'Resources', icon: FileText },
  ];
  
  const bottomMenuItems = [
    { href: '/settings', label: 'Settings', icon: Settings },
    { href: '/help', label: 'Help & Support', icon: HelpCircle },
  ];
</script>

<aside class="h-screen {isOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-gray-800 text-white">
  <div class="h-full flex flex-col justify-between">
    <div>
      <div class="p-4 flex items-center justify-center">
        {#if isOpen}
          <span class="text-xl font-bold">RSJ Student</span>
        {:else}
          <span class="text-xl font-bold">RSJ</span>
        {/if}
      </div>
      
      <nav class="mt-5 px-2">
        <div class="space-y-1">
          {#each menuItems as item}
            <a 
              href={item.href} 
              class="group flex items-center px-2 py-2 text-base font-medium rounded-md {$page.url.pathname === item.href ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}"
            >
              <svelte:component this={item.icon} class="mr-3 h-6 w-6 {$page.url.pathname === item.href ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}" />
              {#if isOpen}
                {item.label}
              {/if}
            </a>
          {/each}
        </div>
      </nav>
    </div>
    
    <div class="mb-6 px-2">
      <div class="space-y-1">
        {#each bottomMenuItems as item}
          <a 
            href={item.href} 
            class="group flex items-center px-2 py-2 text-base font-medium rounded-md {$page.url.pathname === item.href ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}"
          >
            <svelte:component this={item.icon} class="mr-3 h-6 w-6 {$page.url.pathname === item.href ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}" />
            {#if isOpen}
              {item.label}
            {/if}
          </a>
        {/each}
      </div>
    </div>
  </div>
</aside>