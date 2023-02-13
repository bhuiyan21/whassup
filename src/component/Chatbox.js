import React, { useEffect, useState } from 'react'
import { BsFillTriangleFill} from 'react-icons/bs';
import { CgSmileMouthOpen} from 'react-icons/cg';
import { MdOutlineKeyboardVoice} from 'react-icons/md';
import { AiOutlineCamera} from 'react-icons/ai';
import { TfiGallery} from 'react-icons/tfi';
import { FiSend} from 'react-icons/fi';
import { GiCrossMark} from 'react-icons/gi';
import ModalImage from "react-modal-image";
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { useDispatch, useSelector} from 'react-redux';
import { getDatabase, ref, onValue,set,push, remove} from "firebase/database";
import { getStorage, ref as sref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
const Chatbox = () => {
    const storage = getStorage();
    const db = getDatabase();
    const activeSingleData = useSelector(state=> state.activeChat.active)
    let data = useSelector((state)=>state.userLoginInfo.userInfo)
    let [camera, setCamera] =useState(false)
    let [cameraPhotoUrl, setCameraPhotoUrl] =useState('')
    let [inputPhotoUrl, setInputPhotoUrl] =useState('')
    let [chatInput, setChatInput] = useState('')
    let [chatList, setChatList] =useState([])
    function handleTakePhoto (dataUri) {
        console.log(dataUri);
      }
      
      let handelSendMsg =()=>{
        let hours = new Date().getHours();
        let minutes = new Date().getMinutes();
        let ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0'+minutes : minutes;
        let strTime = hours + ':' + minutes + ' ' + ampm;
         set(push(ref(db, 'singleChat')),{
              sendid: data.uid,
              sendname: data.displayName,
              msg: chatInput,
              receivid: activeSingleData.id,
              receivname: activeSingleData.name,
              date: strTime,
         });
      }
      let handelImgSend =(e)=>{
        console.log();
        const storageRef = sref(storage, 'message/' + e.target.files[0].name);
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
                setInputPhotoUrl(downloadURL)
            });
        }
        );
      }
      useEffect(()=>{
        const singleChatRef = ref(db, 'singleChat');
        onValue(singleChatRef, (snapshot) => {
           let arr = [];
            snapshot.forEach((item)=>{
                if((data.uid == item.val().sendid && item.val().receivid == activeSingleData.id) 
                || data.uid == item.val().receivid && item.val().sendid == activeSingleData.id){
                    arr.push(item.val()); 
                }
            });
            setChatList(arr);
        });
    },[activeSingleData.id])
  return (
    <div className='p-3 mt-6 rounded-lg relative bg-white shadow-md'>
         <div>
                {/* Recever profile start */}
                <div className='flex p-2 border-b-2 bg-slate-100 mb-1 rounded-md'>
                    <div className='mr-4 w-[52px] h-[54px] rounded-full overflow-hidden'>
                    <img className='w-full h-full' src={activeSingleData.profile}/>
                    </div>
                    <div>
                        <h2 className='font-semibold font-poppins text-sm mt-2'>{activeSingleData.name}</h2>
                        <p className='font-medium font-poppins text-xs text-shadow'>{activeSingleData.email}</p>
                    </div>
                </div>
                {/* Recever profile end */}
                <div className='h-[560px] overflow-y-scroll pr-6'>
                    {/* Recever message start */}
                    {
                       chatList.map(item=>(
                        activeSingleData.status == "singlemsg" 
                        ? activeSingleData.id == item.receivid 
                        ?
                        <div className='relative mr-2 my-1 w-11/12 ml-auto'>
                        <p className='py-2 px-10 bg-secondary rounded-tl-md rounded-tr-md rounded-bl-md w-fit ml-auto  text-white'>{item.msg}</p>
                        <BsFillTriangleFill className='absolute bottom-[17px] -right-2 text-secondary text-xl rotate-6'/>
                        <p className='text-slate-400 text-end text-[12px] mr-2'>{item.date}</p>
                        </div>
                        : activeSingleData.id == item.sendid 
                        &&
                        <div className='relative ml-2 my-1 w-11/12'>
                        <p className='py-2 px-10 bg-slate-200 rounded-tl-md rounded-tr-md rounded-br-md w-fit'>{item.msg}</p>
                        <BsFillTriangleFill className='absolute bottom-[17px] -left-2 text-slate-200 text-xl -rotate-6'/>
                        <p className='text-slate-400 ml-2 text-[12px]'>{item.date}</p>
                        </div>
                        :<h1>Grp msg</h1>
                       )) 
                    }
                    {/* <div className='relative ml-2 my-6 w-11/12'>
                        <p className='py-2 px-10 bg-slate-200 rounded-tl-md rounded-tr-md rounded-br-md w-fit'>Hollo Lorem Ipsum is simply dummy text of the printing Hollo</p>
                        <BsFillTriangleFill className='absolute bottom-[22px] -left-2 text-slate-200 text-xl -rotate-6'/>
                        <p className='text-shadow'>Today, 2:13pm</p>
                    </div> */}
                    {/* Recever message end */}
                    {/* Sender message start */}
                    {/* <div className='relative mr-2 my-6 w-11/12 ml-auto'>
                        <p className='py-2 px-10 bg-secondary rounded-tl-md rounded-tr-md rounded-bl-md w-fit ml-auto  text-white'> printing printing.</p>
                        <BsFillTriangleFill className='absolute bottom-[22px] -right-2 text-secondary text-xl rotate-6'/>
                        <p className='text-shadow text-end'>Today, 2:13pm</p>
                    </div> */}
                    {/* Sender message end */}

                    {/* Recever image start */}
                    {/* <div className='ml-2 my-6 w-64'>
                        <ModalImage className='rounded max-w-[256px]'
                        small='images/profile.png'
                        large='images/profile.png'
                        alt={"Hello "+data.displayName}
                        imageBackgroundColor='#5F35F5'
                        />
                        <p className='text-shadow'>Today, 2:13pm</p>
                    </div> */}
                    {/* Recever image end */}
                    {/* Sender image start */}
                    {/* <div className='relative mr-2 my-6  ml-auto w-64'>
                    <ModalImage className='rounded max-w-[256px] ml-auto'
                        small='images/post.png'
                        large='images/post.png'
                        alt={"Hello "+data.displayName}
                        imageBackgroundColor='#5F35F5'
                        />
                        <p className='text-shadow'>Today, 2:13pm</p>
                    </div> */}
                    {/* Sender image end */}

                    {/* Recever audio start */}
                    {/* <div className='ml-2 my-6 w-64'>
                    <audio controls className='w-full'> </audio>
                        <p className='text-shadow'>Today, 2:13pm</p>
                    </div> */}
                    {/* Recever audio end */}
                    {/* Sender audio start */}
                    {/* <div className='relative mr-2 my-6  ml-auto w-64'>
                    <audio controls className='w-full'> </audio>
                        <p className='text-shadow'>Today, 2:13pm</p>
                    </div> */}
                    {/* Sender audio end */}

                    {/* Recever video start */}
                    {/* <div className='ml-2 my-6 w-64'>
                    <video width="320" height="240" className='rounded-md' controls></video>
                        <p className='text-shadow'>Today, 2:13pm</p>
                    </div> */}
                    {/* Recever video end */}
                    {/* Sender video start */}
                    {/* <div className='relative mr-2 my-6  ml-auto w-64'>
                    <video width="320" height="240" className='rounded-md' controls></video>
                        <p className='text-shadow'>Today, 2:13pm</p>
                    </div> */}
                    {/* Sender video end */}
                            
                </div>
            </div>
           
        <div className='border-t-2 pt-2 mt-1 flex items-center gap-2 '>
            
            <div className='bg-slate-200 py-1 rounded-md flex items-center px-4 w-full relative'>
                <input onChange={(e)=>setChatInput(e.target.value)} className='bg-slate-200 py-2  outline-none w-full'/>
                {
                    inputPhotoUrl == ''
                    ?<div className='flex'>
                         <MdOutlineKeyboardVoice className='text-2xl text-shadow'/>
                <CgSmileMouthOpen className='text-2xl text-shadow mx-2'/>
                <div>
                  <AiOutlineCamera onClick={()=>setCamera(!camera)} className='text-2xl text-shadow cursor-pointer'/>
                  {
                    camera&&
                    <div className='absolute w-full h-fit top-20 left-0 rounded-md overflow-hidden bg-primary'>
                        <div onClick={()=>setCamera(!camera)} className='flex justify-end items-center gap-1 w-fit cursor-pointer ml-auto'>
                            <p className='font-semibold font-poppins text-xl text-white'>Close</p>
                            <GiCrossMark className='text-white text-2xl'/>
                        </div>
                            <Camera
                            onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
                            idealFacingMode = {FACING_MODES.ENVIRONMENT}
                            imageType = {IMAGE_TYPES.JPG}
                            imageCompression = {0.97}
                            isMaxResolution = {true}
                            isImageMirror = {true}
                            isSilentMode = {false}
                            isDisplayStartCameraError = {true}
                            isFullscreen = {false}
                            sizeFactor = {1}
                        />                       
                     </div>
                  }
                     
                </div>
                <label>
                  <TfiGallery className='text-2xl text-shadow ml-2 cursor-pointer'/>
                  <input onChange={handelImgSend} type='file' className='hidden'></input>
                </label>
                </div>
                :<div className='absolute w-full bottom-0 left-0 p-3 bg-slate-200 rounded-md'>
                      <img className='max-w-[100px]' src={inputPhotoUrl}/>
                    </div>
                }
               
            </div>
            {
               (inputPhotoUrl != '') || (chatInput != '')
                &&
               <button onClick={handelSendMsg} className='text-2xl text-white p-2 bg-secondary rounded-md'><FiSend/></button>
            }
        </div>
    </div>
  )
}

export default Chatbox
