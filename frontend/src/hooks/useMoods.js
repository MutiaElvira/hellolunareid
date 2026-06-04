import { useEffect, useState, useCallback } from "react";
import * as moodService from "../services/moodService";

const MOOD_TYPES = [
  { type: "happy", emoji: "😊", label: "Happy" },
  { type: "sad", emoji: "😢", label: "Sad" },
  { type: "angry", emoji: "😤", label: "Angry" },
  { type: "anxious", emoji: "😰", label: "Anxious" },
  { type: "tired", emoji: "😴", label: "Tired" },
  { type: "loved", emoji: "🥰", label: "Loved" },
  { type: "neutral", emoji: "😐", label: "Neutral" },
  { type: "energetic", emoji: "⚡", label: "Energetic" },
];

function useMoods() {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMoods = useCallback(async () => {
    try {
      const data = await moodService.getMoods();
      setMoods(data);
    } catch (error) {
      console.log("Error fetching moods:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addMood = async (data) => {
    try {
      await moodService.addMood(data);
      await fetchMoods();
      return true;
    } catch (error) {
      console.log("Error adding mood:", error);
      return false;
    }
  };

  const deleteMood = async (id) => {
    try {
      await moodService.deleteMood(id);
      await fetchMoods();
      return true;
    } catch (error) {
      console.log("Error deleting mood:", error);
      return false;
    }
  };

  useEffect(() => {
    fetchMoods();
  }, [fetchMoods]);

  // Get today's mood
  const today = new Date().toISOString().split("T")[0];
  const todayMood = moods.find((m) => m.date === today);

  // Get mood emoji by type
  const getMoodEmoji = (type) => {
    const found = MOOD_TYPES.find((m) => m.type === type);
    return found ? found.emoji : "😐";
  };

  return {
    moods,
    loading,
    todayMood,
    addMood,
    deleteMood,
    getMoodEmoji,
    MOOD_TYPES,
  };
}

export default useMoods;
