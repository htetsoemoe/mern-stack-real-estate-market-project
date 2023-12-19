import React from 'react'
import { useSelector } from 'react-redux'
import { useRef, useState, useEffect } from 'react'
import {
  getDownloadURL,
  getStorage,
  ref,  // Returns a StorageReference for the given url.
  uploadBytesResumable // Uploads data to this object's location. The upload can be paused and resumed, and exposes progress updates.
} from 'firebase/storage'
import { app } from '../firebase'
import {
  updateUserStart, updateUserSuccess, updateUserFailure,
  deleteUserStart, deleteUserSuccess, deleteUserFailure,
  signoutStart, signoutSuccess, signInFailure, signoutFailure,
} from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom'

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const fileRef = useRef(null) // using hidden file input
  const [file, setFile] = useState(undefined)
  const [filePercentage, setFilePercentage] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData, setFormData] = useState([])
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [showListingsError, setShowListingsError] = useState(false)
  const [userListings, setUserListings] = useState([])

  useEffect(() => {
    if (file) {
      handleFileUpload(file)
    }
  }, [file])

  const handleFileUpload = (file) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setFilePercentage(Math.round(progress))
      },
      (error) => {
        setFileUploadError(true)
      },
      // After upload new image, this callback will invoke
      // User updated image is becoming downloadURL, which was assigned to avatar
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => setFormData({ ...formData, avatar: downloadURL }))
      }
    )
  }

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.id]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      dispatch(updateUserStart())

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (data.success === false) {
        dispatch(updateUserFailure(data.message))
        return
      }

      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)

    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }

  // this method will use in 'deleteUserHandler'
  const deleteUser = async () => {
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message))
        return
      }
      dispatch(deleteUserSuccess())
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const deleteUserHandler = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
        await deleteUser()
      }
    });
  }

  // SignOut Handler
  const singOutHandler = async () => {
    try {
      dispatch(signoutStart())
      const res = await fetch('/api/auth/signout')  // default request is 'GET'
      const data = await res.json()
      if (data.success === false) {
        dispatch(signoutFailure(data.message))
        return
      }
      dispatch(signoutSuccess())
    } catch (error) {
      dispatch(signoutFailure(error.message))
    }
  }

  // Show all listings of Login User
  const ShowListingsHandler = async () => {
    try {
      setShowListingsError(false)
      const res = await fetch(`/api/user/listings/${currentUser._id}`)
      const data = await res.json()

      if (data.success === false) {
        setShowListingsError(true)
        return
      }

      setUserListings(data)

    } catch (error) {
      setShowListingsError(true)
    }
  }

  // this method will use in 'listingDeleteHandler'
  const listingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      })
      const data = await res.json()

      if (data.success === false) {
        console.log(data.message)
        return
      }

      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId))

    } catch (error) {
      console.log(error.message)
    }
  }

  // Handler for delete specific login user's a listing
  const listingDeleteHandler = (listingId) => {
    Swal.fire({
      title: "Are you sure to delete this listing?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
        await listingDelete(listingId)
      }
    });
  }

  return (
    <div className='p-3 max-w-2xl mx-auto'>
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          ref={fileRef}
          accept='image/'
          hidden />

        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar} alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" />

        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image Upload (image must be less than 2 mb)
            </span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span className="text-slate-700">
              {`Uploading ${filePercentage}%`}
            </span>
          ) : filePercentage === 100 ? (
            <span className="text-green-700">
              Image Successfully Uploaded!
            </span>
          ) : ""}
        </p>

        <input type="text"
          defaultValue={currentUser.username}
          onChange={handleInputChange}
          placeholder='Username'
          name="username" id="username"
          className="border p-3 rounded-lg focus:outline-none" />

        <input type="email"
          defaultValue={currentUser.email}
          onChange={handleInputChange}
          placeholder='Email'
          name="email" id="email"
          className="border p-3 rounded-lg focus:outline-none" />

        <input type="password"
          onChange={handleInputChange}
          placeholder='New Password'
          name="password" id="password"
          className="border p-3 rounded-lg focus:outline-none" />

        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? 'Loading...' : 'Update'}
        </button>

        <Link
          to={'/create-listing'}
          className='bg-green-700 text-white rounded-lg p-3 uppercase text-center hover:opacity-95'>
          Create Listing
        </Link>
      </form>

      <div className="flex justify-between mt-5">
        <span
          onClick={deleteUserHandler}
          className="text-red-700 cursor-pointer">Delete Account</span>
        <span
          onClick={singOutHandler}
          className="text-red-700 cursor-pointer">Sign Out</span>
      </div>

      <p className="text-red-700 mt-5">{error ? error : ''}</p>
      <p className="text-green-700 mt-5">{updateSuccess ? 'User was updated successfully!' : ''}</p>

      <button
        onClick={ShowListingsHandler}
        className="text-green-700 w-full">
        Show Listings
      </button>
      <p className="text-red-700 mt-5">
        {showListingsError ? 'Error Showing Listings' : ''}
      </p>

      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">Your Listings</h1>
          {userListings.map((listing) => (
            <div
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
              key={listing._id}
            >
              <Link to={`/listing/${listing._id}`}>
                <img src={listing.imageUrls[0]} alt="listing photo"
                  className='h-16 w-16 object-contain' />
              </Link>

              <Link to={`/listing/${listing._id}`}
                className='text-slate-700 font-semibold hover:underline truncate flex-1'
              >
                <p>{listing.name}</p>
              </Link>

              <div className="flex gap-3 items-center">
                <button
                  onClick={() => listingDeleteHandler(listing._id)}
                  className="bg-red-700 p-1 rounded text-white uppercase">Delete</button>
                <button className="bg-green-700 p-1 rounded text-white uppercase">Edit</button>
              </div>
            </div>
          ))}
        </div>)
      }
    </div>
  )
}

export default Profile
