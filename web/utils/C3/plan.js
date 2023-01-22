import ky from "ky";

export const getAllMilestoneByUserId = async (userId) => {
    try {
        const response = await ky.get(`http://project.localhost:8000/api/target/user/${userId}`).json();
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const getMilestoneThisMonth = async (userId) => {
    try {
        const response = await ky.get(`http://project.localhost:8000/api/target/thisMonth/${userId}`).json();
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const getMilestoneById = async (planId) => {
    try {
        const response = await ky.get(`http://project.localhost:8000/api/target/${planId}`).json();
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
