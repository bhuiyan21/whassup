import { data } from 'autoprefixer'
import React, {useState } from 'react'
import Sidebar from '../../component/Sidebar'
import { useDispatch, useSelector} from 'react-redux';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { BiCrop, BiDotsVerticalRounded} from 'react-icons/bi';
import { AiFillCamera} from 'react-icons/ai';
const Profile = () => {
    const storage = getStorage();
    const auth = getAuth();
    let data = useSelector((state)=>state.userLoginInfo.userInfo)
    let [uploadModal, setUploadModal] = useState(false);
    let [loader, setLoader] = useState(false);
    let [crop, setCrop] = useState(false);

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
  return (
   <div>
      <Sidebar/>
        <div className='mx-24 relative'>
            <div className='h-44'>
             <img className='w-full h-full rounded' src="images/defaultbackground.png"/>   
            </div>
            <div onClick={handelModalOpen} className='h-40 w-40 rounded-full absolute left-0 -bottom-3/4 border-8 border-white'>
              <img className='w-full h-full rounded-full' src={data.photoURL}/>   
              <div className='absolute flex justify-center items-center right-2  bottom-0 w-10 h-10 rounded-full bg-slate-100'>
               <AiFillCamera className='text-xl text-secondary'/>
              </div>
            </div>
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
   </div>
  )
}

export default Profile
