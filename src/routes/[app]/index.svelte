<script context="module">
	export async function load({ page, fetch }) {
		const res = await fetch(`/data/${page.params.app}/index.json`);
		const URLSearchParams = Object.fromEntries(page.query);

		if (res.ok) {
			const app = await res.json();
			return {
				props: { app, URLSearchParams }
			};
		}

		const { message } = await res.json();
		return { error: new Error(message) };
	}
</script>

<script>
	// components
	import AppAlert from '$lib/components/AppAlert.svelte';
	import ItemList from '$lib/components/ItemList.svelte';
	import MetadataTable from '$lib/components/MetadataTable.svelte';
	import Pill from '$lib/components/Pill.svelte';
	import { TabGroup, Tab, TabContent } from '$lib/components/tabs';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import Commentary from '$lib/components/Commentary.svelte';
	import Markdown from '$lib/components/Markdown.svelte';

	// state
	import { pageState } from '$lib/state/stores';

	// formatters
	import pkg from 'lodash';
	const { mapValues, pickBy } = pkg;
	import { stringify } from 'query-string';

	// data
	import { APPLICATION_DEFINITION_SCHEMA } from '$lib/data/schemas';

	export let app, URLSearchParams;

	// update pageState to match URL search params
	$pageState = { ...$pageState, search: '', ...URLSearchParams };

	function updatePath(pageState) {
		const simplifiedState = mapValues(
			pickBy(pageState, (v) => (typeof v !== 'string' && v) || v.length > 0),
			(v) => (typeof v === 'boolean' ? +v : v)
		);
		const query = stringify(simplifiedState);
		const path = `${window.location.pathname}${query ? `?${query}` : ''}`;
		window.history.replaceState(null, undefined, path);
	}

	$: typeof window !== 'undefined' && updatePath($pageState);
</script>

<svelte:head>
	<title>{app.canonical_app_name}</title>
</svelte:head>

{#if app.annotation && app.annotation.warning}
	<AppAlert status="warning" message={app.annotation.warning} />
{/if}

{#if app.prototype}
	<AppAlert
		status="warning"
		message="This application is a prototype. The metrics and pings listed below may contain inconsistencies and testing strings."
	/>
{/if}

<PageTitle text={app.canonical_app_name} />

{#if app.deprecated}
	<Pill message="Deprecated" bgColor="#4a5568" />
{/if}
<Markdown text={app.app_description} inline={false} />

<MetadataTable appName={app.app_name} item={app} schema={APPLICATION_DEFINITION_SCHEMA} />

<h2>Commentary</h2>
<Commentary item={app} itemType={'application'} />

<TabGroup
	active={$pageState.itemType}
	on:tabChanged={({ detail }) => {
		pageState.set({ ...$pageState, itemType: detail.active, search: '' });
	}}
>
	<Tab key="metrics">Metrics</Tab>
	<Tab key="pings">Pings</Tab>
	<Tab key="app_ids">Application IDs</Tab>

	<TabContent key="metrics">
		<ItemList itemType="metrics" items={app.metrics} appName={app.app_name} />
	</TabContent>

	<TabContent key="pings">
		<ItemList itemType="pings" items={app.pings} appName={app.app_name} />
	</TabContent>

	<TabContent key="app_ids">
		<ItemList itemType="app_ids" items={app.app_ids} appName={app.app_name} showFilter={false} />
	</TabContent>
</TabGroup>

<style>
	h2 {
		@include text-title-xs;
	}
</style>
