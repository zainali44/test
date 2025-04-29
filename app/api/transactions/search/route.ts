import { NextRequest, NextResponse } from 'next/server';

// Define transaction interfaces
interface PaymentMethod {
  payment_method_id: number;
  type: string;
  details: string;
}

interface BankDetail {
  id: number;
  transaction_id: number;
  payment_reference: string;
  email_address: string;
  mobile_no: string;
  order_date: string;
  [key: string]: any;
}

interface Transaction {
  transaction_id: number;
  status: string;
  processed_at: string;
  currency: string;
  payment_method: PaymentMethod;
  amount: string | number;
  bank_detail: BankDetail;
}

// Add export configuration for Next.js - force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get search parameters from the URL
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || '';
    const status = searchParams.get('status');
    const paymentMethod = searchParams.get('paymentMethod');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    // Validate that at least userId is provided
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required for transaction search' },
        { status: 400 }
      );
    }

    // Build the API URL
    const baseUrl = `${process.env.NEXTAPI_URL}users/transactions/${userId}`;
    console.log("API URL", baseUrl)
    
    // Make the request to the external API
    const response = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    // If the response isn't OK, throw an error
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch transaction data: ${response.status}` },
        { status: response.status }
      );
    }

    try {
      // Parse the response as JSON
      const data = await response.json();
      
      // Filter transactions if necessary
      if (data && Array.isArray(data.transactions)) {
        let filteredTransactions = data.transactions as Transaction[];
        
        // Filter by status if provided
        if (status) {
          filteredTransactions = filteredTransactions.filter((tx: Transaction) => 
            tx.status.toLowerCase() === status.toLowerCase()
          );
        }
        
        // Filter by payment method if provided
        if (paymentMethod) {
          filteredTransactions = filteredTransactions.filter((tx: Transaction) => 
            tx.payment_method.type.toLowerCase() === paymentMethod.toLowerCase() ||
            tx.payment_method.details.toLowerCase().includes(paymentMethod.toLowerCase())
          );
        }
        
        // Filter by date range if provided
        if (dateFrom) {
          const fromDate = new Date(dateFrom);
          filteredTransactions = filteredTransactions.filter((tx: Transaction) => 
            new Date(tx.processed_at) >= fromDate
          );
        }
        
        if (dateTo) {
          const toDate = new Date(dateTo);
          filteredTransactions = filteredTransactions.filter((tx: Transaction) => 
            new Date(tx.processed_at) <= toDate
          );
        }
        
        // Return the filtered data
        return NextResponse.json({
          user_id: data.user_id,
          count: filteredTransactions.length,
          transactions: filteredTransactions
        });
      }
      
      // If no transactions found or unexpected format, return the original data
      return NextResponse.json(data);
    } catch (parseError) {
      console.error("JSON parse error from external API:", parseError);
      
      // If we can't parse the response as JSON, return an error
      return NextResponse.json(
        { error: "The external API returned data that couldn't be parsed as JSON" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in transaction search API:", error);
    
    return NextResponse.json(
      { error: "Failed to search transactions" },
      { status: 500 }
    );
  }
} 