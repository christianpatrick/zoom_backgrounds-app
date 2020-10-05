<script>
    export let searchValue
</script>

<style>
	h1 {
		margin-top: 1.5rem;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

    p {
        line-height: 1.75;
        font-size: 1.25rem;
        color: #696969;
    }
</style>

{#if searchValue}
    <h1>{searchValue}</h1>
    <p>
        <em>
            Select media below to instantly see how they look as your
            background.
        </em>
    </p>
{:else}
    <h1>Zoom Backgrounds</h1>
    <p>
        Gone are the days of guessing if a background will look good or
        not. 
        <br />
        Instantly preview backgrounds with your webcam and download your
        favorites!
    </p>
{/if}
