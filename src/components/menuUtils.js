// menuUtils.js
// This module contains utility functions for manipulating the menu structure.

export const updateCallbackRecursively = (items, id, callbackName) => {
    return items.map(item => {
      if (item.id === id) {
        return { ...item, callbackName };
      }
      if (item.children && item.children.length > 0) {
        return { ...item, children: updateCallbackRecursively(item.children, id, callbackName) };
      }
      return item;
    });
  };
  
  export const updateItemName = (items, id, newName) => {
    return items.map(item => {
      if (item.id === id) {
        return { ...item, displayName: newName };
      }
      if (item.children && item.children.length > 0) {
        return { ...item, children: updateItemName(item.children, id, newName) };
      }
      return item;
    });
  };
  
  export const calculateDepth = (items) => {
    let depth = 0;
    const calculate = (items, level) => {
      items.forEach(item => {
        depth = Math.max(depth, level + 1); // Dodajemy +1, ponieważ poziom 0 jest już dla samego obiektu głównego
        if (item.children && item.children.length > 0) {
          calculate(item.children, level + 1);
        }
      });
    };
    calculate(items, 0);
    return depth;
  };
  
  export const moveItemAtTopLevel = (items, id, direction) => {
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return items;
    const newItems = [...items];
    if (direction === 'up' && index > 0) {
      const [movedItem] = newItems.splice(index, 1);
      newItems.splice(index - 1, 0, movedItem);
    } else if (direction === 'down' && index < newItems.length - 1) {
      const [movedItem] = newItems.splice(index, 1);
      newItems.splice(index + 1, 0, movedItem);
    }
    return newItems;
  };
  
  export const moveItemWithParent = (items, id, parentId, direction) => {
    return items.map(item => {
      if (item.id === parentId) {
        const index = item.children.findIndex(child => child.id === id);
        if (index === -1) return item;
        const newChildren = [...item.children];
        if (direction === 'up' && index > 0) {
          const [movedItem] = newChildren.splice(index, 1);
          newChildren.splice(index - 1, 0, movedItem);
        } else if (direction === 'down' && index < newChildren.length - 1) {
          const [movedItem] = newChildren.splice(index, 1);
          newChildren.splice(index + 1, 0, movedItem);
        }
        return { ...item, children: newChildren };
      }
      if (item.children && item.children.length > 0) {
        return { ...item, children: moveItemWithParent(item.children, id, parentId, direction) };
      }
      return item;
    });
  };
  
  export const deleteItem = (items, id, parentId) => {
    return items.filter(item => {
      // Jeśli parentId jest null, usuwamy element z głównej listy
      if (parentId === null) {
        return item.id !== id;
      }
      // Jeśli element należy do danego rodzica, usuwamy go z jego dzieci
      if (item.id === parentId) {
        item.children = item.children.filter(child => child.id !== id);
      }
      if (item.children && item.children.length > 0) {
        item.children = deleteItem(item.children, id, parentId);
      }
      return true;
    });
  };
  
  export const addItem = (items, parentId, newItem) => {
    return items.map(item => {
      if (item.id === parentId) {
        return { ...item, children: [...item.children, newItem] };
      }
      if (item.children && item.children.length > 0) {
        return { ...item, children: addItem(item.children, parentId, newItem) };
      }
      return item;
    });
  };
  
  export const findItemById = (items, id) => {
    for (let item of items) {
      if (item.id === id) return item;
      if (item.children && item.children.length > 0) {
        const found = findItemById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };
  
  export const getMaxIdFromItems = (items) => {
    let maxId = 0;
    items.forEach(item => {
      const numericId = parseInt(item.id.split('_')[1], 10);
      maxId = Math.max(maxId, numericId);
      if (item.children && item.children.length > 0) {
        maxId = Math.max(maxId, getMaxIdFromItems(item.children));
      }
    });
    return maxId;
  };
  
  export const resetIds = (items, level = 1) => {
    let newIdCounter = 1;
    return items.map(item => {
      const newId = `menu_${level}_${newIdCounter}`;
      const newItem = { ...item, id: newId, children: [] };
      newIdCounter++;
      if (item.children && item.children.length > 0) {
        newItem.children = resetIds(item.children, level + 1);
      }
      return newItem;
    });
  };
  