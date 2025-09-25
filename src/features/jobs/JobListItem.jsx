import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Link } from 'react-router-dom'; // Link ko import karna zaroori hai

export function JobListItem({ job, onEdit, onStatusToggle }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isArchived = job.status === 'archived';

  return (
    <li ref={setNodeRef} style={style} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
      <div className="flex items-center">
        {/* Drag Handle */}
        <button {...attributes} {...listeners} className="p-2 cursor-grab active:cursor-grabbing mr-4 text-gray-500">
          <svg width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" d="M7 3a1 1 0 1 1-2 0a1 1 0 0 1 2 0Zm0 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0Zm0 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0Zm0 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0Zm6-12a1 1 0 1 1-2 0a1 1 0 0 1 2 0Zm0 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0Zm0 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0Zm0 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0Z"></path></svg>
        </button>
        {/* Job Details */}
        <div>
          <h3 className="text-xl font-semibold text-white">{job.title}</h3>
          <p className="text-gray-400 capitalize">{job.status}</p>
          <div className="mt-2">
            {job.tags.map(tag => (
              <span key={tag} className="inline-block bg-cyan-800 text-cyan-200 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex space-x-2">
        <Link 
          to={`/jobs/${job.id}/assessment`}
          className="text-sm bg-blue-600 hover:bg-blue-500 text-white font-bold py-1 px-3 rounded"
        >
          Assessment
        </Link>
        <button 
          onClick={() => onStatusToggle(job.id, isArchived ? 'active' : 'archived')}
          className={`text-sm font-bold py-1 px-3 rounded ${isArchived ? 'bg-green-600 hover:bg-green-500' : 'bg-yellow-600 hover:bg-yellow-500'} text-white`}
        >
          {isArchived ? 'Activate' : 'Archive'}
        </button>
        <button 
          onClick={() => onEdit(job)}
          className="text-sm bg-gray-600 hover:bg-gray-500 text-white font-bold py-1 px-3 rounded"
        >
          Edit
        </button>
      </div>
    </li>
  );
}