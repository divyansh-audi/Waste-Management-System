import React,{useState,useEffect} from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");

  useEffect(()=>{
    axios.get('http://localhost:5000/api/test')
      .then(response=>{
        setMessage(response.data.message);
      })
      .catch(error=>{
        console.error("There was an error fetching the message!", error);
      })
  },[]);
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>Waste Management System</h1>
        <p>Message from backend: <strong>{message}</strong></p>
      </header>
    </div>
  );
}

export default App;