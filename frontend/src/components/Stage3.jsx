import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './Stage3.css';

export default function Stage3({ finalResponse }) {
  const [copied, setCopied] = useState(false);

  if (!finalResponse) {
    return null;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(finalResponse.response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="stage stage3">
      <h3 className="stage-title">المرحلة 3: الإجابة النهائية</h3>
      <div className="final-response">
        <div className="response-header">
          <div className="chairman-label">
            رئيس المجلس: {finalResponse.model.split('/')[1] || finalResponse.model}
          </div>
          <button
            className={`copy-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
            title="نسخ الإجابة"
          >
            {copied ? '✓ تم النسخ' : '📋 نسخ'}
          </button>
        </div>
        <div className="final-text markdown-content">
          <ReactMarkdown>{finalResponse.response}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
