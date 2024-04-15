function Withdraw() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState("");
  const [userName, setUserName] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  // Fetch logged-in status and user details when the component mounts
  React.useEffect(() => {
    fetchLoggedInStatus();
  }, []);

  // Function to fetch logged-in status and user details from backend
  const fetchLoggedInStatus = () => {
    const loggedInEmail = localStorage.getItem("email");
    if (loggedInEmail) {
      fetch(`/account/find/${loggedInEmail}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0 && data[0].loggedIn) {
            setIsLoggedIn(true);
            setUserEmail(loggedInEmail);
            setUserName(data[0].name);
          } else {
            setIsLoggedIn(false);
            setUserEmail("");
            setUserName("");
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching logged-in status:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

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
  const [amount, setAmount] = React.useState("");
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

  const handleWithdraw = () => {
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
  };

  const handleAmountChange = (e) => {
    const value = e.currentTarget.value;
    if (/^\d*\.?\d*$/.test(value)) {
      // Only set the amount if it's a valid numeric value
      setAmount(value);
    }
  };

  return (
    <>
      {userDetails && (
        <>
          {/* <p>Logged in user: {userDetails.name}</p> */}
          <label htmlFor="amount">Amount:</label>
          <input
            id="amount"
            type="text" // Change type to text
            className="form-control"
            placeholder="Enter amount"
            value={amount}
            onChange={handleAmountChange}
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
