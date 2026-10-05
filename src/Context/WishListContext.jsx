import { createContext, useState } from "react";
import api from "../Apis/axiosInstance";

export let wishlistContext = createContext();
export default function WishListContextProvider(props) {
  const [wishList, setWishlist] = useState([]);

  async function addProductToWishlist(productId) {
    return api.post(`/wishlist`, { productId }).then((response) => response).catch((error) => error);
  }

  async function getProductWishlist() {
    return api
      .get(`/wishlist`)
      .then((response) => {
        setWishlist(response);
        return response;
      })
      .catch((err) => err);
  }

  async function removeProductInWishlist(productId) {
    return api.delete(`/wishlist/${productId}`).then((response) => response).catch((err) => err);
  }

  return (
    <wishlistContext.Provider
      value={{ addProductToWishlist, getProductWishlist, removeProductInWishlist, wishList, setWishlist }}
    >
      {props.children}
    </wishlistContext.Provider>
  );
}
