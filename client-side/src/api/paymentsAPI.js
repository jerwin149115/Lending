const API_URL = `http://localhost:3000`

export const savePayments = async (customer_id, payment) => {
    console.log(customer_id, payment)
    const res = await fetch(`${API_URL}/api/payment/add/${customer_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payment),
    });

    return await res.json();
};

export const saveMultiplePayments = async (customer_id, payments) => {
    const res = await fetch(`${API_URL}/api/payment/multiple/${customer_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payments }),
    });

    return await res.json();
};


