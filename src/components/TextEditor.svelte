<script>
  import { onMount } from "svelte";
  import { Tayparser } from "../utils/parser";

  let isActive = false;
  let text = "";
  let cursorPosition = {
    line: 0,
    position: 0,
  };

  const Parser = new Tayparser();

  const handleWindowClick = (event) => {
    if (isActive && !event.target.closest(".textEditor")) {
      isActive = false;
      console.log("deactivated");
    }
  };

  onMount(() => {
    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  });
</script>

<svelte:window
  on:keydown={(event) => {
    if (isActive) {
      switch (true) {
        case event.key.length === 1:
          text += event.key;
          cursorPosition.position += 1;
          console.log(event.key, cursorPosition);
          break;
        case event.key === "Backspace":
          if (cursorPosition.position > 0) {
            cursorPosition.position -= 1;
            text = text.slice(0, -1);
          } else if (cursorPosition.line > 0) {
            cursorPosition.line -= 1;
            cursorPosition.position =
              text.split("\n")[cursorPosition.line].length + 1;
          }
          console.log(event.key, cursorPosition);
          break;
        case event.key === "Enter":
          text += "\n";
          cursorPosition.line += 1;
          cursorPosition.position = 0;
          break;
      }
    }
  }}
/>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class={`${
    isActive ? "border border-black" : "border border-gray-400"
  }  textEditor rounded-md h-80 w-full font-mono text-[14px] text-black p-2 whitespace-pre`}
  on:click={() => {
    isActive = true;
    console.log(isActive);
  }}
>
  {#each text.split("\n") as lineText, lineNumber}
    {#if lineText.length > 0}
      {#if lineNumber === cursorPosition.line}
        <div class="flex">
          {#if cursorPosition.position === 0}
            <div class="h-5 border-r border-r-black" />
          {:else}
            <p class="border-r border-r-black">
              {@html Parser.parse(lineText.slice(0, cursorPosition.position))}
            </p>
          {/if}
          <p>{lineText.slice(cursorPosition.position, lineText.length)}</p>
        </div>
      {:else}
        <p>{lineText}</p>
      {/if}
    {/if}
  {/each}
</div>
