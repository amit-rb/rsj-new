<script lang="ts">
	import { currentUser } from '$lib/stores/auth';
	import { CreditCard, Download, Eye, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-svelte';
	import type { PageData } from './$types';
	import type { Payment } from '$lib/api/paymentService';

	export let data: PageData;

	// Extract payment history from the data
	$: paymentHistory = data.paymentHistory;
	$: error = data.error;

	// Combine admission payments and course fees into a single transactions array
	$: transactions = paymentHistory ? [
		...formatPayments(paymentHistory.admissionPayments, 'Admission Payment'),
		...formatPayments(paymentHistory.courseFees, 'Course Fee')
	] : [];

	// Format payments from the API into a consistent format for display
	function formatPayments(payments: Payment[], defaultDescription: string) {
		return payments.map(payment => ({
			id: payment._id,
			date: new Date(payment.payment_time).toISOString().split('T')[0],
			description: getPaymentDescription(payment, defaultDescription),
			amount: payment.payment_amount,
			status: getPaymentStatus(payment.payment_status),
			method: getPaymentMethod(payment),
			receiptUrl: '#', // API doesn't provide receipt URLs yet
			rawPayment: payment // Keep the raw payment data for reference
		}));
	}

	// Get a human-readable description for the payment
	function getPaymentDescription(payment: Payment, defaultDescription: string) {
		// You could extract more meaningful descriptions from the payment data if available
		return defaultDescription;
	}

	// Map API payment status to our status values
	function getPaymentStatus(status: string) {
		switch (status.toUpperCase()) {
			case 'SUCCESS':
				return 'completed';
			case 'PENDING':
				return 'pending';
			case 'FAILED':
				return 'failed';
			default:
				return 'pending';
		}
	}

	// Get a human-readable payment method
	function getPaymentMethod(payment: Payment) {
		if (payment.payment_method.card) {
			return `${payment.payment_method.card.card_network} ****${payment.payment_method.card.card_number.slice(-4)}`;
		} else if (payment.payment_method.netbanking) {
			return `${payment.payment_method.netbanking.netbanking_bank_name}`;
		} else {
			return payment.payment_group || 'Unknown';
		}
	}

	// Extract payment methods from transactions
	$: paymentMethods = transactions
		.filter(t => t.method && t.method !== 'Auto-pay scheduled')
		.reduce((methods, t) => {
			// Check if this method is already in our list
			const existingMethod = methods.find(m => m.last4 === t.method.slice(-4) && m.brand === t.method.split(' ')[0]);
			if (!existingMethod && t.method.includes('****')) {
				const [brand, cardNumber] = t.method.split(' ');
				methods.push({
					id: methods.length + 1 + '',
					type: 'card',
					last4: cardNumber.slice(-4),
					brand,
					expiryMonth: 12, // We don't have this info from the API
					expiryYear: new Date().getFullYear() + 1, // We don't have this info from the API
					isDefault: methods.length === 0 // First one is default
				});
			}
			return methods;
		}, [] as Array<{
			id: string;
			type: string;
			last4: string;
			brand: string;
			expiryMonth: number;
			expiryYear: number;
			isDefault: boolean;
		}>);

	// For now, we don't have upcoming payments from the API, so we'll use an empty array
	const upcomingPayments: Array<{
		id: string;
		dueDate: string;
		description: string;
		amount: number;
		status: string;
	}> = [];

	function getInitials(name: string): string {
		if (!name) return '';
		return name
			.split(' ')
			.map(word => word.charAt(0))
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}

	function getStatusColor(status: string) {
		switch (status) {
			case 'completed':
				return 'text-green-600 bg-green-100';
			case 'pending':
				return 'text-yellow-600 bg-yellow-100';
			case 'due':
				return 'text-red-600 bg-red-100';
			case 'upcoming':
				return 'text-blue-600 bg-blue-100';
			default:
				return 'text-gray-600 bg-gray-100';
		}
	}

	function getStatusIcon(status: string) {
		switch (status) {
			case 'completed':
				return CheckCircle;
			case 'pending':
				return Clock;
			case 'due':
				return AlertCircle;
			case 'upcoming':
				return Calendar;
			default:
				return Clock;
		}
	}

	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(amount);
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Payment Overview - Republic School of Journalism</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<header class="bg-white shadow-sm border-b border-gray-200">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
				<div class="flex items-center space-x-3">
					<div class="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
						<span class="text-white font-bold text-lg">R</span>
					</div>
					<div>
						<h1 class="text-xl font-bold text-gray-900">Republic School</h1>
						<p class="text-sm text-gray-600">of Journalism</p>
					</div>
				</div>

				<nav class="hidden md:flex items-center space-x-8">
					<span class="text-purple-600 font-medium">Payment Overview</span>
					<div class="flex items-center space-x-2">
						<div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
							<span class="text-white text-xs font-bold">3</span>
						</div>
						<div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
							<span class="text-purple-600 text-sm font-bold">
								{getInitials($currentUser?.name || 'User')}
							</span>
						</div>
						<span class="text-sm font-medium text-gray-900">{$currentUser?.name || 'User'}</span>
					</div>
				</nav>
			</div>
		</div>
	</header>

	<!-- Sidebar -->
	<div class="flex">
		<aside class="w-64 bg-white shadow-sm min-h-screen">
			<div class="p-6">
				<div class="flex items-center space-x-3 mb-6">
					<div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
						<span class="text-purple-600 text-lg font-bold">
							{getInitials($currentUser?.name || 'User')}
						</span>
					</div>
					<div>
						<h3 class="font-semibold text-gray-900">{$currentUser?.name || 'User'}</h3>
						<p class="text-sm text-gray-600">{$currentUser?.email || ''}</p>
						<div class="flex items-center space-x-2 text-xs text-gray-500 mt-1">
							<span>{$currentUser?.totalCourses || 2} courses</span>
							<span class="text-purple-600">{$currentUser?.coursesCompleted || 1} completed</span>
						</div>
					</div>
				</div>

				<nav class="space-y-1">
					<a href="/profile" class="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
						<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
						<span>Profile</span>
					</a>
					<a href="#" class="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
						<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
						</svg>
						<span>Courses</span>
					</a>
					<a href="#" class="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
						<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
						</svg>
						<span>Assignments</span>
					</a>
					<a href="#" class="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
						<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
						</svg>
						<span>Grades</span>
					</a>

					<div class="pt-4 mt-4 border-t border-gray-200">
						<p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Payments & Billing</p>
						<a href="/payments" class="flex items-center space-x-3 px-3 py-2 text-purple-600 bg-purple-50 rounded-lg">
							<CreditCard class="w-5 h-5" />
							<span class="font-medium">Payment Overview</span>
						</a>
					</div>
				</nav>
			</div>
		</aside>

		<!-- Main Content -->
		<main class="flex-1 p-6">
			<!-- Page Header -->
			<div class="mb-8">
				<h1 class="text-3xl font-bold text-gray-900 mb-2">Payment Overview</h1>
				<p class="text-gray-600">Manage your payments, view transaction history, and update payment methods</p>
			</div>

			<!-- Payment Summary Cards -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				<div class="bg-white rounded-xl shadow-sm p-6">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium text-gray-600">Total Paid</p>
							<p class="text-2xl font-bold text-green-600">{formatCurrency(3000)}</p>
						</div>
						<div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
							<CheckCircle class="w-6 h-6 text-green-600" />
						</div>
					</div>
				</div>

				<div class="bg-white rounded-xl shadow-sm p-6">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium text-gray-600">Outstanding</p>
							<p class="text-2xl font-bold text-red-600">{formatCurrency(2500)}</p>
						</div>
						<div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
							<AlertCircle class="w-6 h-6 text-red-600" />
						</div>
					</div>
				</div>

				<div class="bg-white rounded-xl shadow-sm p-6">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium text-gray-600">Next Payment</p>
							<p class="text-2xl font-bold text-blue-600">Feb 15</p>
						</div>
						<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
							<Calendar class="w-6 h-6 text-blue-600" />
						</div>
					</div>
				</div>
			</div>

			<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<!-- Upcoming Payments -->
				<div class="bg-white rounded-xl shadow-sm">
					<div class="p-6 border-b border-gray-200">
						<h2 class="text-xl font-bold text-gray-900">Upcoming Payments</h2>
					</div>
					<div class="p-6">
						<div class="space-y-4">
							{#each upcomingPayments as payment}
								<div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
									<div class="flex items-center space-x-3">
										<div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
											<svelte:component this={getStatusIcon(payment.status)} class="w-5 h-5 text-gray-600" />
										</div>
										<div>
											<p class="font-medium text-gray-900">{payment.description}</p>
											<p class="text-sm text-gray-600">Due: {formatDate(payment.dueDate)}</p>
										</div>
									</div>
									<div class="text-right">
										<p class="font-bold text-gray-900">{formatCurrency(payment.amount)}</p>
										<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getStatusColor(payment.status)}">
											{payment.status}
										</span>
									</div>
								</div>
							{/each}
						</div>
						<button class="w-full mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200">
							Pay Now
						</button>
					</div>
				</div>

				<!-- Payment Methods -->
				<div class="bg-white rounded-xl shadow-sm">
					<div class="p-6 border-b border-gray-200">
						<div class="flex items-center justify-between">
							<h2 class="text-xl font-bold text-gray-900">Payment Methods</h2>
							<button class="text-purple-600 hover:text-purple-700 font-medium text-sm">
								+ Add New
							</button>
						</div>
					</div>
					<div class="p-6">
						<div class="space-y-4">
							{#each paymentMethods as method}
								<div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
									<div class="flex items-center space-x-3">
										<div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
											<CreditCard class="w-5 h-5 text-gray-600" />
										</div>
										<div>
											<p class="font-medium text-gray-900">{method.brand} ****{method.last4}</p>
											<p class="text-sm text-gray-600">Expires {method.expiryMonth}/{method.expiryYear}</p>
										</div>
									</div>
									<div class="flex items-center space-x-2">
										{#if method.isDefault}
											<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
												Default
											</span>
										{/if}
										<button class="text-gray-400 hover:text-gray-600">
											<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
											</svg>
										</button>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>

			<!-- Transaction History -->
			<div class="bg-white rounded-xl shadow-sm mt-8">
				<div class="p-6 border-b border-gray-200">
					<div class="flex items-center justify-between">
						<h2 class="text-xl font-bold text-gray-900">Transaction History</h2>
						<button class="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center space-x-1">
							<Download class="w-4 h-4" />
							<span>Export</span>
						</button>
					</div>
				</div>
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead class="bg-gray-50">
							<tr>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
							{#each transactions as transaction}
								<tr class="hover:bg-gray-50">
									<td class="px-6 py-4">
										<div>
											<p class="font-medium text-gray-900">{transaction.description}</p>
											<p class="text-sm text-gray-600">ID: {transaction.id}</p>
										</div>
									</td>
									<td class="px-6 py-4 text-sm text-gray-900">
										{formatDate(transaction.date)}
									</td>
									<td class="px-6 py-4 text-sm font-medium text-gray-900">
										{formatCurrency(transaction.amount)}
									</td>
									<td class="px-6 py-4">
										<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getStatusColor(transaction.status)}">
											{transaction.status}
										</span>
									</td>
									<td class="px-6 py-4 text-sm text-gray-600">
										{transaction.method}
									</td>
									<td class="px-6 py-4">
										<div class="flex items-center space-x-2">
											<button class="text-purple-600 hover:text-purple-700">
												<Eye class="w-4 h-4" />
											</button>
											{#if transaction.receiptUrl}
												<button class="text-gray-600 hover:text-gray-700">
													<Download class="w-4 h-4" />
												</button>
											{/if}
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</main>
	</div>
</div>
