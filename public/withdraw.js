function Withdraw() {
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
      bgcolor="success"
      header="Withdraw"
      body={
        isLoggedIn ? (
          <WithdrawForm userEmail={userEmail} />
        ) : (
          <p>Please log in to access this page.</p>
        )
      }
    />
  );
}

function WithdrawForm({ userEmail }) {
  const [userDetails, setUserDetails] = React.useState(null);
  const [amount, setAmount] = React.useState(null);
  const [status, setStatus] = React.useState("");

  // Fetch user information when the component mounts
  React.useEffect(() => {
    // Fetch user details using the email stored in local storage
    fetch(`/account/find/${userEmail}`)
      .then((response) => response.json())
      .then((data) => {
        setUserDetails(data[0]); // Assuming the response is an array with a single user object
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  }, [userEmail]);

  function handleWithdraw() {
    // Send a POST request to the withdraw endpoint
    fetch(`/account/withdraw/${userDetails.email}/${amount}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setStatus("Withdrawal successful");
      })
      .catch((error) => {
        console.error("Error withdrawing:", error);
        setStatus("Error withdrawing");
      });
  }

  return (
    <>
      {userDetails && (
        <>
          <p>Logged in user: {userDetails.name}</p>
          <label htmlFor="amount">Amount:</label>
          <input
            id="amount"
            type="number"
            className="form-control"
            placeholder="Enter amount"
            value={amount !== null ? amount : ""}
            onChange={(e) =>
              setAmount(
                e.currentTarget.value === ""
                  ? null
                  : Number(e.currentTarget.value)
              )
            }
          />
          <br />
          <button
            type="submit"
            className="btn btn-light"
            onClick={handleWithdraw}
          >
            Withdraw
          </button>
          <p>{status}</p>
        </>
      )}
    </>
  );
}
