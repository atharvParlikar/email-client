<script>
	export let data;
	console.log(data);
</script>

<main class="">
	<div class="flex">
		<p class="mr-2">{'FROM:'}</p>
		{@html data.mail.from.html}
	</div>
	{@html data.mail.html}
</main>
