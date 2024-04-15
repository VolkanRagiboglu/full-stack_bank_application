function Balance() {
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

  // Log the current state of isLoggedIn
  console.log("isLoggedIn:", isLoggedIn);

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
  const [balance, setBalance] = React.useState(null);
  const [status, setStatus] = React.useState("");
  const [isBalanceChecked, setIsBalanceChecked] = React.useState(false);

  // Function to handle checking the balance
  const handleCheckBalance = () => {
    // Fetch user information
    fetch(`/account/find/${userEmail}`)
      .then((response) => response.json())
      .then((data) => {
        const user = data[0]; // Assuming the response is an array with a single user object
        if (user) {
          setBalance(user.balance);
          setIsBalanceChecked(true);
          setStatus("");
        } else {
          setStatus("User not found");
        }
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        setStatus("Error fetching user details");
      });
  };

  // Render the component
  return (
    <>
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
