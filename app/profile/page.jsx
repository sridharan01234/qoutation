// app/profile/page.jsx
"use client";

import { useSession } from "next-auth/react";
import { useState, useRef } from "react";
import { default as NextImage } from 'next/image'
import { updateProfile, updatePassword, uploadAvatar } from "@/utils/api";


export default function ProfileSettings() {
    const { data: session, update: updateSession } = useSession()
    const [activeTab, setActiveTab] = useState('personal')
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState(null)
    const fileInputRef = useRef(null)
  
    const [formData, setFormData] = useState({
      name: session?.user?.name || '',
      email: session?.user?.email || '',
      phone: session?.user?.phone || '',
      company: session?.user?.company || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      emailNotifications: session?.user?.emailNotifications || false,
      marketingEmails: session?.user?.marketingEmails || false
    })
  
    const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  
    const handleAvatarClick = () => {
      fileInputRef.current?.click()
    }
  
    const handleAvatarChange = async (e) => {
      const file = e.target.files?.[0]
      if (!file) return
  
      try {
        setLoading(true)
        const result = await uploadAvatar(file)
        await updateSession({ image: result.imageUrl })
        setToast({ message: 'Avatar updated successfully', type: 'success' })
      } catch (error) {
        setToast({ message: error.message, type: 'error' })
      } finally {
        setLoading(false)
      }
    }
  
    const handlePersonalSubmit = async (e) => {
      e.preventDefault()
      setLoading(true)
      try {
        await updateProfile({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          emailNotifications: formData.emailNotifications,
          marketingEmails: formData.marketingEmails,
        })
        await updateSession()
        setToast({ message: 'Profile updated successfully', type: 'success' })
      } catch (error) {
        setToast({ message: error.message, type: 'error' })
      } finally {
        setLoading(false)
      }
    }
  
    const handlePasswordSubmit = async (e) => {
      e.preventDefault()
      if (formData.newPassword !== formData.confirmPassword) {
        setToast({ message: 'Passwords do not match', type: 'error' })
        return
      }
  
      setLoading(true)
      try {
        await updatePassword({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        })
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }))
        setToast({ message: 'Password updated successfully', type: 'success' })
      } catch (error) {
        setToast({ message: error.message, type: 'error' })
      } finally {
        setLoading(false)
      }
    }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Add your API call here to update user profile
      // await updateProfile(formData)
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
              {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              Profile Settings
            </h1>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {["personal", "security", "preferences"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-6 text-sm font-medium ${
                    activeTab === tab
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === "personal" && (
              <form onSubmit={handleSubmit}>

<input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleAvatarChange}
      />
                {/* Profile Picture */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden">
                      {session?.user?.image ? (
                        <NextImage 
                          src={session.user.image}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                          <span className="text-2xl text-gray-600">
                            {session?.user?.name?.[0] || "U"}
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Change Photo
                    </button>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </form>
            )}

            {activeTab === "security" && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </form>
            )}

            {activeTab === "preferences" && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">
                        Email Notifications
                      </h3>
                      <p className="text-sm text-gray-500">
                        Receive notifications about your account activity
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="emailNotifications"
                        checked={formData.emailNotifications}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">
                        Marketing Emails
                      </h3>
                      <p className="text-sm text-gray-500">
                        Receive emails about new features and updates
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="marketingEmails"
                        checked={formData.marketingEmails}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </form>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
