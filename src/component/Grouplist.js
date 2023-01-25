import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { getDatabase, ref, onValue, set,push} from "firebase/database";
import { Dna } from  'react-loader-spinner'
const Grouplist = () => {
    const db = getDatabase();
    let [grouplist, setGroupList] = useState([]);
    let data = useSelector((state)=>state.userLoginInfo.userInfo);
    let [show, setShow] = useState(false);
    let [gname, setGname] = useState("");
    let [gtag, setGtag] = useState("");
    let [gnameErr, setGnameErr] = useState("");
    let [gtagErr, setGtagErr] = useState("");
    let [loading, setLoading] = useState(true);
    let [joinreq, seJoinreq] = useState([]);
    let [member, setMember] = useState([]);
    let handelShow = ()=>{
        setShow(!show)
    };
    let handelGname = (e)=>{
        setGname(e.target.value)
        setGnameErr('')
    }
    let handelGtag = (e)=>{
        setGtag(e.target.value)
        setGtagErr('')
    }   
    let handelGroup = ()=>{
        if(gname == ""){
            setGnameErr("Please give a group name")
        }else if(gtag == ""){
            setGtagErr("Please give a tagline")
        }else{
            setLoading(false)
          set(push(ref(db, 'group')), {
            groupName: gname,
            groupTag: gtag,
            groupAdminName: data.displayName,
            groupAdminId: data.uid,
           });
           setTimeout(() => {
            setShow(!show)
            setLoading(true)
           }, 1000);
        }
    }
   
    useEffect(()=>{
        const groupRef = ref(db, 'group/');
        onValue(groupRef, (snapshot) => {
           let arr = [];
            snapshot.forEach((item)=>{
                    arr.push({...item.val(), groupid: item.key}); 
            });
            setGroupList(arr);
        });
    },[]);
    let handelJoin = (item)=>{
        set(push(ref(db, 'groupJoinReq')), {
            groupAdminId: item.groupAdminId,
            groupid: item.groupid,
            reqname: data.displayName,
            reqprofile: data.photoURL,
            reqid: data.uid,
            reqemail: data.email,
           });
    }
    useEffect(()=>{
        const groupJoinReqRef = ref(db, 'groupJoinReq/');
        onValue(groupJoinReqRef, (snapshot) => {
           let arr = [];
            snapshot.forEach((item)=>{
                if(data.uid != item.groupAdminId){
                    arr.push(item.val().reqid + item.val().groupid)
                }
            });
            seJoinreq(arr)
        });
    },[])
    useEffect(()=>{
        const groupmembersRef = ref(db, 'groupmembers/');
        onValue(groupmembersRef, (snapshot) => {
           let arr = [];
            snapshot.forEach((item)=>{
                if(data.uid != item.groupAdminId){
                    arr.push(item.val().reqid + item.val().groupid)
                }
            });
            setMember(arr)
        });
    },[])
  return (
    <div className='h-[347px] pt-5 pb-5 pl-5 shadow-md mt-11 rounded-lg relative'>
        <div className='flex justify-between items-center py-2'>
            <h2 className='text-sm font-poppins font-semibold text-black'>Groups List</h2>
            { show
                ?<button onClick={handelShow} className='text-sm font-poppins font-semibold text-white rounded-lg py-2 px-5 bg-secondary'>Go Back</button>
                :<button onClick={handelShow} className='text-sm font-poppins font-semibold text-white rounded-lg py-2 px-5 bg-secondary'>Create group</button>
            }
        </div>
        {
            show
            ? <div className='m-6 '>
                <div className='relative pb-8'>
                    <input onChange={handelGname}  className='border-2 py-2 px-5 rounded-lg border-primary w-full font-nunito font-semibold text-xl text-primary' placeholder='Group name'/>
                    <h2 className=' font-openSans font-semibold text-red-600 text-lg absolute bottom-0 left-0'>{gnameErr}</h2>
                </div>
                <div className='relative pb-8'>
                    <input onChange={handelGtag}  className='border-2 py-2 px-5 rounded-lg border-primary w-full font-nunito font-semibold text-xl text-primary' placeholder='Group name'/>
                    <h2 className=' font-openSans font-semibold text-red-600 text-lg absolute bottom-0 left-0'>{gtagErr}</h2>
                </div>
                {
                    loading
                    ?<button 
                    className='bg-secondary w-full hover:bg-primary py-4 px-10 inline-block text-white font-nunito font-semibold text-xl rounded-3xl'
                    onClick={handelGroup}>Create</button>
                    : <div className='flex justify-center'>
                    <Dna
                  visible={true}
                  height="80"
                  width="80"
                  ariaLabel="dna-loading"
                  wrapperStyle={{}}
                  wrapperClass="dna-wrapper"
                  />
                  </div>
                }
            </div>
            :
             <div className='h-[270px] overflow-y-scroll pr-6'>
                {
                     grouplist.length == 0
                     ? <p className='h-full flex items-center justify-center font-medium font-poppins text-2xl text-shadow'>No group available</p>
                     :grouplist.map((item)=>(
                        data.uid == item.groupAdminId
                        ?
                        <div className='flex items-center py-4 border-b-2'>
                        <div className='mr-4 w-[70px] h-[70px]'>
                            <img src='./images/group-one.png'/>
                            </div>
                            <div>
                                <h2 className='font-semibold font-poppins text-sm mt-2'>{item.groupName}</h2>
                                <p className='font-medium font-poppins text-xs text-shadow'>{item.groupTag}</p>
                                <p className='font-medium font-poppins text-xs text-shadow mt-2'>Your group</p>
                            </div>
                            <div className='mt-2 ml-auto'>
                             <p className='font-poppins font-medium text-xs text-shadow'>Today, 8:56pm</p>
                             </div>
                        </div>
                        :<div className='flex py-4 border-b-2 items-center'>
                        <div className='mr-4 w-[70px] h-[70px]'>
                            <img src='./images/group-one.png'/>
                            </div>
                            <div>
                                <h2 className='font-semibold font-poppins text-sm mt-2'>{item.groupName}</h2>
                                <p className='font-medium font-poppins text-xs text-shadow'>{item.groupTag}</p>
                                <p className='font-medium font-poppins text-xs text-shadow mt-2'>Admin : {item.groupAdminName}</p>
                            </div>
                            <div className='mt-2 ml-auto'>
                                {
                                    joinreq.includes(data.uid + item.groupid)
                                    ? <button className=' inline-block py-2 px-3 bg-secondary font-semibold font-poppins text-sm text-white rounded-lg'>Pending</button>
                                    : member.includes(data.uid + item.groupid)
                                    ?<p className='font-poppins font-medium text-xs text-shadow'>Today, 8:56pm</p>
                                    : <button onClick={()=>handelJoin(item)} className=' inline-block py-2 px-6 bg-secondary font-semibold font-poppins text-sm text-white rounded-lg'>Join</button>
                                }
                               
                            </div>
                        </div>
                    ))
                }
              </div>
        }
    </div>
  )
}

export default Grouplist
