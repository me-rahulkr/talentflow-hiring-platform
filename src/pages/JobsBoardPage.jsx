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

  const fetchJobs = (page) => {
    setLoading(true);
    const url = `/jobs?page=${page}&pageSize=${PAGE_SIZE}`;
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
    fetchJobs(currentPage);
  }, [currentPage]);

  const handleCreateNewJobClick = () => {
    setEditingJob(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };
  
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleJobCreated = () => {
    handleModalClose();
    if (currentPage === 1) {
      fetchJobs(1);
    } else {
      setCurrentPage(1); 
    }
  };

  const handleJobUpdated = (updatedJob) => {
    setJobs(prevJobs => prevJobs.map(j => j.id === updatedJob.id ? updatedJob : j));
    handleModalClose();
  };

  const handleStatusToggle = async (jobId, newStatus) => {
    // Optimistic Update
    setJobs(prevJobs => 
      prevJobs.map(j => j.id === jobId ? { ...j, status: newStatus } : j)
    );

    try {
      const response = await fetch(`/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');
    } catch (error) {
      console.error(error);
      alert('Failed to update status. Reverting changes.');
      fetchJobs(currentPage); // Rollback
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setJobs((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearchTerm = job.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearchTerm && matchesStatus;
  });

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-cyan-400">Jobs Board</h2>
        <button
          onClick={handleCreateNewJobClick}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded"
        >
          + Create New Job
        </button>
      </div>
      
      <div className="p-4 bg-gray-800 rounded-lg flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search by title..."
          className="bg-gray-700 text-white px-4 py-2 rounded-md w-1/3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
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
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={jobs}
                strategy={verticalListSortingStrategy}
              >
                <ul className="space-y-4">
                  {jobs.map(job => (
                    <JobListItem 
                      key={job.id} 
                      job={job} 
                      onEdit={handleEditClick}
                      onStatusToggle={handleStatusToggle}
                    />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
            
            <div className="mt-8 flex justify-center items-center space-x-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-white">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleModalClose}>
          {editingJob ? (
            <EditJobForm 
              job={editingJob}
              onClose={handleModalClose} 
              onJobUpdated={handleJobUpdated}
            />
          ) : (
            <CreateJobForm 
              onClose={handleModalClose} 
              onJobCreated={handleJobCreated} 
            />
          )}
        </Modal>
      )}
    </div>
  );
}
export default JobsBoardPage;