import "./App.css";
import { Button } from "antd";
import { Link } from "react-router-dom";
import {React} from "react";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    if (localStorage.getItem('shoonya_access_token')) {
      window.location.pathname = "/dashboard";
    } else {
      window.location.pathname = "/login";
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={"ai4bharat.png"} alt="logo" />
        <p>Shoonya by AI4Bharat</p>
        <Link to="/login">
          <Button size="large" type="primary">
            Login
          </Button>
        </Link>
      </header>
    </div>
  );
}

export default App;
