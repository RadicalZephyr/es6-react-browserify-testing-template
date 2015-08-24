import ConsoleWrapper from "./imports/ConsoleWrapper";


var x = new ConsoleWrapper();

function hello(){
    return x.speak();
}

module.exports = hello;
