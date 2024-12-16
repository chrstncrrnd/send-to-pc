Deno.serve(
  {
    port: 6969,
    hostname: "0.0.0.0",
  },
  async (req) => {
    const url = new URL(req.url);
    if (url.pathname === "/file-upload") {
      const fileType = req.headers.get("content-type");
      console.log("Recieved file of type: ", fileType);
      const blob = await req.blob();
      const bytes = await blob.bytes();
      writeFile(bytes);
      return new Response("Saved");
    } else if (url.pathname === "/copy") {
      const body = await req.text();
      copyToClipboard(body);
      return new Response("Copied");
    } else {
      return new Response("Error");
    }
  },
);

const copyToClipboard = async (clip: string) => {
  const json = JSON.parse(clip);
  const value = json.clipboard;
  console.log("Recieved clipboard: ", value)
  const cmd = new Deno.Command("wl-copy", { args: [value] });
  const out = await cmd.output();
  if (out.success == false){
    console.log("Something went wrong with copying to clipboard. ")
  }
};

const writeFile = async (bytes: Uint8Array) => {
  console.log("Saving file to this directory");
  const filename = prompt("Filename: ");
  await Deno.writeFile(`./${filename}`, bytes);
  console.log("Saved");
};
