import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import WeightTracker from './WeightTracker';
import './Home.css';

function Home({ meals, weightEntries, addWeightEntry }) {
  const groupMealsByDate = () => {
    const grouped = {};
    meals.forEach(meal => {
      const date = meal.date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(meal);
    });
    return grouped;
  };

  const calculateDailyTotals = (dayMeals) => {
    return dayMeals.reduce((totals, meal) => {
      return {
        calories: totals.calories + (parseInt(meal.calories) || 0),
        protein: totals.protein + (parseInt(meal.protein) || 0),
        fats: totals.fats + (parseInt(meal.fats) || 0),
        carbs: totals.carbs + (parseInt(meal.carbs) || 0)
      };
    }, { calories: 0, protein: 0, fats: 0, carbs: 0 });
  };

  const groupedMeals = groupMealsByDate();
  const sortedDates = Object.keys(groupedMeals).sort((a, b) => new Date(b) - new Date(a));

  return (
    <div className="home">
      <div className="header-actions">
        <h2>Питание</h2>
        <Link to="/new" className="add-button">+ Добавить</Link>
      </div>

      <WeightTracker weightEntries={weightEntries} addWeightEntry={addWeightEntry} />

      {sortedDates.length === 0 ? (
        <div className="no-meals">
          <p>Нет записей о питании. Добавьте свой первый прием пищи!</p>
        </div>
      ) : (
        sortedDates.map(date => (
          <div key={date} className="date-group">
            <h3 className="date-header">{date}</h3>
            
            {groupedMeals[date].map((meal, index) => (
              <div key={index} className="meal-card">
                <div className="meal-header">
                  <h4>{meal.foodName}</h4>
                  <span className="meal-type">{meal.mealType}</span>
                </div>
                <div className="meal-nutrients">
                  <div className="nutrient">
                    <span className="label">Калории:</span>
                    <span className="value">{meal.calories}</span>
                  </div>
                  {meal.protein && (
                    <div className="nutrient">
                      <span className="label">Белки:</span>
                      <span className="value">{meal.protein}г</span>
                    </div>
                  )}
                  {meal.fats && (
                    <div className="nutrient">
                      <span className="label">Жиры:</span>
                      <span className="value">{meal.fats}г</span>
                    </div>
                  )}
                  {meal.carbs && (
                    <div className="nutrient">
                      <span className="label">Углеводы:</span>
                      <span className="value">{meal.carbs}г</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            <div className="daily-summary">
              <h4>Итого за день:</h4>
              <div className="daily-nutrients">
                {(() => {
                  const totals = calculateDailyTotals(groupedMeals[date]);
                  return (
                    <>
                      <div className="nutrient">
                        <span className="label">Калории:</span>
                        <span className="value">{totals.calories}</span>
                      </div>
                      <div className="nutrient">
                        <span className="label">Белки:</span>
                        <span className="value">{totals.protein}г</span>
                      </div>
                      <div className="nutrient">
                        <span className="label">Жиры:</span>
                        <span className="value">{totals.fats}г</span>
                      </div>
                      <div className="nutrient">
                        <span className="label">Углеводы:</span>
                        <span className="value">{totals.carbs}г</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Home;