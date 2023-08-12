<script>
  import { onMount } from "svelte";
  import { validate_each_keys } from "svelte/internal";

  let focused = false;
  let ctrl = false;
  let selected = false;
  let selectionPoints = { start: 0, end: 0 };
  let history = [];
  let selectedAll = false;
  let cursorPosition = [0, 0];
  let lines = [""];

  const setText = (text_) => {
    console.log(lines);
    history.push(lines[lines.length - 1]);
    lines[lines.length - 1] = text_;
  };

  onMount(() => {
    document.addEventListener("selectionchange", () => {
      const selection = document.getSelection();
      console.log(selection);
      selectionPoints.start = selection.anchorOffset;
      selectionPoints.end = selection.focusOffset;

      cursorPosition[1] = selectionPoints.end;

      if (selectionPoints.end === 0 && selection.focusOffset !== 0) {
        console.log("triggerd");
        console.log(`${selection.anchorOffset} ${selection.focusOffset}`);
      }
      if (selection.anchorOffset === selection.focusOffset) selected = false;
      else selected = true;

      //   if (selectionPoints.start < selectionPoints.end) cursorPosition = selectionPoints.start;
      //   else cursorPosition = selectionPoints.end;
    });
  });
</script>

<svelte:body
  on:keydown={(event) => {
    if (event.key === "ArrowLeft" && cursorPosition[1] > 0)
      cursorPosition[1] -= 1;
    if (
      event.key === "ArrowRight" &&
      cursorPosition[1] < lines[lines.length - 1].length
    )
      cursorPosition[1] += 1;

    if (event.key === "Control") ctrl = true;

    if (event.key === "Enter") {
      lines.push("");
      setText("");
      cursorPosition[1] = 0;
      cursorPosition[0] += 1;
    }

    if (event.key === "Backspace") {
      if (!selected && !ctrl) {
        if (cursorPosition[1] === 0) {
          const lastLine = lines.pop();
          lines[lines.length - 1] += lastLine;
          cursorPosition[1] = lines[lines.length - 1].length;
          cursorPosition[0] -= 1;
        } else {
          setText(
            lines[lines.length - 1].slice(0, cursorPosition[1] - 1) +
              lines[lines.length - 1].slice(
                cursorPosition[1],
                lines[lines.length - 1].length
              )
          );
          cursorPosition[1] -= 1;
        }
      }
      if (selectedAll) {
        console.log("got here");
        selectedAll = false;
        lines[lines.length - 1] = "";
        window.getSelection().removeAllRanges();
      } else if (selected) {
        if (selectionPoints.start < selectionPoints.end) {
          setText(
            lines[lines.length - 1].slice(0, selectionPoints.start) +
              lines[lines.length - 1].slice(
                selectionPoints.end,
                lines[lines.length - 1].length
              )
          );
        } else {
          setText(
            lines[lines.length - 1].slice(0, selectionPoints.end) +
              lines[lines.length - 1].slice(
                selectionPoints.start,
                lines[lines.length - 1].length
              )
          );
        }
        const selection = window.getSelection();
        selection.removeAllRanges();
      } else if (ctrl) {
        const old_text = lines[lines.length - 1];
        let firstHalf = lines[lines.length - 1].slice(0, cursorPosition[1]);
        setText(
          firstHalf.trim().split(" ").slice(0, -1).join(" ") +
            (firstHalf.trim().split(" ").length > 1 ? " " : "") +
            lines[lines.length - 1].slice(
              cursorPosition[1],
              lines[lines.length - 1].length
            ) // second half
        );
        cursorPosition[1] -= old_text.length - lines[lines.length - 1].length; // difference between orignal lines[lines.length - 1] and lines[lines.length - 1] after performing ctrl + backspace (delete one word) operation.
      }
    }

    if (ctrl && event.key === "a") {
      event.preventDefault();
      selectedAll = true;
      cursorPosition[1] = 0;
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(document.getElementById("editor"));
      console.log(range.anchorOffset);
      selection.addRange(range);
    }

    if (ctrl && event.key === "z") {
      if (history !== []) {
        console.log("history not empty");
        history = history.slice(0, history.length - 1);
        lines[lines.length - 1] = history[history.length - 1];
      }
    }

    if (
      !ctrl &&
      focused &&
      /^[a-zA-Z0-9`~!@#$%^&*()\-_=+[{\]}\\|;:'",<.>/?\s]{1}$/.test(event.key)
    ) {
      setText(
        lines[lines.length - 1].slice(0, cursorPosition[1]) +
          event.key +
          lines[lines.length - 1].slice(
            cursorPosition[1],
            lines[lines.length - 1].length
          )
      );
      cursorPosition[1] += 1;
    }
  }}
  on:keyup={(event) => {
    if (event.key === "Control") ctrl = false;
  }}
/>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="h-1/2 w-2/3 flex flex-col lines[lines.length - 1]-gray-900">
  <div
    class={`border-2 border-gray-500 bg-gray-100 h-full w-full mx-1 p-2 overflow-x-auto rounded-md flex ${
      focused ? "border-2 border-gray-800 shadow-md" : ""
    } `}
    on:click={() => {
      focused = true;
    }}
    on:select={(event) => {
      const { target, selectionStart, selectionEnd } = event.target;
      console.log(target.value.substring(selectionStart, selectionEnd));
    }}
    id="editor"
  >
    <!-- up until cursor ⬇️ -->

    <!-- <div class={`h-fit border-r-2 border-gray-900 whitespace-pre-wrap`}>
      {lines[lines.length - 1].slice(0, cursorPosition)}
    </div>
    <div class="whitespace-pre-wrap">
      {lines[lines.length - 1].slice(cursorPosition, lines[lines.length - 1].length)}
    </div> -->

    <div class="flex flex-col">
      {#each lines as line, index}
        {#if index === cursorPosition[0]}
          <div class="bg-red-400 w-auto">
            <div class="h-fit border-r-2 border-gray-900 whitespace-pre-wrap">
              {line.slice(0, cursorPosition[1])}
            </div>
            <div class="whitespace-pre-wrap">
              {line.slice(cursorPosition[1], line.length)}
            </div>
          </div>
        {:else}
          <div class="whitespace-pre-wrap bg-red-400">
            {line}
          </div>
        {/if}
      {/each}
    </div>
  </div>
  <div class="text-gray-100">
    [debug]
    <pre>cursorPosition:  [{cursorPosition[0]}, {cursorPosition[1]}]</pre>
    <pre>line Length:     {lines[lines.length - 1].length}</pre>
    <pre>selection start: {selectionPoints.start}</pre>
    <pre>selection end:   {selectionPoints.end}</pre>
    <pre>selectedAll: 	 {selectedAll}</pre>
  </div>
</div>

<style>
  .non-select {
    user-select: none;
  }
</style>
