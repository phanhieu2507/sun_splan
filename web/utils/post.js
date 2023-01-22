import ky from "ky";

export const getPostById = async (postId) => {
  try {
    const response = await ky.get(`/api/user/posts/${postId}`).json();
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
