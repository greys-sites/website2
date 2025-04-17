import { SvelteMap } from 'svelte/reactivity';
import { browser } from '$app/environment';

let tmp = new SvelteMap();
if(browser) {
	if(('settings' in localStorage)) {
		var item = localStorage.getItem('settings')
		var data = JSON.parse(item);
		for(var k in data) {
			tmp.set(k, data[k]);
		}
	}

	if(!tmp.get('theme')) tmp.set('theme', 'system');
	if(!tmp.get('view')) tmp.set('view', 'card');
	if(!tmp.get('time')) tmp.set('time', '12');
}

export const settings = $state(tmp);

export const update = (setting, value) => {
	settings.set(setting, value);
	
	if(browser) localStorage.setItem('settings', JSON.stringify(toJSON(settings)));
	if(setting == 'theme') handleThemeChange(settings);
}

const toJSON = (map) => {
	let obj = {};
	for(var [k, v] of map) {
		obj[k] = v;
	}
	return obj;
}

const handleThemeChange = (val) => {
	if(!browser) return;
	var prefer = window.matchMedia('(prefers-color-scheme: dark)').matches;
	var theme = val.get('theme');
	if(theme == 'dark' || (theme == "system" && prefer)) window.document.documentElement.classList.add('dark');
	else if(theme == 'light' || (theme == "system" && !prefer)) window.document.documentElement.classList.remove('dark');
}