<script>
    import SearchBar from "./components/SearchBar.svelte"
    import CameraPreview from "./components/CameraPreview.svelte"
    import MediaList from "./components/MediaList.svelte"
    import Hero from "./components/Hero.svelte"
    import Welcome from "./components/Welcome.svelte"

    let searchValue, webcamLoaded, mediaUrl
</script>

<style>
    section {
        margin: 1rem auto;
        width: 840px;
    }
    header {
        padding-top: 2rem;
        padding-bottom: 2rem;
    }
</style>

<header>
    <SearchBar bind:searchValue {webcamLoaded} />
    <section>
        <Hero {searchValue} />
        {#if !webcamLoaded}
            <Welcome />
        {/if}
    </section>
    {#if webcamLoaded}
        <MediaList bind:mediaUrl {searchValue} />
    {/if}
</header>

<CameraPreview bind:webcamLoaded {mediaUrl} />
