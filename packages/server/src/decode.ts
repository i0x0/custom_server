import { Binary, deserialize } from "bson"
import { error } from "./utils"

export default (x: Buffer) => {
  let out = deserialize(x) as Payload
  if (!out.asm && !out.bindings) {
    error("required data not found in payload")
  }
  return out
}

export interface Payload {
  asm: Binary
  bindings: string
}