function AllData() {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    fetch("/account/all")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  return (
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
  );
}
