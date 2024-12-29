const API_URL = `http://localhost:3000`

export const registerCustomer = async(userData) => {
    try {
        const response = await fetch(`${API_URL}/api/register/customer`, {
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

export const getCustomerDaily = async (area, lending_company) => {
    const response = await fetch(`${API_URL}/api/get/customer/${area}/${lending_company}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch the customer based on area and lending company');
    }

    return await response.json();
};

export const getCustomer = async() => {
    const response = await fetch(`${API_URL}/api/get/customer`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch the customer')
    }

    return await response.json();
}

export const updateCustomer = async (customerId, customerData) => {
    try {
        const response = await fetch(`${API_URL}/api/update/customer/${customerId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(customerData),
        });

        if (!response.ok) {
            const responseData = await response.json();
            console.error('Error in updating the Product:', responseData.message || 'Unknown error');
            return responseData;
        }

        const responseData = await response.json();

        return responseData;
    } catch (error) {
        console.error('Error in updating the Customer', error);
        return { status: "error", message: "An unknown error occurred" };
    }
};

export const getCustomerById = async(customer_id) => {
    try {
        const response = await fetch(`${API_URL}/api/get/customer/${customer_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if (!response.ok) {
            const responseData = await response.json();
            console.error('Error in updating the customer', error)
            return responseData;
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error in fetching the customer with Area 4')
        return { status: 'Error', message: 'An unknown error occured'}
    }
}

export const deleteCustomer = async(customer_id) => {
    try {
        const response = await fetch(`${API_URL}/api/delete/customer/${customer_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if (!response.ok) {
            throw new Error('Error in deleting the customer', error);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error in deleting the customer', error);
        return { status: 'Error', message: 'An unknown error occured'}
    }
}