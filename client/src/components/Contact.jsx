import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Contact = ({ listing }) => {

    const [landLord, setLandLord] = useState(null)
    const [message, setMessage] = useState('')

    const onChangeHandler = (event) => {
        setMessage(event.target.value)
    }

    useEffect(() => {
        const fetchLandLord = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`)
                const data = await res.json()
                setLandLord(data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchLandLord()
    }, [listing.userRef])

    return (
        <>
            {landLord && (
                <div className="flex flex-col gap-2 mt-3">
                    <p>
                        Contact <span className="font-semibold">{landLord.username}</span>{' '}
                        for{' '}
                        <span className="font-semibold">{listing.name.toLowerCase()}</span>
                    </p>
                    <textarea
                        onChange={onChangeHandler}
                        value={message}
                        className='w-full border p-3 rounded-lg focus:outline-none'
                        placeholder='Enter your message here...'
                        name="message" id="message" cols="30" rows="5">
                    </textarea>
                    <Link
                        to={`mailto:${landLord.email}?subject=Regarding${listing.name}&body=${message}`}
                        className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
                    >
                        Send Message
                    </Link>
                </div>
            )}
        </>
    )
}

export default Contact
