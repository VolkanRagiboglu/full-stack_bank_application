function CreateAccount() {
  const [show, setShow] = React.useState(true);
  const [status, setStatus] = React.useState("");

  const handleCreateAccount = () => {
    setShow(false);
  };

  return (
    <Card
      bgcolor="primary"
      header="Create Account"
      status={status}
      body={
        show ? (
          <CreateForm
            handleCreateAccount={handleCreateAccount}
            setStatus={setStatus}
          />
        ) : (
          <CreateMsg setShow={setShow} />
        )
      }
    />
  );
}

function CreateMsg(props) {
  return (
    <>
      <h5>Success</h5>
      <button
        type="button"
        className="btn btn-light"
        onClick={() => props.setShow(true)}
      >
        Add another account
      </button>
    </>
  );
}

function CreateForm({ handleCreateAccount, setStatus }) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [nameError, setNameError] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");

  const validateName = () => {
    if (!name) {
      setNameError("Name field cannot be empty");
      return false;
    }
    if (!/^[a-zA-Z]+$/.test(name)) {
      setNameError("Name can only contain letters");
      return false;
    }
    if (name.length < 3) {
      setNameError("Name must be at least 3 characters long");
      return false;
    }
    setNameError("");
    return true;
  };

  const validateEmail = () => {
    if (!email) {
      setEmailError("Email field cannot be empty");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Invalid email format");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = () => {
    if (!password && password.length === 0) {
      setPasswordError("Password field cannot be empty");
      return false;
    }
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return false;
    }
    if (
      !/[a-zA-Z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[^a-zA-Z0-9]/.test(password)
    ) {
      setPasswordError(
        "Password must contain at least one letter, one number, and one special character"
      );
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleCreate = async () => {
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (!isNameValid || !isEmailValid || !isPasswordValid) {
      return;
    }

    const existingUser = await checkExistingUser(name, email);

    if (existingUser) {
      setStatus("Account already exists");
      return;
    }

    const url = `/account/create/${name}/${email}/${password}`;
    try {
      const response = await fetch(url, {
        method: "POST",
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        handleCreateAccount(); // Call parent function to switch to success message
      } else {
        throw new Error("Failed to create account");
      }
    } catch (error) {
      console.error("Error creating account:", error.message);
    }
  };

  const isAnyFieldNotEmpty = () => {
    return name.trim() !== "" || email.trim() !== "" || password.trim() !== "";
  };

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <>
      Name
      <br />
      <input
        type="text"
        className="form-control"
        placeholder="Enter name"
        value={name}
        onChange={(e) => {
          const capitalizedName = capitalizeFirstLetter(e.target.value);
          setName(capitalizedName);
          if (email && password && !capitalizedName) {
            setNameError("Name field cannot be empty");
          } else {
            setNameError("");
          }
        }}
      />
      {nameError && <div style={{ color: "red" }}>{nameError}</div>}
      <br />
      Email address
      <br />
      <input
        type="email"
        className="form-control"
        placeholder="Enter email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (password && !email && name) {
            setEmailError("Email field cannot be empty");
          } else {
            setEmailError("");
          }
        }}
      />
      {emailError && <div style={{ color: "red" }}>{emailError}</div>}
      <br />
      Password
      <br />
      <input
        type="password"
        className="form-control"
        placeholder="Enter password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (!password && email && name) {
            setPasswordError("Password field cannot be empty");
          } else {
            setPasswordError("");
          }
        }}
      />
      {passwordError && <div style={{ color: "red" }}>{passwordError}</div>}
      <br />
      <button
        type="button"
        className="btn btn-light"
        onClick={handleCreate}
        disabled={!isAnyFieldNotEmpty()}
      >
        Create Account
      </button>
    </>
  );
}

async function checkExistingUser(name, email) {
  try {
    const response = await fetch(`/account/find/${email}`);
    if (response.ok) {
      const data = await response.json();
      return data.length > 0;
    } else {
      throw new Error("Failed to check existing user");
    }
  } catch (error) {
    console.error("Error checking existing user:", error.message);
    return false;
  }
}
