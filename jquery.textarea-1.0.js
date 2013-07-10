/*
 *  Project:
 *  Description:
 *  Author:
 *  License:
 */

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;
(function($, window, document, undefined) {

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "textarea",
    defaults = {
        'height': '10px',
        'progressive': false,
        'limit': 400,
        'contLimit' : '',
        'regularColor': 'green',
        'overColor': 'red',
        'alertColor': 'orange',
        'over': false,
        'alert': true,
        'alertLimit': 70,
        'counter': '',
        'bar': '',
        'barContClass': '',
        'barClass': '',
        'prepend' : '',
        'append' : '',
    };

    // The actual plugin constructor

    function Plugin(element, options) {
        this.element = element;

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {

        init: function() {
            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.options
            // you can add more functions like the one below and
            // call them like so: this.yourOtherFunction(this.element, this.options).

            //$(this.element).attr({maxlength : this.options.limit});

            //Insere o limite se o container for especificado
            if (this.options.contLimit !='') {
                $(this.options.contLimit).text(this.options.limit);
            };

            //Cria a barra e seta valores iniciais
            if (this.options.bar != '') {
                var $bar = this.newBar();
                this.appendBar($bar);
            }
            //Cria contador e seus valores iniciais
            if (this.options.counter != '') {
                this.newCounter();
            }

            //Executa a logica fora dos events de key caso o usuaroi chato de f5
            var t = $(this.element).val().length;
            this.eventsKey($bar, t);

            //Evento on click para controlar os valores, param1 parametreo param2 metodo
            var that = this;
            $(this.element).keypress(function(event) {
                // console.log(event.which);
                if(event.which >= 48){
                    var t = $(this).val().length + 1;
                    if (t > that.options.limit && that.options.over == false){
                        return false;
                    }else{
                        that.eventsKey($bar, t);
                    };
                }
            }).keyup(function(event){
                var t = $(this).val().length;
                if (event.which == 8 || event.which == 46){
                    that.eventsKey($bar, t);
                }else{
                    if(!that.options.over){
                        if(t > (that.options.limit-1)){
                            that.cutValue();
                            t = that.options.limit
                        };
                    };
                    that.eventsKey($bar, t);
                };
            });
        },
        returnInc: function(t){
            var inc = t;
            if (!this.options.progressive) {
                inc = this.options.limit - t;
            };
            if(!this.options.over){
                if(inc > this.options.limit){
                    inc = this.options.limit;
                };
                if (inc < 0) {
                    inc = 0;
                };
            }
            return inc;
        },
        eventsKey: function(bar, t){
            var inc = this.returnInc(t);
            
            if (this.options.counter != '') {
                this.actionsCounter(inc);
            };  
            if (this.options.alert) {
                this.colorAlert(t, inc);
            };
            if (this.options.bar != '') {
                this.actionsBar(bar, t, inc);
            };
        },
        appendBar: function($bar) {
            //Adiciona a barra dentro do container e seta a classe para o container
            if (this.options.barContClass != '') {
                $(this.options.bar).addClass(this.options.barContClass);
            }else {
                $(this.options.bar).css({'background-color' : '#000', 'border-radius' : '20px'});
            }
            if (this.options.barClass != '') {
                $bar.addClass(this.options.barClass);
            }else {
                $bar.css({'background-color' : '#54CDB5', 'border-radius' : '20px'});
            }
            $(this.options.bar).append($bar);
        },
        newBar: function() {
            if (this.options.progressive) {
                var tamanho = 0;
            } else {
                var tamanho = '100%';
            };
            return $('<div>').css({
                'height': this.options.height,
                'background-color': 'red',
                'width': tamanho
            });
        },
        newCounter: function() {
            if (this.options.progressive) {
                var tamanho = 0;
            } else {
                var tamanho = this.options.limit;
            };
            $(this.options.counter).text(this.options.prepend + ' ' + tamanho + ' ' + this.options.append).css({
                'color': this.options.regularColor
            });
        },
        actionsBar: function(bar, t, inc) {
            //Incrementa barra
            $(bar).stop().animate({
                'width': this.incBar(t, inc) + '%'
            }, {duration : 600, queue : false, easing : 'linear'});    
        },
        incBar: function(t, inc) {
            inc = (100 * inc) / this.options.limit;
            if (this.options.over == false){
                if(t > 100){
                    inc = 100;
                };
                if(t < 0){
                    inc = 0;
                };
            }
            return inc;
        },        
        actionsCounter: function(inc) {
            $(this.options.counter).text(this.options.prepend + ' ' + inc + ' ' + this.options.append);
        },
        cutValue: function() {
            var max = this.options.limit;
            $(this.element).val($(this.element).val().substring(0, max));
        },
        colorAlert: function(t, inc) {
            var alert = this.calcAlert();
            if (t < alert) {
                var cor = this.options.regularColor;
            } else if (t > this.options.limit) {
                var cor = this.options.overColor;
            } else {
                var cor = this.options.alertColor;
            };
            $(this.options.counter).css({
                'color': cor
            });
        },
        calcAlert: function() {
            return (this.options.limit * this.options.alertLimit) / 100;
        },
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);