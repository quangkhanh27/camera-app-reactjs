import React from "react";
import "./App.css";
import axios from "axios";

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
      .getUserMedia({
        video: {
          width: 400,
          height: 400,
        },
      })
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

    let formData = new FormData();
    formData.append("File", canvas.toDataURL().split(",")[1]);

    let url = 'http://localhost:5000/'

    axios.post(url, formData).then((res) => {
      console.log("ok");
    }).catch((res) => {
      console.log("err");
    })
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
      <div className="app">
        <div className="app__container">
          {playerORImage}
        </div>
        <div className="app__input">
          <form>
            <button onClick={this.initializeMedia}>Take Photo</button>
            <button onClick={this.capturePicture}>Capture</button>
            <input className="inputFile" type="file" accept=".png, .jpeg" />
          </form>
        </div>
        <div className="app__img">
          <div className="app__img1">
            {/* {playerORImage} */}
          </div>
          <div className="app__img1">
            {/* {playerORImage} */}
          </div>
          <div className="app__img1">
            {/* {playerORImage} */}
          </div>
        </div>
        <div>
          <table>
            <tr>
              <th>File</th>
              <th>Name</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Date</th>
              <th>Price</th>
            </tr>
            <tr>
              <td>Alfreds Futterkiste</td>
              <td>Maria Anders</td>
              <td>Germany</td>
              <td>Maria Anders</td>
              <td>Germany</td>
              <td>Germany</td>
            </tr>
            <tr>
              <td>Centro comercial Moctezuma</td>
              <td>Francisco Chang</td>
              <td>Mexico</td>
              <td>Francisco Chang</td>
              <td>Mexico</td>
              <td>Mexico</td>
            </tr>
            <tr>
              <td>Ernst Handel</td>
              <td>Roland Mendel</td>
              <td>Austria</td>
              <td>Roland Mendel</td>
              <td>Austria</td>
              <td>Austria</td>
            </tr>
            <tr>
              <td>Island Trading</td>
              <td>Helen Bennett</td>
              <td>UK</td>
              <td>Helen Bennett</td>
              <td>UK</td>
              <td>UK</td>
            </tr>
            <tr>
              <td>Laughing Bacchus Winecellars</td>
              <td>Yoshi Tannamuri</td>
              <td>Canada</td>
              <td>Yoshi Tannamuri</td>
              <td>Canada</td>
              <td>Canada</td>
            </tr>
            <tr>
              <td>Magazzini Alimentari Riuniti</td>
              <td>Giovanni Rovelli</td>
              <td>Italy</td>
              <td>Giovanni Rovelli</td>
              <td>Italy</td>
              <td>Italy</td>
            </tr>
          </table>
        </div>
      </div>
    );
  }
}

export default App;
