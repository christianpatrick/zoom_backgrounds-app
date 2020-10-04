<script>
    import SearchBar from "./components/SearchBar.svelte"
    import CameraPreview from "./components/CameraPreview.svelte"
    import MediaList from "./components/MediaList.svelte"
    export let name
</script>

<style>
    main {
        padding: 0 1rem;
    }
    header {
        padding-top: 2rem;
        padding-bottom: 2rem;
    }
</style>

<main>
    <header>
        <SearchBar />
        <MediaList />
    </header>

    <CameraPreview />
</main>
