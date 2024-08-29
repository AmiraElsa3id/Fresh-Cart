import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import Loader from '../Loader/Loader';
import ProductItems from './../ProductItems/ProductItems';

export default function Category(props) {
  const [isLoading, setLoading] = useState(true);

  let category = props.categoryName;
  const [productCategoryList, setProductCategoryList] = useState(null)
  function getRelatedCategory() {
    axios.get(`https://ecommerce.routemisr.com/api/v1/products`)
      .then(({ data }) => {
        let allProducts = data.data;
        let related = allProducts.filter((product) => {
          return product.category.name === category;
        })
        setProductCategoryList(related);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    getRelatedCategory();
  }, [])
  return (
    <>
      <div className="container m-auto mt-16">
        {!isLoading ? (<> 
          {/*<div className="row mx-auto">
            {productCategoryList.map((productInfo) => {
              // eslint-disable-next-line react/jsx-key
              return (
                <div className="md:w-1/4 lg:w-1/5 xl:w-1/6 px-4 product mb-6  p-4  " key={productInfo.id}>
                  <div className=" rounded-md shadow-md p-3 h-[25rem] product-card">
                    <Link
                      to={`/product-details/${productInfo.id}/${productInfo.category.name}`}
                    >
                      <img
                        className="w-full h-60 rounded-md object-cover "
                        src={productInfo.imageCover}
                        alt={productInfo.title}
                      />
                      <span className="font-light text-[#0D9488] block">
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
                    <button className="btn">Add to Cart</button>
                  </div>
                </div>
              );
            })}
          </div>*/}
         <ProductItems product={productCategoryList}></ProductItems></>
        ) : (
          <Loader></Loader>
        )}
      </div></>
  )
}
