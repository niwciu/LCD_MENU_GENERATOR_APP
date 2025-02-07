// MenuGeneratorApp.jsx
import { useState } from 'react';
import { FaSave, FaFolderOpen, FaPlus, FaEdit } from 'react-icons/fa';
import DisplayCodeWindow from './displayCodeWindow';
import MenuItem from './menuItem';
import { generateCode } from './codeGenerator';
import { 
  updateCallbackRecursively, 
  updateItemName, 
  calculateDepth, 
  moveItemAtTopLevel, 
  moveItemWithParent, 
  deleteItem, 
  addItem, 
  findItemById, 
  getMaxIdFromItems, 
} from './menuUtils';
import { saveMenuToFile, loadMenuFromFile } from './fileUtils';

const MenuGeneratorApp = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [idCounter, setIdCounter] = useState(1);  // Licznik dla unikalnych ID
  const [menuDepth, setMenuDepth] = useState(0); // Głębokość menu
  const [showCallbackName, setShowCallbackName] = useState(false); // Stan dla globalnego checkboxa
  const [code, setCode] = useState(""); // Przykładowy kod w C
  const [menuHeaderCode, setHeaderCode] = useState(""); // Przykładowy kod w C
  
  // Funkcja do zmiany stanu checkboxa
  const toggleCallbackNameVisibility = () => {
    setShowCallbackName(prevState => !prevState);
  };

  const handleGenerateCode = () => {
    generateCode(menuItems, menuDepth, showCallbackName, setCode, setHeaderCode);
  };

  const handleCallbackChange = (id, callbackName) => {
    const updatedMenuItems = updateCallbackRecursively(menuItems, id, callbackName);
    setMenuItems(updatedMenuItems);
  };

  const recalcDepth = (items) => {
    return calculateDepth(items);
  };

  // Funkcja do dodawania nowego obiektu (głównego)
  const addMenuItem = () => {
    const newItem = { id: `menu_${idCounter}`, displayName: `menu_${idCounter}`, level: 0, children: [] };
    const updatedItems = [...menuItems, newItem];
    setMenuItems(updatedItems);
    setIdCounter(idCounter + 1);
    setMenuDepth(recalcDepth(updatedItems));
  };

  // Funkcja do zmiany nazwy obiektu (tylko zmienia widoczną nazwę)
  const renameMenuItem = (id, newName) => {
    const updatedItems = updateItemName(menuItems, id, newName);
    setMenuItems(updatedItems);
    setMenuDepth(recalcDepth(updatedItems));
  };

  // Funkcje do przesuwania obiektu
  const moveUp = (id, parentId) => {
    let updatedItems;
    if (parentId === null) {
      updatedItems = moveItemAtTopLevel(menuItems, id, 'up');
    } else {
      updatedItems = moveItemWithParent(menuItems, id, parentId, 'up');
    }
    setMenuItems(updatedItems);
    setMenuDepth(recalcDepth(updatedItems));
  };

  const moveDown = (id, parentId) => {
    let updatedItems;
    if (parentId === null) {
      updatedItems = moveItemAtTopLevel(menuItems, id, 'down');
    } else {
      updatedItems = moveItemWithParent(menuItems, id, parentId, 'down');
    }
    setMenuItems(updatedItems);
    setMenuDepth(recalcDepth(updatedItems));
  };

  // Funkcja do usuwania obiektu
  const deleteMenuItem = (id, parentId) => {
    const updatedItems = deleteItem(menuItems, id, parentId);
    setMenuItems(updatedItems);
    setMenuDepth(recalcDepth(updatedItems));
  };

  // Funkcja pomocnicza do dodawania podobiektu
  const addChildMenuItem = (parentId) => {
    const parentItem = findItemById(menuItems, parentId);
    if (parentItem) {
      const childId = `${parentItem.id}_${parentItem.children.length + 1}`;
      const childItem = { id: childId, displayName: childId, level: parentItem.level + 1, children: [] };
      const updatedItems = addItem(menuItems, parentId, childItem);
      setMenuItems(updatedItems);
      setMenuDepth(recalcDepth(updatedItems));
    }
  };

  // Funkcja resetująca ID w całym menu z zachowaniem hierarchii
  const resetMenuIds = () => {
    let counter = 1;
    const updateIdsRecursively = (items, parentId = '') => {
      return items.map((item, index) => {
        const newId = parentId ? `${parentId}_${index + 1}` : `menu_${counter++}`;
        const updatedItem = { ...item, id: newId };
        if (updatedItem.children && updatedItem.children.length > 0) {
          updatedItem.children = updateIdsRecursively(updatedItem.children, newId);
        }
        handleGenerateCode();
        return updatedItem;
      });
    };
    const updatedMenuItems = updateIdsRecursively(menuItems);
    setMenuItems(updatedMenuItems);
  };

  // Funkcja rekurencyjna do renderowania elementów menu
  const renderMenuItems = (items, parentId = null) => {
    return items.map(item => (
      <div key={item.id}>
        <MenuItem
          item={item}
          parentId={parentId}
          onRename={renameMenuItem}
          onMoveUp={moveUp}
          onMoveDown={moveDown}
          onDelete={deleteMenuItem}
          onAddChild={addChildMenuItem}
          showCallbackName={showCallbackName}
          onUpdateCallback={handleCallbackChange}
        />
        {item.children && item.children.length > 0 && (
          <div style={{ marginLeft: '20px' }}>
            {renderMenuItems(item.children, item.id)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Stały nagłówek */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          backgroundColor: '#282828',
          padding: '10px 20px',
          zIndex: 1000,
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h2 style={{ marginBottom: '10px' }}>Menu Generator</h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          {/* Przycisk dodawania menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ margin: 0, paddingLeft: '20px' }}>MENU</h3>
            <button 
              onClick={addMenuItem} 
              style={{
                padding: '5px 10px',
                fontSize: '16px',
                marginLeft: '5px',
                cursor: 'pointer',
                borderRadius: '4px',
                marginRight: '20px'
              }}>
              <FaPlus />
            </button>
          </div>
          {/* Przycisk zapisu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={() => saveMenuToFile(menuItems, showCallbackName)} 
              style={{
                padding: '5px 10px',
                fontSize: '20px',
                marginLeft: '10px',
                cursor: 'pointer',
                borderRadius: '50%',
                border: '2px solid #4CAF50',
                backgroundColor: '#fff',
                color: '#4CAF50',
              }}>
              <FaSave />
            </button>
            {/* Przycisk wczytywania */}
            <input type="file" onChange={(e) => loadMenuFromFile(e, setMenuItems, setShowCallbackName, setMenuDepth, setIdCounter, calculateDepth, getMaxIdFromItems)} style={{ display: 'none' }} id="file-input" />
            <button onClick={() => document.getElementById('file-input').click()} 
              style={{
                padding: '5px 10px',
                fontSize: '20px',
                marginLeft: '10px',
                cursor: 'pointer',
                borderRadius: '50%',
                border: '2px solid #4CAF50',
                backgroundColor: '#fff',
                color: '#4CAF50',
              }}>
              <FaFolderOpen />
            </button>
            {/* Przycisk resetu ID */}
            <button onClick={resetMenuIds} 
              style={{
                padding: '5px 10px',
                fontSize: '20px',
                marginLeft: '10px',
                cursor: 'pointer',
                borderRadius: '50%',
                border: '2px solid #4CAF50',
                backgroundColor: '#fff',
                color: '#4CAF50',
              }}>
              <FaEdit />
            </button>
          </div>
          {/* Globalny checkbox */}
          <div style={{ paddingLeft: '20px' }}>
            <input type="checkbox" checked={showCallbackName} onChange={toggleCallbackNameVisibility} id="callback-toggle" />
            <label htmlFor="callback-toggle" style={{ marginLeft: '5px' }}>
              Enable menu items execute callback generation
            </label>
          </div>
        </div>
      </header>
      {/* Główna zawartość strony */}
      <div style={{ padding: '140px 20px 20px' }}>
        <div style={{ paddingLeft: '40px' }}>
          {renderMenuItems(menuItems)}
        </div>
        <div style={{ padding: '20px' }}>
          <h4 style={{ margin: '0' }}>MAX MENU DEPTH: {menuDepth}</h4>
        </div>
        <div style={{ flex: '2', padding: '20px', textAlign: 'left' }}>
          <h2>Code Preview</h2>
          <DisplayCodeWindow code={menuHeaderCode} fileName="menu.h"/>
          <DisplayCodeWindow code={code} fileName="menu.c"/>
        </div>
      </div>
    </div>
  );
};

export default MenuGeneratorApp;
