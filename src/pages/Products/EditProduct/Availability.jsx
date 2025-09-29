import React from 'react';

const Availability = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Availability</h1>

      {/* August 2025 Calendar */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">August 2025</h2>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for days before the 1st */}
          {[...Array(2)].map((_, index) => (
            <div key={`empty-${index}`} className="h-10"></div>
          ))}
          
          {/* Calendar days */}
          {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
            <div
              key={day}
              className={`h-10 rounded-lg flex items-center justify-center text-sm font-medium cursor-pointer transition-colors
                ${day >= 1 && day <= 5 ? 'bg-blue-100 text-blue-700 border border-blue-300' : ''}
                ${day >= 6 && day <= 12 ? 'bg-green-100 text-green-700 border border-green-300' : ''}
                ${day >= 13 && day <= 19 ? 'bg-purple-100 text-purple-700 border border-purple-300' : ''}
                ${day >= 20 && day <= 26 ? 'bg-orange-100 text-orange-700 border border-orange-300' : ''}
                ${day >= 27 && day <= 31 ? 'bg-red-100 text-red-700 border border-red-300' : ''}
                hover:opacity-90`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
            <span className="text-gray-700">1-5 Aug</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span className="text-gray-700">6-12 Aug</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-100 border border-purple-300 rounded"></div>
            <span className="text-gray-700">13-19 Aug</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></div>
            <span className="text-gray-700">20-26 Aug</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
            <span className="text-gray-700">27-31 Aug</span>
          </div>
        </div>
      </div>

      {/* Listing Quality */}
      <div className="border-t pt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Listing quality</h2>
        
        <div className="space-y-4">
          {/* Photo Quality */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Photo quality</h3>
                <p className="text-sm text-gray-600">Your photos meet our quality standards</p>
              </div>
            </div>
            <span className="text-green-600 font-medium">Good</span>
          </div>

          {/* Listing Completeness */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Listing completeness</h3>
                <p className="text-sm text-gray-600">Add more details to improve your listing</p>
              </div>
            </div>
            <span className="text-yellow-600 font-medium">Average</span>
          </div>

          {/* Guest Requirements */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Guest requirements</h3>
                <p className="text-sm text-gray-600">Review and update your guest requirements</p>
              </div>
            </div>
            <span className="text-red-600 font-medium">Poor</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Availability;