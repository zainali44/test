import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    let transactionData;
    try {
      transactionData = await request.json();
    } catch (error) {
      console.error('Error parsing request body:', error);
      return NextResponse.json(
        { success: false, message: 'Invalid request body format' },
        { status: 400 }
      );
    }
    
    // Validate required fields
    if (!transactionData.user_id || !transactionData.plan_id) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: user_id and plan_id are required' },
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

    // Forward the transaction data to the external API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    try {
      const response = await fetch(`${apiUrl}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
        signal: controller.signal
      });

      console.log("Transactions API Response:", response)
      console.log("Transactions API Response Data:", await response.json())
      console.log("Transactions API URL:", `${apiUrl}/transactions`)
      // Clear the timeout
      clearTimeout(timeoutId);

      // Parse the response data
      let responseData;
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
        } else {
          // If the response is not JSON, get the text and provide a meaningful error
          const responseText = await response.text();
          console.error('Received non-JSON response:', responseText.substring(0, 200) + '...');
          return NextResponse.json(
            { 
              success: false, 
              message: 'Received invalid response format from API server (non-JSON response)',
              debug: { 
                status: response.status,
                contentType,
                responsePreview: responseText.substring(0, 100) + '...' 
              }
            },
            { status: 502 }
          );
        }
      } catch (error) {
        console.error('Error parsing API response:', error);
        return NextResponse.json(
          { success: false, message: 'Invalid response from transactions API' },
          { status: 502 }
        );
      }

      if (!response.ok) {
        console.error('Transactions API error:', responseData);
        return NextResponse.json(
          { 
            success: false, 
            message: responseData?.message || 'Failed to create transaction', 
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
        console.error('Transactions API request timed out');
        return NextResponse.json(
          { success: false, message: 'Transaction processing timed out' },
          { status: 504 }
        );
      }
      
      console.error('Transactions API fetch error:', fetchError);
      return NextResponse.json(
        { success: false, message: 'Failed to connect to transactions server' },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error('Transaction processing error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process transaction' },
      { status: 500 }
    );
  }
} 