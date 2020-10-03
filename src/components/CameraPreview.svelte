<script>
    import { onMount } from "svelte"
    import * as tf from "@tensorflow/tfjs-core"
    import "@tensorflow/tfjs-backend-webgl"
    import * as bodyPix from "@tensorflow-models/body-pix"

    let bodyPixNet
    let webcamLoaded = false
    let webcamPermission = false
    let cameraVideo

    onMount(async () => {
        let stream
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: true,
            })
        } catch (err) {
            webcamLoaded = true

            // getMedia()
        }

        if (stream) {
            webcamLoaded = true
            webcamPermission = true

            let bodyPixNet = await bodyPix.load()

            // getMedia()

            let videoElm = cameraVideo
            videoElm.srcObject = stream
            // videoElm.onloadedmetadata = () => {
            //   if (this.state.customBackground) {
            //     // videoElm.width = videoElm.videoWidth
            //     // videoElm.height = videoElm.videoHeight

            //     // canvas.height = videoElm.videoHeight
            //     // canvas.width = videoElm.videoWidth
            //   }
            // }
            videoElm.play()
        }
    })
</script>

<style>
    video {
        width: 425px;
        height: 300px;
        background-color: #ffffff;
        position: fixed;
        bottom: 50px;
        left: 50px;
        border-radius: 1rem;
        border: 0.5rem solid #ffffff;
        box-shadow: 0 0 3rem 0 rgba(0, 0, 0, 0.2);
        object-fit: cover;
    }
</style>

{#if webcamPermission}<video bind:this={cameraVideo} />{/if}
