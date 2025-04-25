import { NextRequest, NextResponse } from 'next/server';

// Access token API endpoint
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { merchantId, securedKey, basketId, transAmount, currencyCode } = body;

    // Validate the required fields
    if (!merchantId || !securedKey || !basketId || !transAmount || !currencyCode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const tokenApiUrl = 'https://ipg1.apps.net.pk/Ecommerce/api/Transaction/GetAccessToken';
    const urlPostParams = `MERCHANT_ID=${merchantId}&SECURED_KEY=${securedKey}&BASKET_ID=${basketId}&TXNAMT=${transAmount}&CURRENCY_CODE=${currencyCode}`;
    
    const response = await fetch(tokenApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'CURL/PHP PayFast Example'
      },
      body: urlPostParams
    });

    if (!response.ok) {
      throw new Error('Failed to get access token from payment gateway');
    }

    const data = await response.json();

    console.log(data.GENERATED_DATE_TIME);
    
    return NextResponse.json({
      accessToken: data.ACCESS_TOKEN || '',
      status: 'success'
    });
  } catch (error) {
    console.error('Error in access token API route:', error);
    return NextResponse.json({ 
      error: 'Failed to get access token',
      status: 'error' 
    }, { status: 500 });
  }
} 