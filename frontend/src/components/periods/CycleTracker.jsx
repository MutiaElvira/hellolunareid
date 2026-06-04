import AddPeriodForm from "./AddPeriodForm";
import PeriodHistory from "./PeriodHistory";

function CycleTracker({ periods, addPeriod, updatePeriod, deletePeriod, showConfirm }) {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Cycle Tracker</h1>
        <p className="text-gray-500">Log and manage your period data</p>
      </div>

      <AddPeriodForm addPeriod={addPeriod} />
      <PeriodHistory 
        periods={periods} 
        updatePeriod={updatePeriod} 
        deletePeriod={deletePeriod} 
        showConfirm={showConfirm} 
      />
    </>
  );
}

export default CycleTracker;
