function Deposit() {
  const [show, setShow] = React.useState(true);
  const [status, setStatus] = React.useState("");
  const [userEmail, setUserEmail] = React.useState("");

  // Check if user is logged in
  React.useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      setUserEmail(userEmail);
    }
  }, []);

  return (
    <Card
      bgcolor="warning"
      header="Deposit"
      status={status}
      body={
        show ? (
          <DepositForm
            setShow={setShow}
            setStatus={setStatus}
            userEmail={userEmail}
          />
        ) : (
          <DepositMsg setShow={setShow} setStatus={setStatus} />
        )
      }
    />
  );
}

function DepositMsg(props) {
  return (
    <>
      <h5>Success</h5>
      <button
        type="submit"
        className="btn btn-light"
        onClick={() => {
          props.setShow(true);
          props.setStatus("");
        }}
      >
        Deposit again
      </button>
    </>
  );
}

function DepositForm(props) {
  const [amount, setAmount] = React.useState("");

  function handle() {
    // Fetch deposit logic using props.userEmail
    fetch(`/account/update/${props.userEmail}/${amount}`)
      .then((response) => response.text())
      .then((text) => {
        try {
          const data = JSON.parse(text);
          props.setStatus(JSON.stringify(data.value));
          props.setShow(false);
          console.log("JSON:", data);
        } catch (err) {
          props.setStatus("Deposit failed");
          console.log("err:", text);
        }
      });
  }

  return (
    <>
      {props.userEmail ? (
        <>
          <h6>You are logged in as: {props.userEmail}</h6>
          <button
            type="submit"
            className="btn btn-light"
            onClick={() => props.setShow(false)}
          >
            Continue
          </button>
        </>
      ) : (
        <>
          <label htmlFor="amount">Amount:</label>
          <input
            id="amount"
            type="number"
            className="form-control"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.currentTarget.value)}
          />
          <br />

          <button type="submit" className="btn btn-light" onClick={handle}>
            Deposit
          </button>
        </>
      )}
    </>
  );
}
