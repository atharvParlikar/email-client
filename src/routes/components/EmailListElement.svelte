<script>
	export let mail;
	export let highlight;
</script>

<div
	class={`border-2 my-4 p-3 rounded cursor-pointer flex justify-between ${
		highlight === mail.uid ? 'border-black highlight' : 'border-gray-400'
	}`}
>
	<div>
		<p class="text-md">{mail.mail.subject}</p>
		<p class="font-thin">{mail.mail.from.text}</p>
	</div>
	<p class="text-sm">
		{new Date(mail.mail.date).toString().split(' ').slice(1, 3).join(' ')}
	</p>
</div>
