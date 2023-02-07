import React from 'react'

const Userprofile = () => {
  return (
    <div>
      <div className='p-8 bg-white rounded-md'>
        <h2 className='font-semibold font-poppins text-xl'>About</h2>
        <p className='font-regular font-poppins text-sm w-2/3 mt-2'>I'm more experienced in eCommerce web projects and mobile banking apps, but also like to work with creative projects, such as landing pages or unusual corporate websites. </p>
      </div>
      <div className='p-8 bg-white rounded-md my-6'>
        <h2 className='font-semibold font-poppins text-xl'>Projects</h2>
        <div className='flex justify-between mt-3'>
          <img className='w-[28%] rounded-md' src='images/project-1.png'/>
          <img className='w-[28%] rounded-md' src='images/project-2.png'/>
          <img className='w-[28%] rounded-md' src='images/project-3.png'/>
        </div>
      </div>
      <div className='p-8 bg-white rounded-md my-6'>
        <h2 className='font-semibold font-poppins text-xl'>Exparience</h2>
        <div className='flex gap-3 border-b py-5'>
          <img className='w-16 h-16' src='images/web-logo.png'/>
          <div>
            <h2 className='font-medium font-poppins text-lg mb-3'>Freelance UX/UI designer</h2>
            <p className='font-regular font-openSans text-sm text-shadow'>Self Employed</p>
            <p className='font-regular font-openSans text-sm text-shadow my-2'>Jun 2016 — Present</p>
            <p className='font-regular font-openSans text-sm w-2/3'>Work with clients and web studios as freelancer.  Work in next areas: eCommerce web projects; creative landing pages; iOs and Android apps; corporate web sites and corporate identity sometimes.</p>
          </div>
        </div>
        <div className='flex gap-3 py-5'>
          <img className='w-16 h-16' src='images/up-logo.png'/>
          <div>
            <h2 className='font-medium font-poppins text-lg mb-3'>UX/UI designer</h2>
            <p className='font-regular font-openSans text-sm text-shadow'>Upwork</p>
            <p className='font-regular font-openSans text-sm text-shadow my-2'>Jun 2016 — Present</p>
            <p className='font-regular font-openSans text-sm w-2/3'>Work with clients and web studios as freelancer.  Work in next areas: eCommerce web projects; creative landing pages; iOs and Android apps; corporate web sites and corporate identity sometimes.</p>
          </div>
        </div>
      </div>
       <div className='p-8 bg-white rounded-md mt-6'>
       <h2 className='font-semibold font-poppins text-xl'>Education</h2>
          <div className='flex gap-3 py-5'>
            <img className='w-16 h-16 rounded-full' src='images/bgfsc.jpg'/>
            <div>
              <h2 className='font-medium font-poppins text-lg mb-3'>Bangladesh Gas Fields School & College</h2>
              <p className='font-regular font-openSans text-sm text-shadow'>Bachelor's degree Field Of StudyComputer and Information Systems Security/Information Assurance</p>
              <p className='font-regular font-openSans text-sm text-shadow my-2'>Jun 2016 — Present</p>
              <p className='font-regular font-openSans text-sm'>Additional English classes and UX profile courses​.</p>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Userprofile
