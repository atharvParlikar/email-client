<script>
  export let close;

  import axios from "axios";

  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;

  let email = "";
  let subject = "";
  let message = "";

  const handleSend = () => {
    if (!emailRegex.test(email)) {
      alert("invalid email");
      return;
    }
    axios.post("http://localhost:3000/send", {
      to: email,
      subject: subject,
      text: message,
    });
  };
</script>

<div
  class="h-auto w-[60vw] border-2 border-gray-800 rounded-md m-10 glassmorphism"
>
  <div class="flex justify-between items-center">
    <p class=" w-full text-center text-gray-500 my-2 text-[14px]">
      Compose Mail
    </p>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      fill="black"
      viewBox="0 0 16 16"
      class="cursor-pointer mx-3"
      on:click={() => close()}
    >
      <path
        d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
      />
    </svg>
  </div>
  <div class="flex mx-2 my-2 flex-col">
    <p>To</p>
    <input
      type="text"
      class={`border border-gray-800 w-full rounded-md font-mono font-thin text-black px-2 py-1 text-[14px] bg-transparent
        ${
          emailRegex.test(email) || email.length === 0
            ? ""
            : "focus:outline-red-500"
        }`}
      bind:value={email}
    />
  </div>
  <div class="flex mx-2 my-2 flex-col">
    <p>Subject</p>
    <input
      type="text"
      class="border border-gray-800 w-full rounded-md font-mono font-thin text-black px-2 py-1 text-[14px] bg-transparent"
      bind:value={subject}
    />
  </div>
  <div class="flex mx-2 my-2 flex-col">
    <p>Message</p>
    <textarea
      name="message"
      id=""
      cols="30"
      rows="10"
      class="border border-gray-800 w-full rounded-md font-mono font-thin text-black px-2 py-1 text-[14px] bg-transparent"
      bind:value={message}
    />
  </div>
  <div class="mx-2 my-2 mt-4 flex justify-end">
    <button class="btn variant-filled rounded-md" on:click={handleSend}>
      Send
    </button>
  </div>
</div>

<style>
  .glassmorphism {
    background: rgba(255, 245, 245, 0.6);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    backdrop-filter: blur(13px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.18);
  }
</style>
