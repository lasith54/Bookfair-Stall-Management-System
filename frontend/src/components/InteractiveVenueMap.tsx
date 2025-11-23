import { useState, useEffect } from "react";
import { stallService } from "../../services/stallService";
import { reservationService } from "../../services/reservationService";
import ReservationForm from "./ReservationForm";

interface Stall {
  id: string;
  _id: string; // MongoDB ID
  stallNumber: string;
  x: number;
  y: number;
  width: number;
  height: number;
  status: "available" | "reserved" | "yours";
  name: string;
  realWidth?: number;
  realLength?: number;
  price?: number;
  zone?: string;
}

export default function InteractiveVenueMap() {
  const [hoveredStall, setHoveredStall] = useState<string | null>(null);
  const [selectedStall, setSelectedStall] = useState<string | null>(null);
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [stallToReserve, setStallToReserve] = useState<Stall | null>(null);
  const [myReservations, setMyReservations] = useState<any[]>([]);
  const [showReservationDetails, setShowReservationDetails] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [showStallDetails, setShowStallDetails] = useState(false);

  useEffect(() => {
    const fetchStallsAndReservations = async () => {
      try {
        setLoading(true);
        
        // Fetch stalls and user's reservations in parallel
        const [stallsResponse, reservationsResponse] = await Promise.all([
          stallService.getAllStalls(),
          reservationService.getMyReservations().catch(() => ({ success: false, data: { reservations: [] } }))
        ]);
        
        if (stallsResponse.success && stallsResponse.data.stalls) {
          // Store reservations for later use
          const reservations = reservationsResponse.success ? reservationsResponse.data.reservations : [];
          setMyReservations(reservations);
          
          // Get user's reserved stall IDs
          // Handle both string stallId and populated stallId object
          const myStallIds = new Set(
            reservations
              .filter((r: any) => r.status === 'completed' || r.status === 'pending')
              .map((r: any) => {
                // stallId can be a string or an object with _id
                return typeof r.stallId === 'string' ? r.stallId : r.stallId._id;
              })
          );

          console.log('My reserved stall IDs:', Array.from(myStallIds));

          // Transform API data to component format
          const transformedStalls = stallsResponse.data.stalls.map((stall: any) => {
            // Parse SVG coordinates from notes field
            let svgCoords = { x: 0, y: 0, width: 40, height: 35 };
            try {
              if (stall.notes) {
                const parsed = JSON.parse(stall.notes);
                if (parsed.svg) {
                  svgCoords = parsed.svg;
                }
              }
            } catch (e) {
              console.warn(`Failed to parse notes for stall ${stall.stallNumber}`, e);
            }

            // Determine status: yours > reserved > available
            let status: "available" | "reserved" | "yours" = "available";
            if (myStallIds.has(stall._id)) {
              status = "yours";
            } else if (stall.status !== "available") {
              status = "reserved";
            }

            return {
              id: stall.stallNumber,
              _id: stall._id, // MongoDB ID
              stallNumber: stall.stallNumber,
              x: svgCoords.x,
              y: svgCoords.y,
              width: svgCoords.width,
              height: svgCoords.height,
              status,
              name: `Stall ${stall.stallNumber}`,
              realWidth: stall.dimensions?.width,
              realLength: stall.dimensions?.length,
              price: stall.pricing?.basePrice,
              zone: stall.location?.zone
            };
          });
          
          setStalls(transformedStalls);
        } else {
          setError("Failed to load stalls");
        }
      } catch (err) {
        console.error("Error fetching stalls:", err);
        setError("Failed to load stalls from server");
      } finally {
        setLoading(false);
      }
    };

    fetchStallsAndReservations();
  }, []);

  const getStallColor = (status: string, isHovered: boolean, isSelected: boolean) => {
    // Don't allow selection color for reserved stalls
    if (isSelected && status !== "reserved") {
      return "#1e40af"; // Dark blue when selected
    }
    if (isHovered) {
      if (status === "available") return "#e5e7eb"; // Light gray on hover
      if (status === "reserved") return "#d1d5db"; // Keep same gray - no change on hover
      if (status === "yours") return "#3b82f6"; // Blue
    }
    if (status === "available") return "#ffffff"; // White
    if (status === "reserved") return "#d1d5db"; // Gray
    if (status === "yours") return "#60a5fa"; // Light blue
    return "#d1d5db"; // Gray
  };

  const handleStallClick = (stallId: string) => {
    const stall = stalls.find(s => s.id === stallId);
    // Don't allow selecting reserved stalls
    if (stall?.status === "reserved") return;
    
    // If clicking on user's stall, show reservation details
    if (stall?.status === "yours") {
      const reservation = myReservations.find((r: any) => {
        const resStallId = typeof r.stallId === 'string' ? r.stallId : r.stallId._id;
        return resStallId === stall._id;
      });
      if (reservation) {
        setSelectedReservation(reservation);
        setShowReservationDetails(true);
        return;
      }
    }
    
    // If clicking on available stall, show stall details modal
    if (stall?.status === "available") {
      setStallToReserve(stall);
      setShowStallDetails(true);
      return;
    }
    
    setSelectedStall(selectedStall === stallId ? null : stallId);
  };

  const handleProceedToReservation = () => {
    setShowStallDetails(false);
    setIsReservationModalOpen(true);
  };

  const handleReservationSuccess = () => {
    setIsReservationModalOpen(false);
    setStallToReserve(null);
    setSelectedStall(null);
    // Refresh stalls to update status
    window.location.reload();
  };

  const handleReservationCancel = () => {
    setIsReservationModalOpen(false);
    setStallToReserve(null);
    setShowStallDetails(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading venue map...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || stalls.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <svg className="mx-auto h-16 w-16 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Venue Map</h3>
            <p className="text-gray-600 mb-4">{error || "No stall data available"}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-blue-950 mb-4">Stall Map</h3>
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300 border border-gray-300 rounded"></div>
            <span>Reserved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-400 border border-gray-300 rounded"></div>
            <span>My Stalls</span>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-auto bg-gray-50">
        <svg 
          viewBox="0 0 600 700" 
          className="w-full h-auto max-w-3xl mx-auto"
          style={{ minHeight: "700px", maxHeight: "750px" }}
        >
          {/* Background */}
          <rect x="0" y="0" width="600" height="700" fill="#f9fafb" />
          
          {/* Access at Top */}
          <text x="300" y="27" textAnchor="middle" fill="#000000" fontSize="12">
            ACCESS
          </text>
          
          {/* Access at Bottom */}
          <text x="300" y="687" textAnchor="middle" fill="#000000" fontSize="12">
            ACCESS
          </text>
          
          {/* Vertical Aisles */}
          <rect x="75" y="45" width="30" height="620" fill="#e5e7eb" />
          <rect x="210" y="45" width="30" height="620" fill="#e5e7eb" />
          <rect x="345" y="45" width="30" height="620" fill="#e5e7eb" />
          <rect x="480" y="45" width="30" height="620" fill="#e5e7eb" />
          
          {/* Stalls */}
          {stalls.map((stall) => {
            const isHovered = hoveredStall === stall.id;
            const isSelected = selectedStall === stall.id;
            
            return (
              <g key={stall.id}>
                <rect
                  x={stall.x}
                  y={stall.y}
                  width={stall.width}
                  height={stall.height}
                  fill={getStallColor(stall.status, isHovered, isSelected)}
                  stroke={isSelected && stall.status !== "reserved" ? "#1e40af" : "#374151"}
                  strokeWidth={isSelected && stall.status !== "reserved" ? "3" : "1.5"}
                  rx="4"
                  className={stall.status === "reserved" ? "cursor-not-allowed transition-all duration-200" : "cursor-pointer transition-all duration-200"}
                  onMouseEnter={() => setHoveredStall(stall.id)}
                  onMouseLeave={() => setHoveredStall(null)}
                  onClick={() => handleStallClick(stall.id)}
                />
                <text
                  x={stall.x + stall.width / 2}
                  y={stall.y + stall.height / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={(isSelected && stall.status !== "reserved") || (isHovered && stall.status !== "reserved") ? "white" : "#1f2937"}
                  fontSize={stall.width < 60 ? "9" : "11"}
                  fontWeight="bold"
                  className="pointer-events-none"
                >
                  {stall.id}
                </text>
                
                {/* Tooltip on hover */}
                {isHovered && !isSelected && (
                  <g>
                    <rect
                      x={stall.x + stall.width / 2 - 40}
                      y={stall.y - 35}
                      width="80"
                      height="30"
                      fill="#1f2937"
                      rx="4"
                    />
                    <text
                      x={stall.x + stall.width / 2}
                      y={stall.y - 20}
                      textAnchor="middle"
                      fill="white"
                      fontSize="12"
                    >
                      {stall.name}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Stall Details Modal */}
      {showStallDetails && stallToReserve && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="mb-6 relative">
                <button
                  onClick={() => setShowStallDetails(false)}
                  className="absolute -top-2 -right-2 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full p-1 transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h2 className="text-2xl font-bold text-blue-950 mb-2">
                  Stall Details
                </h2>
                <p className="text-gray-600">
                  Stall #{stallToReserve.stallNumber}
                </p>
              </div>

              {/* Stall Info */}
              <div className="space-y-4">
                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    stallToReserve.status === 'available' ? 'bg-green-100 text-green-800' :
                    stallToReserve.status === 'reserved' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {stallToReserve.status.charAt(0).toUpperCase() + stallToReserve.status.slice(1)}
                  </span>
                </div>

                {/* Stall Information */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Stall Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Stall Number:</span>
                      <p className="font-medium text-gray-900">{stallToReserve.stallNumber}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Location:</span>
                      <p className="font-medium text-gray-900">Zone {stallToReserve.zone || stallToReserve.id.charAt(0)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Dimensions:</span>
                      <p className="font-medium text-gray-900">
                        {stallToReserve.realWidth || '?'}m × {stallToReserve.realLength || '?'}m
                      </p>
                    </div>
                    {stallToReserve.price && (
                      <div>
                        <span className="text-gray-600">Base Price:</span>
                        <p className="font-medium text-gray-900">
                          LKR {stallToReserve.price.toLocaleString()}/day
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price Estimate */}
                {stallToReserve.price && (
                  <div className="p-4 bg-white border border-gray-300 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Price Estimate</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Base Price per Day:</span>
                        <span className="text-gray-900">LKR {stallToReserve.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Estimated Duration:</span>
                        <span className="text-gray-900">10 days</span>
                      </div>
                      <div className="border-t border-gray-300 pt-2 mt-2">
                        <div className="flex justify-between font-bold text-lg">
                          <span className="text-gray-900">Estimated Total:</span>
                          <span className="text-blue-600">LKR {(stallToReserve.price * 10).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Information */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Additional Information</h3>
                  <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                    <li>Electricity and lighting included</li>
                    <li>Display shelves available</li>
                    <li>Access to common facilities</li>
                    <li>Security and cleaning services provided</li>
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowStallDetails(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProceedToReservation}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Proceed to Reservation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reservation Details Modal */}
      {showReservationDetails && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="mb-6 relative">
                <button
                  onClick={() => setShowReservationDetails(false)}
                  className="absolute -top-2 -right-2 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full p-1 transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h2 className="text-2xl font-bold text-blue-950 mb-2">
                  Reservation Details
                </h2>
                <p className="text-gray-600">
                  Reservation #{selectedReservation.reservationNumber}
                </p>
              </div>

              {/* Reservation Info */}
              <div className="space-y-4">
                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedReservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    selectedReservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    selectedReservation.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedReservation.status.charAt(0).toUpperCase() + selectedReservation.status.slice(1)}
                  </span>
                </div>

                {/* Stall Information */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Stall Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Stall Number:</span>
                      <p className="font-medium text-gray-900">
                        {typeof selectedReservation.stallId === 'string' 
                          ? selectedReservation.stallId 
                          : selectedReservation.stallId.stallNumber}
                      </p>
                    </div>
                    {typeof selectedReservation.stallId !== 'string' && selectedReservation.stallId.pricing && (
                      <div>
                        <span className="text-gray-600">Base Price:</span>
                        <p className="font-medium text-gray-900">
                          LKR {selectedReservation.stallId.pricing.basePrice.toLocaleString()}/day
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Purpose (Genres) */}
                {selectedReservation.purpose && (
                  <div className="p-4 bg-white border border-gray-300 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Book Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {(() => {
                        try {
                          const purposeData = JSON.parse(selectedReservation.purpose);
                          return purposeData.genres?.map((genre: string) => (
                            <span key={genre} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {genre}
                            </span>
                          ));
                        } catch {
                          return <p className="text-gray-600 text-sm">{selectedReservation.purpose}</p>;
                        }
                      })()}
                    </div>
                  </div>
                )}

                {/* Special Requests */}
                {selectedReservation.specialRequests && (
                  <div className="p-4 bg-white border border-gray-300 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Special Requests</h3>
                    <p className="text-gray-700 text-sm">{selectedReservation.specialRequests}</p>
                  </div>
                )}

                {/* Payment Information */}
                <div className="p-4 bg-white border border-gray-300 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Payment Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base Price:</span>
                      <span className="text-gray-900">LKR {selectedReservation.basePrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="text-gray-900">10 days</span>
                    </div>
                    <div className="border-t border-gray-300 pt-2 mt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span className="text-gray-900">Total Amount:</span>
                        <span className="text-blue-600">LKR {selectedReservation.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                    {selectedReservation.paymentStatus && (
                      <div className="flex justify-between pt-2">
                        <span className="text-gray-600">Payment Status:</span>
                        <span className={`font-medium ${
                          selectedReservation.paymentStatus === 'paid' ? 'text-green-600' :
                          selectedReservation.paymentStatus === 'pending' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {selectedReservation.paymentStatus.charAt(0).toUpperCase() + selectedReservation.paymentStatus.slice(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submitted Date */}
                <div className="text-sm text-gray-600">
                  Submitted: {new Date(selectedReservation.submittedAt || selectedReservation.createdAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6">
                <button
                  onClick={() => setShowReservationDetails(false)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reservation Modal */}
      {isReservationModalOpen && stallToReserve && (
        <ReservationForm
          stallId={stallToReserve._id}
          stallNumber={stallToReserve.stallNumber}
          basePrice={stallToReserve.price || 0}
          zone={stallToReserve.zone}
          onSuccess={handleReservationSuccess}
          onCancel={handleReservationCancel}
        />
      )}
    </div>
  );
}
