const API_URL = `http://localhost:3000`

export const savePayments = async (customer_id, payment) => {
    const paymentArray = Array.isArray(payment) ? payment : [payment];
    
    try {
        const response = await fetch(`${API_URL}/api/payment/multiple/${customer_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ payment: paymentArray }) 
        });

        if (!response.ok) {
            throw new Error('Error in adding the payment');
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error in adding the payment', error);
        return { status: 'Error', message: 'An unknown error occurred' };
    }
};

