import React, { Component } from "react"
import * as bodyPix from "@tensorflow-models/body-pix"
import { drawGreenScreenEffect } from "./utils"

let net = bodyPix.BodyPix

class BodyPixService extends Component {

  componentDidMount = () => {
    this.init()
  }

  init = async () => {
    if (!net) {
      net = await bodyPix.load()
    }
  }

  export drawGreenScreen = async (canvas, image, background) => {
    if (!net) return
    let personSegmentation = await net.segmentPerson(image)
    drawGreenScreenEffect(canvas, image, background, personSegmentation)
  }
}

export default BodyPixService
