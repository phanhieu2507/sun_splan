import ky from "ky";

export const getAllDocs = async (page) => {
    try {
        const res = await ky
        .get(`/api/document/get-by-search?
        page=${page}`
        ).json();

        return res
    } catch (error) {
        return {
            success: false,
            message: error.message,
        }
    }
}

export const searchDocs = async (search) => {
    try {
        const res = await ky
        .get(`/api/document/get-by-search?
            ${search.name && `name=${search.name}`}&`
        ).json();
        if (res.success) {
        setDocs(res.data.data)
        setTotal(res.data.last_page)
        }
    } catch (error) {
        console.log(error)
    }
}

export const deleteDoc = async (docId) => {
    try {
        const res = await ky.delete(`/api/document/delete/${docId}`).json()

        return res
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

export const getDocById = async (docId) => {
    try {
        const res = await ky.get(`/api/document/get-by-id/${docId}`).json()

        return res
    } catch (error) {
        return {
            success: false,
            message: error.message,
        }
    }
}

export const editDoc = async (request) => {
    try {
        //console.log(request);
        const res = await ky.post('/api/document/edit', {body: request}).json();
        return res;
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

export const createDoc = async (request) => {
    try {
        //console.log(request);
        const res = await ky.post('/api/document/create', { body: request }).json();
        return res;
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}
