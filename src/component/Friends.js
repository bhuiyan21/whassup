import React, { useEffect, useState } from 'react'
import { BiDotsVerticalRounded} from 'react-icons/bi';
import { getDatabase, ref, onValue,set,push, remove} from "firebase/database";
import { useDispatch, useSelector} from 'react-redux';
const Friends = () => {
    let data = useSelector((state)=>state.userLoginInfo.userInfo)
    const db = getDatabase();
    let [accept, setAccept] = useState([])
    let [delateBox, setDelateBox] = useState(false);
    let [dltGroup, setDltGroup] = useState([]);
    useEffect(()=>{
        const acceptfrndRef = ref(db, 'friend');
        onValue(acceptfrndRef, (snapshot) => {
           let arr = [];
            snapshot.forEach((item)=>{
                if(data.uid == item.val().receiverId || data.uid == item.val().senderId){
                    arr.push({...item.val() , userid: item.key}); 
                }
            });
            setAccept(arr);
        });
    },[])
    let handelBlock = (item)=>{
      setDelateBox(false)
      if(data.uid == item.senderId){
        set(push(ref(db, 'blocklist')),{
          block: item.receiverName,
          blockid: item.receiverId,
          blockemail: item.receiveremail,
          blockprofile: item.receiverprofile,
          blockby: item.senderName,
          blockbyid: item.senderId,
          blockbyemail: item.senderemail,
          blockbyprofile: item.senderprofile,
          }).then(()=>{
            remove(ref(db, 'friend/'+item.userid))
          });
        }else if(data.uid == item.receiverId){
        set(push(ref(db, 'blocklist')),{
          block: item.senderName,
          blockid: item.senderId,
          blockemail: item.senderemail,
          blockprofile: item.senderprofile,
          blockby: item.receiverName,
          blockbyid: item.receiverId,
          blockbyemail: item.receiveremail,
          blockbyprofile: item.receiverprofile,
          }).then(()=>{
            setDelateBox(false)
            remove(ref(db, 'friend/'+item.userid))
          });  
      }
    }
    let handelDelateBox = (item)=>{
      setDelateBox(true)
      
      if(data.uid == item.senderId){
        let blockid = item.receiverId;
        let blockbyid = item.senderId;
        setDltGroup(blockid + blockbyid)
        }else if(data.uid == item.receiverId){
        let blockid = item.senderId;
        let blockbyid = item.receiverId;
          setDltGroup(blockid + blockbyid)
        }
    }  
  return (
    <div className='h-[451px] pt-5 pb-5 pl-5 shadow-md mt-11 rounded-lg relative'>
      <h2 className='text-sm font-poppins font-semibold text-black'>Friends</h2>
      <BiDotsVerticalRounded className='absolute top-0 right-7 lef-0 text-2xl cursor-pointer text-secondary'/>
           <div className='h-[370px] overflow-y-scroll pr-6'>
            {
              accept.length == 0
              ? <p className='h-full flex items-center justify-center font-medium font-poppins text-2xl text-shadow'>Add users in your friend list </p>
              :
              accept.map(item=>(
                
                    item.senderId == data.uid 
                    ?
                    <div>
                      {
                        delateBox && dltGroup.includes(item.receiverId + item.senderId)
                        ?<div className='p-7 w-full text-center'>
                        <p className='font-nunito font-bold text-xl text-primary p-6'>Are you sure you want to block your Friend <span className='text-secondary'>{item.receiverName}</span> ?</p>
                        <button onClick={()=>handelBlock(item)} className='inline-block py-2 px-5 mr-3 bg-secondary font-semibold font-poppins text-sm text-white rounded-lg'>Yes</button>
                        <button onClick={()=>setDelateBox(!delateBox)} className='inline-block py-2 px-5 bg-secondary font-semibold font-poppins text-sm text-white rounded-lg'>No</button>
                      </div>
                      : <div className='flex py-4 border-b-2'>
                      <div className='mr-4 w-[52px] h-[54px]'>
                         <img className='w-full h-full rounded-full' src={item.receiverprofile}/>
                      </div>
                      <div>
                          <h2 className='font-semibold font-poppins text-sm mt-2'>{item.receiverName}</h2>
                          <p className='font-medium font-poppins text-xs text-shadow'>{item.receiveremail}</p>
                      </div>
                      <div className='mt-2 ml-auto'>
                      <button className='inline-block py-2 px-2 bg-secondary font-semibold font-poppins text-sm text-white rounded-lg'
                     onClick={()=>handelDelateBox(item)}>
                      Block
                     </button>
                      </div>
                    </div>
                      }
                    </div>
                    : <div>
                      { delateBox && dltGroup.includes(item.senderId + item.receiverId)
                        ?<div className='p-7 w-full text-center'>
                        <p className='font-nunito font-bold text-xl text-primary p-6'>Are you sure you want to block your Friend <span className='text-secondary'>{item.senderName}</span> ?</p>
                        <button onClick={()=>handelBlock(item)} className='inline-block py-2 px-5 mr-3 bg-secondary font-semibold font-poppins text-sm text-white rounded-lg'>Yes</button>
                        <button onClick={()=>setDelateBox(!delateBox)} className='inline-block py-2 px-5 bg-secondary font-semibold font-poppins text-sm text-white rounded-lg'>No</button>
                      </div>
                      :<div className='flex py-4 border-b-2'>
                      <div className='mr-4 w-[52px] h-[54px]'>
                        <img className='w-full h-full rounded-full' src={item.senderprofile}/>
                      </div>
                          <div>
                            <h2 className='font-semibold font-poppins text-sm mt-2'>{item.senderName}</h2>
                            <p className='font-medium font-poppins text-xs text-shadow'>{item.senderemail}</p>
                          </div>
                          <div className='mt-2 ml-auto'>
                          <button className='inline-block py-2 px-2 bg-secondary font-semibold font-poppins text-sm text-white rounded-lg'
                           onClick={()=>handelDelateBox(item)} >
                            Block
                          </button>
                        </div>
                      </div>
                      }
                </div>
                    ))
            }
             </div>
    </div>
  )
}

export default Friends
