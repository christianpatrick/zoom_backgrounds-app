<script>
    export let searchValue = ""
    export let webcamLoaded

    let timer

    const debounce = (value) => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            searchValue = value
        }, 750)
    }
</script>

<style>
    div {
        margin: 0 auto;
        width: 840px;
        position: relative;
    }

    input {
        border: 0;
        width: 840px;
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;
        box-shadow: 0 0 1rem 0 #eaeaea;
        color: #696969;
        font-size: 1rem;
    }

    svg {
        position: absolute;
        pointer-events: none;
        right: 20px;
        top: 15px;
        height: 1.2rem;
        color: #6396ff;
    }
</style>

<div>
    <input
        type="text"
        className="search"
        placeholder="Find fun, crazy, or useful backgrounds..."
        disabled={!webcamLoaded}
        on:keyup={({ target: { value } }) => debounce(value)} />
    <svg
        aria-hidden="true"
        focusable="false"
        data-prefix="fal"
        data-icon="search"
        className="svg-inline--fa fa-search fa-w-16"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512">
        <path
            fill="currentColor"
            d="M508.5 481.6l-129-129c-2.3-2.3-5.3-3.5-8.5-3.5h-10.3C395 312 416 262.5 416 208 416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c54.5 0 104-21 141.1-55.2V371c0 3.2 1.3 6.2 3.5 8.5l129 129c4.7 4.7 12.3 4.7 17 0l9.9-9.9c4.7-4.7 4.7-12.3 0-17zM208 384c-97.3 0-176-78.7-176-176S110.7 32 208 32s176 78.7 176 176-78.7 176-176 176z" />
    </svg>
</div>
