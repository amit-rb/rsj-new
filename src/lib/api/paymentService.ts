/**
 * Payment service for handling payment operations
 */
import { apiService, type ApiResponse } from './apiService';
import { config } from '$lib/config/env';

// Define interfaces
export interface PaymentGatewayDetails {
  gateway_name: string;
  gateway_order_id: string;
  gateway_payment_id: string;
  gateway_order_reference_id: string;
  gateway_status_code: string;
  gateway_settlement: string;
  _id: string;
}

export interface PaymentMethod {
  netbanking?: {
    channel: string;
    netbanking_bank_code: number;
    netbanking_bank_name: string;
    netbanking_ifsc: string;
    netbanking_account_number: string;
  };
  card?: {
    card_bank_name: string;
    card_country: string;
    card_network: string;
    card_network_reference_id: string | null;
    card_number: string;
    card_sub_type: string;
    card_type: string;
    channel: string;
  };
  _id: string;
}

export interface Payment {
  _id: string;
  order_id: string;
  application_id: string;
  __v: number;
  auth_id: string | null;
  authorization: string | null;
  bank_reference: string;
  cf_payment_id: string;
  createdAt: string;
  entity: string;
  error_details: string | null;
  is_captured: boolean;
  order_amount: number;
  payment_amount: number;
  payment_completion_time: string;
  payment_currency: string;
  payment_gateway_details: PaymentGatewayDetails;
  payment_group: string;
  payment_message: string;
  payment_method: PaymentMethod;
  payment_offers: string | null;
  payment_status: string;
  payment_time: string;
  updatedAt: string;
}

export interface PaymentHistory {
  admissionPayments: Payment[];
  courseFees: Payment[];
}

/**
 * Payment service
 */
export const paymentService = {
  /**
   * Get payment history for a user
   */
  async getPaymentHistory(userId: string): Promise<ApiResponse<PaymentHistory>> {
    return apiService.get<PaymentHistory>(config.endpoints.payment.getHistory(userId));
  }
};