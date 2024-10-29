export function createStructure() {
    const vscode = require('vscode');
    const fs = require('fs');
    const path = require('path');
    let disposable = vscode.commands.registerCommand('extension.generateCodeStructure', function (uri: vscode.Uri) {
        // Log the folder path for debugging
        //console.log("Folder path:", uri ? uri.fsPath : "No URI provided");

        if (!uri || !uri.fsPath) {
            vscode.window.showErrorMessage('Please right-click on a folder to generate the code structure.');
            return;
        }
        const date: string = new Date().toISOString().split('T')[0];  // Formats date as YYYY-MM-DD
        const folderPath: string = uri.fsPath;

        const stats = fs.lstatSync(folderPath);
        if (!stats.isDirectory()) {
            vscode.window.showErrorMessage('The selected path is not a folder!');
            return;
        }

        // Define folder paths
        const interfaceFolder = path.join(folderPath, 'interface');
        const guiFolder = path.join(folderPath, 'gui');
        const imagesFolder = path.join(folderPath, 'images');

        // Create folders if they don't exist
        if (!fs.existsSync(interfaceFolder)) fs.mkdirSync(interfaceFolder);
        if (!fs.existsSync(guiFolder)) fs.mkdirSync(guiFolder);
        if (!fs.existsSync(imagesFolder)) fs.mkdirSync(imagesFolder);

        // Simple file creation test for debugging
        //fs.writeFileSync(path.join(folderPath, 'test.txt'), 'This is a test file.');

        // Create manager.py
        const managerContent: string = `
# By: <Your Name Here>
# Date:${date}
# Program Details: <Program Description Here>

import sys, os, contextlib
from PySide6.QtWidgets import (QStackedWidget, QApplication)
import interface.page_1

def start():
    widget.show()
    sys.exit(app.exec())

@contextlib.contextmanager
def image_gui_path():
    try:
        os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'gui'))
        yield
    finally:
        os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__))))

app = QApplication(sys.argv)
screen1 = interface.page_1.MainWindow()
list_on_screens = list(globals())
widget = QStackedWidget()
for variable_name in list_on_screens:
    if variable_name.startswith('screen'):
        value = globals()[variable_name]
        widget.addWidget(value)
widget.resize(screen1.size())
widget.setWindowTitle(screen1.windowTitle());
`;
        fs.writeFileSync(path.join(folderPath, 'manager.py'), managerContent);

        // Create page_1.py
        const page1Content: string = `
# By: <Your Name Here>
# Date: ${date}
# Program Details: <Program Description Here>

import os, sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import manager
from PySide6.QtGui import QPixmap
from PySide6.QtWidgets import QMainWindow
from gui.page_1_ui import Ui_MainWindow

if __name__ == "__main__":    
    manager.start()

class MainWindow(QMainWindow, Ui_MainWindow):
    def __init__(self, parent=None):
        super().__init__(parent)
        with manager.image_gui_path():
            self.setupUi(self)
`;
        fs.writeFileSync(path.join(interfaceFolder, 'page_1.py'), page1Content);

        // Create page_1.ui and page_1_ui.py
        const uiContent: string = `<?xml version="1.0" encoding="UTF-8"?>
<ui version="4.0">
 <class>MainWindow</class>
 <widget class="QMainWindow" name="MainWindow">
  <property name="geometry">
   <rect>
    <x>0</x>
    <y>0</y>
    <width>400</width>
    <height>300</height>
   </rect>
  </property>
  <property name="windowTitle">
   <string>Page 1</string>
  </property>
  <widget class="QWidget" name="centralwidget"/>
 </widget>
 <resources/>
 <connections/>
</ui>
`;

        const uiPyContent: string = `
# Auto-generated from page_1.ui

from PySide6.QtWidgets import QWidget

class Ui_MainWindow(object):
    def setupUi(self, MainWindow):
        MainWindow.setObjectName("MainWindow")
        MainWindow.resize(400, 300)
        self.centralwidget = QWidget(MainWindow)
        MainWindow.setCentralWidget(self.centralwidget)
`;
        fs.writeFileSync(path.join(guiFolder, 'page_1.ui'), uiContent);
        fs.writeFileSync(path.join(guiFolder, 'page_1_ui.py'), uiPyContent);

        // Show success message
        vscode.window.showInformationMessage('Code structure generated successfully!');
    });

    context.subscriptions.push(disposable);
}
