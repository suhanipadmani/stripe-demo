export default function CheckoutButton({ type }) {
  const handleCheckout = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/checkout/${type}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const error = await res.json();
      alert(error.error);
      return;
    }

    const data = await res.json();
    window.location.href = data.url;
  };

  return (
    <button onClick={handleCheckout}>
      {type === "subscription" ? "Subscribe" : "Pay ₹500"}
    </button>
  );
}
