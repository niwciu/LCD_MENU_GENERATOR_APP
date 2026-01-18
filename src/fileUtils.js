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
    const file = event.target?.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        const menuItems = Array.isArray(data?.menuItems) ? data.menuItems : [];
        const showCallbackName = Boolean(data?.showCallbackName);

        // Ustawienie menu
        setMenuItems(menuItems);
        // Ustawienie stanu dla showCallbackName
        setShowCallbackName(showCallbackName);
        // Obliczanie głębokości po załadowaniu menu z pliku
        const depth = calculateDepth(menuItems);
        setMenuDepth(depth);
        // Znalezienie najwyższego ID w strukturze
        const maxId = getMaxIdFromItems(menuItems);
        setIdCounter(maxId + 1);
      } catch (error) {
        console.error('Nie udało się wczytać pliku JSON:', error);
        alert("Nieprawidłowy format pliku JSON.");
      } finally {
        if (event.target) {
          event.target.value = '';
        }
      }
    };
    reader.readAsText(file);
  };
  
