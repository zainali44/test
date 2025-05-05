import { NextRequest, NextResponse } from 'next/server';
import { validateTokenWithServer } from "@/app/utils/authUtils";

// Define available plans based on the provided plan data
const AVAILABLE_PLANS = [
  {
    "plan_id": 1,
    "name": "Free",
    "description": "Free",
    "price": "0.00",
    "billing_cycle": "monthly",
  },
  {
    "plan_id": 2,
    "name": "Individual",
    "description": "Individual",
    "price": "500.00",
    "billing_cycle": "monthly",
  },
  {
    "plan_id": 3,
    "name": "Basic",
    "description": "Basic",
    "price": "800.00",
    "billing_cycle": "monthly",
  },
  {
    "plan_id": 4,
    "name": "Premium",
    "description": "Premium",
    "price": "2000.00",
    "billing_cycle": "monthly",
  },
  {
    "plan_id": 5,
    "name": "Individual",
    "description": "Individual",
    "price": "4800.00",
    "billing_cycle": "yearly",
  },
  {
    "plan_id": 6,
    "name": "Basic",
    "description": "Basic",
    "price": "7200.00",
    "billing_cycle": "yearly",
  },
  {
    "plan_id": 7,
    "name": "Premium",
    "description": "Premium",
    "price": "21600.00",
    "billing_cycle": "yearly",
  }
];

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
    
    // Get query parameters
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const planId = url.searchParams.get('planId') ? parseInt(url.searchParams.get('planId')!) : null;
    const forceDebug = url.searchParams.get('debug') === 'true';
    
    // Validate token if present
    let userData = null;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      
      if (token) {
        try {
          const validationResult = await validateTokenWithServer(token);
          userData = validationResult?.user;
        } catch (error) {
          console.error("Token validation error:", error);
        }
      }
    }
    
    // Get external API data if available
    let externalData = null;
    if (userId) {
      try {
        const apiBaseUrl = process.env.NEXT_API || 'http://localhost:8000';
        const apiUrl = `${apiBaseUrl}/users/active-plan/${userId}`;
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            ...(authHeader ? { 'Authorization': authHeader } : {}),
            'Content-Type': 'application/json'
          },
          cache: 'no-store'
        });
        
        if (response.ok) {
          externalData = await response.json();
        }
      } catch (error) {
        console.error("External API call failed:", error);
      }
    }
    
    // Create a response with all available debug info
    const debugData = {
      // User info from token
      user: userData,
      
      // External API data
      externalApiData: externalData,
      
      // Available plans
      availablePlans: AVAILABLE_PLANS,
      
      // Current plan requested if any
      requestedPlan: planId ? AVAILABLE_PLANS.find(plan => plan.plan_id === planId) : null,
      
      // Parameters from the request
      requestParams: {
        userId,
        planId,
        forceDebug
      },
      
      // Environment information
      environment: {
        nextApi: process.env.NEXT_API || 'http://localhost:8000',
        nodeEnv: process.env.NODE_ENV
      }
    };
    
    return NextResponse.json({
      success: true,
      message: "Subscription debug information",
      data: debugData
    });
  } catch (error: any) {
    console.error('Error in subscription debug API route:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal server error",
        error: error.stack
      },
      { status: 500 }
    );
  }
} 