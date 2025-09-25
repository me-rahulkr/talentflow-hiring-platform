import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';

const QUESTION_TYPES = [
  { type: 'short-text', label: 'Short Text' },
  { type: 'long-text', label: 'Long Text' },
  { type: 'single-choice', label: 'Single Choice (Radio)' },
  { type: 'multi-choice', label: 'Multiple Choice (Checkbox)' },
  { type: 'numeric', label: 'Numeric' },
];

const QuestionPreview = ({ question }) => {
  const renderOptions = (type) => (
    question.options.map((option, index) => (
      <div key={index} className="flex items-center mb-2">
        <input type={type} id={`${question.id}-${index}`} name={question.id} className={`bg-gray-900 ${type === 'radio' ? 'text-blue-500' : 'text-green-500'}`} />
        <label htmlFor={`${question.id}-${index}`} className="ml-2 text-gray-300">{option}</label>
      </div>
    ))
  );

  switch (question.type) {
    case 'short-text':
      return (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">{question.label}</label>
          <input type="text" className="w-full bg-gray-700 text-white px-3 py-2 rounded-md" />
        </div>
      );
    case 'long-text':
      return (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">{question.label}</label>
          <textarea rows="3" className="w-full bg-gray-700 text-white px-3 py-2 rounded-md"></textarea>
        </div>
      );
    case 'single-choice':
      return (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">{question.label}</label>
          {renderOptions('radio')}
        </div>
      );
    case 'multi-choice':
      return (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">{question.label}</label>
          {renderOptions('checkbox')}
        </div>
      );
    case 'numeric':
        return (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">{question.label}</label>
            <input type="number" className="w-full bg-gray-700 text-white px-3 py-2 rounded-md" />
          </div>
        );
    default:
      return <p className="text-red-400">Unknown question type</p>;
  }
};

function AssessmentBuilderPage() {
  const { jobId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const debounceTimeout = useRef(null);

  useEffect(() => {
    setLoading(true);
    const loadAssessment = async () => {
      try {
        const response = await fetch(`/assessments/${jobId}`);
        const data = await response.json();
        setQuestions(data.questions);
      } catch (error) {
        console.error("Failed to load assessment:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAssessment();
  }, [jobId]);

  useEffect(() => {
    if (loading) return;
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      console.log("Autosaving assessment...");
      fetch(`/assessments/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions }),
      }).catch(error => console.error("Failed to save assessment:", error));
    }, 1000);
  }, [questions, jobId, loading]);

  const addQuestion = (type) => {
    const newQuestion = {
      id: Date.now(),
      type: type,
      label: `New ${type.replace('-', ' ')} question`,
      ...(type === 'single-choice' || type === 'multi-choice' ? { options: ['Option 1', 'Option 2'] } : {})
    };
    setQuestions(prevQuestions => [...prevQuestions, newQuestion]);
  };

  const handleLabelChange = (questionId, newLabel) => {
    setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, label: newLabel } : q));
  };
  
  const handleOptionChange = (questionId, optionIndex, newText) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = newText;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const addOption = (questionId) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        return { ...q, options: [...q.options, `New Option ${q.options.length + 1}`] };
      }
      return q;
    }));
  };

  const removeOption = (questionId, optionIndex) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        return { ...q, options: q.options.filter((_, index) => index !== optionIndex) };
      }
      return q;
    }));
  };

  if (loading) {
    return <p className="text-gray-400">Loading assessment...</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-blue-400">Assessment Builder</h2>
        <Link 
          to={`/assessment/${jobId}/take`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          View as Candidate
        </Link>
      </div>
      <p className="mt-2 text-gray-400">
        For Job ID: <strong className="text-white">{jobId}</strong>
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-4 bg-gray-800 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Questions</h3>
          <p className="text-xs text-gray-500 mb-4">Click on a question to edit it.</p>
          <ul className="space-y-3 mb-4 h-[50vh] overflow-y-auto pr-2">
            {questions.map((q, index) => (
              <li key={q.id} className="p-3 bg-gray-700 rounded">
                {editingQuestionId === q.id ? (
                  <div>
                    <label className="text-xs text-gray-400">Question Label</label>
                    <input type="text" value={q.label} onChange={(e) => handleLabelChange(q.id, e.target.value)} className="w-full bg-gray-800 text-white px-2 py-1 rounded-md mb-2" autoFocus />
                    {(q.type === 'single-choice' || q.type === 'multi-choice') && (
                      <div className="mt-3 border-t border-gray-600 pt-3">
                        <label className="text-xs text-gray-400">Options</label>
                        {q.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center mb-2">
                            <input type="text" value={option} onChange={(e) => handleOptionChange(q.id, optIndex, e.target.value)} className="w-full bg-gray-800 text-white px-2 py-1 rounded-md" />
                            <button onClick={() => removeOption(q.id, optIndex)} className="ml-2 text-red-500 hover:text-red-400 font-bold text-lg">&times;</button>
                          </div>
                        ))}
                        <button onClick={() => addOption(q.id)} className="text-xs mt-1 py-1 px-2 rounded bg-blue-600 hover:bg-blue-700 w-full">+ Add Option</button>
                      </div>
                    )}
                    <button onClick={() => setEditingQuestionId(null)} className="text-xs py-1 px-2 rounded bg-green-600 hover:bg-green-700 mt-4">Done</button>
                  </div>
                ) : (
                  <div onClick={() => setEditingQuestionId(q.id)} className="cursor-pointer">
                    <p className="font-medium">{index + 1}. {q.label} <span className="text-xs text-gray-400 capitalize">({q.type})</span></p>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-700 pt-4">
            <h4 className="font-semibold mb-2">Add New Question:</h4>
            <div className="grid grid-cols-2 gap-2">
              {QUESTION_TYPES.map(qType => (<button key={qType.type} onClick={() => addQuestion(qType.type)} className="text-sm py-2 px-2 rounded bg-blue-600 hover:bg-blue-700">{qType.label}</button>))}
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Live Preview</h3>
          <form className="p-4 border border-gray-700 rounded-md h-[70vh] overflow-y-auto">
            {questions.length > 0 ? (questions.map(q => <QuestionPreview key={q.id} question={q} />)) : (<p className="text-gray-500">Add questions to see a preview.</p>)}
            {questions.length > 0 && (<button type="submit" className="mt-4 py-2 px-4 rounded bg-green-600 hover:bg-green-700">Submit Assessment</button>)}
          </form>
        </div>
      </div>
    </div>
  );
}
export default AssessmentBuilderPage;