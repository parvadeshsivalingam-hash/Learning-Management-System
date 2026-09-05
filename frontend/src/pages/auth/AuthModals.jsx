import React from 'react';
import { AuthCard } from './AuthCard';

export const LoginModal = ({ isOpen, onClose, targetRole, onSwitchToRegister }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <AuthCard
        initialRole={targetRole || 'STUDENT'}
        initialTab="login"
        onClose={onClose}
      />
    </div>
  );
};

export const RegisterModal = ({ isOpen, onClose, initialRole }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <AuthCard
        initialRole={initialRole || 'STUDENT'}
        initialTab="register"
        onClose={onClose}
      />
    </div>
  );
};
