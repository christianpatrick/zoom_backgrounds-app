<script>
    import { onMount } from "svelte"

    export let searchValue
    export let mediaUrl = ""

    let root
    let mediaList = []
    let selectedMedia
    let prevSearchValue = ""

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
                headers: { Authorization: process.env.PEXELS_API_KEY },
            }

            await fetch(
                `https://api.pexels.com/videos/search?query=${
                    searchValue ? searchValue : "background"
                }&per_page=30&page=1`,
                options
            )
                .then((response) => response.json())
                .then((data) => (mediaList = data.videos))
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
</script>

<style>
    section {
        margin: 2rem auto;
        width: 1140px;
        text-align: center;
    }

    img {
        width: 350px;
        height: 195px;
        background-color: #ffffff;
        border-radius: 1rem;
        border: 0.5rem solid #ffffff;
        margin: 0.5rem;
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
</style>

<section bind:this={root}>
    {#each mediaList as media}
        <img
            on:click={selectMedia}
            alt={`Video by ${media.user.name}`}
            data-id={media.id}
            data-video={media.video_files[0].link}
            src={media.image} />
    {/each}
</section>
