
import { Link, useParams } from 'react-router-dom'
import Category from '../Category/Category';

export default function SubCategories() {
    let {name}=useParams();
    console.log(name)
  return (<>
    <div className='mt-24 ms-10 bg-teal-600 text-white w-fit p-3 rounded-md hover:bg-teal-800 transition-all duration-200'><Link to={'/category'} className='flex justify-center items-center gap-2'> <i className='fa fa-arrow-left'></i> go back to category list</Link></div>
    <Category categoryName={name}></Category>
  </>
  )
}
