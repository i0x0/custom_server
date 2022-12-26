import Fastify from "fastify";
import { error, info, ok, warning } from "./utils";
import chokidar from "chokidar";
import glob from "glob";
import path from "path";
import { readFile, readFileSync } from "fs";
import decode from "./decode";
import dynamic from "./dynamic";
import { importFromString } from "module-from-string";

export default class {
  public server = Fastify({
    logger: true
  })

  constructor() {
    if (WebAssembly === undefined) {
      error("WebAssembly not supported!")
      this.exit()
    }
    this.findPlugins()
    this.startPluginWatcher();
  }

  startPluginWatcher() {
    //const watcher = chokidar.watch("./plugins")
  }

  findPlugins() {
    glob("./plugins/**.aad", {
      nonull: false,
      realpath: true
    }, (err, result) => {
      if (err) {
        error(`error trying to find ${err}`)
        this.exit()
      }
      //console.log(err, result)
      if (result.length === 0) {
        warning("no plugins found")
      } else {
        info(`${result.length} potential plugin(s) found`)
        let count = 1
        let success = 0
        for (const plugin of result) {
          //console.log(plugin)
          const simple = path.basename(plugin)
          info(`Loading ${count}/${result.length} of plugin(s): ${simple}`)
          readFile(plugin, async (err, dat) => {
            if (err) {
              error(`error trying to read ${simple}: ${err}`)
              return
            }
            const { asm, bindings } = decode(dat)
            //const buf = Buffer.from(asm)
            // @ts-ignore
            console.log(asm.length())
            //console.log(asm.buffer.toString('ascii'))
            console.log(asm.buffer.byteLength)
            const evaled = await importFromString(bindings)
            //const { instantiate } = evaled
            console.log(evaled)
            console.log(evaled.instantiate)
            console.log('f')
            evaled.instantiate(asm.buffer)
            //const lib = WebAssembly.instantiate(readFileSync('./plugins/release.wasm'))
            //  .then((res) => {
            //    // @ts-ignore
            //    console.log(res.instance.exports.NAME.valueOf())
            //    // @ts-ignore
            //    console.log(res.instance)
            //    //console.log(res.instance.exports)
            //  })
          })
        }
      }

    })
  }

  start(port: number = 3000) {
    this.server.listen({
      host: '0.0.0.0',
      port
    }).then(() => {
      ok("server started successfully!")
    }).catch((err) => {
      error(`error starting server: ${err}`)
    })
  }

  exit() {
    error("fatal server error...exiting...")
    process.exit()
  }
}