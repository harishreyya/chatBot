// "use client";

// import { useState, useEffect } from "react";
// import { signIn, useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import toast, { Toaster } from "react-hot-toast";
// import { Button, Label, TextInput, Card } from "flowbite-react";

// export default function LoginPage() {
//   const router = useRouter();
//   const { status } = useSession();

//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [isOtpSent, setIsOtpSent] = useState(false);
//   const [resendTimer, setResendTimer] = useState(30);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const isValidEmail = (email: string) =>
//     /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   useEffect(() => {
//     if (status === "authenticated") {
//       router.replace("/");
//     }
//   }, [status, router]);

//   const handleEmailSubmit = async () => {
//     if (!isValidEmail(email)) {
//       toast.error("Please enter a valid email address.");
//       return;
//     }

//     setIsSubmitting(true);
//     const result = await signIn("email", { email, redirect: false });
//     if (result?.error) {
//       toast.error("Failed to send OTP.");
//     } else {
//       setIsOtpSent(true);
//       setResendTimer(30);
//       toast.success("OTP sent to your email.");
//     }
//     setIsSubmitting(false);
//   };

//   const handleOtpSubmit = () => {
//     const callbackUrl = `/api/auth/callback/email?email=${encodeURIComponent(email)}&token=${encodeURIComponent(otp)}&callbackUrl=/after-auth`;
//     window.location.href = callbackUrl;
//   };

//   return (
//     <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
//       <div className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4">
//         <h1 className="text-2xl font-semibold text-center">Sign In</h1>
//         <Toaster />

//         {!isOtpSent ? (
//           <>
//             <input
//               type="email"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full p-2 border rounded"
//             />
//             <button
//               onClick={handleEmailSubmit}
//               disabled={isSubmitting || !email}
//               className="w-full bg-blue-600 text-white p-2 rounded"
//             >
//               {isSubmitting ? "Sending..." : "Send OTP"}
//             </button>
//           </>
//         ) : (
//           <>
//             <input
//               type="text"
//               placeholder="Enter the OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               maxLength={6}
//               className="w-full p-2 border rounded text-center tracking-widest font-mono"
//             />
//             <button
//               onClick={handleOtpSubmit}
//               disabled={otp.length !== 6}
//               className="w-full bg-green-600 text-white p-2 rounded"
//             >
//               Verify OTP
//             </button>
//           </>
//         )}
//       </div>
//     </main>
//   );
// }


// ----------------------------------------------------


"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Button, Label, TextInput, Card } from "flowbite-react";

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOtpSent && resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer, isOtpSent]);

  const handleEmailSubmit = async () => {
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    const result = await signIn("email", { email, redirect: false });
    if (result?.error) {
      toast.error("Failed to send OTP.");
    } else {
      setIsOtpSent(true);
      setResendTimer(30);
      toast.success("OTP sent to your email.");
    }
    setIsSubmitting(false);
  };

  const handleOtpSubmit = () => {
    setIsVerifying(true);
    const callbackUrl = `/api/auth/callback/email?email=${encodeURIComponent(email)}&token=${encodeURIComponent(otp)}&callbackUrl=/after-auth`;
    window.location.href = callbackUrl;
    setIsVerifying(false);
  };

  
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <Toaster />
      <div className="absolute inset-0">
      <img
          src="https://d3tx3wg2jy0sui.cloudfront.net/cb292bd0098a4c80b7a7a37fa1cafd36.png"
          alt="Background"
          className="w-full h-full object-cover filter blur-3xl brightness-50"
          style={{ filter: "blur(3px) brightness(0.5)" }} 
        />
      </div>
      <div className="relative w-full max-w-md p-4">
        <Card className="bg-white bg-opacity-90 rounded-2xl shadow-xl border border-gray-200">
          <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">
            AI Models
          </h1>
          <p className="text-center text-gray-700 text-sm mb-4 p-3 bg-gray-100 rounded-md border border-gray-200">
            Sign in with your email to access exclusive AI models. 
            A one-time passcode (OTP) will be sent to your inbox for secure verification. 
            Please check your email after submission.
          </p>

          {!isOtpSent ? (
            <form className="flex flex-col gap-4">
              <div>
                <Label htmlFor="email" className="mb-2">Email address</Label>
                <TextInput
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  color={!isValidEmail(email) && email ? "failure" : ""}
                />
              </div>
              <Button
                onClick={handleEmailSubmit}
                disabled={isSubmitting || !isValidEmail(email)}
                color="blue"
              >
                {isSubmitting ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>
          ) : (
            <form className="flex flex-col gap-4">
              <div>
                <Label htmlFor="otp" className="mb-2">
                  Enter the 6-digit code sent to {email}
                </Label>
                <TextInput
                  id="otp"
                  type="number"
                  placeholder="••••••"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                />
              </div>
              <Button
                onClick={handleOtpSubmit}
                disabled={otp.length !== 6}
                color="green"
              >
                {isVerifying ? "Verifying..." : "Verify & Sign In"}
              </Button>
              <div className="text-center text-sm text-gray-600">
                {resendTimer > 0 ? (
                  <>Resend OTP in {resendTimer}s</>
                ) : (
                  <button
                    type="button"
                    onClick={handleEmailSubmit}
                    className="text-blue-600 underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </form>
          )}
        </Card>
      </div>
    </main>
  );
}