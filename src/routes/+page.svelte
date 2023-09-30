<script>
  import {
    AppBar,
    ListBox,
    ListBoxItem,
    LightSwitch,
  } from "@skeletonlabs/skeleton";
  import axios from "axios";
  import { onMount } from "svelte";
  import EmailListelement from "../components/EmailListElement.svelte";

  let categories;
  let selected_category;
  let mails = {};
  let isOpen = false;
  let uids = [];
  let highlight = uids[0];
  let selected = false;
  let selected_uid;

  let lightMode = true;

  let close = () => (isOpen = false);

  const handleCategoryChange = async (category) => {
    console.log(`chenged category to ${category}`);
    selected_category = category;

    mails = {};

    mails = await axios.post("http://localhost:3000/mails/latest:20/", {
      folder: `[Gmail]/${selected_category}`,
    });

    mails = mails.data;
    uids = Object.keys(mails).reverse();
  };

  onMount(async () => {
    try {
      if (localStorage.getItem("mails") === null) {
        mails = await axios.post("http://localhost:3000/mails/latest:20/", {
          folder: "[Gmail]/All Mail",
        });
        mails = mails.data;
        uids = Object.keys(mails);
        highlight = uids[0];
        localStorage.setItem("mails", JSON.stringify(mails));
      } else {
        mails = JSON.parse(localStorage.getItem("mails"));
        uids = Object.keys(mails);
        highlight = uids[0];

        console.log(mails);

        const cachedTotal = Object.keys(mails)[0];

        // if (cachedTotal < total) {
        //   console.log("couple of new emails so fetching them...");
        //   const newMails = await axios.post(
        //     `http://localhost:3000/mails/latest:${total - cachedTotal}`,
        //     {
        //       folder: "[Gmail]/All Mail",
        //     }
        //   );
        //   mails = {
        //     ...newMails,
        //     ...mails,
        //   };
        // }
      }

      if (localStorage.getItem("categories") === null) {
        categories = await axios.get("http://localhost:3000/folders");
        categories = categories.data;
        localStorage.setItem("categories", categories);
      } else {
        categories = localStorage.getItem("categories").split(",");
      }

      selected_category = categories[0];

      let total = await axios.post("http://localhost:3000/total", {
        folder: "[Gmail]/All Mail",
      });

      total = total.data;

      console.log(total);
    } catch (err) {
      console.error(err);
    }
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
</script>

<svelte:window
  on:keydown={(event) => {
    if (event.key === "j") console.log("j");
    if (isOpen && event.key === "Escape") isOpen = false;

    if (!isOpen) {
      if (event.key === "j" && highlight > uids[uids.length - 1]) {
        console.log("j triggered");
        highlight = (parseInt(highlight) - 1).toString();
      } else if (event.key === "k" && highlight < uids[0]) {
        console.log("k triggered");
        highlight = (parseInt(highlight) + 1).toString();
      }

      let highlighted = document.getElementsByClassName("highlight")[0];
      const rect = highlighted.getBoundingClientRect();

      if (rect.bottom >= window.innerHeight * 0.7 && event.key === "j") {
        highlighted.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (rect.top <= 200 && event.key === "k") {
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
  <AppBar class="shadow-xl">
    <svelte:fragment slot="lead">
      <h1 class="py-1 text-2xl">Mails Inbox</h1>
    </svelte:fragment>

    <svelte:fragment slot="trail">
      <LightSwitch
        on:click={() => {
          lightMode = !lightMode;
          console.log(lightMode);
        }}
      />
    </svelte:fragment>
  </AppBar>
  <div class="flex mx-2 mt-3">
    <div class="w-2/12">
      <button class="btn variant-filled-primary my-3 block w-full mx-auto"
        >Compose</button
      >
      <ListBox>
        {#if categories}
          {#each categories as category}
            <ListBoxItem
              bind:group={selected_category}
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
      {#if Object.keys(mails).length > 0}
        {#each uids as uid}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div
            on:click={() => {
              selected = true;
              selected_uid = uid;
              highlight = uid;
            }}
            class="mx-2"
          >
            <EmailListelement mail={mails[uid]} {uid} {highlight} />
          </div>
        {/each}
      {/if}
    </div>
    <div class="w-5/12 mx-2 border-2 border-gray-400 shadow-2xl rounded-md">
      {#if selected}
        <div class="col-span-5 w-full h-[90vh]">
          <iframe
            class="w-full h-full rounded-md p-1"
            title="mail"
            srcdoc={scrollbarcss + mails[selected_uid].html}
            frameborder="0"
          />
        </div>
      {:else}
        <div
          class="col-span-5 w-full h-[90vh] rounded-md p-1 flex justify-center items-center"
        >
          <p>
            Total mails: {uids[0]}
          </p>
        </div>
      {/if}
    </div>
  </div>
</main>
