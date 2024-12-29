const API_URL = `http://localhost:3000`

export const register = async(userData) => {

    try {
        const response = await fetch(`${API_URL}/api/register/riders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'An error occured');
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
};

export const getRidersByUsername = async (username = '') => {
    const response = await fetch(`${API_URL}/api/get/riders/username?username=${username}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch riders');
    }

    return await response.json();
};

export const getRiders = async() => {
    const response = await fetch(`${API_URL}/api/get/riders`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch the riders')
    }

    return await response.json();
}

export const updateRiders = async (riderId, riderData) => {
    try {
        const response = await fetch(`${API_URL}/api/update/riders/${riderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(riderData),
        });

        if (!response.ok) {
            const responseData = await response.json();
            console.error('Error in updating the Product:', responseData.message || 'Unknown error');
            return responseData;
        }

        const responseData = await response.json();

        return responseData;
    } catch (error) {
        console.error('Error in updating the Product', error);
        return { status: "error", message: "An unknown error occurred" };
    }
};

export const deleteRider = async (riderId) => {
    if (!riderId) {
        console.error('Invalid ID:', riderId);
        return { status: "error", message: "Invalid rider ID" };
    }

    try {
        const response = await fetch(`${API_URL}/api/delete/riders/${riderId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const responseData = await response.json();
            console.error('Error in deleting the product:', responseData.message || 'Unknown error');
            return responseData;
        }

        const responseData = await response.json();

        return responseData;
    } catch (error) {
        console.error('Error in deleting the product', error);
        return { status: "error", message: "An unknown error occurred" };
    }
};