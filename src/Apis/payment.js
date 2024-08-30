import axios from "axios";

let token=localStorage.getItem("token");


export function onlinePayment({cartId,shippingAddress}){
    return axios.post(`https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?https://fresh-cart-xi-lac.vercel.app`
        ,{shippingAddress},
         {headers:{token}}
        )

}
export function cash({cartId,shippingAddress}){
    return axios.post(`https://ecommerce.routemisr.com/api/v1/orders/${cartId}`,
         {shippingAddress},
         {headers:{token}}
        )

}