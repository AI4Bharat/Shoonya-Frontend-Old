import "./App.css";
import { Button } from "antd";
import { Link } from "react-router-dom";
import {React} from "react";

function App() {
  const handleRedirect = () => {
    if (localStorage.getItem('shoonya_access_token')) {
      window.location.pathname = "/dashboard";
    } else {
      window.location.pathname = "/login";
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={"ai4bharat.png"} alt="logo" />
        <p>Shoonya by AI4Bharat</p>
        <Link to="#">
          <Button size="large" type="primary" onClick={handleRedirect}>
            Login
          </Button>
        </Link>
      </header>
    </div>
  );
}

export default App;
