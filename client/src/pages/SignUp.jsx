import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const SignUp = () => {
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className="text-3xl font-semibold text-center my-7">Sign Up</h1>
      <form
        className='flex flex-col gap-4'
      >
        <input
          className='border p-3 rounded-lg focus:outline-none'
          type="text" name="username" id="username" placeholder='Username' />
        <input
          className='border p-3 rounded-lg focus:outline-none'
          type="email" name="email" id="email" placeholder='Email' />
        <input
          className='border p-3 rounded-lg focus:outline-none'
          type="password" name="password" id="password" placeholder='Password' />

        <button
          className='bg-slate-700 text-white uppercase p-3 rounded-lg hover:opacity-95 disabled:opacity-80'>
          Sign Up
        </button>
      </form>
      <div className="flex gap-3 mt-4">
        <p>Have an account?</p>
        <Link to={'/sign-in'}>
          <span className="text-blue-700">Sign In</span>
        </Link>
      </div>
    </div>
  )
}

export default SignUp

