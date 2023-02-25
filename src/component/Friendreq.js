import React, { useEffect, useState } from 'react'
import { BiDotsVerticalRounded} from 'react-icons/bi';
import { getDatabase, ref, onValue,set,push, remove} from "firebase/database";
import { useSelector} from 'react-redux';
const Friendreq = () => {
    const db = getDatabase();
    let data = useSelector((state)=>state.userLoginInfo.userInfo)
    let [requestfriend, setRequestfriend] = useState([])


    useEffect(()=>{
        const requestfrndRef = ref(db, 'friendreq');
        onValue(requestfrndRef, (snapshot) => {
           let arr = [];
            snapshot.forEach((item)=>{
                if(data.uid == item.val().receiverId){
                    arr.push({...item.val() , userid: item.key}); 
                }
            });
            setRequestfriend(arr);
        });
    },[])
  let handelAccept = (item)=>{
    set(push(ref(db, 'friend')), {
        ...item,
      }).then(()=>{
        remove(ref(db, 'friendreq/'+item.userid))
      });
  }
  return (
    <div className='pt-5 pb-5 pl-5 shadow-md mt-6 rounded-lg relative bg-white'>
      <h2 className='text-sm font-poppins font-semibold text-black'>Friend  Request</h2>
      <BiDotsVerticalRounded className='absolute top-3 right-7 lef-0 text-2xl cursor-pointer text-secondary'/>
           <div className='h-[650px] overflow-y-scroll pr-6'>
       {
        requestfriend.length == 0
        ?<p className='h-full flex items-center justify-center font-medium font-poppins text-2xl text-shadow'>No user request</p>
        :
        requestfriend.map(item=>(
                <div className='flex py-4 border-b-2'>
                   <div className='mr-4 w-[70px] h-[70px]'>
                       <img className='w-full h-full rounded-full' src={item.senderprofile}/>
                    </div>
                    <div>
                        <h2 className='font-semibold font-poppins text-sm mt-2'>{item.senderName}</h2>
                        <p className='font-medium font-poppins text-xs text-shadow'>{item.senderemail}</p>
                    </div>
                    <div className='mt-2 ml-auto'>
                        <button className=' inline-block py-2 px-5 bg-secondary font-semibold font-poppins text-sm text-white rounded-lg'
                        onClick={()=>handelAccept(item)}>Accept</button>
                    </div>
                </div>    
        ))
       } 
             </div>
    </div>
  )
}

export default Friendreq
