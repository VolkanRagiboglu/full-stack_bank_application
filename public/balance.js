function Balance() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState("");
  const [userName, setUserName] = React.useState("");

  // Check if user is already logged in
  React.useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (loggedIn === "true") {
      setIsLoggedIn(true);
      const email = localStorage.getItem("email");
      setUserEmail(email);
      fetch(`/account/find/${email}`)
        .then((response) => response.json())
        .then((data) => {
          const user = data[0];
          if (user) {
            setUserName(user.name);
          }
        })
        .catch((error) => {
          console.error("Error fetching user information:", error);
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
        bgcolor="warning"
        header="Balance"
        body={
          isLoggedIn ? (
            <BalanceForm userEmail={userEmail} />
          ) : (
            <p>Please log in to access this page.</p>
          )
        }
      />
    </>
  );
}

function BalanceForm({ userEmail }) {
  const [userDetails, setUserDetails] = React.useState(null);
  const [balance, setBalance] = React.useState(null);
  const [status, setStatus] = React.useState("");
  const [isBalanceChecked, setIsBalanceChecked] = React.useState(false);

  // Fetch user information when the component mounts
  React.useEffect(() => {
    fetch(`/account/find/${userEmail}`)
      .then((response) => response.json())
      .then((data) => {
        const user = data[0]; // Assuming the response is an array with a single user object
        if (user) {
          setUserDetails(user);
        }
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  }, [userEmail]);

  // Function to handle checking balance
  const handleCheckBalance = () => {
    // Fetch user balance using the email stored in local storage
    fetch(`/account/find/${userEmail}`)
      .then((response) => response.json())
      .then((data) => {
        const user = data[0]; // Assuming the response is an array with a single user object
        if (user) {
          setBalance(user.balance);
          setStatus("Balance checked successfully");
          setIsBalanceChecked(true);
        } else {
          setStatus("User not found");
        }
      })
      .catch((error) => {
        console.error("Error fetching user balance:", error);
        setStatus("Error fetching balance");
      });
  };

  // Render the component
  return (
    <>
      {/* {userDetails && <p>Logged in user: {userDetails.name}</p>} */}
      <button
        type="button"
        className="btn btn-light"
        onClick={handleCheckBalance}
      >
        Check Balance
      </button>
      <br />
      {isBalanceChecked && balance !== null && <p>Balance: {balance}</p>}
      {status && <p>{status}</p>}
    </>
  );
}
