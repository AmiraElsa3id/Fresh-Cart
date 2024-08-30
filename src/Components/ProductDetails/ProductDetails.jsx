import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Category from "./../Category/Category";
import { motion } from "framer-motion";
import Loader from "../Loader/Loader";
import { cartContext } from "../../Context/CartContext";
import toast from "react-hot-toast";
import { wishlistContext } from "../../Context/WishListContext";


export default function ProductDetails() {
  const [isLoading, setLoading] = useState(true);
  let [imgSrc, setSrc] = useState("");
  let { id, category } = useParams();
  const [details, setDetails] = useState(null);

  let { addProductToWishlist, setWishlist, removeProductInWishlist, wishList } = useContext(wishlistContext);

  let { addProductToCart } = useContext(cartContext);
  async function toggleWishList(id) {
    const isInWishlist = wishList.some((product) => product._id === id);

    if (isInWishlist) {
      // If the product is already in the wishlist, remove it
      setWishlist((prevWishlist) => prevWishlist.filter((product) => product._id !== id));

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

  async function addProductItemToCart(id) {
    // try {
    // const response = await addProductToCart(id);
    // console.log(response);
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
  function getProductDetails() {
    axios
      .get(`https://ecommerce.routemisr.com/api/v1/products/${id}`)
      .then(({ data }) => {
        setDetails(data.data);
        window.scrollTo(0, 1);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }
  function changeimgSrc(e) {
    setSrc(e.target.src);
  }
  useEffect(() => {
    getProductDetails();
    setSrc("");
  }, [id]);

  return (
    <>{!isLoading ? <>
      <div className="bg-[#F0F3F2] py-3  row justify-around items-center mt-24 rounded-md w-[80%] m-auto  flex-col-reverse md:flex-row">
        <div className="w-full md:w-1/4">
          <motion.img
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            src={imgSrc ? imgSrc : details?.imageCover}
            className="w-full  shadow-md rounded-md image-trans"
            alt={details?.title}
          />
          <ul className="flex mt-3 flex-wrap m-auto  ">
            {details?.images?.map((item) => {
              return (
                <li key={details?.images.indexOf(item)} className="rounded-md px-1 w-1/4 mt-3">
                  <motion.img
                    whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}
                    src={item}
                    onClick={changeimgSrc}
                    className="cursor-pointer "
                  />
                </li>

              );
            })}
          </ul>
          <button className="btn  md:hidden mt-2 mb-2 " onClick={() => { addProductItemToCart(details.id) }}>Add to Cart</button>
        </div>
        <div className="w-full md:w-2/4 flex flex-col justify-end md:justify-around md:h-80 ">
          <div>
            <h1 className="text-xl font-bold text-slate-700">
              {details?.title}
            </h1>
            <p>{details?.description}</p>
          </div>
          <div>
            <p className="text-teal-600">{details?.category?.name}</p>
            <div className="flex justify-between my-3">
              <span>{details?.price} EGP</span>
              <span>
                {details?.ratingsQuantity}
                <i className="fas fa-star text-yellow-500"></i>
              </span>
            </div>
            <div className='flex justify-between'>
              <button className="btn" onClick={() => { addProductItemToCart(details.id) }}>Add to Cart</button>

              <div className='flex justify-center items-center cursor-pointer' onClick={() => toggleWishList(details._id)}>
                {wishList?.find((el) => el._id === details.id) ?
                  <i className='fa fa-heart text-center flex justify-center items-center text-red-700 text-xl'></i> :
                  <i className='fa-regular fa-heart text-center flex justify-center items-center text-red-700 text-xl'></i>}
              </div>
            </div>
          </div>
        </div>
      </div>
      <h3 className="font-medium text-center text-teal-700 mt-16 text-3xl ">You Can Also Check</h3>
      <Category categoryName={category}></Category>
    </>
      : <Loader></Loader>
    }

    </>
  );
}
