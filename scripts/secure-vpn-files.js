#!/usr/bin/env node

/**
 * This script secures VPN configuration files by moving them from the public directory
 * to a secure location outside the web root. It also creates the necessary directory
 * structure if it doesn't exist.
 */

const fs = require('fs');
const path = require('path');

// Define paths
const ROOT_DIR = process.cwd();
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const SECURE_VPN_DIR = path.join(ROOT_DIR, 'secure-files', 'vpn-configs');
const SECURE_APPS_DIR = path.join(ROOT_DIR, 'secure-files', 'apps');

// VPN config files to secure
const VPN_CONFIG_FILES = [
  'alice2-team-1.ovpn',
  // Add other VPN config files here
];

// Client application files to secure
const CLIENT_APP_FILES = [
  'securevpn-windows-latest.exe',
  'securevpn-android-latest.apk',
  // Add other client application files here
];

// Create secure directories if they don't exist
function ensureSecureDirectoriesExist() {
  console.log('Ensuring secure directories exist...');
  
  if (!fs.existsSync(path.join(ROOT_DIR, 'secure-files'))) {
    fs.mkdirSync(path.join(ROOT_DIR, 'secure-files'));
    console.log('Created secure-files directory');
  }
  
  if (!fs.existsSync(SECURE_VPN_DIR)) {
    fs.mkdirSync(SECURE_VPN_DIR);
    console.log('Created vpn-configs directory');
  }
  
  if (!fs.existsSync(SECURE_APPS_DIR)) {
    fs.mkdirSync(SECURE_APPS_DIR);
    console.log('Created apps directory');
  }
}

// Move VPN config files from public to secure directory
function moveVpnFiles() {
  console.log('Moving VPN config files to secure location...');
  
  VPN_CONFIG_FILES.forEach(file => {
    const sourceFile = path.join(PUBLIC_DIR, file);
    const targetFile = path.join(SECURE_VPN_DIR, file);
    
    if (fs.existsSync(sourceFile)) {
      try {
        // Copy to secure location
        fs.copyFileSync(sourceFile, targetFile);
        console.log(`✓ Copied ${file} to secure location`);
        
        // Create placeholder file with warning
        const warningContent = `This file has been moved to a secure location.
Access to VPN configuration files requires authentication and a paid subscription.
Please use the dashboard to download VPN configurations.`;
        
        // Optionally, remove or replace the original file
        // Uncomment one of these options:
        
        // Option 1: Remove the original file (most secure)
        // fs.unlinkSync(sourceFile);
        // console.log(`✓ Removed original ${file} from public directory`);
        
        // Option 2: Replace with warning file (more user-friendly)
        fs.writeFileSync(sourceFile, warningContent);
        console.log(`✓ Replaced ${file} with warning file`);
        
      } catch (error) {
        console.error(`✗ Error processing ${file}:`, error.message);
      }
    } else {
      console.log(`⚠ File ${file} not found in public directory, skipping`);
    }
  });
}

// Move client application files from public to secure directory
function moveClientAppFiles() {
  console.log('\nMoving client application files to secure location...');
  
  CLIENT_APP_FILES.forEach(file => {
    const sourceFile = path.join(PUBLIC_DIR, file);
    const targetFile = path.join(SECURE_APPS_DIR, file);
    
    if (fs.existsSync(sourceFile)) {
      try {
        // Copy to secure location
        fs.copyFileSync(sourceFile, targetFile);
        console.log(`✓ Copied ${file} to secure location`);
        
        // Create placeholder file with warning
        const warningContent = `This file has been moved to a secure location.
Access to VPN client applications requires authentication and a paid subscription.
Please use the dashboard to download VPN applications.`;
        
        // For this example, we'll just replace the original with a warning
        // but keep the original in public for compatibility during migration
        fs.writeFileSync(sourceFile, warningContent);
        console.log(`✓ Replaced ${file} with warning file`);
        
      } catch (error) {
        console.error(`✗ Error processing ${file}:`, error.message);
      }
    } else {
      console.log(`⚠ File ${file} not found in public directory, skipping`);
    }
  });
}

// Verify migration
function verifyMigration() {
  console.log('\nVerifying migration...');
  
  let allSecure = true;
  
  // Verify VPN config files
  console.log('\nVerifying VPN configuration files:');
  VPN_CONFIG_FILES.forEach(file => {
    const secureFile = path.join(SECURE_VPN_DIR, file);
    
    if (fs.existsSync(secureFile)) {
      console.log(`✓ Verified ${file} exists in secure location`);
    } else {
      console.error(`✗ ${file} not found in secure location!`);
      allSecure = false;
    }
  });
  
  // Verify client application files
  console.log('\nVerifying client application files:');
  CLIENT_APP_FILES.forEach(file => {
    const secureFile = path.join(SECURE_APPS_DIR, file);
    
    if (fs.existsSync(secureFile)) {
      console.log(`✓ Verified ${file} exists in secure location`);
    } else {
      console.error(`✗ ${file} not found in secure location!`);
      allSecure = false;
    }
  });
  
  return allSecure;
}

// Run the migration
function run() {
  console.log('=== Starting VPN Security Migration ===\n');
  
  ensureSecureDirectoriesExist();
  moveVpnFiles();
  moveClientAppFiles();
  
  const migrationSuccessful = verifyMigration();
  
  console.log('\n=== Migration Complete ===');
  
  if (migrationSuccessful) {
    console.log('\n✅ All VPN files have been secured successfully!');
    console.log('\nReminder: Make sure the API endpoint is properly implemented and access controls are in place.');
  } else {
    console.log('\n⚠ Migration completed with errors. Please check the logs above.');
  }
}

// Execute
run(); 