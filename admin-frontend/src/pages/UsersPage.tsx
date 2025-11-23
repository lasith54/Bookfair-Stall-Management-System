import React from 'react';

export default function UsersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Users Management</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600">
          This page will contain user management functionality including:
        </p>
        <ul className="list-disc list-inside mt-4 text-gray-600 space-y-2">
          <li>View all users</li>
          <li>Manage user roles and permissions</li>
          <li>Add new admin users</li>
          <li>Deactivate/activate user accounts</li>
        </ul>
      </div>
    </div>
  );
}