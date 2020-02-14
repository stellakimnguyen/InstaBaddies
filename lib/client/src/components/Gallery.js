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

const storageService = firebase.storage();
const storage = storageService.ref();

class Gallery extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      imageUrls: []
    }

  }
  renderImage(imageUrl) {
    return (
      <div key={imageUrl}>
        <img src={imageUrl} />
      </div>
    );
  }

  print(name) {
    return (
      <div key={name}>
        {name}
      </div>
    );

  }


  getImage(imageName) {
    let { state } = this;
    storage.child(`images/${imageName}.jpg`).getDownloadURL()
      .then(imageUrl => {
        state.imageUrls.push(imageUrl)
        this.setState(state)
        // this.renderImage(imageUrl)
      }).catch((error) => {
        throw new Error('Unable to Upload image ...');
      })
    return (
      <div>
        hi
        {this.state.imageUrls.map(imageUrl => (this.renderImage(imageUrl)))}
      </div>
    )
  }

  render() {
    // this.props.imageNames.map((imageName, index) => (
    //   this.getImage(imageName)
    // ))

    return (
      <div className="gallery">
        <div className="images">
          {
            //   this.print(this.props.imageNames)
            this.props.imageNames.map((imageName, index) => (
              this.getImage(imageName)
            ))
          }
        </div>
      </div>
    );
  }
}
// Gallery.propTypes = {
//   imageUrls: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
// };
export default Gallery;