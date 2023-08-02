import "./App.css";
import { Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Link to="/signin">Signin</Link>
        <Link to="/signup">Signup</Link>
        <Link to="/table">Table</Link>
      </header>
    </div>
  );
}

export default App;
