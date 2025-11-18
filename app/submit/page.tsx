"use client";
import CustomTitle from "../components/CustomTitle";
import Image from "next/image";
import esnLogo from "../../public/esn_logo.png";
import { useState } from "react";
import CustomArrow from "../components/CustomArrow";
import OTPVerification from "../components/OTPVerification";
import { useRouter } from "next/navigation";

export default function Submit() {
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [input, setInput] = useState("");
  const [type, setType] = useState<"email" | "sms">("email");
  const router = useRouter();

  function handleVerified() {
    setShowOtp(false);
    submitVote();
  }

  function detectInputType(value: string): "email" | "sms" {
    if (value.includes("@")) {
      return "email";
    }
    if (/^\d+$/.test(value)) {
      return "sms";
    }
    return "email";
  }

  async function startVerification() {
    let response;
    if (detectInputType(input) == "email") {
      response = await fetch(`/api/check-email?email=${encodeURIComponent(input)}`)
    } else if (detectInputType(input) === "sms") {
      response = await fetch(`/api/check-phone?phoneNumber=${encodeURIComponent(input)}`)
    }

    const data = await response?.json();

    if (data.exists) {
      alert(`Энэ имэйлээр/утсаар санал өгсөн байна`);
      sessionStorage.clear();
      router.push("/");
      return;
    }

    const payload: Record<string, unknown> = {};
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (!key) continue;
      const value = sessionStorage.getItem(key);
      try {
        payload[key] = value ? JSON.parse(value) : null;
      } catch {
        payload[key] = value;
      }
    }

    let isEmptyPoll = Object.keys(payload).length === 0;
    if (isEmptyPoll) {
      alert("Та эхлээд санал өгөх хэсгээс саналуудаа бөглөнө үү.");
      return;
    }

    let isInComplete = Object.keys(payload).length < 7;
    if (isInComplete) {
      alert("Санал асуулгыг бүрэн бөглөнө үү.");
      return;
    }

    if (!input.trim()) {
      alert("Имэйл хаяг эсвэл утасны дугаар оруулна уу.");
      return;
    }

    const detectedType = detectInputType(input);
    setType(detectedType);

    if (detectedType === "email" && !input.includes("@")) {
      alert("Зөв имэйл хаяг оруулна уу.");
      return;
    }

    if (detectedType === "sms") {
      const cleanPhone = input.replace(/\D/g, "");
      if (cleanPhone.length !== 8) {
        alert("Утасны дугаар 8 оронтой байх ёстой.");
        return;
      }
    }
    setShowOtp(true);
  }

  async function submitVote() {
    const payload: Record<string, unknown> = {};
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (!key) continue;
      const value = sessionStorage.getItem(key);
      try {
        payload[key] = value ? JSON.parse(value) : null;
      } catch {
        payload[key] = value;
      }
    }

    setIsLoading(true);

    const submission = {
      timestamp: new Date().toISOString(),
      email: type === "email" ? input : null,
      phone_number: type === "sms" ? input.replace(/\D/g, "") : null,
      verified: true,
      pc_team_id: payload.pc_team_id,
      mobile_team_id: payload.mobile_team_id,
      pc_player_id: payload.pc_player_id,
      mobile_player_id: payload.mobile_player_id,
      coach_id: payload.coach_id,
      igl_id: payload.igl_id,
      talent_id: payload.talent_id,
      streamer_id: payload.streamer_id,
      highlight_id: payload.highlight_id
    };

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submission),
      });

      if (response.ok) {
        setIsSubmit(true);
        sessionStorage.clear();
      } else {
        alert("Алдаа гарлаа. Дахин оролдоно уу.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsLoading(false);
    }
  }

  if (showOtp) {
    return (
      <div
        className="
          min-h-screen grid items-center justify-items-center p-6 sm:p-12 gap-2
          bg-[url('/BG_MOBILE_2.jpg')] md:bg-[url('/BG_DESKTOP_2.jpg')]
          bg-no-repeat bg-cover bg-center bg-fixed
        "
      >
        <CustomTitle />
        <OTPVerification
          type={type}
          identifier={input}
          onVerified={handleVerified}
          onCancel={() => setShowOtp(false)}
        />
      </div>
    );
  }

  return (
    <div
      className={`
        min-h-screen grid items-center justify-items-center p-6 sm:p-12 gap-2
        ${isSubmit
          ? "bg-[url('/BG_MOBILE_3.jpg')] md:bg-[url('/BG_DESKTOP_3.jpg')]"
          : "bg-[url('/BG_MOBILE_2.jpg')] md:bg-[url('/BG_DESKTOP_2.jpg')]"}
        bg-no-repeat bg-cover bg-center bg-fixed
      `}
    >
      <CustomTitle />

      {isSubmit ? (
        <div className="bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 text-gray-800 text-xl font-semibold text-center">
          Санал хураалтад идэвхитэй оролцсон таньд баярлалаа
        </div>
      ) : (
        <form
          className="bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 w-full max-w-md"
          onSubmit={e => {
            e.preventDefault();
            startVerification();
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Имэйл хаяг эсвэл утасны дугаар"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 text-black"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-900 hover:bg-blue-800 text-white text-xl font-semibold py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "ИЛГЭЭЖ БАЙНА..." : "САНАЛ ИЛГЭЭХ"}
          </button>
        </form>
      )}

      <Image src={esnLogo} alt="ESN logo" width={140} height={35} priority />

      <div className="w-full max-w-6xl flex justify-center items-center mt-4 px-4">
        <div className="m-2 bg-white/40 backdrop-blur-lg border border-white/20 rounded-2xl px-6 py-2 shadow-md">
          <CustomArrow side="left" to="/highlight" />
        </div>
      </div>
    </div>
  );
}