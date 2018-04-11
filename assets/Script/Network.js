var netSingle = (function(){
    var unique;
    function getInstance(){
        if(unique === undefined){
            unique = new Construct();
        }
        return unique;
    }
    function Construct(){

    }
    return {
        getInstance : getInstance
    }
})();