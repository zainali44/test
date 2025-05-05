import { NextRequest, NextResponse } from "next/server"

// This is a server-side proxy to avoid CORS issues with the external API
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Get the path segments from the dynamic route
    const pathSegments = params.path || []
    
    // Join the path segments to form the API path
    const apiPath = pathSegments.join('/')
    
    // Get the api base URL from environment variables
    const apiBaseUrl = process.env.NEXT_API || 'http://localhost:8000'
    
    // Get the query string from the request URL
    const { searchParams } = new URL(request.url)
    const queryString = searchParams.toString()
    
    // Get the Authorization header from the request
    const authHeader = request.headers.get('Authorization')
    
    // Build the full URL to the external API
    const externalUrl = `${apiBaseUrl}/${apiPath}${queryString ? `?${queryString}` : ''}`
    
    console.log(`Proxying request to: ${externalUrl}`)
    
    // Make the request to the external API
    const response = await fetch(externalUrl, {
      method: 'GET',
      headers: {
        // Only include Authorization if it exists
        ...(authHeader ? { 'Authorization': authHeader } : {}),
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })
    
    // Check if the response is valid
    if (!response.ok) {
      // If response is 404, pass it through
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Resource not found' }, 
          { status: 404 }
        )
      }
      
      // Try to get error details from response
      let errorMessage = 'External API request failed'
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      } catch (e) {
        // If can't parse JSON, use status text
        errorMessage = response.statusText || errorMessage
      }
      
      console.error(`API proxy error: ${errorMessage}`)
      
      return NextResponse.json(
        { error: errorMessage }, 
        { status: response.status }
      )
    }
    
    // Get the response data
    const data = await response.json()
    
    // Return the response
    return NextResponse.json(data)
  } catch (error) {
    console.error('API proxy error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

// Also support POST requests
export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Get the path segments from the dynamic route
    const pathSegments = params.path || []
    
    // Join the path segments to form the API path
    const apiPath = pathSegments.join('/')
    
    // Get the api base URL from environment variables
    const apiBaseUrl = process.env.NEXT_API || 'http://localhost:8000'
    
    // Get the query string from the request URL
    const { searchParams } = new URL(request.url)
    const queryString = searchParams.toString()
    
    // Get the Authorization header from the request
    const authHeader = request.headers.get('Authorization')
    
    // Parse the request body
    const body = await request.json()
    
    // Build the full URL to the external API
    const externalUrl = `${apiBaseUrl}/${apiPath}${queryString ? `?${queryString}` : ''}`
    
    console.log(`Proxying POST request to: ${externalUrl}`)
    
    // Make the request to the external API
    const response = await fetch(externalUrl, {
      method: 'POST',
      headers: {
        // Only include Authorization if it exists
        ...(authHeader ? { 'Authorization': authHeader } : {}),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    
    // Check if the response is valid
    if (!response.ok) {
      // Try to get error details from response
      let errorMessage = 'External API request failed'
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      } catch (e) {
        // If can't parse JSON, use status text
        errorMessage = response.statusText || errorMessage
      }
      
      console.error(`API proxy error: ${errorMessage}`)
      
      return NextResponse.json(
        { error: errorMessage }, 
        { status: response.status }
      )
    }
    
    // Get the response data
    const data = await response.json()
    
    // Return the response
    return NextResponse.json(data)
  } catch (error) {
    console.error('API proxy error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
} 