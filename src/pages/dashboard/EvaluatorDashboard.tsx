import React, { useState, useEffect } from 'react';

// Example data structure for evaluation tasks
interface EvaluationTask {
  id: string;
  evaluatorId: string;
  type: 'restaurant';
  branchName: string;
  dueDate: string; // ISO string
  status: 'pending' | 'confirmed' | 'done_on_time' | 'delayed';
  assignedAt: string; // ISO string
  confirmedAt?: string;
  submittedAt?: string;
  report?: RestaurantEvaluationReport;
}

// Example restaurant evaluation report structure
interface RestaurantEvaluationReport {
  speedOrderWelcome: number;
  customersInLine: number;
  speedInvoiceToMeal: number;
  counterClean: string;
  counterSurfaceClean: string;
  kitchenClean: string;
  kitchenArranged: string;
  productListVisible: string;
  productUnavailable: string;
  productReceivedAsOrdered: string;
  accessoriesIncluded: string;
  productPacked: string;
  productTaste: string;
  productTemperature: string;
  productTasteStart: string;
  bathroomClean: string;
  handwashClean: string;
  unwantedOdors: string;
  tissuesAvailable: string;
  trashClean: string;
  indoorFloorClean: string;
  seatsTablesClean: string;
  wallsCeilingClean: string;
  tablesCleanedPromptly: string;
  lightingSuitable: string;
  branchTemperature: string;
  musicVolume: string;
  overallImpression: string;
  satisfied: string;
  recommend: string;
  comments?: string;
}

// Simulate logged-in evaluator
const evaluatorId = 'evaluator-1';

// Simulate fetching tasks from localStorage or backend
function getTasksForEvaluator(): EvaluationTask[] {
  const data = localStorage.getItem('evaluationTasks');
  if (!data) return [];
  return JSON.parse(data).filter((task: EvaluationTask) => task.evaluatorId === evaluatorId);
}

function saveTasks(tasks: EvaluationTask[]) {
  localStorage.setItem('evaluationTasks', JSON.stringify(tasks));
}

const restaurantQuestions = [
  { key: 'speedOrderWelcome', label: 'How long in seconds from the moment you stand in line to order until the cash officer welcomes you and starts taking your order?' },
  { key: 'customersInLine', label: 'How many customers were in front of you at the moment of standing in line?' },
  { key: 'speedInvoiceToMeal', label: 'How long in seconds from the moment you receive the invoice until you receive the meal?' },
  { key: 'counterClean', label: 'Clean values of the entrance floors and the counter area' },
  { key: 'counterSurfaceClean', label: 'Evaluate the cleanliness of the counter and the surfaces of the cash, payment and receipt area.' },
  { key: 'kitchenClean', label: 'Clean kitchen floors and equipment behind the counter' },
  { key: 'kitchenArranged', label: 'Is the kitchen area properly arranged?' },
  { key: 'productListVisible', label: 'Is there a list containing all the available products and their prices and clearly for customers?' },
  { key: 'productUnavailable', label: 'Have you ordered one of the products on the list and been told that it is not available?' },
  { key: 'productReceivedAsOrdered', label: 'Was the product received as you actually ordered?' },
  { key: 'accessoriesIncluded', label: 'Are all accessories (napkins, spoons, or any other accessories attached)?' },
  { key: 'productPacked', label: 'Is the product properly packed?' },
  { key: 'productTaste', label: 'Was the taste and taste of the product appropriate?' },
  { key: 'productTemperature', label: 'Was the temperature of the product suitable for its nature?' },
  { key: 'productTasteStart', label: 'When did you start tasting the product?' },
  { key: 'bathroomClean', label: 'Bathroom cleanliness values (male/female) {clean/unclean/not applicable}' },
  { key: 'handwashClean', label: 'Evaluate the cleanliness of handwashing places.' },
  { key: 'unwantedOdors', label: 'Have you noticed unwanted odors?' },
  { key: 'tissuesAvailable', label: 'Were tissues available?' },
  { key: 'trashClean', label: 'Was the trash can clean?' },
  { key: 'indoorFloorClean', label: 'Clean values of indoor floor floors' },
  { key: 'seatsTablesClean', label: 'Clean values of seats and tables' },
  { key: 'wallsCeilingClean', label: 'Values of cleanliness of walls, ceiling, lighting devices and mirrors' },
  { key: 'tablesCleanedPromptly', label: 'Was the process of cleaning the tables after the departure of the customers done directly and without noticeable delay?' },
  { key: 'lightingSuitable', label: 'Is the internal lighting of the branch suitable and all the interior lights are fully functional' },
  { key: 'branchTemperature', label: 'Is the temperature inside the branch appropriate?' },
  { key: 'musicVolume', label: 'Was the music volume appropriate?' },
  { key: 'overallImpression', label: 'My visit to this branch was: excellent, good, bad' },
  { key: 'satisfied', label: 'Are you satisfied with your visit to this branch and the service provided therein?' },
  { key: 'recommend', label: 'Would you recommend your relatives and friends to visit this branch?' },
  { key: 'comments', label: 'Additional comments (optional)' },
];

const EvaluatorDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<EvaluationTask[]>([]);
  const [activeTask, setActiveTask] = useState<EvaluationTask | null>(null);
  const [report, setReport] = useState<Partial<RestaurantEvaluationReport>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setTasks(getTasksForEvaluator());
  }, []);

  const confirmTask = (taskId: string) => {
    const updated = tasks.map(task =>
      task.id === taskId ? { ...task, status: 'confirmed', confirmedAt: new Date().toISOString() } : task
    );
    setTasks(updated as EvaluationTask[]);
    saveTasks(updated as EvaluationTask[]);
  };

  const openReport = (task: EvaluationTask) => {
    setActiveTask(task);
    setReport(task.report || {});
  };

  const handleReportChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReport(prev => ({ ...prev, [name]: value }));
  };

  const submitReport = () => {
    if (!activeTask) return;
    setSubmitting(true);
    setTimeout(() => {
      const now = new Date();
      const due = new Date(activeTask.dueDate);
      const onTime = now <= due;
      const updated = tasks.map(task =>
        task.id === activeTask.id
          ? {
              ...task,
              status: onTime ? 'done_on_time' : 'delayed',
              submittedAt: now.toISOString(),
              report: { ...report } as RestaurantEvaluationReport,
            }
          : task
      );
      setTasks(updated as EvaluationTask[]);
      saveTasks(updated as EvaluationTask[]);
      setActiveTask(null);
      setReport({});
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">My Evaluation Tasks</h2>
      <div className="mb-6 flex gap-4">
        <div className="flex-1">
          <h3 className="font-semibold mb-2">Pending</h3>
          {tasks.filter(t => t.status === 'pending').length === 0 && <div className="text-gray-500 text-sm">No pending tasks.</div>}
          {tasks.filter(t => t.status === 'pending').map(task => (
            <div key={task.id} className="border rounded p-3 mb-2 flex justify-between items-center">
              <div>
                <div><b>Branch:</b> {task.branchName}</div>
                <div><b>Due:</b> {new Date(task.dueDate).toLocaleString()}</div>
              </div>
              <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => confirmTask(task.id)}>Confirm</button>
            </div>
          ))}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-2">Confirmed</h3>
          {tasks.filter(t => t.status === 'confirmed').length === 0 && <div className="text-gray-500 text-sm">No confirmed tasks.</div>}
          {tasks.filter(t => t.status === 'confirmed').map(task => (
            <div key={task.id} className="border rounded p-3 mb-2 flex justify-between items-center">
              <div>
                <div><b>Branch:</b> {task.branchName}</div>
                <div><b>Due:</b> {new Date(task.dueDate).toLocaleString()}</div>
              </div>
              <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => openReport(task)}>Submit Report</button>
            </div>
          ))}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-2">Done On Time</h3>
          {tasks.filter(t => t.status === 'done_on_time').length === 0 && <div className="text-gray-500 text-sm">No tasks done on time.</div>}
          {tasks.filter(t => t.status === 'done_on_time').map(task => (
            <div key={task.id} className="border rounded p-3 mb-2">
              <div><b>Branch:</b> {task.branchName}</div>
              <div><b>Submitted:</b> {task.submittedAt ? new Date(task.submittedAt).toLocaleString() : ''}</div>
              <div className="text-green-600 font-semibold">Done On Time</div>
            </div>
          ))}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-2">Delayed</h3>
          {tasks.filter(t => t.status === 'delayed').length === 0 && <div className="text-gray-500 text-sm">No delayed tasks.</div>}
          {tasks.filter(t => t.status === 'delayed').map(task => (
            <div key={task.id} className="border rounded p-3 mb-2">
              <div><b>Branch:</b> {task.branchName}</div>
              <div><b>Submitted:</b> {task.submittedAt ? new Date(task.submittedAt).toLocaleString() : ''}</div>
              <div className="text-red-600 font-semibold">Delayed</div>
            </div>
          ))}
        </div>
      </div>
      {/* Report Modal */}
      {activeTask && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setActiveTask(null)}>&times;</button>
            <h3 className="text-xl font-bold mb-4">Submit Restaurant Evaluation Report</h3>
            <form onSubmit={e => { e.preventDefault(); submitReport(); }}>
              <div className="grid grid-cols-1 gap-3">
                {restaurantQuestions.map(q => (
                  <div key={q.key}>
                    <label className="block font-semibold mb-1">{q.label}</label>
                    {q.key === 'comments' ? (
                      <textarea name={q.key} value={report[q.key as keyof RestaurantEvaluationReport] || ''} onChange={handleReportChange} className="border rounded px-2 py-1 w-full min-h-[40px]" />
                    ) : (
                      <input name={q.key} value={report[q.key as keyof RestaurantEvaluationReport] || ''} onChange={handleReportChange} className="border rounded px-2 py-1 w-full" />
                    )}
                  </div>
                ))}
              </div>
              <button type="submit" className="mt-4 bg-green-600 text-white px-4 py-2 rounded" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Report'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluatorDashboard; 