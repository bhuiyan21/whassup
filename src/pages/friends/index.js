import React from 'react'
import Block from '../../component/Block'
import Friendreq from '../../component/Friendreq'
import Friend from '../../component/Friend'
import Sidebar from '../../component/Sidebar'
import { AiOutlineUserAdd} from 'react-icons/ai';
import { FaUserFriends} from 'react-icons/fa';
import { ImBlocked} from 'react-icons/im';
const Friends = () => {
    let handeluserlist =()=>{
        
    }
  return (
    <div> 
        <div className='absolute top-0 left-0 w-full'>
          <Sidebar/>
        </div>
        <div className='pt-44 flex h-screen justify-between'>
            <div className='pl-3 font-openSans font-semibold text-shadow text-2xl w-1/6 shadow-[10px_0px_3px_-7px_rgb(0,0,0,0.2)]'>
                <div onClick={handeluserlist} className='flex items-center gap-2 cursor-pointer hover:bg-slate-100 py-2 pl-3 mr-3 rounded-lg'>
                    <AiOutlineUserAdd/>
                    <h2>User list</h2>
                </div>
                <div className='flex items-center gap-2 cursor-pointer hover:bg-slate-100 py-2 pl-3 mr-3 rounded-lg'>
                    <FaUserFriends/>
                    <h2>Friend list</h2>
                </div>
                <div className='flex items-center gap-2 cursor-pointer hover:bg-slate-100 py-2 pl-3 mr-3 rounded-lg'>
                    <ImBlocked/>
                    <h2>Block list</h2>
                </div>
            </div>
            <div className=' w-1/2'>
              <Friend/>
            </div>
            <div className='w-3/12'>
              <Friend/>
            </div>
         </div>
    </div>
  )
}

export default Friends
