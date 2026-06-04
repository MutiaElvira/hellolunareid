import { useState } from "react";
import usePeriods from "../hooks/usePeriods";
import useSymptoms from "../hooks/useSymptoms";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/layout/Sidebar";
import DashboardOverview from "../components/dashboard/DashboardOverview";
import CycleTracker from "../components/periods/CycleTracker";
import SymptomJournal from "../components/symptoms/SymptomJournal";
import HealthReport from "../components/reports/HealthReport";
import Profile from "./Profile";
import Edukasi from "./Edukasi";
import AlertModal from "../components/common/AlertModal";

function Dashboard() {
  const { user } = useAuth();
  
  const {
    periods,
    prediction,
    loading: periodsLoading,
    currentCycleDay,
    currentPhase,
    phaseInfo,
    avgCycleLength,
    avgDuration,
    nextPeriodDate,
    addPeriod,
    deletePeriod,
    updatePeriod,
    isPeriodDay,
    isFertileDay,
    isOvulationDay,
    isPredictedDay,
    futurePredictions,
  } = usePeriods();

  const { symptoms, saveSymptom } = useSymptoms();

  const today = new Date().toISOString().split("T")[0];
  const todaySymptom = symptoms.find((s) => s.date === today);

  const [activeSection, setActiveSection] = useState("dashboard");

  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    onConfirm: null,
  });

  const showAlert = (title, message, type = "info") => {
    setAlertModal({ isOpen: true, type, title, message, onConfirm: null });
  };

  const showConfirm = (title, message, onConfirm) => {
    setAlertModal({ isOpen: true, type: "confirm", title, message, onConfirm });
  };

  const closeAlert = () => {
    setAlertModal({ isOpen: false, type: "info", title: "", message: "", onConfirm: null });
  };

  if (periodsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-pink-300 border-t-purple-400 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500 text-lg">Loading your cycle data...</p>
        </div>
      </div>
    );
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <DashboardOverview
            currentCycleDay={currentCycleDay}
            currentPhase={currentPhase}
            phaseInfo={phaseInfo}
            nextPeriodDate={nextPeriodDate}
            avgCycleLength={avgCycleLength}
            todaySymptom={todaySymptom}
            isPeriodDay={isPeriodDay}
            isPredictedDay={isPredictedDay}
            isFertileDay={isFertileDay}
            isOvulationDay={isOvulationDay}
          />
        );
      case "tracker":
        return (
          <CycleTracker
            periods={periods}
            addPeriod={addPeriod}
            updatePeriod={updatePeriod}
            deletePeriod={deletePeriod}
            showConfirm={showConfirm}
          />
        );
      case "symptoms":
        return (
          <SymptomJournal
            symptoms={symptoms}
            saveSymptom={saveSymptom}
          />
        );
      case "report":
        return (
          <HealthReport
            profile={user}
            periods={periods}
            symptoms={symptoms}
            prediction={prediction}
            avgCycleLength={avgCycleLength}
            avgDuration={avgDuration}
            nextPeriodDate={nextPeriodDate}
            futurePredictions={futurePredictions}
            showAlert={showAlert}
          />
        );
      case "profile":
        return <Profile />;
      case "education":
        return <Edukasi />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen h-screen w-screen bg-[#FAF8F6] flex flex-col lg:flex-row overflow-hidden">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <div className="flex-1 overflow-y-auto p-4 md:p-10">
        <div className="max-w-6xl mx-auto w-full">
          {renderActiveSection()}
        </div>
      </div>

      <AlertModal
        isOpen={alertModal.isOpen}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
        onConfirm={alertModal.onConfirm}
        onClose={closeAlert}
      />
    </div>
  );
}

export default Dashboard;