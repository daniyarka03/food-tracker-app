import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './NewEntry.css';

function NewEntry({ addMeal, foodHistory }) {
  const navigate = useNavigate();
  const [mealType, setMealType] = useState('Завтрак');
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [fats, setFats] = useState('');
  const [carbs, setCarbs] = useState('');
  const [date, setDate] = useState(getCurrentDate());
  
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    if (foodName) {
      const matchedSuggestions = Object.keys(foodHistory)
        .filter(item => item.toLowerCase().includes(foodName.toLowerCase()))
        .slice(0, 5);
      setSuggestions(matchedSuggestions);
      setShowSuggestions(matchedSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [foodName, foodHistory]);

  const handleSelectSuggestion = (suggestion) => {
    setFoodName(suggestion);
    setShowSuggestions(false);
    
    // Auto-fill nutrition info
    if (foodHistory[suggestion]) {
      setCalories(foodHistory[suggestion].calories || '');
      setProtein(foodHistory[suggestion].protein || '');
      setFats(foodHistory[suggestion].fats || '');
      setCarbs(foodHistory[suggestion].carbs || '');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const meal = {
      date,
      mealType,
      foodName,
      calories,
      protein,
      fats,
      carbs
    };
    
    addMeal(meal);
    navigate('/');
  };

  return (
    <div className="new-entry">
      <h2>Новый прием пищи</h2>
      
      <form onSubmit={handleSubmit}>
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
          <label>Название продукта</label>
          <div className="autocomplete">
            <input
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="Введите название продукта"
              required
            />
            {showSuggestions && (
              <ul className="suggestions">
                {suggestions.map((suggestion, index) => (
                  <li key={index} onClick={() => handleSelectSuggestion(suggestion)}>
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        <div className="form-group">
          <label>Тип приема пищи</label>
          <select value={mealType} onChange={(e) => setMealType(e.target.value)}>
            <option value="Завтрак">Завтрак</option>
            <option value="Обед">Обед</option>
            <option value="Ужин">Ужин</option>
            <option value="Закуска">Закуска</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Калории</label>
          <input
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            placeholder="Введите калории"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Белки (г)</label>
          <input
            type="number"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            placeholder="Введите белки"
          />
        </div>
        
        <div className="form-group">
          <label>Жиры (г)</label>
          <input
            type="number"
            value={fats}
            onChange={(e) => setFats(e.target.value)}
            placeholder="Введите жиры"
          />
        </div>
        
        <div className="form-group">
          <label>Углеводы (г)</label>
          <input
            type="number"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
            placeholder="Введите углеводы"
          />
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/')} className="cancel-button">
            Отмена
          </button>
          <button type="submit" className="save-button">
            Сохранить
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewEntry;