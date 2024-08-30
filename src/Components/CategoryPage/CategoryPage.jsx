import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Loader from './../Loader/Loader';
import { Link } from 'react-router-dom';

export default function CategoryPage() {
  function getCategories() {
    return axios.get('https://ecommerce.routemisr.com/api/v1/categories')
  }

  let { data, isError, error, isLoading } = useQuery({
    queryKey: ['categories'], queryFn: getCategories,
    select:(data)=>data?.data?.data
  })
 

  if (isLoading)
    return <Loader></Loader>

if(isError)
  return <h2>{error.message}</h2>

  return (
    <div className='row mx-auto w-[85%] mt-16 '>

      {data?.map(ele=>{ return <div className=' md:w-1/5 p-3' key={ele?._id}><Link to={`subcategories/${ele?.name}`}>
      <div className='  brand-card relative p-3 ' >
      <img src={ele?.image} alt="" className='w-full object-cover h-56' />
      <p className='brand-title'><span>{ele?.name}</span></p>
      </div>
      </Link>
      </div>
     })}
    </div>
  )
}