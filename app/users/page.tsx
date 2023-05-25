'use client'
import { signOut } from 'next-auth/react'

const Users = () => {
  return (
    <div>
      Hello Users
      <button
        onClick={() => {
          signOut()
        }}>
        Logout
      </button>
    </div>
  )
}

export default Users
