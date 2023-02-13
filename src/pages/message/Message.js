import React, { useState } from 'react'
import { FaUserPlus} from 'react-icons/fa';
import { ImBlocked} from 'react-icons/im';
import { RiUserHeartFill,RiUserReceived2Fill} from 'react-icons/ri';
import { MdOutlineGroupAdd,MdGroups} from 'react-icons/md';
import Sidebar from '../../component/Sidebar'
import Chatgroup from '../../component/Chatgroup';
import Friend from '../../component/Friend'
import Chatbox from '../../component/Chatbox';
const Message = () => {
  let [group, setGroup] = useState(false)

  let handelFriend =()=>{
    setGroup(false)    
  };
  let handelGroup =()=>{
    setGroup(true)    
  };
  return (
    <div>
       <div className='absolute top-0 left-0 w-full'>
          <Sidebar active="message"/>
        </div>
        <div className=' flex h-screen justify-between bg-slate-200 pr-24'>
            <div className='pl-3 pt-44 font-openSans font-semibold text-shadow text-2xl w-1/6 shadow-[10px_0px_3px_-7px_rgb(0,0,0,0.2)] bg-white'>
                 <div onClick={handelFriend} className='flex items-center gap-2 cursor-pointer hover:bg-slate-100 py-2 pl-3 mr-3 rounded-lg'>
                    <RiUserHeartFill/>
                    <h2>Friends</h2>
                </div>
                <div onClick={handelGroup} className='flex items-center gap-2 cursor-pointer hover:bg-slate-100 py-2 pl-3 mr-3 rounded-lg'>
                    <MdGroups/>
                    <h2>Groups</h2>
                </div>
           </div>
           <div className=' w-4/12 pt-44'>
            {
              group
              ?<Chatgroup/>            
              : <Friend active="chatpage"/>
            }
           </div>
           <div className='w-5/12 pt-44'>
            <Chatbox/>                        
           </div>
        </div>
    </div>
  )
}

export default Message
