import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body with error handling
    let paymentData;
    try {
      paymentData = await request.json();
    } catch (error) {
      console.error('Error parsing request body:', error);
      return NextResponse.json(
        { success: false, message: 'Invalid request body format' },
        { status: 400 }
      );
    }
    
    // Validate required fields
    if (!paymentData.plan || !paymentData.duration || !paymentData.transaction_id || 
        !paymentData.email_address) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
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

    // Forward the payment data to the external API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    try {
      const response = await fetch(`${apiUrl}/subscriptions/payment/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
        signal: controller.signal
      });

      // Clear the timeout
      clearTimeout(timeoutId);

      // Parse the response data with error handling
      let responseData;
      try {
        responseData = await response.json();
      } catch (error) {
        console.error('Error parsing API response:', error);
        return NextResponse.json(
          { success: false, message: 'Invalid response from subscription API' },
          { status: 502 }
        );
      }

      if (!response.ok) {
        console.error('Payment API error:', responseData);
        return NextResponse.json(
          { 
            success: false, 
            message: responseData?.message || 'Failed to process payment', 
            status: response.status 
          },
          { status: response.status }
        );
      }

      return NextResponse.json(responseData);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      // Handle fetch abort/timeout
      if (fetchError.name === 'AbortError') {
        console.error('Payment API request timed out');
        return NextResponse.json(
          { success: false, message: 'Payment processing timed out' },
          { status: 504 }
        );
      }
      
      console.error('Payment API fetch error:', fetchError);
      return NextResponse.json(
        { success: false, message: 'Failed to connect to payment server' },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process payment' },
      { status: 500 }
    );
  }
} 