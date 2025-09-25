import { useState, useEffect } from 'react';
import Modal from '../components/common/Modal';
import CreateJobForm from '../features/jobs/CreateJobForm';
import EditJobForm from '../features/jobs/EditJobForm';
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

  const fetchJobs = () => {
    setLoading(true);
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
  };

  useEffect(() => {
    fetchJobs();
  }, [currentPage, statusFilter, searchTerm]);

  useEffect(() => {
    if(!loading) setCurrentPage(1);
  }, [statusFilter, searchTerm]);

  const handleCreateNewJobClick = () => { /* ... */ };
  const handleEditClick = (job) => { /* ... */ };
  const handleModalClose = () => { /* ... */ };
  const handleJobCreated = () => { /* ... */ };
  const handleJobUpdated = (updatedJob) => { /* ... */ };
  const handleStatusToggle = async (jobId, newStatus) => { /* ... */ };
  const handleDragEnd = (event) => { /* ... */ };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-cyan-400">Jobs Board</h2>
        <button onClick={handleCreateNewJobClick} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded">
          + Create New Job
        </button>
      </div>
      
      <div className="p-4 bg-gray-800 rounded-lg flex items-center space-x-4">
        <input type="text" placeholder="Search by title..." className="bg-gray-700 text-white px-4 py-2 rounded-md w-1/3" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <select className="bg-gray-700 text-white px-4 py-2 rounded-md" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="mt-8">
        {loading ? (
          <p className="text-gray-400">Loading jobs...</p>
        ) : (
          <>
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext
                items={jobs.map(job => job.id)}
                strategy={verticalListSortingStrategy}
              >
                <ul className="space-y-4">
                  {jobs.map(job => (
                    <JobListItem key={job.id} job={job} onEdit={handleEditClick} onStatusToggle={handleStatusToggle} />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
            <div className="mt-8 flex justify-center items-center space-x-4">
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50">Previous</button>
              <span className="text-white">Page {currentPage} of {totalPages}</span>
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50">Next</button>
            </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleModalClose}>
          {editingJob ? (
            <EditJobForm job={editingJob} onClose={handleModalClose} onJobUpdated={handleJobUpdated} />
          ) : (
            <CreateJobForm onClose={handleModalClose} onJobCreated={handleJobCreated} />
          )}
        </Modal>
      )}
    </div>
  );
}
export default JobsBoardPage;