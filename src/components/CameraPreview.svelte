<script>
    import { onMount, afterUpdate } from "svelte"
    import * as tf from "@tensorflow/tfjs-core"
    import "@tensorflow/tfjs-backend-webgl"
    import * as bodyPix from "@tensorflow-models/body-pix"
    import { drawGreenScreenEffect } from "../services/webcam-canvas"

    export let webcamLoaded = false
    export let mediaUrl

    let bodyPixNet, cameraVideo, cameraCanvas, mainVideo
    let webcamPermission = false

    onMount(async () => {
        let stream
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: true,
            })
        } catch (err) {
            webcamLoaded = true
        }

        if (stream) {
            webcamLoaded = true
            webcamPermission = true

            bodyPixNet = await bodyPix.load()

            cameraVideo.srcObject = stream
            cameraVideo.play()
        }
    })

    afterUpdate(async () => {
        if (mediaUrl) {
            mainVideo.src = mediaUrl
            mainVideo.play()

            if (webcamPermission) {
                cameraVideo.style.display = "none"

                cameraVideo.width = cameraVideo.videoWidth
                cameraVideo.height = cameraVideo.videoHeight
                cameraCanvas.height = cameraVideo.videoHeight
                cameraCanvas.width = cameraVideo.videoWidth

                let greenScreenFrame

                async function greenScreen() {
                    let personSegmentation = await bodyPixNet.segmentPerson(cameraVideo)
                    drawGreenScreenEffect(cameraCanvas, cameraVideo, personSegmentation)

                    greenScreenFrame = requestAnimationFrame(greenScreen)
                }

                greenScreen()

                return () => cancelAnimationFrame(greenScreenFrame)
            }
        }
    })
</script>

<style>
    video {
        width: 425px;
        height: 260px;
        background-color: #000000;
        position: fixed;
        bottom: 50px;
        left: 50px;
        border-radius: 1rem;
        border: 0.5rem solid #FFFFFF;
        box-shadow: 0 0 3rem 0 rgba(0, 0, 0, 0.2);
        object-fit: cover;
    }

    canvas {
        width: 425px;
        height: 300px;
        position: fixed;
        bottom: 50px;
        left: 50px;
        border-radius: 1.0rem;
        border: 0.5rem solid rgba(0,0,0,0);
        z-index: 1;
    }
</style>

{#if webcamPermission}
    <canvas bind:this={cameraCanvas} />
    <video muted bind:this={cameraVideo} />
{/if}
{#if mediaUrl}
    <video muted loop bind:this={mainVideo} />
{/if}