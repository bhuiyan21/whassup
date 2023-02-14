import React, { useEffect, useState } from 'react'
import { BsFillTriangleFill} from 'react-icons/bs';
import { CgSmileMouthOpen} from 'react-icons/cg';
import { MdOutlineKeyboardVoice} from 'react-icons/md';
import { AiOutlineCamera, AiFillDelete} from 'react-icons/ai';
import { TfiGallery} from 'react-icons/tfi';
import { FiSend} from 'react-icons/fi';
import { GiCrossMark} from 'react-icons/gi';
import { HiRefresh} from 'react-icons/hi';
import ModalImage from "react-modal-image";
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { useDispatch, useSelector} from 'react-redux';
import { getDatabase, ref, onValue,set,push, remove} from "firebase/database";
import { getStorage, ref as sref, uploadBytesResumable, getDownloadURL,uploadBytes  } from "firebase/storage";
import { AudioRecorder } from 'react-audio-voice-recorder';
import moment from 'moment';
const Chatbox = () => {
    const storage = getStorage();
    const db = getDatabase();
    const activeSingleData = useSelector(state=> state.activeChat.active)
    let data = useSelector((state)=>state.userLoginInfo.userInfo)
    let [camera, setCamera] =useState(false)
    let [cameraPhotoUrl, setCameraPhotoUrl] =useState('')
    let [inputPhotoUrl, setInputPhotoUrl] =useState('')
    let [audioUrl, setAudioUrl] =useState('')
    let [chatInput, setChatInput] = useState('')
    let [chatList, setChatList] =useState([])
    function handleTakePhoto (dataUri) {
        setCameraPhotoUrl(dataUri);
      }
      let handelCameraClose=()=>{
        setCamera(false)
        setCameraPhotoUrl('')
      }
      let handelSendMsg =()=>{
         set(push(ref(db, 'singleChat')),{
              sendid: data.uid,
              sendname: data.displayName,
              msg: chatInput,
              img: inputPhotoUrl ? inputPhotoUrl:cameraPhotoUrl? cameraPhotoUrl:'',
              audio: audioUrl,
              receivid: activeSingleData.id,
              receivname: activeSingleData.name,
              date: `${new Date().getDate()}-${new Date().getMonth()+1}-${new Date().getFullYear()}`,
         });
         setInputPhotoUrl('')
         setCamera(false)
         setCameraPhotoUrl('')
         setAudioUrl('')
      }
      let handelImgSend =(e)=>{
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

    const addAudioElement = (blob) => {
        const url = URL.createObjectURL(blob);
        
        const audioStorageRef = sref(storage, 'voice/' + url);
        
        // 'file' comes from the Blob or File API
        uploadBytes(audioStorageRef, blob).then((snapshot) => {
            console.log("uploaded");
            getDownloadURL(audioStorageRef).then((downloadURL) => {
                console.log('File available at', downloadURL);
                setAudioUrl(downloadURL)
          });
        });   
      };
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
                        ? item.img
                        ?<div className='relative mr-2 my-1 ml-auto w-64'>
                        <ModalImage className='rounded max-w-[256px] ml-auto'
                            small={item.img}
                            large={item.img}
                            alt={"Hello "+data.displayName}
                            imageBackgroundColor='#5F35F5'
                            />
                            <p className='text-shadow'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
                        </div>
                        :item.audio
                        ?<div className='relative mr-2 my-6  ml-auto w-64'>
                        <audio controls className='w-full' src={item.audio}> </audio>
                            <p className='text-shadow'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
                        </div>
                        :
                        <div className='relative mr-2 my-1 w-11/12 ml-auto'>
                        <p className='py-2 px-10 bg-secondary rounded-tl-md rounded-tr-md rounded-bl-md w-fit ml-auto  text-white'>{item.msg}</p>
                        <BsFillTriangleFill className='absolute bottom-[17px] -right-2 text-secondary text-xl rotate-6'/>
                        <p className='text-slate-400 text-end text-[12px] mr-2'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
                        </div>
                        : activeSingleData.id == item.sendid 
                        && item.img
                        ?<div className='ml-2 my-1 w-64'>
                        <ModalImage className='rounded max-w-[256px]'
                        small={item.img}
                        large={item.img}
                        alt={"Hello "+data.displayName}
                        imageBackgroundColor='#5F35F5'
                        />
                        <p className='text-shadow'>{item.date}</p>
                        </div>
                        :item.audio
                        ?<div className='ml-2 my-6 w-64'>
                        <audio controls className='w-full' src={item.audio}> </audio>
                            <p className='text-shadow'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
                        </div>
                        :
                        <div className='relative ml-2 my-1 w-11/12'>
                        <p className='py-2 px-10 bg-slate-200 rounded-tl-md rounded-tr-md rounded-br-md w-fit'>{item.msg}</p>
                        <BsFillTriangleFill className='absolute bottom-[17px] -left-2 text-slate-200 text-xl -rotate-6'/>
                        <p className='text-slate-400 ml-2 text-[12px]'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
                        </div>
                        :<h1>Grp msg</h1>
                       )) 
                    }
                    {/* Recever image start */}
                    {/*  */}
                    {/* Recever image end */}
                    {/* Sender image start */}
                    {/*  */}
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
           
        <div className='border-t-2 pt-2 mt-1 flex items-center gap-2'>
            
            <div className='bg-slate-200 py-1 rounded-md px-4 w-full relative'>
            
                
                {
                    inputPhotoUrl == ''
                    ?audioUrl
                    ?<div className='flex items-center w-full'>
                           <AiFillDelete onClick={()=>setAudioUrl('')} className='text-3xl text-white bg-primary rounded-md cursor-pointer'/>
                           <audio controls className='w-full' src={audioUrl}></audio>
                        </div>
                    :
                    <div className='flex items-center relative'>
                        <input onChange={(e)=>setChatInput(e.target.value)} className='bg-slate-200 py-2  outline-none w-full'/>
                         
                         <AudioRecorder onRecordingComplete={addAudioElement} />
                         <CgSmileMouthOpen className='text-2xl text-shadow mx-2'/>
                        <div>
                        <AiOutlineCamera onClick={()=>setCamera(!camera)} className='text-2xl text-shadow cursor-pointer'/>
                        {
                            camera&&
                            <div className='absolute w-full h-fit bottom-0 left-0 rounded-md overflow-hidden bg-slate-200'>
                                <div  className='flex justify-between cursor-pointer ml-auto'>
                            <div onClick={()=>setCameraPhotoUrl('')} className='flex gap-1'>
                               <p className='font-semibold font-poppins text-xl text-secondary'>Retry</p>
                               <HiRefresh className='text-secondary text-2xl'/>
                            </div>
                            <div onClick={handelCameraClose} className='flex gap-1'>
                               <p className='font-semibold font-poppins text-xl text-secondary'>Close</p>
                               <GiCrossMark className='text-secondary text-2xl'/>
                            </div>
                        </div>
                        {
                            cameraPhotoUrl
                            ?<img src={cameraPhotoUrl}/>
                            :<Camera
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
                        }
                                                
                     </div>
                  }
                     
                </div>
                <label>
                  <TfiGallery className='text-2xl text-shadow ml-2 cursor-pointer'/>
                  <input onChange={handelImgSend} type='file' className='hidden'></input>
                </label>
                </div>
                :<div className='absolute w-full bottom-0 left-0 p-3 bg-slate-200 rounded-md flex justify-between'>
                    <div>
                      <img className='max-w-[100px]' src={inputPhotoUrl}/>
                    </div>
                    <div onClick={()=>setInputPhotoUrl('')} className='flex gap-1 items-center h-fit cursor-pointer'>
                               <p className='font-semibold font-poppins text-sm text-secondary'>Close</p>
                               <GiCrossMark className='text-secondary text-sm'/>
                            </div>
                    </div>
                }
               
            </div>
            {
               inputPhotoUrl !== '' || chatInput !== '' || cameraPhotoUrl || audioUrl
                ?
               <button onClick={handelSendMsg} className='text-2xl text-white p-2 bg-secondary rounded-md'><FiSend/></button>
               :''
            }
        </div>
    </div>
  )
}

export default Chatbox
