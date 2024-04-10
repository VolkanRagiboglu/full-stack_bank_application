function Login({ email }) {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [status, setStatus] = React.useState("");

  // Check if user is already logged in
  React.useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (loggedIn === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogoff = async () => {
    try {
      // Get the email from local storage
      const loggedInEmail = localStorage.getItem("email");
      if (!loggedInEmail) {
        setStatus("No user logged in");
        return;
      }

      // Call the logoff endpoint with the correct email value
      const response = await fetch(`/account/logoff/${loggedInEmail}`);
      if (response.ok) {
        setStatus("Logged off successfully");
        setIsLoggedIn(false);
        localStorage.removeItem("isLoggedIn");
      } else {
        const data = await response.json();
        setStatus(data.message || "Error logging off");
      }
    } catch (error) {
      console.error("Error logging off:", error);
      setStatus("Error logging off");
    }
  };

  return (
    <Card
      bgcolor="secondary"
      header="Login"
      status={status}
      body={
        isLoggedIn ? (
          <LoginMsg handleLogoff={handleLogoff} />
        ) : (
          <LoginForm setIsLoggedIn={setIsLoggedIn} setStatus={setStatus} />
        )
      }
    />
  );
}

function LoginMsg({ handleLogoff }) {
  return (
    <>
      <h5>Success</h5>
      <button type="button" className="btn btn-light" onClick={handleLogoff}>
        Logoff
      </button>
    </>
  );
}

function LoginForm({ setIsLoggedIn, setStatus }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  function handle() {
    fetch(`/account/login/${email}/${password}`)
      .then((response) => response.text())
      .then((text) => {
        try {
          const data = JSON.parse(text);
          setStatus("");
          setIsLoggedIn(true);
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("email", email); // Store email in local storage
          console.log("JSON:", data);
        } catch (err) {
          setStatus(text);
          console.log("err:", text);
        }
      });
  }

  return (
    <>
      Email
      <br />
      <input
        type="input"
        className="form-control"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
      />
      <br />
      Password
      <br />
      <input
        type="password"
        className="form-control"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
      />
      <br />
      <button type="submit" className="btn btn-light" onClick={handle}>
        Login
      </button>
    </>
  );
}
