import React from 'react';
import './App.css';

import Login from './Login';
import Dashboard from "./Dashboard";

class App extends React.Component {
  reload = () => {
    this.forceUpdate();
  }
  render() {
    return (
        <div className="App">
          {!localStorage.getItem('token') ? <Login onSuccess={this.reload} /> : <Dashboard onError={this.reload}/>}
        </div>
    );
  }
}

export default App;
