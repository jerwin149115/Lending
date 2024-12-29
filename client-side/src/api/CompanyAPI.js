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


export const addCompany = async(companyData) => {
    try {
        const response = await fetch(`${API_URL}/api/company/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(companyData),
        })

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'An error occured');
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
}

export const updateCompany = async(companyId, companyData) => {
    try {
        const response = await fetch(`${API_URL}/api/company/update/${companyId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(companyData),
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

export const deleteCompany = async(companyId) => {
    try {
        const response = await fetch(`${API_URL}/api/company/delete/${companyId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'An error occured');
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
}