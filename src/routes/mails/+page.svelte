<script>
	import EmailListElement from '../components/EmailListElement.svelte';

	export let data;
	const mails = data.mails.reverse();
	let highlight = mails[0].uid;
</script>

<svelte:window
	on:keydown={(event) => {
		if (event.key === 'j' && highlight > mails[mails.length - 1].uid) highlight--;
		else if (event.key === 'k' && highlight < mails[0].uid) highlight++;
		let highlighted = document.getElementsByClassName('highlight')[0];
		const rect = highlighted.getBoundingClientRect();
		if (rect.bottom >= window.innerHeight * 0.7 && event.key === 'j') {
			highlighted.scrollIntoView({ behavior: 'smooth', block: 'center' });
		} else if (rect.top <= 200 && event.key === 'k') {
			highlighted.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}}
/>

<main class="m-5">
	<h1 class="text-xl font-bold">Mails Inbox</h1>
	{#each mails as mail}
		<EmailListElement {mail} {highlight} />
	{/each}
</main>
