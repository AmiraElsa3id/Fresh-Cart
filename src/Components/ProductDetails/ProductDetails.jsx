import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Category from "./../Category/Category";
import { date } from "yup";
import { motion } from "framer-motion";
import Loader from "../Loader/Loader";
import { cartContext } from "../../Context/CartContext";
import toast from "react-hot-toast";


export default function ProductDetails() {
  const [isLoading, setLoading] = useState(true);
  let [imgSrc, setSrc] = useState("");
  let { id, category } = useParams();
  const [details, setDetails] = useState(null);

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
  function getProductDetails() {
    axios
      .get(`https://ecommerce.routemisr.com/api/v1/products/${id}`)
      .then(({ data }) => {
        setDetails(data.data);
        window.scrollTo(0,1);
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
    <>{!isLoading?<>
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
          <button className="btn  md:hidden mt-2 mb-2 " onClick={()=>{addProductItemToCart(details.id)}}>Add to Cart</button>
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
            <button className="btn hidden md:block " onClick={()=>{addProductItemToCart(details.id)}}>Add to Cart</button>
          </div>
        </div>
      </div>
      <h3 className="font-medium text-center text-teal-700 mt-16 text-3xl ">You Can Also Check</h3>
      <Category categoryName={category}></Category>
    </>
    :<Loader></Loader>
    }
      
    </>
  );
}
