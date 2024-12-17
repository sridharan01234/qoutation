// utils/api.js
export async function updateProfile(data) {
    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      throw new Error('Failed to update profile')
    }
    
    return response.json()
  }
  
  export async function updatePassword(data) {
    const response = await fetch('/api/profile/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      throw new Error('Failed to update password')
    }
    
    return response.json()
  }
  
  export async function uploadAvatar(file) {
    const formData = new FormData()
    formData.append('file', file)
  
    const response = await fetch('/api/profile/avatar', {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      throw new Error('Failed to upload avatar')
    }
    
    return response.json()
  }
  