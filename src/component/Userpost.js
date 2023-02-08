import React, { useEffect, useState } from 'react'
import { TfiGallery} from 'react-icons/tfi';
import { RiSendPlaneFill, RiDeleteBin2Fill} from 'react-icons/ri';
import { BsThreeDotsVertical} from 'react-icons/bs';
import { useDispatch, useSelector} from 'react-redux';
import { getDatabase, ref, onValue,set,push, remove} from "firebase/database";
const Userpost = () => {
    const db = getDatabase()
    let data = useSelector((state)=>state.userLoginInfo.userInfo)
    let [postinput, setPostinput] =useState('')
    let [postimg, setPostimg] =useState('')
    let [post, setPost] =useState([])

    let handelPortInput =(e)=>{
        setPostinput(e.target.value)
    }
    const handelPostimg = (e) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        
        const reader = new FileReader();
        reader.onload = () => {
            setPostimg(reader.result);
        };
        reader.readAsDataURL(files[0]);
        
    };
    let handelPost =()=>{
            if(postinput || postimg){
              set(push(ref(db, 'post')),{
                username: data.displayName,
                userid: data.uid,
                text: postinput,
                image: postimg,
            }).then(()=>{
              setPostinput('')
              setPostimg('')
             }) 
            }      
    }
    
    useEffect(()=>{
      const postRef = ref(db, 'post');
      onValue(postRef, (snapshot) => {
         let arr = [];
         snapshot.forEach((item)=>{
            if(data.uid == item.val().userid){
              arr.push({...item.val() , key: item.key})
            }
          });
          setPost(arr)
      });
  },[])
  let handeldeleteModal =(item)=>{
    remove(ref(db, 'post/'+item.key))       
  }
  return (
    <div>
      <div className='p-8 bg-white rounded-md mt-6'>
       <h2 className='font-semibold font-poppins text-xl pb-2 border-b border-slate-200'>NEW POST</h2>
       <div className='flex items-center my-3'>
        <input onChange={handelPortInput} placeholder='What’s on your mind?' className='font-regular font-poppins text-lg text-shadow border-none outline-none p-2 w-full'/>
        <div className='flex items-center gap-6'>
            <div className='relative'>
              <div className='w-6 h-6 bg-white absolute top-0 left-0 pointer-events-none'>
                <TfiGallery  className='text-3xl'/>
              </div>
              <input onChange={handelPostimg} type='file' className='w-6 h-6'/>
          </div>
          <div className='p-2 bg-secondary  rounded-md'>
            <RiSendPlaneFill onClick={handelPost} className=' text-2xl text-white cursor-pointer'/>
          </div>
        </div>
       </div>
      </div>
      {/* ============= */}
      <div>
        {
        post.map(item=>(
          item.text == ""
          ?<div className='p-8 bg-white rounded-md mt-6 h-fit'>
          <RiDeleteBin2Fill onClick={()=>handeldeleteModal(item)} className='text-2xl cursor-pointer text-secondary ml-auto'/>
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
          <RiDeleteBin2Fill onClick={()=>handeldeleteModal(item)} className='text-2xl cursor-pointer text-secondary ml-auto'/>
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
        </div>
          :          
          <div className='p-8 bg-white rounded-md mt-6 h-fit'>
            <RiDeleteBin2Fill onClick={()=>handeldeleteModal(item)} className='text-2xl cursor-pointer text-secondary ml-auto'/>
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
  )
}

export default Userpost