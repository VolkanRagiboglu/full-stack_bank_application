function NavBar() {
  // Function to handle click on nav links
  const handleClick = (event) => {
    // Remove the 'active' class from all nav links
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.classList.remove("active");
    });

    // Remove the 'active' class from the navbar brand link
    const brandLink = document.querySelector(".navbar-brand");
    brandLink.classList.remove("active");

    // Add the 'active' class to the clicked nav link
    event.target.classList.add("active");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="#" onClick={handleClick}>
        BadBank
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link"
              href="#/CreateAccount/"
              onClick={handleClick}
            >
              Create Account
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#/login/" onClick={handleClick}>
              Login
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#/deposit/" onClick={handleClick}>
              Deposit
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#/withdraw/" onClick={handleClick}>
              Withdraw
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#/balance/" onClick={handleClick}>
              Balance
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#/alldata/" onClick={handleClick}>
              AllData
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
