import React from 'react'
import { FaSearch} from 'react-icons/fa';
import { BiDotsVerticalRounded} from 'react-icons/bi';

const Searchbar = () => {
  return (
    <div className='relative'>
        <input type="text" placeholder="Search" className='w-full shadow-md outline-none py-5 pl-16 rounded-lg text-shadow font-semibold text-lg'/>
        <FaSearch className='absolute top-5 left-7 lef-0 text-2xl cursor-pointer'/>
        <BiDotsVerticalRounded className='absolute top-5 right-7 lef-0 text-2xl cursor-pointer text-secondary'/>
    </div>
  )
}

export default Searchbar
