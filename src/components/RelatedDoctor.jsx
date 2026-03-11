import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const RelatedDoctor = ({speciality,docId}) => {

    const {doctors} = useContext(AppContext)
    const navigate = useNavigate()

    const [relDoc, setRelDOC] = useState([])

    useEffect(()=>{
        if(doctors.length > 0  &&speciality){
            const doctorsData = doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId)
            setRelDOC(doctorsData)
        }

    },[doctors,speciality,docId])
  return (
   <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
      <h1 className='text-3xl font-medium'>Related Doctors</h1>
      <p className='sm:w-1/3 text-center text-sm'>Browse through other trusted doctors in this speciality.</p>
      <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
        {relDoc.slice(0,5).map((item,index)=>(
            <div 
              onClick={()=> {navigate(`/appointment/${item._id}`); scrollTo(0,0)}}
              className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group' 
              key={index}
            >
                <div className="overflow-hidden">
                    <img className='bg-blue-50 w-full h-60 object-cover group-hover:scale-110 transition-transform duration-500' src={item.image} alt="" />
                </div>
                <div className='p-4'>
                    <div className={`flex items-center gap-2 text-sm ${item.available ? 'text-green-500' : 'text-gray-500'} mb-2`}>
                        <p className={`w-2 h-2 ${item.available ? 'bg-green-500' : 'bg-gray-500'} rounded-full`}></p>
                        <p>{item.available ? 'Available' : 'Not Available'}</p>
                    </div>
                    <p className='text-gray-900 font-bold text-lg mb-1'>{item.name}</p>
                    <p className='text-gray-600 text-sm font-medium'>{item.speciality}</p>
                </div>
            </div>
        ))}
      </div>
      <button onClick={()=> {navigate(`/doctor`); scrollTo(0)}} className='bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10 hover:bg-blue-100 transition-all font-medium border border-blue-100'>
        More Doctors
      </button>
    </div>
  )
}

export default RelatedDoctor
