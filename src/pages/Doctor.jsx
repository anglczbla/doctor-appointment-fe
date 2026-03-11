import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { specialityData } from '../assets/assets'

const Doctor = () => {
  const navigate = useNavigate()
  const { speciality } = useParams()
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const { doctors, loading } = useContext(AppContext)

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    } else {
      setFilterDoc(doctors)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 animate-pulse">
        <p className="text-2xl font-medium text-blue-400">Loading Doctors...</p>
      </div>
    )
  }

  return (
    <div>
      <p className='text-gray-600'>Browse through the doctors specialist</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button 
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-blue-600 text-white' : ''}`} 
          onClick={() => setShowFilter(prev => !prev)}
        >
          Filters
        </button>
        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          {specialityData.map((item, index) => (
            <p 
              key={index}
              onClick={() => speciality === item.speciality ? navigate('/doctor') : navigate(`/doctor/${item.speciality}`)} 
              className={`w-[94vw] sm:w-auto pl-3 py-2.5 pr-16 border border-gray-300 rounded-lg transition-all cursor-pointer hover:bg-gray-50 ${speciality === item.speciality ? "bg-indigo-100 text-indigo-700 border-indigo-200 font-medium" : "text-gray-700"}`}
            >
              {item.speciality}
            </p>
          ))}
        </div>
        
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-6'>
          {
            filterDoc.length > 0 ? filterDoc.map((item, index) => (
              <div 
                onClick={() => {navigate(`/appointment/${item._id}`); scrollTo(0,0)}} 
                className='bg-white rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-200 group' 
                key={index}
              >
                {/* Doctor Image */}
                <div className='bg-blue-50 overflow-hidden'>
                  <img className='w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500' src={item.image} alt={item.name} />
                </div>
                
                {/* Card Content */}
                <div className='p-5'>
                  {/* Available Status */}
                  <div className={`flex items-center gap-2 text-sm ${item.available ? 'text-green-500' : 'text-gray-500'} mb-2`}>
                    <p className={`w-2 h-2 ${item.available ? 'bg-green-500' : 'bg-gray-500'} rounded-full`}></p>
                    <p>{item.available ? 'Available' : 'Not Available'}</p>
                  </div>
                  
                  {/* Doctor Name */}
                  <p className='text-gray-900 font-bold text-xl mb-1 leading-tight'>{item.name}</p>
                  
                  {/* Speciality */}
                  <p className='text-gray-600 text-sm font-medium'>{item.speciality}</p>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-gray-400 text-lg italic">No doctors found in this category.</p>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Doctor