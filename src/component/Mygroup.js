import React, { useEffect, useState } from 'react'
import { BiDotsVerticalRounded} from 'react-icons/bi';
import { HiOutlineInformationCircle} from 'react-icons/hi';
import { FcSearch} from 'react-icons/fc';
import { GiCrossMark} from 'react-icons/gi';
import { AiTwotoneDelete, AiOutlineUsergroupAdd} from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { getDatabase, ref, onValue, set,push , remove} from "firebase/database";
const Mygroup = () => {
    const db = getDatabase();
    let data = useSelector((state)=>state.userLoginInfo.userInfo);
    let [grouplist, setGroupList] = useState([]);
    let [btnShow, setBtnShow] = useState(true);
    let [collectdata, setCollectdata] = useState([]);
    let [delateBox, setDelateBox] = useState(false);
    let [reqModal, setReqModal] = useState(false);
    let [accModal, setAccModal] = useState(false);
    let [joinReqList, setJoinReqList] = useState([]);
    let [groupMember, setGroupMember] = useState([]);
    let [filterGroup, setFilterGroup] = useState([])
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
    },[]);
    let handelcollectdata = (item)=>{
        setBtnShow(!btnShow)
        setCollectdata(item.groupAdminId + item.groupid);
    }
    let handelDelateGroup = (item)=>{
        remove(ref(db, 'group/'+item.groupid)).then(()=>{
            setDelateBox(false)
        })         
    } 
    let handelDelateBox = ()=>{
        setBtnShow(!btnShow);
        setDelateBox(!delateBox);
    }
    let handelJoinReq = (gitem)=>{
        setBtnShow(!btnShow);
        setReqModal(!reqModal)
        const groupJoinReqRef = ref(db, 'groupJoinReq/');
        onValue(groupJoinReqRef, (snapshot) => {
           let arr = [];
            snapshot.forEach((item)=>{
                if(data.uid == item.val().groupAdminId && item.val().groupid == gitem.groupid){
                    arr.push({...item.val(), joinid: item.key});
                }
            });
            setJoinReqList(arr);
        });
    }
    let handelRejectjoinreq = (item)=>{
            remove(ref(db, 'groupJoinReq/'+item.joinid))
    }
    let handelAcceptjoinreq = (item)=>{
        set(push(ref(db, 'groupmembers')), {
            ...item,
          }).then(()=>{
                remove(ref(db, 'groupJoinReq/'+item.joinid))
           });
    }
    let handelgroupmember =(mitem)=>{
        setAccModal(!accModal)
        setBtnShow(!btnShow)
        const groupmembersRef = ref(db, 'groupmembers/');
        onValue(groupmembersRef, (snapshot) => {
           let arr = [];
            snapshot.forEach((item)=>{
                if(data.uid == item.val().groupAdminId && item.val().groupid == mitem.groupid){
                    arr.push({...item.val(), joinid: item.key});
                }
            });
            setGroupMember(arr);
        });
    };
    let handelSearch =(e)=>{
        let arr = [];
        if(e.target.value.length == 0){
            setFilterGroup([])
        }else{
            grouplist.filter((item)=>{           
              if(item.groupName.toLowerCase().includes(e.target.value.toLowerCase())){
                  arr.push(item)
              }
              setFilterGroup(arr)
            })
      }         
  };
  return (
    <div className='h-[347px] pt-5 pb-5 pl-5 shadow-md mt-11 rounded-lg relative'>
      <div className='flex justify-between pr-8 items-center'>
            <h2 className='text-sm font-poppins font-semibold text-black'>Your Groups</h2>
            <div className='flex items-center shadow-md px-2'>
                <input type="text" placeholder="Search" className='outline-none rounded-lg text-shadow font-semibold text-lg'
                onChange={handelSearch} />
                <FcSearch className='text-2xl cursor-pointer text-secondar'/>
            </div>
        </div>
        <div className='h-[270px] overflow-y-scroll pr-6'>
            { accModal 
            ? groupMember.length == 0
            ? <div className='absolute top-0 left-0 w-full h-full p-2 rounded bg-slate-400'>
                <div className='flex justify-between items-center'>
                    <p className='justify-center font-medium font-poppins text-2xl text-secondary'>Group Members :</p>
                    <div onClick={()=>setAccModal(!accModal)} className='cursor-pointer flex items-center text-2xl gap-1'>
                        <GiCrossMark className='text-secondary'/>
                        <p className='text-secondary '>Close</p>
                    </div>
                </div>
                 <p className='h-full flex items-center justify-center font-medium font-poppins text-2xl text-shadow'>No Group Member</p>
              </div> 
            : groupMember.map((item)=>(
                <div className='absolute top-0 left-0 w-full h-full p-2 rounded bg-slate-400'>
               <div className='flex justify-between items-center'>
                    <p className='justify-center font-medium font-poppins text-2xl text-secondary'>Group Members :</p>
                    <div onClick={()=>setAccModal(!accModal)} className='cursor-pointer flex items-center text-2xl gap-1'>
                        <GiCrossMark className='text-secondary'/>
                        <p className='text-secondary '>Close</p>
                    </div>
                </div>
                <div className=' h-60 overflow-y-scroll pr-5 mt-12'>
                    <div className='flex py-4 border-b-2'>
                        <div className='mr-4 w-[52px] h-[54px]'>
                            <img className='w-full h-full rounded-full' src={item.reqprofile}/>
                        </div>
                        <div>
                            <h2 className='font-semibold font-poppins text-sm mt-2'>{item.reqname}</h2>
                            <p className='font-medium font-poppins text-xs text-shadow'>{item.reqemail}</p>
                        </div>
                        <div className='mt-2 ml-auto'>
                            <button className='inline-block py-2 px-2 ml-2 bg-red-500 font-semibold font-poppins text-sm text-white rounded-lg'
                              >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>          
            </div> 
              )) 
            :
             reqModal
            ? joinReqList.length == 0
            ? <div className='absolute top-0 left-0 w-full h-full p-2 rounded bg-slate-400'>
                 <div onClick={()=>setReqModal(!reqModal)} className='absolute top-5 right-5 cursor-pointer flex items-center text-2xl gap-1'>
                    <GiCrossMark className='text-secondary'/>
                    <p className='text-secondary '>Close</p>
                </div>
                <p className='h-full flex items-center justify-center font-medium font-poppins text-2xl text-shadow'>No Joining Request</p>
            </div> 
            : joinReqList.map((item)=>(
                <div className='absolute top-0 left-0 w-full h-full p-2 rounded bg-slate-400'>
                    <div onClick={()=>setReqModal(!reqModal)} className='absolute top-5 right-5 cursor-pointer flex items-center text-2xl gap-1'>
                        <GiCrossMark className='text-secondary'/>
                        <p className='text-secondary '>Close</p>
                    </div>
                    <div className='h-[270px] overflow-y-scroll pr-5 mt-12'>
            
                        <div className='flex py-4 border-b-2'>
                            <div className='mr-4 w-[52px] h-[54px]'>
                                <img className='w-full h-full rounded-full' src={item.reqprofile}/>
                            </div>
                            <div>
                                <h2 className='font-semibold font-poppins text-sm mt-2'>{item.reqname}</h2>
                                <p className='font-medium font-poppins text-xs text-shadow'>{item.reqemail}</p>
                            </div>
                            <div className='mt-2 ml-auto'>
                                <button className='inline-block py-2 px-2 bg-secondary font-semibold font-poppins text-sm text-white rounded-lg'
                                 onClick={()=>handelAcceptjoinreq(item)}   >
                                    Accept
                                </button>
                                <button className='inline-block py-2 px-2 ml-2 bg-red-500 font-semibold font-poppins text-sm text-white rounded-lg'
                                 onClick={()=>handelRejectjoinreq(item)} >
                                    Reject
                                </button>
                            </div>
                        </div>
                    </div>          
                </div> 
            ))
            : grouplist.length == 0
            ? <p className='h-full flex items-center justify-center font-medium font-poppins text-2xl text-shadow'>No group available</p>
            : filterGroup.length > 0
            ? filterGroup.map((item)=>(
                data.uid == item.groupAdminId
                &&  
                <div className='flex py-4 border-b-2 items-center'>
                    <div className='mr-4 w-[52px] h-[54px]'>
                    <img src='./images/friendreq-one.png'/>
                    </div>
                    <div>
                        <h2 className='font-semibold font-poppins text-sm mt-2'>{item.groupName}</h2>
                        <p className='font-medium font-poppins text-xs text-shadow'>{item.groupTag}</p>
                        <p className='font-medium font-poppins text-xs text-shadow mt-2'>Admin : {item.groupAdminName}</p>
                    </div>

                    <BiDotsVerticalRounded onClick={()=>handelcollectdata(item)} className='text-2xl cursor-pointer text-secondary ml-auto'/>
                    { btnShow && collectdata.includes(item.groupAdminId + item.groupid) &&
                        <div className='absolute top-0 left-0 w-full h-full pl-2 rounded bg-slate-400 flex flex-col justify-center gap-3'>
                            <div onClick={()=>setBtnShow(!btnShow)} className='absolute top-5 right-5 cursor-pointer flex items-center text-2xl gap-1'>
                                <GiCrossMark className='text-secondary'/>
                                <p className='text-secondary '>Close</p>
                            </div>
                            <div onClick={handelDelateBox} className='flex items-center w-fit group'>
                                <AiTwotoneDelete className='text-secondary text-2xl group-hover:text-3xl transition-all'/>
                                <button 
                                className='inline-block w-fit py-2 px-5 font-semibold font-poppins text-2xl text-secondary rounded-lg'>Delate Group</button>
                            </div>
                            <div onClick={()=>handelJoinReq(item)} className='flex items-center w-fit  group'>
                                <AiOutlineUsergroupAdd className='text-secondary text-2xl group-hover:text-3xl transition-all'/>
                                <button 
                                    className='inline-block  py-2 px-5 font-semibold font-poppins text-2xl text-secondary rounded-lg'>Member Request</button>
                            </div>
                            <div onClick={()=>handelgroupmember(item)} className='flex items-center w-fit group'>
                                <HiOutlineInformationCircle className='text-secondary text-2xl group-hover:text-3xl transition-all'/>
                                <button 
                                className='inline-block w-fit py-2 px-5 font-semibold font-poppins text-2xl text-secondary rounded-lg'>Information</button>
                            </div>
                        </div>
                    }
                    {delateBox && collectdata.includes(item.groupAdminId + item.groupid) &&
                        <div className='absolute top-0 left-0 w-full h-full rounded bg-slate-400 flex items-center text-center'>
                            <div>
                            <p className='font-nunito font-bold text-xl text-primary p-8'>Are you sure you want to delate your <span className='text-secondary'>{item.groupName}</span> group ?</p>
                            <button onClick={()=>handelDelateGroup(item)} className='inline-block py-2 px-5 mr-3 bg-secondary font-semibold font-poppins text-sm text-white rounded-lg'>Yes</button>
                            <button onClick={()=>setDelateBox(!delateBox)} className='inline-block py-2 px-5 bg-secondary font-semibold font-poppins text-sm text-white rounded-lg'>No</button>
                            </div>
                        </div>                        
                    }
                </div>
               ))
            : grouplist.map((item)=>(
                data.uid == item.groupAdminId
                &&  
                <div className='flex py-4 border-b-2 items-center'>
                    <div className='mr-4 w-[52px] h-[54px]'>
                    <img src='./images/friendreq-one.png'/>
                    </div>
                    <div>
                        <h2 className='font-semibold font-poppins text-sm mt-2'>{item.groupName}</h2>
                        <p className='font-medium font-poppins text-xs text-shadow'>{item.groupTag}</p>
                        <p className='font-medium font-poppins text-xs text-shadow mt-2'>Admin : {item.groupAdminName}</p>
                    </div>

                    <BiDotsVerticalRounded onClick={()=>handelcollectdata(item)} className='text-2xl cursor-pointer text-secondary ml-auto'/>
                    { btnShow && collectdata.includes(item.groupAdminId + item.groupid) &&
                        <div className='absolute top-0 left-0 w-full h-full pl-2 rounded bg-slate-400 flex flex-col justify-center gap-3'>
                            <div onClick={()=>setBtnShow(!btnShow)} className='absolute top-5 right-5 cursor-pointer flex items-center text-2xl gap-1'>
                                <GiCrossMark className='text-secondary'/>
                                <p className='text-secondary '>Close</p>
                            </div>
                            <div onClick={handelDelateBox} className='flex items-center w-fit group'>
                                <AiTwotoneDelete className='text-secondary text-2xl group-hover:text-3xl transition-all'/>
                                <button 
                                className='inline-block w-fit py-2 px-5 font-semibold font-poppins text-2xl text-secondary rounded-lg'>Delate Group</button>
                            </div>
                            <div onClick={()=>handelJoinReq(item)} className='flex items-center w-fit  group'>
                                <AiOutlineUsergroupAdd className='text-secondary text-2xl group-hover:text-3xl transition-all'/>
                                <button 
                                    className='inline-block  py-2 px-5 font-semibold font-poppins text-2xl text-secondary rounded-lg'>Member Request</button>
                            </div>
                            <div onClick={()=>handelgroupmember(item)} className='flex items-center w-fit group'>
                                <HiOutlineInformationCircle className='text-secondary text-2xl group-hover:text-3xl transition-all'/>
                                <button 
                                className='inline-block w-fit py-2 px-5 font-semibold font-poppins text-2xl text-secondary rounded-lg'>Information</button>
                            </div>
                        </div>
                    }
                    {delateBox && collectdata.includes(item.groupAdminId + item.groupid) &&
                        <div className='absolute top-0 left-0 w-full h-full rounded bg-slate-400 flex items-center text-center'>
                            <div>
                            <p className='font-nunito font-bold text-xl text-primary p-8'>Are you sure you want to delate your <span className='text-secondary'>{item.groupName}</span> group ?</p>
                            <button onClick={()=>handelDelateGroup(item)} className='inline-block py-2 px-5 mr-3 bg-secondary font-semibold font-poppins text-sm text-white rounded-lg'>Yes</button>
                            <button onClick={()=>setDelateBox(!delateBox)} className='inline-block py-2 px-5 bg-secondary font-semibold font-poppins text-sm text-white rounded-lg'>No</button>
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