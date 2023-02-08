import React, { useEffect, useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import {useNavigate} from 'react-router';
import { BsThreeDotsVertical} from 'react-icons/bs';
import Sidebar from '../../component/Sidebar';
import Userlist from '../../component/Userlist';
import { getAuth, onAuthStateChanged} from "firebase/auth";
import { userLoginInfo } from '../../slices/userInfo/userSlice';
import { getDatabase, ref, onValue,set,push, remove} from "firebase/database";
const Home = () => {
  const db = getDatabase()
  let [verify, setVerify] = useState(false)
  let [post, setPost] =useState([])
  let [friendList, setFriendList] = useState([]) 
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
  useEffect(()=>{
    const postRef = ref(db, 'post');
    onValue(postRef, (snapshot) => {
       let arr = [];
       snapshot.forEach((item)=>{
            arr.push({...item.val() , key: item.key})
        });
        setPost(arr)
    });
},[])
useEffect(()=>{
  const acceptfrndRef = ref(db, 'friend');
  onValue(acceptfrndRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item)=>{
          arr.push(item.val().receiverId + item.val().senderId)
      });
      setFriendList(arr);
  });
},[])

console.log("data",data.uid);
console.log("friendList",friendList);
  return (
    <>
     {
        verify ?<>
          <div className='bg-slate-200'>
           <Sidebar active="home"/>
          </div>
          <div className='flex justify-around bg-slate-200'>
            <div className='w-[460px] mt-2'>
                 <div>
                  <h1>{
                    // console.log(friendList.includes(item.userid+ data.uid || data.uid + item.userid))
                    
                    }</h1>
                  {
                    post.map(item=>(
                      friendList.includes(item.userid+ data.uid || data.uid + item.userid) &&
                      item.text == ""
                      ?<div className='p-8 bg-white rounded-md mt-6 h-fit'>
                      <BsThreeDotsVertical className='text-2xl cursor-pointer text-secondary ml-auto'/>
                      <div className='border-t border-slate-200 mt-3 flex pt-3'>
                        <div className='mr-4 w-16 h-16'>
                            <img className='w-full h-full rounded-full' src={data.photoURL}/>
                        </div>
                        <div>
                            <h2 className='font-semibold font-poppins text-sm mt-2'>{data.displayName}</h2>
                            <p className='font-medium font-poppins text-xs text-shadow'>TIME</p>
                        </div>
                    </div>
                    <div className='my-3'>
                        <img src={item.image}/>
                    </div>
                  </div>
                      :item.image == ''
                      ?<div className='p-8 bg-white rounded-md mt-6 h-fit'>
                      <BsThreeDotsVertical className='text-2xl cursor-pointer text-secondary ml-auto'/>
                      <div className='border-t border-slate-200 mt-3 flex pt-3'>
                        <div className='mr-4 w-16 h-16'>
                            <img className='w-full h-full rounded-full' src={data.photoURL}/>
                        </div>
                        <div>
                            <h2 className='font-semibold font-poppins text-sm mt-2'>{data.displayName}</h2>
                            <p className='font-medium font-poppins text-xs text-shadow'>frnditem</p>
                        </div>
                    </div>
                    <p className='font-regular font-poppins text-md my-3'>{item.text}</p>
                    </div>
                      :      
                      <div className='p-8 bg-white rounded-md mt-6 h-fit'>
                        <BsThreeDotsVertical className='text-2xl cursor-pointer text-secondary ml-auto'/>
                        <div className='border-t border-slate-200 mt-3 flex pt-3'>
                            <div className='mr-4 w-16 h-16'>
                                <img className='w-full h-full rounded-full' src={data.photoURL}/>
                            </div>
                            <div>
                                <h2 className='font-semibold font-poppins text-sm mt-2'>{data.displayName}</h2>
                                <p className='font-medium font-poppins text-xs text-shadow'>TIME</p>
                            </div>
                        </div>
                        <p className='font-regular font-poppins text-md my-3'>{item.text}</p>
                        <div className=' w-96'>
                            <img src={item.image}/>
                        </div>
                      </div>
                    ))
                  }
                </div>
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