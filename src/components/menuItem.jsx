import PropTypes from "prop-types";
import { FaArrowUp, FaArrowDown, FaTrash, FaPlus } from 'react-icons/fa';
import "./menuItem.css";

const MenuItem = ({ item, onRename, onMoveUp, onMoveDown, onDelete, onAddChild, showCallbackName, parentId, onUpdateCallback }) => {
  const isEditable = item.children.length === 0;

  const handleCallbackChange = (e) => {
    onUpdateCallback(item.id, e.target.value);
  };

  return (
    <div className="menu-item-container" style={{ paddingLeft: `${item.level * 20}px` }}>
      <input
        type="text"
        value={item.displayName}
        onChange={(e) => onRename(item.id, e.target.value)}
        className="menu-item-input"
      />

      {showCallbackName && (
        <input
          type="text"
          placeholder={isEditable ? "Place callback function name..." : "Not available for parent objects"}
          disabled={!isEditable}
          className="callback-input"
          value={item.callbackName || ''}
          onChange={handleCallbackChange}
        />
      )}

      <input
        type="text"
        value={"ID: " + item.id}
        readOnly
        className="id-input"
      />

      <button
        onClick={() => onMoveUp(item.id, parentId)}
        className="menu-item-button move-up-button"
      >
        <FaArrowUp />
      </button>

      <button
        onClick={() => onMoveDown(item.id, parentId)}
        className="menu-item-button move-down-button"
      >
        <FaArrowDown />
      </button>

      <button
        onClick={() => onDelete(item.id, parentId)}
        className="menu-item-button delete-button"
      >
        <FaTrash />
      </button>

      <button
        onClick={() => onAddChild(item.id, parentId)}
        className="menu-item-button add-child-button"
      >
        <FaPlus />
      </button>
    </div>
  );
};

// ... proptypes pozostają bez zmian ...

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
