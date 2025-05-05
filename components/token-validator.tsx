"use client";

import { useEffect, useRef } from "react";
import { useTokenValidator } from "@/hooks/use-token-validator";
import { useAuth } from "@/app/contexts/auth-context";

interface TokenValidatorProps {
  disabled?: boolean;
  validateOnMount?: boolean;
}

/**
 * Component that performs token validation on mount and at regular intervals
 * If the token is invalid or expired, it will automatically log the user out
 * 
 * This component doesn't render anything, so it can be safely included in any component
 * 
 * @param disabled - Set to true to disable this validator (useful when validation is handled elsewhere)
 * @param validateOnMount - Set to true to validate token on component mount
 */
export function TokenValidator({ 
  disabled = false,
  validateOnMount = false 
}: TokenValidatorProps) {
  const initialized = useRef(false);
  const { user } = useAuth();
  const { checkNow } = useTokenValidator();
  
  // Only run validation if the component is not disabled
  useEffect(() => {
    if (disabled || initialized.current || !user) return;
    
    if (validateOnMount) {
      console.log("TokenValidator component mounted, checking token");
      checkNow();
    }
    
    initialized.current = true;
  }, [checkNow, disabled, validateOnMount, user]);
  
  // This component doesn't render anything
  return null;
} 