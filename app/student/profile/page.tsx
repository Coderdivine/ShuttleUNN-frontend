'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/Button';
import Input from '@/components/Input';
import ProfileModal from '@/components/ProfileModal';
import { Notification, useNotification } from '@/components/Notification';
import { useAppState } from '@/lib/AppContext';

function EditProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get('open') === 'true';
  const { notification, showNotification, clearNotification } = useNotification();
  const { user, isLoading, error, updateProfile, clearError } = useAppState();
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load initial form data from user context
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  // Show error notification if there's an error
  useEffect(() => {
    if (error) {
      showNotification('error', error);
      clearError();
    }
  }, [error, showNotification, clearError]);

  const handleClose = () => {
    router.back();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      setIsSubmitting(true);
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        phone: formData.phone,
      });
      showNotification('success', 'Profile updated successfully!');
      setIsSubmitting(false);
      setTimeout(handleClose, 1500);
    } catch (err: any) {
      setIsSubmitting(false);
      showNotification('error', err.message || 'Failed to update profile');
    }
  };

  if (!user) {
    return (
      <ProfileModal isOpen={isOpen} onClose={handleClose}>
        <div className="text-center py-8">Loading profile...</div>
      </ProfileModal>
    );
  }

  return (
    <>
      <ProfileModal isOpen={isOpen} onClose={handleClose}>
        <div className="text-sm text-gray-500 mb-8 font-light">
          Make changes to your profile.
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Username"
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            disabled={isSubmitting || isLoading}
            required
          />

          <Input
            label="First Name"
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            disabled={isSubmitting || isLoading}
            required
          />

          <Input
            label="Last Name"
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            disabled={isSubmitting || isLoading}
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            disabled={isSubmitting || isLoading}
            required
          />

          <div className="pt-4">
            <Button 
              type="submit" 
              variant="primary" 
              className="w-full"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? 'UPDATING...' : 'PROCEED'}
            </Button>
          </div>
        </form>
      </ProfileModal>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={clearNotification}
        />
      )}
    </>
  );
}

export default function EditProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditProfileContent />
    </Suspense>
  );
}
