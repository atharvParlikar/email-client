<script>
	export let mail;
	export let highlight;
	export let uid;
</script>

<div
	class={`border-2 my-4 p-3 rounded cursor-pointer flex  justify-between ${
		highlight == uid ? 'shadow-lg border-gray-700 highlight' : 'border-gray-400'
	}`}
>
	<div>
		<p class="text-md">{mail.subject}</p>
		<p class="font-thin">{mail.from.text}</p>
	</div>
	<p class="text-sm min-w-[60px] text-right">
		{new Date(mail.date).toString().split(' ').slice(1, 3).join(' ')}
	</p>
</div>
