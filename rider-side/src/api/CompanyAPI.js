const API_URL = `http://localhost:3000`

export const getCompany = async() => {
    try {
        const response = await fetch(`${API_URL}/api/company/get`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'an error occured');
        }

        return await response.json();
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