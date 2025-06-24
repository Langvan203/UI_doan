"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

interface PaymentInfo {
  paymentLinkId: string;
  orderCode: string;
  amount: number;
  description: string;
  qrCode: string;
  checkoutUrl: string;
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'EXPIRED';
  maHD: number;
}

interface PaymentContextType {
  createPaymentLink: (maHD: number, amount: number, description: string) => Promise<PaymentInfo | null>;
  checkPaymentStatus: (orderCode: string) => Promise<string>;
  getPaymentHistory: (maHD: number) => Promise<PaymentInfo[]>;
  cancelPayment: (orderCode: string) => Promise<boolean>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const PAYOS_CLIENT_ID = process.env.NEXT_PUBLIC_PAYOS_CLIENT_ID!;
  const PAYOS_API_KEY = process.env.NEXT_PUBLIC_PAYOS_API_KEY!;
  const PAYOS_CHECKSUM_KEY = process.env.NEXT_PUBLIC_PAYOS_CHECKSUM_KEY!;

  const createPaymentLink = async (maHD: number, amount: number, description: string): Promise<PaymentInfo | null> => {
    try {
      const orderCode = Date.now(); // Tạo mã đơn hàng unique
      
      const paymentData = {
        orderCode: orderCode,
        amount: amount,
        description: description,
        returnUrl: `${window.location.origin}/payment/return`,
        cancelUrl: `${window.location.origin}/payment/cancel`,
        signature: "", // Sẽ được tính toán ở backend
        maHD: maHD
      };

      const response = await fetch(`${API_BASE_URL}/Payment/CreatePaymentLink`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment link');
      }

      const result = await response.json();
      
      toast.success("Tạo liên kết thanh toán thành công", {
        position: "top-right",
        autoClose: 2000,
      });

      return {
        paymentLinkId: result.paymentLinkId,
        orderCode: orderCode.toString(),
        amount: amount,
        description: description,
        qrCode: result.qrCode,
        checkoutUrl: result.checkoutUrl,
        status: 'PENDING',
        maHD: maHD
      };
    } catch (error) {
      console.error("Error creating payment link:", error);
      toast.error("Lỗi khi tạo liên kết thanh toán", {
        position: "top-right",
        autoClose: 2000,
      });
      return null;
    }
  };

  const checkPaymentStatus = async (orderCode: string): Promise<string> => {
    try {
      const response = await fetch(`${API_BASE_URL}/Payment/CheckPaymentStatus/${orderCode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to check payment status');
      }

      const result = await response.json();
      return result.status;
    } catch (error) {
      console.error("Error checking payment status:", error);
      return 'UNKNOWN';
    }
  };

  const getPaymentHistory = async (maHD: number): Promise<PaymentInfo[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/Payment/GetPaymentHistory/${maHD}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get payment history');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error getting payment history:", error);
      return [];
    }
  };

  const cancelPayment = async (orderCode: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/Payment/CancelPayment/${orderCode}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel payment');
      }

      toast.success("Hủy thanh toán thành công", {
        position: "top-right",
        autoClose: 2000,
      });

      return true;
    } catch (error) {
      console.error("Error canceling payment:", error);
      toast.error("Lỗi khi hủy thanh toán", {
        position: "top-right",
        autoClose: 2000,
      });
      return false;
    }
  };

  return (
    <PaymentContext.Provider value={{
      createPaymentLink,
      checkPaymentStatus,
      getPaymentHistory,
      cancelPayment
    }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
};