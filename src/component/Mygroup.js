import React, { useEffect, useState } from 'react'
import { BiDotsVerticalRounded} from 'react-icons/bi';
import { HiOutlineInformationCircle} from 'react-icons/hi';
import { GiCrossMark} from 'react-icons/gi';
import { AiTwotoneDelete, AiOutlineUsergroupAdd} from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { getDatabase, ref, onValue, set,push , remove} from "firebase/database";
const Mygroup = () => {
    const db = getDatabase();
    let data = useSelector((state)=>state.userLoginInfo.userInfo);
    let [grouplist, setGroupList] = useState([]);
    let [delateBox, setDelateBox] = useState(false);
    let [dltGroup, setDltGroup] = useState([]);
    let [show, setShow] = useState(true);
    useEffect(()=>{
        const groupRef = ref(db, 'group/');
        onValue(groupRef, (snapshot) => {
           let arr = [];
            snapshot.forEach((item)=>{
                if(data.uid == item.val().groupAdminId){
                    arr.push({...item.val(), groupid: item.key});    
                    
                }
            });
            setGroupList(arr);
        });
    },[])
    let handelDelateGroup = (item)=>{
        remove(ref(db, 'group/'+item.groupid)).then(()=>{
            setDelateBox(false)
        })         
    } 
    let handelDelateBox = (item)=>{
        setShow(!show)
        setDelateBox(true)
        setDltGroup(item.groupid + item.groupAdminId)
    }
  return (
    <div className='h-[347px] pt-5 pb-5 pl-5 shadow-md mt-11 rounded-lg relative'>
      <h2 className='text-sm font-poppins font-semibold text-black'>My Groups</h2>
      <BiDotsVerticalRounded className='absolute top-0 right-7 lef-0 text-2xl cursor-pointer text-secondary'/>
           <div className='h-[270px] overflow-y-scroll pr-6'>
            {
             grouplist.length == 0
                ? <p className='h-full flex items-center justify-center font-medium font-poppins text-2xl text-shadow'>No group available</p>
                :  grouplist.map((item)=>(
                    data.uid == item.groupAdminId
                    && delateBox && dltGroup.includes(item.groupid + item.groupAdminId)
                    ?<div className='p-7 w-full text-center'>
                    <p className='font-nunito font-bold text-xl text-primary p-7'>Are you sure to delate your <span className='text-secondary'>{item.groupName}</span> group ?</p>
                    <button onClick={()=>handelDelateGroup(item)} className='inline-block py-2 px-5 mr-3 bg-secondary font-semibold font-poppins text-sm text-white rounded-lg'>Yes</button>
                    <button onClick={()=>setDelateBox(!delateBox)} className='inline-block py-2 px-5 bg-secondary font-semibold font-poppins text-sm text-white rounded-lg'>No</button>
                   </div>
                : <div className='flex py-4 border-b-2 items-center'>
                    <div className='mr-4 w-[52px] h-[54px]'>
                       <img src='./images/friendreq-one.png'/>
                    </div>
                    <div>
                        <h2 className='font-semibold font-poppins text-sm mt-2'>{item.groupName}</h2>
                        <p className='font-medium font-poppins text-xs text-shadow'>{item.groupTag}</p>
                        <p className='font-medium font-poppins text-xs text-shadow mt-2'>Admin : {item.groupAdminName}</p>
                    </div>
                   
                    {
                        show
                        ?  <BiDotsVerticalRounded
                        onClick={()=>setShow(!show)} className='text-2xl cursor-pointer text-secondary ml-auto'/>
                        :  <div className='absolute top-0 left-0 w-full h-full pl-2 rounded bg-slate-400 flex flex-col justify-center gap-3'>
                            <div onClick={()=>setShow(!show)} className='absolute top-5 right-5 cursor-pointer flex items-center text-2xl gap-1'>
                                <GiCrossMark className='text-secondary'/>
                                <p className='text-secondary '>Close</p>
                            </div>
                            <div onClick={()=>handelDelateBox(item)} className='flex items-center w-fit group'>
                                <AiTwotoneDelete className='text-secondary text-2xl group-hover:text-3xl transition-all'/>
                                <button 
                                 className='inline-block w-fit py-2 px-5 font-semibold font-poppins text-2xl text-secondary rounded-lg'>Delate Group</button>
                            </div>
                            <div  className='flex items-center w-fit  group'>
                                <AiOutlineUsergroupAdd className='text-secondary text-2xl group-hover:text-3xl transition-all'/>
                                <button 
                                  className='inline-block  py-2 px-5 font-semibold font-poppins text-2xl text-secondary rounded-lg'>Member Request</button>
                            </div>
                            <div  className='flex items-center w-fit group'>
                                <HiOutlineInformationCircle className='text-secondary text-2xl group-hover:text-3xl transition-all'/>
                                <button 
                                 className='inline-block w-fit py-2 px-5 font-semibold font-poppins text-2xl text-secondary rounded-lg'>Information</button>
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

export default Mygroup

// dsfgijdaskfj[ioclear