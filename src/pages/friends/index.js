import React from 'react'
import Block from '../../component/Block'
import Friendreq from '../../component/Friendreq'
import Friend from '../../component/Friend'
import Sidebar from '../../component/Sidebar'
const Friends = () => {
  return (
    <div>
        <Sidebar/>
        <div className='mx-24 flex justify-between'>
            <div className='w-[45%]'>
             <Friend/>
            </div>
            <div className='w-[45%]'>
              <Friendreq/>
              <Block/>
            </div>
        </div>
    </div>
  )
}

export default Friends
