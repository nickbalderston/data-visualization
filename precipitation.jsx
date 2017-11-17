/*
  This is a script for Adobe ExtendScript Toolkit. Its purpose is to access xml data pertaining to annual precipitation
  and average temperatures in Colorado from 1917-2016, and visualize the data with a grid of circles in a 24''x36'' illustrator
  artboard. The data was retrieved from https://www.ncdc.noaa.gov/cag/. 
*/

var doc = app.activeDocument;
var p = doc.pathItems;

//The width and height (in pixels) inside my poster's margins
var inWidth = 1692;
var inHeight = 2556;

var margin = 18;

//The path for this scripts folder (also containing xml files)
var currentFolder = Folder(File($.fileName).parent).fullName; 
var file = new File(currentFolder+"/temperature.xml");
var file2 = new File(currentFolder+"/precipitation.xml");

var tempXML, precipXML;

//call functions to read 2 XML files (one with precipitation data, the other with temperature data)
readPrecipXMLFile(file2);
readTempXMLFile(file);


//loop through XML elements to set parameters of circles in a 10x10 grid.
var indexCounter = 0;
for(i = 0; i < 10; i++){
    for(j = 0; j < 10; j++){
        //get the precipitation value in the XML element associated with the current loop index (indexCounter)
        var precipAmount = precipXML.data[indexCounter].value;
        
        //map the range of precipitation values (11.85in - 25.52in) to a range of circle sizes (in pixels)
        var diameter = 78.5+(169.2-78.5)*((precipAmount-11.85)/(25.52-11.85));
        
        //use the current loop index and the diameter of the current circle to define the coordinates of the circle
        var y = (inHeight / 6 + i * inWidth / 10);
        var x = margin + j * inWidth / 10;
        var add = (inWidth/10 - diameter) / 2;
        
        
        //get the precipitation value in the XML element associated with the current loop index (indexCounter)
        var yrTemp = tempXML.data[indexCounter].value;
        
        
        //map the range of temperature values (42.5deg - 48.3deg) to a range of Hue values (in degrees using HSL spectrum)
        var hueMap = 242+(360-242)*((yrTemp-42.5)/(48.3-42.5));
        
        //set values for hue, saturation, and lightness
        var temp_hue = hueMap;
        var temp_saturation = 100;
        var temp_lightness = 40;
        
        //call color_hsl2rgb function to convert to RGB values
        var temp_rgb = color_hsl2rgb(temp_hue, temp_saturation, temp_lightness);
        
        //draw a circle using the x-coordinate, y-coordinate, and diameter defined in the current loop
        var circle = p.ellipse((y+add) * -1, x+add,diameter,diameter);
        circle.fillColor = makeColor(temp_rgb.r, temp_rgb.g, temp_rgb.b);
        
        indexCounter++;
    }
    
}

//functions to convert hue, saturation , lightness values to rgb values
//This function was retrieved from https://github.com/fabianmoronzirfas/extendscript/wiki/HSL-Color-Wheel
function color_hsl2rgb(h, s, l) {
    var m1, m2, hue;
    var r, g, b;
    s /=100;
    l /= 100;
    if (s == 0){
        r = g = b = (l * 255);
    }else {
        if (l <= 0.5){
           m2 = l * (s + 1);
        }else{
            m2 = l + s - l * s;
        }
        m1 = l * 2 - m2;
        hue = h / 360;
        r = color_HueToRgb(m1, m2, hue + 1/3);
        g = color_HueToRgb(m1, m2, hue);
        b = color_HueToRgb(m1, m2, hue - 1/3);
    }
    return {r: r, g: g, b: b};
};


function color_HueToRgb(m1, m2, hue) {
        
    var v;
    if (hue < 0){
        hue += 1;
    }else if (hue > 1){
        hue -= 1;
    }
    
    if (6 * hue < 1){
        v = m1 + (m2 - m1) * hue * 6;
    }else if (2 * hue < 1){
        v = m2;
    }else if (3 * hue < 2){
        v = m1 + (m2 - m1) * (2/3 - hue) * 6;
    }else{
        v = m1;
    }
    
    return 255 * v;
};

function makeColor(r,g,b){
    var c = new RGBColor();
    c.red   = r;
    c.green = g;
    c.blue  = b;
    return c;
}


//functions to read XML files
function readTempXMLFile(file) {  
 
        file.encoding = "UTF8";  
        file.lineFeed = "unix";  

        file.open("r");  
        var tempXMLStr = file.read();  
        file.close();  
        //$.writeln(tempXMLStr);
        return tempXML = new XML(tempXMLStr); 
}; 

function readPrecipXMLFile(file2) {  
 
        file2.encoding = "UTF8";  
        file2.lineFeed = "unix";  

        file2.open("r");  
        var precipXMLStr = file2.read();  
        file2.close();  
        //$.writeln(tempXMLStr);
        return precipXML = new XML(precipXMLStr); 
}; 
