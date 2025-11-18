'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { dummyStudent } from '@/lib/dummyData';
import Button from '@/components/Button';
import Input from '@/components/Input';
import ProfileModal from '@/components/ProfileModal';
import { Notification, useNotification } from '@/components/Notification';

function EditProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get('open') === 'true';
  const { notification, showNotification, clearNotification } = useNotification();
  const [formData, setFormData] = useState({
    username: dummyStudent.username,
    firstName: dummyStudent.firstName,
    lastName: dummyStudent.lastName,
    phone: dummyStudent.phone,
  });

  const handleClose = () => {
    router.back();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showNotification('success', 'Profile updated successfully!');
    setTimeout(handleClose, 1500);
  };

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
            required
          />

          <Input
            label="First Name"
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
          />

          <Input
            label="Last Name"
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />

          <div className="pt-4">
            <Button type="submit" variant="primary" className="w-full">
              PROCEED
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
