import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useUserSessionStore } from "../../../stores/sessions/UserSessions";
import { useAuthStore } from "../../../stores/auth/authStore";
import { format } from "date-fns";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
}) => {
  const { registerForSession, fetchRegistrations } = useUserSessionStore();
  const { currentUser } = useAuthStore();
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBooking = async () => {
    if (!currentUser) {
      alert("You must be logged in to book a session.");
      return;
    }

    setIsBooking(true);

    try {
      await registerForSession({
        userId: currentUser.id,
        sessionDate: selectedDate,
      });
      setBookingSuccess(true);
      await fetchRegistrations();
    } catch (error) {
      setError("There was an error booking your session.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4 text-center text-gray-800">
          Book a Session on {format(selectedDate, "MMMM dd, yyyy")}
        </h2>

        {bookingSuccess && (
          <div className="flex items-center text-green-600 mb-4">
            <FaCheckCircle className="mr-2" />
            <p>Session booked successfully!</p>
          </div>
        )}

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mt-6 flex justify-between">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition disabled:opacity-50"
            disabled={isBooking}
            onClick={handleBooking}
          >
            {isBooking ? "Booking..." : "Book Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
