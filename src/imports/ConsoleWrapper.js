class ConsoleWrapper{
    constructor(debug = false){
        this.name = 'Console wrapper!';
    }
    speak(){
        debugger;
        return "hello world";
    }
}

module.exports = ConsoleWrapper; //set what can be imported from this file
