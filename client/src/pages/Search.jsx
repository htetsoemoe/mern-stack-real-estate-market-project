import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ListingItem from '../components/ListingItem'

const Search = () => {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [listings, setListings] = useState([])
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'created_at',
        order: 'desc',
    })

    useEffect(() => {
        // If url has request query parameters, get all from url params
        const urlParams = new URLSearchParams(window.location.search)

        const searchTermFromUrl = urlParams.get('searchTerm')
        const typeFromUrl = urlParams.get('type')
        const parkingFromUrl = urlParams.get('parking')
        const furnishedFromUrl = urlParams.get('furnished')
        const offerFromUrl = urlParams.get('offer')
        const sortFromUrl = urlParams.get('sort')
        const orderFromUrl = urlParams.get('order')

        // set all to SidebarData Object
        if (
            searchTermFromUrl ||
            typeFromUrl ||
            parkingFromUrl ||
            furnishedFromUrl ||
            offerFromUrl ||
            sortFromUrl ||
            orderFromUrl
        ) {
            setSidebarData({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                parking: parkingFromUrl === 'true' ? true : false,
                furnished: furnishedFromUrl === 'true' ? true : false,
                offer: offerFromUrl === 'true' ? true : false,
                sort: sortFromUrl || 'created_at',
                order: orderFromUrl || 'desc',
            })
        }

        // fetch listings using 
        const fetchListings = async () => {
            setLoading(true)

            const searchQuery = urlParams.toString() // searchTerm= (or) searchTerm=cottage (or) http://localhost:5173/search?searchTerm=&type=rent&parking=false&furnished=false&offer=true&sort=created_at&order=desc
            // There's no query param get all listings, or get filter query results based on query params
            const listings = await fetch(`/api/listing/get?${searchQuery}`)
            const data = await listings.json()
            setListings(data)

            setLoading(false)
            console.log(data);
        }

        fetchListings()

    }, [window.location.search])

    // handler for inputs change
    const handlerInputsChange = (event) => {
        if (
            event.target.id === 'all' ||
            event.target.id === 'rent' ||
            event.target.id === 'sale'
        ) {
            setSidebarData({ ...sidebarData, type: event.target.id })
        }

        if (event.target.id === 'searchTerm') {
            setSidebarData({ ...sidebarData, searchTerm: event.target.value })
        }

        if (
            event.target.id === 'parking' ||
            event.target.id === 'furnished' ||
            event.target.id === 'offer'
        ) {
            setSidebarData({
                ...sidebarData,
                [event.target.id]: event.target.checked || event.target.checked === 'true' ? true : false,
            })
        }

        if (event.target.id === 'sort_order') {
            const sort = event.target.value.split('_')[0] || 'created_at'
            const order = event.target.value.split('_')[1] || 'desc'

            setSidebarData({ ...sidebarData, sort, order })
        }
    }

    // handler for form submit
    const handlerFormSubmit = (event) => {
        event.preventDefault()

        // e.g: http://localhost:5173/search?searchTerm=&type=rent&parking=false&furnished=false&offer=true&sort=created_at&order=desc
        const urlParams = new URLSearchParams()
        urlParams.set('searchTerm', sidebarData.searchTerm)
        urlParams.set('type', sidebarData.type)
        urlParams.set('parking', sidebarData.parking)
        urlParams.set('furnished', sidebarData.furnished)
        urlParams.set('offer', sidebarData.offer)
        urlParams.set('sort', sidebarData.sort)
        urlParams.set('order', sidebarData.order)

        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }

    return (
        <div className='flex flex-col md:flex-row'>
            <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
                <form
                    onSubmit={handlerFormSubmit}
                    className="flex flex-col gap-8">
                    <div className="flex items-center gap-3">
                        <label
                            htmlFor="searchTerm"
                            className="whitespace-nowrap font-semibold">
                            Search Term:
                        </label>
                        <input
                            type="text"
                            id='searchTerm'
                            onChange={handlerInputsChange}
                            placeholder='Search...'
                            className="border rounded-lg p-3 w-full focus:outline-none" />
                    </div>
                    <div className="flex gap-3 flex-wrap items-center">
                        <label htmlFor="all" className="font-semibold">Type:</label>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                name="all" id="all"
                                onChange={handlerInputsChange}
                                checked={sidebarData.type === 'all'}
                                className='w-5' />
                            <span>Rent & Sale</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                name="rent" id="rent"
                                onChange={handlerInputsChange}
                                checked={sidebarData.type === 'rent'}
                                className='w-5' />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                name="sale" id="sale"
                                onChange={handlerInputsChange}
                                checked={sidebarData.type === 'sale'}
                                className='w-5' />
                            <span>Sale</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                name="offer" id="offer"
                                onChange={handlerInputsChange}
                                className='w-5' />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex gap-3 flex-wrap items-center">
                        <label htmlFor="parking" className="font-semibold">Amenities</label>
                        <div className="flex gap-3">
                            <input
                                type="checkbox"
                                name="parking" id="parking"
                                onChange={handlerInputsChange}
                                checked={sidebarData.parking}
                                className='w-5' />
                            <span>Parking</span>
                        </div>
                        <div className="flex gap-3">
                            <input
                                type="checkbox"
                                name="furnished" id="furnished"
                                onChange={handlerInputsChange}
                                checked={sidebarData.furnished}
                                className='w-5' />
                            <span>Furnished</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <label htmlFor="sort_order" className="font-semibold">Sort:</label>
                        <select name="sort_order" id="sort_order"
                            defaultValue={'created_at_desc'}
                            className='border rounded-lg p-3 focus:outline-none'>
                            <option value="regularPrice_desc">Price hight to low</option>
                            <option value="regularPrice_asc">Price low to height</option>
                            <option value="createdAt_desc">Latest</option>
                            <option value="createdAt_asc">Oldest</option>
                        </select>
                    </div>
                    <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
                        Search
                    </button>
                </form>
            </div>
            <div className="">
                <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
                    Listing Result:
                </h1>
                <div className="p-7 flex flex-wrap gap-4">
                    {!loading && listings.length === 0 && (
                        <p className="text-xl text-slate-700">No Listing Found!</p>
                    )}
                    {loading && (
                        <p className="text-xl text-slate-700 text-center w-full">
                            Loading...
                        </p>
                    )}
                    {!loading && listings &&
                        listings.map((listing) => (
                            <ListingItem key={listing._id} listing={listing} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Search
