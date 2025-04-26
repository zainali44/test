import { NextResponse } from 'next/server';

// Access token API endpoint
export async function POST(request: Request) {
  try {
    // Get request body
    const body = await request.json();
    
    // Create form data params exactly like the PHP implementation
    const urlPostParams = `MERCHANT_ID=${body.MERCHANT_ID}&SECURED_KEY=${body.SECURED_KEY}&BASKET_ID=${body.BASKET_ID}&TXNAMT=${body.TXNAMT}&CURRENCY_CODE=${body.CURRENCY_CODE}`;
    
    console.log('Sending token request with params:', urlPostParams);

    // Forward request to PayFast API with exact same format as PHP
    const response = await fetch('https://ipg1.apps.net.pk/Ecommerce/api/Transaction/GetAccessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'CURL/PHP PayFast Example'
      },
      body: urlPostParams
    });

    // Get response text first for debugging
    const responseText = await response.text();
    console.log('PayFast API response:', responseText);
    
    // Parse response as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
      return NextResponse.json({
        error: 'Invalid response from PayFast API',
        rawResponse: responseText
      }, { status: 500 });
    }

    console.log('Parsed token response:', data);
    
    // Return access token
    return NextResponse.json({ 
      accessToken: data.ACCESS_TOKEN,
      fullResponse: data
    });
  } catch (error: any) {
    console.error('Error in access token API route:', error);
    return NextResponse.json(
      { error: 'Failed to get access token', details: error.message },
      { status: 500 }
    );
  }
} 