import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './Stage1.css';

export default function Stage1({ responses }) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(null);

  if (!responses || responses.length === 0) {
    return null;
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(activeTab);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="stage stage1">
      <h3 className="stage-title">المرحلة 1: الردود الفردية</h3>

      <div className="tabs">
        {responses.map((resp, index) => (
          <button
            key={index}
            className={`tab ${activeTab === index ? 'active' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {resp.model.split('/')[1] || resp.model}
          </button>
        ))}
      </div>

      <div className="tab-content">
        <div className="response-header">
          <div className="model-name">{responses[activeTab].model}</div>
          <button
            className={`copy-btn ${copied === activeTab ? 'copied' : ''}`}
            onClick={() => handleCopy(responses[activeTab].response)}
            title="نسخ الرد"
          >
            {copied === activeTab ? '✓ تم النسخ' : '📋 نسخ'}
          </button>
        </div>
        <div className="response-text markdown-content">
          <ReactMarkdown>{responses[activeTab].response}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
