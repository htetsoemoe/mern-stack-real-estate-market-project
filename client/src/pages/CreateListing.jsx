import React, { useState } from 'react'
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CreateListing = () => {
    const [files, setFiles] = useState([])
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
    })
    const [imageUploadError, setImageUploadError] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const { currentUser } = useSelector((state) => state.user)
    const navigate = useNavigate()

    console.log(formData);

    const handleImageSubmit = (event) => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true)
            setImageUploadError(false)
            const promises = []

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]))
            }

            Promise.all(promises)   // The Promise.all() static method takes an iterable of promises as input and returns a single Promise.
                .then((urls) => {   // if all promises are resolved
                    setFormData({
                        ...formData,
                        imageUrls: formData.imageUrls.concat(urls),
                    })
                    setImageUploadError(false)
                    setUploading(false)
                })
                .catch((err) => {  // if one of the promise is rejected
                    setImageUploadError('Image upload failed (2mb max per image')
                    setUploading(false)
                })
        } else {
            setImageUploadError('You can only upload 6 images per listing!')
            setUploading(false)
        }
    }

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app)
            const fileName = new Date().getTime() + file.name
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file)

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    reject(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                        resolve(downloadUrl)
                    })
                }
            )
        })
    }

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((url, i) => i !== index),
        })
    }

    const handleInputChange = (event) => {
        // check type (type property in formData) is 'sale' or 'rent'
        if (event.target.id === 'sale' || event.target.id === 'rent') {
            setFormData({
                ...formData,
                type: event.target.id,
            })
        }

        // check check value 'true' or 'false' (checkbox)
        if (event.target.id === 'parking' || event.target.id === 'furnished' || event.target.id === 'offer') {
            setFormData({
                ...formData,
                [event.target.id]: event.target.checked
            })
        }

        // check input type
        if (event.target.type === 'number' || event.target.type === 'text' || event.target.type === 'textarea') {
            setFormData({
                ...formData,
                [event.target.id]: event.target.value
            })
        }
    }

    const handleFormSubmit = async (event) => {
        event.preventDefault()
        try {
            if (formData.imageUrls.length < 1) {
                return setError('You must upload at least one image!')
            }
            if (+formData.regularPrice < +formData.discountPrice) { // + sign converts 'string' to 'number' if required
                return setError('Discount price must be lower than regular price!')
            }

            setLoading(true)
            setError(false)

            const res = await fetch('/api/listing/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,   // OneToMany Relationship (One User Many Listings)
                })
            })

            const data = await res.json()
            setLoading(false)

            if (data.success === 'false') {
                setError(data.message)
            }

            navigate(`/listing/${data._id}`)

        } catch (error) {
            setError(error.message)
            setLoading(false)
        }
    }

    return (
        <main className='p-3 max-w-5xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>
                Create a Listing
            </h1>
            <form
                onSubmit={handleFormSubmit}
                className='flex flex-col sm:flex-row gap-5'>
                <div className='flex flex-col gap-4 flex-1'>
                    <input
                        type='text'
                        placeholder='Name'
                        className='border p-3 rounded-lg focus:outline-none'
                        id='name'
                        maxLength='62'
                        minLength='10'
                        required
                        onChange={handleInputChange}
                        value={formData.name}
                    />
                    <textarea
                        type='text'
                        placeholder='Description'
                        className='border p-3 rounded-lg focus:outline-none h-52'
                        id='description'
                        required
                        onChange={handleInputChange}
                        value={formData.description}
                    />
                    <textarea
                        type='text'
                        placeholder='Address'
                        className='border p-3 rounded-lg focus:outline-none'
                        id='address'
                        required
                        onChange={handleInputChange}
                        value={formData.address}
                    />
                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='sale' className='w-5'
                                onChange={handleInputChange}
                                checked={formData.type === 'sale'}
                            />
                            <span>Sale</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='rent' className='w-5'
                                onChange={handleInputChange}
                                checked={formData.type === 'rent'}
                            />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='parking' className='w-5'
                                onChange={handleInputChange}
                                checked={formData.parking}
                            />
                            <span>Parking Spot</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='furnished' className='w-5'
                                onChange={handleInputChange}
                                checked={formData.furnished}
                            />
                            <span>Furnished</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='offer' className='w-5'
                                onChange={handleInputChange}
                                checked={formData.offer}
                            />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-6'>
                        <div className='flex items-center gap-2'>
                            <input
                                type='number'
                                id='bedrooms'
                                min='1'
                                max='10'
                                required
                                className='p-3 border border-gray-300 rounded-lg focus:outline-none'
                                onChange={handleInputChange}
                                value={formData.bedrooms}
                            />
                            <p>Beds</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input
                                type='number'
                                id='bathrooms'
                                min='1'
                                max='10'
                                required
                                className='p-3 border border-gray-300 rounded-lg focus:outline-none'
                                onChange={handleInputChange}
                                value={formData.bathrooms}
                            />
                            <p>Baths</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input
                                type='number'
                                id='regularPrice'
                                min='50'
                                max='1000000'
                                required
                                className='p-3 border border-gray-300 rounded-lg focus:outline-none'
                                onChange={handleInputChange}
                                value={formData.regularPrice}
                            />
                            <div className='flex flex-col items-center'>
                                <p>Regular Price</p>
                                {formData.type === 'rent' && (
                                    <span className='text-xs'>($ / month)</span>
                                )}
                            </div>
                        </div>
                        {formData.offer && (
                            <div className='flex items-center gap-2'>
                                <input
                                    type='number'
                                    id='discountPrice'
                                    min='1'
                                    max='1000000'
                                    required
                                    className='p-3 border border-gray-300 rounded-lg focus:outline-none'
                                    onChange={handleInputChange}
                                    value={formData.discountPrice}
                                />
                                <div className='flex flex-col items-center'>
                                    <p>Discounted Price</p>
                                    {formData.type === 'rent' && (
                                        <span className='text-xs'>($ / month)</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col flex-1 gap-4">
                    <p className='font-semibold'>Images:
                        <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6 images)</span>
                    </p>
                    <div className="flex gap-4">
                        <input
                            onChange={(e) => setFiles(e.target.files)}
                            type="file" id='images' accept='image/*' multiple
                            className='p-3 border border-gray-300 rounded w-full' />
                        <button
                            type='button'
                            disabled={uploading}
                            onClick={handleImageSubmit}
                            className='p-3 text-green-700 border border-green-700 rounded uppercase hover:bg-green-700 hover:text-white disabled:opacity-80'>
                            {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                    <p className="text-red-700 text-sm">
                        {imageUploadError && imageUploadError}
                    </p>
                    {formData.imageUrls.length > 0 &&
                        formData.imageUrls.map((url, index) => (
                            <div
                                key={url}
                                className="flex justify-between p-3 border items-center"
                            >
                                <img src={url} alt="listing image"
                                    className='w-20 max-h-20 object-contain rounded-lg'
                                />
                                <button type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                                >
                                    Delete
                                </button>
                            </div>
                        ))
                    }
                    <button
                        disabled={loading || uploading}
                        className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
                        {loading ? 'Creating...' : 'Create Listing'}
                    </button>
                    {error && <p className='text-red-700 text-sm'>{error}</p>}
                </div>
            </form>
        </main>
    )
}

export default CreateListing