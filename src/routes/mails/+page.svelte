<script>
	export let data;
	let uid_ = -1;
	const mails = data.mails.reverse();
</script>

<main class="m-5">
	<h1 class="text-xl font-bold">Mails Inbox</h1>
	{#each mails as mail}
		<div class="border-2 border-gray-400 my-4 p-3 rounded cursor-pointer flex justify-between">
			<div>
				<p class="text-md">{mail.mail.subject}</p>
				<p class="font-thin">{mail.mail.from.text}</p>
			</div>
			<p class="text-sm">
				{new Date(mail.mail.date).toString().split(' ').slice(1, 3).join(' ')}
			</p>
		</div>
	{/each}
</main>
