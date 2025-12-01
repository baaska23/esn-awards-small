"use client";
import { useState } from "react";

interface OTPVerificationProps {
  type: "email" | "sms";
  identifier: string;
  onVerified: () => void;
  onCancel?: () => void;
}

export default function OTPVerification({
  type,
  identifier,
  onVerified,
  onCancel,
}: OTPVerificationProps) {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);

  async function sendOTP() {
    setIsSending(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/mongolian-esports-awards/api/otp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          [type === "email" ? "email" : "phone"]: identifier,
          app_name: "esnAwards"
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Код илгээхэд алдаа гарлаа");
      console.error(err);
    } finally {
      setIsSending(false);
      
    }
  }

  async function resendOTP() {
    setIsSending(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/mongolian-esports-awards/api/otp/resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          [type === "email" ? "email" : "phone"]: identifier,
          app_name: "esnAwards"
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Код илгээхэд алдаа гарлаа");
      console.error(err);
    } finally {
      setIsSending(false);
      
    }
  }

  async function verifyOTP() {
    if (otp.length !== 4) {
      setError("4 оронтой код оруулна уу");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/mongolian-esports-awards/api/otp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [type === "email" ? "email" : "phone"]: identifier,
          OTP: otp,
          type,
        }),
      });

      const data = await response.json();

      if (data.success) {
        onVerified();
      } else {
        setError(data.error);
        if (data.remaining !== undefined) {
          setRemaining(data.remaining);
        }
      }
    } catch (err) {
      setError("Баталгаажуулахад алдаа гарлаа");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {type === "email" ? "Имэйл" : "Утас"} баталгаажуулах
      </h2>

      <p className="text-sm text-gray-700 mb-4">
        Баталгаажуулах код {identifier} руу илгээгдэх болно
      </p>

      {!message && (
        <button
          onClick={sendOTP}
          disabled={isSending}
          className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSending ? "Илгээж байна..." : "Код авах"}
        </button>
      )}

      {message && (
        <div className="mb-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>

          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="4 оронтой код"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 text-center text-2xl tracking-widest text-black"
            maxLength={6}
          />

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
              {remaining !== null && remaining > 0 && (
                <div className="text-sm mt-1">
                  {remaining} оролдлого үлдсэн
                </div>
              )}
            </div>
          )}

          <button
            onClick={verifyOTP}
            disabled={isLoading || otp.length !== 4}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Шалгаж байна..." : "Баталгаажуулах"}
          </button>

          <button
            onClick={resendOTP}
            disabled={isSending}
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Код дахин авах
          </button>
        </div>
      )}

      {onCancel && (
        <button
          onClick={onCancel}
          className="w-full text-gray-600 hover:text-gray-800 text-sm mt-2"
        >
          Буцах
        </button>
      )}
    </div>
  );
}