import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { cartContext } from '../../Context/CartContext';

import toast from 'react-hot-toast';
import { wishlistContext } from '../../Context/WishListContext';


export default function ProductItems({product,wishList}) {
  
  let {addProductToWishlist,setWishlist,removeProductInWishlist} = useContext(wishlistContext);
let {addProductToCart}=useContext(cartContext);
// console.log(wishList)
async function toggleWishList(id) {
  const isInWishlist = wishList?.some((product) => product?._id === id);

  if (isInWishlist) {
    // If the product is already in the wishlist, remove it
    setWishlist((prevWishlist) => prevWishlist?.filter((product) => product?._id !== id));
    
    // Optionally, handle the API call for removing the item from the wishlist
    try {
      // Assuming you have a function to remove the product from the wishlist
      await removeProductInWishlist(id);
      toast.success('Product removed from your wishlist.', {
        position: 'top-center',
      });
    } catch (error) {
      // Revert the optimistic update if the request fails
      setWishlist((prevWishlist) => [...prevWishlist, { _id: id }]);
      toast.error('Error: Could not remove the product from the wishlist.');
    }
  } else {
    // If the product is not in the wishlist, add it
    setWishlist((prevWishlist) => [...prevWishlist, { _id: id }]);

    try {
      const response = await addProductToWishlist(id);

      if (response.data.status !== "success") {
        throw new Error("This didn't work.");
      }

      // Replace the optimistic update with the full product data if needed
      setWishlist((prevWishlist) =>
        prevWishlist.map((product) =>
          product?.id === id ? response.data.product : product
        )
      );

      toast.success('Product added to your wishlist.', {
        position: 'top-center',
      });
    } catch (error) {
      // Revert the optimistic update if the request fails
      setWishlist((prevWishlist) => prevWishlist.filter((product) => product.id !== id));
      toast.error('Error: Could not add the product to the wishlist.');
    }
  }
}
// async function addToWishList(id) {
//   // Optimistically add the product to the wishlist
//   setWishlist((prevWishlist) => [...prevWishlist, { _id: id }]);

//   try {
//     const response = await addProductToWishlist(id);

//     if (response.data.status !== "success") {
//       throw new Error("This didn't work.");
//     }

    
//     // If needed, replace the optimistic update with the full product data
//     setWishlist((prevWishlist) =>
//       prevWishlist.map((product) =>
//         product.id === id ? response.data.product : product
//       )
//     );
   
//     toast.success('Product added successfully to your list.',{
//       position: 'top-center'
//     });
//   } catch (error) {
//     // Revert the optimistic update if the request fails
//     setWishlist((prevWishlist) => prevWishlist.filter((product) => product._id !== id));
//     toast.error('Error: This didn\'t work');
//   }
// }

// async function addToWishList(id) {
//   toast.promise(
//     addProductToWishlist(id),
//           {
//               loading: 'Adding product to your list...',
//               success: (response) => {
//                   if (response.data.status === "success") {
                    
//                       return 'Product added successfully to your list.';
//                   } else {
//                       throw new Error("This didn't work.");
//                   }
//               },
//               error: () => `Error: This didn't work`,
//           }
//       );
//     }
async function addProductItemToCart(id) {
  toast.promise(
    addProductToCart(id),
          {
              loading: 'Adding product to your list...',
              success: (response) => {
                  if (response.data.status === "success") {
                      return 'Product added successfully to your list.';
                  } else {
                      throw new Error("This didn't work.");
                  }
              },
              error: () => `Error: This didn't work`,
          }
      );
  // try {
  //   const response = await addProductToCart(id);
  //   console.log(response);
  //   if(response.data.status=='success'){
  //     toast.success(response.data.message,
  //     {
  //       duration: 4000,
  //       position: 'bottom-right',}
  //   );
  //   }else{
  //     toast.error(response.data.message)
  //   }
    
    
  // }
  //   catch{
  //     console.log('Error')
  //   }
  
}

  return (
    <div className="row mx-auto">
    {product?.map((productInfo) => {
      // eslint-disable-next-line react/jsx-key
      return (
        <div className="w-[90%] md:w-1/4 lg:w-1/5 xl:w-1/6 mx-auto product mb-6 md:p-3 md:m-0  p-2 py-3 " key={productInfo?.id}>
          <div className=" rounded-md shadow-md p-3  product-card">
            <Link
              to={`/product-details/${productInfo?.id}/${productInfo?.category.name}`}
            >
              <img
                className="w-full md:h-60 rounded-md md:object-cover "
                src={productInfo?.imageCover}
                alt={productInfo?.title}
              />
              <span className="font-light text-[#0D9488] block pt-1">
                {productInfo?.category?.name}
              </span>
              <span className="font-semibold text-gray-500 ">
                {productInfo?.title.split(" ").slice(0, 3).join(" ")}
              </span>
              <div className="flex justify-between my-3">
                <span>{productInfo?.price} <span className="text-gray-700 font-semibold">EGP</span></span>
                <span>
                  {productInfo?.ratingsQuantity}
                  <i className="fas fa-star text-yellow-500 ms-1"></i>
                </span>
              </div>
            </Link>
            <div className='flex justify-around'>
              <button className="btn" onClick={()=>{addProductItemToCart(productInfo.id)}}>Add to Cart</button>

<div className='flex justify-center items-center cursor-pointer' onClick={() => toggleWishList(productInfo?._id)}>
{wishList?.find((el) => el._id === productInfo._id) ?
 <i className='fa fa-heart text-center flex justify-center items-center text-red-700 text-xl'></i> :
 <i className='fa-regular fa-heart text-center flex justify-center items-center text-red-700 text-xl'></i>}
  </div>
            </div>

          </div>
        </div>
      );
    })}
  </div>
  )
}
