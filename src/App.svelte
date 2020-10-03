<script>
    import SearchBar from "./components/SearchBar.svelte"
    import CameraPreview from "./components/CameraPreview.svelte"
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
    </header>

    <CameraPreview />
</main>
