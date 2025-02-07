import PropTypes from "prop-types"; 
import { FaArrowUp, FaArrowDown, FaTrash, FaPlus } from 'react-icons/fa';

const MenuItem = ({ item, onRename, onMoveUp, onMoveDown, onDelete, onAddChild, showCallbackName, parentId, onUpdateCallback }) => {
  const isEditable = item.children.length === 0; // Jeśli obiekt nie ma dzieci, pole jest edytowalne

  // Obsługa zmiany callbacka
  const handleCallbackChange = (e) => {
    onUpdateCallback(item.id, e.target.value); // Przesyłamy nową nazwę callbacka do rodzica
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', paddingLeft: `${item.level * 20}px` }}>
      {/* Pole edycji nazwy obiektu */}
      <input
        type="text"
        value={item.displayName}
        onChange={(e) => onRename(item.id, e.target.value)}
        style={{
          fontSize: '14px',
          padding: '5px',
          flexGrow: 1,
          marginRight: '10px',
          borderRadius: '4px',
          width: '150px',
        }}
      />

      {/* Pole tekstowe z podpowiedzią */}
      {showCallbackName && (
        <input
          type="text"
          placeholder={isEditable ? "Place callback function name..." : "Not available for parent objects"}
          disabled={!isEditable} // Jeśli obiekt ma dzieci, pole jest wyłączone
          style={{
            fontSize: '13px',
            padding: '5px',
            marginRight: '10px',
            width: '250px',
            textAlign: 'left',
            border: '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: isEditable ? '' : '#000000', // Zmieniamy tło na szare, gdy pole jest wyłączone
          }}
          value={item.callbackName || ''} 
          onChange={handleCallbackChange} // Aktualizacja callbackName
        />
      )}

      {/* Wyświetlanie ID obiektu w nieedytowalnym polu */}
      <input
        type="text"
        value={"ID: " + item.id}
        readOnly
        style={{
          fontSize: '14px',
          padding: '5px',
          marginRight: '10px',
          width: '150px',
          textAlign: 'left',
          backgroundColor: '#333',
          color: '#fff',
          border: '1px solid #ddd',
          borderRadius: '4px',
        }}
      />

      {/* Przycisk przesunięcia w górę */}
      <button
        onClick={() => onMoveUp(item.id, parentId)}
        style={{
          padding: '5px 10px',
          fontSize: '16px',
          marginRight: '5px',
          cursor: 'pointer',
          borderRadius: '4px',
        }}
      >
        <FaArrowUp />
      </button>
      
      {/* Przycisk przesunięcia w dół */}
      <button
        onClick={() => onMoveDown(item.id, parentId)}
        style={{
          padding: '5px 10px',
          fontSize: '16px',
          cursor: 'pointer',
          borderRadius: '4px',
        }}
      >
        <FaArrowDown />
      </button>
      
      {/* Przycisk kosza - usuwanie obiektu */}
      <button
        onClick={() => onDelete(item.id, parentId)}
        style={{
          padding: '5px 10px',
          fontSize: '16px',
          marginLeft: '5px',
          cursor: 'pointer',
          borderRadius: '4px',
        }}
      >
        <FaTrash />
      </button>
      
      {/* Przycisk + (dodawanie podobiektu) */}
      <button
        onClick={() => onAddChild(item.id, parentId)}
        style={{
          padding: '5px 10px',
          fontSize: '16px',
          marginLeft: '5px',
          cursor: 'pointer',
          borderRadius: '4px',
        }}
      >
        <FaPlus />
      </button>
    </div>
  );
};

MenuItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    displayName: PropTypes.string.isRequired,
    level: PropTypes.number,
    callbackName: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.object)
  }).isRequired,
  onRename: PropTypes.func.isRequired,
  onMoveUp: PropTypes.func.isRequired,
  onMoveDown: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAddChild: PropTypes.func.isRequired,
  showCallbackName: PropTypes.bool,
  parentId: PropTypes.number,
  onUpdateCallback: PropTypes.func.isRequired
};

export default MenuItem;
