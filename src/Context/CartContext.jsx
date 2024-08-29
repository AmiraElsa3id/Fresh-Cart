import axios from "axios";
import { createContext } from "react";
let headers={
    token:localStorage.getItem('token')
}
export let cartContext=createContext();
export default function CartContextProvider(props){

    async function addProductToCart(productId){
      return  axios.post(`https://ecommerce.routemisr.com/api/v1/cart`,{
            "productId":productId
        },{
            headers
        })
        .then((response)=>response)
        .catch((error)=>error);
    }

    async function getProductToCart(){
        return axios.get(`https://ecommerce.routemisr.com/api/v1/cart`,
        {
        headers
        }).then((response)=>response)
        .catch((err)=>err)
        }
    // const [cart, setCart] = useState([]);
    return(
        <cartContext.Provider value={{addProductToCart,getProductToCart}}>
            {props.children}
        </cartContext.Provider>
    )
}
