import { describe, it, expect } from 'vitest';
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
  resetIds,
} from '../menuUtils';

describe('menuUtils', () => {
  const baseMenu = [
    { id: 'menu_1', displayName: 'A', children: [{ id: 'menu_1_1', displayName: 'A1', children: [] }] },
    { id: 'menu_2', displayName: 'B', children: [] },
  ];

  it('calculateDepth returns correct value', () => {
    expect(calculateDepth(baseMenu)).toBe(2);
  });

  it('updateCallbackRecursively sets callback by id', () => {
    const updated = updateCallbackRecursively(baseMenu, 'menu_1', 'cb1');
    expect(updated[0].callbackName).toBe('cb1');
  });

  it('updateItemName updates displayName', () => {
    const updated = updateItemName(baseMenu, 'menu_2', 'B2');
    expect(updated[1].displayName).toBe('B2');
  });

  it('moveItemAtTopLevel reorders items up and down', () => {
    const moved = moveItemAtTopLevel(baseMenu, 'menu_2', 'up');
    expect(moved[0].id).toBe('menu_2');
    const movedBack = moveItemAtTopLevel(moved, 'menu_2', 'down');
    expect(movedBack[1].id).toBe('menu_2');
  });

  it('moveItemWithParent works on nested children', () => {
    const nestedMenu = [{ id: 'menu_1', displayName: 'A', children: [{ id: 'menu_1_1', displayName: 'A1', children: [] }, { id: 'menu_1_2', displayName: 'A2', children: [] }] }];
    const moved = moveItemWithParent(nestedMenu, 'menu_1_2', 'menu_1', 'up');
    expect(moved[0].children[0].id).toBe('menu_1_2');
  });

  it('deleteItem removes child by id', () => {
    const deleted = deleteItem(baseMenu, 'menu_1_1', 'menu_1');
    expect(deleted[0].children.length).toBe(0);
  });

  it('addItem inserts nested item', () => {
    const added = addItem(baseMenu, 'menu_1', { id: 'menu_1_2', displayName: 'A2', children: [] });
    expect(added[0].children.length).toBe(2);
  });

  it('findItemById finds nested item', () => {
    const found = findItemById(baseMenu, 'menu_1_1');
    expect(found.displayName).toBe('A1');
  });

  it('getMaxIdFromItems returns correct max ID token', () => {
    expect(getMaxIdFromItems(baseMenu)).toBe(2);
  });

  it('resetIds returns normalized ids', () => {
    const reset = resetIds(baseMenu);
    expect(reset[0].id).toBe('menu_1_1');
    expect(reset[0].children[0].id).toBe('menu_2_1');
  });
});