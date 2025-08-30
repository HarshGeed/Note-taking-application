'use client'
import Image from 'next/image';
import React, { useState } from 'react';
import rightColumn from '@/public/right-column.jpg'
import logo from '@/public/logo.png'

export default function SignUpPage() {
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
    <div className="h-screen flex bg-white overflow-hidden">
      {/* Left Form Section - takes ~40% of screen */}
      <div className="w-2/5 p-8 lg:p-12 flex flex-col justify-center bg-white overflow-y-auto">
        
        {/* Logo Section */}
        <div className="flex items-center mb-8 mx-4">
          <div className="h-6 w-6 mr-2 flex items-center justify-center">
            <Image src={logo} alt='logo'/>
          </div>
          <span className="text-lg font-semibold text-gray-800">HD</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-center max-w-md mx-4">
          <h1 className="text-3xl font-bold text-gray-900">Sign up</h1>
          <p className="text-gray-500 mt-2 mb-6 ">
            Sign up to enjoy the feature of HD
          </p>

          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Your Name</label>
            <input
              name="name"
              type="text"
              placeholder="Jonas Khanwald"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              required
            />
          </div>

          {/* DOB */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Date of Birth</label>
            <input
              name="dob"
              type="date"
              value={form.dob}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              required
            />
          </div>

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
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          )}

          {/* Sign in link */}
          <p className="mt-4 text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/signin" className="text-blue-500 hover:underline">
              Sign in
            </a>
          </p>
        </form>
      </div>

      {/* Right Image Section - takes ~60% of screen */}
      <div className="w-3/5 relative overflow-hidden my-2 rounded-2xl mx-2">
        <Image
          src={rightColumn}
          alt="Signup illustration"
          width={1000}
          height={800}
          className="w-full h-screen object-cover"
          priority
        />
      </div>
    </div>
  );
}
