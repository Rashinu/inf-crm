"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/api-client";
import { useRouter } from "next/navigation";

interface CheckoutButtonProps {
  plan: "starter" | "pro" | "premium";
  className?: string;
  children: React.ReactNode;
}

export function CheckoutButton({ plan, className, children }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      
      if (!token) {
        // Not logged in, redirect to register with plan selection
        router.push(`/register?plan=${plan}`);
        return;
      }

      const { data } = await apiClient.post("/billing/checkout", {
        plan,
        billingCycle: "monthly",
      });

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      // Fallback to register if something fails or unauthorized
      router.push(`/register?plan=${plan}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      className={className} 
      onClick={handleCheckout}
      disabled={isLoading}
    >
      {isLoading ? "Yükleniyor..." : children}
    </Button>
  );
}
