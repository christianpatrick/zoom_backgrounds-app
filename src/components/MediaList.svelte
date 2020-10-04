<script>
    import { onMount } from "svelte"

    let mediaList = []

    onMount(async () => {
        const options = {
            headers: { Authorization: process.env.PEXELS_API_KEY },
        }

        fetch(
            "https://api.pexels.com/videos/search?query=background&per_page=30&page=1",
            options
        )
            .then((response) => response.json())
            .then((data) => mediaList = data.videos)
    })
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
    }
</style>

<section>
    {#each mediaList as media}
        <img
            src={media.image}
            id={media.id}
            alt={`Video by ${media.user.name}`} />
    {/each}
</section>
