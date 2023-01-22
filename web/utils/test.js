import ky from "ky";

export const deleteTest = async (testId) => {
    try {
      const response = await ky.delete(`/api/test/${testId}`).json();
      return response;
    } catch (error) {
      console.log(error);
    }
};