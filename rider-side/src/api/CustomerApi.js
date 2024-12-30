const API_URL = `http://localhost:3000`

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