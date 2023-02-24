import React, { useEffect, useReducer, useState } from 'react'
import { BsFillTriangleFill,BsThreeDotsVertical} from 'react-icons/bs';
import { CgSmileMouthOpen} from 'react-icons/cg';
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
import EmojiPicker from 'emoji-picker-react';
import ScrollToBottom from 'react-scroll-to-bottom';
import Friend from './Friend';
import { forword } from '../slices/userInfo/forwordSlice';
let initialState ={
    dotModal: false,
}
function reducer(state, action){
   switch(action.type){
        case action.type: return{ dotModal: state.dotModal = true, modalKey: action.type};
        case action.type: return{ dotModal: state.dotModal = true, modalKey: action.type};
        case action.type: return{dotModal: state.dotModal = true , modalKey: action.type};
   }
}
const Chatbox = () => {
    const dispatches = useDispatch()
    let [state, dispatch] = useReducer(reducer, initialState);
    const storage = getStorage();
    const db = getDatabase();
    const activeSingleData = useSelector(state=> state.activeChat.active)
    let data = useSelector((state)=>state.userLoginInfo.userInfo)
    let [camera, setCamera] =useState(false)
    let [emojiModal, setEmojiModal] =useState(false)
    let [forwordModal, setForwordModal] =useState(false)
    let [cameraPhotoUrl, setCameraPhotoUrl] =useState('')
    let [inputPhotoUrl, setInputPhotoUrl] =useState('')
    let [audioUrl, setAudioUrl] =useState('')
    let [chatInput, setChatInput] = useState('')
    let [chatList, setChatList] =useState([])
    let [gmsgList, setGmsgList] =useState([])
    function handleTakePhoto (dataUri) {
        setCameraPhotoUrl(dataUri);
      }
      let handelCameraClose=()=>{
        setCamera(false)
        setCameraPhotoUrl('')
      }
      let handelmodalKey =()=>{
        if(activeSingleData.status == "singlemsg" ){
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
        }else{
            set(push(ref(db, 'groupChat')),{
                sendid: data.uid,
                sendname: data.displayName,
                sendprofile: data.photoURL,
                msg: chatInput,
                img: inputPhotoUrl ? inputPhotoUrl:cameraPhotoUrl? cameraPhotoUrl:'',
                audio: audioUrl,
                gid: activeSingleData.gid,
                date: `${new Date().getDate()}-${new Date().getMonth()+1}-${new Date().getFullYear()}`,
           });
           console.log("grp");
        }
         setInputPhotoUrl('')
         setCamera(false)
         setCameraPhotoUrl('')
         setAudioUrl('')
         setChatInput('')
         setEmojiModal(false)
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
                    arr.push({...item.val(), key: item.key}); 
                }
            });
            setChatList(arr);
        });
    },[activeSingleData.id])
      useEffect(()=>{
        const groupChatRef = ref(db, 'groupChat');
        onValue(groupChatRef, (snapshot) => {
           let arr = [];
            snapshot.forEach((item)=>{
                    arr.push(item.val()); 
            });
            setGmsgList(arr);
        });
    },[activeSingleData.id])
    const addAudioElement = (blob) => {
        const url = URL.createObjectURL(blob);
        const audioStorageRef = sref(storage, 'voice/' + url);
        
        uploadBytes(audioStorageRef, blob).then((snapshot) => {
            getDownloadURL(audioStorageRef).then((downloadURL) => {
                setAudioUrl(downloadURL)
          });
        });   
      };
      let handelEmoji=(e)=>{
        setChatInput(chatInput + e.emoji);
      }
      let handelRemove=(item)=>{
          remove(ref(db, 'singleChat/'+item.key))
      }
      let handelForword =(item)=>{
        setForwordModal(!forwordModal)
           dispatches(forword(item))
      }
  return (
    <div className='p-3 rounded-lg relative bg-white shadow-md'>
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
                <ScrollToBottom   className={emojiModal?'h-[260px] pr-6':'h-[560px] transition-all pr-6'}>
                    {/* Recever message start */}
                    {
                        activeSingleData.status == "singlemsg" 
                        ?
                        chatList.map(item=>(
                            activeSingleData.id == item.receivid 
                        ? item.img
                        ?<div className=' mr-2 my-4  flex items-center justify-end gap-2 group'>
                            <BsThreeDotsVertical onClick={()=>dispatch({type: item.key})} className='text-shadow hidden group-hover:block cursor-pointer mb-3'/>
                            <div className='w-64 relative'>
                            <p className='text-slate-400 text-start text-[12px] italic'>{item.forword}</p>
                                <ModalImage className='rounded max-w-[256px] ml-auto'
                                small={item.img}
                                large={item.img}
                                alt={"WhaSsup "+data.displayName+" ?"}
                                imageBackgroundColor='#5F35F5'
                                />
                                <p className='text-slate-400 text-end text-[12px]'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
                                {
                                   (state.modalKey == item.key) && state.dotModal&& <div className='absolute top-1/2 -translate-y-1/2 right-full bg-white shadow-xl p-2 w-28 mr-2 z-20'>
                                    <p onClick={()=>handelRemove(item)} className='cursor-pointer hover:bg-slate-100 py-2 pl-3 rounded-lg'>Remove</p>
                                    <p onClick={()=>handelForword(item)} className='cursor-pointer hover:bg-slate-100 py-2 pl-3 rounded-lg'>Forword</p>
                                    </div>
                                }
                            </div>
                        </div>
                        :item.audio
                        ?<div className=' mr-2 my-4  flex items-center justify-end gap-2 group'>
                            <BsThreeDotsVertical onClick={()=>dispatch({type: item.key})} className='text-shadow hidden group-hover:block cursor-pointer mb-3'/>
                            <div className='w-64 relative'>
                                <p className='text-slate-400 text-start text-[12px] italic'>{item.forword}</p>
                            <audio controls className='w-full' src={item.audio}> </audio>
                            <p className='text-slate-400 text-end text-[12px]'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
                            {
                                 (state.modalKey == item.key) && state.dotModal && <div className='absolute top-1/2 -translate-y-1/2 right-full bg-white shadow-xl p-2 w-28 mr-2 z-20'>
                                    <p onClick={()=>handelRemove(item)} className='cursor-pointer hover:bg-slate-100 py-2 pl-3 rounded-lg'>Remove</p>
                                    <p onClick={()=>handelForword(item)} className='cursor-pointer hover:bg-slate-100 py-2 pl-3 rounded-lg'>Forword</p>
                                    </div>
                                }
                            </div>
                        </div>
                        :
                        <div className=' mr-2 my-4 flex  items-center justify-end gap-2 group'>
                            <BsThreeDotsVertical onClick={()=>dispatch({type: item.key})} className='text-shadow hidden group-hover:block cursor-pointer mb-3'/>
                            <div className='relative max-w-[80%]'>
                            <p className='text-slate-400 text-start text-[12px] italic'>{item.forword}</p>
                                <p className='py-1 px-3 bg-secondary rounded-tl-md rounded-tr-md rounded-bl-md w-fit ml-auto  text-white'>{item.msg}</p>
                                <BsFillTriangleFill className='absolute bottom-[17px] right-[-5px] text-secondary text-sm'/>
                                <p className='text-slate-400 text-end text-[12px] mr-2'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
                                {
                                  (state.modalKey == item.key) && state.dotModal && <div className='absolute top-1/2 -translate-y-1/2 right-full bg-white shadow-xl p-2 w-28 mr-2 z-20'>
                                    <p onClick={()=>handelRemove(item)} className='cursor-pointer hover:bg-slate-100 py-2 pl-3 rounded-lg'>Remove</p>
                                    <p onClick={()=>handelForword(item)} className='cursor-pointer hover:bg-slate-100 py-2 pl-3 rounded-lg'>Forword</p>
                                    </div>
                                }
                            </div>
                        </div>
                        : activeSingleData.id == item.sendid 
                        && item.img
                        ?<div className='ml-2 my-1 w-64'>
                        <p className='text-slate-400 text-start text-[12px] italic'>{item.forword}</p>
                        <ModalImage className='rounded max-w-[256px]'
                        small={item.img}
                        large={item.img}
                        alt={"WhaSsup "+data.displayName+" ?"}
                        imageBackgroundColor='#5F35F5'
                        />
                        <p className='text-slate-400 text-end text-[12px]'>{item.date}</p>
                        </div>
                        :item.audio
                        ?<div className='ml-2 my-6 w-64'>
                        <p className='text-slate-400 text-start text-[12px] italic'>{item.forword}</p>
                        <audio controls className='w-full' src={item.audio}> </audio>
                            <p className='text-slate-400 text-end text-[12px]'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
                        </div>
                        :
                        <div className='relative ml-2 my-1 w-11/12'>
                            <p className='text-slate-400 text-start text-[12px] italic'>{item.forword}</p>
                        <p className='py-2 px-10 bg-slate-200 rounded-tl-md rounded-tr-md rounded-br-md w-fit'>{item.msg}</p>
                        <BsFillTriangleFill className='absolute bottom-[17px] -left-2 text-slate-200 text-sm'/>
                        <p className='text-slate-400 ml-2 text-[12px]'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
                        </div>
                       )) 
                       :gmsgList.map((item)=>(
                        data.uid == item.sendid ?
                        item.gid == activeSingleData.gid &&
                        <div>
                           {item.img
                        ?
                        <div className='flex items-end gap-2 ml-auto'>
                        <div className='relative mr-2 my-1 ml-auto w-64'>
                            <p className='text-slate-400 text-end text-[12px]'>{item.sendname}</p>
                        <ModalImage className='rounded max-w-[256px] ml-auto'
                            small={item.img}
                            large={item.img}
                            alt={"WhaSsup "+data.displayName+" ?"}
                            imageBackgroundColor='#5F35F5'
                            />
                            <p className='text-slate-400 text-end text-[12px]'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
                        </div>
                        <div className='mr-4 w-[25px] h-[25px] rounded-full overflow-hidden mb-6'>
                               <img className='w-full h-full' src={item.sendprofile}/>
                            </div>
                        </div>
                        :item.audio
                        ?<div className='flex items-end gap-2 ml-auto'>
                        <div className='relative mr-2 my-6  ml-auto w-64'>
                            <p className='text-slate-400 text-end text-[12px]'>{item.sendname}</p>
                        <audio controls className='w-full' src={item.audio}> </audio>
                            <p className='text-slate-400 text-end text-[12px]'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
                        </div>
                        <div className='mr-4 w-[25px] h-[25px] rounded-full overflow-hidden mb-6'>
                               <img className='w-full h-full' src={item.sendprofile}/>
                            </div>
                        </div>
                        : <div className='flex items-end gap-2 '>
                           <div className='relative mr-2 my-1 w-4/5 ml-auto'>
                              <p className='text-slate-400 text-end text-[12px] mr-2'>{item.sendname}</p>
                               <p className='px-3 bg-secondary rounded-tl-md rounded-tr-md rounded-bl-md w-fit ml-auto  text-white'>{item.msg}</p>
                               <BsFillTriangleFill className='absolute bottom-[17px] right-[-5px] text-secondary text-sm'/>
                              <p className='text-slate-400 text-end text-[12px] mr-2'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
                            </div>
                            <div className='mr-4 w-[25px] h-[25px] rounded-full overflow-hidden mb-6'>
                               <img className='w-full h-full' src={item.sendprofile}/>
                            </div>
                          </div>
                           }
                        </div>
                        :item.gid == activeSingleData.gid &&
                        <div>
                            {item.img
                        ?<div className='flex items-end gap-1'>
                             <div className='mr-4 w-[25px] h-[25px] rounded-full overflow-hidden mb-6'>
                                <img className='w-full h-full' src={item.sendprofile}/>
                             </div>
                        <div className='ml-2 my-1 w-64'>
                            <p className='text-slate-400  text-[12px]'>{item.sendname}</p>
                        <ModalImage className='rounded max-w-[256px]'
                        small={item.img}
                        large={item.img}
                        alt={"WhaSsup "+data.displayName +" ?"}
                        imageBackgroundColor='#5F35F5'
                        />
                        <p className='text-slate-400  text-[12px]'>{item.date}</p>
                        </div>
                        </div>
                        :item.audio
                        ?<div className='flex items-end gap-1'>
                            <div className='mr-4 w-[25px] h-[25px] rounded-full overflow-hidden mb-6'>
                                <img className='w-full h-full' src={item.sendprofile}/>
                             </div>
                            <div className='ml-2 my-6 w-64'>
                                <p className='text-slate-400 text-end text-[12px]'>{item.sendname}</p>
                                 <audio controls className='w-full' src={item.audio}> </audio>
                                <p className='text-slate-400  text-[12px]'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
                          </div>
                        </div>
                        : <div className='flex items-end gap-1 w-11/12'>
                            <div className='mr-4 w-[25px] h-[25px] rounded-full overflow-hidden mb-6'>
                               <img className='w-full h-full' src={item.sendprofile}/>
                            </div>
                            <div className='relative my-1 w-11/12'>
                            <p className='text-slate-400  text-[12px]'>{item.sendname}</p>
                            <p className='px-3 bg-slate-200 rounded-tl-md rounded-tr-md rounded-br-md w-fit'>{item.msg}</p>
                            <BsFillTriangleFill className='absolute bottom-[17px] left-[-5px] text-slate-200 text-sm'/>
                             <p className='text-slate-400 text-[12px]'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
                            </div>
                            
                            </div>
                            }
                        </div>
                       ))
                    }
                </ScrollToBottom>
            </div>
        <div >
            <div>
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
                            <div>         
                                <div className='flex items-center relative'>
                                    <input onChange={(e)=>setChatInput(e.target.value)} className='bg-slate-200 py-2  outline-none w-full'
                                    value={chatInput}/>
                                    <AudioRecorder onRecordingComplete={addAudioElement} />
                                    <CgSmileMouthOpen onClick={()=>setEmojiModal(!emojiModal)} className='text-2xl text-shadow mx-2 cursor-pointer'/>
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
               <button onClick={handelmodalKey} className='text-2xl text-white p-2 bg-secondary rounded-md'><FiSend/></button>
               :''
               }
              </div>
              {
                emojiModal
                && <EmojiPicker onEmojiClick={handelEmoji}/>
              }
            </div> 
            {
                forwordModal&&
                <div className='w-full h-full bg-white pt-2 absolute top-0 left-0'>
                    <div className='border-b flex justify-between items-center px-2'>
                        <p className='font-semibold font-poppins text-xl'>Forword</p>
                        <div onClick={()=>setForwordModal(!forwordModal)} className='flex gap-2 items-center cursor-pointer'>
                          <p className='font-semibold font-poppins text-sm '>Close</p>
                          <GiCrossMark className=' text-sm'/>
                        </div>
                    </div>
                   <Friend active="forword"/>
               </div>
            }
                
        </div>
    </div>
  )
}

export default Chatbox
