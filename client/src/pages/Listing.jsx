import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle'

const Listing = () => {
    SwiperCore.use([Navigation])
    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(null)
    const [error, setError] = useState(false)
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
                </div>
            )}
        </main>
    )
}

export default Listing
