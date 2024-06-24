//starter code
var gui = new Gui();
gui.push(new ScreenMain());
var guiManager = new GuiManager(gui, "spectral_dungeon");
guiManager.start();