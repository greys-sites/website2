export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22'),
	() => import('./nodes/23'),
	() => import('./nodes/24'),
	() => import('./nodes/25'),
	() => import('./nodes/26'),
	() => import('./nodes/27'),
	() => import('./nodes/28')
];

export const server_loads = [2];

export const dictionary = {
		"/(app)": [~4,[2]],
		"/(app)/about": [5,[2]],
		"/admin": [~15,[3]],
		"/admin/comics": [~16,[3]],
		"/admin/comics/create": [~17,[3]],
		"/admin/comics/edit/[slug]": [~18,[3]],
		"/admin/flags": [~19,[3]],
		"/admin/flags/create": [~20,[3]],
		"/admin/flags/edit/[slug]": [~21,[3]],
		"/admin/posts": [~22,[3]],
		"/admin/posts/create": [~23,[3]],
		"/admin/posts/edit/[slug]": [~24,[3]],
		"/admin/projects": [~25,[3]],
		"/admin/projects/create": [~26,[3]],
		"/admin/projects/edit/[slug]": [~27,[3]],
		"/admin/supporters": [~28,[3]],
		"/(app)/blog": [~6,[2]],
		"/(app)/blog/[slug]": [~7,[2]],
		"/(app)/comics": [~8,[2]],
		"/(app)/comics/[slug]": [~9,[2]],
		"/(app)/flags": [~10,[2]],
		"/(app)/flags/[slug]": [~11,[2]],
		"/(app)/projects": [~12,[2]],
		"/(app)/projects/[slug]": [~13,[2]],
		"/(app)/supporters": [~14,[2]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';