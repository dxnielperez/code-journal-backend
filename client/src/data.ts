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
  const response = await fetch('/api/entries');
  const entries = await response.json();
  return entries;
}

export async function addEntry(entry: UnsavedEntry): Promise<Entry> {
  const response = await fetch('/api/entries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(entry),
  });
  const addResponse = await response.json();
  return addResponse;
}

export async function updateEntry(entry: Entry): Promise<Entry> {
  const id = entry.entryId;
  const response = await fetch(`/api/entries/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(entry),
  });
  const updatedEntry = await response.json();
  return updatedEntry;
}

export async function removeEntry(entryId: number): Promise<void> {
  const id = entryId;
  await fetch(`/api/entries/${id}`, {
    method: 'DELETE',
  });
}
