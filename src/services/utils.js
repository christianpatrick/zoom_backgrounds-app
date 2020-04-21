import { cpuBlur } from "@tensorflow-models/body-pix/dist/blur"

const offScreenCanvases = {}

const CANVAS_NAMES = {
  blurred: "blurred",
  blurredMask: "blurred-mask",
  mask: "mask",
  lowresPartMask: "lowres-part-mask",
}

function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
}

function flipCanvasHorizontal(canvas) {
  const ctx = canvas.getContext("2d")
  ctx.scale(-1, 1)
  ctx.translate(-canvas.width, 0)
}

function drawWithCompositing(ctx, image, compositOperation) {
  ctx.globalCompositeOperation = compositOperation
  ctx.drawImage(image, 0, 0)
}

function createOffScreenCanvas() {
  const offScreenCanvas = document.createElement("canvas")
  return offScreenCanvas
}

function ensureOffscreenCanvasCreated(id) {
  if (!offScreenCanvases[id]) {
    offScreenCanvases[id] = createOffScreenCanvas()
  }
  return offScreenCanvases[id]
}

function drawAndBlurImageOnCanvas(image, blurAmount, canvas) {
  const { height, width } = image
  const ctx = canvas.getContext("2d")
  canvas.width = width
  canvas.height = height
  ctx.clearRect(0, 0, width, height)
  ctx.save()
  if (isSafari()) {
    cpuBlur(canvas, image, blurAmount)
  } else {
    ctx.filter = `blur(${blurAmount}px)`
    ctx.drawImage(image, 0, 0, width, height)
  }
  ctx.restore()
}

function drawAndBlurImageOnOffScreenCanvas(
  image,
  blurAmount,
  offscreenCanvasName
) {
  const canvas = ensureOffscreenCanvasCreated(offscreenCanvasName)
  if (blurAmount === 0) {
    renderImageToCanvas(image, canvas)
  } else {
    drawAndBlurImageOnCanvas(image, blurAmount, canvas)
  }
  return canvas
}

function renderImageToCanvas(image, canvas) {
  const { width, height } = image
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")

  ctx.drawImage(image, 0, 0, width, height)
}

function renderImageDataToCanvas(image, canvas) {
  canvas.width = image.width
  canvas.height = image.height
  const ctx = canvas.getContext("2d")

  ctx.putImageData(image, 0, 0)
}

function renderImageDataToOffScreenCanvas(image, canvasName) {
  const canvas = ensureOffscreenCanvasCreated(canvasName)
  renderImageDataToCanvas(image, canvas)

  return canvas
}

export function toMaskImageData(segmentation, maskBackground = true) {
  const { width, height, data } = segmentation
  const bytes = new Uint8ClampedArray(width * height * 4)

  for (let i = 0; i < height * width; ++i) {
    const shouldMask = maskBackground ? 1 - data[i] : data[i]
    const alpha = shouldMask * 255

    const j = i * 4
    bytes[j + 0] = 0
    bytes[j + 1] = 0
    bytes[j + 2] = 0
    bytes[j + 3] = Math.round(alpha)
  }

  return new ImageData(bytes, width, height)
}

function createPersonMask(segmentation, edgeBlurAmount) {
  const maskBackground = false
  const backgroundMaskImage = toMaskImageData(segmentation, maskBackground)

  const backgroundMask = renderImageDataToOffScreenCanvas(
    backgroundMaskImage,
    CANVAS_NAMES.mask
  )
  if (edgeBlurAmount === 0) {
    return backgroundMask
  } else {
    return drawAndBlurImageOnOffScreenCanvas(
      backgroundMask,
      edgeBlurAmount,
      CANVAS_NAMES.blurredMask
    )
  }
}

export function drawGreenScreenEffect(
  canvas,
  image,
  personSegmentation,
  edgeBlurAmount = 3
) {
  const personMask = createPersonMask(personSegmentation, edgeBlurAmount)
  const ctx = canvas.getContext("2d")
  ctx.save()

  flipCanvasHorizontal(canvas)

  ctx.drawImage(image, 0, 0)
  drawWithCompositing(ctx, personMask, "destination-in")
  ctx.restore()
}
