import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './Analytics.css';

function Analytics({ meals, weightEntries }) {
  const [timeRange, setTimeRange] = useState('7'); // default to 7 days
  const [popularFoods, setPopularFoods] = useState([]);

  // Define name map at component level so it's available everywhere
  const nameMap = {
    'calories': 'Калории',
    'protein': 'Белки',
    'fats': 'Жиры',
    'carbs': 'Углеводы'
  };

  const unitMap = {
    'calories': 'ккал',
    'protein': 'г',
    'fats': 'г',
    'carbs': 'г'
  };

  useEffect(() => {
    // Calculate popular foods when meals change
    const foodCounts = {};
    meals.forEach(meal => {
      // Make sure we have a valid name or provide a proper Russian default
      const foodName = (meal.name && meal.name.trim()) ? meal.name.trim() : 'Без названия';
      foodCounts[foodName] = (foodCounts[foodName] || 0) + 1;
    });
    
    // Convert to array and sort by count
    const sortedFoods = Object.entries(foodCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 foods
    
    setPopularFoods(sortedFoods);
  }, [meals]);

  // Group meals by date and calculate daily totals
  const getDailyNutrients = () => {
    const dailyTotals = {};
    
    meals.forEach(meal => {
      const { date, calories, protein, fats, carbs } = meal;
      
      if (!dailyTotals[date]) {
        dailyTotals[date] = {
          date,
          calories: 0,
          protein: 0,
          fats: 0,
          carbs: 0
        };
      }
      
      dailyTotals[date].calories += parseInt(calories) || 0;
      dailyTotals[date].protein += parseInt(protein) || 0;
      dailyTotals[date].fats += parseInt(fats) || 0;
      dailyTotals[date].carbs += parseInt(carbs) || 0;
    });
    
    return Object.values(dailyTotals);
  };

  // Filter data by time range
  const filterDataByRange = (data) => {
    if (!data.length) return [];
    
    const today = new Date();
    
    if (timeRange === 'today') {
      const todayStr = today.toISOString().split('T')[0];
      return data.filter(item => item.date === todayStr);
    }
    
    if (timeRange === 'all') {
      return data.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    
    const days = parseInt(timeRange);
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - days);
    
    return data
      .filter(item => new Date(item.date) >= startDate)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const dailyNutrients = getDailyNutrients();
  const filteredNutrients = filterDataByRange(dailyNutrients);
  const filteredWeightEntries = filterDataByRange(weightEntries);

  // Format date for charts - Month Day format
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Format for tooltips
  const nutrientTooltipFormatter = (value, name) => {
    return [`${value} ${unitMap[name] || 'г'}`, nameMap[name] || name];
  };

  // Custom pie chart label
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
      >
        {`${name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', 
                 '#82CA9D', '#FFC658', '#8DD1E1', '#A4DE6C', '#D0ED57'];

  return (
    <div className="analytics">
      <h2>Аналитика</h2>
      
      <div className="filter-controls">
        <label>Показать данные за: </label>
        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
          <option value="today">Сегодня</option>
          <option value="3">3 дня</option>
          <option value="7">7 дней</option>
          <option value="14">14 дней</option>
          <option value="30">30 дней</option>
          <option value="90">90 дней</option>
          <option value="all">Все время</option>
        </select>
      </div>
      
      <div className="chart-section">
        <h3>Вес</h3>
        {filteredWeightEntries.length > 1 ? (
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredWeightEntries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  domain={['dataMin - 1', 'dataMax + 1']}
                  tickCount={5}
                  label={{ value: 'кг', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value) => [`${value} кг`, 'Вес']}
                  labelFormatter={(label) => `Дата: ${formatDate(label)}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  name="Вес" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  connectNulls={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="no-data-message">Недостаточно данных о весе для отображения графика.</p>
        )}
      </div>

      <div className="chart-section">
        <h3>Калории</h3>
        {filteredNutrients.length > 1 ? (
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredNutrients}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  label={{ value: 'ккал', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={nutrientTooltipFormatter}
                  labelFormatter={(label) => `Дата: ${formatDate(label)}`}
                />
                <Legend />
                <Bar 
                  dataKey="calories" 
                  name="Калории" 
                  fill="#FF8042"
                  connectNulls={true}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="no-data-message">Недостаточно данных о калориях для отображения графика.</p>
        )}
      </div>
      
      <div className="chart-section">
        <h3>Белки</h3>
        {filteredNutrients.length > 1 ? (
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredNutrients}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  label={{ value: 'г', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={nutrientTooltipFormatter}
                  labelFormatter={(label) => `Дата: ${formatDate(label)}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="protein" 
                  name="Белки" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  connectNulls={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="no-data-message">Недостаточно данных о белках для отображения графика.</p>
        )}
      </div>
      
      <div className="chart-section">
        <h3>Жиры</h3>
        {filteredNutrients.length > 1 ? (
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredNutrients}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  label={{ value: 'г', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={nutrientTooltipFormatter}
                  labelFormatter={(label) => `Дата: ${formatDate(label)}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="fats" 
                  name="Жиры" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  connectNulls={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="no-data-message">Недостаточно данных о жирах для отображения графика.</p>
        )}
      </div>
      
      <div className="chart-section">
        <h3>Углеводы</h3>
        {filteredNutrients.length > 1 ? (
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredNutrients}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  label={{ value: 'г', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={nutrientTooltipFormatter}
                  labelFormatter={(label) => `Дата: ${formatDate(label)}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="carbs" 
                  name="Углеводы" 
                  stroke="#ffc658" 
                  strokeWidth={2}
                  connectNulls={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="no-data-message">Недостаточно данных об углеводах для отображения графика.</p>
        )}
      </div>
      
      <div className="chart-section">
        <h3>Соотношение нутриентов</h3>
        {filteredNutrients.length > 1 ? (
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredNutrients}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  label={{ value: 'г', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value, name) => {
                    if (value === undefined || isNaN(value)) {
                      return ["0 г", nameMap[name] || name];
                    }
                    return [`${value} г`, nameMap[name] || name];
                  }}
                  labelFormatter={(label) => `Дата: ${formatDate(label)}`}
                />
                <Legend />
                <Bar dataKey="protein" name="Белки" stackId="a" fill="#8884d8" />
                <Bar dataKey="fats" name="Жиры" stackId="a" fill="#82ca9d" />
                <Bar dataKey="carbs" name="Углеводы" stackId="a" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="no-data-message">Недостаточно данных о питательных веществах для отображения графика.</p>
        )}
      </div>

      <div className="chart-section">
        <h3>Популярные продукты</h3>
        {popularFoods.length > 0 ? (
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={popularFoods}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  labelLine={false}
                  label={renderCustomizedLabel}
                >
                  {popularFoods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} раз`, 'Частота употребления']}
                  labelFormatter={(label) => `Продукт: ${label}`}
                />
                <Legend formatter={(value) => value === 'Unnamed' ? 'Без названия' : value} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="no-data-message">Недостаточно данных о продуктах для отображения графика.</p>
        )}
      </div>
    </div>
  );
}

export default Analytics;