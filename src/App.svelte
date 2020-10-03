<script>
    import SearchBar from "./components/SearchBar.svelte"
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
</main>
