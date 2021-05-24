/** @type {import('@sveltejs/kit').Config} */
import sveltePreprocess from 'svelte-preprocess';

const config = {
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte'
	},
	preprocess: sveltePreprocess({
		sourceMap: true,
		defaults: {
			  style: "scss",
			},
		scss: {
			  prependData: `@import '@mozilla-protocol/core/protocol/css/protocol.css'; @import "src/app.scss";`,
			},
		}),
};

export default config;
