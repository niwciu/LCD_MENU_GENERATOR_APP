// fileUtils.js
// This module contains functions for saving and loading the menu structure to/from a file.

export const saveMenuToFile = (menuItems, showCallbackName, useLabelConstantsForAll) => {
    const dataToSave = {
      menuItems: menuItems,
      showCallbackName: showCallbackName, // Dodajemy stan showCallbackName do danych
      useLabelConstantsForAll: useLabelConstantsForAll // Dodajemy stan useLabelConstantsForAll do danych
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
  
  export const loadMenuFromFile = (event, setMenuItems, setShowCallbackName, setUseLabelConstantsForAll, setMenuDepth, setIdCounter, calculateDepth, getMaxIdFromItems) => {
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
        const useConstants = Boolean(data?.useLabelConstantsForAll);

        setMenuItems(menuItems);
        setShowCallbackName(showCallbackName);
        setUseLabelConstantsForAll(useConstants);

        const depth = calculateDepth(menuItems);
        setMenuDepth(depth);

        const maxId = getMaxIdFromItems(menuItems);
        setIdCounter(maxId + 1);
      } catch (error) {
        console.error('Unable to load menu: invalid file format', error);
        alert('Unable to load menu: invalid file format.');
      } finally {
        if (event.target) {
          event.target.value = '';
        }
      }
    };
    reader.readAsText(file);
  };
  