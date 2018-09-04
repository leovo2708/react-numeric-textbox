import React from 'react';
import ReactDOM from 'react-dom';
import Basic from './Basic/Basic';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="text-center">
          <h1>react-numeric-textbox</h1>
          <h2>ReactJS numeric textbox component</h2>
        </div>
        <br />
        <h3>1. Basic example</h3>
        <Basic />
        <h3>2. Advanced example</h3>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));