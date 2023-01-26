import React from 'react'
import { FaSearch} from 'react-icons/fa';
import { BiDotsVerticalRounded} from 'react-icons/bi';

const Searchbar = () => {
  return (
    <div className='flex items-center justify-between mb-2 bg-primary px-20 py-2 rounded-tl-3xl rounded-tr-3xl'>
    <h2 className='text-center font-nunito font-bold text-lg text-white'>WhaSsuP</h2>
    <div className='relative w-96'>
      <input type="text" placeholder="Search" className='w-full shadow-md outline-none py-1 pl-16 rounded-lg text-shadow font-semibold text-lg'/>
      <FaSearch className='absolute top-2 left-7 text-2xl cursor-pointer text-secondary'/>
      <BiDotsVerticalRounded className='absolute top-2 right-7 text-2xl cursor-pointer text-secondary'/>
    </div>
</div>
  )
}

export default Searchbar
