import { NextRequest, NextResponse } from "next/server";
import { validateTokenWithServer } from "@/app/utils/authUtils";

// GET handler to fetch user profile data
export async function GET(req: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = req.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No valid token provided" },
        { status: 401 }
      );
    }
    
    // Extract the token
    const token = authHeader.split(" ")[1];
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No token found" },
        { status: 401 }
      );
    }
    
    // Validate the token with the server
    const validationResult = await validateTokenWithServer(token);
    
    if (!validationResult || !validationResult.valid) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }
    
    // If valid, return the user data
    return NextResponse.json({
      success: true,
      message: "User profile retrieved successfully",
      data: validationResult.user
    });
    
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    
    return NextResponse.json(
      { 
        success: false,
        message: error.message || "An error occurred while fetching the user profile" 
      },
      { status: 500 }
    );
  }
}

// PATCH handler to update user profile data
export async function PATCH(req: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = req.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No valid token provided" },
        { status: 401 }
      );
    }
    
    // Extract the token
    const token = authHeader.split(" ")[1];
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No token found" },
        { status: 401 }
      );
    }
    
    // Validate the token with the server
    const validationResult = await validateTokenWithServer(token);
    
    if (!validationResult || !validationResult.valid) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const body = await req.json();
    
    // Make API call to update the user profile
    const updateResponse = await fetch(`${process.env.API_BASE_URL}/api/users/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    
    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      throw new Error(errorData.message || "Failed to update profile");
    }
    
    const updatedData = await updateResponse.json();
    
    // Return the updated user data
    return NextResponse.json({
      success: true,
      message: "User profile updated successfully",
      data: updatedData.user || updatedData.data
    });
    
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    
    return NextResponse.json(
      { 
        success: false,
        message: error.message || "An error occurred while updating the user profile" 
      },
      { status: 500 }
    );
  }
} 