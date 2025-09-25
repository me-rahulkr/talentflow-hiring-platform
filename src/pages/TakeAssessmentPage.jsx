import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Hum QuestionPreview component ko yahan reuse kar sakte hain thode changes ke saath
// Abhi ke liye, hum logic yahan direct likh rahe hain
const FormField = ({ question, answer, onChange }) => {
  const handleChange = (e) => {
    // For checkboxes, handle multiple values
    if (question.type === 'multi-choice') {
      const { checked, value } = e.target;
      const currentAnswers = answer || [];
      const newAnswers = checked 
        ? [...currentAnswers, value] 
        : currentAnswers.filter(ans => ans !== value);
      onChange(question.id, newAnswers);
    } else {
      onChange(question.id, e.target.value);
    }
  };

  const renderOptions = (type) => (
    question.options.map((option, index) => (
      <div key={index} className="flex items-center mb-2">
        <input 
          type={type} 
          id={`${question.id}-${index}`} 
          name={question.id}
          value={option}
          checked={type === 'radio' ? answer === option : (answer || []).includes(option)}
          onChange={handleChange}
          className={`bg-gray-900 ${type === 'radio' ? 'text-blue-500' : 'text-green-500'}`} 
        />
        <label htmlFor={`${question.id}-${index}`} className="ml-2 text-gray-300">{option}</label>
      </div>
    ))
  );

  switch (question.type) {
    case 'short-text':
      return <input type="text" value={answer || ''} onChange={handleChange} className="w-full bg-gray-700 text-white px-3 py-2 rounded-md" />;
    case 'long-text':
      return <textarea rows="3" value={answer || ''} onChange={handleChange} className="w-full bg-gray-700 text-white px-3 py-2 rounded-md"></textarea>;
    case 'numeric':
      return <input type="number" value={answer || ''} onChange={handleChange} className="w-full bg-gray-700 text-white px-3 py-2 rounded-md" />;
    case 'single-choice':
      return <div>{renderOptions('radio')}</div>;
    case 'multi-choice':
      return <div>{renderOptions('checkbox')}</div>;
    default:
      return null;
  }
};


function TakeAssessmentPage() {
  const { jobId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
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

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Final Answers:", answers);
    alert("Assessment submitted! Check the console for your answers.");
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading Assessment...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-400 mb-6">Job Assessment</h1>
        <form onSubmit={handleSubmit} className="p-6 bg-gray-800 rounded-lg space-y-6">
          {questions.map((q, index) => (
            <div key={q.id}>
              <label className="block text-lg font-medium text-gray-300 mb-3">
                {index + 1}. {q.label}
              </label>
              <FormField 
                question={q} 
                answer={answers[q.id]}
                onChange={handleAnswerChange}
              />
            </div>
          ))}
          <button type="submit" className="w-full mt-6 py-2 px-4 rounded bg-green-600 hover:bg-green-700">
            Submit Assessment
          </button>
        </form>
      </div>
    </div>
  );
}

export default TakeAssessmentPage;