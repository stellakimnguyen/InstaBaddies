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
// firebase.initializeApp(config);
const storage = firebase.storage();


export default class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      url: '',
      progress: 0
    }
    this.handleChange = this
      .handleChange
      .bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }
  handleChange = e => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      this.setState(() => ({ image }));
    }
  }
  handleUpload = () => {
    const { image } = this.state;
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on('state_changed',
      (snapshot) => {
        // progrss function ....
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        this.setState({ progress });
      },
      (error) => {
        // error function ....
        console.log(error);
      },
      () => {
        // complete function ....
        storage.ref('images').child(image.name).getDownloadURL()
          // storage.ref('images').child(image.name).getDownloadURL()
          .then(url => {
            console.log(url);
            this.setState({ url });
          })
      });
  }
  render() {
    return (
      <div>
        <progress value={this.state.progress} max="100" />
        <br />
        <input type="file" onChange={this.handleChange} />
        <button onClick={this.handleUpload}>Upload</button>
        <br />
        <img src={this.state.url || 'http://via.placeholder.com/400x300'} alt="Uploaded images" height="300" width="400" />
      </div>
    )
  }
}
