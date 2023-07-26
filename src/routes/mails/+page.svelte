<script>
	import EmailListElement from '../components/EmailListElement.svelte';

	export let data;
	const mails = data.mails;
	const uids = Object.keys(mails).reverse();

	let highlight = uids[0];

	let selected = false;
	let selected_uid;

	const scrollbarcss = `<style>
::-webkit-scrollbar {
    width: 6px;
}
::-webkit-scrollbar-track {
    background-color: #f1f1f1;
}
::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
    background-color: #555;
}
</style>`;
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

<main>
	<div class="py-5">
		<h1 class="text-xl font-bold ml-5">Mails Inbox</h1>
	</div>
	<div class="grid grid-cols-2 gap-2 overflow-y-hidden overflow-x-hidden mx-5">
		<div class="h-[88vh] overflow-y-auto">
			{#each uids as uid}
				<EmailListElement mail={mails[uid]} {uid} {highlight} />
			{/each}
		</div>
		{#if selected}
			<div>
				<iframe
					class="w-full h-[88vh] border-2 border-gray-500 rounded-md p-1"
					title="mail"
					srcdoc={scrollbarcss + mails[selected_uid].html}
					frameborder="0"
				/>
			</div>
		{:else}
			<div />
		{/if}
	</div>
</main>
