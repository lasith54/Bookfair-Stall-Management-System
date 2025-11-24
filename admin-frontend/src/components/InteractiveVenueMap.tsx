import { useState, useEffect } from "react";
import { stallService } from "../services/stallService";
import { reservationService, Reservation } from "../services/reservationService";

interface Stall {
  id: string;
  _id: string;
  stallNumber: string;
  x: number;
  y: number;
  width: number;
  height: number;
  status: "available" | "reserved" | "occupied" | "maintenance";
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
  const [showStallDetails, setShowStallDetails] = useState(false);
  const [selectedStallDetails, setSelectedStallDetails] = useState<Stall | null>(null);
  const [stallReservations, setStallReservations] = useState<Reservation[]>([]);
  const [loadingReservations, setLoadingReservations] = useState(false);

  useEffect(() => {
    const fetchStalls = async () => {
      try {
        setLoading(true);
        const stallsResponse = await stallService.getAllStalls();
        
        if (stallsResponse.success && stallsResponse.data.stalls) {
          const transformedStalls = stallsResponse.data.stalls.map((stall: any) => {
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

            return {
              id: stall.stallNumber,
              _id: stall._id,
              stallNumber: stall.stallNumber,
              x: svgCoords.x,
              y: svgCoords.y,
              width: svgCoords.width,
              height: svgCoords.height,
              status: stall.status,
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

    fetchStalls();
  }, []);

  const getStallColor = (status: string, isHovered: boolean, isSelected: boolean) => {
    if (isSelected) return "#1e40af";
    if (isHovered) {
      if (status === "available") return "#e5e7eb";
      if (status === "reserved") return "#ef4444";
      if (status === "occupied") return "#f59e0b";
      if (status === "maintenance") return "#6b7280";
    }
    if (status === "available") return "#ffffff";
    if (status === "reserved") return "#fca5a5";
    if (status === "occupied") return "#fbbf24";
    if (status === "maintenance") return "#9ca3af";
    return "#d1d5db";
  };

  const handleStallClick = async (stallId: string) => {
    const stall = stalls.find(s => s.id === stallId);
    if (stall) {
      setSelectedStallDetails(stall);
      setShowStallDetails(true);
      
      if (stall.status === 'reserved' || stall.status === 'occupied') {
        setLoadingReservations(true);
        try {
          const reservations = await reservationService.getReservationsByStallId(stall._id);
          setStallReservations(reservations);
        } catch (error) {
          console.error('Failed to fetch reservations:', error);
          setStallReservations([]);
        } finally {
          setLoadingReservations(false);
        }
      } else {
        setStallReservations([]);
      }
    }
    setSelectedStall(selectedStall === stallId ? null : stallId);
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

  const availableCount = stalls.filter(s => s.status === 'available').length;
  const reservedCount = stalls.filter(s => s.status === 'reserved').length;
  const occupiedCount = stalls.filter(s => s.status === 'occupied').length;
  const maintenanceCount = stalls.filter(s => s.status === 'maintenance').length;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-blue-950 mb-4">Stall Map</h3>
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
            <span>Available ({availableCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-300 border border-gray-300 rounded"></div>
            <span>Reserved ({reservedCount})</span>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-auto bg-gray-50">
        <svg 
          viewBox="0 0 600 700" 
          className="w-full h-auto max-w-3xl mx-auto"
          style={{ minHeight: "700px", maxHeight: "750px" }}
        >
          <rect x="0" y="0" width="600" height="700" fill="#f9fafb" />
          <text x="300" y="27" textAnchor="middle" fill="#000000" fontSize="12">ACCESS</text>
          <text x="300" y="687" textAnchor="middle" fill="#000000" fontSize="12">ACCESS</text>
          <rect x="75" y="45" width="30" height="620" fill="#e5e7eb" />
          <rect x="210" y="45" width="30" height="620" fill="#e5e7eb" />
          <rect x="345" y="45" width="30" height="620" fill="#e5e7eb" />
          <rect x="480" y="45" width="30" height="620" fill="#e5e7eb" />
          
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
                  stroke={isSelected ? "#1e40af" : "#374151"}
                  strokeWidth={isSelected ? "3" : "1.5"}
                  rx="4"
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredStall(stall.id)}
                  onMouseLeave={() => setHoveredStall(null)}
                  onClick={() => handleStallClick(stall.id)}
                />
                <text
                  x={stall.x + stall.width / 2}
                  y={stall.y + stall.height / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isSelected || isHovered ? "white" : "#1f2937"}
                  fontSize={stall.width < 60 ? "9" : "11"}
                  fontWeight="bold"
                  className="pointer-events-none"
                >
                  {stall.id}
                </text>
                
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
      {showStallDetails && selectedStallDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="mb-6 relative">
                <button
                  onClick={() => {
                    setShowStallDetails(false);
                    setSelectedStall(null);
                    setStallReservations([]);
                  }}
                  className="absolute -top-2 -right-2 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full p-1 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h2 className="text-2xl font-bold text-blue-950 mb-2">Stall Details</h2>
                <p className="text-gray-600">Stall #{selectedStallDetails.stallNumber}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedStallDetails.status === 'available' ? 'bg-green-100 text-green-800' :
                    selectedStallDetails.status === 'reserved' ? 'bg-red-100 text-red-800' :
                    selectedStallDetails.status === 'occupied' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedStallDetails.status.charAt(0).toUpperCase() + selectedStallDetails.status.slice(1)}
                  </span>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Stall Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Stall Number:</span>
                      <p className="font-medium text-gray-900">{selectedStallDetails.stallNumber}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Location:</span>
                      <p className="font-medium text-gray-900">Zone {selectedStallDetails.zone || selectedStallDetails.id.charAt(0)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Dimensions:</span>
                      <p className="font-medium text-gray-900">
                        {selectedStallDetails.realWidth || '?'}m × {selectedStallDetails.realLength || '?'}m
                      </p>
                    </div>
                    {selectedStallDetails.price && (
                      <div>
                        <span className="text-gray-600">Base Price:</span>
                        <p className="font-medium text-gray-900">
                          LKR {selectedStallDetails.price.toLocaleString()}/day
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reservation Information */}
                {(selectedStallDetails.status === 'reserved' || selectedStallDetails.status === 'occupied') && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Reservation Information</h3>
                    {loadingReservations ? (
                      <p className="text-sm text-gray-600">Loading reservation details...</p>
                    ) : stallReservations.length > 0 ? (
                      <div className="space-y-3">
                        {stallReservations.map((reservation) => (
                          <div key={reservation._id} className="border-t border-yellow-300 pt-2 first:border-t-0 first:pt-0">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-gray-600">Reservation #:</span>
                                <p className="font-medium text-gray-900">{reservation.reservationNumber}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Status:</span>
                                <p className="font-medium text-gray-900">{reservation.status}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Customer:</span>
                                <p className="font-medium text-gray-900">{reservation.userId.name}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Email:</span>
                                <p className="font-medium text-gray-900 text-xs">{reservation.userId.email}</p>
                              </div>
                              {reservation.userId.contactNumber && (
                                <div>
                                  <span className="text-gray-600">Contact:</span>
                                  <p className="font-medium text-gray-900">{reservation.userId.contactNumber}</p>
                                </div>
                              )}
                              <div>
                                <span className="text-gray-600">Total Amount:</span>
                                <p className="font-medium text-gray-900">LKR {reservation.totalAmount.toLocaleString()}</p>
                              </div>
                            </div>
                            {reservation.purpose && (
                              <div className="mt-2">
                                <span className="text-gray-600 text-sm">Genre:</span>
                                <p className="text-sm text-gray-900">
                                  {(() => {
                                    try {
                                      const purposeData = JSON.parse(reservation.purpose);
                                      return purposeData.genres?.join(', ') || reservation.purpose;
                                    } catch {
                                      return reservation.purpose;
                                    }
                                  })()}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">No active reservations found</p>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-6">
                <button
                  onClick={() => {
                    setShowStallDetails(false);
                    setSelectedStall(null);
                    setStallReservations([]);
                  }}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
