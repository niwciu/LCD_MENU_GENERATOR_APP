import { useState } from "react";
import PropTypes from "prop-types"; 
import { Clipboard, Download } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import vscDarkPlus from "react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus";


const DisplayCodeWindow = ({ code, fileName }) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // Stan do zarządzania rozwijaniem kodu

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Funkcja do rozwijania lub zwijania kodu
  const toggleCodeExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  // Ograniczenie kodu do kilku linii, jeśli nie jest rozwinięty
  const previewCode = isExpanded ? code : code.substring(0, 200); // Zmieniamy liczbę na pożądaną ilość linii

  // Sprawdzanie, czy kod jest dłuższy niż podgląd
  const isCodeLongerThanPreview = code.length > 200;

  // Funkcja do pobierania pliku
  const handleDownloadFile = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  return (
    <div
      style={{
        marginTop: "20px",
        backgroundColor: "#282C34",
        padding: "16px",
        borderRadius: "8px",
        position: "relative",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <h3 style={{ color: "#fff", margin: 0, fontSize: "16px" }}>
          {fileName || "menu.c"}
        </h3>
        <div style={{ display: "flex", gap: "10px" }}>
          {/* Ikona kopiowania */}
          <button
            onClick={handleCopyCode}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
            title={copied ? "Skopiowano!" : "Kopiuj kod"}
          >
            <Clipboard color={copied ? "#4CAF50" : "#bbb"} size={20} />
          </button>

          {/* Ikona pobierania pliku */}
          <button
            onClick={handleDownloadFile}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
            title="Pobierz plik"
          >
            <Download color="#bbb" size={20} />
          </button>
        </div>
      </div>

      {/* Kontener na kod z gradientem na dole */}
      <div
        style={{
          position: "relative",
          maxHeight: isExpanded ? "none" : "300px", // Zmieniamy wysokość, jeśli kod jest rozwinięty
          overflowY: isExpanded ? "auto" : "hidden", // Ukrywamy nadmiar, jeśli nie jest rozwinięty
        }}
      >
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

        {/* Gradient na dole sugerujący dłuższy kod */}
        {isCodeLongerThanPreview && !isExpanded && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "100px",
              background: "linear-gradient(to bottom, rgba(40, 44, 52, 0) 0%, rgba(40, 44, 52, 1) 100%)",
              pointerEvents: "none", // Umożliwienie interakcji z kodem
            }}
          ></div>
        )}
      </div>

      {/* Przycisk rozwijania kodu */}
      <button
        onClick={toggleCodeExpansion}
        style={{
          background: "none",
          border: "none",
          color: "#4CAF50",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        {isExpanded ? "Hide Code" : "Show Whole Code"}
      </button>
    </div>
  );
};

// **Dodaj walidację propTypes**
DisplayCodeWindow.propTypes = {
  code: PropTypes.string.isRequired,  // `code` musi być stringiem i jest wymagany
  fileName: PropTypes.string          // `fileName` jest opcjonalnym stringiem
};

export default DisplayCodeWindow;
