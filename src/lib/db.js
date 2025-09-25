import Dexie from 'dexie';

export const db = new Dexie('TalentFlowDB');

db.version(1).stores({
  // 'assessments' naam ka table
  // 'jobId' primary key hoga
  assessments: 'jobId, questions', 
});