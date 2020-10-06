<script>
    import { onMount } from "svelte"
    import { saveAs } from "file-saver"

    export let searchValue
    export let mediaUrl = ""

    let root
    let mediaList = []
    let selectedMedia
    let prevSearchValue = ""
    let pageNumber = 1

    $: {
        getMedia()
        prevSearchValue = searchValue
    }

    onMount(async () => {
        getMedia(true)
    })

    const getMedia = async (forceLoad = false) => {
        if (searchValue !== prevSearchValue || forceLoad) {
            const options = {
                headers: { Authorization: 'PEXELS_API_KEY' },
            }

            if (searchValue !== prevSearchValue) {
                pageNumber = 1
                mediaList = []
            }

            await fetch(
                `https://api.pexels.com/videos/search?query=${
                    searchValue ? searchValue : "background"
                }&per_page=30&page=${pageNumber}`,
                options
            )
                .then((response) => response.json())
                .then((data) => (mediaList = mediaList.concat(data.videos)))
        }
    }

    const selectMedia = (media) => {
        const thisMediaId = media.target.dataset.id
        const allMediaItems = root.querySelectorAll("img")

        mediaUrl = media.target.dataset.video

        allMediaItems.forEach((item) => {
            item.classList.remove("active")
        })

        const thisMediaItem = root.querySelector(`[data-id*="${thisMediaId}"]`)
        thisMediaItem.classList.add("active")
    }

    const downloadMedia = (mediaId) => {
        let mediaDetails = mediaList.filter((el) => el.id == mediaId)
        let supportedVideoFiles = mediaDetails[0].video_files.filter(
            (file) => file.width >= 640 && file.width <= 1280
        )

        supportedVideoFiles.sort((a, b) => {
            return a.width < b.width
        })

        fetch(supportedVideoFiles[0].link, {
            responseType: "blob",
        })
            .then((response) => response.blob())
            .then((blob) => saveAs(blob, `${mediaId}.mp4`))
    }

    window.onscroll = function () {
        const d = document.documentElement

        if (d.scrollTop + window.innerHeight > d.offsetHeight + 20) {
            pageNumber++
            getMedia(true)
        }
    }
</script>

<style>
    section {
        margin: 2rem auto;
        width: 1140px;
        text-align: center;
    }

    div {
        position: relative;
        width: 350px;
        height: 195px;
        float: left;
        margin: 0.5rem;
    }

    img {
        width: 350px;
        height: 195px;
        background-color: #ffffff;
        border-radius: 1rem;
        border: 0.5rem solid #ffffff;
        object-fit: cover;
        cursor: pointer;
        transition: 0.3s;
    }

    img:hover {
        box-shadow: 0 0 3rem 0 rgba(0, 0, 0, 0.3);
    }

    :global(img.active) {
        border-color: #6396ff !important;
        box-shadow: 0 0 3rem 0 rgba(0, 0, 0, 0.2);
    }

    svg {
        position: absolute;
        bottom: 10px;
        right: 10px;
        color: rgba(255, 255, 255, 0.7);
        height: 2.25rem;
        cursor: pointer;
        padding: 10px;
    }

    svg:hover {
        color: #ffffff;
    }
</style>

<section bind:this={root}>
    {#each mediaList as media}
        <div>
            <img
                on:click={selectMedia}
                alt={`Video by ${media.user.name}`}
                data-id={media.id}
                data-video={media.video_files[0].link}
                src={media.image} />
            <svg
                on:click={downloadMedia(media.id)}
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="download"
                class="svg-inline--fa fa-download fa-w-16"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"><path
                    fill="currentColor"
                    d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z" /></svg>
        </div>
    {/each}
</section>
