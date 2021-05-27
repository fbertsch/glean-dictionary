<script>
	import { pageState } from '$lib/src/state/stores';

	import FilterInput from '$lib/components/FilterInput.svelte';

	export let listItems;

	$pageState = {
		search: ''
	};

	let filteredItems = listItems;
	$: {
		filteredItems = listItems.filter((item) => item.includes($pageState.search));
	}
</script>

<div class="container">
	<FilterInput />
	<ul>
		{#each filteredItems as item}
			<li>{item}</li>
		{/each}
	</ul>
</div>
