import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { cartContext } from '../../Context/CartContext';

import toast from 'react-hot-toast';

export default function ProductItems({product}) {
let {addProductToCart}=useContext(cartContext);
async function addProductItemToCart(id) {
  try {
    const response = await addProductToCart(id);
    console.log(response);
    if(response.data.status=='success'){
      toast.success(response.data.message,
      {
        duration: 4000,
        position: 'bottom-right',}
    );
    }else{
      toast.error(response.data.message)
    }
    
    
  }
    catch{
      console.log('Error')
    }
  
}
  return (
    <div className="row mx-auto">
    {product.map((productInfo) => {
      // eslint-disable-next-line react/jsx-key
      return (
        <div className="sm:w-1/2 md:w-1/4 lg:w-1/5 xl:w-1/6 w-1/2 product mb-6 md:p-3 md:m-0  p-2 py-3 " key={productInfo.id}>
          <div className=" rounded-md shadow-md p-3 md:h-[25rem] product-card">
            <Link
              to={`/product-details/${productInfo.id}/${productInfo.category.name}`}
            >
              <img
                className="w-full md:h-60 rounded-md md:object-cover "
                src={productInfo.imageCover}
                alt={productInfo.title}
              />
              <span className="font-light text-[#0D9488] block pt-1">
                {productInfo.category.name}
              </span>
              <span className="font-semibold text-gray-500 ">
                {productInfo.title.split(" ").slice(0, 3).join(" ")}
              </span>
              <div className="flex justify-between my-3">
                <span>{productInfo.price} <span className="text-gray-700 font-semibold">EGP</span></span>
                <span>
                  {productInfo.ratingsQuantity}
                  <i className="fas fa-star text-yellow-500 ms-1"></i>
                </span>
              </div>
            </Link>
              <button className="btn" onClick={()=>{addProductItemToCart(productInfo.id)}}>Add to Cart</button>
          </div>
        </div>
      );
    })}
  </div>
  )
}
