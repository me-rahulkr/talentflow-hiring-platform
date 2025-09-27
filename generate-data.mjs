import { faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';

const candidateStages = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];

const allCandidates = Array.from({ length: 1050 }, (_, i) => ({
  id: i + 1,
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  stage: candidateStages[Math.floor(Math.random() * candidateStages.length)],
  jobId: Math.floor(Math.random() * 25) + 1, 
}));

const filePath = path.join(process.cwd(), 'public', 'candidates.json');
fs.writeFileSync(filePath, JSON.stringify(allCandidates, null, 2));

console.log('✅ Successfully generated public/candidates.json');