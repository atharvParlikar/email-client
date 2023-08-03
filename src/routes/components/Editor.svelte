<script>
	import { onMount } from 'svelte';

	let text = '';
	let focused = false;
	let ctrl = false;
	let selected = false;
	let selectionPoints = { start: 0, end: 0 };
	let history = [];
	let selectedAll = false;
	let cursorPosition = 0;

	const setText = (text_) => {
		console.log(text);
		history.push(text);
		text = text_;
	};

	onMount(() => {
		document.addEventListener('selectionchange', () => {
			const selection = document.getSelection();
			console.log(selection);
			selectionPoints.start = selection.anchorOffset;
			selectionPoints.end = selection.focusOffset;

			if (selectionPoints.end === 0 && selection.focusOffset !== 0) {
				console.log('triggerd');
				console.log(`${selection.anchorOffset} ${selection.focusOffset}`);
			}
			if (selection.anchorOffset === selection.focusOffset) selected = false;
			else selected = true;

			// if (selectionPoints.start < selectionPoints.end) cursorPosition = selectionPoints.start;
			// else cursorPosition = selectionPoints.end;
		});
	});
</script>

<svelte:body
	on:keydown={(event) => {
		if (event.key === 'ArrowLeft' && cursorPosition > 0) cursorPosition -= 1;
		if (event.key === 'ArrowRight' && cursorPosition < text.length) cursorPosition += 1;

		if (event.key === 'Control') ctrl = true;

		if (event.key === 'Backspace') {
			if (!selected && !ctrl) {
				setText(
					text.slice(0, cursorPosition - 1) + text.slice(cursorPosition, text.length),
				);
				if (cursorPosition > 0) cursorPosition -= 1;
			}
			if (selectedAll) {
				// console.log('got here');
				// selectedAll = false;
				// text = '';
				window.getSelection().removeAllRanges();
			} else if (selected) {
				if (selectionPoints.start < selectionPoints.end) {
					setText(
						text.slice(0, selectionPoints.start) +
							text.slice(selectionPoints.end, text.length),
					);
				} else {
					setText(
						text.slice(0, selectionPoints.end) +
							text.slice(selectionPoints.start, text.length),
					);
				}
				const selection = window.getSelection();
				selection.removeAllRanges();
			} else if (ctrl) {
				const old_text = text;
				let firstHalf = text.slice(0, cursorPosition);
				setText(
					firstHalf.trim().split(' ').slice(0, -1).join(' ') +
						(firstHalf.trim().split(' ').length > 1 ? ' ' : '') +
						text.slice(cursorPosition, text.length), // second half
				);
				cursorPosition -= old_text.length - text.length; // difference between orignal text and text after performing ctrl + backspace (delete one word) operation.
			}
		}

		if (ctrl && event.key === 'a') {
			event.preventDefault();
			selectedAll = true;
			cursorPosition = 0;
			const selection = window.getSelection();
			const range = document.createRange();
			range.selectNodeContents(document.getElementById('editor'));
			console.log(range);
			selection.addRange(range);
		}

		if (ctrl && event.key === 'z') {
			if (history !== []) {
				console.log('history not empty');
				history = history.slice(0, history.length - 1);
				text = history[history.length - 1];
			}
		}

		if (
			!ctrl &&
			focused &&
			/^[a-zA-Z0-9`~!@#$%^&*()\-_=+[{\]}\\|;:'",<.>/?\s]{1}$/.test(event.key)
		) {
			setText(
				text.slice(0, cursorPosition) + event.key + text.slice(cursorPosition, text.length),
			);
			cursorPosition += 1;
		}
	}}
	on:keyup={(event) => {
		if (event.key === 'Control') ctrl = false;
	}}
/>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="h-1/2 w-2/3 flex flex-col text-gray-900">
	<div
		class={`border-2 border-gray-500 bg-gray-100 h-full w-full mx-1 p-2 overflow-x-auto rounded-md flex ${
			focused ? 'border-2 border-gray-800 shadow-md' : ''
		}`}
		on:click={() => {
			focused = true;
		}}
		on:select={(event) => {
			const { target, selectionStart, selectionEnd } = event.target;
			console.log(target.value.substring(selectionStart, selectionEnd));
		}}
		id="editor"
	>
		<div class="h-fit border-r-2 border-gray-900 whitespace-pre-wrap">
			{text.slice(0, cursorPosition)}
		</div>
		<div class="whitespace-pre-wrap">
			{text.slice(cursorPosition, text.length)}
		</div>
	</div>
	<div class="text-gray-100">
		[debug]
		<pre>cursorPosition: {cursorPosition}</pre>
		<pre>text.length:    {text.length}</pre>
	</div>
</div>

<style>
	.non-select {
		user-select: none;
	}
</style>
