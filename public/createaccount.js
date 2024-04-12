function CreateAccount() {
  const [show, setShow] = React.useState(true);
  const [status, setStatus] = React.useState("");

  return (
    <Card
      bgcolor="primary"
      header="Create Account"
      status={status}
      body={
        show ? (
          <CreateForm setShow={setShow} />
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
        type="submit"
        className="btn btn-light"
        onClick={() => props.setShow(true)}
      >
        Add another account
      </button>
    </>
  );
}

function CreateForm(props) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  async function handle() {
    const url = `/account/create/${name}/${email}/${password}`;
    try {
      const response = await fetch(url, {
        method: "POST",
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        props.setShow(false);
      } else {
        throw new Error("Failed to create account");
      }
    } catch (error) {
      console.error("Error creating account:", error.message);
    }
  }

  return (
    <>
      Name
      <br />
      <input
        type="input"
        className="form-control"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
      />
      <br />
      Email address
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
        Create Account
      </button>
    </>
  );
}
