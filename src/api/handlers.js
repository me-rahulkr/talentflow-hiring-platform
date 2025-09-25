import { http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';
import { db } from '../lib/db';

// --- JOBS DATA ---
const allJobs = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  title: `Software Engineer ${i + 1}`,
  status: i % 3 === 0 ? 'archived' : 'active',
  tags: ['React', 'Node.js', `Tag-${i % 5}`],
}));

// --- CANDIDATES DATA ---
const candidateStages = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];
const allCandidates = Array.from({ length: 1050 }, (_, i) => ({
  id: i + 1,
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  stage: candidateStages[Math.floor(Math.random() * candidateStages.length)],
  jobId: Math.floor(Math.random() * allJobs.length) + 1, 
}));


export const handlers = [
  // --- JOBS HANDLERS ---
  http.get('/jobs', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedJobs = allJobs.slice(start, end);
    return HttpResponse.json({
      jobs: paginatedJobs,
      totalCount: allJobs.length,
    });
  }),
  http.post('/jobs', async ({ request }) => {
    const newJobData = await request.json();
    const newJob = {
      id: allJobs.length + 1,
      title: newJobData.title,
      status: 'active',
      tags: ['New', 'React'],
    };
    allJobs.unshift(newJob);
    return HttpResponse.json(newJob, { status: 201 });
  }),
  http.patch('/jobs/:jobId', async ({ request, params }) => {
    const { jobId } = params;
    const updates = await request.json();
    const jobIndex = allJobs.findIndex(job => job.id === parseInt(jobId));
    if (jobIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    allJobs[jobIndex] = { ...allJobs[jobIndex], ...updates };
    return HttpResponse.json(allJobs[jobIndex]);
  }),

  // --- CANDIDATES HANDLERS ---
  http.get('/candidates', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '50');
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedCandidates = allCandidates.slice(start, end);
    return HttpResponse.json({
      candidates: paginatedCandidates,
      totalCount: allCandidates.length,
    });
  }),
  http.patch('/candidates/:candidateId', async ({ request, params }) => {
    const { candidateId } = params;
    const { stage } = await request.json();
    const candidateIndex = allCandidates.findIndex(c => c.id === parseInt(candidateId));
    if (candidateIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    allCandidates[candidateIndex].stage = stage;
    return HttpResponse.json(allCandidates[candidateIndex]);
  }),
  
  // --- ASSESSMENTS HANDLERS ---
  http.get('/assessments/:jobId', async ({ params }) => {
    const { jobId } = params;
    const assessment = await db.assessments.get(parseInt(jobId));
    if (assessment) {
      return HttpResponse.json(assessment);
    }
    return HttpResponse.json({ jobId: parseInt(jobId), questions: [] });
  }),
  http.put('/assessments/:jobId', async ({ request, params }) => {
    const { jobId } = params;
    const { questions } = await request.json();
    await db.assessments.put({ jobId: parseInt(jobId), questions });
    return HttpResponse.json({ success: true });
  }),
];