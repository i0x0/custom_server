import { program } from "commander";
import bson, { serialize } from "bson";
import { existsSync, write } from "fs";
import { readFile, writeFile } from "fs/promises";
import { minify } from "terser";

const exists = (x: string) => {
  return existsSync(x)
}

const leave = (x: string) => {
  console.error(x)
  process.exit(1)
}

const read = (x: string) => {
  return readFile(x)
}

program
  .name("builder")
  .version("0.1")
  .option("-n, --name", "name of plugin", "plugin")
  .option("-o, --output", "output", ".")

program.parse()
const options = program.opts();

try {
  (async () => {
    if (program.args.length < 2) {
      console.log("Expected 2 arguments...didnt get all of them")
      process.exit(1)
    } else {
      const wasm = program.args[0]
      const js = program.args[1]

      if (!exists(wasm)) {
        leave("wasm file doesnt exist")
      }

      if (!exists(js)) {
        leave("json file does not exist")
      }

      const wasmDat = await read(wasm)
      console.log(wasmDat.byteLength)
      const jsDat = await read(js)
      const betterJs = await minify(jsDat.toString('utf-8'))

      let plugin = serialize({
        asm: wasmDat,
        bindings: betterJs.code
      })

      await writeFile(`${options.output}/${options.name}.aad`, plugin)
      console.log("done")


    }
  })()
} catch (e) {
  console.error("error: ", e)
}

