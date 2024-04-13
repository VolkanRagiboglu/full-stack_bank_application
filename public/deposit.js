function Deposit() {
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
      {/* {userDetails && <p>Logged in user: {userDetails.name}</p>} */}
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
