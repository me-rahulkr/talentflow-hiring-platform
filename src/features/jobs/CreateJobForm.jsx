import { useState } from 'react';

function CreateJobForm({ onClose, onJobCreated }) {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error('Failed to create job');
      }

      onJobCreated(); // Parent component ko batao ki job create ho gaya
    } catch (error) {
      console.error(error);
      alert('Something went wrong!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-4">Create a New Job</h2>
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
          Job Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="flex justify-end space-x-3 mt-6">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500" disabled={isSubmitting}>
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Job'}
        </button>
      </div>
    </form>
  );
}

export default CreateJobForm;