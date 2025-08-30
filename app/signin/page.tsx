'use client'
import Image from 'next/image';
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import rightColumn from '@/public/right-column.jpg'
import logo from '@/public/logo.png'

export default function SigninPage() {
  const [form, setForm] = useState({ email: '', otp: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async () => {
    setError('');
    setSuccess('');
    if (!form.email) {
      setError('Please enter your email to receive OTP.');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/user/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setSuccess('OTP sent to your email.');
      setOtpSent(true);
    } else setError(data.error || 'Failed to send OTP.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    const res = await signIn('credentials', {
      redirect: false,
      email: form.email,
      otp: form.otp,
    });
    setLoading(false);
    if (res?.error) {
      setError(res.error);
    } else {
      setSuccess('Sign in successful!');
      // Redirect to homepage after successful login
      window.location.href = '/';
    }
  };

  return (
    <div className="h-screen flex bg-white overflow-hidden">
      {/* Left Form Section - takes ~40% of screen on desktop, full width on mobile */}
      <div className="w-full md:w-2/5 p-8 lg:p-12 flex flex-col justify-center bg-white overflow-y-auto">
        
        {/* Logo Section - centered on mobile */}
        <div className="flex items-center justify-center md:justify-start mb-8 mx-4">
          <div className="h-6 w-6 mr-2 flex items-center justify-center">
            <Image src={logo} alt='logo'/>
          </div>
          <span className="text-lg font-semibold text-gray-800">HD</span>
        </div>

        {/* Form - centered on mobile, left-aligned on desktop */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-center max-w-md mx-auto md:mx-4">
          <h1 className="text-3xl font-bold text-gray-900 text-center md:text-left">Sign in</h1>
          <p className="text-gray-500 mt-2 mb-6 text-center md:text-left">
            Welcome back! Sign in to your account
          </p>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              name="email"
              type="email"
              placeholder="jonas_kahnwald@gmail.com"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* OTP Field (shown after OTP is sent) */}
          {otpSent && (
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">OTP</label>
              <input
                name="otp"
                type="text"
                placeholder="Enter OTP"
                value={form.otp}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          {/* Error/Success Messages */}
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          {success && <div className="text-green-600 text-sm mb-4">{success}</div>}

          {/* Button */}
          {!otpSent ? (
            <button 
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Get OTP'}
            </button>
          ) : (
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          )}

          {/* OR divider */}
          <div className="w-full flex items-center my-4">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="mx-2 text-gray-400 text-xs">OR</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          {/* Google Sign In */}
          <button 
            type="button"
            onClick={() => signIn('google')}
            className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50 transition flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <g>
                <path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.22l6.85-6.85C35.64 2.7 30.18 0 24 0 14.82 0 6.73 5.82 2.69 14.09l7.98 6.19C12.13 13.13 17.56 9.5 24 9.5z"/>
                <path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.04l7.19 5.59C43.98 37.13 46.1 31.3 46.1 24.55z"/>
                <path fill="#FBBC05" d="M10.67 28.28a14.5 14.5 0 0 1 0-8.56l-7.98-6.19A23.97 23.97 0 0 0 0 24c0 3.77.9 7.34 2.69 10.47l7.98-6.19z"/>
                <path fill="#EA4335" d="M24 48c6.18 0 11.64-2.05 15.52-5.59l-7.19-5.59c-2.01 1.35-4.6 2.16-8.33 2.16-6.44 0-11.87-3.63-14.33-8.91l-7.98 6.19C6.73 42.18 14.82 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </g>
            </svg>
            Sign in with Google
          </button>

          {/* Sign up link */}
          <p className="mt-4 text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </div>

      {/* Right Image Section - takes ~60% of screen, hidden on mobile */}
      <div className="hidden md:block w-3/5 relative overflow-hidden my-2 rounded-2xl mx-2">
        <Image
          src={rightColumn}
          alt="Signin illustration"
          width={1000}
          height={800}
          className="w-full h-screen object-cover"
          priority
        />
      </div>
    </div>
  );
}

// Add some basic Tailwind CSS classes for .input and .btn in your global styles.
