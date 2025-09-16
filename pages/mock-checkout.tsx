export default function MockCheckout() {
  return (
    <main style={{ padding: 32 }}>
      <h1>Mock Checkout</h1>
      <p>This simulates Stripe Checkout in demo mode.</p>
      <a href="/success?session_id=cs_test_mock_123">Pay</a> | <a href="/cancel">Cancel</a>
    </main>
  );
}
