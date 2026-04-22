import { useState, useEffect } from 'react';
import { api } from '../api';
import './Statistics.css';

export default function Statistics({ onClose }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const data = await api.getStatistics();
      setStats(data);
      setError(null);
    } catch (err) {
      setError('فشل تحميل الإحصائيات');
      console.error('Failed to load statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="statistics-modal">
        <div className="statistics-content">
          <div className="loading">جاري تحميل الإحصائيات...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="statistics-modal">
        <div className="statistics-content">
          <div className="error">{error}</div>
          <button onClick={onClose}>إغلاق</button>
        </div>
      </div>
    );
  }

  const getModelShortName = (model) => {
    const parts = model.split('/');
    return parts[parts.length - 1];
  };

  const getWinRate = (stats) => {
    const total = stats.total_rankings;
    if (total === 0) return 0;
    return ((stats.first_place_count / total) * 100).toFixed(1);
  };

  return (
    <div className="statistics-modal" onClick={onClose}>
      <div className="statistics-content" onClick={(e) => e.stopPropagation()}>
        <div className="statistics-header">
          <h2>📊 إحصائيات أداء النماذج</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="statistics-summary">
          <div className="summary-item">
            <div className="summary-label">عدد المحادثات المحللة</div>
            <div className="summary-value">{stats.total_conversations_analyzed}</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">عدد النماذج</div>
            <div className="summary-value">{stats.model_statistics.length}</div>
          </div>
        </div>

        <div className="statistics-table-container">
          <table className="statistics-table">
            <thead>
              <tr>
                <th>الترتيب</th>
                <th>النموذج</th>
                <th>معدل الترتيب</th>
                <th>نسبة الفوز</th>
                <th>المركز الأول</th>
                <th>المركز الثاني</th>
                <th>المركز الثالث</th>
                <th>إجمالي المشاركات</th>
              </tr>
            </thead>
            <tbody>
              {stats.model_statistics.map((modelStat, index) => (
                <tr key={modelStat.model} className={index === 0 ? 'top-model' : ''}>
                  <td className="rank-cell">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                  </td>
                  <td className="model-cell" title={modelStat.model}>
                    {getModelShortName(modelStat.model)}
                  </td>
                  <td className="avg-rank-cell">
                    {modelStat.average_rank > 0
                      ? modelStat.average_rank.toFixed(2)
                      : 'N/A'}
                  </td>
                  <td className="win-rate-cell">
                    {getWinRate(modelStat)}%
                  </td>
                  <td className="place-cell gold">{modelStat.first_place_count}</td>
                  <td className="place-cell silver">{modelStat.second_place_count}</td>
                  <td className="place-cell bronze">{modelStat.third_place_count}</td>
                  <td className="total-cell">{modelStat.total_rankings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="statistics-footer">
          <p className="note">
            💡 معدل الترتيب: كلما كان الرقم أقل، كان الأداء أفضل (1 = الأفضل)
          </p>
        </div>
      </div>
    </div>
  );
}
