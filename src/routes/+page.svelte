<script lang="ts">
	// import Counter from '$lib/Counter.svelte';
	// import Logo from '$lib/Logo.svelte';
	// import { browser } from '$app/environment';

	// let desktop: string;

	// if (window.electron && browser) {
	// 	window.electron.receive('from-main', (data: any) => {
	// 		desktop = `Received Message "${data}" from Electron`;
	// 		console.log(desktop);
	// 	});
	// }

	// const agent = window.electron ? 'Electron' : 'Browser';

	const login = () => {
		window.electron.send('change-url', 'mails', (data: any) => {
			console.log(data);
		});
	};
</script>

<main class="font-mono h-screen flex flex-col justify-center items-center">
	<h1 class="mb-6 text-2xl">Login</h1>
	<div class="flex p-2 w-4/12 justify-between items-center">
		<p>Email</p>
		<input
			placeholder="yourname@provider.com"
			class="border-2 border-black rounded text-sm py-1 px-5 pr-6"
			type="text"
		/>
	</div>

	<div class="flex p-2 w-4/12 justify-between items-center">
		<p>Password</p>
		<input
			placeholder="*******"
			class="border-2 border-black rounded text-sm py-1 px-5 pr-6"
			type="password"
		/>
	</div>

	<button on:click={login} class="border-2 border-black rounded p-1 mt-6">sign-in</button>
</main>
