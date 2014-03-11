(function ($) {

LengthModel = Backbone.Model.extend({
value: 0
});

LengthCollection = Backbone.Collection.extend({
model: LengthModel
});

ArrayModel = Backbone.Model.extend({
array: []
});

var arraymodel=new ArrayModel({array:[1,2,3,4,5,6,7]});

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
	  imagefile= 'length'+this.model.get('value')+'.png';
      $(this.el).html('<td><img src="images/'+imagefile+'"></td> <td class="up" style="cursor:pointer;"><img src="images/up.png" alt="up" height="50" width="50"></td> <td class="down" style="cursor:pointer;"><img src="images/down.png" alt="down" height="50" width="50"></td>');
      return this; 
    },   

    up: function(){
      console.log("up pressed");
      if (!$(this.el).index()){ console.log("It's the first one")}
	  else{
	  var prevIndex=$(this.el).prev().index();
	  var ownIndex=$(this.el).index();
	  temp1=arraymodel.get("array")[prevIndex];
	  temp2=arraymodel.get("array")[ownIndex];
	  console.log(prevIndex+' '+temp1);
	  console.log(ownIndex+' '+temp2);
	  arraymodel.get("array")[prevIndex]=temp2;
	  arraymodel.get("array")[ownIndex]=temp1;	 
      this.model.set({value: temp1});	  
	  }
      console.log(arraymodel.get("array"));
    },

    down: function(){
      console.log("down pressed");
      
    }
  });
  

  
MainView = Backbone.View.extend({
el: $("#main"),

events: {
  "click button#newGame": "shuffle",
},

initialize: function () {
 _.bindAll(this, 'update','render','shuffleArray','shuffle');
this.model = arraymodel;
this.collection = new LengthCollection();
this.model.bind('change', this.render);
this.collection.bind('change', this.render);

this.model.set({array: this.shuffleArray(this.model.get("array"))});
this.render();
},

shuffle: function(){
this.model.set({array: this.shuffleArray(this.model.get("array"))});
this.update();
},

update: function(){
console.log(this.collection.length);
for (var i=0; i< this.model.get("array").length; i++){ 
	this.collection.at(i).set({value: this.model.get("array")[i]});
	}
console.log(this.model.get('array'));
console.log(arraymodel.get('array'));
},

render: function(){
    console.log('hi');
    if(!$('#table',this.el).children().length){
	for (var i=0; i< this.model.get("array").length; i++){ 
	var length=new LengthModel({value: this.model.get("array")[i]});
	this.collection.add(length);
	}
	}
	else {
	$('#table',this.el).empty();
	console.log('hi');
	}
	var array= this.model.get("array");
    for (var i=0; i< array.length; i++){ 
	var rowview = new RowView({model: this.collection.at(i)});	
	$('#table',this.el).append(rowview.render().el);	
	//$($('#tr',this.el).eq(index)).html($(layerView.render().el).html());	
}	
},

shuffleArray: function(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
},

});


var mainview = new MainView;
})(jQuery);
