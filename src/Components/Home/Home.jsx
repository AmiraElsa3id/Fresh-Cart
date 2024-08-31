import React, { useContext, useEffect, useState } from 'react';
import axios from "axios";
import ProductItems from "../ProductItems/ProductItems";
import Loader from "../Loader/Loader";
import { wishlistContext } from "../../Context/WishListContext";

export default function Home() {
  const [product, setProduct] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [searchinput, setSearchInput] = useState("");
  const [filteredProductList, setFilteredProductList] = useState([]);
  const { getProductWishlist, wishList, setWishlist } = useContext(wishlistContext);

  async function getWishlist() {
    try {
      const { data } = await getProductWishlist();
      setWishlist(data?.data || []);
    } catch {
      console.log('Error fetching wishlist');
    } finally {
      setLoading(false);
    }
  }

  function getProducts() {
    axios
      .get("https://ecommerce.routemisr.com/api/v1/products")
      .then(({ data }) => {
        setProduct(data.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  function getFilteredProducts(value) {
    setFilteredProductList(
      product.filter((product) => product?.title?.toLowerCase().includes(value.toLowerCase()))
    );
  }

  function changeInputValue(value) {
    setSearchInput(value);
    getFilteredProducts(value);
  }

  useEffect(() => {
    getProducts();
    getWishlist();
  }, []);

  return (
    <>
      <div className="container m-auto mt-20">
        <div className="mt-16">
          <form className="max-w-md mx-auto">
            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
              Search
            </label>
            <div className="relative w-[90%] md:w-full mx-auto">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-teal-600 dark:text-teal-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                value={searchinput}
                onChange={(e) => changeInputValue(e.target.value)}
                className="block w-full p-4 mx-auto ps-10 text-sm text-gray-900 border border-teal-600 rounded-lg bg-white focus:ring-teal-600 focus:shadow-lg focus:box- focus:border-teal-600 outline-none mb-3"
                placeholder="Search Products ..."
                required
              />
            </div>
          </form>
        </div>
        {!isLoading ? (
          searchinput !== "" ? (
            filteredProductList.length > 0 ? (
              <ProductItems product={filteredProductList} wishList={wishList} />
            ) : (
              <div className="h-screen flex justify-center items-center text-teal-700 text-xl">
                No Products Found with this name
              </div>
            )
          ) : (
            <ProductItems product={product} wishList={wishList} />
          )
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
}















// import axios from "axios";
// import { useContext, useEffect, useState } from "react";
// import ProductItems from "./../ProductItems/ProductItems";
// import Loader from "../Loader/Loader";
// import { wishlistContext } from "../../Context/WishListContext";
// import toast from "react-hot-toast";

// export default function Home() {
//   const [product, setProduct] = useState([]);
//   const [isLoading, setLoading] = useState(true);
//   let [searchinput, setSearchInput] = useState("");
//   let [filteredProductList, setfilteredProductList] = useState([]);
  
//   let {getProductWishlist,wishList,setWishlist} = useContext(wishlistContext);

//   async function getWishlist() {
//     try {
//       const { data } = await getProductWishlist();
//       console.log(data);
//       setLoading(false);
//       setWishlist(data?.data);
      
//     } catch {
//       console.log('Error')
//       setLoading(false);
//     }
//   }
//   function getProducts() {
//     axios
//       .get("https://ecommerce.routemisr.com/api/v1/products")
//       .then(({ data }) => {
//         setProduct(data.data);

//         console.log(product);
//         setLoading(false);
//       })
//       .catch(() => {
//         setLoading(false);
//       });
//   }
//   function getfilterdProducts(value) {
//     // console.log(value);
//     let productList = structuredClone(product);
//     setfilteredProductList(
//       productList.filter((product) => product?.title?.includes(value))
//     );
//     console.log(filteredProductList);
//   }
//   function changeInputValue(value) {
//     setSearchInput(value);
//     console.log(value);
//     getfilterdProducts(value);
//   }
//   useEffect(() => {
//     getProducts();
//     getWishlist();
//   }, []);

//   return (
//     <>
//       <div className="container m-auto mt-20 ">
//         <div className="mt-16">
//           <form className="max-w-md mx-auto">
//             <label
//               htmlFor="default-search"
//               className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
//             >
//               Search
//             </label>
//             <div className="relative w-[90%]  md:w-full mx-auto">
//               <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
//                 <svg
//                   className="w-4 h-4 text-teal-600 dark:text-teal-600"
//                   aria-hidden="true"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 20 20"
//                 >
//                   <path
//                     stroke="currentColor"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
//                   />
//                 </svg>
//               </div>
//               <input
//                 type="search"
//                 id="default-search"
//                 value={searchinput}
//                 onChange={(e) => {
//                   changeInputValue(e.target.value);
//                 }}
//                 className="block w-full p-4 mx-auto ps-10 text-sm text-gray-900 border border-teal-600 rounded-lg bg-white focus:ring-teal-600 focus:shadow-lg focus:box- focus:border-teal-600 outline-none mb-3"
//                 placeholder="Search Products ..."
//                 required
//               />
//               {/* <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button> */}
//             </div>
//           </form>
//         </div>
//         {!isLoading ? (
//           <>
//             {searchinput !== "" ? (
//               filteredProductList.length != 0 ? (
//                 <ProductItems product={filteredProductList} wishList={wishList} />
//               ) : (
//                 <>
//                   <div className="h-screen flex justify-center items-center text-teal-500 text-xl">
//                     No Products Found with this name
//                   </div>
//                 </>
//               )
//             ) : (
//               <ProductItems product={product} wishList={wishList}/>
//             )}
//           </>
//         ) : (
//           <Loader />
//         )}
//       </div>
//     </>
//   );
// }
