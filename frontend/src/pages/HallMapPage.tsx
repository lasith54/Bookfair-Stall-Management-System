import Header from "@/components/Header";

export default function HallMapPage() {
  // Sample stall data - same as InteractiveVenueMap
  const stalls = [
    // LEFT COLUMN (Far Left)
    { id: "L1", x: 30, y: 50, width: 40, height: 35 },
    { id: "L2", x: 30, y: 90, width: 40, height: 35 },
    { id: "L3", x: 30, y: 130, width: 40, height: 35 },
    { id: "L4", x: 30, y: 170, width: 40, height: 35 },
    { id: "L5", x: 30, y: 210, width: 40, height: 75 },
    
    // SECTION A (Second from left) - Top Row
    { id: "A1", x: 120, y: 50, width: 40, height: 35 },
    { id: "A2", x: 165, y: 50, width: 40, height: 35 },
    { id: "A3", x: 120, y: 90, width: 40, height: 35 },
    { id: "A4", x: 165, y: 90, width: 40, height: 35 },
    { id: "A5", x: 120, y: 130, width: 40, height: 35 },
    { id: "A6", x: 165, y: 130, width: 40, height: 35 },
    { id: "A7", x: 120, y: 170, width: 40, height: 35 },
    { id: "A8", x: 165, y: 170, width: 40, height: 35 },
    { id: "A9", x: 120, y: 210, width: 40, height: 75 },
    { id: "A10", x: 165, y: 210, width: 40, height: 75 },
    
    // SECTION B (Middle left) - Top Row
    { id: "B1", x: 255, y: 50, width: 40, height: 35 },
    { id: "B2", x: 300, y: 50, width: 40, height: 35 },
    { id: "B3", x: 255, y: 90, width: 40, height: 35 },
    { id: "B4", x: 300, y: 90, width: 40, height: 35 },
    { id: "B5", x: 255, y: 130, width: 40, height: 35 },
    { id: "B6", x: 300, y: 130, width: 40, height: 35 },
    { id: "B7", x: 255, y: 170, width: 40, height: 35 },
    { id: "B8", x: 300, y: 170, width: 40, height: 35 },
    { id: "B9", x: 255, y: 210, width: 40, height: 75 },
    { id: "B10", x: 300, y: 210, width: 40, height: 75 },
    
    // SECTION C (Middle right) - Top Row
    { id: "C1", x: 390, y: 50, width: 40, height: 35 },
    { id: "C2", x: 435, y: 50, width: 40, height: 35 },
    { id: "C3", x: 390, y: 90, width: 40, height: 35 },
    { id: "C4", x: 435, y: 90, width: 40, height: 35 },
    { id: "C5", x: 390, y: 130, width: 40, height: 35 },
    { id: "C6", x: 435, y: 130, width: 40, height: 35 },
    { id: "C7", x: 390, y: 170, width: 40, height: 35 },
    { id: "C8", x: 435, y: 170, width: 40, height: 35 },
    { id: "C9", x: 390, y: 210, width: 40, height: 75 },
    { id: "C10", x: 435, y: 210, width: 40, height: 75 },
    
    // RIGHT COLUMN (Far Right)
    { id: "R1", x: 525, y: 50, width: 40, height: 35 },
    { id: "R2", x: 525, y: 90, width: 40, height: 35 },
    { id: "R3", x: 525, y: 130, width: 40, height: 35 },
    { id: "R4", x: 525, y: 170, width: 40, height: 35 },
    { id: "R5", x: 525, y: 210, width: 40, height: 75 },
    
    // MIDDLE HORIZONTAL SECTION - Large Stalls
    { id: "M1", x: 55, y: 305, width: 120, height: 50 },
    { id: "M2", x: 185, y: 305, width: 100, height: 50 },
    { id: "M3", x: 295, y: 305, width: 110, height: 50 },
    { id: "M4", x: 415, y: 305, width: 130, height: 50 },
    
    // LOWER HORIZONTAL SECTION - Extra Large Stalls
    { id: "X1", x: 45, y: 370, width: 110, height: 45 },
    { id: "X2", x: 165, y: 370, width: 110, height: 45 },
    { id: "X3", x: 285, y: 370, width: 110, height: 45 },
    { id: "X4", x: 405, y: 370, width: 125, height: 45 },
    
    // BOTTOM LEFT COLUMN
    { id: "BL1", x: 30, y: 440, width: 40, height: 60 },
    { id: "BL2", x: 30, y: 505, width: 40, height: 35 },
    { id: "BL3", x: 30, y: 545, width: 40, height: 35 },
    { id: "BL4", x: 30, y: 585, width: 40, height: 35 },
    { id: "BL5", x: 30, y: 625, width: 40, height: 35 },
    
    // SECTION D (Second from left) - Bottom Row
    { id: "D1", x: 120, y: 440, width: 40, height: 60 },
    { id: "D2", x: 165, y: 440, width: 40, height: 35 },
    { id: "D3", x: 120, y: 505, width: 40, height: 35 },
    { id: "D4", x: 165, y: 505, width: 40, height: 35 },
    { id: "D5", x: 120, y: 545, width: 40, height: 35 },
    { id: "D6", x: 165, y: 545, width: 40, height: 35 },
    { id: "D7", x: 120, y: 585, width: 40, height: 35 },
    { id: "D8", x: 165, y: 585, width: 40, height: 35 },
    { id: "D9", x: 120, y: 625, width: 40, height: 35 },
    { id: "D10", x: 165, y: 625, width: 40, height: 35 },
    
    // SECTION E (Middle left) - Bottom Row
    { id: "E1", x: 255, y: 440, width: 40, height: 60 },
    { id: "E2", x: 300, y: 440, width: 40, height: 35 },
    { id: "E3", x: 255, y: 505, width: 40, height: 35 },
    { id: "E4", x: 300, y: 505, width: 40, height: 35 },
    { id: "E5", x: 255, y: 545, width: 40, height: 35 },
    { id: "E6", x: 300, y: 545, width: 40, height: 35 },
    { id: "E7", x: 255, y: 585, width: 40, height: 35 },
    { id: "E8", x: 300, y: 585, width: 40, height: 35 },
    { id: "E9", x: 255, y: 625, width: 40, height: 35 },
    { id: "E10", x: 300, y: 625, width: 40, height: 35 },
    
    // SECTION F (Middle right) - Bottom Row
    { id: "F1", x: 390, y: 440, width: 40, height: 60 },
    { id: "F2", x: 435, y: 440, width: 40, height: 35 },
    { id: "F3", x: 390, y: 505, width: 40, height: 35 },
    { id: "F4", x: 435, y: 505, width: 40, height: 35 },
    { id: "F5", x: 390, y: 545, width: 40, height: 35 },
    { id: "F6", x: 435, y: 545, width: 40, height: 35 },
    { id: "F7", x: 390, y: 585, width: 40, height: 35 },
    { id: "F8", x: 435, y: 585, width: 40, height: 35 },
    { id: "F9", x: 390, y: 625, width: 40, height: 35 },
    { id: "F10", x: 435, y: 625, width: 40, height: 35 },
    
    // BOTTOM RIGHT COLUMN
    { id: "BR1", x: 525, y: 440, width: 40, height: 60 },
    { id: "BR2", x: 525, y: 505, width: 40, height: 35 },
    { id: "BR3", x: 525, y: 545, width: 40, height: 35 },
    { id: "BR4", x: 525, y: 585, width: 40, height: 35 },
    { id: "BR5", x: 525, y: 625, width: 40, height: 35 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 w-screen overflow-x-hidden">
      <Header title="Book Fair" />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-blue-950 mb-8 text-center">
          Hall Map
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 max-w-4xl mx-auto">
            <svg 
              viewBox="0 0 600 700" 
              className="w-full h-auto"
              preserveAspectRatio="xMidYMid meet"
              style={{ maxHeight: "600px" }}
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
              {stalls.map((stall) => (
                <g key={stall.id}>
                  <rect
                    x={stall.x}
                    y={stall.y}
                    width={stall.width}
                    height={stall.height}
                    fill="#e5e7eb"
                    stroke="#374151"
                    strokeWidth="1.5"
                    rx="4"
                  />
                  <text
                    x={stall.x + stall.width / 2}
                    y={stall.y + stall.height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#1f2937"
                    fontSize={stall.width < 60 ? "9" : "11"}
                    fontWeight="bold"
                  >
                    {stall.id}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="mt-6 text-center text-gray-600">
            <p className="text-sm">All stalls shown in the layout above</p>
            <p className="text-sm mt-2">Login to reserve your preferred stall</p>
          </div>
        </div>
      </div>
    </div>
  );
}
