import ky from "ky";

export async function getAllCategories() {
    try {
        const res = await ky.get('/api/category/get-all').json();

        return res
    } catch (error) {
        return {
            success: false,
            message: error.message,
        }
    }
}