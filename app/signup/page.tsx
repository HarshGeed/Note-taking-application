'use client'
import Image from 'next/image';
import React, { useState } from 'react';
import leftColImg from '@/public/leftCol.jpg'

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', dob: '', otp: '' });
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
    const res = await fetch('/api/user/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) setSuccess('Signup successful!');
    else setError(data.error || 'Signup failed.');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-tr from-blue-100 via-white to-purple-100">
      
      {/* Left: Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8">
        <div className="w-full max-w-md bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-8 flex flex-col items-center">
          <h2 className="text-4xl font-extrabold mb-6 text-gray-800 tracking-tight">Sign Up</h2>
          <form className="w-full space-y-5" onSubmit={handleSubmit}>
            <input
              name="name"
              type="text"
              placeholder="Name"
              className="input block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-black"
              value={form.name}
              onChange={handleChange}
              required
              // disabled={!otpSent}
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="input block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-black"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              name="dob"
              type="date"
              placeholder="Date of Birth"
              className="input block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-black"
              value={form.dob}
              onChange={handleChange}
              required
              // disabled={!otpSent}
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
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>
          <p className="text-sm text-gray-600 mt-4">
            Already have an account?{' '}
            <a href="/signin" className="text-blue-600 hover:underline">Sign in</a>
          </p>
        </div>
      </div>
      {/* Right: Image */}
      <div className="hidden md:flex w-1/2 relative">
        <Image src={leftColImg} alt="Signup" fill className="object-cover" priority />
      </div>
    </div>
  );
}

// Add some basic Tailwind CSS classes for .input and .btn in your global styles.
