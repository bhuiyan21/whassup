import React, {useState } from 'react'
import { AiOutlineHome, AiOutlineMessage, AiOutlineSetting,AiOutlineCloudUpload,AiFillCamera} from 'react-icons/ai';
import { IoIosNotificationsOutline} from 'react-icons/io';
import { FaSearch} from 'react-icons/fa';
import { BiCrop, BiDotsVerticalRounded} from 'react-icons/bi';
import { ImExit} from 'react-icons/im';
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { useNavigate } from 'react-router';
import { useDispatch, useSelector} from 'react-redux';
import { userLoginInfo } from '../slices/userInfo/userSlice';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
const Sidebar = () => {
  let [uploadModal, setUploadModal] = useState(false);
  let [loader, setLoader] = useState(false);
  let [crop, setCrop] = useState(false);
  const auth = getAuth();
  let data = useSelector((state)=>state.userLoginInfo.userInfo)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const storage = getStorage();
  let handelLogout = ()=>{
    signOut(auth).then(() => {
      dispatch(userLoginInfo(null));
      localStorage.removeItem("userInfo");      
      navigate("/login");
    })
  };
  const [image, setImage] = useState();
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState();
  const handelUpload = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
  
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };
  const getCropData = () => {
    setCrop(true)
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
    }
  };

  const uploadProfile = ()=>{
    if (typeof cropper !== "undefined") {
      setLoader(true)
      const storageRef = ref(storage, auth.currentUser.uid);
      const message4 = cropper.getCroppedCanvas().toDataURL();
      uploadString(storageRef, message4, 'data_url').then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
        updateProfile(auth.currentUser, {
          photoURL: downloadURL,
        }).then(()=>{
          uploadModal && setUploadModal(false);
           setImage("");
           setCropData("");
           setCropper("");
           setLoader(false);
        })
      });
    });
    }
  }
  // =============================
  // console.log(data);
  let handelModalOpen = ()=>{
    !uploadModal && setUploadModal(true);
  }
  let handelModalClose = ()=>{
    uploadModal && setUploadModal(false);
    setCrop(false)
    setImage("")
    setCropData("")
    setCropper("")
  }
 
  return (
    <div className='bg-secondary py-2  rounded-3xl px-20'>
      <div className='flex items-center justify-between mb-2'>
          <h2 className='text-center font-nunito font-bold text-lg text-white'>WhaSsuP</h2>
          <div className='relative w-96'>
            <input type="text" placeholder="Search" className='w-full shadow-md outline-none py-1 pl-16 rounded-lg text-shadow font-semibold text-lg'/>
            <FaSearch className='absolute top-2 left-7 text-2xl cursor-pointer text-secondary'/>
            <BiDotsVerticalRounded className='absolute top-2 right-7 text-2xl cursor-pointer text-secondary'/>
          </div>
      </div>
      <div className='flex justify-between items-center'>
        <div>
          <div className='group w-16 h-16 rounded-full mx-auto relative cursor-pointer' >
            <img src={data.photoURL} className='w-full h-full rounded-full'/>
            <AiFillCamera className='absolute right-0 bottom-0 text-sm text-white z-10'/>
            <div className='w-full h-full rounded-full absolute top-0 left-0 bg-rgba hidden group-hover:block p-3'
            onClick={handelModalOpen}>
              <AiOutlineCloudUpload className='w-full h-full text-white'/>
            </div>
          </div>
          <h1 className='text-center font-nunito font-bold text-sm text-white'>{data.displayName}</h1>
        </div>
        <div className='h-16 bg-white ml-6 rounded-tl-2xl rounded-tr-2xl flex items-center px-5 cursor-pointer relative before:absolute before:w-full before:h-2 before:bg-secondary before:bottom-0 before:left-0 before:rounded-tl-2xl before:rounded-tr-2xl'>
          <AiOutlineHome className="text-3xl text-secondary" />
        </div>
        <div className='h-16 bg-white ml-6 rounded-tl-2xl rounded-tr-2xl flex items-center px-5 cursor-pointer relative before:absolute before:w-full before:h-2 before:bg-secondary before:bottom-0 before:left-0 before:rounded-tl-2xl before:rounded-tr-2xl'>
          <AiOutlineMessage className="text-3xl text-secondary" />
        </div>
        <div className='h-16 bg-white ml-6 rounded-tl-2xl rounded-tr-2xl flex items-center px-5 cursor-pointer relative before:absolute before:w-full before:h-2 before:bg-secondary before:bottom-0 before:left-0 before:rounded-tl-2xl before:rounded-tr-2xl'>
          <IoIosNotificationsOutline className="text-5xl text-secondary" />
        </div>
        <div className='h-16 bg-white ml-6 rounded-tl-2xl rounded-tr-2xl flex items-center px-5 cursor-pointer relative before:absolute before:w-full before:h-2 before:bg-secondary before:bottom-0 before:left-0 before:rounded-tl-2xl before:rounded-tr-2xl'>
          <AiOutlineSetting className="text-3xl text-secondary" />
        </div>
        <div className='h-16 bg-white ml-6 rounded-tl-2xl rounded-tr-2xl flex items-center px-5 cursor-pointer relative before:absolute before:w-full before:h-2 before:bg-secondary before:bottom-0 before:left-0 before:rounded-tl-2xl before:rounded-tr-2xl'
        onClick={handelLogout} >
          <ImExit className="text-3xl text-secondary" />
        </div>
        {
          uploadModal && <div className='absolute top-0 left-0 w-full h-screen bg-secondary z-50 flex justify-center items-center scale-100 transition-all'>
          <div className='w-[30%] p-6 bg-white text-center'>
            <h1 className=' font-nunito font-bold text-3xl text-secondary'>Upload your profile picture</h1>
            <input type='file' className='cursor-pointer my-6 w-72 py-2 px-9 bg-secondary rounded-lg text-white text-xl font-poppins font-semibold text-center'
            onChange={handelUpload}/>       
            {
              image  &&
              <>
              <Cropper
              style={{ height: 400, width: "100%" }}
              zoomTo={0.5}
              initialAspectRatio={1}
              preview=".img-preview"
              src={image}
              viewMode={1}
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              background={false}
              responsive={true}
              autoCropArea={1}
              checkOrientation={false}
              onInitialized={(instance) => {
                setCropper(instance);
              }}
              guides={true}
            />
            
            <div><button onClick={getCropData} className='flex mx-auto py-2 px-4 my-3 bg-secondary rounded-lg text-white text-xl font-poppins font-semibold'> <BiCrop className='mr-2'/> <span>Crop Image</span></button>
              {
                crop && <img src={cropData} className=' w-40 h-40 rounded-full mx-auto my-6' alt="cropped" />
              } 
              </div>
                </>
            }
            <div>
              {
                image &&
                <>{loader ? <button className='py-5 px-14 bg-secondary rounded-lg mr-6 cursor-no-drop'><svg class="animate-spin h-8 w-8 text-white"   viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg></button>
              : <button className='py-6 px-9 bg-secondary rounded-lg text-white text-xl font-poppins font-semibold mr-6'
                  onClick={uploadProfile}>Upload</button>
                }</>
              }
            <button className='py-6 px-9 bg-secondary rounded-lg text-white text-xl font-poppins font-semibold'
            onClick={handelModalClose}>Cancel</button>
            </div>
          </div>
        </div>      
        }
        {
          <div className='absolute top-0 left-0 w-full h-screen bg-[#94a3b881] z-50 flex justify-center items-center scale-100 transition-all'>
            <div className='w-96 p-3 bg-white rounded-lg text-center'>
              <p className='font-nunito font-bold text-3xl text-primary mb-3'>Log out of your account ?</p>
              <button className='py-2 px-3 mr-2 bg-red-500 rounded-lg text-white text-sm font-poppins font-semibold'
              >Log Out</button>
              <button className='py-2 px-3 bg-secondary rounded-lg text-white text-sm font-poppins font-semibold'
              >Cancel</button>
              </div>
          </div>
        }
      </div>
    </div>
  )
}

export default Sidebar