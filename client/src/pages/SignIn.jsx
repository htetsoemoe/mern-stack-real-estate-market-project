import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Signin = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Sign In</h1>

      <div className="flex gap-3 mt-4">
        <p>Create new account</p>
        <Link to={'/sign-up'}>
          <span className="text-blue-700">Sign Up</span>
        </Link>
      </div>
    </div>
    
  )
}

export default Signin
