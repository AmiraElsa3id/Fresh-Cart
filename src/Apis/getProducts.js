import api from "./axiosInstance";

export async function getProducts() {
  try {
    let { data } = await api.get(`/products`);
    return data;
  } catch (error) {
    return error?.message;
  }
}

export async function getSingleProduct(id) {
  try {
    let { data } = await api.get(`/products/${id}`);
    return data;
  } catch (error) {
    return error?.message;
  }
}

export async function getProductwithCategories(id) {
  try {
    let { data } = await api.get(`/products?category[in]=${id}`);
    return data;
  } catch (error) {
    return error?.message;
  }
}
