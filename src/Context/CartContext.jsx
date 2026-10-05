import { createContext, useState } from "react";
import api, { API_V2 } from "../Apis/axiosInstance";

export let cartContext = createContext();
export default function CartContextProvider(props) {
  const [cartNum, setCartNum] = useState(0);
  async function addProductToCart(productId) {
    return api
      .post(`${API_V2}/cart`, { productId })
      .then((response) => {
        setCartNum(response.data.numOfCartItems);
        return response;
      })
      .catch((error) => error);
  }

  async function getProductToCart() {
    return api
      .get(`${API_V2}/cart`)
      .then((response) => {
        setCartNum(response.data.numOfCartItems);
        return response;
      })
      .catch((err) => err);
  }

  async function updateProductInCart(productId, count) {
    return api
      .put(`${API_V2}/cart/${productId}`, { count })
      .then((response) => response)
      .catch((err) => err);
  }

  async function removeProductInCart(productId) {
    return api
      .delete(`${API_V2}/cart/${productId}`)
      .then((response) => {
        setCartNum(response.data.numOfCartItems);
        return response;
      })
      .catch((err) => err);
  }

  async function clearCart() {
    return api
      .delete(`${API_V2}/cart`)
      .then(() => {
        setCartNum(0);
      })
      .catch((err) => err);
  }

  return (
    <cartContext.Provider
      value={{
        addProductToCart,
        getProductToCart,
        updateProductInCart,
        removeProductInCart,
        cartNum,
        clearCart,
      }}
    >
      {props.children}
    </cartContext.Provider>
  );
}
