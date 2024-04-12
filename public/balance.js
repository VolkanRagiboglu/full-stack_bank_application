function Balance() {
  return <Card bgcolor="info" header="Balance" body={<BalanceForm />} />;
}

function BalanceForm() {
  const [email, setEmail] = React.useState("");
  const [balance, setBalance] = React.useState(null);
  const [status, setStatus] = React.useState("");

  function handleCheckBalance() {
    const userEmail = localStorage.getItem("email");
    fetch(`/account/find/${userEmail}`)
      .then((response) => response.json())
      .then((data) => {
        const user = data[0];
        if (user) {
          setBalance(user.balance);
          setStatus("Balance checked successfully");
        } else {
          setStatus("User not found");
        }
      })
      .catch((error) => {
        console.error("Error fetching user balance:", error);
        setStatus("Error fetching balance");
      });
  }

  return (
    <div>
      <h3>Check Balance</h3>
      <button
        type="submit"
        className="btn btn-light"
        onClick={handleCheckBalance}
      >
        Check Balance
      </button>
      <br />
      {balance !== null && <p>Balance: ${balance}</p>}
      <p>{status}</p>
    </div>
  );
}
