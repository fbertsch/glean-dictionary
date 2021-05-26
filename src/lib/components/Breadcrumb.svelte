<script>
	export let links;
</script>

<div>
	<ol>
		{#each links as link}
			<li>
				<a class="link-name" href={link.url}>{link.name} </a><span class
					>{links.indexOf(link) === links.length - 1 ? '' : '->'}</span
				>
			</li>
		{/each}
	</ol>
</div>

<style>
	div {
		margin-left: $spacing-lg;
	}
	ol {
		display: flex;
		li {
			@include text-title-3xs;
			font-weight: bold;
			padding-left: $spacing-sm;

			.link-name {
				text-decoration: none;
			}
			span {
				color: $color-dark-gray-10;
			}
		}
	}
</style>
