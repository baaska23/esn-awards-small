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
      const response = await fetch("/mea/api/otp/send", {
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
      const response = await fetch("/mea/api/otp/resend", {
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
      const response = await fetch("/mea/api/otp/verify", {
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
    <div className="glass rounded-3xl p-6 max-w-md mx-auto">
      <h2 className="relative text-xl font-bold text-[#CFAA17] mb-4">
        {type === "email" ? "Имэйл" : "Утас"} баталгаажуулах
      </h2>

      <p className="relative text-sm text-white/80 mb-4">
        Баталгаажуулах код {identifier} руу илгээгдэх болно
      </p>

      {!message && (
        <button
          onClick={sendOTP}
          disabled={isSending}
          className="glow glass w-full text-[#CFAA17] font-semibold py-2 px-4 rounded-xl mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSending ? "Илгээж байна..." : "Код авах"}
        </button>
      )}

      {message && (
        <div className="relative mb-4">
          <div className="bg-green-500/15 border border-green-400/40 text-green-300 px-4 py-3 rounded-xl mb-4">
            {message}
          </div>

          {/* Inputs can't have ::before, so the glass edge lives on a wrapper */}
          <div className="glass rounded-xl mb-4">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="4 оронтой код"
              className="relative w-full px-4 py-2 rounded-xl bg-transparent text-center text-2xl tracking-widest text-white placeholder:text-white/50 outline-none focus:ring-1 focus:ring-white/40"
              maxLength={6}
            />
          </div>

          {error && (
            <div className="bg-red-500/15 border border-red-400/40 text-red-300 px-4 py-3 rounded-xl mb-4">
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
            className="glow glass w-full text-[#CFAA17] font-semibold py-2 px-4 rounded-xl mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Шалгаж байна..." : "Баталгаажуулах"}
          </button>

          <button
            onClick={resendOTP}
            disabled={isSending}
            className="glow glass w-full text-white font-semibold py-2 px-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Код дахин авах
          </button>
        </div>
      )}

      {onCancel && (
        <button
          onClick={onCancel}
          className="relative w-full text-white/60 hover:text-white text-sm mt-2"
        >
          Буцах
        </button>
      )}
    </div>
  );
}