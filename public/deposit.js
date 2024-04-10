function Deposit() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState("");

  // Check if user is already logged in
  React.useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    const email = localStorage.getItem("email");
    if (loggedIn === "true" && email) {
      setIsLoggedIn(true);
      setUserEmail(email);
    }
  }, []);

  return (
    <Card
      bgcolor="warning"
      header="Deposit"
      body={
        isLoggedIn ? (
          <DepositForm userEmail={userEmail} />
        ) : (
          <p>Please log in to access this page.</p>
        )
      }
    />
  );
}

function DepositForm({ userEmail }) {
  const [amount, setAmount] = React.useState("");
  const [status, setStatus] = React.useState("");

  const handleDeposit = () => {
    // Send a POST request to the deposit endpoint
    fetch(`/account/deposit/${userEmail}/${amount}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setStatus("Deposit successful");
      })
      .catch((error) => {
        console.error("Error depositing:", error);
        setStatus("Error depositing");
      });
  };

  return (
    <div>
      <h3>Deposit Form</h3>
      <p>Logged in user: {userEmail}</p>
      <label htmlFor="amount">Amount:</label>
      <input
        id="amount"
        type="number"
        className="form-control"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(Number(e.currentTarget.value))}
      />
      <br />
      <button type="submit" className="btn btn-light" onClick={handleDeposit}>
        Deposit
      </button>
      <p>{status}</p>
    </div>
  );
}
