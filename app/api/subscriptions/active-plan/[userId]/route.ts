import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Get the user ID from the dynamic route
    const { userId } = params;
    
    if (!userId) {
      return NextResponse.json(
        { 
          success: false, 
          message: "User ID is required" 
        },
        { status: 400 }
      );
    }
    
    // Get the API base URL
    const apiBaseUrl = process.env.NEXT_API || 'http://localhost:8000';
    const apiUrl = `${apiBaseUrl}/users/active-plan/${userId}`;
    
    // Get the authorization header from the request
    const authHeader = request.headers.get('Authorization');
    
    console.log(`Fetching active plan for user ${userId}`);
    
    // Make the request to the external API
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        // Only include Authorization if it exists
        ...(authHeader ? { 'Authorization': authHeader } : {}),
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    
    // If the response is 404, return a clean "not found" response
    if (response.status === 404) {
      return NextResponse.json(
        { 
          success: false, 
          message: "No active plan found for this user" 
        },
        { status: 404 }
      );
    }
    
    // If the API call failed, return the error
    if (!response.ok) {
      // Try to parse the error message from the response
      let errorMessage = "Failed to fetch active plan";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If we can't parse the response as JSON, use the status text
        errorMessage = response.statusText || errorMessage;
      }
      
      console.error(`Error fetching active plan: ${errorMessage}`);
      
      return NextResponse.json(
        { 
          success: false, 
          message: errorMessage 
        },
        { status: response.status }
      );
    }
    
    // Try to parse the response as JSON
    const data = await response.json();
    
    // Return the subscription data
    return NextResponse.json({
      success: true,
      data: data
    });
  } catch (error: any) {
    console.error('Error in active-plan API route:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Internal server error" 
      },
      { status: 500 }
    );
  }
} 