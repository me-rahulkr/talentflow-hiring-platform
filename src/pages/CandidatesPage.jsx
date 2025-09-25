import { useState, useEffect, useMemo } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const candidateStages = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];

function CandidateCard({ candidate }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: candidate.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-gray-700 p-3 rounded-md shadow-md mb-3 cursor-grab active:cursor-grabbing">
      <h4 className="font-bold text-white">{candidate.name}</h4>
      <p className="text-xs text-gray-400">{candidate.email}</p>
    </div>
  );
}

function KanbanColumn({ title, candidates }) {
  return (
    <div className="bg-gray-800 rounded-lg p-3">
      <h3 className="font-bold text-lg capitalize mb-4 text-center text-white">{title} ({candidates.length})</h3>
      <SortableContext items={candidates.map(c => c.id)}>
        <div className="h-[60vh] overflow-y-auto">
          {candidates.map(candidate => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
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
    const fetchAllCandidates = async () => {
      try {
        const response = await fetch('/candidates?pageSize=1100');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAllCandidates(data.candidates);
      } catch (error) {
        console.error("Could not fetch candidates:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllCandidates();
  }, []);

  const candidatesByStage = useMemo(() => {
    const grouped = {};
    candidateStages.forEach(stage => grouped[stage] = []);
    allCandidates.forEach(candidate => {
      if (grouped[candidate.stage]) {
        grouped[candidate.stage].push(candidate);
      }
    });
    return grouped;
  }, [allCandidates]);
  
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const activeContainer = active.data.current.sortable.containerId;
      const overContainer = over.data.current?.sortable.containerId || over.id;
      
      const activeId = active.id;
      const newStage = overContainer;

      if (activeContainer !== newStage) {
        // Optimistic Update
        setAllCandidates((prev) => {
          const activeIndex = prev.findIndex(c => c.id === activeId);
          if (activeIndex === -1) return prev;
          const newCandidates = [...prev];
          newCandidates[activeIndex] = { ...newCandidates[activeIndex], stage: newStage };
          return newCandidates;
        });

        // API Call
        fetch(`/candidates/${activeId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stage: newStage }),
        })
        .catch(error => {
          console.error("Failed to update candidate stage:", error);
          alert('Could not save change, please refresh.');
        });
      }
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };
  
  const activeCandidate = useMemo(() => allCandidates.find(c => c.id === activeId), [activeId, allCandidates]);

  if (loading) {
    return <p className="text-gray-400">Loading candidates...</p>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-green-400">Candidates Kanban Board</h2>
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {candidateStages.map(stage => (
            <KanbanColumn key={stage} title={stage} candidates={candidatesByStage[stage]} />
          ))}
        </div>
        <DragOverlay>
          {activeId ? <CandidateCard candidate={activeCandidate} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
export default CandidatesPage;