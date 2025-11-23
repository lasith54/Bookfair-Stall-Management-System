import React from 'react';

export default function StallsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Stalls Management</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600">
          This page will contain stall management functionality including:
        </p>
        <ul className="list-disc list-inside mt-4 text-gray-600 space-y-2">
          <li>View all stalls</li>
          <li>Add new stalls</li>
          <li>Edit stall details</li>
          <li>Manage stall availability</li>
        </ul>
      </div>
    </div>
  );
}