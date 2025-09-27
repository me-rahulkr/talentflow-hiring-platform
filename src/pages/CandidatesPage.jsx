import { useState, useEffect, useMemo } from 'react';
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const candidateStages = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];

// CandidateCard component (no changes)
function CandidateCard({ candidate }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: candidate.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 'auto',
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-gray-700 p-3 rounded-md shadow-md mb-3 cursor-grab active:cursor-grabbing">
      <h4 className="font-bold text-white">{candidate.name}</h4>
      <p className="text-xs text-gray-400">{candidate.email}</p>
    </div>
  );
}

// KanbanColumn component (no changes)
function KanbanColumn({ title, candidates }) {
  return (
    <div id={title} className="bg-gray-800 rounded-lg p-3 flex flex-col">
      <h3 className="font-bold text-lg capitalize mb-4 text-center text-white sticky top-0">{title} ({candidates.length})</h3>
      <SortableContext items={candidates.map(c => c.id)}>
        <div className="flex-grow h-[60vh] overflow-y-auto">
          {candidates.map(candidate => ( <CandidateCard key={candidate.id} candidate={candidate} /> ))}
        </div>
      </SortableContext>
    </div>
  );
}

function CandidatesPage() {
  const [allCandidates, setAllCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    fetch('/candidates?pageSize=1100').then(res => res.json()).then(data => {
      setAllCandidates(data.candidates);
      setLoading(false);
    }).catch(console.error);
  }, []);

  const candidatesByStage = useMemo(() => {
    const grouped = {};
    candidateStages.forEach(stage => grouped[stage] = []);
    allCandidates.forEach(candidate => { if (grouped[candidate.stage]) { grouped[candidate.stage].push(candidate); } });
    return grouped;
  }, [allCandidates]);
  
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    const newStage = overContainer;

    setAllCandidates((prev) => {
      const activeIndex = prev.findIndex((c) => c.id === activeId);
      if (activeIndex !== -1) {
        const newItems = [...prev];
        newItems[activeIndex] = {
          ...newItems[activeIndex],
          stage: newStage,
        };
        return newItems;
      }
      return prev;
    });

    fetch(`/candidates/${activeId}`, { 
      method: 'PATCH', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ stage: newStage }) 
    }).catch(console.error);
  };
  
  function findContainer(id) {
    if (id in candidatesByStage) {
      return id;
    }
    for (const stage of Object.keys(candidatesByStage)) {
      if (candidatesByStage[stage].find((item) => item.id === id)) {
        return stage;
      }
    }
    return null;
  }
  
  const activeCandidate = useMemo(() => allCandidates.find(c => c.id === activeId), [activeId, allCandidates]);

  if (loading) return <p className="text-gray-400">Loading candidates...</p>;

  return (
    <div>
      <h2 className="text-3xl font-bold text-green-400">Candidates Kanban Board</h2>
      <DndContext 
        onDragStart={(e) => setActiveId(e.active.id)} 
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {candidateStages.map(stage => ( <KanbanColumn key={stage} title={stage} candidates={candidatesByStage[stage]} /> ))}
        </div>
        <DragOverlay>{activeId ? <CandidateCard candidate={activeCandidate} /> : null}</DragOverlay>
      </DndContext>
    </div>
  );
}
export default CandidatesPage;
