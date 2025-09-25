import { useState, useEffect } from 'react';
// ... other imports ...
import { JobListItem } from '../features/jobs/JobListItem';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';

const PAGE_SIZE = 5;

function JobsBoardPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  useEffect(() => {
    setLoading(true);
    // Build the URL with search and filter params
    const url = `/jobs?page=${currentPage}&pageSize=${PAGE_SIZE}&status=${statusFilter}&search=${searchTerm}`;
    
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setJobs(data.jobs);
        setTotalCount(data.totalCount);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching jobs:", error);
        setLoading(false);
      });
  }, [currentPage, statusFilter, searchTerm]); // Re-fetch when filters change

  // When filters change, go back to page 1
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm]);

  // Client-side filtering is no longer needed!
  // const filteredJobs = ... THIS IS REMOVED

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // ... all handle functions (handleDragEnd, handleModalClose, etc.) remain the same ...

  return (
    <div>
      {/* ... Heading and Create Button ... */}
      
      {/* Filter UI Section */}
      <div className="p-4 bg-gray-800 rounded-lg flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search by title..."
          className="bg-gray-700 text-white px-4 py-2 rounded-md w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="bg-gray-700 text-white px-4 py-2 rounded-md"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Jobs List Section */}
      <div className="mt-8">
        {loading ? (
          <p className="text-gray-400">Loading jobs...</p>
        ) : (
          <>
            <DndContext /* ... */>
              <SortableContext items={jobs} /* ... */ >
                <ul className="space-y-4">
                  {/* We now map directly over 'jobs' because the API sends the filtered list */}
                  {jobs.map(job => (
                    <JobListItem key={job.id} /* ...props... */ />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
            
            {/* ... Pagination Controls ... */}
          </>
        )}
      </div>

      {/* ... Modal ... */}
    </div>
  );
}
export default JobsBoardPage;