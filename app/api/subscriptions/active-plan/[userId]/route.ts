import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get API URL from environment variable
    const apiUrl = process.env.NEXT_API || '';
    
    if (!apiUrl) {
      console.error('API URL not configured in environment variables');
      return NextResponse.json(
        { success: false, message: 'API URL is not configured' },
        { status: 500 }
      );
    }

    // Construct the URL using the format from the server logs
    console.log("Fetching active plan for user:", userId);
    const fullUrl = `${apiUrl}/users/active-plan/${userId}`;
    console.log("Fetching active plan from:", fullUrl);

    // Fetch the active plan
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    try {
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        cache: 'no-store'
      });

      // Clear the timeout
      clearTimeout(timeoutId);

      // Parse the response
      let data;
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          // Handle non-JSON response
          const text = await response.text();
          console.error(`Non-JSON response from active plan API:`, text.substring(0, 200));
          return NextResponse.json(
            { 
              success: false, 
              message: 'Received non-JSON response from API',
              status: response.status
            },
            { status: 502 }
          );
        }
      } catch (error) {
        console.error('Error parsing API response:', error);
        return NextResponse.json(
          { success: false, message: 'Invalid response from API' },
          { status: 502 }
        );
      }

      if (!response.ok) {
        console.error('Active plan API error:', data);
        return NextResponse.json(
          { 
            success: false, 
            message: data?.message || `Failed to fetch active plan with status: ${response.status}`,
            status: response.status 
          },
          { status: response.status }
        );
      }

      // Wrap the successful response
      return NextResponse.json({
        success: true,
        data: data
      });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      // Handle fetch abort/timeout
      if (fetchError.name === 'AbortError') {
        console.error('Active plan API request timed out');
        return NextResponse.json(
          { success: false, message: 'Request timed out' },
          { status: 504 }
        );
      }
      
      console.error('Active plan API fetch error:', fetchError);
      return NextResponse.json(
        { success: false, message: 'Failed to connect to API server' },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error('Error fetching active plan:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch active plan' },
      { status: 500 }
    );
  }
} 