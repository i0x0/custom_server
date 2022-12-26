export async function instantiate(module, imports = {}) {
  const { exports } = await WebAssembly.instantiate(module, imports);
  const memory = exports.memory || imports.env.memory;
  const adaptedExports = Object.setPrototypeOf({
    NAME: {
      // assembly/index/NAME: ~lib/string/String
      valueOf() { return this.value; },
      get value() {
        return __liftString(exports.NAME.value >>> 0);
      }
    },
    DESCRIPTION: {
      // assembly/index/DESCRIPTION: ~lib/string/String
      valueOf() { return this.value; },
      get value() {
        return __liftString(exports.DESCRIPTION.value >>> 0);
      }
    },
    AUTHORS: {
      // assembly/index/AUTHORS: ~lib/string/String
      valueOf() { return this.value; },
      get value() {
        return __liftString(exports.AUTHORS.value >>> 0);
      }
    },
    VERSION: {
      // assembly/index/VERSION: ~lib/string/String
      valueOf() { return this.value; },
      get value() {
        return __liftString(exports.VERSION.value >>> 0);
      }
    },
  }, exports);
  function __liftString(pointer) {
    if (!pointer) return null;
    const
      end = pointer + new Uint32Array(memory.buffer)[pointer - 4 >>> 2] >>> 1,
      memoryU16 = new Uint16Array(memory.buffer);
    let
      start = pointer >>> 1,
      string = "";
    while (end - start > 1024) string += String.fromCharCode(...memoryU16.subarray(start, start += 1024));
    return string + String.fromCharCode(...memoryU16.subarray(start, end));
  }
  return adaptedExports;
}
