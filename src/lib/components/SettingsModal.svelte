<script>
	import {
    Modal,
    Button,
    ButtonGroup,
    Label,
    Checkbox,
    Input,
    FloatingLabelInput,

    Dropdown,
    DropdownItem,
    DropdownDivider,
    DropdownHeader
  } from 'flowbite-svelte';
  import { enhance } from '$app/forms';
  import { settings, update } from '$lib/stores/settings';

  let theme = $derived($settings.get('theme'));
  let view = $derived($settings.get('view'));
  let time = $derived($settings.get('time'));

	let { open = $bindable(), error } = $props();

  const save = (key, val) => {
    update(key, val);
  }
</script>

<Modal bind:open={open} size="xs" autoclose={false} outsideclose class="sm:mx-0 md:mx-auto lg:mx-0">
    <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Settings</h3>
    {#if error}
      <p class='text-red-300'>Error: {error}</p>
    {/if}
    <div class="w-full flex flex-col items-start justify-center">
      <div id="theme-settings" class="w-full flex flex-row items-center justify-between mb-2">
        <p>Theme</p>
        <ButtonGroup>
          <Button
            color={theme == 'dark' ? 'blue' : 'alternative'}
            on:click={() => save('theme', 'dark')}
          >Dark</Button>
          <Button
            color={theme == 'light' ? 'blue' : 'alternative'}
            on:click={() => save('theme', 'light')}
          >Light</Button>
          <Button
            color={theme == 'system' ? 'blue' : 'alternative'}
            on:click={() => save('theme', 'system')}
          >System</Button>
        </ButtonGroup>
      </div>

      <div id="view-settings" class="w-full flex flex-row items-center justify-between mb-2">
        <p>View</p>
        <ButtonGroup>
          <Button
            color={view == 'card' ? 'blue' : 'alternative'}
            on:click={() => save('view', 'card')}
          >Card</Button>
          <Button
            color={view == 'compact' ? 'blue' : 'alternative'}
            on:click={() => save('view', 'compact')}
          >Compact</Button>
          <Button
            color={view == 'tiny' ? 'blue' : 'alternative'}
            on:click={() => save('view', 'tiny')}
          >Tiny</Button>
        </ButtonGroup>
      </div>

      <div id="time-settings" class="w-full flex flex-row items-center justify-between mb-2">
        <p>Time Format</p>
        <ButtonGroup>
          <Button color={!time || time == '12' ? 'blue' : 'alternative'} on:click={() => save('time', '12')}>06:00PM</Button>
          <Button color={time == '24' ? 'blue' : 'alternative'} on:click={() => save('time', '24')}>18:00</Button>
        </ButtonGroup>
      </div>
    </div>
</Modal>