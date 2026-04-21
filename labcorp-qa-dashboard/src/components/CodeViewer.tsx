import { useState } from 'react';
import { FileText, Code as Code2, Package } from 'lucide-react';
import { GET_REQUEST_FEATURE, POST_REQUEST_FEATURE, POM_XML, PAYLOAD_BUILDER } from '../data/featureFiles';

interface FileNode {
  id: string;
  label: string;
  icon: React.ReactNode;
  content: string;
  language: string;
  path: string;
}

const files: FileNode[] = [
  {
    id: 'get-feature',
    label: 'GetRequest.feature',
    icon: <FileText size={14} color="#e3b341" />,
    content: GET_REQUEST_FEATURE,
    language: 'gherkin',
    path: 'src/test/resources/features/GetRequest.feature',
  },
  {
    id: 'post-feature',
    label: 'PostRequest.feature',
    icon: <FileText size={14} color="#e3b341" />,
    content: POST_REQUEST_FEATURE,
    language: 'gherkin',
    path: 'src/test/resources/features/PostRequest.feature',
  },
  {
    id: 'payload-builder',
    label: 'PayloadBuilder.java',
    icon: <Code2 size={14} color="var(--color-blue-light)" />,
    content: PAYLOAD_BUILDER,
    language: 'java',
    path: 'src/test/java/com/qa/utils/PayloadBuilder.java',
  },
  {
    id: 'pom',
    label: 'pom.xml',
    icon: <Package size={14} color="var(--color-green-light)" />,
    content: POM_XML,
    language: 'xml',
    path: 'pom.xml',
  },
];

function tokenize(content: string, language: string): React.ReactNode[] {
  const lines = content.split('\n');
  return lines.map((line, lineIdx) => {
    const spans: React.ReactNode[] = [];

    if (language === 'gherkin') {
      const keywordMatch = line.match(/^(\s*)(Feature:|Background:|Scenario:|Scenario Outline:|Examples:|Given|When|Then|And|But)(\s.*)?$/);
      const tagMatch = line.match(/^(\s*)(@\S+)/);
      const commentMatch = line.match(/^(\s*)(#.*)/);
      const tableMatch = line.match(/^\s*\|/);
      const exampleMatch = line.match(/(\|[^|]+)/g);

      if (commentMatch) {
        spans.push(<span key="c" style={{ color: '#6e7681', fontStyle: 'italic' }}>{line}</span>);
      } else if (tagMatch) {
        spans.push(<span key="ws">{tagMatch[1]}</span>);
        spans.push(<span key="tag" style={{ color: '#79c0ff' }}>{tagMatch[2]}</span>);
        if (line.slice(tagMatch[0].length)) {
          spans.push(<span key="rest" style={{ color: '#79c0ff' }}>{line.slice(tagMatch[0].length)}</span>);
        }
      } else if (keywordMatch) {
        spans.push(<span key="ws">{keywordMatch[1]}</span>);
        const kw = keywordMatch[2];
        const kwColor = kw === 'Feature:' || kw === 'Background:'
          ? '#d2a8ff'
          : kw === 'Scenario:' || kw === 'Scenario Outline:' || kw === 'Examples:'
          ? '#ffa657'
          : kw === 'Given'
          ? '#e3b341'
          : kw === 'When'
          ? '#79c0ff'
          : kw === 'Then'
          ? '#56d364'
          : '#8b949e';
        spans.push(<span key="kw" style={{ color: kwColor, fontWeight: 600 }}>{kw}</span>);
        if (keywordMatch[3]) {
          const rest = keywordMatch[3];
          const strParts = rest.split(/"([^"]*)"/g);
          strParts.forEach((part, i) => {
            if (i % 2 === 1) {
              spans.push(<span key={`s${i}`} style={{ color: '#a5d6ff' }}>"{part}"</span>);
            } else {
              spans.push(<span key={`t${i}`} style={{ color: '#e6edf3' }}>{part}</span>);
            }
          });
        }
      } else if (tableMatch && exampleMatch) {
        spans.push(<span key="table" style={{ color: '#a5d6ff' }}>{line}</span>);
      } else {
        const strParts = line.split(/"([^"]*)"/g);
        strParts.forEach((part, i) => {
          if (i % 2 === 1) {
            spans.push(<span key={`s${i}`} style={{ color: '#a5d6ff' }}>"{part}"</span>);
          } else {
            spans.push(<span key={`t${i}`} style={{ color: '#e6edf3' }}>{part}</span>);
          }
        });
      }
    } else if (language === 'java') {
      const keywords = /\b(public|private|static|class|import|package|void|new|return|try|catch|throw|throws|if|else|for|Map|List|String|Object|true|false|null)\b/g;
      const annotations = /@\w+/g;
      const strings = /"([^"]*)"/g;
      const comments = /\/\/.*/g;


      let processed = line;
      // Color annotations
      processed = processed.replace(annotations, m => `\x01ann\x02${m}\x01`);
      // Color strings
      processed = processed.replace(strings, (_m, g) => `\x01str\x02"${g}"\x01`);
      // Color comments
      processed = processed.replace(comments, m => `\x01cmt\x02${m}\x01`);
      // Color keywords
      processed = processed.replace(keywords, m => `\x01kw\x02${m}\x01`);

      const tokenParts = processed.split(/(\x01\w+\x02[^\x01]*\x01)/g);
      tokenParts.forEach((part, i) => {
        if (part.startsWith('\x01kw\x02')) {
          spans.push(<span key={i} style={{ color: '#ff7b72', fontWeight: 500 }}>{part.replace(/^\x01kw\x02/, '').replace(/\x01$/, '')}</span>);
        } else if (part.startsWith('\x01ann\x02')) {
          spans.push(<span key={i} style={{ color: '#ffa657' }}>{part.replace(/^\x01ann\x02/, '').replace(/\x01$/, '')}</span>);
        } else if (part.startsWith('\x01str\x02')) {
          spans.push(<span key={i} style={{ color: '#a5d6ff' }}>{part.replace(/^\x01str\x02/, '').replace(/\x01$/, '')}</span>);
        } else if (part.startsWith('\x01cmt\x02')) {
          spans.push(<span key={i} style={{ color: '#6e7681', fontStyle: 'italic' }}>{part.replace(/^\x01cmt\x02/, '').replace(/\x01$/, '')}</span>);
        } else {
          spans.push(<span key={i}>{part}</span>);
        }
      });
    } else if (language === 'xml') {
      const tagMatch2 = line.match(/^(\s*)(<\/?)([\w:.-]+)(.*?>)(.*)?$/);
      if (tagMatch2) {
        spans.push(<span key="ws">{tagMatch2[1]}</span>);
        spans.push(<span key="lt" style={{ color: '#7d8590' }}>{tagMatch2[2]}</span>);
        spans.push(<span key="tn" style={{ color: '#7ee787' }}>{tagMatch2[3]}</span>);
        spans.push(<span key="gt" style={{ color: '#7d8590' }}>{tagMatch2[4]}</span>);
        if (tagMatch2[5]) spans.push(<span key="val" style={{ color: '#e6edf3' }}>{tagMatch2[5]}</span>);
      } else if (line.match(/<!--/)) {
        spans.push(<span key="cmt" style={{ color: '#6e7681', fontStyle: 'italic' }}>{line}</span>);
      } else {
        spans.push(<span key="t">{line}</span>);
      }
    } else {
      spans.push(<span key="t">{line}</span>);
    }

    return (
      <div key={lineIdx} style={{ display: 'flex', lineHeight: '1.6' }}>
        <span style={{
          minWidth: 44,
          paddingRight: 16,
          textAlign: 'right',
          color: '#484f58',
          userSelect: 'none',
          fontSize: 11,
          paddingTop: 1,
        }}>
          {lineIdx + 1}
        </span>
        <span style={{ flex: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{spans}</span>
      </div>
    );
  });
}

export function CodeViewer() {
  const [selected, setSelected] = useState(files[0].id);
  const file = files.find(f => f.id === selected) ?? files[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4 }}>
          Code Viewer
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>
          Browse the source files from the LabCorp QA automation framework
        </p>
      </div>

      <div style={{
        display: 'flex',
        gap: 0,
        background: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        height: 'calc(100vh - 280px)',
        minHeight: 500,
      }}>
        {/* Sidebar */}
        <div style={{
          width: 220,
          borderRight: '1px solid var(--color-border)',
          overflowY: 'auto',
          flexShrink: 0,
        }}>
          <div style={{
            padding: '12px 16px',
            fontSize: 11,
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            fontWeight: 500,
            borderBottom: '1px solid var(--color-border-muted)',
          }}>
            Files
          </div>
          {files.map(f => (
            <div
              key={f.id}
              onClick={() => setSelected(f.id)}
              style={{
                padding: '9px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                background: selected === f.id ? 'var(--color-bg-tertiary)' : 'transparent',
                borderLeft: selected === f.id ? '2px solid var(--color-blue-primary)' : '2px solid transparent',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => {
                if (selected !== f.id) (e.currentTarget.style.background = 'rgba(48,54,61,0.5)');
              }}
              onMouseLeave={e => {
                if (selected !== f.id) (e.currentTarget.style.background = 'transparent');
              }}
            >
              {f.icon}
              <div>
                <div style={{ fontSize: 12, fontWeight: selected === f.id ? 500 : 400, color: selected === f.id ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>
                  {f.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Code area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* File path header */}
          <div style={{
            padding: '10px 20px',
            borderBottom: '1px solid var(--color-border)',
            fontSize: 12,
            color: 'var(--color-text-muted)',
            fontFamily: 'JetBrains Mono, monospace',
            background: 'var(--color-bg)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            {file.icon}
            <span>{file.path}</span>
          </div>

          {/* Code content */}
          <div style={{
            flex: 1,
            overflow: 'auto',
            padding: '16px 0',
            background: 'var(--color-bg)',
            fontSize: 12,
            fontFamily: 'JetBrains Mono, monospace',
            lineHeight: 1.6,
            color: '#e6edf3',
          }}>
            {tokenize(file.content, file.language)}
          </div>
        </div>
      </div>
    </div>
  );
}
