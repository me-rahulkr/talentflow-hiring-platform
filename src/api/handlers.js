import { http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';
import { db } from '../lib/db';

const allJobs = Array.from({ length: 25 }, (_, i) => ({ id: i + 1, title: `Software Engineer ${i + 1}`, status: i % 3 === 0 ? 'archived' : 'active', tags: ['React', 'Node.js', `Tag-${i % 5}`] }));
const candidateStages = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];
const allCandidates = Array.from({ length: 1050 }, (_, i) => ({ id: i + 1, name: faker.person.fullName(), email: faker.internet.email().toLowerCase(), stage: candidateStages[Math.floor(Math.random() * candidateStages.length)], jobId: Math.floor(Math.random() * allJobs.length) + 1 }));

export const handlers = [
  // JOBS
  http.get('/jobs', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');

    // Server-side filtering logic
    let filteredJobs = allJobs;

    if (status && status !== 'all') {
      filteredJobs = filteredJobs.filter(job => job.status === status);
    }
    if (search) {
      filteredJobs = filteredJobs.filter(job => job.title.toLowerCase().includes(search.toLowerCase()));
    }

    const totalCount = filteredJobs.length;

    // Pagination logic (applied after filtering)
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedJobs = filteredJobs.slice(start, end);

    return HttpResponse.json({
      jobs: paginatedJobs,
      totalCount: totalCount,
    });
  }),
  // ... other handlers ...
  http.post('/jobs', async ({ request }) => { /* ... */ }),
  http.patch('/jobs/:jobId', async ({ request, params }) => { /* ... */ }),
  http.get('/candidates', ({ request }) => { /* ... */ }),
  http.patch('/candidates/:candidateId', async ({ request, params }) => { /* ... */ }),
  http.get('/assessments/:jobId', async ({ params }) => { /* ... */ }),
  http.put('/assessments/:jobId', async ({ request, params }) => { /* ... */ }),
];