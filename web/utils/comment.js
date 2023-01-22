import ky from "ky";

export const getAllCommentsByPostId = async (postId, limit) => {
  try {
    if (limit) {
      const response = await ky
        .get(`/api/posts/${postId}/comments?limit=${limit}`)
        .json();
      return response.data;
    } else {
      const response = await ky.get(`/api/posts/${postId}/comments`).json();
      return response.data;
    }
  } catch (error) {
    console.log(error);
  }
};

export const createComment = async (postId, userId, content) => {
  try {
    const response = await ky
      .post(`/api/posts/${postId}/comments`, {
        json: { userId, content },
      })
      .json();
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const updateComment = async (content, commentId) => {
  try {
    const response = await ky
      .put(`/api/comments/${commentId}`, {
        json: { content },
      })
      .json();
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await ky.delete(`/api/comments/${commentId}`).json();
    return response;
  } catch (error) {
    console.log(error);
  }
};
