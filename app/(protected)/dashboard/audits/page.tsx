"use client"

import { useState, FormEvent } from 'react';
import { useSearchParams } from 'next/navigation'


const AuditsPage = () => {
  const searchParams = useSearchParams()
  const companyId = searchParams.get("companyId")

  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sendDate, setSendDate] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/mailing/schedulemail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ companyId, subject, body, sendDate }),
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        required
      />
      <textarea
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
      />
      <input
        type="datetime-local"
        value={sendDate}
        onChange={(e) => setSendDate(e.target.value)}
        required
      />
      <button type="submit">Schedule Email</button>
    </form>
  );
}

export default AuditsPage