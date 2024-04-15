function AllData() {
  const [data, setData] = React.useState([]);
  const [loggedInUser, setLoggedInUser] = React.useState(null);

  // Fetch logged-in status and user information when the component mounts
  React.useEffect(() => {
    fetchLoggedInStatus();
    fetch("/account/all")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  // Function to fetch user's logged-in status from backend
  const fetchLoggedInStatus = () => {
    const loggedInEmail = localStorage.getItem("email");
    if (loggedInEmail) {
      fetch(`/account/find/${encodeURIComponent(loggedInEmail)}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              "Failed to fetch logged-in status: " + response.status
            );
          }
          return response.json();
        })
        .then((data) => {
          const isLoggedIn = data.some((user) => user.loggedIn);
          if (isLoggedIn) {
            const loggedInUser = data.find((user) => user.loggedIn);
            setLoggedInUser(loggedInUser.name);
          }
        })
        .catch((error) => {
          console.error("Error fetching logged-in status:", error);
        });
    }
  };

  return (
    <>
      <div style={{ position: "absolute", top: "75px", right: "10px" }}>
        {loggedInUser && (
          <Card
            bgcolor="info"
            header="Logged In User"
            body={`${loggedInUser}`}
            style={{
              width: "200px", // Adjust width as needed
              margin: "10px", // Adjust margin as needed
            }}
          />
        )}
      </div>
      <Card
        txtcolor="black"
        header="All Data in Store"
        body={
          <div>
            {data.map((item, index) => (
              <div key={index} className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">Email: {item.email}</p>
                  <p className="card-text">Balance: {item.balance}</p>
                </div>
              </div>
            ))}
          </div>
        }
      />
    </>
  );
}
