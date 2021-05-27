/** @type {import('@sveltejs/kit').Config} */
import sveltePreprocess from 'svelte-preprocess';
// import adapter from '@sveltejs/adapter-static';

const config = {
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte'
		// adapter: adapter()
	},
	preprocess: sveltePreprocess({
		sourceMap: true,
		defaults: {
			style: 'scss'
		},
		scss: {
			prependData: `@import "src/app.scss";`
		}
	})
};

export default config;
