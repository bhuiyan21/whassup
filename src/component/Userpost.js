import React, { useEffect, useState } from 'react'
import { TfiGallery} from 'react-icons/tfi';
import { RiSendPlaneFill, RiDeleteBin2Fill} from 'react-icons/ri';
import { useSelector} from 'react-redux';
import { getDatabase, ref, onValue,set,push, remove} from "firebase/database";
import { getStorage, ref as sref, uploadBytesResumable, getDownloadURL,uploadBytes  } from "firebase/storage";
const Userpost = () => {
    const db = getDatabase()
    const storage = getStorage();
    let data = useSelector((state)=>state.userLoginInfo.userInfo)
    let [postinput, setPostinput] =useState('')
    let [postimg, setPostimg] =useState('')
    let [post, setPost] =useState([])

    let handelPortInput =(e)=>{
        setPostinput(e.target.value)
    }
 
    let handelPostimg =(e)=>{
      const storageRef = sref(storage, 'upload/' + e.target.files[0].name);
      const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);

      uploadTask.on('state_changed', 
      (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
         
      }, 
      (error) => {
         console.log(error);
      }, 
      () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setPostimg(downloadURL)
          });
      }
      );
    }
    let handelPost =()=>{
            if(postinput || postimg){
              set(push(ref(db, 'post')),{
                username: data.displayName,
                userid: data.uid,
                userphoto: data.photoURL,
                text: postinput,
                image: postimg,
                date: `${new Date().getDate()}-${new Date().getMonth()+1}-${new Date().getFullYear()}`, 
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
              arr.unshift({...item.val() , key: item.key})
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
            <label>
            <TfiGallery  className='text-3xl cursor-pointer'/>
              <input onChange={handelPostimg} type='file' className='hidden'/>
            </label>
          <div onClick={handelPost} className='p-2 bg-secondary cursor-pointer rounded-md'>
            <RiSendPlaneFill className=' text-2xl text-white'/>
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
                 <p className='font-medium font-poppins text-xs text-shadow'>{item.date}</p>
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
                 <p className='font-medium font-poppins text-xs text-shadow'>{item.date}</p>
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
                    <p className='font-medium font-poppins text-xs text-shadow'>{item.date}</p>
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
