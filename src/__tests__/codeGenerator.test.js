import { describe, it, expect } from 'vitest';
import { generateCode } from '../codeGenerator';

describe('codeGenerator', () => {
  it('generates label constants for all labels when useLabelConstantsForAll true', () => {
    const menuItems = [{ id: 'menu_1', displayName: 'Test', children: [] }];
    let code = '';

    generateCode(menuItems, 1, false, true, (c) => { code = c; }, () => {});

    expect(code).toContain('static const char LABEL_TEST[] = "Test"');
    expect(code).toContain('menu_t menu_1');
  });

  it('does not generate constant for unique label when useLabelConstantsForAll false', () => {
    const menuItems = [{ id: 'menu_1', displayName: 'Unique', children: [] }];
    let code = '';

    generateCode(menuItems, 1, false, false, (c) => { code = c; }, () => {});

    expect(code).not.toContain('LABEL_UNIQUE');
    expect(code).toContain('menu_t menu_1');
  });
});