<script lang="ts">
  import Navbar from './Navbar.svelte';
  import Sidebar from './Sidebar.svelte';
  import { isAuthenticated } from '$lib/stores/auth';
  import { writable } from 'svelte/store';
  import { ChevronLeft, ChevronRight } from 'lucide-svelte';

  export let children;
  
  const sidebarOpen = writable(true);
  
  function toggleSidebar() {
    $sidebarOpen = !$sidebarOpen;
  }
</script>

{#if $isAuthenticated}
  <div class="flex h-screen bg-gray-50">
    <Sidebar isOpen={$sidebarOpen} />
    
    <div class="flex-1 flex flex-col overflow-hidden">
      <Navbar />
      
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
        <div class="container mx-auto px-6 py-8">
          <button 
            on:click={toggleSidebar} 
            class="fixed left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-r-md shadow-md z-10 {$sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300 border border-l-0 border-gray-200"
          >
            {#if $sidebarOpen}
              <ChevronLeft class="h-5 w-5 text-gray-600" />
            {:else}
              <ChevronRight class="h-5 w-5 text-gray-600" />
            {/if}
          </button>
          
          <div class="transition-all duration-300">
            {@render children()}
          </div>
        </div>
      </main>
    </div>
  </div>
{:else}
  <!-- For non-authenticated pages, render children without layout -->
  {@render children()}
{/if}