// components/UserProfileDropdown.js
import React, { useState } from 'react';

const UserProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>User Profile</button>
      {isOpen && (
        <div>
          {/* User profile details */}
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
