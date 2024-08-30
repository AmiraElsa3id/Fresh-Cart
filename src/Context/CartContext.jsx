import axios from "axios";
import { createContext, useState } from "react";
let headers={
    token:localStorage.getItem('token')
}
export let cartContext=createContext();
export default function CartContextProvider(props){
const [cartNum,setCartNum]=useState(0)
    async function addProductToCart(productId){
      return  axios.post(`https://ecommerce.routemisr.com/api/v1/cart`,{
            "productId":productId
        },{
            headers
        })
        .then((response)=>{
            setCartNum(response.data.numOfCartItems);
            return response
        })
        .catch((error)=>error);
    }

    async function getProductToCart(){
        return axios.get(`https://ecommerce.routemisr.com/api/v1/cart`,
        {
        headers
        }).then((response)=>{
            setCartNum(response.data.numOfCartItems);
            return response
        })
        .catch((err)=>err)
        }

        async function updateProductInCart(productId,count){
            return axios.put(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
            {
            count:count
            },
            {
            headers:headers
            }).then((response)=>response)
            .catch((err)=>err)
            }

            async function removeProductInCart(productId){
                return axios.delete(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
                {
                headers:headers
                }).then((response)=>{
                    setCartNum(response.data.numOfCartItems);
                    return response
                })
                .catch((err)=>err)
                }
    // const [cart, setCart] = useState([]);
    return(
        <cartContext.Provider value={{addProductToCart,getProductToCart,updateProductInCart,removeProductInCart,cartNum}}>
            {props.children}
        </cartContext.Provider>
    )
}
