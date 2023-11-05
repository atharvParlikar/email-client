<script>
  import { AppBar, ListBox, ListBoxItem } from "@skeletonlabs/skeleton";
  import axios from "axios";
  import { onMount } from "svelte";
  import EmailListelement from "../components/EmailListElement.svelte";
  import Compose from "../components/Compose.svelte";

  let categories;
  let selectedCategory;
  let mails = {};
  let isOpen = false;
  let uids = [];
  let highlight = uids[0];
  let selected = false;
  let selected_uid;

  let close = () => (isOpen = false);

  let deleteStage = [];
  let deleteToggle = false;

  const isin = (array, item) => {
    for (const i of array) {
      if (i === item) return true;
    }
    return false;
  };

  const handleCategoryChange = async (element) => {
    selectedCategory = element.target.value;
    console.log(selectedCategory);
    selected = false;
    mails = {};
    uids = [];
    getMails("[Gmail]/" + selectedCategory);
    highlight = uids[0];
  };

  let dots = ".";
  function updateDots() {
    dots = dots === "..." ? "." : dots + ".";
  }
  setInterval(updateDots, 500);

  async function getMails(folder) {
    console.log(`folder: ${folder}`);
    try {
      // if mails cache not found
      if (localStorage.getItem(folder) === null) {
        mails = await axios.post("http://localhost:3000/mails/latest:20/", {
          folder,
        });
        mails = mails.data;
        uids = Object.keys(mails);
        uids = uids.reverse();
        highlight = uids[0];
        localStorage.setItem(folder, JSON.stringify(mails));
      }
      // mails cache is present
      else {
        let total = await axios.post("http://localhost:3000/total", {
          folder,
        });

        total = parseInt(total.data);
        const cachedMails = JSON.parse(localStorage.getItem(folder));
        const cachedTotal = Object.keys(cachedMails).reverse()[0];
        console.log(`total := ${total} | cachedTotal := ${cachedTotal}`);

        console.log(cachedTotal, total);

        let newMails = {};

        if (cachedTotal < total) {
          console.log("couple of new emails so fetching them...");
          newMails = await axios.post(
            `http://localhost:3000/mails/latest:${
              total - cachedTotal > 20 ? 20 : total - cachedTotal
            }`,
            {
              folder,
            }
          );
          newMails = newMails.data;
        }

        if (Object.keys(newMails).length == 20) {
          mails = newMails;
        } else {
          mails = {
            ...newMails,
            ...Object.fromEntries(
              Object.entries(cachedMails).slice(Object.keys(newMails).length)
            ),
          };
        }
        uids = Object.keys(mails).reverse();
        highlight = uids[0];
        localStorage.setItem(folder, JSON.stringify(mails));
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function getCategories() {
    if (localStorage.getItem("categories") === null) {
      categories = await axios.get("http://localhost:3000/folders");
      categories = categories.data;
      localStorage.setItem("categories", categories);
    } else {
      categories = localStorage.getItem("categories").split(",");
    }
    selectedCategory = categories[0];
  }

  function handleClick(uid) {
    if (deleteToggle) {
      if (!isin(deleteStage, uid)) {
        deleteStage = [...deleteStage, uid];
        console.log(`[DEBUG] ${deleteToggle} ${deleteStage}`);
      } else {
        deleteStage = deleteStage.filter((uid_) => uid_ !== uid);
      }
    }
    selected = true;
    selected_uid = uid;
    highlight = uid;
  }

  onMount(async () => {
    getMails("[Gmail]/All Mail");
    getCategories();
  });

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

  const textCss = `<style>
.html-container {
  font-family: monospace;
  color: black;
  padding: 1em;
}
</style>`;
</script>

<svelte:window
  on:keydown={(event) => {
    if (isOpen && event.key === "Escape") isOpen = false;

    if (!isOpen) {
      if (event.key === "j" && highlight > uids[uids.length - 1]) {
        highlight = (parseInt(highlight) - 1).toString();
      } else if (event.key === "k" && highlight < uids[0]) {
        highlight = (parseInt(highlight) + 1).toString();
      }

      let highlighted = document.getElementsByClassName("highlight")[0];
      const rect = highlighted.getBoundingClientRect();

      if (rect.bottom >= window.innerHeight * 0.8 || rect.top <= 200) {
        highlighted.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }

    if (event.key === "Enter") {
      if (selected_uid === highlight) selected = !selected;
      else selected = true;
      selected_uid = highlight;
    }
  }}
/>

<main>
  <div
    class={`z-1 fixed top-0 left-0 w-full h-full flex items-center justify-center ${
      !isOpen ? "hidden" : ""
    }`}
  >
    <Compose id="compose-window" {close} />
  </div>
  <AppBar class="shadow-xl">
    <svelte:fragment slot="lead">
      <h1 class="py-1 text-2xl">Mails Inbox</h1>
    </svelte:fragment>
  </AppBar>
  <div class="flex mx-2 mt-3">
    <div class="w-2/12">
      <button
        class="btn variant-filled-primary my-3 block w-full mx-auto rounded-md"
        on:click={() => (isOpen = !isOpen)}>Compose</button
      >
      <button
        class="btn variant-filled bg-red-600 my-3 block w-full mx-auto rounded-md"
        on:click={() => {
          if (deleteStage.length > 0) {
            axios.post("http://localhost:3000/delete", {
              mails: deleteStage,
              box: "[Gmail]/" + selectedCategory,
            });
          }
          deleteToggle = !deleteToggle;
        }}>{deleteStage.length === 0 ? "Delete" : "Confirm Delete"}</button
      >
      <ListBox>
        {#if categories}
          {#each categories as category}
            <ListBoxItem
              bind:group={selectedCategory}
              on:click={handleCategoryChange}
              name="medium"
              value={category}>{category}</ListBoxItem
            >
          {/each}
        {/if}
      </ListBox>
    </div>
    <div
      class="w-5/12 mx-2 border-2 border-gray-400 shadow-2xl h-[90vh] rounded-md overflow-y-auto"
    >
      {#if uids.length > 0}
        {#each uids as uid}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div on:click={() => handleClick(uid)} class="mx-2">
            <EmailListelement
              mail={mails[uid]}
              {uid}
              {highlight}
              {deleteStage}
            />
          </div>
        {/each}
      {/if}
    </div>
    <div class="w-5/12 mx-2 border-2 border-gray-400 shadow-2xl rounded-md">
      {#if selected}
        <div class="col-span-5 w-full h-[90vh]">
          {#if mails[selected_uid].html !== false}
            <iframe
              class="w-full h-full rounded-md"
              title="mail"
              srcdoc={scrollbarcss + mails[selected_uid].html}
              frameborder="0"
            />
          {:else}
            <div class="w-full h-full rounded-md p-1 overflow-auto">
              {@html scrollbarcss +
                textCss +
                `<div class="html-container">${mails[selected_uid].textAsHtml}</div>`}
            </div>
          {/if}
        </div>
      {:else}
        <div
          class="col-span-5 w-full h-[90vh] rounded-md p-1 flex justify-center items-center"
        >
          <p>
            {#if uids[0] === undefined}
              <p>Loading mails{dots}</p>
            {:else}
              <p>Total mails: {uids[0]}</p>
            {/if}
          </p>
        </div>
      {/if}
    </div>
  </div>
</main>
