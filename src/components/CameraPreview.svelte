<script>
    import { onMount, afterUpdate } from "svelte"
    import * as tf from "@tensorflow/tfjs-core"
    import "@tensorflow/tfjs-backend-webgl"
    import * as bodyPix from "@tensorflow-models/body-pix"

    export let webcamLoaded = false
    export let mediaUrl

    let bodyPixNet
    let webcamPermission = false
    let mainVideo

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

            let bodyPixNet = await bodyPix.load()

            mainVideo.srcObject = stream
            mainVideo.play()
        }
    })

    afterUpdate(() => {
        if (mediaUrl) {
            mainVideo.src = mediaUrl
            mainVideo.loop = true
            mainVideo.play()
        }
    })
</script>

<style>
    video {
        width: 425px;
        height: 280px;
        background-color: #000000;
        position: fixed;
        bottom: 50px;
        left: 50px;
        border-radius: 1rem;
        border: 0.5rem solid #FFFFFF;
        box-shadow: 0 0 3rem 0 rgba(0, 0, 0, 0.2);
        object-fit: cover;
    }
</style>

{#if webcamPermission && !mediaUrl}<video muted bind:this={mainVideo} />{/if}
{#if mediaUrl}<video muted bind:this={mainVideo} />{/if}
