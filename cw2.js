
//graph utils
function to_circle(radius,nodes) {
    radius = (radius+1)*100;

    //radius = radius * radius;
    var n = nodes.length;
    var nodes = _.sortBy(nodes, 'size');
    var alpha = (Math.PI * 2)/n;
    for(var i = 0; i < n; i++) {
        var theta = alpha * i;
        nodes[i].x = Math.cos( theta ) * radius;
        nodes[i].y = Math.sin( theta ) * radius;
    }
    return nodes;
}

Array.prototype.insert = function(index, item) {
    this.splice(index, 0, item);
}

function updateSlider(slider, newOptions){
    var settings = $.extend({}, newOptions);

    return slider.empty().noUiSlider(settings);
}


function inverserank(lst){
    total = _.reduce(lst, function(memo, num) { return memo + num; }, 0);
    newlst = _.map(lst, function(each){
        return total/each;
    })
    return newlst
};

function parseUtc(utc){
    return new Date(utc);
};

//knockout things
function to_c3(groupbykey,nodes) {
    var groups = _.groupBy(nodes, function(node){return node[groupbykey]});
    console.log('groups!:', groups);
    var lst = [];
    if(Object.keys(groups).length<50){


        Object.keys(groups).forEach(function(g) {
            var tmp = [];
            tmp.push(g);
            //for(var i = 0; i < groups[g].length; i++) {
            tmp.push(groups[g].length);
            //}
            lst.push(tmp);
        });
        console.log('this was the list:');
        console.log(lst);
        var t={};
        t['columns']=lst;
        return t;
    } else {
        //toast

        toast('chart expects < 50 categories. '+groupbykey+' had '+Object.keys(groups).length+' possible');
        console.log('too many classes to chart effectively:',Object.keys(groups).length)
    }
};

function ModalPopup() {
    var self = this;
    self.textitem = ko.observable('blah');
    self.selectedItem = ko.observable(null);
    self.newScheme = function(){
        console.log('calling graph to apply new scheme!');
    };
};

function IconDropdownWidget() {
    var self = this;
    self.operator= ko.observable();
    self.selected= ko.observable('');
    self.active = ko.observable(false);
    self.subselection= ko.observable('');
    self.selectedIcon = ko.observable('');
    self.lastattribute = [];
    self.lastsubselection = [];
    self.states = [];
    //self.lastfilter = ko.observable(null);

    self.active.subscribe(function(){
        self.states.push(self.active());

        console.log('states:',self.states);
        self.eyeSwitcher();
    });


    self.selected.subscribe(function(){
        //self.ftoggleFilterGroup();
        if(self.active()==true){
            self.ftoggleIconGroup();
        }
    });



    self.selectedIcon.subscribe(function(){
        //var lastattr = self.lastattribute[self.lastattribute.length];
        //var lastsub = self.subselection[self.subselection.length];
        if(self.active()==true){
            self.ftoggleIconGroup();
        }

        //self.ftoggleIconGroup();
        //graph.applynodeicons(self.selected(),self.subselection(), self.selectedIcon(),lastattr,lastsub);
    });

    self.subselection.subscribe(function(){
        if(self.active()==true){
            self.ftoggleIconGroup();
        }
        //self.ftoggleFilterGroup();
    });

    self.eyeSwitcher = function() {
        if(self.active()==true){
            console.log('eye-open');
            return 'eye-open'
        } else {
            if(self.active()==false){
            console.log('eye-closed');
            return 'eye-closed'
             }
        }
    };

    self.ftoggleIconGroup = function() {

        //activestate,nodeattribute,subselection, minmax
        var lastattr = self.lastattribute[self.lastattribute.length];
        var lastsub = self.subselection[self.subselection.length];
        self.lastattribute.push(self.selected());
        self.lastsubselection.push(self.subselection());

        if(self.active()==true) {
            self.active(false);

            graph.toggleIconGroup(false,self.selected(),self.subselection(), self.selectedIcon(), lastattr, lastsub);
            //graph.toggleIconGroup();
        } else {
        if(self.active()==false){
            self.active(true);
            graph.toggleIconGroup(true,self.selected(),self.subselection(), self.selectedIcon(), lastattr, lastsub);
            //graph.toggleIconGroup();
        }}
    };
};

function ModalOptionGroup(label, optiongrp) {
    console.log('recevied label:', label);
    console.log('and optgroup:', optiongrp);
    self.label = ko.observable(label);
    self.optiongrp = ko.observableArray(optiongrp);
    self.modal_selected_optiongrp = ko.observable();
};

ko.bindingHandlers.option = {
    update: function(element, valueAccessor){
        var value = ko.utils.unwrapObservable(valueAccessor());
        ko.selectExtensions.writeValue(element, value);

    }
};

function Group(label, children) {
    this.label = ko.observable(label);
    this.children = ko.observableArray(children);
};

function CustomOptionGroup(label,categories,callback) {
    console.log('making custom option group:', label, categories);
    var self = this;
    self.control_type = ko.observable('option_groups');
    self.label = ko.observable(label);
    self.groups = ko.observableArray([]);
    graph.groups.subscribe(function(){

        grps = graph.onlyshowgroups(categories);
        self.groups(grps);
    });
    self.selectedOption = ko.observable();

    if((typeof callback)=="function"){
        //console.log('suscribing to selectedoption')
        self.selectedOption.subscribe(function(){
            callback(self.selectedOption().label())
        });
    }
};

function COption(label, property) {
    this.label = ko.observable(label);
    this.someOtherProperty = ko.observable(property);
};


function Option(label, property) {
    this.label = ko.observable(label);
    this.someOtherProperty = ko.observable(property);
};

function AccordionWidget(title, sub_accordion_widgets) {
    this.title = ko.observable(title);
    this.sub_accordion_widgets = ko.observableArray(
        _.map(sub_accordion_widgets, function(saw){
            return new SubAccordionWidget(saw);
        })
    );
    $('.collapsible').collapsible({ accordion: false });
    $('select').material_select();

};

function fileUploader(label){
    self.label = ko.observable(label);
    self.filepath = ko.observable();
    self.control_type = ko.observable('fileinput');

    self.filepath.subscribe(function(){
        self.upload();
    });
    /*
    self.upload = function(){
        //graph.read_json(self.)
        graph.read_json(self.filepath());
    }*/

    self.upload = function(){
        //console.log(evt);
        /*
        var reader = new FileReader();
        reader.onload = function(theFile) {
            return function(e){
                console.log(e);
            }
        };
        console.log(self.filepath());
        console.log(reader.readAsDataURL(self.filepath()));
        */
        loadJSONFile();
    };
};

function textInput(label,cb,visiblecb){
    var self = this;
    self.label = ko.observable(label);
    self.textvalue = ko.observable();
    self.control_type = ko.observable('textinput');
    self.show = ko.observable(true);
    if(visiblecb){
        //console.log('had visible cb:', visiblecb, visiblecb());
        visiblecb.subscribe(function(){
            //console.log('visibility status should change!');
            self.show(visiblecb());
        });
    } else {
        console.log('had no visible cb:', visiblecb);
    }
};


function loadJSONFile() {
    var file = document.querySelector('input[type=file]').files[0];
    var reader = new FileReader();
    reader.addEventListener("load", function() {
        //alert(reader.result);
        JSONtoGraph(reader.result, graph.s, function() {
            graph.populate_node_props();
            graph.totalNodes(graph.s.graph.nodes().length);
            graph.totalEdges(graph.s.graph.edges().length);
        });
        //self.refresh_widgets();
        graph.s.refresh();
        graph.loadingStatus('progress-complete');
    }, false);

    if (file) {
        reader.readAsText(file);
    }
}


function JSONtoGraph(blob,sig,callback){
    gg = JSON.parse(blob);

    graph.matrix = gg.matrix;
    if (_.contains(Object.keys(gg),'edges')==false) {
        gg['edges'] = gg.links;
        delete gg['links'];
    };

    var nodes = gg['nodes'];
    var firstnode = nodes[0];
    var firstkeys = Object.keys(firstnode);
    if (_.contains(firstkeys,'id')==false) {
        var cntr=0;
        _.each(nodes, function(node) {
            node['id'] = 'n'+cntr;
            cntr = cntr+1;
        });
    };

    if (_.contains(firstkeys,'x')==false) {
        var found = '';
        _.each(firstkeys, function(key) {
            if(key.toLowerCase().startsWith('x') && _.isNumber(firstnode[key])){
                found = key;
            }
        });
        if(found !==''){
            _.each(nodes, function(node) {
                node['x']=node[found];
            });
        } else {
            _.each(nodes, function(node) {
                if (_.contains(Object.keys(node),'x')==false) {
                    node['x']=0;
                }
            });

        }
    };
    if (_.contains(firstkeys,'y')==false) {
        var found = '';
        _.each(firstkeys, function(key) {
            if(key.toLowerCase().startsWith('y') && _.isNumber(firstnode[key])){
                found = key;
            }
        });
        if(found !==''){
            _.each(nodes, function(node) {
                node['y']=node[found];
            });
        } else {
            _.each(nodes, function(node) {
                if (_.contains(Object.keys(node),'y')==false) {
                    node['y']=0;
                }
            });
        }
    };


    if (_.contains(firstkeys,'label')==false) {
        _.each(nodes, function(node) {
            node['label']=node['id'];
        });
    };

    gg['nodes'] = nodes;

    if (notinArray('edges',Object.keys(gg))) {
        gg['edges'] = gg.links;
        delete gg['links'];
    };


    var existingnodeids = _.map(gg.nodes,function(n) {
        return n.id
    });

    if(_.contains(Object.keys(gg),'edges')==false){
        if(_.contains(Object.keys(gg),'links')==true){
            gg['edges'] = gg.links;
            delete gg['links'];
        } else {
            gg['edges']=[];
        }
    }
    if(!gg['edges']){
        gg['edges']=[];
    }
    if(_.contains(Object.keys(gg),'edges')==true){
        for(var i = 0; i < gg.edges.length; i++) {
            var keys = Object.keys(gg.edges[i]);
            if (_.contains(keys,'id')==false)  {
                gg.edges[i]['id']='mappedId'+i;
                var src = gg.edges[i]['source'];
                if(_.contains(existingnodeids, src)==false){
                    if(_.contains(existingnodeids,'n'+src)){
                        gg.edges[i]['source']='n'+gg.edges[i]['source'];
                    }
                }
                var tgt = gg.edges[i]['target'];
                if(_.contains(existingnodeids, tgt)==false){
                    if(_.contains(existingnodeids,'n'+tgt)){
                        gg.edges[i]['target']='n'+gg.edges[i]['target'];
                    }
                }
                gg.edges[i]['size']=1;
            };
        };
    };

    console.log('got:',gg);
    // Update the instance's gg:
    if (sig instanceof sigma) {
      console.log('clearing the gg');

      sig.graph.clear();
      sig.graph.read(gg);

    // ...or instantiate sigma if needed:
    } else if (typeof sig === 'object') {
      console.log('remaking the gg');

      sig.graph = gg;
      sig = new sigma(sig);

    // ...or it's finally the callback:
    } else if (typeof sig === 'function') {
      callback = sig;
      sig = null;
    }

    // Call the callback if specified:
    if (callback)
      callback(sig || gg);
}












function Dropdown(label, options, callback){
    var self = this;
    //console.log('the callback should be', callback);
    self.control_type = ko.observable('dropdown');
    self.label = ko.observable(label);
    self.options = ko.observableArray([]);
    /*
    self.updateOptions = function(){
        console.log('making dropdown for '+label);
        console.log('options:',options());
        self.options(
                _.map(opts, function(opt){
                    return new Option(opt,opt);
                })
            );
        $('select').material_select();
    };*/

    if( (typeof options) == "function" ){
        //self.options(options());

        self.options = ko.observableArray(
            _.map(options(), function(opt){
                return new Option(opt,opt)
            })
        );
        options.subscribe(function(){
            self.options(
                _.map(options(), function(opt){
                    return new Option(opt,opt)
                })
            );
        });
        //console.log('functional options init:', options);
    } else {

        self.options = ko.observableArray(
            _.map(options, function(opt){
                return new Option(opt,opt)
            })
        );


    }

    self.selectedOption = ko.observable();
    //console.log('callback type:', typeof callback);

    if((typeof callback)=="function"){
        //console.log('suscribing to selectedoption')
        self.selectedOption.subscribe(function(){
            callback(self.selectedOption().label())
        });
    }

    $('select').material_select();
};




function CheckBox(label, callback){
    var self = this;
    self.control_type = ko.observable('checkbox');
    self.label = ko.observable(label);
    self.order = ko.observable(false);
    self.callback = function(){
        callback(self.order());
    }

    if((typeof callback)=="function"){
        //console.log('suscribing to checkbox')
        self.order.subscribe(function(){
            if(self.order()==false){
                self.order(true);
            } else {
                if(self.order()==true){
                    self.order(false);
                }
            }
            self.callback();
        });
    }
};


function Button(label, callback){
    var self = this;
    self.control_type = ko.observable('button');
    self.label = ko.observable(label);
    if((typeof callback)=="function"){
        //console.log('suscribing');
        self.callback = function(){
            console.log('clicked:', self.label());
            callback()
        };
    } else {
        console.log("BUTTON FOR "+label+" NOT REGISTERED PROPERLY!")
    }
};

function Orderer(label, callback){
    var self = this;
    self.control_type = ko.observable('orderer');
    self.label = ko.observable(label);
    self.order = ko.observable("big to small");
    self.cb = function(){
        if(self.order()=="big to small"){
            self.order("small to big");
        } else {
            if(self.order()=="small to big"){
                self.order("big to small");
            }
        }
        callback(self.order());
    };
};


function sizeOrderer(label, callback){
    var self = this;
    self.state = ko.observable(false);

    self.attribute = function(){
        return graph.nodesizeby();
    };

    graph.nodesizeby.subscribe(function(){
        newstate = graph.orderers[self.attribute()]
        console.log('sizeby changed, so i will update my state');
        self.state(newstate);
        //self.set_state();
    });

    self.state.subscribe(function(){
        self.set_state(self.state());
        //graph.orderers[self.attribute()] = self.state();
    });

    self.set_state = function(state){
        self.state(state);
        graph.orderers[self.attribute()]=state;
        graph.reverseOrder(self.attribute());
    };

    self.control_type = ko.observable('orderer');
    self.label = ko.observable(label);
    self.order = ko.observable("big to small");

    /*
    self.cb = function(){
        console.log('did something');
    };*/
};


function Slider(label, options, callback, visiblecb, minsetter, maxsetter){
    var self = this;
    self.control_type = ko.observable('slider');
    self.label = ko.observable(label);


    self.updateoptions = function(){
        console.log('called for an update');
    }

    /*
    if(minsetter){
        minsetter.subscribe(function(){
            console.log('new min:' + minsetter());
            options['start']=[minsetter(), maxsetter()];
            options['range']['min']=minsetter();

            self.options(options);
            //self.updateoptions();

        });
    };

    if(maxsetter){
        maxsetter.subscribe(function(){
            console.log('new max:' + maxsetter());
            options['start']=[minsetter(), maxsetter()];
            options['range']['max']=maxsetter();

            self.options(options);
        });
    };*/


    self.options = ko.observable(options);
    console.log("callback was:", callback);
    self.spent = ko.observable();

    //self.value = ko.observable( options['start']);
    self.minmax = ko.observable( options['start']);


    if((typeof callback)=="function"){
        //console.log('suscribing');

        self.callback = function(){
            callback(self.spent())
        };

        self.spent.subscribe(function(){
            self.callback();
        });
    }


    self.show = ko.observable(false);
    if(visiblecb){
        //console.log('had visible cb:', visiblecb, visiblecb());
        visiblecb.subscribe(function(){
            //console.log('visibility status should change!');
            self.show(visiblecb());
        });
    } else {
        self.show(true);
        console.log('had no visible cb:', visiblecb);
    }


    //console.log('my start was at:', options['start'])

    self.spent.subscribe(function(){
        //console.log('spent:', self.spent());
        self.callback();
    });

    self.callbackchange = function(){
        //console.log(ko.toJS(self));
        self.callback();
    }


};

function toast(msg){
    Materialize.toast(msg, 3000);
}


function RadioGroup(label, options, callback){
    var self = this;
    self.control_type = ko.observable('radio_group');
    self.label = label;
    self.options = ko.observableArray(options);
    self.callback = function(){
        //callback()
        toast('worked!')
    }
}


function WidgetPanel(parent, title, controls) {
    this.title = ko.observable(title);
    this.parent = ko.observable(parent);
    this.controls = ko.observableArray(
        _.map(controls, function(control){

            switch(control['type']){
                case "dropdown":
                    return new Dropdown(control['label'],control['options'],control['callback']);
                    break;
                case "slider":
                    return new Slider(control['label'],control['options'], control['callback'], control['visible'],control['minsetter'], control['maxsetter']);
                    break;
                case "button":
                    return new Button(control['label'],control['callback']);
                    break;
                case "orderer":
                    return new sizeOrderer(control['label'],control['callback']);
                    break;
                case "option_groups":
                    return new CustomOptionGroup(control['label'],control['options'],control['callback']);
                    break;
                case "radio_group":
                    return new RadioGroup(control['label'],control['options'],control['callback']);
                    break;
                case "fileinput":
                    return new fileUploader(control['label'],control['callback']);
                    break;
            }
        })
    );
    $('.collapsible').collapsible({ accordion: false });
    $('select').material_select();
};

function zip(arrays){
    return arrays[0].map(function(_,i){
        return arrays.map(function(array){return array[i]})
    });
}

function isNumeric(num){
    isundefined = _.isUndefined(num);
    isnull = _.isNull(num);
    isnan = _.isNaN(num);
    isnum = _.isNumber(num);
    if( (!isnull || !isnan || !isundefined) && isnum) {
        return true;
    } else {
        return false;
    }
}


function Popup(header, controls, callback){
    var self = this;

    graph.popupcontrols([]);
    graph.popupheader(header);
    graph.current_popup_callback(callback);

    _.each(controls, function(control){

        switch(control['type']){
            case "dropdown":
                graph.popupcontrols.push(new Dropdown(control['label'],control['options'],control['callback'], control['visible']));
                break;
            case "slider":
                graph.popupcontrols.push(new Slider(control['label'],control['options'], control['callback'], control['visible'],control['minsetter'], control['maxsetter']));
                break;
            case "button":
                graph.popupcontrols.push(new Button(control['label'],control['callback']));
                break;
            case "orderer":
                graph.popupcontrols.push(new sizeOrderer(control['label'],control['callback']));
                break;
            case "option_groups":
                graph.popupcontrols.push(new CustomOptionGroup(control['label'],control['options'],control['callback']));
            case "fileinput":
                graph.popupcontrols.push(new fileUploader(control['label'],control['callback']));
                break;
            case "textinput":
                graph.popupcontrols.push(new textInput(control['label'],control['callback'],control['visible']));
                break;
        }
    });

    $('select').material_select();
    graph.displayPopup(true);
    $('#modal1').openModal();
};


function FilterGroup2(){
    var self = this;
    self.filtername = ko.observable("Add Filter");
    self.minset = ko.observable(0);
    self.maxset = ko.observable(1);
    self.filterattr = ko.observable();
    self.filterop = ko.observable();
    self.minmax = ko.observable();
    self.textfield = ko.observable();
    self.showtextwidget = ko.observable();
    self.showrangewidget = ko.observable();

    self.operators = ko.observableArray(["=","contains","matches"]);


    self.showrangewidget.subscribe(function(){
        if(self.showrangewidget()==true){
            self.showtextwidget(false);
        } else {
            self.showtextwidget(true);
        }
    });

    self.filterop.subscribe(function(){
        if(self.filterop()=="range"){
            self.showrangewidget(true);
        } else {
            self.showrangewidget(false);
        }
    });

    self.exists = function(){
        filters = _.map(graph.filters.serialize(), function(f){
            return f.key;
        });
        return _.contains(filters, self.filterattr());
    }

    self.lastexists =  function(){
        filters = _.map(graph.filters.serialize(), function(f){
          return f.key;
        });
        return _.contains(filters, self.lastattr());
    }

    self.filterattr.subscribe(function(){
        if(_.contains(graph.nodePropertyTypes()['numeric'], self.filterattr())){
            console.log(self.filterattr()+' is numeric');
            self.operators(["range"]);

            self.reset_operators();
            self.filterop("range");
            //self.operators.valueHasMutated();
            self.minset(_.min(_.pluck(graph.s.graph.nodes(),self.filterattr())));
            self.maxset(_.max(_.pluck(graph.s.graph.nodes(),self.filterattr())));
            self.showrangewidget(false);
            self.reset_slider();
            self.showrangewidget(true);
        } else {
            console.log(self.filterattr()+' is not numeric');
            self.operators(["=","contains","matches"]);
            self.filterop("=");
            self.reset_operators();
            self.reset_text_input();
            self.showrangewidget(true);
            self.showrangewidget(false);
        }
        $('select').material_select();
    });

    self.populateSliderOpts = function(){
        return {'start': [self.minset(),self.maxset()],'connect': true,'step': 1,'range': {'min': self.minset(),'max':self.maxset()} }
    }


    self.controls = ko.observableArray([]);
    self.controls.push(new Dropdown("Node Attribute",graph.nodeUncat().sort(),self.filterattr));
    self.controls.push(new Dropdown("Operator", self.operators(), self.filterop));


    $('select').material_select();
    self.controls.push(new Slider("min/max", self.populateSliderOpts(), self.minmax, self.showrangewidget));


    self.showpopup = function(){
        $('select').material_select();
        $('#modal2').openModal();
    }

    self.reset_slider = function(){
        //console.log('resetting slider');
        last = self.controls.pop()

        self.controls.push(new Slider("min/max", self.populateSliderOpts(), self.minmax, self.showrangewidget));
        //self.showrangewidget(self.showrangewidget());
        self.controls.valueHasMutated()
    }

    self.reset_text_input = function(){
        //console.log('resetting operators');

        last = self.controls.pop();
        self.controls.push(new textInput("Value",self.textfield,self.showtextwidget));
        self.controls.valueHasMutated();
    }

    self.reset_operators = function(){
        //console.log('resetting operators');
        last = self.controls.pop();
        currentop = self.controls.pop();
        self.operators.valueHasMutated();
        self.controls.push(new Dropdown("Operator", self.operators(), self.filterop));
        self.controls.push(last);
        self.controls.valueHasMutated();
        $('select').material_select();
    }


    self.reset_operators();

    self.editmode = false;
    self.lastattribute = "";
    self.acceptFilter = function(){
        graph.currentFilter(self);
        nodeattr = self.filterattr();
        op = self.filterop();
        if(op=="range"){
            val = self.minmax();
        } else {
            val = self.textfield() || self.controls()[2].textvalue();
        }
        if(self.editmode == true){

            if(self.exists() && self.lastattribute!==self.filterattr()){
                toast('filter for '+self.filterattr()+' already exists');

            } else {
                if(typeof val != 'undefined'){
                    console.log('undoing filter for '+self.lastattribute);
                    graph.filters.undo(self.lastattribute).apply();
                    graph.addFilter(nodeattr,op,val);
                    self.lastattribute=nodeattr;
                    self.filtername(nodeattr+' '+op+' '+ val);
                } else {
                    toast('missing selected range/value');
                }

            }

            self.editmode = false;
        } else {

            if(self.exists()){
                toast('filter for '+self.filterattr()+' already exists');

            }  else {
                if(typeof val !== 'undefined'){

                    self.lastattribute=nodeattr;
                    graph.filterwidgets.push(self);
                    graph.addFilter(nodeattr,op,val);
                    self.filtername(nodeattr+' '+op+' '+ val);
                    graph.nFilters(graph.nFilters() + 1);

                } else {
                    toast('missing selected range/value');
                }


            }

        }


    }

    self.remove = function(){
        graph.currentFilter(self);
        console.log('[client-REMOVE] undoing filter for '+self.filterattr());
        graph.filters.undo(self.filterattr()).apply();
        graph.filterwidgets.remove(self);
    }

    self.edit = function(){
        self.editmode = true;
        console.log('launching popup for editing');
        graph.currentFilter(self);
        self.showpopup();
    }
}

function createRequest(){
    var result = null;
    if (window.XMLHttpRequest){
        //firefox, safari, etc.
        result = new XMLHttpRequest();
        /*
        if (typeof xmlhttp.overrideMimeType != 'undefined') {
            result.overrideMimeType('text/xml'); //or anything else
        }*/
    }
    else if (window.ActiveXObject) {
        //msie
        result = new ActiveXObject("Microsoft.XMLHTTP");
    }
    else {
        //no clue
    }
    return result;
};

//graph object
function CakeGraph(renderer_config){
    var self = this;
    self.selectedOption2 = ko.observable();
    //['nodes','edges']
    self.exportwhat = ko.observable();

    //['all','selected']


    self.exportwhich = ko.observable();


    self.to_csv = function(){
        var what_ = self.exportwhat();
        var which_ = self.exportwhich();

        if(which_=='all'){
            self.s.toSpreadsheet({
                what: what_,
                attributes: 'data',
                download:true,
                filename:'all_nodes.csv',
                separator:',',
                textSeparator: '"'
            });


        }else{

            if(what_=='nodes'){
                var selected = self.activeState.nodes();
            } else {
                if(what_=='edges'){
                    var selected = self.activeState.edges();

                }}


            self.s.toSpreadsheet({
                what: what_,
                which: _.map(selected, function(item){ return item.id}),
                attributes: 'data',
                download: true,
                filename: 'selected_nodes.csv',
                separator: ',',
                textSeparator: '"'
            });
        }

    };

    self.popupStatus = ko.observable(false)
    self.testoutput = function(){
        console.log('output works');
    }
    self.popupAccepted = function(){
        self.popupStatus(true);
        console.log('accepted');
        //self.dumpPopupForm();
        $('#modal1').closeModal();
        self.popupcallback();
    };

    self.displayPopup = ko.observable(false);
    self.popupheader = ko.observable();
    self.popupcontrols = ko.observableArray([]);
    self.current_popup_callback = ko.observable(self.testoutput);

    self.popupcallback = function(){
     self.current_popup_callback()()
    }

    self.csvtext = ko.observable();


    self.populate_csv_text = function(){
        self.csvtext("");
        var what_ = self.exportwhat();
        var which_ = self.exportwhich();

        if(which_=='all'){
            self.csvtext(self.s.toSpreadsheet({
                what: what_,
                attributes: 'data',
                download:false,
                filename:'all_nodes.csv',
                separator:'\t',
                textSeparator: ''
            }));


        }else{

            if(what_=='nodes'){
                var selected = self.activeState.nodes();
            } else {
                if(what_=='edges'){
                    var selected = self.activeState.edges();

                }}


            self.csvtext(self.s.toSpreadsheet({
                what: what_,
                which: _.map(selected, function(item){ return item.id}),
                attributes: 'data',
                download: false,
                filename: 'selected_nodes.csv',
                separator: '\t',
                textSeparator: ''
            }));
        }
    }
    /*
    self.to_clipboard = function(){

        self.populate_csv_text();
        var clip = new ClipboardEvent('copy');
        clip.clipboardData.setData('text/plain', self.csvtext());
        console.log(clip);
        clip.preventDefault();
        window.dispatchEvent(clip);
        graph.csvtext("");
    };*/


    self.filterminmax = ko.observable();
    self.filterop = ko.observable();
    self.showtextwidget = ko.observable(true);
    self.showrangewidget = ko.observable(false);
    self.filterattr = ko.observable();

    self.minset = ko.observable(0);
    self.maxset = ko.observable(1);

    self.filterattr.subscribe(function(){
        if(_.contains(self.nodePropertyTypes()['numeric'], self.filterattr())){
            self.minset(_.min(_.pluck(self.s.graph.nodes(),self.filterattr())));
            self.maxset(_.max(_.pluck(self.s.graph.nodes(),self.filterattr())));

        }
    });

    self.showrangewidget.subscribe(function(){
        if(self.showrangewidget()==true){
            self.showtextwidget(false);
        } else {
            self.showtextwidget(true);
        }
    });

    self.filterop.subscribe(function(){
        if(self.filterop()=="range"){
            self.showrangewidget(true);
        } else {
            self.showrangewidget(false);
        }
    });

    self.dumpPopupForm = function(){
        return ko.toJS(self.popupcontrols);
    };

    self.loadingStatus = ko.observable('progress-unk');
    self.registerObservable = function(key, value){
        console.log('registering observable:', key, value);
        self[key] = ko.observable(value);
    };
    self.s = new sigma(renderer_config);
    self.n_category_index = ko.observable();
    self.n_categories = ko.observableArray();
    self.colormaps = ko.observableArray(Object.keys(sigma.plugins.colorbrewer));
    self.showpopup = ko.observable(false);
    self.Modals = ko.observableArray([]);
    self.nIcons = ko.observable(0);
    self.nFilters = ko.observable(0);
    self.activeNodes = ko.observable(0);
    self.activeEdges = ko.observable(0);
    self.totalEdges = ko.observable(0);

    self.nGroups = ko.observable(0);
    self.totalNodes = ko.observable(0);
    self.nEdges = ko.observable(0);

    self.colorslideroptions = ko.observable();
    self.edgeColorDefault = ko.observable();

    self.searchCount = ko.observable("");
    self.queryString = ko.observable("");

    self.categorical_options = ko.observableArray([]);
    self.colorsliders = ko.observableArray([]);
    self.iconGroups = ko.observableArray([]);

    self.design = sigma.plugins.design(self.s);
    self.design.setPalette(sigma.plugins.colorbrewer);

    self.sliders = ko.observableArray([]);

    self.selectedOption = ko.observable();
    self.specialProperty = ko.computed(function(){
        var selected = self.selectedOption();
        return selected ? selected.someOtherProperty() : 'unknown';
    }, self);

    self.testfunc = function(something){
        console.log('test worked!');
        console.log(something);
        alert(something);
    };

    self.nodecolormap = ko.observable();
    self.nodecolorbins = ko.observable();
    self.nodecolorby = ko.observable();

    self.nodecolormap.subscribe(function(){
        self.applynodecolors();
    });

    self.nodecolorbins.subscribe(function(){
        self.applynodecolors();
    });

    self.nodecolorby.subscribe(function(){
        self.applynodecolors();
    });

    self.numericProps = ko.observableArray([]);
    self.categoricalProps = ko.observableArray([]);
    self.nodeUncat = ko.observableArray([]);

    self.accordion_widgets = ko.observableArray([]);

    self.nodestylewidgets = ko.observableArray([]);
    self.edgestylewidgets = ko.observableArray([]);
    self.groups = ko.observableArray([]);
    self.groups2 = ko.observableArray([]);

    self.nodesizeby = ko.observable();
    self.orderers = {};



    self.reverseOrder = function(attrib){
        var nodes = self.s.graph.nodes();
        if(self.orderers[attrib]==true){
        
            var attributes = _.filter(_.uniq(_.pluck(nodes, attrib)), function(at){
                return isNumeric(at);
            }).sort();
            
            var reversed = _.sortBy(attributes, function(at){
                return at * -1;
            });
    
            var d = {};
            var cntr=0;
            _.each(attributes, function(attribute){
                d[attribute]=reversed[cntr];
                cntr = cntr + 1;
            });
        
        }

        if(self.orderers[attrib]==false){
            var attributes = _.filter(_.uniq(_.pluck(nodes, attrib)), function(at){
                return isNumeric(at);
            }).sort();

            var reversed = _.sortBy(attributes, function(at){
                return at * -1;
            });

            var d = {};
            var cntr=0;
            _.each(attributes, function(attribute){
                d[reversed[cntr]]=attribute;
                cntr = cntr + 1;
            });
        }
        
        console.log(d);
        _.each(nodes, function(n){
            if(!isNumeric(n[attrib])){
                n[attrib]=0;
            } else {
                n[attrib] = d[n[attrib]];
            }

        });
        self.applynodesizes();
    };

    self.nodesizebins = ko.observable();
    self.nodesizeminmax = ko.observableArray([2,20]);
    //self.nodesizemax = ko.observable(20);

    self.nodesizeby.subscribe(function(){
        self.applynodesizes();
    });
    self.nodesizebins.subscribe(function(){
        self.applynodesizes();
    });
    self.nodesizeminmax.subscribe(function(){
        self.applynodesizes();
    });
    self.edgeshapedefault = ko.observable();
    self.edgeshapedefault.subscribe(function(){
        self.applyedgeshapes();
    })
    self.applyedgeshapes = function(){
        var shape = self.edgeshapedefault();
        self.s.graph.edges().forEach(function(e) {
            e.type = shape;
        });
        self.s.refresh({ skipIdexation: true });
    }

    self.edgecolordefault = ko.observable("source");


    self.drawlabels = ko.observable();
    self.drawlabels.subscribe(function(){
        self.updateSettings("drawLabels", self.drawlabels());
    });

    self.updateSettings = function(setting, option){
        self.s.settings(setting, option);
        self.s.refresh();
    };

    self.edgecolordefault.subscribe(function(){
        var setting = self.edgecolordefault();
        if(setting!== 'invisible'){
            self.s.settings('drawEdges',true);
            self.s.settings('edgeColor', setting);
        } else {
            self.s.settings('drawEdges',false);
        }
        self.s.refresh();
    });

    self.applynodelabels = function(){
        nodeattribute = self.nodelabeldefault();
        _.each(self.s.graph.nodes(), function(n){
            n.label = ""+n[nodeattribute];
        });
        self.s.refresh();

    };

    self.applyedgesizes = function(){
        var color = self.edgecolordefault();
        if(_.contains(['source','target'], color)){
            _.each(self.s.graph.edges(), function(e){
                nodeid = e[color];
                newsize = self.s.graph.nodes(nodeid)['size'];
                console.log('newsize:',newsize);
                e['size'] = newsize;
            });
        }


    };

    self.applynodesizes = function() {
        console.log('applying new sizes to nodes');
        console.log(self.nodesizeby());
        console.log(self.nodesizebins());

        bins = self.nodesizebins();
        if(!bins){
            bins = 3;
            self.nodesizebins(3);
        }

        self.design
            .nodesBy('size', {
                by: self.nodesizeby(),
                bins: bins,
                min:1,
                max:20
            }).apply();

        if(self.nodesizeby() && self.nodesizebins() && self.legendInit){
            if(!self.sizesInit){
                self.legend.addWidget('node', 'size');
                self.sizesInit=true;
            } else {
                self.legend.draw();
            }
        } else {

            if(self.nodesizeby() && self.nodesizebins()){
                self.legend = sigma.plugins.legend(self.s, true);
                self.legend.setPlacement("bottom");
                self.legendInit=true;
                self.applynodesizes();

            }
        }
        self.s.refresh({ skipIdexation: true });
    };

    self.recalc_degree = function(){
        console.log('recalculating degree');
        _.each(self.s.graph.nodes(), function(n){
            n['orig_size'] = n.size;
            n['orig_color'] = n.color;
            n['in_degree'] = self.s.graph.degree(n.id,"in");
            n['out_degree'] = self.s.graph.degree(n.id,"out");
            n['avg_degree'] = (n.in_degree+n.out_degree)/2;
        })
    };

    self.layout = ko.observable();
    self.settingswidgets = ko.observableArray();
    self.layout.subscribe(function(){
        console.log('layout:', self.layout());
        self[self.layout()]();
    });

    self.reset_layout = function(){
        console.log('resetting layout', self.layout());
        self[self.layout()]();
    };

    self.filterwidgets = ko.observableArray([]);

    self.currentFilter = ko.observable();
    self.currentFilter.subscribe(function(){
        console.log('new filter selected');
        $('select').material_select();
    });

    self.showFilterWidget = function(){
        self.popupStatus(false)
        new Popup('Add New Filter', filtercontrols(), self.toFilterGroup);
        $('select').material_select();
    };

    self.removeLastFilter = function(){
        self.filterwidgets.pop();
        console.log('removed last filter');
    }

    self.filters = sigma.plugins.filter(self.s);

    self.toFilterGroup = function(){
        var dump = self.dumpPopupForm();
        //console.log('make this into a filter:', dump);
        nodeattr = dump[0]['selectedOption']["label"];
        operator = dump[1]['selectedOption']["label"];

        val = dump[2]['textvalue'];
        console.log(nodeattr);
        console.log(operator);
        console.log(val);

        if(operator=='='){
            var thisfunction = function(n){
                return (n.data[nodeattr] === val);
            }
        }
        if(operator=='contains'){
            var thisfunction = function(n){
                return n.data[nodeattr].indexOf(val) > -1
            }
        }
        if(operator=='matches'){
            var thisfunction = function(n){
                return n.data[nodeattr].match(val)
            }
        }
        if(operator=='range'){
            mymin = self.filterminmax()[0];
            mymax = self.filterminmax()[1];
            var thisfunction = function(n){

                return (n.data[nodeattr]>=mymin && n.data[nodeattr]<=mymax)
            }
        }

        console.log('[parent-tofiltergroup] applying filter for '+nodeattr);
        self.filters.nodesBy(thisfunction,nodeattr).apply();
        self.addFilter(nodeattr,operator,val);
        self.s.refresh();


        //selected option, selected option, should be
    }

    /*
    self.addFilter = function(nodeattr,operator,val){
        self.filterwidgets.push( new FilterGroup(nodeattr,operator,val) );
    }*/

    self.showFilter = function(){
        self.fg = new FilterGroup2();
        self.currentFilter(self.fg);
        self.currentFilter.valueHasMutated();
        $('select').material_select();
        self.fg.showpopup();
        //self.filterwidgets.push( new FilterGroup2() );
    }



    self.addFilter = function(nodeattr,operator,val){
        console.log('will add filter: ', nodeattr,op,val)
        if(operator=='='){
            var thisfunction = function(n){
                return (n.data[nodeattr] === val);
            }
        }
        if(operator=='contains'){
            var thisfunction = function(n){
                return n.data[nodeattr].indexOf(val) > -1
            }
        }
        if(operator=='matches'){
            var thisfunction = function(n){
                return n.data[nodeattr].match(val)
            }
        }
        if(operator=='range'){
            mymin = val[0];
            mymax = val[1];
            var thisfunction = function(n){

                return (n.data[nodeattr]>=mymin && n.data[nodeattr]<=mymax)
            }
        }

        console.log('current filters are: ', self.filters.serialize());

        console.log('[parent] undoing filter for '+nodeattr);
        self.filters.undo(nodeattr).apply();


        /*
        current_chain = self.filters.serialize();
        console.log('current chain:', current_chain);


        self.filters.undo().apply();
        if(current_chain.length>0){
            self.filters.load(current_chain);
        }
        */


        console.log('[parent] readding filter for '+nodeattr);
        self.filters.nodesBy(thisfunction,nodeattr).apply();


        self.s.refresh();
        console.log('now current filters are: ', self.filters.serialize());
    };




    self.onlyshowgroups = function(nodetypes){
        if(typeof nodetypes == "string"){
            var nt = nodetypes;
            nodetypes = [];
            nodetypes.push(nt);
        };
        groups = _.filter(self.groups(), function(grp){

            return _.contains(nodetypes, grp.label());
        });
        return groups;
    }

    self.searchoptions = ko.observable();


    self.populate_node_props = function() {
        self.recalc_degree();

        self.orderers = {};

        nodes = self.s.graph.nodes();
        console.log('these were the nodes:',nodes);
        first_node = nodes[0];
        console.log('first node:', first_node);
        self.n_category_index = {};


        //get rid of some defaults for now so I don't clutter the dropdowns
        things_not_wanted = ['x','y','id','xPosition','yPosition','read_cam0:size','read_cam0:x','read_cam0:y','renderer1:x','renderer1:y','renderer1:size'];
        things_that_should_be_sliders = [];//['in_degree','out_degree','avg_degree','distToSeed'];
        things_to_keep = _.difference(Object.keys(first_node),things_not_wanted);
        things_to_keep = _.union(things_to_keep,['in_degree','out_degree','avg_degree']);

        self.nodeUncat(things_to_keep);
        _.each(nodes, function(n) {
            if(_.contains(Object.keys(n),'color')==false){
                n.color="#AAA";
            }
            if(_.contains(Object.keys(n),'size')==false){
                n.size=1;
            }
            n['data']={};
            _.each(things_to_keep, function(key){
                n['data'][key]=n[key];
                //delete(n[key]);
            });
            //n['icon'] = {font: 'FontAwesome', scale: 1.0, color: '#fff', content: self.fontdict["times"] };
        });

        self.groups([]);
        self.groups2([]);
        self.groups3 = ko.observableArray([]);

        self.textfields = ko.observableArray([]);


        self.nodePropertyTypes = ko.observable();


        var property_groups = _.groupBy(things_to_keep, function(thing){
            isSeq = self.design.utils.isSequential('nodes','data.'+thing)
            if(isSeq==true){
                self.orderers[thing]=false;
                return 'numeric';
            } else {
                var bigStrs = 0
                _.each(self.s.graph.nodes(), function(n){
                    if((typeof n.data[thing] == "string") && n.data[thing].length>10){
                        bigStrs = bigStrs+1;
                        if(bigStrs>10){
                            return;
                        }
                    }
                });
                if(bigStrs>10){
                    return 'text';
                } else {
                    return 'categorical';
                }
            }
        });


        _.each(Object.keys(property_groups), function(k){
            self.groups.push(
                new Group(k, _.map(property_groups[k].sort(), function(opt){
                    return new Option(opt,opt);
                }))
            )
        });

        self.nodePropertyTypes(property_groups);
        self.applynodecolors();


        $('select').material_select();
        self.s.refresh();
        self.searchoptions(new CustomOptionGroup('Node Attribute',['text','categorical'],self.selected_option2));

    };


    self.circular = function() {
        var R = 100,
        i = 0;
        L = self.totalNodes();
        console.log(L);
        self.s.graph.nodes().forEach(function (n) {
            n.x = Math.cos(Math.PI*(i++)/L)*R;
            n.y = Math.sin(Math.PI*(i++)/L)*R;
        });
        self.s.refresh();
    };


    self.random = function() {
        var W = 100,
        H = 100;
        self.s.graph.nodes().forEach(function (n) {
            n.x = W*Math.random();
            n.y = H*Math.random();
        });
        self.s.refresh();
    };


    self.forceLink = function() {
        sigma.layouts.configForceLink(self.s, {
            worker: true,
            maxIterations:5,
            autoStop: true,
            background: true,
            easing: 'cubicInOut'
        });
        sigma.layouts.startForceLink();
        self.s.refresh();
    };



    self.concentric = function() {
        nodes = self.s.graph.nodes();
        var nodes_by_hop = _.groupBy(nodes, function(node){return node.data.distToSeed});
        console.log(nodes_by_hop);

        temp = {};
        Object.keys(nodes_by_hop).forEach(function(hopnum) {
            console.log('hopnum:',hopnum);
            _.each(to_circle(hopnum, nodes_by_hop[hopnum]),function(node){
                //console.log('nodeid:',node.id);
                self.s.graph.nodes(node.id).x = node.x;
                self.s.graph.nodes(node.id).y = node.y;

            //temp[node.id]={};
            //temp[node.id]['x']=node.x
            });
        });
        self.s.refresh();
        //
    };

    self.applynodeshapes= function(){
        _.each(self.s.graph.nodes(), function(n){
            n['type']=self.nodeshapedefault();
        });
        self.s.refresh();
    };

    self.nodeshapedefault = ko.observable();
    self.nodeshapedefault.subscribe(function(){
        self.applynodeshapes();
    });


    self.nodelabeldefault = ko.observable();
    self.nodelabeldefault.subscribe(function(){
        self.applynodelabels();
    });

    //self.addWidget = function(parent, widget_title,panels){
    self.addWidget = function(parent, title, controls){
        //graph.accordion_widgets.push( new AccordionWidget('color', [{'title': 'nodes', 'controls': [{'label':'ddlabel', 'options': ['a','b','c'] } ] } ] ) )
        //subwidgets is an array of props objects

        if(_.contains(Object.keys(self),parent)==false){
            self[parent] = ko.observable();
        }
        self[parent].push( new WidgetPanel(parent, title, controls) )
    };


    self.load_widgets = function(widgets){
        _.each(widgets, function(widget){
            self.addWidget(widget['parent'],widget['title'], widget['controls'])
        })
    };


   // self.palette = self.design.setPalette(self.myPalette);


    /*
    self.selectedColorMap = ko.observable();
    self.colorbins = ko.observable();
    self.nodeColorBy = ko.observable();


    self.nodeColorBy.subscribe(function(){

    });
    */
    self.sizesInit = false;
    self.colorsInit = false;
    self.legendInit = false;

    self.applynodecolors = function() {
        nbins = self.nodecolorbins();
        if(!nbins){
            nbins = 3;
            self.nodecolorbins(3);
        }
        console.log('color bins was '+nbins+'!');

        colormap = self.nodecolormap();
        nodeattribute = self.nodecolorby();

        console.log('applying colors:', nodeattribute,colormap,nbins);

        self.design
            .nodesBy('color', {
                by: nodeattribute,
                scheme: colormap,
                bins: nbins
            }).apply();

        //self.design.apply();
        self.laststyle=nodeattribute;



        if(self.nodecolorby() && self.nodecolorbins){
            if(!self.legendInit){
                self.legend = sigma.plugins.legend(self.s, true);
                self.legend.setPlacement("bottom");
                self.legendInit=true;
            }
            if(!self.colorsInit){
                //console.log('registering color widget!!!!!!!!!!!!1');
                self.legend.addWidget('node', 'color');
                self.legend.draw();
                self.colorsInit=true;
            } else {
                console.log('redrawing legend');
                self.legend.draw();
            }

        }


        self.s.refresh({ skipIdexation: true });

    };


    /*
    self.addControl(label, options){

    };

    self.addSubwidget(title, controls){

    };
    */

    self.activeState = sigma.plugins.activeState(self.s);
    self.select = sigma.plugins.select(self.s, self.activeState);
    self.activeNodesCallback = _.debounce(function(event) {
        var active = self.activeState.nodes();
        var activeLength = self.activeState.nodes().length;
        self.activeNodes(activeLength);

        self.redraw_chart();
        //console.log('active nodes:',activeLength);
    });
    self.activeState.bind('activeNodes',self.activeNodesCallback);
    self.dragListener = sigma.plugins.dragNodes(self.s, self.s.renderers[0], self.activeState);
    self.lasso = new sigma.plugins.lasso(self.s, self.s.renderers[0], {
      'strokeStyle': 'rgb(236, 81, 72)',
      'lineWidth': 2,
      'fillWhileDrawing': true,
      'fillStyle': 'rgba(236, 81, 72, 0.2)',
      'cursor': 'crosshair'
    });
    self.select.bindLasso(self.lasso);
    self.toggleLasso = function() {
        if (self.lasso.isActive) {
            self.lasso.deactivate();
            console.log('lasso deactivated');
        } else {
            self.lasso.activate();
            console.log('lasso activated');
        }
    };

    self.currentNode = [];
    self.selectNodes = function(nodes) {
        nodes = _.map(nodes, function(node){
            return node.id
        });
        //console.log(nodes);
        nodes.push(self.currentNode.id);
        self.activeState.addNodes(nodes);

        self.s.refresh();
    };

    // Listen for selectedNodes event
    self.lasso.bind('selectedNodes', function (event) {
        setTimeout(function() {
            self.lasso.deactivate();
                self.s.refresh({ skipIdexation: true });
            }, 0);
    });


    self.foundNodes = ko.observable();
    // halo on active nodes:



    self.s.renderers[0].bind('render', function(e) {
        self.s.renderers[0].halo({
            nodeHaloColor: '#6AE5FB',
            nodeHaloSize:3,
            nodes: self.foundNodes()
        });

        //self.s.refresh({ skipIdexation: true });
    });


    self.renderHalo = function() {
        console.log('trying to render halos for '+self.foundNodes().length+' nodes');
        self.s.renderers[0].halo({
            nodeHaloColor: '#AAA',
            nodeHaloSize:3,
            nodes: self.foundNodes()
        });
        //self.s.refresh({ skipIdexation: true });
    };



    self.s.bind('clickNode', function(e) {
        console.dir(e.data.node);
    });

    self.currhalo = [];


    self.clearSelectedNodes = function(){
        self.activeState.dropNodes();
        self.s.refresh({ skipIdexation: true });

    };

    self.clearHovers = function(){
        console.log('clearing hovered nodes');
        self.queryString("");

        //self.foundNodes([]);
        //self.s.refresh();
    };


    self.addHoveredtoSelection = function(){
        console.log('adding hovered to selection');
        ids = _.map(self.foundNodes(),function(n){
            return n.id;
        })
        self.activeState.addNodes(ids);
        self.s.refresh();
    }

    self.refresh_widgets = function(){
        self.nIcons(0);
        self.nFilters(0);
        self.nGroups(0);

        self.activeNodes(0);
        self.activeEdges(0);

        self.totalNodes(self.s.graph.nodes().length);
        self.totalEdges(self.s.graph.edges().length);
    };
    self.selectedSearchable = ko.observable("label");
    self.selectedSearchable.subscribe(function(){
        console.log('switched to', self.selectedSearchable().label());
    });

    self.selectNodeSearch = function(nodeattribute,queryterm) {
        if(queryterm.length>=3){
            console.log('query ok!');
            filtered = _.filter(self.s.graph.nodes(),function(n){
                return n[nodeattribute].match(queryterm)
            });
            if(filtered){
                console.log('had filtered results!');
                var node_ids = _.map(filtered, function(n){
                    return n.id;
                });
                console.log('something?');
                console.log('filtered:', node_ids);
                console.log('something else..');
                self.foundNodes(filtered);
                self.searchCount(filtered.length+" results!");
                self.s.refresh();

            } else {
                console.log('had no results!');
                self.searchCount("0 results");
                self.foundNodes([]);
                self.s.refresh();
            }
        } else {
            console.log('not enough characters!');
            self.searchCount("0 results");
            self.foundNodes([]);
            self.s.refresh();
        }
    };

    self.queryString.subscribe(function(){
        console.log('searching:', 'label', self.queryString());

        self.selectNodeSearch(self.selectedOption2().label(), self.queryString());
    });

    self.queryReady = ko.computed(function(){
        if(self.queryString().length >= 3){
            console.log('query ready!');
        }
        return self.queryString().length >= 3;
    });

    self.hadQueryResults = ko.computed(function(){
        if(self.foundNodes()){
            if(self.foundNodes().length > 0){
                return true
            } else {
                return false
                }
        } else {
            return false
        }
    });

    self.hasSelected = ko.computed(function(){
        return self.activeNodes()>0;
    });
    self.hasPlottables = ko.observable(false);
    self.nodeInformation = function(){
        if(self.hasSelected()){
            //get categorical features
            if(self.activeNodes()>1){
                self.hasPlottables(true);
            } else {
                self.hasPlottables(false);
            }

            return "You have "+self.activeNodes()+" selected";

        } else {
            self.hasPlottables(false);
            return "Select any node(s) for statistics";
        }

    };

    self.selectedChartType = ko.observable('donut');



    self.selectedOption2.subscribe(function(){
        self.clearHovers();

    });

    self.selectedOption.subscribe(function(){
        console.log('redrawing the chart for:',self.selectedOption().label());

        if(_.contains(graph.nodePropertyTypes()['text'], self.selectedOption().label())){
              //console.log(self.filterattr()+' is numeric');
              self.selectedChartType('word_cloud');
              console.log('trying to draw a word cloud');
              texts = _.reduce(_.pluck(self.activeState.nodes(), 'label'), function(accumulator, currentItem) { return accumulator + currentItem;})
              words = texts.match(/\w+/g);
              console.log('total words:' , words.length);


              self.chart = new WordCloud(words);
        } else {
            self.selectedChartType('donut');
            self.redraw_chart();
        }

    });
    /*
    var chart_data = to_c3(self.selected_chart_attr(),nodes);
        self.chart.load(chart_data);
    };*/

    self.chartVisible = function(){
        return self.hasPlottables()//_.contains(self.categoricalProps(), self.selectedOption().label());
    };

    self.draw_chart = function(){
        //var chart_show = self.selected_chart_show();
        //console.log('chart_type');
        /*
        if(chart_show=='all nodes'){
            var nodes = self.s.graph.nodes()
        } else {
        if(chart_show=='current selection'){
            var nodes = self.activeState.nodes()
        }}
        */

        var chart_data = to_c3(self.selectedOption().label(),self.activeState.nodes());
        self.chart.load(chart_data);
    };


    self.redraw_chart = function() {
        console.log('redrawing chart');

        var selectedOption = self.selectedOption().label();
        //'donut', 'bar','pie'


        var chart_type = self.selectedChartType();
        if(chart_type=="donut"){
            self.chart = c3.generate({
                size: {
                    height: 240,
                    width:240
                },
                 data: {
                     columns: [],
                     type: chart_type,
                     onclick: function (d, i) { console.log("onclick", d,i); },
                     onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                     onmouseout: function (d, i) { console.log("onmouseout", d, i);}
                 },
                 donut: {
                     title: self.selectedOption().label()
                 },
                 tooltip: {
                     format: {
                         value: function (value, ratio, id, index) { return ratio.toFixed(2)+'% '+value+' total';}
                     }
                 }
             });
             self.draw_chart();
        } else {
            if(chart_type=="word_cloud"){
                console.log('trying to draw a word cloud');
                texts = _.reduce(_.pluck(self.activeState.nodes(), 'label'), function(accumulator, currentItem) { return accumulator + currentItem;})
                words = texts.match(/\w+/g);
                console.log('total words:' , words.length);

                self.chart = new WordCloud(words);
            }
        }




    };



    self.read_json = function(url) {
        self.loadingStatus('progress-unk');
        console.log('trying to read json from:',url);
        self.nFilters(0);
        self.activeNodes(0);
        self.activeEdges(0);
        self.totalEdges(0);
        self.nGroups(0);
        self.totalNodes(0);
        self.nEdges(0);
        //self.removeAllFilterGroups();
        sigma.parsers.json(url,self.s, function() {
            self.populate_node_props();

            self.totalNodes(self.s.graph.nodes().length);
            self.totalEdges(self.s.graph.edges().length);
        });
        //self.refresh_widgets();
        self.s.refresh();
        self.loadingStatus('progress-complete');
    };

    self.matrices = ko.observable({});

    self.tsne = function(options){

        if(!self.matrix){
            toast('no matrix found!');
        }
        var sself = this;
        options = options || {epsilon: 10, perplexity: 30};

        console.log('options:', options);
        var tx=0,
            ty=0;
        var ss=1;
        //var opt = {epsilon: 5, perplexity: 10};
        sself.T = new tsnejs.tSNE(options);
        console.log('sself.T:', sself.T);

        /*
        _.each(self.s.graph.nodes(), function(n){
            n.x = 0;
            n.y = 0;
        });
        */


        //sself.T.initDataDist(self.matrix);


        //self.matrix = self.matrix.slice(0,250);

        sself.T.initDataRaw(self.matrix);
        //sself.T.initDataRaw(self.matrix);


        sself.updateEmbedding = function(){
            sself.Y = sself.T.getSolution();

            //var cntr = 0;
            nodes = self.s.graph.nodes();
            //console.log(sself.Y);
            for(cntr=0;cntr<self.matrix.length;cntr++){

                n = nodes[cntr];
                n.x = sself.Y[cntr][0]*20*ss + tx;
                n.y = sself.Y[cntr][1]*20*ss + tx;

            }
            /*
            _.each(self.s.graph.nodes(), function(n){
                n.x = sself.Y[cntr][0]*20*ss + tx;
                n.y = sself.Y[cntr][1]*20*ss + tx;
                //cntr = cntr+1;
            });*/
            //console.log('update');

        };

        sself.cntr=0;
        sself.step = function(){
            if(sself.cntr< 500){
                sself.cntr++
                sself.T.step();
                sself.updateEmbedding();
                self.s.refresh();
                console.log(sself.cntr);
            } else {
                clearInterval(sself.step);
            }
        };
        setInterval(sself.step, 0);
    };

    self.registerMatrix = function(key, matrix){
        self.matrices()[key] = matrix;
    }

    self.rests = {};



    self.tempdata = []
    self.load_json_file = function(filename){
        $.ajax({
            url: filename,
            success: function(data) {
                self.tempdata = JSON.parse(data);
            },
            async: false
            })
    };

    self.register_rest_service = function(name,url,f){
        self.rests[name] = function(){
            self.reqResponse = "";
            return self.getUrl(url,f);
        };
    }

    self.reqResponse = "";



    self.getUrl = function(url,f){
        //self.reqResponse = "";
        var req = createRequest();
        req.onreadystatechange = function(){
            if (req.readyState != 4) return;
            if (req.status != 200) {
                toast('could not reach '+ url);
                self.reqResponse = 'error';
                return 'err';
            } else {
                console.log('went through!');
                self.reqResponse = req.responseText;
                return f(self.reqResponse);
            }

        }
        req.open("GET", url, true);
        req.send();
    };
};


/*
ko.bindingHnadlers.sliderMin = {

}*/



ko.bindingHandlers.sliderko = {
    init: function(element, valueAccessor, allBindingsAccessor) {
        var options = allBindingsAccessor().sliderOptions || {};
        noUiSlider.create(element, options)



        /*
        $(element).noUiSlider({
            start: settings().start,
            range: settings().range

        });*/


        //var value = settings.value;
        //var min = settings.range.min;
        //var max = settings.range.max;
        /*
        ko.computed(function test(){

            console.log('trying to update!');
            console.dir(element.noUiSlider);
            //console.dir($($(element)[0]));
            //slider.updateOptions(settings());
            //element.noUiSlider.updateOptions({start: [min(), max()]});
        });*/


        ko.utils.registerEventHandler(element, 'set', function(values, handle) {
            var observable = valueAccessor();
            observable(values[handle]);
            console.log('sliderset:',values);
        });
        ko.utils.registerEventHandler(element, 'update', function(values, handle) {
            var observable = valueAccessor();
            observable(values[handle]);
            console.log('sliderupdate:',values);
        });

        ko.utils.registerEventHandler(element, 'change', function(values, handle,unencoded) {
            var observable = valueAccessor();
            observable(values[handle]=unencoded);
            console.log('change:',values);
        });


        element.noUiSlider.on('change', function(values, handle, unencoded) {
            var observable = valueAccessor();
            console.log(unencoded);
            observable(values[handle]=unencoded);
        });
        /*
        element.noUiSlider.on('updateOpts', function(values, handle, unencoded) {
            var observable = valueAccessor();
            console.log('updating slider config');
            console.log('values:', values);
            console.log('handle:', handle);
            console.log('uncoded:', unencoded);
            element.noUiSlider.updateOptions(values[handle]);
        });*/

        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            element.noUiSlider.destroy();
        });


    },




    update: function(element, valueAccessor,allBindings) {

        var value = ko.utils.unwrapObservable(valueAccessor());
        /*
        console.log('slider update value was:',value);
        console.log('element:',  element)
        console.dir(element.noUiSlider);
        element.noUiSlider.updateOptions(valueAccessor)*/

        element.noUiSlider.set(value);


        //observable = valueAccessor();
        //observable(values[handle]);
    }
};





fill = d3.scale.category20();
function WordCloud(words){
    var self = this;

    self.maxW=200;
    self.maxH=200;
    console.log('got words:', words.slice(0,4),'...');

    counted = _.countBy(words);
    topWords = Object.keys(counted).slice(0,20);

    words = {};
    _.each(topWords, function(w){
        words[w]=counted[w];
        console.log(w, counted[w]);
    });

    self.mincount = parseInt(_.min(_.values(words)));
    self.maxcount = parseInt(_.max(_.values(words)));
    //self.maxWords = 20;
    self.scale = d3.scale.linear()
             .domain([self.mincount, self.maxcount])
             .range([10,50]);

    console.log(self.scale);
    old = words;

    self.words = [];
    _.each(Object.keys(old), function(d){
        console.log('d:',d,' size:', self.scale(old[d]));
        self.words.push({text: d, size: self.scale(old[d])});
    });

    d3.layout.cloud().size([self.maxW, self.maxH])
      .words(self.words)
      .padding(1)
      .rotate(function() { return 0; })
      .font("Impact")
      .fontSize(function(d) {
        console.log('size was:', d.size);
        return d.size;
        })
      .on("end", self.draw)
      .start();


    self.reset = function(){
        d3.select("#chart").selectAll("svg").remove();
    }

    self.draw = function() {
        self.reset();

        d3.select("#chart").append("svg")
            .attr("width", self.maxW)
            .attr("height", self.maxH)
          .append("g")
            .attr("transform", "translate("+self.maxW/2+','+self.maxH/2+")")
          .selectAll("text")
          .data(self.words)
          .enter().append("text")
            .style("font-size", function(d) { return d.size + "px"; })
            .style("font-family", "Impact")
            .style("fill", function(d, i) { return fill(i); })
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
              return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });
    }

    self.draw();
}
