"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/app/contexts/auth-context";
import { validateAuthToken } from "@/app/utils/token-validator";

/**
 * Custom hook that periodically validates the authentication token
 * and logs out the user if the token is invalid or expired
 * 
 * @param interval - The interval in milliseconds to check the token (default: 5 minutes)
 * @returns An object with the validation state
 */
export function useTokenValidator(interval = 5 * 60 * 1000) {
  const { logout, user } = useAuth();
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const initialCheckDone = useRef(false);
  const isLoggingOut = useRef(false);

  // Function to check token validity
  const checkToken = async () => {
    // Don't check if already checking or if user is not logged in
    if (isChecking || !user || isLoggingOut.current) return;
    
    try {
      setIsChecking(true);
      
      // If token was checked recently (in the last 10 seconds), skip check
      if (lastChecked && Date.now() - lastChecked.getTime() < 10000) {
        console.log("Token was checked recently, skipping validation");
        setIsChecking(false);
        return;
      }
      
      console.log("Validating token from hook...");
      const { isValid, message } = await validateAuthToken();
      
      setIsValid(isValid);
      setLastChecked(new Date());
      initialCheckDone.current = true;
      
      if (!isValid) {
        console.log(`Token validation failed: ${message}. Logging out...`);
        // Prevent multiple logout attempts
        isLoggingOut.current = true;
        
        // Clear the interval to prevent multiple logout attempts
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        
        // Logout with a slight delay to allow UI to update
        await new Promise(resolve => setTimeout(resolve, 100));
        await logout();
      }
    } catch (error) {
      console.error("Error checking token:", error);
      setIsValid(false);
      initialCheckDone.current = true;
    } finally {
      setIsChecking(false);
    }
  };

  // Check token on component mount and periodically
  useEffect(() => {
    // Don't set up validation if user is not logged in
    if (!user) return;
    
    // Only set up the timer if one doesn't already exist
    if (!timerRef.current) {
      // Initial check if not done yet
      if (!initialCheckDone.current) {
        checkToken();
      }
      
      // Set up interval for periodic checks
      timerRef.current = setInterval(checkToken, interval);
      
      // Cleanup interval on unmount
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
    }
  }, [interval, user]);

  // Function to force a token check
  const forceCheck = async () => {
    // Reset the last checked time to force a new check
    setLastChecked(null);
    return checkToken();
  };

  return {
    isValid,
    isChecking,
    lastChecked,
    checkNow: forceCheck
  };
} 