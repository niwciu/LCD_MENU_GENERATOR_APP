// codeGenerator.js
// This module generates C code based on the menu structure.

export const generateCode = (menuItems, menuDepth, showCallbackName, setCode, setHeaderCode) => {
    let generatedCode = '';
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split('T')[0];
    const currentYear = currentDate.getFullYear();
    const FileDoxyMainContent =
      ' * @author LCD menu code generator app writtne by niwciu (niwciu@gmail.com)\n' +
      ' * @brief\n' +
      ' * @date ' + currentDateString + '\n' + 
      ' *\n' +
      ' * @copyright Copyright (c) ' + currentYear + '\n' + 
      ' *\n' +
      ' */\n';
  
    // Tworzenie zawartości pliku nagłówka
    let menuHeaderFileStartContent = 
      '/**\n' +
      ' * @file menu.h\n' +
      FileDoxyMainContent+
      '#ifndef _MENU_H_\n'  +
      '#define _MENU_H_\n\n'  +
      '#ifdef __cplusplus\n' +
      'extern "C"\n'  +
      '{\n' +
      '#endif /* __cplusplus */\n\n'  +
      '#include "menu_lib_type.h"\n' +
      '\n';
  
    let menuHeaderFileEndContent = '\n'+
      '/**@}*/\n' +
      '#ifdef __cplusplus\n'  +
      '}\n' +
      '#endif /* __cplusplus */\n'  +
      '#endif /* _MENU_H_ */\n';
  
    let generatedHeaderCode = menuHeaderFileStartContent + '#define MAX_MENU_DEPTH ' + menuDepth + '\n';
  
    let menuCFileStartContent = 
      '/**\n' +
      ' * @file menu.c\n' +
      FileDoxyMainContent + 
      '\n'+
      '#include "menu.h"\n'+
      '#include <stddef.h>\n\n';
  
    generatedCode = menuCFileStartContent;
  
    // Krok 1: Zliczanie wystąpień label
    const labelCounts = {};
    const countLabels = (items) => {
      items.forEach(item => {
        labelCounts[item.displayName] = (labelCounts[item.displayName] || 0) + 1;
        if (item.children && item.children.length > 0) {
          countLabels(item.children);
        }
      });
    };
    countLabels(menuItems);
  
    // Krok 2: Generowanie nazw stałych dla etykiet
    const labelConstants = {};
    Object.keys(labelCounts).forEach(label => {
      if (labelCounts[label] > 1) {
        const constantName = 'LABEL_' + label
          .toUpperCase()
          .replace(/[ąćęłńóśżźĄĆĘŁŃÓŚŻŹ]/g, (match) => {
            const map = {
              'ą': 'A', 'ć': 'C', 'ę': 'E', 'ł': 'L', 'ń': 'N', 'ó': 'O', 'ś': 'S', 'ż': 'Z', 'ź': 'Z',
              'Ą': 'A', 'Ć': 'C', 'Ę': 'E', 'Ł': 'L', 'Ń': 'N', 'Ó': 'O', 'Ś': 'S', 'Ż': 'Z', 'Ź': 'Z'
            };
            return map[match] || match;
          })
          .replace(/\.(?=\S)/g, '_')
          .replace(/ /g, '_')
          .replace(/[^A-Z0-9_]/g, '')
          .trim();
        labelConstants[label] = constantName;
      }
    });
  
    // Krok 3: Generowanie globalnych definicji etykiet
    Object.keys(labelConstants).forEach(label => {
      generatedCode += `static const char ${labelConstants[label]}[] = "${label}";\n`;
    });
  
    // Funkcja rekurencyjna do generowania deklaracji funkcji callback
    const generateCallbackDeclarations = (menuItems) => {
      if (showCallbackName) {
        menuItems.forEach((item) => {
          if (item.callbackName && !callbackDeclarations.includes(item.callbackName)) {
            callbackDeclarations.push(item.callbackName);
            generatedCode += `static void ${item.callbackName}(void);\n`;
          }
          if (item.children && item.children.length > 0) {
            generateCallbackDeclarations(item.children);
          }
        });
      }
    };
  
    // Funkcja do generowania definicji pustych callbacków
    const generateCallbackDefinitions = () => {
      callbackDeclarations.forEach((callbackName) => {
        generatedCode += `static void ${callbackName}(void) {\n\n}\n\n`;  // Zamieniamy średnik na definicję funkcji z ciałem
      });
    };

    // Funkcja rekurencyjna do generowania deklaracji menu
    const generateMenuDeclarations = (menuItems, parentId = '', indentationLevel = 1) => {
      menuItems.forEach((item, index) => {
        const indentation = '  '.repeat(indentationLevel);
        const id = parentId ? `${parentId}_${index + 1}` : `menu_${index + 1}`;
        generatedHeaderCode += `${indentation}extern menu_t ${id};\n`;
        if (item.children && item.children.length > 0) {
          generateMenuDeclarations(item.children, id, indentationLevel + 1);
        }
      });
    };
  
    // Funkcja rekurencyjna do generowania definicji menu
    const generateMenuDefinitions = (menuItems, parentId = '', indentationLevel = 0) => {
      menuItems.forEach((item, index) => {
        const id = parentId ? `${parentId}_${index + 1}` : `menu_${index + 1}`;
        const nextId = index < menuItems.length - 1 ? `${parentId ? parentId : 'menu'}_${index + 2}` : 'NULL';
        const prevId = index > 0 ? `${parentId ? parentId : 'menu'}_${index}` : 'NULL';
        const childId = item.children && item.children.length > 0 ? `${id}_1` : 'NULL';
        const parentIdValue = parentId ? parentId : 'NULL';
        const callbackValue = item.callbackName ? item.callbackName : 'NULL';
  
        const labelValue = labelConstants[item.displayName] 
          ? labelConstants[item.displayName] 
          : `"${item.displayName}"`;
  
        const indentation = '  '.repeat(indentationLevel);
        generatedCode += `${indentation}menu_t ${id} = { ${labelValue}, `;
        generatedCode += `${nextId !== 'NULL' ? `&${nextId}` : 'NULL'}, `;
        generatedCode += `${prevId !== 'NULL' ? `&${prevId}` : 'NULL'}, `;
        generatedCode += `${childId !== 'NULL' ? `&${childId}` : 'NULL'}, `;
        generatedCode += `${parentIdValue !== 'NULL' ? `&${parentIdValue}` : 'NULL'}, `;
        generatedCode += `${callbackValue !== 'NULL' ? callbackValue : 'NULL'} };\n`;
  
        if (item.children && item.children.length > 0) {
          generateMenuDefinitions(item.children, id, prevId, indentationLevel + 1);
        }
      });
    };
  
    // 1. Generowanie deklaracji funkcji callback
    let callbackDeclarations = [];
    if (generatedCode) {
      generatedCode += '\n';
    }
    generateCallbackDeclarations(menuItems);
  
    // 3. Generowanie deklaracji dla menu
    if (generatedHeaderCode) {
      generatedHeaderCode += '\n';
    }
    generateMenuDeclarations(menuItems);
  
    generatedHeaderCode += menuHeaderFileEndContent;
  
    // 4. Generowanie definicji dla menu
    if (generatedCode) {
      generatedCode += '\n';
    }
    generateMenuDefinitions(menuItems);
    
    // 2. Generowanie definicji pustych callbacków
    if (generatedCode) {
        generatedCode += '\n';
    }
    generateCallbackDefinitions();  // Tu dodajemy definicje callbacków
  
    // Ustawienie wygenerowanego kodu w stanach
    setCode(generatedCode);
    setHeaderCode(generatedHeaderCode);
};
