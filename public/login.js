function Login() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(() => {
    // Initialize isLoggedIn from local storage
    return localStorage.getItem("isLoggedIn") === "true";
  });
  const [status, setStatus] = React.useState("");
  const [userName, setUserName] = React.useState(
    localStorage.getItem("userName") || ""
  );

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
          setIsLoggedIn(isLoggedIn);
          if (isLoggedIn) {
            const loggedInUser = data.find((user) => user.loggedIn);
            setUserName(loggedInUser.name);
          }
        })
        .catch((error) => {
          console.error("Error fetching logged-in status:", error);
          setIsLoggedIn(false); // Set isLoggedIn to false on error
        });
    } else {
      setIsLoggedIn(false); // Set isLoggedIn to false when there is no logged-in user
    }
  };

  // Fetch logged-in status when component mounts
  React.useEffect(() => {
    fetchLoggedInStatus();
  }, []);

  const handleLogoff = async () => {
    try {
      const userEmail = localStorage.getItem("email");
      const response = await fetch(`/account/logoff/${userEmail}`);
      if (response.ok) {
        // Update the state only if the logoff request is successful
        setIsLoggedIn(false);
        setUserName("");
        setStatus("Logged off successfully");
        // Clear localStorage
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("email");
        localStorage.removeItem("userName");
      } else {
        const data = await response.json();
        setStatus(data.message || "Error logging off");
      }
    } catch (error) {
      console.error("Error logging off:", error);
      setStatus("Error logging off");
    }
  };

  const handleLogin = (email, password) => {
    fetch(`/account/find/${encodeURIComponent(email)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        return response.json();
      })
      .then((data) => {
        if (data.length === 0) {
          setStatus("Email or password is incorrect");
        } else {
          // Check if password matches
          fetch(`/account/login/${email}/${password}`)
            .then((response) => response.json())
            .then((loginData) => {
              if (loginData.error) {
                setStatus("Email or password is incorrect");
              } else {
                // Login successful
                setStatus("");
                setUserName(loginData.user.name);
                setIsLoggedIn(true); // Update isLoggedIn directly to true
                // Store login status and user details in local storage
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("email", email);
                localStorage.setItem("userName", loginData.user.name);
              }
            })
            .catch((loginError) => {
              console.error("Error logging in:", loginError);
              setStatus("Email or password is incorrect");
            });
        }
      })
      .catch((error) => {
        console.error("Error checking user:", error);
        setStatus("Email or password is incorrect");
      });
  };

  return (
    <>
      <div style={{ position: "absolute", top: "75px", right: "10px" }}>
        {isLoggedIn && (
          <Card
            bgcolor="info"
            header="Logged In User"
            body={`${userName}`}
            style={{
              width: "200px",
              margin: "10px",
            }}
          />
        )}
      </div>
      <Card
        bgcolor="secondary"
        header="Login"
        status={status}
        body={
          isLoggedIn ? (
            <LoginMsg handleLogoff={handleLogoff} />
          ) : (
            <LoginForm handleLogin={handleLogin} />
          )
        }
      />
    </>
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

function LoginForm({ handleLogin }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [isAnyFieldNotEmpty, setIsAnyFieldNotEmpty] = React.useState(false);

  const validateEmail = () => {
    if (!email) {
      setEmailError("Email field cannot be empty");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = () => {
    if (!password) {
      setPasswordError("Password field cannot be empty");
    } else {
      setPasswordError("");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
    setIsAnyFieldNotEmpty(
      value.trim() !== "" || (name === "password" && email.trim() !== "")
    ); // Update isAnyFieldNotEmpty based on whether any field is not empty
  };

  const handleBlur = (name) => {
    if (name === "email") {
      validateEmail();
    } else if (name === "password") {
      validatePassword();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validateEmail();
    validatePassword();
    if (email && password) {
      handleLogin(email, password);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        Email
        <br />
        <input
          type="input"
          className="form-control"
          placeholder="Enter email"
          name="email"
          value={email}
          onChange={handleInputChange}
          onBlur={() => handleBlur("email")}
        />
        {emailError && <div style={{ color: "red" }}>{emailError}</div>}
      </div>
      <div>
        Password
        <br />
        <input
          type="password"
          className="form-control"
          placeholder="Enter password"
          name="password"
          value={password}
          onChange={handleInputChange}
          onBlur={() => handleBlur("password")}
        />
        {passwordError && <div style={{ color: "red" }}>{passwordError}</div>}
      </div>
      <br />
      <button
        type="submit"
        className="btn btn-light"
        disabled={!isAnyFieldNotEmpty}
      >
        Login
      </button>
    </form>
  );
}
