
import { useState } from "react";
import axios from "axios";
import { FaTimes, FaCrown, FaCheck } from "react-icons/fa";

function SubscriptionModal({ closeModal, onSuccess }) {
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [message, setMessage] = useState("");

  const serverUrl = import.meta.env.VITE_SERVER_URL;

  const handlePremiumPayment = async () => {
    if (paymentLoading) return;

    setPaymentLoading(true);
    setMessage("");

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login first, then try again.");
      setPaymentLoading(false);
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      // 1. Create Razorpay order
      const response = await axios.post(
        `${serverUrl}/api/subscription/create-order`,
        {},
        config
      );

      const payload = response.data;

      if (!payload.success || !payload.key || !payload.order?.id) {
        throw new Error(
          payload.message || "Could not create payment order."
        );
      }

      // 2. Load Razorpay checkout script
      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src =
            "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = resolve;
          script.onerror = () =>
            reject(new Error("Unable to load Razorpay checkout."));
          document.body.appendChild(script);
        });
      }

      // 3. Configure Razorpay
      const options = {
        key: payload.key,
        amount: payload.order.amount,
        currency: payload.order.currency,
        name: "GetNotes",
        description: "Premium Subscription - 30 Days",
        order_id: payload.order.id,

        handler: async (paymentResponse) => {
          try {
            // 4. Verify payment on backend
            const verifyResponse = await axios.post(
              `${serverUrl}/api/subscription/verify`,
              {
                razorpay_order_id:
                  paymentResponse.razorpay_order_id,
                razorpay_payment_id:
                  paymentResponse.razorpay_payment_id,
                razorpay_signature:
                  paymentResponse.razorpay_signature,
              },
              config
            );

            if (verifyResponse.data.success) {
              // Notify AIAssistant that payment was verified
              if (typeof onSuccess === "function") {
                onSuccess();
              }

              // Close subscription popup and return to AI Assistant
              closeModal();
            } else {
              setMessage(
                verifyResponse.data.message ||
                  "Payment verification failed."
              );
            }
          } catch (error) {
            console.error(
              "PAYMENT VERIFICATION ERROR:",
              error.response?.data || error
            );

            setMessage(
              error.response?.data?.message ||
                "Payment verification failed. If money was deducted, please contact support."
            );
          } finally {
            setPaymentLoading(false);
          }
        },

        modal: {
          ondismiss: () => {
            setPaymentLoading(false);
          },
        },

        theme: {
          color: "#7c3aed",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (paymentError) => {
        console.error(
          "RAZORPAY PAYMENT FAILED:",
          paymentError.error
        );

        setMessage(
          paymentError.error?.description ||
            "Payment failed. Please try again."
        );

        setPaymentLoading(false);
      });

      razorpay.open();
    } catch (error) {
      console.error(
        "SUBSCRIPTION PAYMENT ERROR:",
        error.response?.data || error
      );

      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Could not start payment."
      );

      setPaymentLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl dark:bg-slate-900">
        <button
          type="button"
          onClick={closeModal}
          className="absolute right-5 top-5 text-xl text-gray-500 transition hover:text-red-500"
          aria-label="Close subscription modal"
        >
          <FaTimes />
        </button>

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/40">
          <FaCrown className="text-3xl text-amber-500" />
        </div>

        <h2 className="mt-5 text-center text-2xl font-bold dark:text-white">
          Upgrade to Premium
        </h2>

        <p className="mt-2 text-center text-gray-500 dark:text-gray-400">
          Unlock the full power of AI Study Assistant.
        </p>

        <div className="mt-6 rounded-2xl border border-purple-200 bg-purple-50 p-5 dark:border-purple-800 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold dark:text-white">
              Premium Plan
            </h3>

            <span className="rounded-full bg-purple-200 px-3 py-1 text-xs font-bold text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              30 DAYS
            </span>
          </div>

          <div className="mt-4">
            <span className="text-4xl font-extrabold dark:text-white">
              ₹199
            </span>
            <span className="ml-2 text-sm text-gray-500">
              / month
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {[
              "AI Summaries",
              "Interview Questions",
              "AI MCQ Practice",
              "Premium AI Access",
            ].map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-3 text-gray-700 dark:text-gray-300"
              >
                <FaCheck className="text-green-500" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {message && (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-red-200 bg-red-100 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
          >
            {message}
          </div>
        )}

        <button
          type="button"
          onClick={handlePremiumPayment}
          disabled={paymentLoading}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {paymentLoading
            ? "Connecting to Razorpay..."
            : "Pay ₹199 with Razorpay"}
        </button>

        <p className="mt-3 text-center text-xs text-gray-500">
          Secure payment powered by Razorpay
        </p>
      </div>
    </div>
  );
}

export default SubscriptionModal;
