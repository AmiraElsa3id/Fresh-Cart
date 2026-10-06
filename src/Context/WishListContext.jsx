import axios from "axios";
import { createContext, useState } from "react";
import WishList from './../Components/WishList/WishList';
let headers={
    token:localStorage.getItem('token')
}
export let wishlistContext=createContext();
export default function WishListContextProvider(props){
 let [wishList,setWishlist]=useState([])
    async function addProductToWishlist(productId){
      return  axios.post(`https://ecommerce.routemisr.com/api/v1/Wishlist`,{
            productId:productId
        },{
            headers
        })
        .then((response)=>{
          return response  
        }
            )
        .catch((error)=>error);
    }

    async function getProductWishlist(){
        return axios.get(`https://ecommerce.routemisr.com/api/v1/wishlist`,
        {
        headers
        }).then((response)=>{
            setWishlist(response);
          return response  
        }
           )
        .catch((err)=>err)
        }

       

            async function removeProductInWishlist(productId){
                return axios.delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
                {
                headers:headers
                }).then((response)=>response)
                .catch((err)=>err)
                }
    // const [Wishlist, setCart] = useState([]);
    return(
        <wishlistContext.Provider value={{addProductToWishlist,getProductWishlist,removeProductInWishlist,wishList,setWishlist}}>
            {props.children}
        </wishlistContext.Provider>
    )
}