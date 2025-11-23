import { useState } from "react";
import { reservationService } from "../../services/reservationService";

interface ReservationFormProps {
  stallId: string;
  stallNumber: string;
  basePrice: number;
  zone?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const GENRES = [
  "Fiction",
  "Non-Fiction",
  "Educational",
  "Children's Books",
  "Comics & Graphic Novels",
  "Biography & Memoir",
  "Science & Technology",
  "History",
  "Self-Help",
  "Religion & Spirituality",
  "Poetry",
  "Drama",
  "Mystery & Thriller",
  "Romance",
  "Fantasy & Sci-Fi",
  "Business & Economics",
  "Art & Photography",
  "Travel",
  "Cookbooks",
  "Other"
];

export default function ReservationForm({
  stallId,
  stallNumber,
  basePrice,
  zone,
  onSuccess,
  onCancel
}: ReservationFormProps) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [specialRequests, setSpecialRequests] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [cardName, setCardName] = useState("");

  // Calculate dates
  const today = new Date();
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + 30);
  
  const duration = 10; // Fixed 10 days for pricing
  const totalAmount = basePrice * duration;

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (selectedGenres.length === 0) {
      setError("Please select at least one genre");
      return;
    }

    const purpose = JSON.stringify({ genres: selectedGenres });

    if (purpose.length < 10) {
      setError("Please select more genres");
      return;
    }

    // Show payment UI
    setShowPayment(true);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate payment details
    if (paymentMethod === "card") {
      if (!cardNumber || !cardExpiry || !cardCVV || !cardName) {
        setError("Please fill in all card details");
        return;
      }
      if (cardNumber.replace(/\s/g, "").length !== 16) {
        setError("Please enter a valid 16-digit card number");
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        setError("Please enter expiry date in MM/YY format");
        return;
      }
      if (cardCVV.length !== 3) {
        setError("Please enter a valid 3-digit CVV");
        return;
      }
    }

    try {
      setLoading(true);

      const purpose = JSON.stringify({ genres: selectedGenres });

      const reservationData = {
        stallId,
        startDate: today.toISOString(),
        endDate: endDate.toISOString(),
        purpose,
        specialRequests: specialRequests.trim() || undefined
      };

      console.log("Creating reservation with stallId:", stallId);
      console.log("Reservation data:", reservationData);

      const response = await reservationService.createReservation(reservationData);

      if (response.success) {
        onSuccess();
      } else {
        setError("Failed to create reservation");
      }
    } catch (err: any) {
      console.error("Reservation error:", err);
      setError(err.message || "Failed to create reservation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6 relative">
            <button
              onClick={onCancel}
              className="absolute -top-2 -right-2 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full p-1 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-blue-950 mb-2">
              Reserve Stall {stallNumber}
            </h2>
            <p className="text-gray-600">
              {zone && `Zone: ${zone} • `}
              Base Price: LKR {basePrice.toLocaleString()}/day
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          {!showPayment ? (
            <form onSubmit={handleSubmit}>
              {/* Genres Selection */}
              <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Book Genres <span className="text-red-500">*</span>
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Select the genres you'll be selling at this stall
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto p-4 bg-white border border-gray-200 rounded-lg">
                {GENRES.map((genre) => (
                  <label
                    key={genre}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedGenres.includes(genre)}
                      onChange={() => handleGenreToggle(genre)}
                      style={{
                        accentColor: '#3b82f6',
                        backgroundColor: '#fafafa',
                      }}
                      className="w-4 h-4 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700">{genre}</span>
                  </label>
                ))}
              </div>
              {selectedGenres.length > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {selectedGenres.join(", ")}
                </p>
              )}
            </div>

            {/* Special Requests */}
            <div className="mb-6">
              <label className="block font-semibold text-gray-900 mb-2">
                Special Requests (Optional)
              </label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                maxLength={1000}
                rows={4}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any special requirements or requests..."
              />
              <p className="text-sm text-gray-500 mt-1">
                {specialRequests.length}/1000 characters
              </p>
            </div>

            {/* Price Summary */}
            <div className="mb-6 p-4 bg-white border border-gray-300 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Price Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Base Price per Day:</span>
                  <span className="text-gray-900">LKR {basePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duration:</span>
                  <span className="text-gray-900">{duration} days</span>
                </div>
                <div className="border-t border-gray-300 pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-gray-900">Total Amount:</span>
                    <span className="text-blue-600">
                      LKR {totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={selectedGenres.length === 0}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proceed to Payment
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePaymentSubmit}>
              {/* Payment Method Selection */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value as "card" | "bank")}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Credit/Debit Card</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={paymentMethod === "bank"}
                      onChange={(e) => setPaymentMethod(e.target.value as "card" | "bank")}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Bank Transfer</span>
                  </label>
                </div>
              </div>

              {paymentMethod === "card" ? (
                <div className="mb-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Card Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Cardholder Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      placeholder="JOHN DOE"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Expiry Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        CVV <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={cardCVV}
                        onChange={(e) => setCardCVV(e.target.value.replace(/\D/g, "").substring(0, 3))}
                        placeholder="123"
                        maxLength={3}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Bank Transfer Details</h4>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p><span className="font-semibold">Bank:</span> National Bank</p>
                    <p><span className="font-semibold">Account Name:</span> Bookfair Management</p>
                    <p><span className="font-semibold">Account Number:</span> 1234567890</p>
                    <p><span className="font-semibold">Branch Code:</span> 001</p>
                    <p className="mt-2 text-xs text-gray-600">Please complete the transfer and proceed. Your reservation will be confirmed after payment verification.</p>
                  </div>
                </div>
              )}

              {/* Payment Summary */}
              <div className="mb-6 p-4 bg-white border border-gray-300 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Payment Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Stall:</span>
                    <span className="text-gray-900">{stallNumber}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="text-gray-900">{duration} days</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span className="text-gray-900">Amount to Pay:</span>
                      <span className="text-blue-600">LKR {totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPayment(false)}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing Payment...
                    </span>
                  ) : (
                    "Complete Payment"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
