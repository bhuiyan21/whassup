import React, { useEffect, useState } from 'react'
import { BiDotsVerticalRounded} from 'react-icons/bi';
import { getDatabase, ref, onValue,set,push, remove} from "firebase/database";
import { useDispatch, useSelector} from 'react-redux';
const Block = () => {
    let data = useSelector((state)=>state.userLoginInfo.userInfo);
    const db = getDatabase();
    let [block, setBlock] = useState([]);
    useEffect(()=>{
        const blocklistRef = ref(db, 'blocklist');
        onValue(blocklistRef, (snapshot) => {
           let arr = [];
            snapshot.forEach((item)=>{
                if(data.uid == item.val().blockbyid || data.uid == item.val().blockid ){
                    arr.push({...item.val(), userid: item.key})
                }
            });
            setBlock(arr);
        });
    },[])
    let handelUnblock = (item)=>{
        set(push(ref(db, 'friend')), {
            senderName: item.block,
            senderId: item.blockid,
            senderemail: item.blockemail,
            senderprofile: item.blockprofile,
            receiverName: data.displayName,
            receiverId: data.uid,
            receiveremail: data.email,
            receiverprofile: data.photoURL,
          }).then(()=>{
            remove(ref(db, 'blocklist/'+item.userid))
          });    
    }
  return (
    <div className='h-[347px] pt-5 pb-5 pl-5 shadow-md mt-11 rounded-lg relative'>
      <h2 className='text-sm font-poppins font-semibold text-black'>Blocked Users</h2>
      <BiDotsVerticalRounded className='absolute top-0 right-7 lef-0 text-2xl cursor-pointer text-secondary'/>
           <div className='h-[270px] overflow-y-scroll pr-6'>
           {
            block.length == 0
            ?<p className='h-full flex items-center justify-center font-medium font-poppins text-2xl text-shadow'>No user in blocklist</p>
            :
              block.map(item=>(
                data.uid == item.blockbyid
                ? <div className='flex py-4 border-b-2'>
                <div className='mr-4 w-[52px] h-[54px]'>
                   <img className='w-full h-full rounded-full' src={item.blockprofile}/>
                </div>
                <div>
                    <h2 className='font-semibold font-poppins text-sm mt-2'>{item.block}</h2>
                    <p className='font-medium font-poppins text-xs text-shadow'>{item.blockemail}</p>
                </div>
                <div className='mt-2 ml-auto'>
                <button className='inline-block py-2 px-2 bg-primary font-semibold font-poppins text-sm text-white rounded-lg'
               onClick={()=>handelUnblock(item)}>
                Unblock
               </button>
                </div>
            </div>
                : <div className='flex py-4 border-b-2'>
                <div className='mr-4 w-[52px] h-[54px]'>
                   <img className='w-full h-full rounded-full' src={item.blockbyprofile}/>
                </div>
                <div>
                    <h2 className='font-semibold font-poppins text-sm mt-2'>{item.blockby}</h2>
                    <p className='font-medium font-poppins text-xs text-shadow'>{item.blockbyemail}</p>
                </div>
                <div className='mt-2 ml-auto'>
                <p className='inline-block py-2 px-2 text-primary font-semibold font-poppins text-sm rounded-lg'
               >
                Unavilable
                </p>
                </div>
            </div>
               
                
                    ))
            }
             </div>
    </div>
  )
}

export default Block


           