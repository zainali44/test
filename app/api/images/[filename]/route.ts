import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * API route to serve image files from a defined uploads directory
 * This is needed to work with Next.js Image component optimization
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;
    
    // Check for invalid filename characters to prevent directory traversal
    if (!filename || /[\/\\]/.test(filename)) {
      return new NextResponse('Invalid filename', { status: 400 });
    }
    
    // Define the uploads directory
    // Modify this based on your actual upload directory
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const publicDir = path.join(process.cwd(), 'public');
    
    // Check several possible locations for the file
    let filePath = path.join(uploadsDir, filename);
    let fileExists = fs.existsSync(filePath);
    
    // If not in uploads directory, try public root
    if (!fileExists) {
      filePath = path.join(publicDir, filename);
      fileExists = fs.existsSync(filePath);
    }
    
    // If not in public root, try public/images
    if (!fileExists) {
      const imagesDir = path.join(publicDir, 'images');
      filePath = path.join(imagesDir, filename);
      fileExists = fs.existsSync(filePath);
    }
    
    // If still not found, check for direct path
    if (!fileExists) {
      filePath = path.join(process.cwd(), filename);
      fileExists = fs.existsSync(filePath);
    }
    
    if (!fileExists) {
      console.error(`Image not found: ${filename}`);
      return new NextResponse('Image not found', { status: 404 });
    }
    
    // Read the file
    const fileBuffer = fs.readFileSync(filePath);
    
    // Determine content type based on file extension
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream'; // Default
    
    if (ext === '.jpg' || ext === '.jpeg') {
      contentType = 'image/jpeg';
    } else if (ext === '.png') {
      contentType = 'image/png';
    } else if (ext === '.gif') {
      contentType = 'image/gif';
    } else if (ext === '.webp') {
      contentType = 'image/webp';
    } else if (ext === '.svg') {
      contentType = 'image/svg+xml';
    }
    
    // Return the image with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 1 day
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return new NextResponse('Error serving image', { status: 500 });
  }
} 