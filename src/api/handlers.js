import { http, HttpResponse } from 'msw';
import { db } from '../lib/db';

// Jobs data abhi bhi on-the-fly generate ho raha hai kyunki woh kam hai
const allJobs = Array.from({ length: 25 }, (_, i) => ({ id: i + 1, title: `Software Engineer ${i + 1}`, status: i % 3 === 0 ? 'archived' : 'active', tags: ['React', 'Node.js', `Tag-${i % 5}`] }));

export const handlers = [
  // --- JOBS HANDLERS ---
  http.get('/jobs', ({ request }) => {
    // ... Jobs GET handler waisa hi rahega ...
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');
    let filteredJobs = allJobs;
    if (status && status !== 'all') { filteredJobs = filteredJobs.filter(job => job.status === status); }
    if (search) { filteredJobs = filteredJobs.filter(job => job.title.toLowerCase().includes(search.toLowerCase())); }
    const totalCount = filteredJobs.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedJobs = filteredJobs.slice(start, end);
    return HttpResponse.json({ jobs: paginatedJobs, totalCount: totalCount });
  }),
  http.post('/jobs', async ({ request }) => { /* ... jobs POST handler ... */ }),
  http.patch('/jobs/:jobId', async ({ request, params }) => { /* ... jobs PATCH handler ... */ }),

  // --- CANDIDATES HANDLERS (UPDATED) ---
  http.get('/candidates', async ({ request }) => {
    // Ab hum static JSON file se data fetch karenge
    const response = await fetch('/candidates.json');
    const allCandidates = await response.json();

    // Pagination logic waisi hi rahegi
    const url = new URL(request.url);
    const pageSize = parseInt(url.searchParams.get('pageSize') || '1100');
    const start = 0;
    const end = start + pageSize;
    const paginatedCandidates = allCandidates.slice(start, end);

    return HttpResponse.json({
      candidates: paginatedCandidates,
      totalCount: allCandidates.length,
    });
  }),
  http.patch('/candidates/:candidateId', async ({ request, params }) => { /* ... candidates PATCH handler ... */ }),
  
  // --- ASSESSMENTS HANDLERS ---
  http.get('/assessments/:jobId', async ({ params }) => { /* ... */ }),
  http.put('/assessments/:jobId', async ({ request, params }) => { /* ... */ }),
];