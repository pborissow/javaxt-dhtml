if(!javaxt) var javaxt={};
if(!javaxt.dhtml) javaxt.dhtml={};

//******************************************************************************
//**  DateInput Class
//******************************************************************************
/**
 *   Simple date input field. Requires javaxt.dhtml.DatePicker.
 *
 ******************************************************************************/


javaxt.dhtml.DateInput = function(parent, config) {
    this.className = "javaxt.dhtml.DateInput";


    var me = this;
    var datePicker, menu, input, button;
    var formatDate;

    var defaultConfig = {

        label: false,
        date: null,
        showMenuOnFocus: false,

        style: {

            input: {
                color: "#363636",
                fontSize: "14px",
                height: "24px",
                lineHeight: "24px",
                padding: "0px 4px",
                verticalAlign: "middle",
                transition: "border 0.2s linear 0s, box-shadow 0.2s linear 0s",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRight: "0 none",
                boxShadow: "0 1px 1px rgba(0, 0, 0, 0.075) inset"
            },

            button: {
                color: "#363636",
                height: "24px",
                width: "24px",
                border: "1px solid #b4b4b4",
                cursor: "pointer",

                backgroundImage: "url(data:image/png;base64,iVBORw0KGgoAAAANSUh"+
                "EUgAAABAAAAAQCAYAAAAf8/9hAAAAlklEQVQ4jWNgGAUowNvbW9PBwUEAjxJGHx"+
                "8f/dDQUB4MGV9f3+TAwMD/AQEB97y8vOSxafb392+BqrlkbGzMhSLr7++/MTAw8"+
                "D8OQ+CaYdjb21sT3flKAQEBj7AYgqHZz8+vBqsHPT09ldENCQgImIysOSAgoBZP"+
                "GGEaQpJmfIYQrRmbITj9TAg4ODgIeHp6apGleegAAME5Y+rCcN+AAAAAAElFTkSuQmCC)",
                backgroundPosition: "3px 3px",
                backgroundRepeat: "no-repeat",
                backgroundColor: "#e4e4e4"
            },

            datePicker: {

            }
        },

        formatDate: function(date){
            return (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear();
        }
    };


  //**************************************************************************
  //** Constructor
  //**************************************************************************
  /** Creates a new instance of this class. */

    var init = function(){

        if (typeof parent === "string"){
            parent = document.getElementById(parent);
        }
        if (!parent) return;


      //Clone the config so we don't modify the original config object
        var clone = {};
        merge(clone, config);


      //Merge clone with default config
        merge(clone, defaultConfig);
        config = clone;


        formatDate = config.formatDate;


      //Create main div
        var mainDiv = document.createElement("div");
        mainDiv.setAttribute("desc", me.className);


      //Create table with 2 columns
        var table = createTable();
        var tbody = table.firstChild;
        var tr = document.createElement('tr');
        tbody.appendChild(tr);


      //Create input in the first column
        var td = document.createElement('td');
        td.style.width="100%";
        input = document.createElement('input');
        input.type = "text";
        me.setDate(config.date);
        setStyle(input, "input");
        input.style.width="100%";
        td.appendChild(input);
        tr.appendChild(td);

        input.onkeydown = function(e){
            if (e.keyCode===9){
                e.preventDefault();
            }
        };
        input.onkeyup = function(e){
            if (e.keyCode===9){ //tab
                me.hideMenu();
                focusNext();
            }
            else if (e.keyCode===40){ //down arrow
                me.showMenu();
            }
        };

        if (config.showMenuOnFocus){
            input.onfocus = function(){
                me.showMenu();
            };
        }




      //Create button in the second column
        td = document.createElement('td');
        button = document.createElement('input');
        button.type = "button";
        setStyle(button, "button");
        td.appendChild(button);
        tr.appendChild(td);


        button.onclick = function(){

            if (menu){
                if (menu.style.visibility === "hidden"){
                    me.showMenu();
                }
                else{
                    menu.style.visibility = "hidden";
                }
            }
            else{
                me.showMenu();
            }
        };



        mainDiv.appendChild(table);
        parent.appendChild(mainDiv);
        me.el = mainDiv;
    };


  //**************************************************************************
  //** showMenu
  //**************************************************************************
    this.showMenu = function(){
        if (datePicker){

            var date = new Date(input.value);
            if (isNaN( date.getTime() )) date = new Date();
            datePicker.setDate(date);
            menu.style.visibility = '';

        }
        else{

            var mainDiv = me.el;


            menu = document.createElement('div');
            menu.setAttribute("desc", "menu");

            menu.style.position = "absolute";
            //menu.style.visibility = "hidden";
            mainDiv.appendChild(menu);




          //Hide menu if the client clicks outside of the menu
            var hideMenu = function(e){
                if (!mainDiv.contains(e.target)){
                    menu.style.visibility = "hidden";
                }
            };
            if (document.addEventListener) { // For all major browsers, except IE 8 and earlier
                document.addEventListener("click", hideMenu);
            }
            else if (document.attachEvent) { // For IE 8 and earlier versions
                document.attachEvent("onclick", hideMenu);
            }


            var date = new Date(input.value);
            if (isNaN( date.getTime() )) date = new Date();
            datePicker = new javaxt.dhtml.DatePicker(menu, {
                date: date,
                style: config.datePicker
            });
            datePicker.select();
            datePicker.onClick = function(date){
                input.value = formatDate(date);
                menu.style.visibility = "hidden";
            };
        }
    };


  //**************************************************************************
  //** hideMenu
  //**************************************************************************
    this.hideMenu = function(){
        if (menu) menu.style.visibility = "hidden";
    };


  //**************************************************************************
  //** setDate
  //**************************************************************************
    this.setDate = function(date){
        if (date){
            if (typeof parent === "string"){
                date = new Date(date);
                if (isNaN( date.getTime() )) date = null;
            }
            else{
                if (date.getTime){
                    if (isNaN( date.getTime() )) date = null;
                }
                else{
                    date = null;
                }
            }
        }

        if (date) input.value = formatDate(date);
    };


  //**************************************************************************
  //** getDate
  //**************************************************************************
    this.getDate = this.getValue = function(){
        var date = new Date(input.value);
        if (isNaN( date.getTime() )) date = null;
        return date;
    };



  //**************************************************************************
  //** focusNext
  //**************************************************************************
  /** Used to focus on the next available form element.
   */
    var focusNext = function(){
        var form = input.form;
        if (form){
            for (var i=0; i<form.elements.length; i++){
                if (form.elements[i]===input && i<form.elements.length-2){
                    form.elements[i+2].focus();
                    return;
                }
            }
        }
    };


  //**************************************************************************
  //** Utils
  //**************************************************************************
    var merge = javaxt.dhtml.utils.merge;
    var createTable = javaxt.dhtml.utils.createTable;
    var setStyle = function(el, style){
        javaxt.dhtml.utils.setStyle(el, config.style[style]);
    };


    init();
};