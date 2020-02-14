import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import ImageUpload from './components/ImageUpload';
import DisplayImage from './components/DisplayImage';
import Gallery from "./components/Gallery";

// ReactDOM.render(<App />, document.getElementById("app"));

// class PostsSection extends React.Component {
//   render() {
//         return (
//           <Upload />
//         );
//   }
// }

// ReactDOM.render(
//   <DisplayImage />, document.getElementById("app")

// );
ReactDOM.render(
  <ImageUpload />, document.getElementById("app")

);



// let names = [
//   'randyFist', 'randyWoot', 'randyFarmer'
// ];

// ReactDOM.render(<Gallery imageNames={names} />, document.getElementById("app"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
