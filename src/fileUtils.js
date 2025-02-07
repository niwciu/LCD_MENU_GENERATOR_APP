// fileUtils.js
// This module contains functions for saving and loading the menu structure to/from a file.

export const saveMenuToFile = (menuItems, showCallbackName) => {
    const dataToSave = {
      menuItems: menuItems,
      showCallbackName: showCallbackName // Dodajemy stan showCallbackName do danych
    };
    const blob = new Blob([JSON.stringify(dataToSave)], { type: 'application/json' });
    const fileName = prompt("Podaj nazwę pliku:", "menu_structure.json");
    if (!fileName) {
      alert("Nazwa pliku jest wymagana!");
      return;
    }
    const a = document.createElement('a');
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  export const loadMenuFromFile = (event, setMenuItems, setShowCallbackName, setMenuDepth, setIdCounter, calculateDepth, getMaxIdFromItems) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const data = JSON.parse(reader.result);
        // Ustawienie menu
        setMenuItems(data.menuItems);
        // Ustawienie stanu dla showCallbackName
        setShowCallbackName(data.showCallbackName);
        // Obliczanie głębokości po załadowaniu menu z pliku
        const depth = calculateDepth(data.menuItems);
        setMenuDepth(depth);
        // Znalezienie najwyższego ID w strukturze
        const maxId = getMaxIdFromItems(data.menuItems);
        setIdCounter(maxId + 1);
      };
      reader.readAsText(file);
    }
  };
  