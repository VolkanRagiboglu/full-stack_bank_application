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
  const [userDetails, setUserDetails] = React.useState(null);
  const [amount, setAmount] = React.useState(null);
  const [status, setStatus] = React.useState("");

  // Fetch user information when the component mounts
  React.useEffect(() => {
    // Fetch user details
    fetch(`/account/find/${userEmail}`)
      .then((response) => response.json())
      .then((data) => {
        setUserDetails(data[0]); // Assuming the response is an array with a single user object
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  }, [userEmail]); // Trigger effect when userEmail changes

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
      {userDetails && (
        <p>Logged in user: {userDetails.name}</p> // Display user's name instead of email
      )}
      <label htmlFor="amount">Amount:</label>
      <input
        id="amount"
        type="number"
        className="form-control"
        placeholder="Enter amount"
        value={amount !== null ? amount : ""}
        onChange={(e) =>
          setAmount(
            e.currentTarget.value === "" ? null : Number(e.currentTarget.value)
          )
        }
      />
      <br />
      <button type="submit" className="btn btn-light" onClick={handleDeposit}>
        Deposit
      </button>
      <p>{status}</p>
    </div>
  );
}
