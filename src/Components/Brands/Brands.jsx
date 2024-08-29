import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Loader from './../Loader/Loader';


export default function Brand() {

  function getBrands() {
    return axios.get('https://ecommerce.routemisr.com/api/v1/brands')
  }

  let { data, isError, error, isLoading } = useQuery({
    queryKey: ['brands'], queryFn: getBrands,
    select:(data)=>data?.data?.data
  })
 

  if (isLoading)
    return <Loader></Loader>

if(isError)
  return <h2>{error.message}</h2>

  return (
    <div className='row mx-auto w-[85%] mt-16 '>

      {data?.map(ele=>{ return <><div className='w-full md:w-1/5 p-3 '><div className='  brand-card relative p-3' key={ele?._id}>
      <img src={ele?.image} alt="" className='w-full' />
      <p className='brand-title'><span>{ele?.name}</span></p>
      </div></div>
      </>})}
    </div>
  )
}