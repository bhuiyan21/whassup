import React, {useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from '../../component/Sidebar';
import Grouplist from '../../component/Grouplist';
import Mygroup from '../../component/Mygroup';
import { MdOutlineGroupAdd,MdGroups} from 'react-icons/md';
import {useNavigate} from 'react-router';
const Group = () => {
    const navigate = useNavigate();
    let data = useSelector((state)=>state.userLoginInfo.userInfo)
    let [grouplist, setGrouplist]= useState(false)
    let handelGrouplist=()=>{
        setGrouplist(true)
    }
    let handelMygroup=()=>{
        setGrouplist(false)
    }
    useEffect(()=>{
        if(!data){
         navigate("/login")
        }
     },[]);
  return (
    <div>
        <div className='absolute top-0 left-0 w-full'>
          <Sidebar active="group"/>
        </div>
        <div className='flex h-screen justify-between bg-slate-200'>
        <div className='pt-44 pl-3 font-openSans font-semibold text-shadow text-2xl w-1/6 shadow-[10px_0px_3px_-7px_rgb(0,0,0,0.2)] bg-white'>
        <div onClick={handelGrouplist} className='flex items-center gap-2 cursor-pointer hover:bg-slate-100 py-2 pl-3 mr-3 rounded-lg'>
            <MdOutlineGroupAdd/>
            <h2>Groups</h2>
        </div>
        <div onClick={handelMygroup} className='flex items-center gap-2 cursor-pointer hover:bg-slate-100 py-2 pl-3 mr-3 rounded-lg'>
            <MdGroups/>
            <h2>Your groups</h2>
        </div>
        </div>
        <div className=' w-1/2 pt-44'>
            {
                grouplist
                ?<Grouplist/>
                :<Mygroup/>
            }
            
        </div>
        <div className='w-3/12 pt-44'>
             Ads
            </div>
        </div>
    </div>
  )
}

export default Group
