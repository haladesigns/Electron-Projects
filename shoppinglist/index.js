const electron = require('electron');
const url = require('url');
const path = require('path');

const{app, BrowserWindow, Menu} =electron;

let mainWindow;
let addWindow;

//Lisen for app to be ready
app.on('ready', ()=>{
    //create new window
    mainWindow = new BrowserWindow({});
    //Load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    //Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //Insert Menu
    Menu.setApplicationMenu(mainMenu);
});

//Handle create add winddow
function createAddWindow(){
     //create new window
     addWindow = new BrowserWindow({
         width: 300,
         height:200,
         title:'Add shopping list item',
         parent: mainWindow
     });
     //Load html into window
     addWindow.loadURL(url.format({
         pathname: path.join(__dirname, 'addWindow.html'),
         protocol: 'file:',
         slashes: true
        }));
    //Garbage collection
    addWindow.on('closed', (()=>{
        addWindow = null;
    }))    
}

//Create menu template
const mainMenuTemplate =[
    {
        label: 'File',
        submenu:[
            {
                label: 'Add Item',
                click(){
                    createAddWindow();
                }
            },
            {
                label: 'Clear Items'
            },
            {
                label: 'Quit',
                accelerator:process.platform ==  'darwin' ? 'Command+Q': 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

//if on a mac add empty object to menu
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({}); //unshift dds on to begin of array
}

//Add dev tools menu item if not in prod
if(process.env.NODE_ENV != 'production'){
    mainMenuTemplate.push({
        label: 'Dev Tools',
        submenu:[
            {
                label:'Toggle DevTools',
                accelerator:process.platform ==  'darwin' ? 'Command+I': 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
                //Tools will open in the window that has the current focus
            },
            {
                role:'reload' // menu item to reload the page
            }
        ]
    })
}