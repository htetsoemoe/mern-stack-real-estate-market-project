import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
import { useSelector } from 'react-redux'

const Header = () => {
    const { currentUser } = useSelector((state) => state.user)
    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate()

    // User search with 'searcTerm' appends to url
    const formSubmitHandler = (event) => {
        event.preventDefault()
        const urlParams = new URLSearchParams(window.location.search) // Returns the Location object's URL's query (includes leading "?" if non-empty).
        urlParams.set('searchTerm', searchTerm)
        const searchQuery = urlParams.toString() // 'searchTerm=rent'
        navigate(`/search?${searchQuery}`) // http://localhost:5173/search?searchTerm=modern
    }

    // If user change 'searchTerm' or other prams on url, bind 'searchTerm' to input field
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl)
        }
    }, [window.location.search])

    return (
        <header className='bg-slate-200 shadow-md'>
            <div className="flex justify-between items-center max-w-6xl mx-auto p-4">
                <Link to='/'>
                    <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
                        <span className="text-slate-500">T&H</span>&nbsp;
                        <span className="text-slate-700">Estate</span>
                    </h1>
                </Link>
                <form
                    onSubmit={formSubmitHandler}
                    className='bg-slate-100 p-3 rounded-lg flex items-center'>
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        type='text'
                        placeholder='Search...'
                        className='bg-transparent focus:outline-none w-24 sm:w-64'
                    />
                    <button>
                        <FaSearch className='text-slate-600' />
                    </button>
                </form>
                <ul className='flex gap-6'>
                    <Link to='/'>
                        <li className="hidden sm:inline text-slate-700 hover:underline">
                            Home
                        </li>
                    </Link>
                    <Link to='/about'>
                        <li className="hidden sm:inline text-slate-700 hover:underline">
                            About
                        </li>
                    </Link>
                    {currentUser ? (
                        <Link to='/profile'>
                            <div className="flex items-center gap-3">
                                <img
                                    className='rounded-full h-7 w-7 object-cover'
                                    src={currentUser.avatar} alt="profile" />
                                <span className="hidden sm:inline text-slate-700">
                                    {currentUser.username}
                                </span>
                            </div>
                        </Link>
                    ) : (
                        <Link to='/sign-in'>
                            <li className="text-slate-700 hover:underline">
                                Sign In
                            </li>
                        </Link>
                    )}
                </ul>
            </div>
        </header>
    )
}

export default Header
