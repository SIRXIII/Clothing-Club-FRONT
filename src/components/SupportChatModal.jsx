import { useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SupportChatModal = ({ open, onClose, orderId = null }) => {
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) {
      toast.error("Subject and message are required");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/support-tickets", {
        order_id: orderId,
        subject,
        message,
      });

      const data = response.data;

      if (data.success) {
        toast.success("Support ticket created");
        const ticketId = data.data.id;
        onClose();
        navigate(`/support/chatsupport/${ticketId}`);
      } else {
        toast.error(data.message || "Failed to create ticket");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg sm:p-8">
        <h2 className="text-xl font-semibold mb-5 text-gray-800 text-center">Start Support Chat</h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#F77F00] transition"
          />

          <textarea
            rows="4"
            placeholder="Describe your issue..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#F77F00] transition resize-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-[#F77F00] text-white hover:bg-[#e96f00] disabled:opacity-50 transition"
          >
            {loading ? "Starting..." : "Start Chat"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportChatModal;
