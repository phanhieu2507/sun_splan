import ky from "ky";

export async function getAllUnits() {
    try {
        const res = await ky.get('/api/unit/get-all').json();

        return res
    } catch (error) {
        return {
            success: false,
            message: error.message,
        }
    }
}