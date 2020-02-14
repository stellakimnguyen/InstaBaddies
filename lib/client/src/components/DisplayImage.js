import React from 'react';
import firebase from "firebase/app";
// Add the Firebase products that you want to use
import 'firebase/storage';
// Initialize Firebase
const config = {
  apiKey: "AIzaSyALBCMszAL_K5QvJhHphOOqE6bUZytI3EQ",
  authDomain: "uploadimage-cf2ea.firebaseapp.com",
  databaseURL: "https://uploadimage-cf2ea.firebaseio.com",
  projectId: "uploadimage-cf2ea",
  storageBucket: "uploadimage-cf2ea.appspot.com",
  messagingSenderId: "71221404333",
  appId: "1:71221404333:web:596d8ff607c65ae5989c24"
};

// firebase.initializeApp(config)
// Create a root reference to upload or get a file from Cloud storage
/**
 * storageService is a reference to firebase storage service
 *  — it allows you to use all of the methods they make
 *  available for storing data and files.
 */
const storageService = firebase.storage();
const storage = storageService.ref();


export default class DisplayImage extends React.Component {
  constructor(props) {
    super(props)
    this.state = []
  }

  // let elements be props for now...

  getImage(image) {
    let { state } = this;

    // `url` is the download URL for 'images/stars.jpg'
    storage.child(`images/${image}.jpg`).getDownloadURL()
      .then(url => {
        state[image] = url
        this.setState(state)
      }).catch((error) => {
        // Handle any errors
        console.error(error);
        throw new Error('Unable to Upload image ...');
      })
  }

  renderImage(imageUrl) {
    return (
      <div>
        <img src={imageUrl} />
      </div>
    )
  }

  render() {

    const elements = ['randyFist', 'randyWoot', 'randyFarmer'];

    const urls = []

    const items = []

    for (const [index, value] of elements.entries()) {

      storage.child(`images/${value}.jpg`).getDownloadURL()
        .then(url => {
          // this.state[value] = url
          // this.setState(this.state)
          urls.push(url);


        }).catch((error) => {
          // Handle any errors
          console.error(error);
        })


      // this.getImage(value);
      items.push(<div key={index}>
        <img src={this.state.value} />
        {/* {this.state.randyFist} */}
      </div>)
    }


    return (
      <div>
        <div>
          <img src={this.state.randyWoot} alt="Lithuanian flag" />
        </div>
        <div>
          <img src={this.state.randyFist} alt="UK flag" />
        </div>

        <div>
          {urls.map(imageUrl => this.renderImage(imageUrl))}
        </div>

        <div>
          {items}
        </div>

      </div>
    );
  }
}
