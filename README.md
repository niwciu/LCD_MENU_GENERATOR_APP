# LCD Menu Generator App

A web-based tool for generating C code for LCD menu structures, designed for embedded systems. This application allows you to visually build hierarchical menus and automatically generate corresponding C header and source files.

## Features

- **Visual Menu Builder**: Drag-and-drop interface to create and manage menu hierarchies.
- **Callback Support**: Optionally generate callback functions for menu items.
- **Label Constants**: Choose to generate `static const char` definitions for all labels or only for repeated ones.
- **Code Generation**: Automatic generation of `menu.h` and `menu.c` files with proper C structures.
- **File Management**: Save and load menu configurations as JSON files.
- **Code Preview**: Real-time preview of generated C code with syntax highlighting.
- **Export Options**: Download generated code files directly.

## How to Use

1. **Add Menu Items**: Use the "+" button to add top-level menu items.
2. **Build Hierarchy**: Add sub-items to create nested menus.
3. **Configure Options**:
   - Enable callback generation if needed.
   - Choose whether to use constants for all labels.
4. **Generate Code**: Click "Generate Code" to see the C output.
5. **Save/Load**: Use save/load buttons to persist menu structures.

## Local Development

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation
```bash
npm install
```

### Running the App
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production
```bash
npm run build
```

### Testing
```bash
npm run test
```

### Linting
```bash
npm run lint
```

### Deployment to GitHub Pages
```bash
npm run deploy
```

## Project Structure

```
src/
├── components/
│   ├── MenuGeneratorApp.jsx    # Main app component
│   ├── MenuItem.jsx            # Individual menu item component
│   ├── displayCodeWindow.jsx   # Code preview component
│   ├── menuUtils.js            # Menu manipulation utilities
│   ├── codeGenerator.js        # C code generation logic
│   └── fileUtils.js            # File save/load utilities
├── assets/                     # Static assets
├── App.css                     # Main styles
├── main.jsx                    # App entry point
└── index.css                   # Global styles
```

## Generated Code Structure

The tool generates two files:

- **menu.h**: Header file with menu structure declarations
- **menu.c**: Source file with menu definitions and constants

Example output includes:
- `static const char LABEL_XXX[]` for labels
- `menu_t` structure definitions
- Callback function stubs (if enabled)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run `npm run lint` and `npm run test`
6. Submit a pull request

## Author

Created by niwciu (niwciu@gmail.com)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

