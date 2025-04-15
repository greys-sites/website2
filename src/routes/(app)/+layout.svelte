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
	} from 'flowbite-svelte';

	import MiniNav from '$lib/components/MiniNav.svelte';
	import SiteInfo from '$lib/components/SiteInfo.svelte';
	import SettingsModal from '$lib/components/SettingsModal.svelte';

	import Pin from '~icons/mdi/pin';
	import Info from '~icons/mdi/information-outline';

	import Home from '~icons/material-symbols/home-outline-rounded';
	import HomeFill from '~icons/material-symbols/home-rounded';
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

	import Arrow from '~icons/mdi/arrow-left';
	import Gear from '~icons/mdi/gear';
	import Logo from '~icons/mdi/file-document-box-multiple';
	import PostAdd from '~icons/mdi/post-it-note-add';
	
	const bubble = createBubbler();
	/** @type {{data: any, children?: import('svelte').Snippet}} */
	let { data, children } = $props();

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
	let menuBreak = 768;
	let pinsBreak = 1024;

	let show = $state(false);

	let activeUrl = $derived($page.url.pathname);

	onMount(() => {
		widthCheck();
	})

	$effect(() => width && widthCheck())

	let views = [
		{
			name: 'card'
		},
		{
			name: 'compact'
		}
	];

	let vt = $derived($page.data?.settings?.view_type);
	let selected = (
		$state(views.find(x => x.name == $page.data?.settings?.view_type)
			?? views[0])
		);

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

<Navbar let:hidden let:toggle class="px-0 md:pl-64 lg:hidden fixed bg-white dark:bg-gray-900 z-10">
	<NavHamburger
	onClick={(e) => openMenu(e)}
	btnClass="lg:hidden"
	/>

	<Button color="alternative" class="border-none p-1 me-3 rounded-lg lg:hidden ms-auto" on:click={openPins}>
		<span class="sr-only">Info drawer</span>
		<Info class="h-6 w-6"/>
	</Button>
</Navbar>

<SettingsModal bind:open={settingsOpen} />

<div class={`menu ${show ? "open" : "closed"}`} onclick={stopPropagation(bubble('click'))} onkeypress={stopPropagation(bubble('keypress'))}>
	<Button href="/">Home</Button>
	<Button href="/about">About Us</Button>
	<Button href="/blog">Blog </Button>
	<Button href="/projects">Projects</Button>
	<Button href="/comics">Comics</Button>
	<Button href="/flags">Flags</Button>
	<Button href="/supporters">Supporters</Button>
	{#if data?.user}<Button href="/admin">Dash</Button>{/if}

	<div class="settings">
		<p><b>Settings</b></p>
		<label for="view_type">view type</label>
		<select name="view_type" id="view_type" bind:value={selected} onchange={() => save()}>
			{#each views as view,_ (_)}
			<option value={view}>
				{view.name}
			</option>
			{/each}
		</select>
	</div>
</div>

<Drawer
	transitionType="fly"
	transitionParams={{ x: -320, duration: 250 }}
	bind:backdrop={menuBackdrop}
	bind:hidden={menuHidden}
	bind:activateClickOutside={menuClick}
	width="w-64"
	class="overflow-auto p-4 dark:bg-gray-900 md:border-r-2 border-gray-200 dark:border-gray-800"
	id="sidebar"
>
<div class="flex items-center">
	<CloseButton on:click={() => menuHidden = true} class="mb-2 dark:text-white md:hidden" />
	</div>
	<SidebarGroup>
		<SiteInfo />
	</SidebarGroup>
	<Sidebar asideClass="w-54" {activeUrl} >
		<SidebarWrapper divClass="rounded px-2 dark:bg-gray-900">
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
			</SidebarGroup>
			<SidebarGroup>
				<div class="absolute bottom-0 left-0 w-full flex flex-col items-start content-start p-4 justify-between">
					{#if data?.user}
					<Button
					rounded size="sm"
					color="alternative"
					class="
					border-none w-full items-center
					content-center justify-start
					"
					on:click={handlePostClick}>
					<PostAdd class="w-10 h-10 mr-2" />
					<span class="font-bold break-all text-ellipsis overflow-hidden w-full whitespace-nowrap text-left">
						Create post
					</span>
				</Button>
				<Button rounded size="sm" color="alternative" class="border-none w-full items-center content-center justify-start" on:click={handleAvatarClick}>
					<Avatar rounded class="mr-2 bg-transparent dark:bg-transparent" src={data?.user?.avatar}/>
					<div class="flex flex-col items-start justify-center content-center">
						<div class="overflow-hidden max-w-32 flex">
							<span class="font-bold break-all text-ellipsis overflow-hidden w-full whitespace-nowrap">{data.user ? data.user.displayName : 'Login' }</span>
						</div>
						<div class="overflow-hidden max-w-32 flex">
							<span class="text-ellipsis overflow-hidden w-full whitespace-nowrap">{data.user ? `@${data.user.username}` : ''}</span>
						</div>
					</div>
				</Button>
				{/if}
				<Button rounded size="sm" color="alternative" class="border-none w-full items-center content-center justify-start" on:click={handleSettingsClick}>
					<Gear class="w-6 h-6 mr-2"/>
					<span class="break-all text-ellipsis overflow-hidden w-full whitespace-nowrap text-left">
						Settings
					</span>
				</Button>
			</div>
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
<div class="flex items-center">
	<CloseButton on:click={() => pinsHidden = true} class="mb-2 dark:text-white lg:hidden ms-0" />
	</div>
	<Sidebar asideClass="w-54" >
		<SidebarWrapper divClass="rounded px-2 dark:bg-gray-900">
			{#if !data?.user}
				<SidebarGroup class="absolute bottom-0 left-0 w-full flex flex-col items-center content-center p-4 justify-between">
					<Button size="xs" color="alternative" class="border-none text-gray-200 dark:text-gray-700 opacity-50" on:click={() => modalOpen = true }>
					Login
					</Button>
				</SidebarGroup>
			{/if}
		</SidebarWrapper>
	</Sidebar>
</Drawer>

<div id="content-wrapper" class="
	p-8 flex flex-col items-center
	mx-auto
	pt-16 lg:pt-2
	min-h-screen
	max-w-[700px]
	sm:mx-auto md:ml-64 lg:mx-64
">
	{#if activeUrl?.startsWith('/u/')}
		<MiniNav {back} text={$page?.data?.user?.displayName} />
	{/if}
	{#if activeUrl?.startsWith('/blog/')}
		<MiniNav {back} text="Post" />
	{/if}
	<div id="content-area" class="
		flex flex-col justify-center items-center w-full
		overflow-auto
		mx-0 sm:mx-0 md:mx-64 lg:mx-0
	">
		{@render children?.()}
	</div>
</div>

<style>
	.menu-screen {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background-color: rgba(0, 0, 0, .7);
		transition: .25s;
		z-index: 10;
	}

	.settings {
		align-self: flex-end;
		text-align: center;
	}

	option {
		color: white;
		background-color: #202020;
	}
</style>