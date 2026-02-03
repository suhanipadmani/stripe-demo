import CheckoutButton from "./CheckoutButton.jsx";

export default function App() {
    return (
        <div className="button-container">
            <CheckoutButton type="one-time" />
            <CheckoutButton type="subscription" priceId="price_123456" />
        </div>
    );
}
