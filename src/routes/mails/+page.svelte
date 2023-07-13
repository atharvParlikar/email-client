<script>
	export let data;
	let uid_ = -1;
	const mails = data.mails.reverse();
	console.log(mails[0].mail.text);
</script>

<main>
	<h1 class="text-xl font-bol">Mails</h1>
	{#each mails as mail}
		<div class="border-2 border-gray-400 m-5 p-3 rounded">
			<p class="text-xl">{mail.mail.subject}</p>
			<p class="font-thin">{mail.mail.from.text}</p>
		</div>
	{/each}
</main>
