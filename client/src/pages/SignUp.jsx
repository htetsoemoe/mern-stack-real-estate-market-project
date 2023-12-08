import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const SignUp = () => {
  const [formData, setFormData] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setLoading(true)
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      console.log(data)

      if (data.success === false) {
        setLoading(false)
        setError(data.message)
        return
      }

      setLoading(false)
      setError(null)
      navigate('/sign-in')

    } catch (error) {
      setLoading(false)
      setError(error.message)
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className="text-3xl font-semibold text-center my-7">Sign Up</h1>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-4'
      >
        <input
          onChange={handleChange}
          className='border p-3 rounded-lg focus:outline-none'
          type="text" name="username" id="username" placeholder='Username' />
        <input
          onChange={handleChange}
          className='border p-3 rounded-lg focus:outline-none'
          type="email" name="email" id="email" placeholder='Email' />
        <input
          onChange={handleChange}
          className='border p-3 rounded-lg focus:outline-none'
          type="password" name="password" id="password" placeholder='Password' />

        <button
          disabled={loading}
          className='bg-slate-700 text-white uppercase p-3 rounded-lg hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
      </form>
      <div className="flex gap-3 mt-4">
        <p>Have an account?</p>
        <Link to={'/sign-in'}>
          <span className="text-blue-700">Sign In</span>
        </Link>
      </div>
      {error && <p className='text-red-600 mt-5'>{error}</p>}
    </div>
  )
}

export default SignUp