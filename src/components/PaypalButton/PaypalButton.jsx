import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PayPalButton = ({ amount, onSuccess}) => {
    const [success, setSuccess] = useState(false);
    
    return (
        <PayPalScriptProvider options={{ "client-id": import.meta.env.VITE_APP_CLIENT_ID_PAYPAL }}>
            <div>
                {success ? (
                <h2>Thanh toán thành công!</h2>
                ) : (
                <PayPalButtons
                    createOrder={(data, actions) => {
                        return actions.order.create({
                            intent: "CAPTURE",
                            purchase_units: [
                            {
                                amount: {
                                    value: amount, // Số tiền thanh toán
                                },
                            },
                            ],
                        });
                    }}
                    onApprove={(data, actions) => {
                        return actions.order.capture().then((details) => {
                            setSuccess(true);
                            if (onSuccess) {
                                onSuccess(details);
                            }
                        }).catch((error) => {
                            // console.error("Lỗi khi xác nhận thanh toán: ", error);
                        });
                    }}
                    onError={(err) => {
                        // console.error("Lỗi thanh toán: ", err);
                    }}
                />
                )}
            </div>
        </PayPalScriptProvider>
    );
};

export default PayPalButton;
