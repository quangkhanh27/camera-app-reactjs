import React from "react";
import "./App.css";

class App extends React.Component {
  state = {
    imageDataURL: null,
    counter: 0,
  };

  initializeMedia = () => {
    this.setState({ imageDataURL: null });

    if (!("mediaDevices" in navigator)) {
      navigator.mediaDevices = {};
    }

    if (!("getUserMedia" in navigator.mediaDevices)) {
      navigator.mediaDevices.getUserMedia = function (constraints) {
        var getUserMedia =
          navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        if (!getUserMedia) {
          return Promise.reject(new Error("getUserMedia Not Implemented"));
        }

        return new Promise((resolve, reject) => {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      };
    }

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        this.player.srcObject = stream;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  capturePicture = () => {
    var canvas = document.createElement("canvas");
    canvas.width = this.player.videoWidth;
    canvas.height = this.player.videoHeight;
    var contex = canvas.getContext("2d");
    contex.drawImage(this.player, 0, 0, canvas.width, canvas.height);
    this.player.srcObject.getVideoTracks().forEach((track) => {
      track.stop();
    });

    console.log(canvas.toDataURL());
    let counter = this.state.counter + 1;
    this.setState({ imageDataURL: canvas.toDataURL(), counter });

    const a = document.createElement("a"); //Create <a>
    a.href = canvas.toDataURL(); //Image Base64 Goes here
    a.download = `${counter}.png`; //File name Here
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // window.location.href =
    //   "data:application/octet-stream;base64," + canvas.toDataURL.split(",")[1];
  };

  render() {
    const playerORImage = Boolean(this.state.imageDataURL) ? (
      <img src={this.state.imageDataURL} />
    ) : (
      <video
        ref={(refrence) => {
          this.player = refrence;
        }}
        autoPlay
      ></video>
    );

    return (
      <div className="App">
        {playerORImage}
        <button onClick={this.initializeMedia}>Take Photo</button>
        <button onClick={this.capturePicture}>Capture</button>
      </div>
    );
  }
}

export default App;
