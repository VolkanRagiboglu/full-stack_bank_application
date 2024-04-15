function Deposit() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState("");
  const [userName, setUserName] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  // Fetch logged-in status when the component mounts
  React.useEffect(() => {
    fetchLoggedInStatus();
  }, []);

  // Function to fetch user's logged-in status from backend
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
          }
        })
        .catch((error) => {
          console.error("Error fetching logged-in status:", error);
        })
        .finally(() => {
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
      <div style={{ position: "absolute", top: "75px", right: "10px" }}>
        {isLoggedIn && (
          <Card
            bgcolor="info"
            header="Logged In User"
            body={`${userName}`}
            style={{
              width: "200px", // Adjust width as needed
              margin: "10px", // Adjust margin as needed
            }}
          />
        )}
      </div>
      <Card
        bgcolor="success"
        header="Deposit"
        body={
          isLoggedIn ? (
            <DepositForm userEmail={userEmail} />
          ) : (
            <p>Please log in to access this page.</p>
          )
        }
      />
    </>
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

  const handleAmountChange = (e) => {
    const value = e.currentTarget.value;
    if (/^\d*\.?\d*$/.test(value)) {
      // Only set the amount if it's a valid numeric value
      setAmount(value);
    }
  };

  return (
    <div>
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
      <button type="submit" className="btn btn-light" onClick={handleDeposit}>
        Deposit
      </button>
      <p>{status}</p>
    </div>
  );
}
