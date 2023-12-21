import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle'
import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkedAlt,
    FaMapMarkerAlt,
    FaParking,
    FaShare
} from 'react-icons/fa'
// https://sabe.io/blog/javascript-format-numbers-commas#:~:text=The%20best%20way%20to%20format,format%20the%20number%20with%20commas.

const Listing = () => {
    SwiperCore.use([Navigation])
    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(null)
    const [error, setError] = useState(false)
    const [copied, setCopied] = useState(false)
    const params = useParams()

    useEffect(() => {
        const fetchingListing = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/listing/get/${params.listingId}`)
                const data = await res.json()

                if (data.success === false) {
                    setError(true)
                    setLoading(false)
                    return
                }

                setListing(data)
                setLoading(false)
                setError(false)

            } catch (error) {
                setError(true)
                setLoading(false)
            }
        }

        fetchingListing()

    }, [params.listingId])

    return (
        <main>
            {loading && (
                <p className='text-center my-7 text-2xl'>Loading...</p>
            )}
            {error && (
                <p className="text-center my-7 text-2xl">Something went wrong!</p>
            )}
            {listing && !loading && !error && (
                <div>
                    <Swiper navigation>
                        {listing.imageUrls.map((url) => (
                            <SwiperSlide key={url}>
                                <div className="h-[450px]"
                                    style={{
                                        background: `url(${url}) center no-repeat`,
                                        backgroundSize: 'cover'
                                    }}
                                ></div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    {/* Copied current url to share */}
                    <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 hover:bg-slate-800 cursor-pointer">
                        <FaShare
                            className='text-slate-500'
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href) // copied current url
                                setCopied(true)
                                // clean up function
                                setTimeout(() => {
                                    setCopied(false)
                                }, 2000);
                            }}
                        />
                    </div>
                    {copied && (
                        <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-800 text-white p-2">
                            Link Copied!
                        </p>
                    )}
                    <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
                        {/* Conditional rendering based on listing type (rent or offer) */}
                        <p className="text-2xl font-semibold">
                            {listing.name} - ${' '}
                            {listing.offer
                                ? listing.discountPrice.toLocaleString('en-US')
                                : listing.regularPrice.toLocaleString('en-US')
                            }
                            {listing.type === 'rent' && ' / month'}
                        </p>
                        <p className="flex items-center mt-3 gap-2 text-slate-800 text-sm">
                            <FaMapMarkerAlt className='text-green-800' />
                            {listing.address}
                        </p>
                        {/* Conditional rendering for type='rent' or 'offer' */}
                        <div className="flex gap-4">
                            <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md hover:cursor-pointer hover:opacity-90">
                                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                            </p>
                            {listing.offer && (
                                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md hover:cursor-pointer hover:opacity-90">
                                    <span className="text-yellow-200">${(+listing.regularPrice - +listing.discountPrice)} Discount</span>
                                </p>
                            )}
                        </div>
                        <p className="text-slate-800 mt-5">
                            <span className="font-semibold text-black">Description - </span>
                            {listing.description}
                        </p>
                        {/* Conditional rendering for beds, baths, parking spot and furnished */}
                        <ul className="text-green-900 mt-4 font-semibold text-md flex flex-wrap items-center gap-4 sm:gap-6">
                            <li className="flex items-center gap-1 whitespace-nowrap">
                                <FaBed className='text-lg' />
                                {listing.bedrooms > 1
                                    ? `${listing.bedrooms} beds`
                                    : `${listing.bedrooms} bed`
                                }
                            </li>
                            <li className="flex items-center gap-1 whitespace-nowrap">
                                <FaBath className='text-lg' />
                                {listing.bathrooms > 1
                                    ? `${listing.bathrooms} baths`
                                    : `${listing.bathrooms} bath`
                                }
                            </li>
                            <li className="flex items-center gap-1 whitespace-nowrap">
                                <FaParking className='text-lg' />
                                {listing.parking
                                    ? `Parking Spot`
                                    : `No Parking`
                                }
                            </li>
                            <li className="flex items-center gap-1 whitespace-nowrap">
                                <FaChair className='text-lg' />
                                {listing.furnished
                                    ? `Furnished`
                                    : `Unfurnished`
                                }
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </main>
    )
}

export default Listing
