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
		return new Intl.NumberFormat('en-IN', {
			style: 'currency',
			currency: 'INR'
		}).format(amount);
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	// Calculate totals
	$: totalPaid = transactions
		.filter(t => t.status === 'completed')
		.reduce((sum, t) => sum + t.amount, 0);

	$: totalPending = transactions
		.filter(t => t.status === 'pending')
		.reduce((sum, t) => sum + t.amount, 0);
</script>

<svelte:head>
	<title>Payment Overview - Republic School of Journalism</title>
</svelte:head>

<!-- Page Header -->
<div class="mb-8">
	<h1 class="text-3xl font-bold text-gray-900 mb-2">Payment Overview</h1>
	<p class="text-gray-600">Manage your payments, view transaction history, and update payment methods</p>
</div>

<!-- Error Message -->
{#if error}
	<div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
		<div class="flex items-start space-x-2">
			<AlertCircle class="w-5 h-5 text-red-600 mt-0.5" />
			<div>
				<p class="text-sm text-red-700">{error}</p>
			</div>
		</div>
	</div>
{/if}

<!-- Payment Summary Cards -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
	<div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
		<div class="flex items-center justify-between">
			<div>
				<p class="text-sm font-medium text-gray-600">Total Paid</p>
				<p class="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
			</div>
			<div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
				<CheckCircle class="w-6 h-6 text-green-600" />
			</div>
		</div>
	</div>

	<div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
		<div class="flex items-center justify-between">
			<div>
				<p class="text-sm font-medium text-gray-600">Pending</p>
				<p class="text-2xl font-bold text-yellow-600">{formatCurrency(totalPending)}</p>
			</div>
			<div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
				<Clock class="w-6 h-6 text-yellow-600" />
			</div>
		</div>
	</div>

	<div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
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

<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
	<!-- Upcoming Payments -->
	<div class="bg-white rounded-xl shadow-sm border border-gray-200">
		<div class="p-6 border-b border-gray-200">
			<h2 class="text-xl font-bold text-gray-900">Upcoming Payments</h2>
		</div>
		<div class="p-6">
			{#if upcomingPayments.length > 0}
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
			{:else}
				<div class="text-center py-8">
					<Calendar class="w-12 h-12 text-gray-400 mx-auto mb-4" />
					<p class="text-gray-600">No upcoming payments</p>
				</div>
			{/if}
		</div>
	</div>

	<!-- Payment Methods -->
	<div class="bg-white rounded-xl shadow-sm border border-gray-200">
		<div class="p-6 border-b border-gray-200">
			<div class="flex items-center justify-between">
				<h2 class="text-xl font-bold text-gray-900">Payment Methods</h2>
				<button class="text-purple-600 hover:text-purple-700 font-medium text-sm">
					+ Add New
				</button>
			</div>
		</div>
		<div class="p-6">
			{#if paymentMethods.length > 0}
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
			{:else}
				<div class="text-center py-8">
					<CreditCard class="w-12 h-12 text-gray-400 mx-auto mb-4" />
					<p class="text-gray-600">No payment methods added</p>
					<button class="mt-2 text-purple-600 hover:text-purple-700 font-medium text-sm">
						Add your first payment method
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Transaction History -->
<div class="bg-white rounded-xl shadow-sm border border-gray-200">
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
		{#if transactions.length > 0}
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
									<p class="text-sm text-gray-600">ID: {transaction.id.slice(-8)}</p>
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
									<button class="text-purple-600 hover:text-purple-700" title="View Details">
										<Eye class="w-4 h-4" />
									</button>
									{#if transaction.receiptUrl && transaction.receiptUrl !== '#'}
										<button class="text-gray-600 hover:text-gray-700" title="Download Receipt">
											<Download class="w-4 h-4" />
										</button>
									{/if}
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{:else}
			<div class="text-center py-12">
				<CreditCard class="w-16 h-16 text-gray-400 mx-auto mb-4" />
				<h3 class="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
				<p class="text-gray-600">Your payment history will appear here once you make your first payment.</p>
			</div>
		{/if}
	</div>
</div>