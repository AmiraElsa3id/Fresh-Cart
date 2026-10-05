import api from "./axiosInstance";

export async function getCategories() {
  try {
    let { data } = await api.get(`/categories`);
    return data;
  } catch (error) {
    return error?.message;
  }
}
