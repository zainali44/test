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

    // Fetch subscription data from the external API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    // Add cache-busting query parameter
    const timestamp = Date.now();
    const url = new URL(`${apiUrl}/subscriptions/user/${userId}`);
    url.searchParams.append('_t', timestamp.toString());

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        signal: controller.signal,
        cache: 'no-store'
      });

      // Clear the timeout
      clearTimeout(timeoutId);

      // Parse response with error handling
      let errorData;
      let subscriptionData;

      if (!response.ok) {
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: 'Unknown error from subscription service' };
        }

        return NextResponse.json(
          { 
            success: false, 
            message: errorData?.message || 'Failed to fetch subscription', 
            status: response.status 
          },
          { status: response.status }
        );
      }

      try {
        subscriptionData = await response.json();
      } catch (error) {
        console.error('Error parsing subscription data:', error);
        return NextResponse.json(
          { success: false, message: 'Invalid response from subscription API' },
          { status: 502 }
        );
      }

      // Set no-cache headers on the response
      const responseWithHeaders = NextResponse.json(subscriptionData);
      responseWithHeaders.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      responseWithHeaders.headers.set('Pragma', 'no-cache');
      responseWithHeaders.headers.set('Expires', '0');
      
      return responseWithHeaders;
    } catch (fetchError: any) {
      // Clear the timeout
      clearTimeout(timeoutId);
      
      // Handle fetch abort/timeout
      if (fetchError.name === 'AbortError') {
        console.error('Subscription API request timed out');
        return NextResponse.json(
          { success: false, message: 'Subscription data retrieval timed out' },
          { status: 504 }
        );
      }
      
      console.error('Subscription API fetch error:', fetchError);
      return NextResponse.json(
        { success: false, message: 'Failed to connect to subscription server' },
        { status: 502 }
      );
    }
  } catch (error: any) {
    console.error('Subscription API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
} 