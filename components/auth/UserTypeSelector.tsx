import React from 'react';
import { USER_TYPES } from '../../config/userTypes.config';
import { UserTypeCard } from './UserTypeCard';
import { UserRole } from '../../types';

interface UserTypeSelectorProps {
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

/**
 * Config-driven role selector.
 * Reads all roles from userTypes.config and renders a UserTypeCard for each.
 * Reused across Login and Signup pages.
 * Contains NO routing, auth, permissions, or onboarding logic.
 */
export const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({ selectedRole, onSelectRole }) => {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-400 dark:text-dm-muted-fg uppercase tracking-wider mb-3 text-center">
        I am the...
      </label>
      <div className="grid grid-cols-4 gap-3">
        {USER_TYPES.map((userType) => (
          <UserTypeCard
            key={userType.id}
            config={userType}
            isSelected={selectedRole === userType.id}
            onSelect={(id) => onSelectRole(id as UserRole)}
          />
        ))}
      </div>
    </div>
  );
};
