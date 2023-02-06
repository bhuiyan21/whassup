import React, {useState } from 'react'
import { AiOutlineHome, AiOutlineMessage, AiOutlineSetting,AiOutlineCloudUpload,AiFillCamera} from 'react-icons/ai';
import { IoIosNotificationsOutline} from 'react-icons/io';
import { TbHandClick} from 'react-icons/tb';
import { MdGroups} from 'react-icons/md';
import { FaSearch, FaUserFriends} from 'react-icons/fa';
import { ImExit} from 'react-icons/im';
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { Link, useNavigate} from "react-router-dom";
import { useDispatch, useSelector} from 'react-redux';
import { userLoginInfo } from '../slices/userInfo/userSlice';
import Searchbar from './Searchbar';
const Sidebar = () => {
  let [logoutModal, setLogoutModal] = useState(false);
  let [profileModal, setProfileModalModal] = useState(false);
  const auth = getAuth();
  let data = useSelector((state)=>state.userLoginInfo.userInfo)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  let handelLogout = ()=>{
    signOut(auth).then(() => {
      dispatch(userLoginInfo(null));
      localStorage.removeItem("userInfo");      
      navigate("/login");
    })
  };
  

 
  let handelLogoutmodal =()=>{
    setLogoutModal(!logoutModal)
  }
 
  let handelProfileModal =()=>{
    setProfileModalModal(!profileModal)
  };
  let handelProfile =()=>{
    setProfileModalModal(!profileModal)
    navigate("/profile")
  }
  
  return (
    <div className='bg-secondary rounded-3xl mx-3'>
      <Searchbar/>
      <div className='flex justify-between items-center px-20'>
        
        <Link to="/">
          <div className='h-16 group bg-white ml-6 rounded-tl-2xl rounded-tr-2xl flex items-center px-5 cursor-pointer relative before:absolute before:w-full before:h-2 before:bg-secondary before:bottom-0 before:left-0 before:rounded-tl-2xl before:rounded-tr-2xl'>
           <AiOutlineHome className="text-3xl text-secondary" />
          <div className='absolute -bottom-12 -left-4 bg-shadow rounded z-20 hidden group-hover:block transition-all'>
            <p className='py-2 px-8 font-nunito font-bold text-sm text-white'>Home</p>
          </div>
          </div>
        </Link>
       <Link to="/friends">
       <div className='h-16 group hover:bg-white group ml-6 rounded-tl-2xl rounded-tr-2xl flex items-center px-5 cursor-pointer relative before:absolute before:w-full before:h-2 before:bg-secondary before:bottom-0 before:left-0 before:rounded-tl-2xl before:rounded-tr-2xl'>
          <FaUserFriends className="text-3xl text-white group-hover:text-secondary" />
          <div className='absolute -bottom-12 -left-4 bg-shadow rounded z-20 hidden group-hover:block transition-all'>
            <p className='py-2 px-8 font-nunito font-bold text-sm text-white'>Friends</p>
          </div>
        </div>
       </Link>
       <Link to="/group">
       <div className='h-16 group bg-white ml-6 rounded-tl-2xl rounded-tr-2xl flex items-center px-5 cursor-pointer relative before:absolute before:w-full before:h-2 before:bg-secondary before:bottom-0 before:left-0 before:rounded-tl-2xl before:rounded-tr-2xl'>
          <MdGroups className="text-3xl text-secondary" />
          <div className='absolute -bottom-12 -left-5 bg-shadow rounded z-20 hidden group-hover:block transition-all'>
            <p className='py-2 px-8 font-nunito font-bold text-sm text-white'>Groups</p>
          </div>
        </div>
       </Link>
        <Link to="/message">
          <div className='h-16 group bg-white ml-6 rounded-tl-2xl rounded-tr-2xl flex items-center px-5 cursor-pointer relative before:absolute before:w-full before:h-2 before:bg-secondary before:bottom-0 before:left-0 before:rounded-tl-2xl before:rounded-tr-2xl'>
            <AiOutlineMessage className="text-3xl text-secondary" />
            <div className='absolute -bottom-12 -left-6 bg-shadow rounded z-20 hidden group-hover:block transition-all'>
            <p className='py-2 px-8 font-nunito font-bold text-sm text-white'>Message</p>
          </div>
          </div>
        </Link>
        <div className='h-16 group bg-white ml-6 rounded-tl-2xl rounded-tr-2xl flex items-center px-5 cursor-pointer relative before:absolute before:w-full before:h-2 before:bg-secondary before:bottom-0 before:left-0 before:rounded-tl-2xl before:rounded-tr-2xl'>
          <IoIosNotificationsOutline className="text-5xl text-secondary" />
          <div className='absolute -bottom-12 -left-7 bg-shadow rounded z-20 hidden group-hover:block transition-all'>
            <p className='py-2 px-8 font-nunito font-bold text-sm text-white'>Notifications</p>
          </div>
        </div>
        <div onClick={handelProfileModal} className="relative">
            <div className='group w-16 h-16 rounded-full mx-auto relative cursor-pointer' >
              <img src={data.photoURL} className='w-full h-full rounded-full'/>
              <TbHandClick className='absolute right-0 bottom-0 text-lg text-white z-10'/>
            </div>
            <h1 className='text-center font-nunito font-bold text-sm text-white cursor-pointer'>{data.displayName}</h1>   
            {
              profileModal &&
              <div className='p-3 bg-white rounded absolute top-full right-0 z-10 w-96 shadow-xl'>
                <div className='shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] p-2 rounded'>
                      <div onClick={handelProfile} className='flex border-b-2 p-2 mb-2 items-center cursor-pointer hover:bg-slate-200 rounded'>
                        <div className='mr-4 w-[52px] h-[54px]'>
                          <img className='w-full h-full rounded-full' src={data.photoURL}/>
                        </div>
                        <div>
                          <h2 className='font-semibold font-poppins text-sm mt-2'>{data.displayName}</h2>
                        </div>               
                      </div>
                  <div>
                    <p className='font-nunito font-bold text-sm text-secondary cursor-pointer'>See all profiles</p>
                  </div>
                </div>
                <div onClick={handelLogoutmodal} className='flex items-center mt-2 p-3 cursor-pointer hover:bg-slate-200 rounded'>
                  <ImExit className="text-2xl text-shadow mr-4" />
                  <p className='font-nunito font-bold text-lg text-shadow'>Log Out</p>
                </div>
                <div className='flex items-center mt-2 p-3 cursor-pointer hover:bg-slate-200 rounded'>
                  <AiOutlineSetting className="text-2xl text-shadow mr-4" />
                  <p className='font-nunito font-bold text-lg text-shadow'>Settings</p>
                </div>
              </div >
            } 
        </div>
        { logoutModal &&
          <div className='absolute top-0 left-0 w-full h-screen bg-[#94a3b881] z-50 flex justify-center items-center scale-100 transition-all'>
            <div className='w-96 p-3 bg-white rounded-lg text-center'>
              <p className='font-nunito font-bold text-3xl text-primary mb-3'>Log out of your account ?</p>
              <button className='py-2 px-3 mr-2 bg-red-500 rounded-lg text-white text-sm font-poppins font-semibold'
              onClick={handelLogout} >Log Out</button>
              <button className='py-2 px-3 bg-secondary rounded-lg text-white text-sm font-poppins font-semibold'
              onClick={handelLogoutmodal}
               >Cancel</button>
              </div>
          </div>
        }
        
      </div>
    </div>
  )
}

export default Sidebar;