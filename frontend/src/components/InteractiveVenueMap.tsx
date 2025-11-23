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
          // Get user's reserved stall IDs
          // Handle both string stallId and populated stallId object
          const myStallIds = new Set(
            reservationsResponse.success
              ? reservationsResponse.data.reservations
                  .filter((r: any) => r.status === 'confirmed' || r.status === 'pending')
                  .map((r: any) => {
                    // stallId can be a string or an object with _id
                    return typeof r.stallId === 'string' ? r.stallId : r.stallId._id;
                  })
              : []
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
    setSelectedStall(selectedStall === stallId ? null : stallId);
  };

  const selectedStallData = stalls.find(s => s.id === selectedStall);

  const handleReserveClick = () => {
    if (selectedStallData && selectedStallData.status === "available") {
      setStallToReserve(selectedStallData);
      setIsReservationModalOpen(true);
    }
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

      {/* Selected Stall Details */}
      {selectedStallData && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-bold text-lg text-blue-950 mb-2">
            {selectedStallData.name}
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-semibold">Status:</span>{" "}
              <span className={`capitalize ${
                selectedStallData.status === "available" ? "text-green-600" :
                selectedStallData.status === "reserved" ? "text-red-600" :
                "text-blue-600"
              }`}>
                {selectedStallData.status}
              </span>
            </div>
            <div>
              <span className="font-semibold">Dimensions:</span> {selectedStallData.realWidth || '?'}m x {selectedStallData.realLength || '?'}m
            </div>
            <div>
              <span className="font-semibold">Location:</span> Zone {selectedStallData.zone || selectedStallData.id.charAt(0)}
            </div>
            <div>
              <span className="font-semibold">Booth ID:</span> {selectedStallData.stallNumber}
            </div>
            {selectedStallData.price && (
              <div className="col-span-2">
                <span className="font-semibold">Price:</span> LKR {selectedStallData.price.toLocaleString()}/day
              </div>
            )}
          </div>
          {selectedStallData.status === "available" && (
            <button 
              onClick={handleReserveClick}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Reserve This Stall
            </button>
          )}
          {selectedStallData.status === "yours" && (
            <button className="mt-3 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium">
              Manage Stall
            </button>
          )}
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
