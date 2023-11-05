<script>
  export let mail;
  export let highlight;
  export let uid;
  export let deleteStage;

  const isin = (array, item) => {
    for (const i of array) {
      if (i === item) return true;
    }
    return false;
  };
</script>

<div
  class={`border-2 my-4 p-3 rounded cursor-pointer flex  justify-between ${
    highlight == uid
      ? "shadow-lg border-primary-500 highlight"
      : "border-gray-400"
  } ${isin(deleteStage, uid) ? "bg-red-300 border-red-600" : ""}`}
>
  <div>
    <p class="text-md">
      {mail.subject === undefined ? "NO SUBJECT" : mail.subject}
    </p>
    <p class="font-light text-gray-500">{mail.from.text}</p>
  </div>
  <p class="text-sm min-w-[60px] text-right">
    {new Date(mail.date).toString().split(" ").slice(1, 3).join(" ")}
  </p>
</div>
