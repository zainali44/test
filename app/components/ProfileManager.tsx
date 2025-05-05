import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  updateUserProfile, 
  updateUserPassword, 
  requestPasswordReset, 
  uploadProfileImage, 
  requestEmailVerification 
} from '@/app/utils/profileApi';
import { useAuth } from '@/app/contexts/auth-context';

export default function ProfileManager() {
  const router = useRouter();
  const { user, updateUserData } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Handle profile form input change
  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle password form input change
  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Update profile
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await updateUserProfile(profileForm.name, profileForm.email);
      
      // Update user data in context
      if (user && updateUserData) {
        updateUserData({
          ...user,
          name: profileForm.name,
          email: profileForm.email
        });
      }
      
      setSuccess(data.message);
    } catch (error: any) {
      setError(error.message);
      
      // If session expired
      if (error.message === 'Your session has expired. Please login again.') {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Update password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate password match
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setError('New passwords do not match');
        return;
      }
      
      setLoading(true);
      setError(null);
      
      const data = await updateUserPassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      
      setSuccess(data.message);
      
      // Reset password fields
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      setError(error.message);
      
      // If session expired
      if (error.message === 'Your session has expired. Please login again.') {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Request password reset
  const handleResetPassword = async () => {
    if (!user?.email) {
      setError('Email is required');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await requestPasswordReset(user.email);
      
      setSuccess(data.message);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Upload profile image
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await uploadProfileImage(file);
      
      // Update user data in context

      console.log("Updating user data in context");
      updateUserData?.({
        ...user,
        profilePicture: data.profileImage
      });
      
      setSuccess('Profile image updated successfully');
    } catch (error: any) {
      setError(error.message);
      
      // If session expired
      if (error.message === 'Your session has expired. Please login again.') {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Request email verification
  const handleVerifyEmail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await requestEmailVerification();
      
      setSuccess(data.message || 'Verification email sent successfully');
    } catch (error: any) {
      setError(error.message);
      
      // If session expired
      if (error.message === 'Your session has expired. Please login again.') {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Error and success messages */}
      {error && (
        <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-3 rounded-md bg-green-50 text-green-600 text-sm">
          {success}
        </div>
      )}
      
      {/* Profile form */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Update Profile</h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <Input
              id="name"
              name="name"
              value={profileForm.name}
              onChange={handleProfileInputChange}
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={profileForm.email}
              onChange={handleProfileInputChange}
              disabled={loading}
            />
            <p className="text-xs mt-1 text-gray-500">
              Note: Changing your email will require re-verification.
            </p>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
          </div>
        </form>
      </div>
      
      {/* Password form */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Change Password</h2>
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
              Current Password
            </label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={passwordForm.currentPassword}
              onChange={handlePasswordInputChange}
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
              New Password
            </label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              value={passwordForm.newPassword}
              onChange={handlePasswordInputChange}
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
              Confirm New Password
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordInputChange}
              disabled={loading}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <Button 
              type="button" 
              variant="link" 
              onClick={handleResetPassword}
              disabled={loading}
            >
              Forgot password?
            </Button>
            
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Change Password'}
            </Button>
          </div>
        </form>
      </div>
      
      {/* Profile image upload */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Profile Image</h2>
        <div className="space-y-4">
          <Input
            id="profileImage"
            type="file"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleImageUpload}
            disabled={loading}
          />
          
          <p className="text-xs text-gray-500">
            Upload a profile image (JPEG, PNG, or GIF).
          </p>
        </div>
      </div>
      
      {/* Email verification */}
      {user && !user.isVerifiedEmail && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Email Verification</h2>
          <p className="text-sm mb-4">
            Your email is not verified. Please verify your email to access all features.
          </p>
          
          <Button onClick={handleVerifyEmail} disabled={loading}>
            {loading ? 'Sending...' : 'Resend Verification Email'}
          </Button>
        </div>
      )}
    </div>
  );
} 