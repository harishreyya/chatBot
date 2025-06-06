export function html({ email, token, host }: { email: string; token: string; host: string }) {
    return `
      <h1>Sign in to Ask Any ✍️</h1>
      <p>Access exclusive Ask Any. Enter the following OTP code:</p>
      <h2>${token}</h2>
    `
  }
  
  export function text({ email, token, host }: { email: string; token: string; host: string }) {
    return `Sign in to ${host}\n\nOTP: ${token}`
  }
  