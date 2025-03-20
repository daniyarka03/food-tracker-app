import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import NewEntry from './components/NewEntry';
import Analytics from './components/Analytics';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  const [meals, setMeals] = useState(() => {
    const savedMeals = localStorage.getItem('meals');
    return savedMeals ? JSON.parse(savedMeals) : [];
  });
  
  const [foodHistory, setFoodHistory] = useState(() => {
    const savedHistory = localStorage.getItem('foodHistory');
    return savedHistory ? JSON.parse(savedHistory) : {};
  });

  const [weightEntries, setWeightEntries] = useState(() => {
    const savedWeightEntries = localStorage.getItem('weightEntries');
    return savedWeightEntries ? JSON.parse(savedWeightEntries) : [];
  });

  useEffect(() => {
    localStorage.setItem('meals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem('foodHistory', JSON.stringify(foodHistory));
  }, [foodHistory]);

  useEffect(() => {
    localStorage.setItem('weightEntries', JSON.stringify(weightEntries));
  }, [weightEntries]);

  const addMeal = (meal) => {
    // Update the meals list
    setMeals([...meals, meal]);
    
    // Update food history for autocomplete
    setFoodHistory(prev => {
      const newHistory = { ...prev };
      if (!newHistory[meal.foodName]) {
        newHistory[meal.foodName] = {
          calories: meal.calories,
          protein: meal.protein,
          fats: meal.fats,
          carbs: meal.carbs
        };
      }
      return newHistory;
    });
  };

  const addWeightEntry = (entry) => {
    // Check if there's already an entry for this date
    const existingEntryIndex = weightEntries.findIndex(item => item.date === entry.date);
    
    if (existingEntryIndex !== -1) {
      // Update existing entry
      const updatedEntries = [...weightEntries];
      updatedEntries[existingEntryIndex] = entry;
      setWeightEntries(updatedEntries);
    } else {
      // Add new entry
      setWeightEntries([...weightEntries, entry]);
    }
  };

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>Трекер питания</h1>
        </header>
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Home meals={meals} weightEntries={weightEntries} addWeightEntry={addWeightEntry} />} />
            <Route path="/new" element={<NewEntry addMeal={addMeal} foodHistory={foodHistory} />} />
            <Route path="/analytics" element={<Analytics meals={meals} weightEntries={weightEntries} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;