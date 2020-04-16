import React, { Component } from "react"
import { drawGreenScreenEffect } from "../services/utils"
import * as bodyPix from "@tensorflow-models/body-pix"
import axios from "axios"

import Layout from "../components/layout"
import SEO from "../components/seo"

class IndexPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      webcamLoaded: false,
      webcamPermission: false,
      mediaList: [],
      searchText: "",
      typing: false,
    };
  }
  
  componentDidMount = async () => {
    let stream
    try {
      stream = await navigator.mediaDevices.getUserMedia({audio: false, video: true})
    } catch(err) {
      this.setState({ webcamLoaded: true }, () => this.getMedia())
    }

    if (stream) {
      this.setState({ webcamLoaded: true, webcamPermission: true }, async () => {
        // let canvas = document.getElementById("canvas")
        let video = document.getElementById("video")

        let net = await bodyPix.load()
        this.setState({ net }, () => this.getMedia())

        let videoElm = video
            videoElm.srcObject = stream
            videoElm.onloadedmetadata = () => {
              if (this.state.customBackground) {
                // videoElm.width = videoElm.videoWidth
                // videoElm.height = videoElm.videoHeight

                // canvas.height = videoElm.videoHeight
                // canvas.width = videoElm.videoWidth
              }
            }
            videoElm.play()
      })
    }
  }

  getMedia = () => {
    const options = {
      headers: {"Authorization": process.env.GATSBY_PEXELS_API_KEY}
    }

    axios.get("https://api.pexels.com/videos/popular?per_page=30&page=1", options).then((res) => {
      this.setState({ mediaList: res.data.videos })
    })
  }

  searchMedia = (e) => {
    const searchText = e.target.value

    this.setState({ typing: false })

    const options = {
      headers: {"Authorization": process.env.GATSBY_PEXELS_API_KEY}
    }

    axios.get("https://api.pexels.com/videos/search?query="+searchText+"&per_page=30&page=1", options).then((res) => {
      this.setState({ mediaList: res.data.videos })
    })
  }

  selectMedia = (media, id) => {
    this.setState({ customBackground: media }, () => {
      document.getElementById("video").style.display = "none"

      const bgVideo = document.getElementById("bg_video")
      bgVideo.play()

      const allMediaItems = document.querySelectorAll(".media_list-item")

      allMediaItems.forEach((item) => {
        item.classList.remove("active")
      })

      const thisMediaItem = document.getElementById(id)
      thisMediaItem.classList.add("active")

      if (!this.state.canvasRunning) {
        setTimeout(() => {
          this.renderVideo()
        }, 3000)
      }
    }, this)
  }

  renderVideo = async () => {
    let canvas = document.getElementById("canvas")
    let video = document.getElementById("video")

    video.width = video.videoWidth
    video.height = video.videoHeight

    canvas.height = video.videoHeight
    canvas.width = video.videoWidth

    let personSegmentation = await this.state.net.segmentPerson(video)
    drawGreenScreenEffect(canvas, video, personSegmentation)
    requestAnimationFrame(this.renderVideo.bind(this))

    this.setState({ canvasRunning: true })
  }

  render() {
    return(
      <Layout>
        <SEO title="Instantly Preview Great Conference Virtual Backgrounds" />
        <header
          style={{
            paddingTop: `2rem`,
            paddingBottom: `2rem`,
          }}
        >
          <div
            style={{
              margin: `0 auto`,
              width: 840,
            }}
          >
            <input
              type="text"
              className="search"
              placeholder="Find fun, crazy, or useful backgrounds..."
              value={ this.state.searchText }
              onChange={e => this.setState({ searchText: e.target.value, typing: true })}
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  this.searchMedia(e)
                }
              }}
              style={{
                border: 0,
                width: 840,
                padding: `0.75rem 1rem`,
                borderRadius: `0.5rem`,
                boxShadow: `0 0 1.0rem 0 #EAEAEA`,
                color: `#696969`,
                fontSize:  `1rem`,
              }}
            />
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fal"
              data-icon="search" 
              className="svg-inline--fa fa-search fa-w-16"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              style={{
                position: "absolute",
                pointerEvents: "none",
                marginLeft: "-2.5rem",
                marginTop: "0.85rem",
                height: "1.2rem",
                color: "#6396FF",
              }}
            >
              <path
                fill="currentColor"
                d="M508.5 481.6l-129-129c-2.3-2.3-5.3-3.5-8.5-3.5h-10.3C395 312 416 262.5 416 208 416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c54.5 0 104-21 141.1-55.2V371c0 3.2 1.3 6.2 3.5 8.5l129 129c4.7 4.7 12.3 4.7 17 0l9.9-9.9c4.7-4.7 4.7-12.3 0-17zM208 384c-97.3 0-176-78.7-176-176S110.7 32 208 32s176 78.7 176 176-78.7 176-176 176z">
              </path>
            </svg>
          </div>
        </header>
        <div
          style={{
            margin: `0 auto`,
            width: 840,
          }}
        >
        {this.state.searchText && this.state.typing === false ?
          <React.Fragment>
            <h1>{ this.state.searchText }</h1>
            <p
              style={{
                lineHeight: 1.75,
                fontSize: "1.25rem",
                color: `#696969`,
                fontStyle: `italic`,
              }}
            >
              Select media below to instantly see how they look as your background.
            </p>
          </React.Fragment>
        :
          <React.Fragment>
            <h1>Zoom Backgrounds</h1>
            <p
              style={{
                lineHeight: 1.75,
                fontSize: "1.25rem",
                color: `#696969`,
              }}
            >
              Gone are the days of guessing if a background will look good or not. <br />
              Instantly preview backgrounds with your webcam and download your favorites!
            </p>
          </React.Fragment>
        }
        </div>
        {!this.state.webcamLoaded &&
          <div
            style={{
              margin: `2.5rem auto`,
              width: 920,
              borderRadius: `1.0rem`,
              padding: `4.0rem`,
              border: `0.5rem solid #FFFFFF`,
              background: `linear-gradient(#96AEFF, #6396FF)`,
              boxShadow: `0 0 3.0rem 0 #EAEAEA`,
              textAlign: `center`,
            }}
          >
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fal"
              data-icon="webcam"
              className="svg-inline--fa fa-webcam fa-w-14"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              style={{
                height: "12rem",
                color: "#FFFFFF",
              }}
            >
              <path
                fill="currentColor"
                d="M401 438.6l-49.19-30.75C409.88 367.39 448 300.19 448 224 448 100.29 347.71 0 224 0S0 100.29 0 224c0 76.19 38.12 143.39 96.23 183.85L47 438.6a32 32 0 0 0-15 27.14V480a32 32 0 0 0 32 32h320a32 32 0 0 0 32-32v-14.26a32 32 0 0 0-15-27.14zM32 224c0-106 86-192 192-192s192 86 192 192-86 192-192 192S32 330 32 224zm352 256H64v-14.26L127.62 426a221.84 221.84 0 0 0 192.76 0L384 465.74zm0-256a160 160 0 1 0-160 160 160 160 0 0 0 160-160zm-288 0a128 128 0 1 1 128 128A128.14 128.14 0 0 1 96 224zm144-80a16 16 0 0 0-16-16 96.1 96.1 0 0 0-96 96 16 16 0 0 0 32 0 64.07 64.07 0 0 1 64-64 16 16 0 0 0 16-16z">
                </path>
            </svg>
            <h3>Activate Your Webcam to Get Started</h3>
            <p
              style={{
                color: `#FFFFFF`,
                padding: `0 3.5rem`,
                textAlign: `left`,
                fontSize: `1.0rem`,
                lineHeight: `1.6rem`,
              }}
            >
              I don't do anything with your data. The site simply runs your webcam feed  through a machine learning platform: TensorFlow to separate you from your  background. If you're not a fan, simply disable your webcam and browse the  site. You won't be able to preview backgrounds with your webcam, but I won't nag you :)
            </p>
          </div>
        }
        {this.state.webcamPermission && this.state.customBackground && 
          <React.Fragment>
            <canvas
              id="canvas"
              style={{
                width: `425px`,
                height: `300px`,
                position: `fixed`,
                bottom: `50px`,
                left: `50px`,
                borderRadius: `1.0rem`,
                border: `0.5rem solid rgba(0,0,0,0)`,
                zIndex: `1`,
              }}
            />
            <video
              id="bg_video"
              muted
              loop
              src={ this.state.customBackground }
              style={{
                width: `425px`,
                height: `300px`,
                backgroundColor: `#FFFFFF`,
                position: `fixed`,
                bottom: `50px`,
                left: `50px`,
                borderRadius: `1.0rem`,
                border: `0.5rem solid #FFFFFF`,
                boxShadow: `0 0 3.0rem 0 rgba(0, 0, 0, 0.2)`,
                objectFit: `cover`,
              }}
            />
          </React.Fragment>
        }
        {this.state.webcamPermission &&
          <video
            id="video"
            style={{
              width: `425px`,
              height: `300px`,
              backgroundColor: `#FFFFFF`,
              position: `fixed`,
              bottom: `50px`,
              left: `50px`,
              borderRadius: `1.0rem`,
              border: `0.5rem solid #FFFFFF`,
              boxShadow: `0 0 3.0rem 0 rgba(0, 0, 0, 0.2)`,
              objectFit: `cover`,
            }}
          />
        }
        {this.state.webcamLoaded &&
          <div
            style={{
              margin: `0 auto`,
              width: 1140,
              textAlign: `center`,
            }}
          >
          {this.state.mediaList.map((media, idx) =>
            <img
              key={ media.id }
              src={ media.image }
              id={ media.id }
              alt={`Video by ${media.user.name}`}
              className="media_list-item"
              style={{
                width: `350px`,
                height: `195px`,
                backgroundColor: `#FFFFFF`,
                borderRadius: `1.0rem`,
                border: `0.5rem solid #FFFFFF`,
                margin: `0.5rem`,
                objectFit: `cover`,
                cursor: `pointer`,
              }}
              onClick={ () => this.selectMedia(media.video_files[0].link, media.id) }
            />
          )}
          </div>
        }
      </Layout>
    )
  }
}

export default IndexPage