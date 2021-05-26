<script context="module">
	export async function load({ page, fetch }) {
		const res = await fetch(`/data/${page.params.app}/pings/${page.params.ping}.json`);
		if (res.ok) {
			const ping = await res.json();
			const app = page.params.app;

			return {
				props: { ping, app }
			};
		}
		const { message } = await res.json();
		return { error: new Error(message) };
	}
</script>

<script>
	// components
	import AppAlert from '$lib/components/AppAlert.svelte';
	import AppVariantSelector from '$lib/components/AppVariantSelector.svelte';
	import Commentary from '$lib/components/ommentary.svelte';
	import HelpHoverable from '$lib/components/HelpHoverable.svelte';
	import ItemList from '$lib/components/ItemList.svelte';
	import MetadataTable from '$lib/components/MetadataTable.svelte';
	import Markdown from '$lib/components/Markdown.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import AuthenticatedLink from '$lib/components/AuthenticatedLink.svelte';

	// state
	import { pageState } from '$lib/state/stores';
	import { getBigQueryURL, getLookerExploreURL } from '$lib/state/urls';

	// data
	import { PING_SCHEMA } from '$lib/data/schemas';

	export let ping, app;

	let selectedAppVariant;

	$pageState = {
		search: '',
		showExpired: true,
		...$pageState
	};
</script>

<svelte:head>
	<title>{ping.name} | {app}</title>
</svelte:head>

{#if ping.origin && ping.origin !== app}
	<AppAlert
		status="warning"
		message={`This ping is defined by a library used by the application (__${ping.origin}__), rather than the application itself. For more details, see the definition.`}
	/>
{/if}

<PageTitle text={ping.name} />
<p><Markdown text={ping.description} /></p>

<h2>Metadata</h2>
<MetadataTable appName={app} item={ping} schema={PING_SCHEMA} />

<h2>Commentary</h2>
<Commentary item={ping} itemType={'ping'} />

{#if ping.variants.length > 1}
	<h2>Access</h2>
	<AppVariantSelector bind:selectedAppVariant variants={ping.variants} />
{/if}

{#if selectedAppVariant}
	<table>
		<col />
		<col />
		<tr>
			<td>
				BigQuery
				<HelpHoverable content={'The BigQuery representation of this ping.'} />
			</td>
			<td>
				<a href={getBigQueryURL(app, selectedAppVariant.app_id, ping.name)}>
					{selectedAppVariant.table}
				</a>
			</td>
		</tr>
		{#if ping.looker_explore}
			<tr>
				<td>
					Looker
					<HelpHoverable content={`Explore this ping in Mozilla's instance of Looker.`} />
				</td>
				<td>
					<AuthenticatedLink href={getLookerExploreURL(app, ping.name.replace(/-/g, '_'))}>
						{ping.name}
					</AuthenticatedLink>
					(all variants)
				</td>
			</tr>
		{/if}
	</table>
{/if}

<h2>Metrics</h2>
<details>
	<ItemList itemType="metrics" items={ping.metrics} appName={app} />
</details>

<style>
	@include metadata-table;
	h2 {
		@include text-title-xs;
	}
</style>
