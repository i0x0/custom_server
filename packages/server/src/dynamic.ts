export default (str: string) => {
  // @ts-ignore
  if (globalThis.URL.createObjectURL) {
    const blob = new Blob([str], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const module = import(url)
    URL.revokeObjectURL(url) // GC objectURLs
    return module
  }

  const url = "data:text/javascript;base64," + btoa(str)
  return import(url)
}
