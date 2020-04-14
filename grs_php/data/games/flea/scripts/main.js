//starter code
var gui = new Gui();
gui.push(new ScreenMain());
var guiManager = new GuiManager(gui, "flea");
guiManager.start();