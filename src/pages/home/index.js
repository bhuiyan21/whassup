import React, { useEffect, useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import {useNavigate} from 'react-router';
import Block from '../../component/Block';
import Friendreq from '../../component/Friendreq';
import Friends from '../../component/Friend';
import Grouplist from '../../component/Grouplist';
import Mygroup from '../../component/Mygroup';
import Searchbar from '../../component/Searchbar';
import Sidebar from '../../component/Sidebar';
import Userlist from '../../component/Userlist';
import { getAuth, onAuthStateChanged} from "firebase/auth";
import { userLoginInfo } from '../../slices/userInfo/userSlice';
const Home = () => {
  let [verify, setVerify] = useState(false)
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const auth = getAuth()
  let data = useSelector((state)=>state.userLoginInfo.userInfo)
  onAuthStateChanged(auth, (user)=>{
     
    dispatch(userLoginInfo(user))
    localStorage.setItem("userInfo", JSON.stringify(user))
  })
 
  useEffect(()=>{
    if(data.emailVerified){
      setVerify(true)
    }
  },[]);

  useEffect(()=>{
     if(!data){
      navigate("/login")
     }
  },[]);
  return (
    <>
     {
        verify ?<>
          <div className='bg-slate-200'>
           <Sidebar active="home"/>
          </div>
          <div className='flex justify-around bg-slate-200'>
            <div className='w-[460px] mt-2'>
            <Grouplist/>
            <Mygroup/>
            </div>
            <div className='w-[460px]'>
            <Friends/>
            <Friendreq/>
            </div>
            <div className='w-[460px]'>
            <Userlist/>
            <Block/>
            </div>
          </div>
         </> 
        
        : <><h1 className='w-full h-screen bg-secondary flex justify-center items-center text-white font-nunito text-3xl font-semibold cursor-wait'>
          Please verify your email
          <svg class="animate-spin ml-5  h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          </svg>
          </h1>
        </>
      }
    </>
  )
};
export default Home;     