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
import './MenuGeneratorApp.css';

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
    <div className="app-container">
      <header className="app-header">
        <h2 className="header-title">Menu Generator</h2>
        <div className="header-controls-container">
          <div className="header-controls-group">
            <h3 style={{ margin: 0, paddingLeft: '20px' }}>MENU</h3>
            <button
              onClick={addMenuItem}
              className="menu-add-button">
              <FaPlus />
            </button>
          </div>

          <div className="header-controls-group">
            <button onClick={() => saveMenuToFile(menuItems, showCallbackName)} className="icon-button">
              <FaSave />
            </button>

            <input type="file" onChange={(e) => loadMenuFromFile(e, setMenuItems, setShowCallbackName, setMenuDepth, setIdCounter, calculateDepth, getMaxIdFromItems)}
              style={{ display: 'none' }}
              id="file-input"
            />
            <button onClick={() => document.getElementById('file-input').click()} className="icon-button">
              <FaFolderOpen />
            </button>

            <button onClick={resetMenuIds} className="icon-button">
              <FaEdit />
            </button>
          </div>

          <div className="callback-toggle-container">
            <input type="checkbox" checked={showCallbackName} onChange={toggleCallbackNameVisibility} id="callback-toggle" />
            <label htmlFor="callback-toggle" className="callback-toggle-label">
              Enable menu items execute callback generation
            </label>
          </div>
        </div>
      </header>

      <div className="main-content">
        <div className="menu-items-container">
          {renderMenuItems(menuItems)}
        </div>
        <div className="depth-display">
          <h4 className="code-preview-title">MAX MENU DEPTH: {menuDepth}</h4>
        </div>
        <div className="code-preview-container">
          <h2>Code Preview</h2>
          <DisplayCodeWindow code={menuHeaderCode} fileName="menu.h" />
          <DisplayCodeWindow code={code} fileName="menu.c" />
        </div>
      </div>
    </div>
  );
};

export default MenuGeneratorApp;
