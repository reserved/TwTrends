window.TwTrends = {
	Models: {},
	Collections: {},
	Views: {}
};

var firstList = [];
var secondList = [];

var uniqueList = [];

var totalWeight;

var request = require('superagent');

function render(){
	totalWeight = 0;
	var elem = $(".tweets-list ul");
	elem[0].innerHTML = '';
	var elem2 = $("ul.tweets");
	elem2[0].innerHTML = '';

	var colorsList = []; 
	_.each(TwTrends.Colors.models,function(element,index,value){ colorsList.push(element.attributes.hex); });

	var weightList = [];
	_.each(uniqueList,function(element,index,list){
		var myWeight = 0;
		(element.charCodeAt(0) == 35) ? element.slice(1) : element;
		_.each(element,function(l){ myWeight += l.charCodeAt(0);}); myWeight = myWeight % 5000;
		totalWeight += myWeight;
		weightList.push(myWeight);
	});
	_.each(uniqueList,function(element,index,list){
		elem.append('<li class="trending-tweet">'+element+'</li>');
		var newClass = (index % 2 == 0) ? 'even' : 'odd';
		newIndex = index % colorsList.length; 
		elem2.append('<li class="tweet-full '+ newClass +'" style="width:'+ weightList[index] / totalWeight * 100 +'%;background-color:#'+ colorsList[newIndex] +';"><aside class="tweet-tip"><span class="label">'+element+'</span><span class="arrow"></span></aside></li>');
	});
}

TwTrends.Models.Country = Backbone.Model.extend({
	defaults:{
		name:'',
		woeid:''
	}
});

TwTrends.Collections.Countries = Backbone.Collection.extend({
	model: TwTrends.Models.Country,
});

TwTrends.Countries = new TwTrends.Collections.Countries();

TwTrends.Models.TrendingTweet = Backbone.Model.extend({
	defaults:{
		text:''
	}
})

TwTrends.Collections.TrendingTweets = Backbone.Collection.extend({
	model: TwTrends.Models.TrendingTweet
})

TwTrends.TrendingListOne = new TwTrends.Collections.TrendingTweets;
TwTrends.TrendingListTwo = new TwTrends.Collections.TrendingTweets;

humane.clickToClose = true;
humane.log('Fetching countries… Please wait');

request.get('/list/countries')
.end(function(res){

	countriesList = JSON.parse(res.text);
	_.each(countriesList,function(key,value,list){
		var country = new TwTrends.Models.Country();
		country.set({'name':key.name,'woeid':key.value});
		TwTrends.Countries.push(country);
	});
	TwTrends.Views.Countries = Backbone.View.extend({
		events:{
			'click button': 'showCountries',
			'click .blur': 'hideCountries',
			'click li.country': 'selectCountry'
		},
		initialize: function() {
			var elem = $(this.el).find('ul.dropdown');
			var _count = TwTrends.Countries.models.length;			
			for (var _i = 0; _i < _count; _i++) {
				elem.append('<li class="country" id="'+ TwTrends.Countries.models[_i].attributes.woeid+'">'+TwTrends.Countries.models[_i].attributes.name+'</li>');
			}
		},
		showCountries: function(){
			var elem = $(this.el).find('ul.dropdown');
			elem.css({'visibility':'visible','opacity':1,'transition':'all .3s ease-in'});
			$(this.el).find('.blur').show();
		},
		hideCountries: function(){
			$(this.el).find('ul.dropdown').css({'visibility':'hidden','opacity':0,'transition':'all .3s ease-in'});		
			$(this.el).find('.blur').hide();
		},
		selectCountry: function(e){
			this.name = e.currentTarget.innerText;
			this.woeid = e.currentTarget.id;			
			$(this.el).find("button .label").text(this.name);
			$(this.el).find("button .label").val(this.woeid);	
			var viewElem = this.el.className; 
			if(viewElem == 'country-first'){ firstList = []; TwTrends.TrendingListOne.reset();} else { secondList = []; TwTrends.TrendingListTwo.reset(); };

			this.hideCountries();
			var tHis = this;
			humane.log('Fetching trending tweets for the selected country… Please wait.',{clickToClose:true});
			request.get('/trends/'+this.woeid)
			.end(function(res){
				var trendingTweets = JSON.parse(res.text);
				_.each(trendingTweets[0].trends,function(key,value,list){
					var newTrendingTweet = new TwTrends.Models.TrendingTweet({'text':key.name});
					if(viewElem == 'country-first'){
						TwTrends.TrendingListOne.push(newTrendingTweet);
						firstList.push(key.name);
					}
					else{
						TwTrends.TrendingListTwo.push(newTrendingTweet);
						secondList.push(key.name);						
					}
				});

				if (firstList.length > 0 && secondList.length > 0) {
					var combinedElems = _.union(firstList,secondList);
					var sharedElems = _.intersection(firstList,secondList);
					uniqueList = _.difference(combinedElems,sharedElems);
				}
				else if (firstList.length > 0) {
					uniqueList = firstList;					
				}
				else if (secondList.length > 0) {
					uniqueList = secondList;
				}
				else{
					console.log('No tweets found');
				}
				humane.remove();
				if (uniqueList.length > 0) {
					render();
				}
			});

		},
	});
TwTrends.FirstCountry = new TwTrends.Views.Countries({el : '.country-first'});
TwTrends.SecondCountry = new TwTrends.Views.Countries({el : '.country-second'});                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              

humane.remove();
humane.clickToClose = false;
humane.log('Process completed.',{timeout:1500});
});


TwTrends.Models.Color = Backbone.Model.extend({
	defaults:{
		r:'0',
		g:'0',
		b:'0',
		hex:'000000',
	},
	initialize: function(){
		if (this.get('hex') != '' && typeof(this.get('hex')) != 'undefined')
		{
			this.set('r',parseInt(this.get('hex').slice(0,2),16));
			this.set('g',parseInt(this.get('hex').slice(2,4),16));
			this.set('b',parseInt(this.get('hex').slice(4,6),16));
		}
		else
		{
			numR = this.get('r'); numG = this.get('g'); numB = this.get('b');
			numRGB = [numR,numG,numB];
			hexRGB = _.map(numRGB,function(num){ hexNum = num.toString(16); if (num < 15) { return "0" + hexNum; } else { return hexNum; } });
			this.set('hex',hexRGB[0] + hexRGB[1] + hexRGB[2]);
		}
	}
});

TwTrends.Collections.Colors = Backbone.Collection.extend({
	model: TwTrends.Models.Color
});

TwTrends.Colors = new TwTrends.Collections.Colors();
var initialColor = new TwTrends.Models.Color({'hex':'9b59b6'});
TwTrends.Colors.add(initialColor);


TwTrends.Views.Colors = Backbone.View.extend({
	offsetFixToCenter:$('.select-color-tool').width()/2,
	pageOffsetLeft:$('section.page')[0].offsetLeft,
	pageOffsetTop:$('section.page')[0].offsetTop,
	el:'section.tweet-colors',
	collection:TwTrends.Colors,
	events:{
		'click .select-color':'addColor',
		'click .tweet-color':'deleteColor',
		'contextmenu .tweet-color':'showColor'
	},
	initialize: function(){
		this.render();
	},
	addColor: function() {
		var newColor = new TwTrends.Models.Color();
		TwTrends.Colors.add(newColor);
		$('.tweet-colors').prepend($('<button>').addClass("tweet-color").attr('id',"color-"+newColor.cid));
		$('#color-'+newColor.cid).css({'background-color':'#'+newColor.get('hex')});
		if (uniqueList.length > 0) {
			render();
		}
	},
	showColor: function(e) {
		e.preventDefault();
		var cid = $(e.toElement).attr('id').slice(6);
		var currentModel = TwTrends.Colors.get({'cid':cid})
		$('#red_color').val(currentModel.get('r'));
		$('#green_color').val(currentModel.get('g'));
		$('#blue_color').val(currentModel.get('g'));
		$('#hex_color').val(currentModel.get('hex'));
		$('.selected-color').css({'background-color':'#' + currentModel.get('hex')});
		$('.select-color-tool').attr('cid',cid).css({position:'absolute',left:e.pageX - (this.pageOffsetLeft + this.offsetFixToCenter),top:e.pageY - this.pageOffsetTop,visibility:'visible',opacity:1,transition:'all .3s ease-in'});
	},
	deleteColor: function(e) {
		if (TwTrends.Colors.length > 1) {
			var cid = $(e.toElement).attr('id').slice(6);
			TwTrends.Colors.remove({'cid':cid});
			this.render();
			if (uniqueList.length > 0) {
				render();
			}
		}
		else { alert("You cannot remove this color."); };
	},
	clear: function(){
		$('.tweet-color').remove();
	},
	render: function(){
		this.clear();
		var numOfColors = TwTrends.Colors.models.length;
		for (var _i = 0; _i < numOfColors; _i++) {
			var cid = TwTrends.Colors.models[_i].cid;
			$('.tweet-colors').prepend($('<button>').addClass("tweet-color").attr('id',"color-"+cid));
			$('.tweet-color#color-'+ cid).css({'background-color':'#'+TwTrends.Colors.models[_i].toJSON().hex})
		}		
	}
});

TwTrends.ColorsetView = new TwTrends.Views.Colors;

TwTrends.Views.SelectColorTool = Backbone.View.extend({
	el:'.select-color-tool',
	events:{
		'keyup input.color':'updateRGB',
		'change input.color':'updateRGB',
		'keyup input.hex':'updateHex',
		'click .close-color-tool':'closeColor'
	},
	updateRGB: function(){
		var numR = $('#red_color').val(); numR = (numR == '') ? 0 : parseInt(numR);
		var numG = $('#green_color').val(); numG = (numG == '') ? 0 : parseInt(numG);
		var numB = $('#blue_color').val(); numB = (numB == '') ? 0 : parseInt(numB);
		var numRGB = [numR,numG,numB];
		var hexRGB = _.map(numRGB,function(num){ hexNum = num.toString(16); if (num < 15) { return "0" + hexNum; } else { return hexNum; } });
		var hexRGBStr = hexRGB[0].toString() + hexRGB[1] + hexRGB[2];
		$('#hex_color').val(hexRGBStr);
		$('.selected-color').css({'background-color':'#'+hexRGBStr});
	},
	updateHex: function(){
		var hexColorElem = $('#hex_color'); var _c = 1;
		if (hexColorElem.val().length > 3) { _c = 2; }
		var	numR = hexColorElem.val().slice(0,1 * _c); numR = (numR == '') ? 0 : parseInt(numR,16);
		var	numG = hexColorElem.val().slice(1 * _c,2 * _c); numG = (numG == '') ? 0 : parseInt(numG,16);
		var	numB = hexColorElem.val().slice(2 * _c,3 * _c); numB = (numB == '') ? 0 : parseInt(numB,16);
		$('#red_color').val(numR); $('#green_color').val(numG); $('#blue_color').val(numB);
		$('.selected-color').css({'background-color':'#'+hexColorElem.val()});
	},
	closeColor: function(e) {
		$('.select-color-tool').attr('cid',cid).css({position:'absolute',visibility:'hidden',opacity:0,transition:'all .3s ease-in'});
		var cid = $('.select-color-tool').attr('cid');
		var currentModel = TwTrends.Colors.get({'cid':cid})
		currentModel.set('r',$('#red_color').val());		
		currentModel.set('g',$('#green_color').val());		
		currentModel.set('b',$('#blue_color').val());		
		currentModel.set('hex',$('#hex_color').val());
		if (currentModel.hasChanged()){ 
			$('#color-'+cid).css({'background-color':'#'+$('#hex_color').val()});			
		}
		if (uniqueList.length > 0) {
			render();
		}
	}
});
TwTrends.SelectColorTool = new TwTrends.Views.SelectColorTool;

