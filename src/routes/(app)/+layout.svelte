<script>
	import '../../app.css';
	import { preventDefault, stopPropagation, createBubbler } from 'svelte/legacy';

	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';
	import { invalidateAll, goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	import {
		DarkMode,
		Drawer,
		CloseButton,
		Button,
		Avatar,

		Navbar,
		NavHamburger,
		
		Sidebar,
		SidebarWrapper,
		SidebarGroup,
		SidebarItem,

		Spinner
	} from 'flowbite-svelte';

	import MiniNav from '$lib/components/MiniNav.svelte';
	import SiteInfo from '$lib/components/SiteInfo.svelte';
	import SettingsModal from '$lib/components/SettingsModal.svelte';
	import Pinned from '$lib/components/posts/pinned.svelte';

	import Pin from '~icons/mdi/pin';
	import Info from '~icons/mdi/information-outline';

	import Home from '~icons/material-symbols/home-outline-rounded';
	import HomeFill from '~icons/material-symbols/home-rounded';
	import About from '~icons/material-symbols/info-outline-rounded';
	import AboutFill from '~icons/material-symbols/info-rounded';
	import Blog from '~icons/material-symbols/note-stack-outline-rounded';
	import BlogFill from '~icons/material-symbols/note-stack-rounded';
	import Projects from '~icons/fluent/toolbox-12-regular';
	import ProjectsFill from '~icons/fluent/toolbox-12-filled';
	import Comics from '~icons/material-symbols/image-outline';
	import ComicsFill from '~icons/material-symbols/image';
	import Flags from '~icons/material-symbols/flag-2-outline-rounded';
	import FlagsFill from '~icons/material-symbols/flag-2-rounded';
	import Supps from '~icons/material-symbols/celebration-outline-rounded';
	import SuppsFill from '~icons/material-symbols/celebration-rounded';
	import Dash from '~icons/material-symbols/dashboard-outline-rounded';
	import DashFill from '~icons/material-symbols/dashboard-rounded';

	import Arrow from '~icons/mdi/arrow-left';
	import Gear from '~icons/mdi/gear';
	import Logo from '~icons/mdi/file-document-box-multiple';
	import PostAdd from '~icons/mdi/post-it-note-add';

	import { view } from '$lib/stores/view.svelte.js';
	
	const bubble = createBubbler();
	/** @type {{data: any, children?: import('svelte').Snippet}} */
	let { data, children } = $props();
	$inspect('data: ', data)

	let menuHidden = $state(true);
	let menuClick = $state(false);
	let menuBackdrop = $state(false);
	let pinsHidden = $state(true);
	let pinsClick = $state(false);
	let pinsBackdrop = $state(false);
	let modalOpen = $state(false);
	let settingsOpen = $state(false);
	let postOpen = $state(false);
	let error = $state(null);

	let width = $state();
	let menuBreak = 1024;
	let pinsBreak = 1024;

	let show = $state(false);

	let activeUrl = $derived($page.url.pathname);
	let mini = $derived.by(() => {
		let f = ['/blog/', '/projects/', '/comics/', '/flags/'].filter(x => activeUrl.startsWith(x));
		console.log(f);
		return f?.length ? true : false;
	})

	$inspect(mini)

	onMount(() => {
		widthCheck();
	})

	$effect(() => width && widthCheck())

	const widthCheck = () => {
		if(width >= menuBreak) {
			menuHidden = false;
			menuClick = false;
			menuBackdrop = false;
		} else {
			menuHidden = true;
			menuClick = true;
			menuBackdrop = true;
		}

		if(width >= pinsBreak) {
			pinsHidden = false;
			pinsClick = false;
			pinsBackdrop = false;
		} else {
			pinsHidden = true;
			pinsClick = true;
			pinsBackdrop = true;
		}
	}

	const toggleMenu = () => {
		if(width < menuBreak) menuHidden = !menuHidden;
	}

	const openMenu = () => {
		menuHidden = false;
	}

	const openPins = () => {
		pinsHidden = false;
	}

	const togglePins = () => {
		if(width < pinsBreak) pinsHidden = !pinsHidden;
	}

	const handleAvatarClick = () => {
		if(width < menuBreak) menuHidden = true;
		goto('/u/'+data.user.username);
	}

	const handleSettingsClick = () => {
		if(width < menuBreak) menuHidden = true;
		settingsOpen = true;
	}

	const handlePostClick = () => {
		if(width < menuBreak) menuHidden = true;
		postOpen = true;
	}

	function back() {
		window.history.back();
	}
</script>

<svelte:window bind:innerWidth={width} />

<svelte:head>
	<script>
		var prefer = window.matchMedia('(prefers-color-scheme: dark)').matches;
		if ('settings' in localStorage) {
			var st = JSON.parse(localStorage.getItem('settings'));
			if(st.theme == 'dark' || (st.theme == 'system' && prefer)) window.document.documentElement.classList.add('dark');
			else if(st.theme == 'light') window.document.documentElement.classList.remove('dark');
		} else if(prefer) {
			window.document.documentElement.classList.add('dark');  
		}
	</script>
</svelte:head>

<Navbar class="px-0 lg:hidden fixed bg-white dark:bg-gray-900 z-10 w-full">
	<NavHamburger
	onClick={openMenu}
	class="md:flex"
	/>

	{#if mini}
		<MiniNav {back} text="Post" />
	{/if}

	<Button color="alternative" class="border-none p-1 me-3 rounded-lg lg:hidden ms-auto" on:click={openPins}>
		<span class="sr-only">Info drawer</span>
		<Info class="h-6 w-6"/>
	</Button>
</Navbar>

{#if mini && width > menuBreak}
	<MiniNav {back} text="Post" />
{/if}

<SettingsModal bind:open={settingsOpen} />

<Drawer
	transitionType="fly"
	transitionParams={{ x: -320, duration: 250 }}
	bind:backdrop={menuBackdrop}
	bind:hidden={menuHidden}
	bind:activateClickOutside={menuClick}
	width="w-64"
	class="overflow-auto p-4 dark:bg-gray-900 lg:border-r-2 border-gray-200 dark:border-gray-800"
	id="sidebar"
>
	<SidebarGroup>
		<SiteInfo />
	</SidebarGroup>
	<Sidebar asideClass="w-54" {activeUrl} >
		<SidebarWrapper divClass="rounded dark:bg-gray-900">
			<SidebarGroup>
				<SidebarItem label="Home" href="/" on:click={toggleMenu}>
					<svelte:fragment slot="icon">
						{#if activeUrl == '/'}
						<HomeFill class="w-6 h-6 mr-2"/>
						{:else}
						<Home class="w-6 h-6 mr-2"/>
						{/if}
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="About Us" href="/about" on:click={toggleMenu}>
					<svelte:fragment slot="icon">
						{#if activeUrl == '/about'}
						<AboutFill class="w-6 h-6 mr-2"/>
						{:else}
						<About class="w-6 h-6 mr-2"/>
						{/if}
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Blog" href="/blog" on:click={toggleMenu}>
					<svelte:fragment slot="icon">
						{#if activeUrl == '/blog'}
						<BlogFill class="w-6 h-6 mr-2"/>
						{:else}
						<Blog class="w-6 h-6 mr-2"/>
						{/if}
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Projects" href="/projects" on:click={toggleMenu}>
					<svelte:fragment slot="icon">
						{#if activeUrl == '/projects'}
						<ProjectsFill class="w-6 h-6 mr-2"/>
						{:else}
						<Projects class="w-6 h-6 mr-2"/>
						{/if}
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Comics" href="/comics" on:click={toggleMenu}>
					<svelte:fragment slot="icon">
						{#if activeUrl == '/comics'}
						<ComicsFill class="w-6 h-6 mr-2"/>
						{:else}
						<Comics class="w-6 h-6 mr-2"/>
						{/if}
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Flags" href="/flags" on:click={toggleMenu}>
					<svelte:fragment slot="icon">
						{#if activeUrl == '/flags'}
						<FlagsFill class="w-6 h-6 mr-2"/>
						{:else}
						<Flags class="w-6 h-6 mr-2"/>
						{/if}
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Supporters" href="/supporters" on:click={toggleMenu}>
					<svelte:fragment slot="icon">
						{#if activeUrl == '/supporters'}
						<SuppsFill class="w-6 h-6 mr-2"/>
						{:else}
						<Supps class="w-6 h-6 mr-2"/>
						{/if}
					</svelte:fragment>
				</SidebarItem>
				{#if data?.user}
					<SidebarItem label="Dash" href="/admin" on:click={toggleMenu}>
						<svelte:fragment slot="icon">
							{#if activeUrl == '/admin'}
							<DashFill class="w-6 h-6 mr-2"/>
							{:else}
							<Dash class="w-6 h-6 mr-2"/>
							{/if}
						</svelte:fragment>
					</SidebarItem>
				{/if}
			</SidebarGroup>
			<SidebarGroup class="absolute bottom-0 pb-2 w-54">
				<SidebarItem label="Settings" on:click={handleSettingsClick} class="opacity-75 dark:opacity-50">
					<svelte:fragment slot="icon">
						<Gear class="w-6 h-6 mr-2"/>
					</svelte:fragment>
				</SidebarItem>
			</SidebarGroup>
		</SidebarWrapper>
	</Sidebar>
</Drawer>

<Drawer
	placement="right"
	transitionType="fly"
	transitionParams={{ x: 320, duration: 250 }}
	bind:backdrop={pinsBackdrop}
	bind:hidden={pinsHidden}
	bind:activateClickOutside={pinsClick}
	width="w-64"
	class="overflow-auto p-4 dark:bg-gray-900 lg:border-l-2 border-gray-200 dark:border-gray-800"
	id="sidebar"
>
	<Sidebar asideClass="w-54" >
		<SidebarWrapper divClass="rounded px-2 dark:bg-gray-900">
			{#if data?.posts?.length}
				<SidebarGroup class="flex flex-col items-center justify-center">
					<h3>Pinned Posts</h3>
					{#each data.posts as post}
						<Pinned obj={post} objType="posts" />
					{/each}
				</SidebarGroup>
			{/if}

			{#if data?.projects?.length}
				<SidebarGroup class="flex flex-col items-center justify-center">
					<h3>Featured Projects</h3>
					{#each data.projects as post}
						<Pinned obj={post} objType="projects" />
					{/each}
				</SidebarGroup>
			{/if}

			{#if data?.recents?.length}
				<SidebarGroup class="flex flex-col items-center justify-center">
					<h3>Recent Posts</h3>
					{#each data.recents as post}
						<Pinned obj={post} objType="posts" />
					{/each}
				</SidebarGroup>
			{/if}
		</SidebarWrapper>
	</Sidebar>
</Drawer>

<div id="content-wrapper" class="
	p-8 flex flex-col items-center
	mx-auto
	pt-16 lg:pt-2
	sm:mx-auto lg:mx-64
">
	<div id="content-area" class="
		flex flex-col justify-center items-center
		max-w-[700px]
		overflow-auto
		mx-auto w-full
	">
		{@render children?.()}
	</div>
</div>

<style>
</style>