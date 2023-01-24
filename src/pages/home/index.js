import React, { useEffect, useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import {useNavigate} from 'react-router';
import Block from '../../component/Block';
import Friendreq from '../../component/Friendreq';
import Friends from '../../component/Friends';
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
     if(user.emailVerified){
      setVerify(true)
      dispatch(userLoginInfo(user))
      localStorage.setItem("userInfo", JSON.stringify(user))
     }
  })
  useEffect(()=>{
     if(!data){
      navigate("/login")
     }
  });
  return (
    <>
     {
        verify ?<>
        <div className='flex gap-12'>
        <div className='w-[186px] h-screen'>
         <Sidebar />
        </div>
        <div className=' w-[427px] mt-9'>
        <Searchbar/>
        <Grouplist/>
        <Friendreq/>
        </div>
        <div className='w-[460px]'>
        <Friends/>
        <Mygroup/>
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











                   

  // reqModal
  // ? <div className='absolute top-0 left-0 w-full h-full p-2 rounded bg-slate-400'>
  //      <div onClick={()=>setReqModal(!reqModal)} className='absolute top-5 right-5 cursor-pointer flex items-center text-2xl gap-1'>
  //         <GiCrossMark className='text-secondary'/>
  //         <p className='text-secondary '>Close</p>
  //     </div>
  //         <div className='h-[270px] overflow-y-scroll pr-5 mt-12'>
  //     {
  //         groupreqList.map((item)=>(
  //             groupreqMatch.includes(item.groupid + item.reqid)
  //             &&
  //             <div className='flex py-4 border-b-2'>
  //                 <div className='mr-4 w-[52px] h-[54px]'>
  //                     <img className='w-full h-full rounded-full' src={item.reqprofile}/>
  //                 </div>
  //                 <div>
  //                     <h2 className='font-semibold font-poppins text-sm mt-2'>{item.reqname}</h2>
  //                     <p className='font-medium font-poppins text-xs text-shadow'>{item.reqemail}</p>
  //                 </div>
  //                 <div className='mt-2 ml-auto'>
  //                     <button className='inline-block py-2 px-2 bg-secondary font-semibold font-poppins text-sm text-white rounded-lg'
  //                         >
  //                         Accept
  //                     </button>
  //                     <button className='inline-block py-2 px-2 ml-2 bg-red-500 font-semibold font-poppins text-sm text-white rounded-lg'
  //                         >
  //                         Reject
  //                     </button>
  //                 </div>
  //             </div>
  //             // : <p>No Joining Request</p>
  //         ))
  //     }
  //         </div>
     
  // </div>





  // && dltGroup.includes(item.groupid + item.groupAdminId)