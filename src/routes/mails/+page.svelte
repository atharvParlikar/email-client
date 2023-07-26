<script>
	import EmailListElement from '../components/EmailListElement.svelte';

	export let data;
	const mails = data.mails;
	const uids = Object.keys(mails).reverse();

	let highlight = uids[0];

	let selected = false;
	let selected_uid;
</script>

<svelte:window
	on:keydown={(event) => {
		if (event.key === 'j' && highlight > uids[uids.length - 1]) {
			highlight--;
		} else if (event.key === 'k' && highlight < uids[0]) {
			highlight++;
		}
		let highlighted = document.getElementsByClassName('highlight')[0];
		const rect = highlighted.getBoundingClientRect();

		if (rect.bottom >= window.innerHeight * 0.7 && event.key === 'j') {
			highlighted.scrollIntoView({ behavior: 'smooth', block: 'center' });
		} else if (rect.top <= 200 && event.key === 'k') {
			highlighted.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}

		if (event.key === 'Enter') {
			if (selected_uid === highlight) selected = !selected;
			selected_uid = highlight;
		}
	}}
/>

<main class="m-5">
	<h1 class="text-xl font-bold">Mails Inbox</h1>
	<h1 class="text-xl font-bold">[highlight] {highlight}</h1>
	<div class="grid grid-cols-2">
		<div class="overflow-y-auto h-[vh90]">
			{#each uids as uid}
				<EmailListElement mail={mails[uid]} {uid} {highlight} />
			{/each}
		</div>
		{#if selected}
			<div>
				<iframe
					class="w-full h-[90vh] border-2 border-gray-500 mx-4 rounded-md md-2"
					title="mail"
					srcdoc={mails[selected_uid].html}
					frameborder="0"
				/>
			</div>
		{:else}
			<div />
		{/if}
	</div>
</main>
