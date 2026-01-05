const API_URL = `http://localhost:3000`

export const getArea = async() => {
    try {
        const response = await fetch(`${API_URL}/api/area/get`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'An error occured');
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const getAreaByCompany = async (company = '') => {
    try {
        const url = company 
            ? `${API_URL}/api/area/get/company?company=${encodeURIComponent(company)}` 
            : `${API_URL}/api/area/get/company`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'An error occurred');
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const addArea = async(areaData) => {
    try {
        const response = await fetch(`${API_URL}/api/area/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(areaData)
        })

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'An error occured');
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const updateArea = async(areaId, areaData) => {
    try {
        const response = await fetch(`${API_URL}/api/area/update/${areaId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(areaData)
        })

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'An error occured');
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const deleteArea = async(areaId) => {
    try {
        const response = await fetch(`${API_URL}/api/area/delete/${areaId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'An error occured');
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        throw new Error(error.message);
    }
} 