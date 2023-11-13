import EntryList from "./EntryList";
export type UnsavedEntry = {
  title: string;
  notes: string;
  photoUrl: string;
};
export type Entry = UnsavedEntry & {
  entryId: number;
};

// let data = {
//   entries: [] as Entry[],
//   nextEntryId: 1,
// };

// window.addEventListener('beforeunload', function () {
//   const dataJSON = JSON.stringify(data);
//   localStorage.setItem('code-journal-data', dataJSON);
// });

// const localData = localStorage.getItem('code-journal-data');
// if (localData) {
//   data = JSON.parse(localData);
// }

export async function readEntries(): Promise<Entry[]> {
    const response = await fetch('/api/entries')
    const entries = await response.json();
    return entries;

}

export function addEntry(entry: UnsavedEntry): Entry {
  const newEntry = {
    ...entry,
    entryId: data.nextEntryId++,
  };
  data.entries.unshift(newEntry);
  return newEntry;
}

export function updateEntry(entry: Entry): Entry {
  const newEntries = data.entries.map((e) =>
    e.entryId === entry.entryId ? entry : e
  );
  data.entries = newEntries;
  return entry;
}

export function removeEntry(entryId: number): void {
  const updatedArray = data.entries.filter(
    (entry) => entry.entryId !== entryId
  );
  data.entries = updatedArray;
}
