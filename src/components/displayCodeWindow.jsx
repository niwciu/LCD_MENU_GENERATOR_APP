import { useState } from "react";
import PropTypes from "prop-types";
import { Clipboard, Download } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import vscDarkPlus from "react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus";
import "./displayCodeWindow.css";

const DisplayCodeWindow = ({ code, fileName }) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const toggleCodeExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const previewCode = isExpanded ? code : code.substring(0, 200);
  const isCodeLongerThanPreview = code.length > 200;

  const handleDownloadFile = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  return (
    <div className="code-window-container">
      <div className="code-window-header">
        <h3 className="code-window-title">
          {fileName || "menu.c"}
        </h3>
        <div className="code-window-actions">
          <button
            onClick={handleCopyCode}
            className="code-window-button"
            title={copied ? "Skopiowano!" : "Kopiuj kod"}
          >
            <Clipboard color={copied ? "#4CAF50" : "#bbb"} size={20} />
          </button>

          <button
            onClick={handleDownloadFile}
            className="code-window-button"
            title="Pobierz plik"
          >
            <Download color="#bbb" size={20} />
          </button>
        </div>
      </div>

      <div className={`code-window-content ${isExpanded ? 'code-window-content-expanded' : ''}`}>
        <SyntaxHighlighter
          language="c"
          style={vscDarkPlus}
          showLineNumbers
          customStyle={{
            borderRadius: "4px",
            padding: "12px",
            fontSize: "14px",
          }}
        >
          {previewCode}
        </SyntaxHighlighter>

        {isCodeLongerThanPreview && !isExpanded && (
          <div className="code-window-gradient"></div>
        )}
      </div>

      <button
        onClick={toggleCodeExpansion}
        className="code-window-toggle-button"
      >
        {isExpanded ? "Hide Code" : "Show Whole Code"}
      </button>
    </div>
  );
};

DisplayCodeWindow.propTypes = {
  code: PropTypes.string.isRequired,
  fileName: PropTypes.string
};

export default DisplayCodeWindow;