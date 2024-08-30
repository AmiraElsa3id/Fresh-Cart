import { useContext, useEffect, useState } from 'react'
import { cartContext } from '../../Context/CartContext'
import Loader from '../Loader/Loader';
import toast from 'react-hot-toast';


export default function Carts() {
  let [cartProducts,setCartProducts] = useState(null)
  let { getProductToCart ,updateProductInCart,removeProductInCart} = useContext(cartContext);
  const [isLoading, setLoading] = useState(true);
  async function getProductsCart() {
    try {
      const { data } = await getProductToCart();
      console.log(data);
      setLoading(false);
      setCartProducts(data?.data);
    } catch {
      console.log('Error')
      setLoading(false);
    }
  }

  async function updateProduct(id,countNumber){
    toast.promise(
      updateProductInCart(id,countNumber)
    ,
            {
                loading: 'changing product in your list...',
                success: (response) => {
                    if (response.data.status === "success") {
                      let {data}= response;
                      setCartProducts(data?.data)
                        return 'Product updatted successfully in your list.';
                    } else {
                        throw new Error("This didn't work.");
                    }
                },
                error: () => `Error: This didn't work`,
            }
        );
    // let {data} =await updateProductInCart(id,countNumber);
    // console.log(data.data)
    // setCartProducts(data?.data)
    }

    async function removeProduct(id){
      toast.promise(
        removeProductInCart(id)
      ,
              {
                  loading: 'changing product in your list...',
                  success: (response) => {
                      if (response.data.status === "success") {
                        let {data}= response;
                        setCartProducts(data?.data)
                          return 'Product updatted successfully in your list.';
                      } else {
                          throw new Error("This didn't work.");
                      }
                  },
                  error: () => `Error: This didn't work`,
              }
          );
      // let {data} =await removeProductInCart(id);
      // setCartProducts(data?.data)
      }

  useEffect(() => {
    getProductsCart();
  }, [])
  return (
    <>{
      isLoading ?<Loader></Loader> 
       :<div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-24 px-5  ">
       <h1 className="text-center text-teal-600 text-3xl">Your Cart</h1>
       <h3 className="text-center text-xl pb-3">
         Total Price: <span className="font-medium">{cartProducts?.totalCartPrice} $</span>
       </h3>
       {cartProducts?.products?.length !== 0 ? (
         <>
           <table className="w-[80%] mx-auto text-sm text-left rtl:text-right text-gray-500 ">
             {/* <thead className="text-xs text-gray-700 uppercase bg-gray-50">
               <tr>
                 <th scope="col" className="px-16 py-3">
                   <span className="sr-only">Image</span>
                 </th>
                 <th scope="col" className="md:px-6 py-3">Product</th>
                 <th scope="col" className="md:px-6 py-3">Qty</th>

               </tr>
             </thead> */}
             <tbody className='bg-[#F0F3F2]'>
               {cartProducts?.products?.map((item, i) => (
                 <tr key={i} className="bg-white border-b hover:bg-[#F0F3F2]">
                   <td className=" w-1/4">
                     <img src={item?.product?.imageCover} className="w-full md:w-32 max-w-full max-h-full rounded-md" alt={item?.product?.title} />
                   </td>
                   <td className="md:px-6 ps-2 font-semibold text-gray-900 md:text-lg">
                    <div className='md:text-xl'>
                    {item?.product?.title}
                    </div>
                   <div className=" md:py-4 pt-5 font-semibold text-gray-900">{item?.price} EGP</div>
                   </td>
                   <td className="md:px-6 py-4">
                     <div className="flex items-center justify-center ">
                       <button onClick={()=>{updateProduct(item?.product?.id,item.count-1)}} className="inline-flex items-center justify-center p-1 me-3 text-sm font-medium h-6 w-6 text-teal-700 bg-white border border-teal-700 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200" type="button">
                         <span className="sr-only">Quantity button</span>
                         <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                           <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 1h16" />
                         </svg>
                       </button>
                       <div>
                         <input type="number" id="first_product" className="bg-gray-50 w-14 border border-teal-700 text-teal-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1" placeholder={item?.count} required />
                       </div>
                       <button onClick={()=>{updateProduct(item?.product?.id,item.count+1)}} className="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-teal-700 bg-white border border-teal-700 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200" type="button">
                         <span className="sr-only">Quantity button</span>
                         <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                           <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 1v16M1 9h16" />
                         </svg>
                       </button>
                     </div>
                     <div className="flex items-center justify-center pt-2">
                     <a onClick={()=>{removeProduct(item.product.id)}} href="#" className="font-medium bg-red-600 rounded-md text-white p-3 hover:bg-red-800">Remove</a>
                     </div>
                   </td>
                   
                   {/* <td className="px-6 py-4 md:text-lg" >
                     
                   </td> */}
                 </tr>
               ))}
             </tbody>
           </table>
         </>
       ) : (
         <h3 className="font-medium text-center text-teal-700 mt-16 text-3xl h-[90vh] py-10 bg-[#F0F3F2] flex justify-center items-center">Your Cart Is Empty</h3>
       )}
     </div>
       
    }

    </>
  )
}
