import React, { useState } from 'react';
import './WeightTracker.css';

function WeightTracker({ weightEntries, addWeightEntry }) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(getCurrentDate());

  function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Find entry for today if exists
  const todayEntry = weightEntries.find(entry => entry.date === getCurrentDate());
  
  const handleSubmit = (e) => {
    e.preventDefault();
    addWeightEntry({ date, weight: parseFloat(weight) });
    setIsFormVisible(false);
    setWeight('');
  };

  return (
    <div className="weight-tracker">
      <div className="weight-header">
        <h3>Отслеживание веса</h3>
        <button 
          className="toggle-form-button" 
          onClick={() => setIsFormVisible(!isFormVisible)}
        >
          {isFormVisible ? 'Отмена' : (todayEntry ? 'Изменить' : 'Добавить вес')}
        </button>
      </div>

      {todayEntry && !isFormVisible && (
        <div className="current-weight">
          <p>Сегодняшний вес: <strong>{todayEntry.weight} кг</strong></p>
        </div>
      )}

      {isFormVisible && (
        <form onSubmit={handleSubmit} className="weight-form">
          <div className="form-row">
            <div className="form-group">
              <label>Дата</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Вес (кг)</label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Введите вес"
                required
              />
            </div>
            <button type="submit" className="save-weight-button">Сохранить</button>
          </div>
        </form>
      )}

      {weightEntries.length > 0 && !isFormVisible && (
        <div className="weight-history">
          <p className="weight-history-label">Последние записи:</p>
          <div className="weight-entries">
            {weightEntries
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 5)
              .map((entry, index) => (
                <div key={index} className="weight-entry">
                  <span className="weight-date">{entry.date}</span>
                  <span className="weight-value">{entry.weight} кг</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WeightTracker;