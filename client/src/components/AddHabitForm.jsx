import { useState } from 'react';

export default function AddHabitForm({ onAdd, onCancel }) {
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    await onAdd({ name: name.trim(), description: 'Make it part of your rhythm.', color: '#7584d8' });
    setName('');
    setBusy(false);
  };

  return <form className="add-form" onSubmit={submit} aria-busy={busy}><input className="transition-shadow duration-200 focus:ring-2 focus:ring-[#ff7d66]/20" autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="What do you want to make a habit?" /><button className="transition-opacity duration-200 disabled:cursor-wait disabled:opacity-60" type="submit" disabled={busy}>{busy ? 'Adding...' : 'Add habit'}</button><button type="button" className="cancel-button" onClick={onCancel}>Cancel</button></form>;
}
