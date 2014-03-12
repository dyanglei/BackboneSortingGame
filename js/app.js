(function ($) {

LengthModel = Backbone.Model.extend({
value: 0
});

CounterModel = Backbone.Model.extend({
value: 0
});

LengthCollection = Backbone.Collection.extend({
model: LengthModel
});

var lengthcollection= new LengthCollection;
var countermodel=new CounterModel({value:0});

RowView=Backbone.View.extend({
    tagName: 'tr',    

    events: {
      'click td.up':  'up',
      'click td.down': 'down'
    },    


    initialize: function(){
      _.bindAll(this, 'render','up', 'down'); 
      this.model.bind('change', this.render);      
    },

    render: function(){	  
	  
      $(this.el).html('<td><img src="images/bar.png" height="50" width="'+(50*this.model.get('value')).toString()+'"></td> <td class="up" style="cursor:pointer;"><img src="images/up.png" alt="up" height="50" width="50"></td> <td class="down" style="cursor:pointer;"><img src="images/down.png" alt="down" height="50" width="50"></td>');
      return this; 
    },   

    up: function(){
            
      if (!$(this.el).index()){ console.log("It's the first one")}
	  else{
	  var prevIndex=$(this.el).prev().index();
	  var ownIndex=$(this.el).index();
	  
	  var temp = lengthcollection.at(prevIndex).get('value');
        lengthcollection.at(prevIndex).set({value:lengthcollection.at(ownIndex).get('value')});
        lengthcollection.at(ownIndex).set({value:temp});	  
	   
	  }
      countermodel.set({value:(countermodel.get('value')+1)});
      this.check();
    },

    down: function(){
       if ($(this.el).index()==lengthcollection.length-1){ console.log("It's the last one")}
	  else{
	  var nextIndex=$(this.el).next().index();
	  var ownIndex=$(this.el).index();
	  
	  var temp = lengthcollection.at(nextIndex).get('value');
        lengthcollection.at(nextIndex).set({value:lengthcollection.at(ownIndex).get('value')});
        lengthcollection.at(ownIndex).set({value:temp});  
	   
	  } 
      countermodel.set({value:(countermodel.get('value')+1)}); 	 
      this.check();
    },
	
	check: function(){
	var temp=true;
      for (var i=0; i<lengthcollection.length; i++){
	  if (lengthcollection.at(i).get("value")!=(i+1)){
	  temp=false;
	  break;
	  }
      }	  
      if(temp==true){
	  alert("Congratulation! You finished in "+countermodel.get('value').toString()+" steps!");
	  }
	},
  });
  
FooterView = Backbone.View.extend({
el: $("#steps"),
initialize: function(){
_.bindAll(this, 'render');
countermodel.bind("change",this.render);

},

render: function(){
$(this.el).html("Steps: "+countermodel.get("value").toString());
},
});
  
MainView = Backbone.View.extend({
el: $("#main"),

events: {
  "click button#newGame": "shuffleCollection",
  "click button#replay": "replay",
},

initialize: function () {
 //_.bindAll(this, 'render','shuffleCollection');
 this.array=[1,2,3,4,5,6,7];
 
for(var i=1; i<8; i++){
lengthcollection.add(new LengthModel({value:i}));

}
//lengthcollection.bind('change',this.render);

this.render();
},


render: function(){
    
    if(!$('#table',this.el).children().length){	}
	else {
	$('#table',this.el).empty();	
	}
		
    for (var i=0; i< lengthcollection.length; i++){ 
	var rowview = new RowView({model: lengthcollection.at(i)});	
	$('#table',this.el).append(rowview.render().el);	
	
}	
},

shuffleCollection: function(){
   countermodel.set({value:0});
   for (var i = lengthcollection.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = lengthcollection.at(i).get('value');
        lengthcollection.at(i).set({value:lengthcollection.at(j).get('value')});
        lengthcollection.at(j).set({value:temp});
    }
	
	for (var i=0; i<this.array.length; i++){
	this.array[i]=lengthcollection.at(i).get('value');
	}
	    
},

replay: function(){
for (var i=0; i<this.array.length; i++){
	lengthcollection.at(i).set({value:this.array[i]});
	}
	countermodel.set({value:0});
}

});

var footerview =new FooterView;
var mainview = new MainView;
})(jQuery);
