# Profile API Integration Guide

This guide explains how to integrate your frontend with the user profile API endpoints.

## API Endpoints

Your backend API controller provides these endpoints:

### 1. Update User Profile
- **Endpoint**: `PUT /users/profile`
- **Function**: `updateUserProfile` in controllers/user.controller.js
- **Authentication**: JWT token required
- **Request Body**:
  ```json
  {
    "name": "User Name",
    "email": "user@example.com"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Profile updated successfully.",
    "user": {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com"
    }
  }
  ```
- **Notes**: If email is changed, a new verification email is sent and `isVerifiedEmail` is set to false.

### 2. Update User Password
- **Endpoint**: `PUT /users/password`
- **Function**: `updateUserPassword` in controllers/user.controller.js
- **Authentication**: JWT token required
- **Request Body**:
  ```json
  {
    "currentPassword": "current-password",
    "newPassword": "new-password"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Password updated successfully"
  }
  ```

### 3. Request Password Reset
- **Endpoint**: `POST /users/reset-password-request`
- **Function**: `requestPasswordReset` in controllers/user.controller.js
- **Authentication**: None
- **Request Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Password reset email sent successfully"
  }
  ```

### 4. Reset Password with Token
- **Endpoint**: `POST /users/reset-password`
- **Function**: `resetPassword` in controllers/user.controller.js
- **Authentication**: None
- **Request Body**:
  ```json
  {
    "token": "reset-token",
    "newPassword": "new-password"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Password reset successfully"
  }
  ```

### 5. Update User Profile Image
- **Endpoint**: `PUT /users/profile-image`
- **Function**: `updateUserImage` in controllers/user.controller.js
- **Authentication**: JWT token required
- **Request Body**: Form data with key `profileImage` containing the image file
- **Response**:
  ```json
  {
    "message": "Profile image updated successfully",
    "profileImage": "filename.jpg"
  }
  ```

### 6. Request Email Verification
- **Endpoint**: `GET /users/verify-email`
- **Function**: Not shown in provided controller, assumed to send a verification email
- **Authentication**: JWT token required
- **Response**:
  ```json
  {
    "message": "Verification email sent successfully"
  }
  ```

## Frontend Integration

We've created utility functions in `app/utils/profileApi.ts` to make it easy to interact with these endpoints:

```typescript
// Update profile (name and email)
updateUserProfile(name, email)

// Update password
updateUserPassword(currentPassword, newPassword)

// Request password reset
requestPasswordReset(email)

// Upload profile image
uploadProfileImage(file)

// Request email verification
requestEmailVerification()

// Validate auth token
validateToken(token)
```

## Example Usage

Here's how to use these functions in a React component:

```jsx
import { 
  updateUserProfile, 
  updateUserPassword,
  uploadProfileImage 
} from '@/app/utils/profileApi';

function ProfileForm() {
  const handleUpdateProfile = async () => {
    try {
      // Update user profile
      const response = await updateUserProfile('John Doe', 'john@example.com');
      console.log('Profile updated:', response);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      // Update user password
      const response = await updateUserPassword('current-password', 'new-password');
      console.log('Password updated:', response);
    } catch (error) {
      console.error('Error updating password:', error);
    }
  };

  const handleImageUpload = async (e) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    try {
      // Upload profile image
      const response = await uploadProfileImage(e.target.files[0]);
      console.log('Image uploaded:', response);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div>
      {/* Form components */}
    </div>
  );
}
```

## Complete Example Component

We've provided a complete example component in `app/components/ProfileManager.tsx` that implements all these API functions with proper error handling and loading states.

## Authentication

All protected endpoints require a JWT token in the Authorization header:
- The token should be in the format: `Bearer YOUR_JWT_TOKEN`
- The utility functions automatically retrieve the token from localStorage

## Error Handling

The API functions will throw an error if:
- The request fails
- The server returns a non-200 status code
- The authentication token is invalid or expired

Handle these errors appropriately in your components:

```jsx
try {
  await updateUserProfile(name, email);
  // Success handling
} catch (error) {
  if (error.message === 'Your session has expired. Please login again.') {
    // Redirect to login page
    router.push('/login');
  } else {
    // Show error message
    setError(error.message);
  }
}
``` 