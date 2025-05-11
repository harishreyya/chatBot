export function html({ email, token, host }: { email: string; token: string; host: string }) {
    return `
      <h1>Sign in to ${host}</h1>
      <p>Enter the following OTP code:</p>
      <h2>${token}</h2>
    `
  }
  
  export function text({ email, token, host }: { email: string; token: string; host: string }) {
    return `Sign in to ${host}\n\nOTP: ${token}`
  }
  