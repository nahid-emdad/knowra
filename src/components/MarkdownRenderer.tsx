import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  // Parse markdown lines into structured elements
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = '';
  let inList = false;
  let listItems: string[] = [];
  let listType: 'ul' | 'ol' = 'ul';

  const flushList = (key: string) => {
    if (listItems.length > 0) {
      if (listType === 'ol') {
        elements.push(
          <ol key={`ol-${key}`} className="list-decimal pl-6 space-y-1.5 my-4 text-foreground/90">
            {listItems.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul key={`ul-${key}`} className="list-disc pl-6 space-y-1.5 my-4 text-foreground/90">
            {listItems.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            ))}
          </ul>
        );
      }
      listItems = [];
      inList = false;
    }
  };

  const formatInline = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-secondary text-accent font-mono text-xs">$1</code>');
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle Code Blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        // End of code block
        elements.push(
          <pre
            key={`code-${i}`}
            className="p-4 rounded-xl bg-secondary/80 border border-border font-mono text-xs overflow-x-auto my-4 text-foreground"
          >
            <code>{codeBuffer.join('\n')}</code>
          </pre>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        // Start of code block
        flushList(`flush-code-${i}`);
        inCodeBlock = true;
        codeLang = line.replace('```', '').trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Handle Math display block ($$...$$)
    if (line.trim().startsWith('$$') && line.trim().endsWith('$$') && line.trim().length > 4) {
      flushList(`math-${i}`);
      const formula = line.trim().slice(2, -2).trim();
      elements.push(
        <div
          key={`math-${i}`}
          className="my-5 p-4 rounded-xl bg-card border border-border font-mono text-sm sm:text-base text-center overflow-x-auto shadow-sm text-foreground"
        >
          {formula}
        </div>
      );
      continue;
    }

    // Handle Headers
    if (line.startsWith('# ')) {
      flushList(`h1-${i}`);
      elements.push(
        <h1 key={`h1-${i}`} className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-foreground mt-8 mb-4">
          {line.replace('# ', '')}
        </h1>
      );
      continue;
    }

    if (line.startsWith('## ')) {
      flushList(`h2-${i}`);
      elements.push(
        <h2 key={`h2-${i}`} className="text-2xl font-serif font-bold tracking-tight text-foreground mt-8 mb-3 pb-2 border-b border-border">
          {line.replace('## ', '')}
        </h2>
      );
      continue;
    }

    if (line.startsWith('### ')) {
      flushList(`h3-${i}`);
      elements.push(
        <h3 key={`h3-${i}`} className="text-xl font-serif font-semibold text-foreground mt-6 mb-2">
          {line.replace('### ', '')}
        </h3>
      );
      continue;
    }

    // Handle Blockquotes
    if (line.startsWith('> ')) {
      flushList(`quote-${i}`);
      elements.push(
        <blockquote
          key={`quote-${i}`}
          className="border-l-4 border-accent pl-4 py-1 italic my-4 text-muted-foreground bg-accent/5 rounded-r-lg"
          dangerouslySetInnerHTML={{ __html: formatInline(line.replace('> ', '')) }}
        />
      );
      continue;
    }

    // Handle Lists
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      listType = 'ul';
      inList = true;
      listItems.push(line.trim().slice(2));
      continue;
    }

    const orderedMatch = line.trim().match(/^(\d+)\.\s+(.*)$/);
    if (orderedMatch) {
      listType = 'ol';
      inList = true;
      listItems.push(orderedMatch[2]);
      continue;
    }

    // Empty lines flush lists
    if (!line.trim()) {
      flushList(`empty-${i}`);
      continue;
    }

    // Regular paragraphs
    flushList(`p-${i}`);
    elements.push(
      <p
        key={`p-${i}`}
        className="my-3 text-base leading-relaxed text-foreground/90 font-sans"
        dangerouslySetInnerHTML={{ __html: formatInline(line) }}
      />
    );
  }

  flushList('final');

  return <div className={`prose-knowra space-y-2 ${className}`}>{elements}</div>;
}
