import React from 'react'
import { Bars } from 'react-loader-spinner'

export default function Loader() {
  return (
    <div className='flex h-screen justify-center items-center'>
      <Bars
  height="80"
  width="80"
  color="#0D9488"
  ariaLabel="bars-loading"
  wrapperStyle={{}}
  wrapperClass=""
  visible={true}
  />
    </div>
    
  )
}
