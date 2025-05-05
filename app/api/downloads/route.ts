import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import { validateToken } from '../../utils/profileApi';
import { cookies } from 'next/headers';

// Define interface for the validation result to help TypeScript understand the structure
interface ValidationResult {
  valid: boolean;
  message?: any;
  error?: any;
  user: {
    id: any;
    email: any;
    name: any;
    isVerified: any;
    imageBase64: any;
    profilePicture: any;
    created_at: any;
    passwordChangedAt: any;
  } | null;
  data?: ValidationResultData;
}

interface ValidationResultData {
  valid: boolean;
  user?: any;
  error?: any;
}

export async function GET(request: NextRequest) {
  // 1. Get file path parameter
  const fileParam = request.nextUrl.searchParams.get('file');
  
  if (!fileParam) {
    return new NextResponse(JSON.stringify({ 
      error: 'Missing file parameter',
      message: 'A file parameter is required for download' 
    }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // 2. Authenticate user from token in cookie, Authorization header, or query parameter
  const cookieStore = cookies();
  let token = cookieStore.get('token')?.value;
  let tokenSource = 'cookie';
  
  // Check Authorization header if no token in cookies
  if (!token) {
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
      console.log('Using token from Authorization header');
      tokenSource = 'header';
    }
  }
  
  // Check URL query parameter as a last resort
  if (!token) {
    const urlToken = request.nextUrl.searchParams.get('token');
    if (urlToken) {
      token = urlToken;
      console.log('Using token from URL query parameter');
      tokenSource = 'url';
    }
  }
  
  if (!token) {
    console.error('No authentication token found in cookies, headers, or URL');
    return new NextResponse(JSON.stringify({ 
      error: 'Authentication required',
      message: 'Please log in to download files'
    }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  console.log(`Authentication token found in ${tokenSource}, validating...`);
  
  // 3. Validate token and get user data
  try {
    const validationResult = await validateToken(token) as ValidationResult;
    
    // Extract the user data and validation status from the possibly nested response structure
    // From the API response format, we need to handle both direct and nested formats
    const validationData = validationResult.data ? 
      validationResult.data as ValidationResultData : 
      validationResult;
    
    const isValid = validationData.valid;
    const userData = validationData.user;
    
    console.log('Token validation result structure:', JSON.stringify({
      resultHasData: !!validationResult.data,
      validationData: validationData ? Object.keys(validationData) : null,
      isValid,
      userDataExists: !!userData
    }));
    
    if (!isValid) {
      console.error('Token validation failed:', 
        validationResult.error || 
        validationData.error || 
        'Unknown error'
      );
      return new NextResponse(JSON.stringify({ 
        error: 'Invalid or expired token',
        message: 'Your session has expired. Please log in again.'
      }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (!userData) {
      console.error('No user data found in validation result');
      return new NextResponse(JSON.stringify({ 
        error: 'User data missing',
        message: 'Unable to verify user information. Please log in again.'
      }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log('Token validated successfully for user:', userData.id);
    
    // 4. Check if user has appropriate subscription
    const planId = userData.subscription_plan_id;
    const planName = userData.subscription_plan;
    
    // For testing/emergency, if there's no plan info but user is authenticated, allow access
    // This should be removed in production or adjusted based on your business rules
    if (!planId && !planName) {
      console.log('No plan info found, but user is authenticated - allowing access for user:', userData.id);
      
      // Assume user has a paid subscription when plan info is missing
      // (This is a fallback for testing only - in production you'd want to be more strict)
    }
    else {
      // Free plan has ID=1 or name="free"
      const isFree = 
        planId === 1 || 
        (planName && planName.toLowerCase() === 'free');
      
      if (isFree) {
        return new NextResponse(JSON.stringify({ 
          error: 'Subscription required',
          message: 'Please upgrade your subscription to access VPN configuration files'
        }), { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    // 5. Map requested filename to actual file path (prevent path traversal attacks)
    const secureVpnDir = path.resolve(process.cwd(), 'secure-files', 'vpn-configs');
    const secureAppsDir = path.resolve(process.cwd(), 'secure-files', 'apps');
    const publicDirectory = path.resolve(process.cwd(), 'public');
    
    // Ensure directories exist
    try {
      if (!fs.existsSync(path.resolve(process.cwd(), 'secure-files'))) {
        fs.mkdirSync(path.resolve(process.cwd(), 'secure-files'), { recursive: true });
        console.log('Created secure-files directory');
      }
      
      if (!fs.existsSync(secureVpnDir)) {
        fs.mkdirSync(secureVpnDir, { recursive: true });
        console.log('Created vpn-configs directory');
      }
      
      if (!fs.existsSync(secureAppsDir)) {
        fs.mkdirSync(secureAppsDir, { recursive: true });
        console.log('Created apps directory');
      }
    } catch (dirError) {
      console.error('Error creating directories:', dirError);
      // Continue execution even if directory creation fails
    }
    
    // Create a mapping of allowed files to their paths
    const fileMapping: Record<string, string> = {
      // VPN config files (from secure directory)
      'alice2-team-1.ovpn': path.join(secureVpnDir, 'alice2-team-1.ovpn'),
      
      // Client applications (preferring secure directory first, then public as fallback)
      'securevpn-windows-latest.exe': path.join(secureAppsDir, 'securevpn-windows-latest.exe'),
      'securevpn-android-latest.apk': path.join(secureAppsDir, 'securevpn-android-latest.apk'),
      
      // Add other files as needed
    };
    
    let filePath = fileMapping[fileParam || ''];
    
    // 6. Check if the requested file exists in the secure directory
    if (!filePath || !fs.existsSync(filePath)) {
      console.log(`File not found in secure directory: ${filePath}, checking public directory`);
      
      // Check if this is a client application that might be in the public directory
      if (fileParam && (fileParam.endsWith('.exe') || fileParam.endsWith('.apk'))) {
        const publicFilePath = path.join(publicDirectory, fileParam);
        
        if (fs.existsSync(publicFilePath)) {
          console.log(`Serving ${fileParam} from public directory (fallback)`);
          filePath = publicFilePath;
        } else {
          // Try finding any .exe or .apk file in the public directory as a last resort
          const fileExtension = path.extname(fileParam);
          const files = fs.readdirSync(publicDirectory);
          const matchingFile = files.find(file => file.endsWith(fileExtension));
          
          if (matchingFile) {
            const fallbackPath = path.join(publicDirectory, matchingFile);
            console.log(`Using fallback file from public directory: ${matchingFile}`);
            filePath = fallbackPath;
          } else {
            // Generate a sample file for testing if nothing else works (development only)
            if (process.env.NODE_ENV !== 'production') {
              if (fileParam === 'securevpn-windows-latest.exe') {
                // Create a dummy file for testing
                const dummyPath = path.join(secureAppsDir, 'securevpn-windows-latest.exe');
                const dummyContent = Buffer.from('This is a sample VPN application file for testing');
                fs.writeFileSync(dummyPath, dummyContent);
                console.log(`Created dummy file for testing: ${dummyPath}`);
                filePath = dummyPath;
              }
            }
          }
        }
      }
    }
    
    // If we still don't have a valid file path
    if (!filePath || !fs.existsSync(filePath)) {
      console.error(`File not found: ${fileParam}`);
      return new NextResponse(JSON.stringify({ 
        error: 'File not found',
        message: 'The requested file does not exist. Please contact support.'
      }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 7. Read and return the file
    try {
      const fileBuffer = fs.readFileSync(filePath);
      const fileName = path.basename(filePath);
      
      // Log the download for analytics
      console.log(`User ${userData.id} downloaded ${fileName}`);
      
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'Content-Type': 'application/octet-stream',
        }
      });
    } catch (fileError) {
      console.error(`Error reading file ${filePath}:`, fileError);
      return new NextResponse(JSON.stringify({ 
        error: 'Error reading file',
        message: 'An error occurred while attempting to read the file'
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
  } catch (error) {
    console.error('Error in download API:', error);
    return new NextResponse(JSON.stringify({ 
      error: 'Server error',
      message: 'Failed to process download request'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 