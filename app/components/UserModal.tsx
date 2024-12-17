// components/UserModal.tsx
import { Role } from '@prisma/client'
import React, { useState, useEffect } from 'react'

interface User {
  id: string
  name?: string
  email: string
  emailVerified?: Date
  image?: string
  role: Role
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<User>) => Promise<void>
  initialData?: User | null
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'USER' as Role,
    isActive: true,
    image: ''
  })

  const [errors, setErrors] = useState<Partial<Record<keyof User, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email,
        role: initialData.role,
        isActive: initialData.isActive,
        image: initialData.image || ''
      })
    } else {
      // Reset form when opening for new user
      setFormData({
        name: '',
        email: '',
        role: 'USER' as Role,
        isActive: true,
        image: ''
      })
    }
    setErrors({})
  }, [initialData, isOpen])

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof User, string>> = {}

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const submitData = {
        name: formData.name?.trim() || null,
        email: formData.email?.trim(),
        role: formData.role,
        isActive: formData.isActive,
        image: formData.image?.trim() || null
      }

      await onSubmit(submitData)
      onClose()
    } catch (error) {
      console.error('Form submission error:', error)
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'Failed to save user. Please try again.'
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? 'Edit User' : 'Add New User'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email *</label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : ''
              }`}
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value as Role})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="url"
              value={formData.image || ''}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Active</label>
          </div>

          {errors.submit && (
            <div className="text-red-600 text-sm">{errors.submit}</div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Saving...'
                : initialData
                ? 'Update'
                : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserModal
