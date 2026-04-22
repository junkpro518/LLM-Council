import { useState, useEffect } from 'react';
import './Sidebar.css';

export default function Sidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onShowStatistics,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    const title = (conv.title || 'محادثة جديدة').toLowerCase();

    return title.includes(query);
  });

  const handleDelete = (e, convId) => {
    e.stopPropagation(); // منع اختيار المحادثة عند الحذف
    onDeleteConversation(convId);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>LLM Council</h1>
        <div className="header-buttons">
          <button className="stats-btn" onClick={onShowStatistics} title="إحصائيات الأداء">
            📊
          </button>
          <button className="new-conversation-btn" onClick={onNewConversation}>
            + محادثة جديدة
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="بحث في المحادثات..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            className="clear-search-btn"
            onClick={() => setSearchQuery('')}
            title="مسح البحث"
          >
            ×
          </button>
        )}
      </div>

      <div className="conversation-list">
        {filteredConversations.length === 0 ? (
          <div className="no-conversations">
            {searchQuery ? 'لا توجد نتائج بحث' : 'لا توجد محادثات بعد'}
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <div
              key={conv.id}
              className={`conversation-item ${
                conv.id === currentConversationId ? 'active' : ''
              }`}
              onClick={() => onSelectConversation(conv.id)}
            >
              <div className="conversation-content">
                <div className="conversation-title">
                  {conv.title || 'محادثة جديدة'}
                </div>
                <div className="conversation-meta">
                  {conv.message_count} رسائل
                </div>
              </div>
              <button
                className="delete-conversation-btn"
                onClick={(e) => handleDelete(e, conv.id)}
                title="حذف المحادثة"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
