import { NextRequest, NextResponse } from 'next/server'

// This is a server-side API route that proxies requests to the external API
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId
  
  try {
    // Make the request to the external API
    const response = await fetch(`${process.env.NEXTAPI_URL}users/transactions/${userId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })

    console.log("API URL", `${process.env.NEXTAPI_URL}/users/transactions/${userId}`)
    
    // If the response isn't OK, throw an error
    if (!response.ok) {
      console.error(`External API error: ${response.status} ${response.statusText}`)
      return NextResponse.json(
        { error: `Failed to fetch transaction data: ${response.status}` },
        { status: response.status }
      )
    }
    
    try {
      // Try to parse the response as JSON
      const data = await response.json()
      
      // Return the successful response
      return NextResponse.json(data)
    } catch (parseError) {
      console.error("JSON parse error from external API:", parseError)
      
      // If we can't parse the response as JSON, return an error
      return NextResponse.json(
        { error: "The external API returned data that couldn't be parsed as JSON" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error proxying to external API:", error)
    
    return NextResponse.json(
      { error: "Failed to connect to the transaction service" },
      { status: 500 }
    )
  }
} 