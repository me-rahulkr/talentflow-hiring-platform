import { http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';
import { db } from '../lib/db';

// Yeh data ab har baar reset ho jayega, jo aachi baat hai
const createInitialJobs = () => Array.from({ length: 25 }, (_, i) => ({ id: i + 1, title: `Software Engineer ${i + 1}`, status: i % 3 === 0 ? 'archived' : 'active', tags: ['React', 'Node.js', `Tag-${i % 5}`] }));
const createInitialCandidates = () => {
  const candidateStages = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];
  return Array.from({ length: 1050 }, (_, i) => ({ id: i + 1, name: faker.person.fullName(), email: faker.internet.email().toLowerCase(), stage: candidateStages[Math.floor(Math.random() * candidateStages.length)], jobId: Math.floor(Math.random() * 25) + 1 }));
};

let allJobs = createInitialJobs();
let allCandidates = createInitialCandidates();

export const handlers = [
  // JOBS
  http.get('/jobs', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');
    
    // Server-side filtering logic
    let jobsToFilter = [...allJobs];
    if (status && status !== 'all') {
      jobsToFilter = jobsToFilter.filter(job => job.status === status);
    }
    if (search) {
      jobsToFilter = jobsToFilter.filter(job => job.title.toLowerCase().includes(search.toLowerCase()));
    }
    
    const totalCount = jobsToFilter.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedJobs = jobsToFilter.slice(start, end);
    
    return HttpResponse.json({ jobs: paginatedJobs, totalCount: totalCount });
  }),

  // POST aur PATCH handlers ko aaisa banaya gaya hai ki woh error na dein
  http.post('/jobs', async ({ request }) => {
    const newJobData = await request.json();
    const newJob = { id: Date.now(), title: newJobData.title, status: 'active', tags: ['New', 'React'] };
    // Hum data ko memory mein add karenge, lekin yeh agle request par reset ho jayega
    allJobs.unshift(newJob);
    return HttpResponse.json(newJob, { status: 201 });
  }),

  http.patch('/jobs/:jobId', async ({ request, params }) => {
    const { jobId } = params;
    const updates = await request.json();
    const jobIndex = allJobs.findIndex(job => job.id === parseInt(jobId));
    if (jobIndex === -1) { return new HttpResponse(null, { status: 404 }); }
    
    // Hum data ko memory mein update karenge
    allJobs[jobIndex] = { ...allJobs[jobIndex], ...updates };
    return HttpResponse.json(allJobs[jobIndex]);
  }),

  // CANDIDATES
  http.get('/candidates', ({ request }) => {
     // Har baar fresh data generate karo, ya static file use karo
    return HttpResponse.json({ candidates: allCandidates, totalCount: allCandidates.length });
  }),

  http.patch('/candidates/:candidateId', async ({ request, params }) => {
    const { candidateId } = params;
    const { stage } = await request.json();
    const candidateIndex = allCandidates.findIndex(c => c.id === parseInt(candidateId));
    if (candidateIndex === -1) { return new HttpResponse(null, { status: 404 }); }
    
    allCandidates[candidateIndex].stage = stage;
    return HttpResponse.json(allCandidates[candidateIndex]);
  }),
  
  // ASSESSMENTS (Yeh IndexedDB use karta hai, isliye aache se kaam karega)
  http.get('/assessments/:jobId', async ({ params }) => {
    const { jobId } = params;
    const assessment = await db.assessments.get(parseInt(jobId));
    if (assessment) { return HttpResponse.json(assessment); }
    return HttpResponse.json({ jobId: parseInt(jobId), questions: [] });
  }),
  http.put('/assessments/:jobId', async ({ request, params }) => {
    const { jobId } = params;
    const { questions } = await request.json();
    await db.assessments.put({ jobId: parseInt(jobId), questions });
    return HttpResponse.json({ success: true });
  }),
];