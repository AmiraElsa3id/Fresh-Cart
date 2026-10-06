import  { useEffect, useState } from 'react'
import axios from 'axios';
import Slider from 'react-slick';


export default function CategorySlider() {
  var settings = {
    dots: false,
    infinite: true,
    speed: 1500,
    // lazyLoad: false,
    slidesToShow:7,
    slidesToScroll: 4,
    autoplay:true,
    // rows: 2,
  };
  const [isLoading,setLoading]=useState(true);
    const[categories,setcategories]=useState([])
 async  function getCategories(){
    axios.get(`https://ecommerce.routemisr.com/api/v1/categories`)
    .then(({data})=>{
      setcategories(data.data);
      setLoading(false);
    })
    .catch(()=>{
      setLoading(false);
    });
   }
  
   useEffect(()=>{
    getCategories();
   },[categories])
  return (
    <div className='hidden  md:block mb-3 px-8'>
    <Slider {...settings} >
      {categories.map((item,i)=>{
        return<div key={i} className='h-28 '><img src={item.image} className='w-full  h-28 ' /></div> 
      })}
    </Slider>
    </div>
  )
}
