function Withdraw() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState("");
  const [userName, setUserName] = React.useState("");

  // Check if user is already logged in
  React.useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    const email = localStorage.getItem("email");
    if (loggedIn === "true" && email) {
      setIsLoggedIn(true);
      setUserEmail(email);
      // Fetch user details to get the user's name
      fetch(`/account/find/${email}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0) {
            setUserName(data[0].name);
          }
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
        });
    }
  }, []);

  return (
    <>
      {/* Logged-in user card */}
      {isLoggedIn && (
        <div style={{ position: "absolute", top: "75px", right: "10px" }}>
          <Card
            bgcolor="info"
            header="Logged In User"
            body={`${userName}`}
            style={{
              width: "200px", // Adjust width as needed
              margin: "10px", // Adjust margin as needed
            }}
          />
        </div>
      )}
      <Card
        bgcolor="danger"
        header="Withdraw"
        body={
          isLoggedIn ? (
            <WithdrawForm userEmail={userEmail} />
          ) : (
            <p>Please log in to access this page.</p>
          )
        }
      />
    </>
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
    // Check if userDetails is available
    if (!userDetails) {
      console.error("User details not available");
      return;
    }

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
          {/* <p>Logged in user: {userDetails.name}</p> */}
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
