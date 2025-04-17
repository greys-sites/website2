import { get } from 'svelte/store';
import { settings } from '$lib/stores/settings.svelte.js';

import Card from '$lib/components/posts/card.svelte';
import Compact from '$lib/components/posts/compact.svelte';
import Tiny from '$lib/components/posts/tiny.svelte';

export const VIEWS = {
	'card': Card,
	'compact': Compact,
	'tiny': Tiny
}

export class ViewSetting {
	value = $derived.by(() => VIEWS[settings.get('view')] ?? Card);
}

export const view = new ViewSetting();