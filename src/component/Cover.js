import React, { useEffect, useState } from 'react';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { AiFillCamera} from 'react-icons/ai';
import { GiCrossMark} from 'react-icons/gi';
import { getDatabase, ref as sref, onValue,set,push, remove} from "firebase/database";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { useDispatch, useSelector} from 'react-redux';
const Cover = () => {
  let data = useSelector((state)=>state.userLoginInfo.userInfo)
  const db = getDatabase()
    const storage = getStorage();
    const auth = getAuth();
    const [coverUrl, setCoverUrl] = useState("");
    const [covermodal, setCovermodal] = useState(false);
    const [coverpreview, setCoverpreview] = useState(false);
    const [coverMainmodal, setCoverMainmodal] = useState(false);
    const [covercropmodal, setCovercropmodal] = useState(false);
    const [image, setImage] = useState();
    const [cropData, setCropData] = useState("#");
    const [cropper, setCropper] = useState();
    const [coverimg, setCoverimg] = useState('');
    const [coverarr, setCoverarr] = useState([]);
    const handelCover = (e) => {
        setCoverMainmodal(!coverMainmodal)
        setCovermodal(!covermodal)
        setCoverpreview(!coverpreview)
        setCovercropmodal(!covercropmodal)
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
      setCoverimg(files[0].name);
    };
      const uploadCover = ()=>{
        if (typeof cropper !== "undefined") {
          const storageRef = ref(storage,'cover/' + coverimg );
          const message4 = cropper.getCroppedCanvas().toDataURL();
          uploadString(storageRef, message4, 'data_url').then((snapshot) => {
            getDownloadURL(storageRef).then((downloadURL) => {
                setCoverUrl(downloadURL)
          }).then(()=>{
            setImage('')
            setCoverMainmodal(!coverMainmodal)
            setCoverpreview(!coverpreview)
          });
        });
        }
      }
    const getCropData = () => {
      if (typeof cropper !== "undefined") {
        setCropData(cropper.getCroppedCanvas().toDataURL());
      }
    };
    let handelCoverUpload =()=>{
        setCovermodal(!covermodal)
    }
let handelModalCancel =()=>{
    setCoverMainmodal(!coverMainmodal)
    setCoverpreview(!coverpreview)
}
  return (
    <div className='w-full h-56 bg-red-500 rounded-bl-md rounded-br-md'>
        {coverpreview
        ? <div className="w-full h-full rounded overflow-hidden">
            <div className="img-preview w-full h-[300px]"></div>
        </div>
        :
            <img className='w-full h-full rounded' src={coverUrl}/>
        }        
             <div onClick={handelCoverUpload}  className='absolute bottom-3 right-3 py-2 px-3 bg-white rounded-md flex items-center gap-2 cursor-pointer overflow-hidden'>
                <AiFillCamera className='text-xl text-shadow'/>
                <p className='text-shadow'>Edit cover photo</p>
             </div>
           {
            covermodal
            ?
            <div className="absolute top-0 left-0 w-full h-full bg-primary flex justify-center items-center rounded-bl-md rounded-br-md">
                <input onChange={handelCover} type="file"  className="text-white"/> 
                <div onClick={()=>setCovermodal(!covermodal)} className='absolute top-5 right-5 cursor-pointer flex items-center text-xl gap-1'>
                    <GiCrossMark className='text-white'/>
                    <p className='text-white '>Close</p>
                </div>
            </div> 
            : coverMainmodal && <div className="absolute top-0 left-0  w-full h-[650px] z-50 pt-64 px-4 flex justify-center">
                <div className="bg-secondary rounded-lg p-4 flex-col">
                    <Cropper
                    style={{ height: "300px", width: "300px",}}
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
                        <div className="flex gap-2 mt-2 justify-center">
                            <button onClick={uploadCover} className='py-2 px-3 bg-primary rounded-lg text-white text-xl font-poppins font-semibold mr-6'>Upload</button>
                            <button onClick={handelModalCancel} className='py-2 px-3 bg-primary rounded-lg text-white text-xl font-poppins font-semibold'>Cancel</button>
                        </div>
                </div>
            </div>
           }
    </div>
  )
}
export default Cover
