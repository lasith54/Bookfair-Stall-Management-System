import { useState } from "react";

interface Stall {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  status: "available" | "reserved" | "yours";
  name: string;
}

export default function InteractiveVenueMap() {
  const [hoveredStall, setHoveredStall] = useState<string | null>(null);
  const [selectedStall, setSelectedStall] = useState<string | null>(null);

  // Sample stall data - representing the venue layout from the image
  const stalls: Stall[] = [
    // LEFT COLUMN (Far Left)
    { id: "L1", x: 30, y: 50, width: 40, height: 35, status: "available", name: "Stall L1" },
    { id: "L2", x: 30, y: 90, width: 40, height: 35, status: "reserved", name: "Stall L2" },
    { id: "L3", x: 30, y: 130, width: 40, height: 35, status: "available", name: "Stall L3" },
    { id: "L4", x: 30, y: 170, width: 40, height: 35, status: "available", name: "Stall L4" },
    { id: "L5", x: 30, y: 210, width: 40, height: 75, status: "yours", name: "Stall L5" },
    
    // SECTION A (Second from left) - Top Row
    { id: "A1", x: 120, y: 50, width: 40, height: 35, status: "available", name: "Stall A1" },
    { id: "A2", x: 165, y: 50, width: 40, height: 35, status: "reserved", name: "Stall A2" },
    { id: "A3", x: 120, y: 90, width: 40, height: 35, status: "available", name: "Stall A3" },
    { id: "A4", x: 165, y: 90, width: 40, height: 35, status: "available", name: "Stall A4" },
    { id: "A5", x: 120, y: 130, width: 40, height: 35, status: "reserved", name: "Stall A5" },
    { id: "A6", x: 165, y: 130, width: 40, height: 35, status: "available", name: "Stall A6" },
    { id: "A7", x: 120, y: 170, width: 40, height: 35, status: "available", name: "Stall A7" },
    { id: "A8", x: 165, y: 170, width: 40, height: 35, status: "reserved", name: "Stall A8" },
    { id: "A9", x: 120, y: 210, width: 40, height: 75, status: "available", name: "Stall A9" },
    { id: "A10", x: 165, y: 210, width: 40, height: 75, status: "available", name: "Stall A10" },
    
    // SECTION B (Middle left) - Top Row
    { id: "B1", x: 255, y: 50, width: 40, height: 35, status: "available", name: "Stall B1" },
    { id: "B2", x: 300, y: 50, width: 40, height: 35, status: "available", name: "Stall B2" },
    { id: "B3", x: 255, y: 90, width: 40, height: 35, status: "reserved", name: "Stall B3" },
    { id: "B4", x: 300, y: 90, width: 40, height: 35, status: "available", name: "Stall B4" },
    { id: "B5", x: 255, y: 130, width: 40, height: 35, status: "available", name: "Stall B5" },
    { id: "B6", x: 300, y: 130, width: 40, height: 35, status: "reserved", name: "Stall B6" },
    { id: "B7", x: 255, y: 170, width: 40, height: 35, status: "available", name: "Stall B7" },
    { id: "B8", x: 300, y: 170, width: 40, height: 35, status: "available", name: "Stall B8" },
    { id: "B9", x: 255, y: 210, width: 40, height: 75, status: "reserved", name: "Stall B9" },
    { id: "B10", x: 300, y: 210, width: 40, height: 75, status: "available", name: "Stall B10" },
    
    // SECTION C (Middle right) - Top Row
    { id: "C1", x: 390, y: 50, width: 40, height: 35, status: "available", name: "Stall C1" },
    { id: "C2", x: 435, y: 50, width: 40, height: 35, status: "reserved", name: "Stall C2" },
    { id: "C3", x: 390, y: 90, width: 40, height: 35, status: "available", name: "Stall C3" },
    { id: "C4", x: 435, y: 90, width: 40, height: 35, status: "available", name: "Stall C4" },
    { id: "C5", x: 390, y: 130, width: 40, height: 35, status: "available", name: "Stall C5" },
    { id: "C6", x: 435, y: 130, width: 40, height: 35, status: "reserved", name: "Stall C6" },
    { id: "C7", x: 390, y: 170, width: 40, height: 35, status: "available", name: "Stall C7" },
    { id: "C8", x: 435, y: 170, width: 40, height: 35, status: "available", name: "Stall C8" },
    { id: "C9", x: 390, y: 210, width: 40, height: 75, status: "available", name: "Stall C9" },
    { id: "C10", x: 435, y: 210, width: 40, height: 75, status: "reserved", name: "Stall C10" },
    
    // RIGHT COLUMN (Far Right)
    { id: "R1", x: 525, y: 50, width: 40, height: 35, status: "available", name: "Stall R1" },
    { id: "R2", x: 525, y: 90, width: 40, height: 35, status: "available", name: "Stall R2" },
    { id: "R3", x: 525, y: 130, width: 40, height: 35, status: "reserved", name: "Stall R3" },
    { id: "R4", x: 525, y: 170, width: 40, height: 35, status: "available", name: "Stall R4" },
    { id: "R5", x: 525, y: 210, width: 40, height: 75, status: "available", name: "Stall R5" },
    
    // MIDDLE HORIZONTAL SECTION - Large Stalls
    { id: "M1", x: 55, y: 305, width: 120, height: 50, status: "available", name: "Stall M1" },
    { id: "M2", x: 185, y: 305, width: 100, height: 50, status: "reserved", name: "Stall M2" },
    { id: "M3", x: 295, y: 305, width: 110, height: 50, status: "available", name: "Stall M3" },
    { id: "M4", x: 415, y: 305, width: 130, height: 50, status: "available", name: "Stall M4" },
    
    // LOWER HORIZONTAL SECTION - Extra Large Stalls
    { id: "X1", x: 45, y: 370, width: 110, height: 45, status: "reserved", name: "Stall X1" },
    { id: "X2", x: 165, y: 370, width: 110, height: 45, status: "available", name: "Stall X2" },
    { id: "X3", x: 285, y: 370, width: 110, height: 45, status: "available", name: "Stall X3" },
    { id: "X4", x: 405, y: 370, width: 125, height: 45, status: "yours", name: "Stall X4" },
    
    // BOTTOM LEFT COLUMN
    { id: "BL1", x: 30, y: 440, width: 40, height: 60, status: "available", name: "Stall BL1" },
    { id: "BL2", x: 30, y: 505, width: 40, height: 35, status: "available", name: "Stall BL2" },
    { id: "BL3", x: 30, y: 545, width: 40, height: 35, status: "reserved", name: "Stall BL3" },
    { id: "BL4", x: 30, y: 585, width: 40, height: 35, status: "available", name: "Stall BL4" },
    { id: "BL5", x: 30, y: 625, width: 40, height: 35, status: "available", name: "Stall BL5" },
    
    // SECTION D (Second from left) - Bottom Row
    { id: "D1", x: 120, y: 440, width: 40, height: 60, status: "available", name: "Stall D1" },
    { id: "D2", x: 165, y: 440, width: 40, height: 35, status: "available", name: "Stall D2" },
    { id: "D3", x: 120, y: 505, width: 40, height: 35, status: "reserved", name: "Stall D3" },
    { id: "D4", x: 165, y: 505, width: 40, height: 35, status: "available", name: "Stall D4" },
    { id: "D5", x: 120, y: 545, width: 40, height: 35, status: "available", name: "Stall D5" },
    { id: "D6", x: 165, y: 545, width: 40, height: 35, status: "reserved", name: "Stall D6" },
    { id: "D7", x: 120, y: 585, width: 40, height: 35, status: "available", name: "Stall D7" },
    { id: "D8", x: 165, y: 585, width: 40, height: 35, status: "available", name: "Stall D8" },
    { id: "D9", x: 120, y: 625, width: 40, height: 35, status: "available", name: "Stall D9" },
    { id: "D10", x: 165, y: 625, width: 40, height: 35, status: "reserved", name: "Stall D10" },
    
    // SECTION E (Middle left) - Bottom Row
    { id: "E1", x: 255, y: 440, width: 40, height: 60, status: "available", name: "Stall E1" },
    { id: "E2", x: 300, y: 440, width: 40, height: 35, status: "available", name: "Stall E2" },
    { id: "E3", x: 255, y: 505, width: 40, height: 35, status: "available", name: "Stall E3" },
    { id: "E4", x: 300, y: 505, width: 40, height: 35, status: "reserved", name: "Stall E4" },
    { id: "E5", x: 255, y: 545, width: 40, height: 35, status: "available", name: "Stall E5" },
    { id: "E6", x: 300, y: 545, width: 40, height: 35, status: "available", name: "Stall E6" },
    { id: "E7", x: 255, y: 585, width: 40, height: 35, status: "reserved", name: "Stall E7" },
    { id: "E8", x: 300, y: 585, width: 40, height: 35, status: "available", name: "Stall E8" },
    { id: "E9", x: 255, y: 625, width: 40, height: 35, status: "available", name: "Stall E9" },
    { id: "E10", x: 300, y: 625, width: 40, height: 35, status: "available", name: "Stall E10" },
    
    // SECTION F (Middle right) - Bottom Row
    { id: "F1", x: 390, y: 440, width: 40, height: 60, status: "reserved", name: "Stall F1" },
    { id: "F2", x: 435, y: 440, width: 40, height: 35, status: "available", name: "Stall F2" },
    { id: "F3", x: 390, y: 505, width: 40, height: 35, status: "available", name: "Stall F3" },
    { id: "F4", x: 435, y: 505, width: 40, height: 35, status: "available", name: "Stall F4" },
    { id: "F5", x: 390, y: 545, width: 40, height: 35, status: "available", name: "Stall F5" },
    { id: "F6", x: 435, y: 545, width: 40, height: 35, status: "reserved", name: "Stall F6" },
    { id: "F7", x: 390, y: 585, width: 40, height: 35, status: "available", name: "Stall F7" },
    { id: "F8", x: 435, y: 585, width: 40, height: 35, status: "available", name: "Stall F8" },
    { id: "F9", x: 390, y: 625, width: 40, height: 35, status: "reserved", name: "Stall F9" },
    { id: "F10", x: 435, y: 625, width: 40, height: 35, status: "available", name: "Stall F10" },
    
    // BOTTOM RIGHT COLUMN
    { id: "BR1", x: 525, y: 440, width: 40, height: 60, status: "available", name: "Stall BR1" },
    { id: "BR2", x: 525, y: 505, width: 40, height: 35, status: "reserved", name: "Stall BR2" },
    { id: "BR3", x: 525, y: 545, width: 40, height: 35, status: "available", name: "Stall BR3" },
    { id: "BR4", x: 525, y: 585, width: 40, height: 35, status: "available", name: "Stall BR4" },
    { id: "BR5", x: 525, y: 625, width: 40, height: 35, status: "available", name: "Stall BR5" },
  ];

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
              <span className="font-semibold">Size:</span> {selectedStallData.width}x{selectedStallData.height}
            </div>
            <div>
              <span className="font-semibold">Location:</span> Section {selectedStallData.id.charAt(0)}
            </div>
            <div>
              <span className="font-semibold">Booth ID:</span> {selectedStallData.id}
            </div>
          </div>
          {selectedStallData.status === "available" && (
            <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
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
    </div>
  );
}
