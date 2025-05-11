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
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <Toaster />

       <div className="absolute inset-0 flex flex-col w-full h-full"
       style={{ filter: "blur(0.1px) brightness(0.5)" }}
        >
  
  <div className="flex w-full h-1/3">
    <img src="https://d3tx3wg2jy0sui.cloudfront.net/e1ed719a8b7e4dd4903782cb9986535e.png" className="w-1/3 h-full object-cover filter blur-3xl brightness-50" />
    <img src="https://d3tx3wg2jy0sui.cloudfront.net/cb292bd0098a4c80b7a7a37fa1cafd36.png" className="w-1/3 h-full object-cover filter blur-3xl brightness-50" />
    <img src="https://d3tx3wg2jy0sui.cloudfront.net/66892a9fc70e49d7aeb75e786d4d2d4b.png" className="w-1/3 h-full object-cover filter blur-3xl brightness-50" />
  </div>

 
  <div className="flex w-full h-1/3">
    <img src="https://d3tx3wg2jy0sui.cloudfront.net/bb2efd396b6846fc928e9665c1f83c93.png" className="w-2/3 h-full object-cover filter blur-3xl brightness-50" />
    <img src="https://d3tx3wg2jy0sui.cloudfront.net/c597072e455246eb806184a650027ef8.png" className="w-1/3 h-full object-cover filter blur-3xl brightness-50" />
  </div>
 
  <div className="flex w-full h-1/3">
    <img src="https://d3tx3wg2jy0sui.cloudfront.net/c489a99be02a484ba2278b03ed808dfe.png" className="w-1/3 h-full object-cover filter blur-3xl brightness-50" />
    <img src="https://d3tx3wg2jy0sui.cloudfront.net/ea78eee557a8491ab48071f08a97353f.png" className="w-1/3 h-full object-cover filter blur-3xl brightness-50" />
    <img src="https://d3tx3wg2jy0sui.cloudfront.net/2f2b050e5a274668849501a03175adc8.png" className="w-1/3 h-full object-cover filter blur-3xl brightness-50" />
  </div>
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
                  className={`${isSubmitting || !isValidEmail(email) ? 'cursor-wait' : 'cursor-pointer'}`}
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
                disabled={otp.length !== 6 || isVerifying}
                color="green"
                className={`${otp.length !== 6 || isVerifying ? 'cursor-wait' : 'cursor-pointer'}`}
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