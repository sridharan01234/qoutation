'use client'

import { useState, useEffect } from 'react'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import UserModal from './UserModal'
import React from 'react';

// Helper functions
const getRoleBadgeColor = (role: string): string => {
  switch (role?.toUpperCase()) {
    case 'ADMIN':
      return 'bg-red-100 text-red-800'
    case 'MANAGER':
      return 'bg-blue-100 text-blue-800'
    case 'SUPERVISOR':
      return 'bg-purple-100 text-purple-800'
    case 'TEAM_LEAD':
      return 'bg-green-100 text-green-800'
    case 'ANALYST':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const CustomersOverview = () => {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { id: 'name', label: 'Name', visible: true },
    { id: 'email', label: 'Email', visible: true },
    { id: 'role', label: 'Role', visible: true },
    { id: 'status', label: 'Status', visible: true },
    { id: 'lastLogin', label: 'Last Login', visible: true },
    { id: 'department', label: 'Department', visible: true },
    { id: 'location', label: 'Location', visible: true },
    { id: 'phoneNumber', label: 'Phone', visible: false },
    { id: 'createdAt', label: 'Created At', visible: false },
    { id: 'updatedAt', label: 'Updated At', visible: false }
  ])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users')
      if (!response.ok) throw new Error('Failed to fetch users')
      const data = await response.json()
      // Make sure we're setting an array of users
      setUsers(data.users || [])
      setError(null)
    } catch (err) {
      setError('Error loading users')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user =>
    user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )


  const handleAddUser = async (userData) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) throw new Error('Failed to add user')
      
      await fetchUsers()
      setIsModalOpen(false)
    } catch (err) {
      console.error('Error adding user:', err)
      throw err
    }
  }
// components/CustomerOverview.tsx
const handleUpdateUser = async (id: string, data: any) => {
  try {
    console.log('Updating user:', { id, data })

    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Failed to update user')
    }

    await fetchUsers() // Refresh the user list
    return result.user
  } catch (error) {
    console.error('Error updating user:', error)
    throw new Error(error.message || 'Failed to update user')
  }
}

const handleDeleteUser = async (id: string) => {
  if (!confirm('Are you sure you want to delete this user?')) {
    return
  }

  try {
    const response = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Failed to delete user')
    }

    await fetchUsers() // Refresh the user list
  } catch (error) {
    console.error('Error deleting user:', error)
    throw new Error(error.message || 'Failed to delete user')
  }
}

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  const toggleRowExpansion = (userId: string) => {
    const newExpandedRows = new Set(expandedRows)
    if (expandedRows.has(userId)) {
      newExpandedRows.delete(userId)
    } else {
      newExpandedRows.add(userId)
    }
    setExpandedRows(newExpandedRows)
  }

  const toggleColumn = (columnId: string) => {
    setColumns(columns.map(col => 
      col.id === columnId ? { ...col, visible: !col.visible } : col
    ))
  }

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-6 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Customer Overview</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add User
          </button>
        </div>

        {/* Search and Column Management */}
        <div className="flex justify-between items-center gap-4">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          {/* Column Manager Dropdown */}
          <div className="relative group">
            <button className="px-4 py-2 border border-gray-300 rounded-md">
              Manage Columns
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg hidden group-hover:block z-10">
              {columns.map(column => (
                <label key={column.id} className="flex items-center px-4 py-2 hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={column.visible}
                    onChange={() => toggleColumn(column.id)}
                    className="mr-2"
                  />
                  {column.label}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-10 px-3 py-3"></th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <React.Fragment key={user.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-3 py-4">
                    <button
                      onClick={() => toggleRowExpansion(user.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {expandedRows.has(user.id) ? (
                        <ChevronDownIcon className="h-5 w-5" />
                      ) : (
                        <ChevronRightIcon className="h-5 w-5" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {user.image ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={user.image}
                            alt={user.name || ''}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 font-medium">
                              {user.name?.[0] || 'U'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name || 'Unnamed User'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedUser(user)
                        setIsModalOpen(true)
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                {expandedRows.has(user.id) && (
                  <tr key={`${user.id}-expanded`}>
                    <td colSpan={6}>
                      <div className="px-8 py-4 bg-gray-50">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Created</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {new Date(user.updatedAt).toLocaleDateString()}
                            </dd>
                          </div>
                          {user.emailVerified && (
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Email Verified</dt>
                              <dd className="mt-1 text-sm text-gray-900">
                                {new Date(user.emailVerified).toLocaleDateString()}
                              </dd>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedUser(null)
        }}
        onSubmit={async (data) => {
          if (selectedUser?.id) {
            await handleUpdateUser(selectedUser.id, data)
          } else {
            await handleAddUser(data)
          }
        }}
        initialData={selectedUser}
      />
    </div>
  )
}

export default CustomersOverview