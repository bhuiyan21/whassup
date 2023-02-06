import React, { useState } from 'react';
import Sidebar from '../../component/Sidebar';
import { FaUserPlus} from 'react-icons/fa';
import { ImBlocked} from 'react-icons/im';
import { RiUserHeartFill,RiUserReceived2Fill} from 'react-icons/ri';
import Friend from '../../component/Friend';
import Friendreq from '../../component/Friendreq';
import Userlist from '../../component/Userlist';
import Block from '../../component/Block';
const Friends = () => {
  let [userlist, setUserlist]= useState(false)
  let [blocklist, setBlocklist]= useState(false)
  let [friendreq, setFriendreq]= useState(false)
   let handelUser=()=>{
    setUserlist(true)
    setBlocklist(false)
    setFriendreq(false)
   }
   let handelFriend=()=>{
    setUserlist(false)
    setBlocklist(false)
    setFriendreq(false)
   }
   let handelFriendreq=()=>{
    setFriendreq(true)
    setUserlist(false)
    setBlocklist(false)
   }
   let handelBlock=()=>{
     setBlocklist(true)
    setUserlist(false)
    setFriendreq(false)
   }
  return (
    <div> 
        <div className='absolute top-0 left-0 w-full'>
          <Sidebar/>
        </div>
        <div className=' flex h-screen justify-between bg-slate-200'>
            <div className='pl-3 pt-44 font-openSans font-semibold text-shadow text-2xl w-1/6 shadow-[10px_0px_3px_-7px_rgb(0,0,0,0.2)] bg-white'>
                <div onClick={handelUser} className='flex items-center gap-2 cursor-pointer hover:bg-slate-100 py-2 pl-3 mr-3 rounded-lg'>
                    <FaUserPlus/>
                    <h2>Suggestions</h2>
                </div>
                <div onClick={handelFriend} className='flex items-center gap-2 cursor-pointer hover:bg-slate-100 py-2 pl-3 mr-3 rounded-lg'>
                    <RiUserHeartFill/>
                    <h2>Friend list</h2>
                </div>
                <div onClick={handelFriendreq} className='flex items-center gap-2 cursor-pointer hover:bg-slate-100 py-2 pl-3 mr-3 rounded-lg'>

                    <RiUserReceived2Fill/>
                    <h2>Friend request</h2>
                </div>
                <div onClick={handelBlock} className='flex items-center gap-2 cursor-pointer hover:bg-slate-100 py-2 pl-3 mr-3 rounded-lg'>
                    <ImBlocked/>
                    <h2>Block list</h2>
                </div>
                
            </div>
            <div className=' w-1/2 pt-44'>
              {
                userlist
                ?<Userlist/>
                :blocklist
                ?<Block/>
                :friendreq
                ?<Friendreq/>
                :<Friend/>
              }
              
            </div>
            <div className='w-3/12 pt-44'>
             Ads
            </div>
         </div>
    </div>
  )
}

export default Friends
