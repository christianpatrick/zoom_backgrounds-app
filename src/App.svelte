<script>
    import SearchBar from "./components/SearchBar.svelte"
    import CameraPreview from "./components/CameraPreview.svelte"
    import MediaList from "./components/MediaList.svelte"
    import Hero from "./components/Hero.svelte"
    import Welcome from "./components/Welcome.svelte"

    let searchValue, webcamLoaded
</script>

<style>
    main {
        margin: 1rem auto;
        width: 840px;
    }
    header {
        padding-top: 2rem;
        padding-bottom: 2rem;
    }
</style>

<header>
    <SearchBar bind:searchValue />
    <main>
        <Hero {searchValue} />
        {#if webcamLoaded}
            <MediaList {searchValue} />
        {:else}
            <Welcome />
        {/if}
    </main>
</header>

<CameraPreview bind:webcamLoaded />
