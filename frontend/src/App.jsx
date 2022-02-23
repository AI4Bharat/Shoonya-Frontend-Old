import "./App.css";
import { Button } from "antd";
import { Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={"ai4bharat.png"} alt="logo" />
        <p>Shoonya by AI4Bharat</p>
        <Link to='/login'>
          <Button size="large" type="primary">
            Login
          </Button>
        </Link>
      </header>
    </div>
  );
}

export default App;
