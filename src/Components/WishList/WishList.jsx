

import { useContext, useEffect, useState } from 'react';
import { wishlistContext } from '../../Context/WishListContext';
import Loader from '../Loader/Loader';
import toast from 'react-hot-toast';
import { cartContext } from '../../Context/CartContext';

export default function WishList() {
  const [wishList, setwishList] = useState(null);
  const { getProductWishlist, removeProductInWishlist } = useContext(wishlistContext);
  const { addProductToCart } = useContext(cartContext);
  const [isLoading, setLoading] = useState(true);

  async function getWishlist() {
    try {
      const { data } = await getProductWishlist();
      setLoading(false);
      setwishList(data?.data);
    } catch {
      console.log('Error');
      setLoading(false);
    }
  }

  async function removeWishlist(id) {
    toast.promise(
      removeProductInWishlist(id),
      {
        loading: 'Changing product in your list...',
        success: (response) => {
          if (response.data.status === "success") {
            // Update the wishlist state directly
            setwishList((prevWishlist) => prevWishlist.filter(item => item.id !== id));
            return 'Product removed successfully from your list.';
          } else {
            throw new Error("This didn't work.");
          }
        },
        error: () => `Error: This didn't work`,
      }
    );
  }

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
  }

  useEffect(() => {
    getWishlist();
  }, []);

  return (
    <>
      {isLoading ? <Loader /> : (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-16 px-5">
          {wishList?.length !== 0 ? (
            <>
              <table className="w-[80%] mx-auto text-sm text-left rtl:text-right text-gray-500">
                <tbody className='bg-[#F0F3F2]'>
                  {wishList?.map((item, i) => (
                    <tr key={i} className="bg-white border-b hover:bg-[#F0F3F2]">
                      <td className="w-1/4">
                        <img src={item.imageCover} className="w-full md:w-32 max-w-full max-h-full rounded-md" alt={item.title} />
                      </td>
                      <td className="md:px-6 ps-2 font-semibold text-gray-900 md:text-lg">
                        <div className='md:text-xl'>{item.title}</div>
                        <div className="md:py-4 pt-5 font-semibold text-gray-900">{item.price} $</div>
                      </td>
                      <td className="md:px-6 py-4">
                        <div className="flex items-center justify-center pt-2 flex-col">
                          <a onClick={() => { removeWishlist(item.id) }} href="#" className="font-medium bg-red-600 rounded-md text-white p-3 block hover:bg-red-800 w-24 text-center">Remove</a>
                          <button className="font-medium bg-teal-600 rounded-md text-white p-3 block hover:bg-teal-800 w-24 mt-2" onClick={() => { addProductItemToCart(item.id) }}>Add to Cart</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <h3 className="font-medium text-center text-teal-700 mt-16 text-3xl h-[90vh] py-10 bg-[#F0F3F2] flex justify-center items-center">Your WishList Is Empty</h3>
          )}
        </div>
      )}
    </>
  );
}

















// import { useContext, useEffect, useState } from 'react'
// import {  wishlistContext } from '../../Context/WishListContext'
// import Loader from '../Loader/Loader';
// import toast from 'react-hot-toast';
// import { cartContext } from '../../Context/CartContext';

// export default function WishList() {
//     const [wishList,setwishList] = useState(null)
//   let {getProductWishlist,removeProductInWishlist} = useContext(wishlistContext);
//   let {addProductToCart}=useContext(cartContext);
//   const [isLoading, setLoading] = useState(true);
//   async function getWishlist() {
//     try {
//       const { data } = await getProductWishlist();
//       console.log(data);
//       setLoading(false);
//       setwishList(data?.data);
      
//     } catch {
//       console.log('Error')
//       setLoading(false);
//     }
//   }

 
//     async function removeWishlist(id){
//       toast.promise(
//         removeProductInWishlist(id)
//       ,
//               {
//                   loading: 'changing product in your list...',
//                   success: (response) => {
//                       if (response.data.status === "success") {
//                         let {data} = response;
//                         setwishList(data?.data)
//                         console.log("count",wishList.count)
//                         getWishlist()
//                           return 'Product updatted successfully in your list.';
//                       } else {
//                           throw new Error("This didn't work.");
//                       }
//                   },
//                   error: () => `Error: This didn't work`,
//               }
//           );
      
//       }

//       async function addProductItemToCart(id) {
//         toast.promise(
//           addProductToCart(id),
//                 {
//                     loading: 'Adding product to your list...',
//                     success: (response) => {
//                         if (response.data.status === "success") {
//                             return 'Product added successfully to your list.';
//                         } else {
//                             throw new Error("This didn't work.");
//                         }
//                     },
//                     error: () => `Error: This didn't work`,
//                 }
//             );
//       }

//   useEffect(() => {
//     getWishlist();
//   }, [])
//   return (
//     <>{
//       isLoading ?<Loader></Loader> 
//        :<div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-16 px-5  ">
//      { wishList?.length != 0 ? (
//          <>
//            <table className="w-[80%] mx-auto text-sm text-left rtl:text-right text-gray-500 ">
             
//              <tbody className='bg-[#F0F3F2]'>
//                {wishList?.map((item, i) => (
//                  <tr key={i} className="bg-white border-b hover:bg-[#F0F3F2]">
//                    <td className=" w-1/4">
//                      <img src={item.imageCover} className="w-full md:w-32 max-w-full max-h-full rounded-md" alt={item.title} />
//                    </td>
//                    <td className="md:px-6 ps-2 font-semibold text-gray-900 md:text-lg">
//                     <div className='md:text-xl'>
//                     {item.title}
//                     </div>
//                    <div className=" md:py-4 pt-5 font-semibold text-gray-900">{item.price} $</div>
//                    </td>
//                    <td className="md:px-6 py-4">
//                      <div className="flex items-center justify-center pt-2 flex-col">
//                      <a onClick={()=>{removeWishlist(item.id)}} href="#" className="font-medium bg-red-600 rounded-md text-white p-3 block hover:bg-red-800 w-24 text-center">Remove</a>
//                      <button className="font-medium bg-teal-600 rounded-md text-white p-3 block hover:bg-teal-800 w-24 mt-2" onClick={()=>{addProductItemToCart(item.id)}}>Add to Cart</button>
//                      </div>
//                    </td>
                   
//                    {/* <td className="px-6 py-4 md:text-lg" >
                     
//                    </td> */}
//                  </tr>
//                ))}
//              </tbody>
//            </table>
//          </>
//        ) : (
//          <h3 className="font-medium text-center text-teal-700 mt-16 text-3xl h-[90vh] py-10 bg-[#F0F3F2] flex justify-center items-center">Your WishList Is Empty</h3>
//        )}
//      </div>
       
//     }

//     </>
//   )
// }
