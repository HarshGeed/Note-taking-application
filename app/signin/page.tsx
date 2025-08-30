'use client'
import Image from 'next/image';
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import leftColImg from '@/public/leftCol.jpg'

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
    <div className="flex min-h-screen bg-gradient-to-tr from-blue-100 via-white to-purple-100">
      {/* Left: Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8">
        <div className="w-full max-w-md bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-8 flex flex-col items-center">
          <h2 className="text-4xl font-extrabold mb-6 text-gray-800 tracking-tight">Sign In</h2>
          <form className="w-full space-y-5" onSubmit={handleSubmit}>
            <input 
              name="email" 
              type="email" 
              placeholder="Email" 
              className="input block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-black" 
              value={form.email} 
              onChange={handleChange} 
              required 
            />
            <div className="flex gap-2">
              <input
                name="otp"
                type="text"
                placeholder="OTP"
                className="input flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-black"
                value={form.otp}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="btn py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition disabled:opacity-60"
                onClick={handleSendOtp}
                disabled={loading || otpSent}
              >
                {otpSent ? 'OTP Sent' : 'Send OTP'}
              </button>
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            {success && <div className="text-green-600 text-sm text-center">{success}</div>}
            <button 
              type="submit" 
              className="btn w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition disabled:opacity-60" 
              disabled={loading || !otpSent}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-sm text-gray-600 mt-4">
            Don't have an account?{' '}
            <a href="/signup" className="text-blue-600 hover:underline">Sign up</a>
          </p>
          <div className="w-full flex items-center my-4">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="mx-2 text-gray-400 text-xs">OR</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>
          <button className="btn w-full py-3 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold flex items-center justify-center gap-2 shadow-sm transition" onClick={() => signIn('google')}>
            <svg className="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.22l6.85-6.85C35.64 2.7 30.18 0 24 0 14.82 0 6.73 5.82 2.69 14.09l7.98 6.19C12.13 13.13 17.56 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.04l7.19 5.59C43.98 37.13 46.1 31.3 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.28a14.5 14.5 0 0 1 0-8.56l-7.98-6.19A23.97 23.97 0 0 0 0 24c0 3.77.9 7.34 2.69 10.47l7.98-6.19z"/><path fill="#EA4335" d="M24 48c6.18 0 11.64-2.05 15.52-5.59l-7.19-5.59c-2.01 1.35-4.6 2.16-8.33 2.16-6.44 0-11.87-3.63-14.33-8.91l-7.98 6.19C6.73 42.18 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
            Sign in with Google
          </button>
        </div>
      </div>
      {/* Right: Image */}
      <div className="hidden md:flex w-1/2 relative">
        <Image src={leftColImg} alt="Signin" fill className="object-cover" priority />
      </div>
    </div>
  );
}

// Add some basic Tailwind CSS classes for .input and .btn in your global styles.
