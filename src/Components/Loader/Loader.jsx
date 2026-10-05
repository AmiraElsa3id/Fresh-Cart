import React from 'react'

export default function Loader() {
  return (
    <div className='flex h-screen justify-center items-center'>
      <div className='h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent' role='status' aria-label='loading' />
    </div>

  )
}
