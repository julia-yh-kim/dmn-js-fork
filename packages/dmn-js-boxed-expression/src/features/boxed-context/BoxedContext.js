export class BoxedContext {
  getEntries(element) {
    return element.get('contextEntry');
  }

  getEntryName(entry) {
    return entry.variable?.get('name');
  }
}
