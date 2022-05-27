if ( !PULSE ){var PULSE = {};}
if ( !PULSE.CLIENT ){PULSE.CLIENT = {};}

PULSE.CLIENT.JqueryJSONPTimer = function( params, f, e )
{
	this.initialise( params || {}, f, e );

	this.running = false;
};

PULSE.CLIENT.JqueryJSONPTimer.prototype.initialise = function( params, f, e )
{
	this.url = params.url || '';
	this.interval = params.interval * 1000 || '';
	this.params = params.params || {};
	this.callbackName = params.callback || '';
	this.callback = f;
	this.errorCallback = e;
	this.name = params.id || 'un-named';
};

PULSE.CLIENT.JqueryJSONPTimer.prototype.start = function()
{
	if ( !this.running )
	{
		this.running = true;
		this.fireTimer( );
	}
};

PULSE.CLIENT.JqueryJSONPTimer.prototype.stop = function()
{
	if ( this.running )
	{
		this.running = false;
		this.cancelTimer( );
	}
};

PULSE.CLIENT.JqueryJSONPTimer.prototype.fireTimer = function()
{
	var that = this;

	$.jsonp(
	{
		url : that.url,
		context : document.body,
		callback : that.callbackName,
		processData: false,
		contentType: false,
		cache : true,
		success : function( data )
		{
			that.cancelTimer( );
			if ( that.interval > 0 && that.running )
			{
				that.timer = setTimeout( function()
				{
					that.fireTimer( );
				}, that.interval );
			}
			that.callback( data );
		},
		error : function( xOptions, textStatus )
		{
			that.errorCallback( );
			if ( that.interval > 0 && that.running )
			{
				that.timer = setTimeout( function()
				{
					that.fireTimer( );
				}, that.interval );
			}
		}
	} );
};

PULSE.CLIENT.JqueryJSONPTimer.prototype.cancelTimer = function()
{
	if ( this.timer )
	{
		clearTimeout( this.timer );
	}
};

if ( !PULSE )                { var PULSE = {}; }
if ( !PULSE.CLIENT )         { PULSE.CLIENT = {}; }

PULSE.CLIENT.JqueryJSONPDataManager = function ()
{
	//depricated
	//this.timers = {};
	//this.lastdata = {};
	//this.savedTargets = {};
	
	this.urls = {};
	/**
	 * //proposed object for a given url
	this.urls['scoring-01.js'] = {
		timer: 'new JqueryJSONPTimer'
		savedTargets: [],
		lastData: '',
		callback: '',
		interval: -1,
		url: '',
		id: ''
	}
	*/
};

/**
 * Note that the interval is in SECONDS, and will be multiplied by 1000 to derive a millisecond
 * value.
 */
PULSE.CLIENT.JqueryJSONPDataManager.prototype.addFeed = function ( id, url, interval, callback, targets )
{
    var currentTargets = this.urls[url] && this.urls[url].savedTargets ? this.urls[url].savedTargets : [];
    
	// Remove any existing feed with this ID
	this.removeFeed( url );

	// Save the callback name
	this.urls[url] = { id:id, url:url, interval:interval, callback:callback };
    
    // Add all the targets to the current targets
    for ( var i = 0, limit = targets.length; i < limit; i++ )
    {
        var needToAdd = true;
        for ( var j = 0, jLimit = currentTargets.length; j < jLimit; j++ )
        {
            if ( targets[ i ] === currentTargets[ j ] )
            {
                needToAdd = false;
                break;
            }
        }
        if ( needToAdd )
        {
            currentTargets.push( targets[ i ] );
        }
    }
    
    this.urls[url].savedTargets = currentTargets;
	
	// Dynamically create the callback method
	var that = this;
	var f = function ( jsonpData )
	{
		if ( jsonpData )
		{
			var payload = jsonpData;
			
			// Serialise the payload
			var serialised = $.toJSON( payload );
		    if ( that.urls[url] && that.urls[url].lastData !== serialised )
		    {
		    	// Save the new data
		    	that.urls[url].lastData = serialised;
				// Pass the data to all of the targets...
				for ( var t = 0, tlimit = currentTargets.length; t < tlimit; t++ )
				{
					// ...if they are valid
					var target = currentTargets[t];
					if ( target && target.onData )
					{
						try
						{
							target.onData( payload, id );
						}
						catch(e)
						{
							if( window.console && window.console.log ) console.log(e);
						}
					}
				}
		    }
		}
	};
	
	var e = function ( )
	{
		for ( var t = 0, tlimit = currentTargets.length; t < tlimit; t++ )
		{
			// ...if they are valid
			var target = currentTargets[t];
			if ( target && target.onError )
			{
				target.onError( id );
			}
		}
	};
	
	// Create the timer
	that.urls[url].timer = new PULSE.CLIENT.JqueryJSONPTimer( this.urls[url], f, e );
};

PULSE.CLIENT.JqueryJSONPDataManager.prototype.startAll = function ()
{
	for ( var url in this.urls )
	{
		this.start( url );
	}
};

PULSE.CLIENT.JqueryJSONPDataManager.prototype.stopAll = function ()
{
	for ( var url in this.urls )
	{
		this.stop( url );
	}
};

PULSE.CLIENT.JqueryJSONPDataManager.prototype.start = function ( url )
{
	if ( this.urls[url] && this.urls[url].timer )
	{
		this.urls[url].timer.start();
	}
};

PULSE.CLIENT.JqueryJSONPDataManager.prototype.stop = function ( url )
{
	if ( this.urls[url] && this.urls[url].timer )
	{
		this.urls[url].timer.stop();
	}
};

PULSE.CLIENT.JqueryJSONPDataManager.prototype.removeFeed = function ( url )
{
	this.stop( url );
	
	if ( this.urls[url] )
	{
		this.urls[url] = undefined;
	}
	
};
if ( !PULSE ){var PULSE = {};}
if ( !PULSE.CLIENT ){PULSE.CLIENT = {};}

PULSE.CLIENT.Timer = function()
{
	this.running = false;
};

PULSE.CLIENT.Timer.prototype.initialise = function( params )
{
	this.callback = params.callback;
	this.interval = params.interval * 1000;
};

PULSE.CLIENT.Timer.prototype.start = function( delay )
{
	if ( !this.running )
	{
		this.running = true;
		this.fireTimer( delay );
	}
};

PULSE.CLIENT.Timer.prototype.stop = function()
{
	if ( this.running )
	{
		this.running = false;
		this.cancelTimer( );
	}
};

PULSE.CLIENT.Timer.prototype.fireTimer = function( delay )
{
	var that = this;

	if( !delay )
	{
		that.callback();
	}

	that.fire();
};

PULSE.CLIENT.Timer.prototype.fire = function()
{
	var that = this;

	that.cancelTimer();

	if ( that.interval > 0 && that.running )
	{
		that.timer = setTimeout( function()
		{
			that.callback();
			that.fireTimer( true );
		}, that.interval );
	}
};

PULSE.CLIENT.Timer.prototype.cancelTimer = function()
{
	if ( this.timer )
	{
		clearTimeout( this.timer );
	}
};
if (!PULSE) 				{ var PULSE = {}; }
if (!PULSE.CLIENT) 			{ PULSE.CLIENT = {}; }
if (!PULSE.CLIENT.CRICKET) 	{ PULSE.CLIENT.CRICKET = {}; }
if (!PULSE.CLIENT.CRICKET.Utils) 	{ PULSE.CLIENT.CRICKET.Utils = {}; }
/**
 * Generate a user-friendly score from the matchschedule2 team1 or team2 ScoringSummary object
 */
PULSE.CLIENT.CRICKET.Utils.getRunsOverWickets = function( scoringSummary )
{
	if( scoringSummary && scoringSummary.innings )
	{
		if( !scoringSummary.innings[0].allOut )
		{
			return scoringSummary.innings[0].runs + "/" + scoringSummary.innings[0].wkts;
		}
		else
		{
			return scoringSummary.innings[0].runs;
		}
	}
	return "";
};

//returns a score string given runs, wickets and whether the team were all out
//flips runs and wickets if flips === true

PULSE.CLIENT.CRICKET.Utils.getInningsScore = function( runs, wickets, allOut, declared, flip, scoreDelimeter )
{
	var score = "";

	if( wickets !== undefined || runs !== undefined )
	{
		if( flip )
		{
			score = ( !allOut ? ( wickets || 0 ) + ( scoreDelimeter || '/' ) : "" ) + ( runs || 0 ) + ( declared ? 'd' : '' );
		}
		else
		{
			score = ( runs || 0 ) + ( !allOut ? ( scoreDelimeter || '/' ) + ( wickets || 0 ) : '' ) + ( declared ? 'd' : '' );
		}
	}

	return score;
};

//returns latest team batting innings (or undefined) given a team index and batting order

PULSE.CLIENT.CRICKET.Utils.getTeamLatestInnings = function( innings, battingOrder, index )
{
	var lastInnings;

	for( var i = 0; i < innings.length; i++ )
	{
		var inning 		= innings[i],
			battingIdx	= battingOrder[i];

		if( battingIdx === index )
		{
			lastInnings = inning;
		}
	}
	
	return lastInnings;
};

//returns a fake overs fraction given a matchSchedule innings

PULSE.CLIENT.CRICKET.Utils.getFakeOversFraction = function ( innings )
{
	var oversFraction = "";

	if( innings && innings.ballsFaced )
	{
		var completeOvers 	= innings.ballsFaced / 6,
			incompleteOver 	= innings.ballsFaced % 6,
			oversFraction 	= parseInt( completeOvers ) + ( incompleteOver !== 0 ? '.' + incompleteOver : '' );
	}	
	
	return oversFraction;
};
		
PULSE.CLIENT.CRICKET.Utils.getPlayerNameHtml = function( name )
{
	var space = name.indexOf( ' ' );			
	if ( space === -1 )
	{
		space = 0;
	}
	var start = name.substr( 0, space );
	var rest = name.substr( space );
	
	return start + '<span>' + rest + '</span>';
};

PULSE.CLIENT.CRICKET.Utils.formatTeamNameAbbr = function( teamname )
{
	return teamname.split( '&' ).join( '&amp;' );
};

PULSE.CLIENT.CRICKET.Utils.compareRuns = function( stats1, stats2 )
{
	var run1 = stats1 && stats1.stats && stats1.stats.r !== '-' ? +stats1.stats.r : -1;
	var run2 = stats2 && stats2.stats && stats2.stats.r !== '-' ? +stats2.stats.r : -1;
	var sr1 = stats1 && stats1.stats && stats1.stats.sr !== '-' ? +stats1.stats.sr : -1;
	var sr2 = stats2 && stats2.stats && stats2.stats.sr !== '-' ? +stats2.stats.sr : -1;

	var compareOutput;

	if ( run1 < run2 )
	{
		compareOutput = 1;
	}
	else if ( run1 > run2 )
	{
		compareOutput =  -1;
	}
	else
	{
		if ( sr1 || sr2 )
		{
			compareOutput = 0;
		}
		else
		{
			if ( sr1 < sr2 )
			{
				compareOutput = 1;
			}
			else if ( sr1 > sr2 )
			{
				compareOutput = -1;
			}
			else
			{
				compareOutput = 0;
			}
		}
	}

	return compareOutput;
};

PULSE.CLIENT.CRICKET.Utils.compareEconomy = function( stats1, stats2 )
{
	var e1 = stats1 && stats1.stats && typeof stats1.stats.e !== 'undefined' && stats1.stats.e !== '-' ? +stats1.stats.e : -1;
	var e2 = stats2 && stats2.stats && typeof stats1.stats.e !== 'undefined' && stats2.stats.e !== '-' ? +stats2.stats.e : -1;

	var compareOutput;
	
	if( e1 === -1 && e2 !== -1 )
	{
		compareOutput = 1;
	}
	else if( e1 !== -1 && e2 === -1 )
	{
		compareOutput = -1;
	}
	else
	{
	    if ( e1 < e2 )
	    {
	        compareOutput = -1;
	    }
	    else if ( e1 > e2 )
	    {
	        compareOutput = 1;
	    }
	    else
	    {
	        compareOutput = 0;
	    }
	}
    
    return compareOutput;
};

PULSE.CLIENT.CRICKET.Utils.compareWickets = function( stats1, stats2 )
{
	var w1 = stats1 && stats1.stats && typeof stats1.stats.w !== 'undefined' ? +stats1.stats.w : -1;
	var w2 = stats2 && stats2.stats && typeof stats1.stats.w !== 'undefined' ? +stats2.stats.w : -1;
	var r1 = stats1 && stats1.stats && typeof stats1.stats.r !== 'undefined' ? +stats1.stats.r : -1;
	var r2 = stats2 && stats2.stats && typeof stats1.stats.r !== 'undefined' ? +stats2.stats.r : -1;

	var compareOutput = 0;
	
    if ( w1 < w2 )
    {
        compareOutput = 1;
    }
    else if ( w1 > w2 )
    {
        compareOutput = -1;
    }
    else
    {
    	if( w1 > 0 && w2 > 0 )
    	{
	        if ( r1 < r2 )
		    {
		        compareOutput = -1;
		    }
		    else if ( r1 > r2 )
		    {
		        compareOutput = 1;
		    }
		    else
		    {
		    	compareOutput = PULSE.CLIENT.CRICKET.Utils.compareEconomy( stats1, stats2 );
		    }
    	}
	    else
	    {
	    	compareOutput = PULSE.CLIENT.CRICKET.Utils.compareEconomy( stats1, stats2 );
	    }
    }
    
    return compareOutput;
};

PULSE.CLIENT.CRICKET.Utils.mergeBattingStats = function( stats1, stats2 )
{
	var mergedStat =
	{
		playerId : -1,
		b: 0,
		r: 0,
		'4s': 0,
		'6s': 0
	}

	for( var m in mergedStat )
	{
		if( m === 'playerId' )
		{
			mergedStat[m] = stats1[m];
		}
		else
		{
			mergedStat[m] += ( stats1[m] ? stats1[m] : 0 );
			mergedStat[m] += ( stats2[m] ? stats2[m] : 0 );
		}
	}

	return mergedStat;
};

PULSE.CLIENT.CRICKET.Utils.mergeBowlingStats = function( stats1, stats2 )
{
	var mergedStat =
	{
		playerId : -1,
		w: 0,
		d: 0,
		nb: 0,
		r: 0,
		maid: 0,
		wd: 0
	}

	for( var m in mergedStat )
	{
		if( m === 'playerId' )
		{
			mergedStat[m] = stats1[m];
		}
		else
		{
			mergedStat[m] += ( stats1[m] ? stats1[m] : 0 );
			mergedStat[m] += ( stats2[m] ? stats2[m] : 0 );
		}
	}

	return mergedStat;
};

PULSE.CLIENT.CRICKET.Utils.fakeOversFractionToOversDecimal = function( string )
{
	var over = 0;
	var BALLS_IN_OVER = 6;
	
    if ( string != null && string.match( "\\d+(\\.\\d)?" ) )
    {
        var index = string.indexOf( "." );
        if ( index == -1 )
        {
            overs = parseInt( string );
        }
        else
        {
            overs = ( parseInt( string.substring( 0, index ) ) ) +
                	( parseFloat( string.substring( index + 1 ) / BALLS_IN_OVER ) );
        }
    }

    return overs;
};

PULSE.CLIENT.CRICKET.Utils.getBPString = function( bp )
{
	return bp.innings + '.' + bp.over + '.' + bp.ball;
};

PULSE.CLIENT.CRICKET.Utils.convertBallsToOvers = function( balls )
{
	if ( balls > 0 )
	{
		return Math.floor( balls / 6 ) + '.' + ( balls % 6 );
	}
	
	return '';
};

PULSE.CLIENT.CRICKET.Utils.getStandingsForValue = function( standing )
{
	if( standing.totalRunsFor )
	{
		var overs = PULSE.CLIENT.CRICKET.Utils.convertBallsToOvers( standing.totalBallsFor );
		return standing.totalRunsFor + '/' + overs;
	}
	else
	{
		return "";
	}
};

PULSE.CLIENT.CRICKET.Utils.getStandingsAgainstValue = function( standing )
{
	if( standing.totalRunsAgainst )
	{
		var overs = PULSE.CLIENT.CRICKET.Utils.convertBallsToOvers( standing.totalBallsAgainst );
		return standing.totalRunsAgainst + '/' + overs;
	}
	else
	{
		return "";
	}
};
if ( !PULSE ) { var PULSE = {}; }
if ( !PULSE.CLIENT ) { PULSE.CLIENT = {}; }

// Constructor
PULSE.CLIENT.Cookie = function( c_name )
{
	this.c_name = c_name || '';
	this.c_value;
	this.ex_minutes = 1 * 60 * 24 * 100; // 100 days by default
	this.json = {};
	this.kojson = {};					//optional - used to convert to and from knockoutjs variables
};

PULSE.CLIENT.Cookie.Delimiter = ';';

PULSE.CLIENT.Cookie.getCookieByKey = PULSE.CLIENT.Cookie.prototype.getCookieByKey = function( key )
{
	var cookieVal = '';
	var results = document.cookie.match( '(^|;) ?' + key + '=([^;]*)(;|$)' );

	if ( results )
	{
		return ( unescape( results[2] ) );
	}
	else
	{
		return cookieVal;
	}

};

PULSE.CLIENT.Cookie.prototype.setName = function( newName )
{
	this.c_name = newName;
};

PULSE.CLIENT.Cookie.prototype.setValue = function( newValue )
{
	this.c_value = newValue;
};

PULSE.CLIENT.Cookie.prototype.setExpireMinutes = function( newValue )
{
	this.ex_minutes = newValue;
};

PULSE.CLIENT.Cookie.prototype.getCookie = function()
{
	var c_name = this.c_name;
	return this.getCookieByKey( c_name );
};

PULSE.CLIENT.Cookie.prototype.setCookie = function()
{
	var c_name = this.c_name;
	var value = this.c_value;
	var ex_minutes = this.ex_minutes;
	var extime = new Date( );
	extime.setTime( extime.getTime( ) + ( ex_minutes * 60 * 1000 ) );
	var c_value = escape( value )
			+ ( ( ex_minutes == null ) ? "" : "; expires="
					+ extime.toUTCString( ) );
	document.cookie = c_name + "=" + c_value;
};

PULSE.CLIENT.Cookie.prototype.saveJSON = function( object )
{
	this.c_value = $.toJSON( object )
	this.setCookie( );
};

PULSE.CLIENT.Cookie.prototype.retiveJSON = function( )
{
	var jsonString = this.getCookie();
	if( jsonString )
	{
		this.json = $.evalJSON( jsonString );
	}
	return this.json;
};


if ( !PULSE ) { var PULSE = {}; }
if ( !PULSE.CLIENT ) { PULSE.CLIENT = {}; }
//This is simple implementation of Set that deals with add,remove, toString, fromString functions.
//Constructor
PULSE.CLIENT.Set = function()
{
	this.object = {};
};

PULSE.CLIENT.Set.Delimiter = ',';

PULSE.CLIENT.Set.prototype.add = function(value)
{		
	this.object[value] = true;	
};

PULSE.CLIENT.Set.prototype.remove = function(value)
{		
	delete this.object[value];	
};

PULSE.CLIENT.Set.prototype.contains = function(value)
{			
	return this.object[value] !== undefined;
};

PULSE.CLIENT.Set.prototype.toString = function()
{		
	var output = '';
	for(var property in this.object)
	{	
		output += property + PULSE.CLIENT.Set.Delimiter;		
	}
	
	if (output.length > 0)
	{
		output = output.substr(0, (output.length-1));
	}
	return output;
};

//return set object populated from the given string, this string MUST NOT contain Delimiter(,) 
PULSE.CLIENT.Set.fromString = function(string)
{		
	var set = new PULSE.CLIENT.Set();
	var fieldsArray = string.split(PULSE.CLIENT.Set.Delimiter);
	for(var i = 0; i < fieldsArray.length; i++)
	{
		set.add(fieldsArray[i]);
	}
	return set;
};

PULSE.CLIENT.Set.prototype.noOfItems = function()
{
	var counter = 0;
	
	for( var property in this.object )
	{		
		counter++;			
	}
	
	return counter;
};

if ( !PULSE ) { var PULSE = {}; }
if ( !PULSE.CLIENT ) { PULSE.CLIENT = {}; }

// This constructor takes 4 parameters: target ( which is a data model ), 
// url, interval( in milliseconds ) and params
PULSE.CLIENT.PollController = function( target, url, interval, params )
{
	this.PLAY2_URL = "http://play2.pulselive.com/";
	this.pollModel = target;
	this.lastData = "";	
	this.pollTimer = new PULSE.CLIENT.JqueryJSONPTimer( { id: 'poll', url: url, interval: interval, callback: 'onPollCallback' }, this.onData, function(){} );

	this.answeredQuestions = new PULSE.CLIENT.Set();
	var ansCookieValue = PULSE.CLIENT.Cookie.getCookieByKey('pulseAnsCookie')
	if ( ansCookieValue.length > 0 )
	{
		this.answeredQuestions = PULSE.CLIENT.Set.fromString(ansCookieValue);
	}

	var that = this;
	PULSE.CLIENT.PollController.getInstance = function () { return that; };
	
	this.pollTimer.start();
};

PULSE.CLIENT.PollController.prototype.onData = function( pollData, id )
{	
	var thisInstance = PULSE.CLIENT.PollController.getInstance();
	
	if ( pollData && pollData[0] )
	{
		var payload = pollData[0];
		
		// Serialise the payload
		var serialised = $.toJSON( payload );
		
	    if ( thisInstance.lastData !== serialised )
	    {
	    	// Save the new data
	    	thisInstance.lastData = serialised;
	    	thisInstance.pollModel.modelChanged( pollData[0] );
	    }
	}
};

PULSE.CLIENT.PollController.prototype.answerQuestion = function( answerIndex, id )
{
	var that = this;
	/* add this que id to answeredQuestions Set and store that Set in ever expiring cookie */
	this.answeredQuestions.add( id );	
	document.cookie = 
		'pulseAnsCookie=' + this.answeredQuestions.toString() + ';expires=30/12/2051 00:00:00';	
	/* inform CMS about this */
	$.ajax(
	{
		dataType: 'jsonp',
	    url: that.PLAY2_URL + 'cms/answerQuestion',  //?questionId=1&option=0',
	    data: { questionId: id, option: answerIndex }	    
	} );
};
if ( !PULSE ) { var PULSE = {}; }
if ( !PULSE.CLIENT ) { PULSE.CLIENT = {}; }

// This constructor
PULSE.CLIENT.PollModel = function( parent )
{		
	this.pulse = parent;
	this.popupTimestamp;
};

PULSE.CLIENT.PollModel.prototype.modelChanged = function( data )
{
	if ( this.pulse.pollView )
	{
		this.pulse.pollView.opinion = data.results;		
		this.pulse.pollView.refreshData();
				
		// Further check for timestamp, if changed then only update/show pop-up box
		if ( data.popupQuestionId && data.timestamp && this.popupTimestamp !== data.timestamp )
		{
			this.pulse.pollView.updatePulsePopup( data.popupQuestionId );				
			this.popupTimestamp = data.timestamp;
		}		
	}
};
if (!PULSE) { var PULSE = {}; }
if (!PULSE.CLIENT) { PULSE.CLIENT = {}; }

PULSE.CLIENT.Template = function()
{
};

PULSE.CLIENT.Template.targets = {};

PULSE.CLIENT.Template.fetch = function(path, done)
{
	var JST = window.JST = window.JST || {};
	var targets = PULSE.CLIENT.Template.targets[path] = PULSE.CLIENT.Template.targets[path] || [];
	var def = new $.Deferred();
    var needToAdd = true;

	// Should be an instant synchronous way of getting the template, if it
	// exists in the JST object.
	if (JST[path])
	{
		if (_.isFunction(done))
		{
			done(JST[path]);
		}
		return;
	}

    for ( var j = 0, jLimit = targets.length; j < jLimit; j++ )
    {
        if ( targets[ j ] === done )
        {
            needToAdd = false;
            break;
        }
    }
    if ( needToAdd )
    {
        targets.push( done );
    }

	// Fetch it asynchronously if not available from JST, ensure that
	// template requests are never cached and prevent global ajax event
	// handlers from firing.
	if( targets.length === 1 )
	{
		$.ajax({
			url: path,
			type: "get",
			dataType: "text",
			cache: false,
			global: false,

			success: function(contents)
			{
				JST[path] = _.template(contents);

				for ( var j = 0, jLimit = targets.length; j < jLimit; j++ )
			    {
			        if (_.isFunction( targets[ j ] ) )
					{
						targets[ j ](JST[path]);
					}
			    }
			}
		});
	}
};

PULSE.CLIENT.Template.fetchMultiple = function( paths, done )
{
	var templates = {};

	for( var i = 0; i < paths.length; i++ )
	{
		var path = paths[i];

		PULSE.CLIENT.Template.fetch( path, function()
		{
			for( var x = 0; x < paths.length; x++ )
			{
				var p = paths[x];

				if( !JST[p] )
				{
					return false;
				}
				else
				{
					templates[p] = JST[p];
				}
			}
			if (_.isFunction(done))
			{
				done(templates);
			}
		} );
	}
};


/**
 * Handy functions to insert templates into the page
 *
 *  -  publish: replaces container contents with template
 *  -  replace: replaces container with template
 *  -  append:  appends template to container
 */

PULSE.CLIENT.Template.publish = function( templateUrl, selector, model, callback )
{
	PULSE.CLIENT.Template.fetch( templateUrl, function(tmpl) {
    	$( selector ).html( tmpl( model ) );

    	if( callback ) 
    		callback();
	} );
};

PULSE.CLIENT.Template.replace = function( templateUrl, selector, model, callback )
{
	PULSE.CLIENT.Template.fetch( templateUrl, function(tmpl) {
    	$( selector ).replaceWith( tmpl( model ) );

    	if( callback ) 
    		callback();
	} );
};

PULSE.CLIENT.Template.append = function( templateUrl, selector, model, callback )
{
	PULSE.CLIENT.Template.fetch( templateUrl, function(tmpl) {
    	$( selector ).append( tmpl( model ) );

    	if( callback ) 
    		callback();
	} );
};

PULSE.CLIENT.Template.prepend = function( templateUrl, selector, model, callback )
{
    PULSE.CLIENT.Template.fetch( templateUrl, function(tmpl) {
        $( selector ).prepend( tmpl( model ) );

        if( callback ) 
            callback();
    } );
};

PULSE.CLIENT.Template.compareAndPublish = function( templateUrl, selector, model, callback )
{
	PULSE.CLIENT.Template.fetch( templateUrl, function(tmpl) {
		if( $( selector ).get(0) !== $( tmpl( model ) ).get(0) )
		{
			$( selector ).replaceWith( tmpl( model ) );
			if( callback ) 
			{
    			callback();
    		}
		}
	} );
};

PULSE.CLIENT.Template.getHtml = function( templateUrl, model )
{
    var html = "";
    if( JST[ templateUrl ] )
    {
        PULSE.CLIENT.Template.fetch( templateUrl, function( tmpl )
        {
            html = tmpl( model );
        } );
    }
    return html;
};
/**
 *     Common library to hold most-used twitter code to handle
 *     click events such as tweeting with custom parameters,
 *     retweeting, favouriting etc.
 */


if (!PULSE)
{
    var PULSE = {};
}
if (!PULSE.CLIENT)
{
    PULSE.CLIENT = {};
}
if (!PULSE.CLIENT.TwitterController)
{
    PULSE.CLIENT.TwitterController = {};
}

/**
 * Creates a new window for a specific twitter event; determines the type of event
 * through the 'intent' parameter
 *
 * More info at: https://dev.twitter.com/docs/intents
 *
 * @param  {String} intent - can be: 'tweet', 'favorite', 'retweet'
 * @param  {Object} params - optional; describes additional tweet params
 * @param  {Number} w      - optional; the width of the pop-up window created
 * @param  {Number} h      - optional; the height of the pop-up window created
 */
PULSE.CLIENT.TwitterController.tweetEvent = function(intent, params, w, h)
{
    var TC = PULSE.CLIENT.TwitterController;

    var width = w || 575,
        height = h || 400,
        left = ($(window).width() - width) / 2,
        top = ($(window).height() - height) / 2,
        options = 'status=1' +
            ',width=' + width +
            ',height=' + height +
            ',top=' + top +
            ',left=' + left;

    var tweetUrl = TC.getIntentUrl(intent, params);

    window.open(tweetUrl, 'twitter', options);
};

/**
 * Returns a URL to call the Twitter API
 * More info at: https://dev.twitter.com/docs/intents
 *
 * @return {String} - the intent URL, complete with added params
 */
PULSE.CLIENT.TwitterController.getIntentUrl = function(intent, params)
{
    var TC = PULSE.CLIENT.TwitterController,
        paramsString = TC.prepareParams(params);

    return "https://twitter.com/intent/" + intent + paramsString;
};

PULSE.CLIENT.TwitterController.getPermalink = function(tweet)
{
    var userName = tweet.user.screen_name;
    var userUrl = PULSE.CLIENT.TwitterController.getUserAccountUrl(userName);

    return userUrl + "/status/" + tweet.id_str;
};

PULSE.CLIENT.TwitterController.prepareParams = function(params)
{
    var paramsArray = [];
    $.each(params, function(key, value)
    {
        var keyValuePair = [key, encodeURIComponent(value)];
        paramsArray.push(keyValuePair.join("="));
    });

    return "?" + paramsArray.join("&");
};

PULSE.CLIENT.TwitterController.getUserAccountUrl = function(screenName)
{
    return "http://twitter.com/" + screenName;
};

PULSE.CLIENT.TwitterController.getSearchTagUrl = function(topic)
{
    return "http://twitter.com/search?q=%23" + topic;
};

/**
 * Utility method to scan the given String for what look like HTTP links,
 * Twitter handles and hashtags (called entities), and mark them up with <a> tags.
 *
 * For URLs and media links, use expanded_url as the title and use the
 * display_url provided by Twitter as the text of the anchor tag
 *
 * See: https://dev.twitter.com/docs/tco-url-wrapper/best-practices
 *
 * @param  {String} string   - the original body of the tweet
 * @param  {Object} entities - mapping of types of entities to an array of entity objects
 * @return {String}          - the processed body of the tweet, with anchor tags
 */
PULSE.CLIENT.TwitterController.markUpLinks = function(string, entities)
{
    // to support the old way of doing things, when entities weren't use
    // to determine links to pages or media and the URL was directly processed
    // from the tweet text body
    if (!entities)
    {
        string = string.replace(/(https{0,1}:\/\/\S+)/g, '<a target="_blank" href="$1">$1</a>')
            .replace(/@(\S+)/g, '<a target="_blank" href="http://twitter.com/$1">@$1</a>')
            .replace(/#(\S+)/g,
                '<a target="_blank" href="http://twitter.com/#!/search?q=%23$1">#$1</a>');

        return string;
    }

    // extrapolate URLs from the identified entities of the tweet
    var entitiesArray = [];

    if (entities.urls)
    {
        for (var i = 0, iLimit = entities.urls.length; i < iLimit; i++)
        {
            var entity = entities.urls[i];

            var html = '<a href="' +
                entity.url +
                '" title="' +
                entity.expanded_url +
                '" target="_blank">' +
                entity.display_url +
                '</a>';

            entitiesArray.push(
            {
                html: html,
                original: entity.url,
                start: entity.indices[0],
                end: entity.indices[1]
            });
        }
    }

    // extrapolate URLs from the identified entities of the tweet
    if (entities.media)
    {
        for (var i = 0, iLimit = entities.media.length; i < iLimit; i++)
        {
            var entity = entities.media[i];

            var html = '<a href="' +
                entity.url +
                '" title="' +
                entity.expanded_url +
                '" target="_blank">' +
                entity.display_url +
                '</a>';

            entitiesArray.push(
            {
                html: html,
                original: entity.url,
                start: entity.indices[0],
                end: entity.indices[1]
            });
        }
    }

    if (entities.user_mentions)
    {
        for (var i = 0, iLimit = entities.user_mentions.length; i < iLimit; i++)
        {
            var entity = entities.user_mentions[i];

            var url = PULSE.CLIENT.TwitterController.getUserAccountUrl(entity.screen_name);

            var html = '<a href="' +
                url +
                '" target="_blank">&#64;' +
                entity.screen_name +
                '</a>';

            entitiesArray.push(
            {
                html: html,
                original: '@' + entity.screen_name,
                start: entity.indices[0],
                end: entity.indices[1]
            });
        }
    }

    if (entities.hashtags)
    {
        for (var i = 0, iLimit = entities.hashtags.length; i < iLimit; i++)
        {
            var entity = entities.hashtags[i];

            var url = PULSE.CLIENT.TwitterController.getSearchTagUrl(entity.text);

            var html = '<a href="' +
                url +
                '" target="_blank">&#35;' +
                entity.text +
                '</a>';

            entitiesArray.push(
            {
                html: html,
                original: '#' + entity.text,
                start: entity.indices[0],
                end: entity.indices[1]
            });
        }
    }

    /**
     * Since the entities are ordered by type, sort the array by their start indice,
     * so they are in the order of appearances
     */
    entitiesArray.sort(function(a, b)
    {
        return a.start - b.start;
    });

    // re-do start/end indices for entities
    // this is a fix accounting for two-byte characters read as ASCII
    for (var i = 0, iLimit = entitiesArray.length; i < iLimit; i++)
    {
        var entity = entitiesArray[i];

        var lowercaseString = string.toLowerCase();
        var lowercaseOriginal = entity.original.toLowerCase();
        entity.start = lowercaseString.search( lowercaseOriginal );
        entity.end = entity.start + entity.original.length;
    }

    /**
     * The new tweet body, with anchor tags rather than just plain text
     * @type {String}
     */
    var newString = '';

    /**
     * Used to determine where in the original tweet body we're last
     * @type {Number}
     */
    var previousIdx = 0;

    /**
     * Go through all entities (if any) and replace their plain text version with
     * their anchor-tag equivalents
     * @type {Number}
     */
    for (var i = 0, iLimit = entitiesArray.length; i < iLimit; i++)
    {
        var entity = entitiesArray[i];
        var length = entity.start - previousIdx;

        newString += string.substr(previousIdx, length);
        newString += entity.html;

        previousIdx = entity.end;
    }

    /**
     * At the end, add what's left of the original string
     */
    newString += string.substr(previousIdx);

    return newString;
};

// pass in the 'created_at' string returned from twitter
// stamp arrives formatted as Tue Apr 07 22:52:51 +0000 2009
PULSE.CLIENT.TwitterController.parseTwitterDate = function(timestamp)
{
    var date = new Date(Date.parse(timestamp));
    if (K.ie)
    {
        date = Date.parse(timestamp.replace(/( \+)/, ' UTC$1'))
    }

    return date;
};

// from http://widgets.twimg.com/j/1/widget.js
var K = function()
{
    var a = navigator.userAgent;
    return {
        ie: a.match(/MSIE\s([^;]*)/)
    }
}();


PULSE.CLIENT.TwitterController.getMediaImg = function(entities, index)
{

    var idx = typeof index === 'undefined' ? 0 : index,
        img;

    for (var type in entities)
    {

        if (entities.hasOwnProperty(type) && type === 'media')
        {

            var media = entities[type],
                entry = media[idx];

            img = entry.media_url;
        }
    }

    return img
}
if ( !PULSE )                   { var PULSE = {}; }
if ( !PULSE.CLIENT )            { PULSE.CLIENT = {}; }

// This is a utility file that deals with various kinds of date manipulation
PULSE.CLIENT.DateUtil = function()
{};

PULSE.CLIENT.DateUtil.DAYS_IN_A_WEEK = 7;
PULSE.CLIENT.DateUtil.MONTHS_IN_A_YEAR = 12;

/**
 * Takes a date string ( supports 'yyyy-mm-dd' & 'yyyy-mm-ddTHH:MM:SS+0100' formats ) as a parameter
 * @param  {String} dateStr - ISO 8601 date string
 * @return {Date}           - JavaScript date object
 */
PULSE.CLIENT.DateUtil.parseDateTime = function( dateStr )
{
    if( !dateStr )
    {
        return;
    }

    var date = new Date( dateStr );

    if( isDateValid( date ) )
    {
        return date;
    }
    else
    {
        var dateTime = dateStr.split('T');
        if ( dateTime.length === 1 )
        {
            return new Date( dateTime[0].replace( /\-/g, '/' ) );
        }
        else if ( dateTime.length === 2 )
        {
            // we only want to replace the hyphens of date bit (there might be hypens(minus) as in GMT-0200)
            var aDate1 = dateTime[0].replace( /\-/g, '/' );
            var aDate2 = dateTime[1];
            var newDate = aDate1 + ' ' + aDate2;

            date = new Date( newDate );
        }

        if( isDateValid( date ) )
        {
            return date;
        }
        else
        {
            window.console.log( 'Invalid Date String ' + dateStr );
        }
    }
};

window.isDateValid = function( date )
{
    if( Object.prototype.toString.call( date ) === "[object Date]" )
    {
        // it is a date
        if( isNaN( date.getTime() ) )
        {
            return false;
        }
        else
        {
            return true;
        }
    }
    else
    {
        return false;
    }
};

// PULSE.CLIENT.DateUtil.parseDateTime

/**
 * Takes a valid date object and returns the month either full name or partial,
 * based on fullName boolean flag
 */
PULSE.CLIENT.DateUtil.getMonth = function( dateObj, fullName )
{
    var monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
            "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

    var month = dateObj.getMonth();

    if ( fullName )
    {
        month = month + PULSE.CLIENT.DateUtil.MONTHS_IN_A_YEAR;
    }

    return monthNames[ month ];
};

PULSE.CLIENT.DateUtil.getMonthNumber = function(date)
{
    var month = date.getMonth() + 1;

    if (month < 10) {

        return '0' + month;
    }
    return month;
}

PULSE.CLIENT.DateUtil.getDaysAgo = function(stamp)
{
    var timeStamp = parseInt(stamp.toString().replace(/,/g ,'')),
                dateObject = new Date( timeStamp ),
                thisDate = new Date(Date.now()),
                difference = thisDate.getTime() - dateObject.getTime(),
                diffSecs,
                diffMins,
                diffHours,
                diffDays,
                timeAgo = '';

            diffSecs =  Math.round(difference / (1000));
            diffMins = Math.round(difference / (1000 * 60));
            diffHours = Math.round(difference / (1000 * 3600));
            diffDays = Math.round(difference / (1000 * 3600 * 24));

            if (diffSecs < 60)
            {
                if (diffSecs < 1)
                {
                    timeAgo = diffSecs + ' secs ago';
                }
                else
                {
                    timeAgo = diffSecs + ' sec ago';
                }
            }
            else if (diffMins < 60)
            {
                if (diffMins > 1)
                {
                    timeAgo = diffMins + ' mins ago';
                }
                else
                {
                    timeAgo = diffMins  + ' min ago';
                }
            }
            else if (diffHours < 24)
            {
                if (diffHours > 1)
                {
                    timeAgo = diffHours + ' hours ago';
                }
                else
                {
                    timeAgo = diffHours + ' hour ago';
                }
            }
            else
            {
                if (diffDays > 1)
                {
                    timeAgo = diffDays + ' days ago';
                }
                else
                {
                    timeAgo = diffDays + ' day ago';
                }
            }

        return timeAgo;
}


PULSE.CLIENT.DateUtil.getFullMonthFromShort = function(monthShort)
{
    monthFull = '';
        switch(monthShort)
    {
        case ('Jan'):
            monthFull = 'January';
            break;
        case ('Feb'):
            monthFull = 'February';
            break;
        case ('Mar'):
            monthFull = 'March';
            break;
        case ('Apr'):
            monthFull = 'April';
            break;
        case ('May'):
            monthFull = 'May';
            break;
        case ('Jun'):
            monthFull = 'June';
            break;
        case ('Jul'):
            monthFull = 'July';
            break;
        case ('Aug'):
            monthFull = 'August';
            break;
        case ('Sep'):
            monthFull = 'September';
            break;
        case ('Oct'):
            monthFull = 'October';
            break;
        case ('Nov'):
            monthFull = 'November';
            break;
        case ('Dec'):
            monthFull = 'December';
            break;
        default:
            monthFull = undefined;
    }

    return monthFull;

}

/**
 * Takes a valid date object and returns the week day either full name or partial,
 * based on fullName boolean flag
 */
PULSE.CLIENT.DateUtil.getWeekDay = function( dateObj, fullName )
{
    var dayNames = [
            "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];

    var day = dateObj.getDay();

    if ( fullName )
    {
        day = day + PULSE.CLIENT.DateUtil.DAYS_IN_A_WEEK;
    }

    return dayNames[ day ];
};

PULSE.CLIENT.DateUtil.getDayNumber = function(date)
{
    var day = date.getDate();

    if (day < 10) {

        return '0' + day;
    }

    return day;
}


/**
 * Takes a valid date object and returns the date with or without suffix,
 * based on withSuffix boolean flag
 */
PULSE.CLIENT.DateUtil.getDate = function( dateObj, withSuffix )
{
    var d = dateObj.getDate();

    if ( withSuffix )
    {
        return d + ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10];
    }

    return d;
};

/**
 * Takes a valid date object and returns the date-time string after taking
 * care of timezone offset
 */
PULSE.CLIENT.DateUtil.calcTimeByOffset = function( dateObj, offset )
{
    // convert to msec
    // add local time zone offset
    // get UTC time in msec
    var localTime       = dateObj.getTime(),
        timezoneOffset  = dateObj.getTimezoneOffset() * 60000;

    var utc = localTime + timezoneOffset;

    // create new Date object for different city
    // using supplied offset
    var utcDate = new Date ( utc );
    var convertedDate = new Date( utc + ( 3600000 * offset ) );

    var time = convertedDate.getHours() + ':' + (convertedDate.getMinutes() + '' < '10' ? '0' : '' ) + convertedDate.getMinutes()

    // return date and time in a object
    return {
        date : convertedDate.toLocaleDateString(),
        time : time
    };
};

/**
 * Gets a date object (corresponding to the local time and date) and returns
 * the UTC date object
 */
PULSE.CLIENT.DateUtil.getUtcDateObject = function convertDateToUTC( date )
{
    return new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
    );
};

PULSE.CLIENT.DateUtil.getUtcTime = function ( dateStr )
{
    // parseDateTime gives you local date-time
    var matchDate   = PULSE.CLIENT.DateUtil.parseDateTime( dateStr );

    if ( matchDate )
    {
        var utcDate                 = PULSE.CLIENT.DateUtil.getUtcDateObject( matchDate ),
            formattedUTCDateTime    = dateFormat( utcDate, 'dddd mmmm dS yyyy|HH:MM| Z' ).split( "|" ),
            utcTime                 = formattedUTCDateTime[1];

        return utcTime;
    }
};

PULSE.CLIENT.DateUtil.getTimeFromTimestamp = function ( dateStr, offset, timeFormat )
{
    // Default values
    if( !offset )
    {
        offset = 0;
    }
    if( !timeFormat )
    {
        timeFormat = "HH:MM";
    }

    // parseDateTime gives you local date-time
    var matchDate   = PULSE.CLIENT.DateUtil.parseDateTime( dateStr ),
        offsetDate  = matchDate ? new Date( matchDate.getTime() + ( 3600000 * offset ) ) : undefined;

    if ( offsetDate )
    {
        var utcDate           = PULSE.CLIENT.DateUtil.getUtcDateObject( offsetDate ),
            formattedDateTime = dateFormat( utcDate, 'dddd mmmm dS yyyy|' + timeFormat + '| Z' ).split( "|" ),
            utcTime           = formattedDateTime[1];

        return utcTime;
    }
};

PULSE.CLIENT.DateUtil.getDateFromTimestamp = function ( dateStr, offset, desiredFormat )
{
    // Default values
    if( !offset )
    {
        offset = 0;
    }
    if( !desiredFormat )
    {
        desiredFormat = 'dd mmmm yyyy';
    }

    // parseDateTime gives you local date-time
    var matchDate   = PULSE.CLIENT.DateUtil.parseDateTime( dateStr ),
        offsetDate  = matchDate ? new Date( matchDate.getTime() + ( 3600000 * offset ) ) : undefined;

    if ( offsetDate )
    {
        var utcDate           = PULSE.CLIENT.DateUtil.getUtcDateObject( offsetDate ),
            formattedDateTime = dateFormat( utcDate, desiredFormat + '|HH:MM| Z' ).split( "|" ),
            formattedDate     = formattedDateTime[0];

        return formattedDate;
    }
};

PULSE.CLIENT.DateUtil.getSinceString = function( date, format )
{
    if( date )
    {
        var now = new Date();

        var diff = Math.floor( ( now - date ) / 1000 );

        if( diff <= 0 )
        {
            return format ? format.justNow : "just now";
        }
        else if( diff < 60 )
        {
            var output = Math.round( diff );
            return output + ( format ? format.seconds : "s" );
        }
        else if( diff < 60 * 60 )
        {
            var output = Math.round( diff / 60 );
            return output + ( format ? format.minutes : "m" );
        }
        else if( diff < 60 * 60 * 24 )
        {
            var output = Math.round( diff / ( 60 * 60 ) );
            return output + ( format ? format.hours : "h" );
        }
        else
        {
            var output = Math.round( diff / ( 60 * 60 * 24 ) );
            return output + ( format ? format.days : "d" );
        }
    }
};

PULSE.CLIENT.DateUtil.getFormattedEventDate = function( dateString, dateFormatString )
{
    var date = PULSE.CLIENT.DateUtil.parseDateTime( dateString ),
        utcDate = PULSE.CLIENT.DateUtil.getUtcDateObject( date );

    if( utcDate )
    {
        var formattedDateString = dateFormat( utcDate, dateFormatString ).split('|')[0];
        return formattedDateString;
    }
};
if ( !PULSE ) { var PULSE = {}; }
if ( !PULSE.CLIENT ) { PULSE.CLIENT = {}; }

//Constructor
PULSE.CLIENT.Util = function()
{};

PULSE.CLIENT.Util.getValueOrBlank = function( value )
{
	if ( value === null )
	{
	    return '';
	}
	else
	{
		return value;
	}
};

PULSE.CLIENT.Util.getValueOrNBSP = function( value )
{
	if ( value === null )
	{
	    return '&nbsp';
	}
	else
	{
		return value;
	}
};

PULSE.CLIENT.Util.CreatePlayerLookup = function( teams, withTeam )
{
	var playerLookup = {};
	for ( var i = 0, ilimit = teams.length; i < ilimit; i++ )
	{
		var team = teams[i];
		var players = team.players;
		if( players )
		{
			for ( var j = 0, jlimit = players.length; j < jlimit; j++ )
			{
				var player = players[j];
				if( withTeam )
				{
					player.teamIds = [ team.team.id ];
				}
				playerLookup[ player.id ] = player;
			}
		}
	}
	return playerLookup;
};

PULSE.CLIENT.Util.CreateSquadToMatchesLookup = function( schedule, tournamentName )
{
	var squadsLookup = {};
	for ( var i = 0, ilimit = schedule.length; i < ilimit; i++ )
	{
		var match = schedule[i],
			team1 = match.team1,
			team2 = match.team2;

		if( team1 && team2
			&& team1.team
			&& team2.team )
		{
			if( !squadsLookup[ team1.team.id ] )
			{
				squadsLookup[ team1.team.id ] = [];
			}
			squadsLookup[ team1.team.id ].push( {
				matchId: match.matchId.name ,
				tournamentName: tournamentName
			} );

			if( !squadsLookup[ team2.team.id ] )
			{
				squadsLookup[ team2.team.id ] = [];
			}
			squadsLookup[ team2.team.id ].push( {
				matchId: match.matchId.name ,
				tournamentName: tournamentName
			} );
		}
	}
	return squadsLookup;
};

PULSE.CLIENT.Util.GetCurrentInnings = function( data )
{
	var innings = null;
	if ( data.innings && data.currentState )
	{
		innings = data.innings[ data.currentState.currentInningsIndex ];
	}
	return innings;
};

PULSE.CLIENT.Util.isInt = function( number )
{
	return typeof(number)=='number'&&parseInt(number)==number;
};

/**
 * Function which determines whether a certain match is upcoming
 * @param match index
 * @return match date OR false
 */
PULSE.CLIENT.Util.isUpcomingMatch = function( index, schedule )
{
	var match = schedule[ index ];
	if( match.matchState === "U" )
	{
		return PULSE.CLIENT.DateUtil.parseDateTime( match.matchDate );
	}
	else
	{
		return false;
	}
}

/**
 * This method retrieves team abbreviation based on the index (0|1) in their original case.
 */
PULSE.CLIENT.Util.GetTeamAbbr = function ( data, index )
{
	var teamObj = data.teams[ index ];
	if ( teamObj )
	{
		return teamObj.team.abbreviation;
	}

	return '';
};

/**
 * Returns an object that wraps batting team related data.
 */
PULSE.CLIENT.Util.GetBattingTeamObject = function( data, inningsIdx )
{
	var teamIdx = data.matchInfo.battingOrder[ inningsIdx ];
	return data.matchInfo.teams[ teamIdx ];
};


// this takes an array of minutes and return the time in format 1h 1m
PULSE.CLIENT.Util.getMatchDuration = function( durations )
{
	if(durations)
	{
		var minutes = 0;
		var formattedTime = '';

		for( var i = 0; i < durations.length; i++ )
		{
			if( !isNaN( parseInt( durations[i] ) ) )
			{
				minutes = minutes + parseInt( durations[i] );
			}
		}

		var hr = Math.floor( minutes / 60 );
		var min = Math.floor( ( minutes % 60 ) );

		if( minutes === 0 )
		{
		    return '';
		}
		else if( hr === 0 && min !== 0 )
		{
		    return min + 'm';
		}
		else if(  hr !== 0 && min === 0 )
		{
		    return hr + 'h';
		}
		else
		{
		    return  hr + 'h ' + min + 'm';
		}
	}
	return '';
};

//this function looks for the given param name in the query string and returns its value
PULSE.CLIENT.Util.getParamValueByName = function( name )
{
	if( name )
	{
		var paramVal = unescape((RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]);

		return paramVal;
	}

	return 'null';
};

//this function retrieves the params object from a standard jsonCallback where data = [{params:{},success:}]
PULSE.CLIENT.Util.getDataFromJsonCallback = function( data )
{
	var dataObj = data[0];
	if ( dataObj )
	{
		if ( dataObj.success )
		{
			return dataObj.params;
		}
	}

	return null;
};

PULSE.CLIENT.Util.applyActiveClass = function( selector, selectedIndex, className )
{
	$( selector ).removeClass( className );
	$( selector ).eq( selectedIndex ).addClass( className );
};

PULSE.CLIENT.Util.parseUrlParameters = function ()
{
	var url = window.location.href;
	var params = {};
	var idx = url.indexOf( '?' );
	if ( idx > -1 )
	{
		var paramString = url.substr( idx + 1 );
		var paramArray = paramString.split( '&' );
		for ( var i = 0, ilimit = paramArray.length; i < ilimit; i++ )
		{
			var param = paramArray[i];
			var eq = param.indexOf( '=' );

			if ( eq > -1 )
			{
				var key = unescape( param.slice( 0, eq ) );
				var val = param.slice( eq + 1 ).split('#');
				val = unescape( val[0] );
				params[ key ] = val;
			}
			else
			{
				params[ unescape( param ) ] = true;
			}
		}
	}
	return params;
};

PULSE.CLIENT.Util.isEmptyObject = function( obj )
{
	var counter = 0;

	for( var property in obj )
	{
		counter++;
	}

	return counter === 0;
};

// Returns true if given two array are same ( uses jQuery )
PULSE.CLIENT.Util.isSimilarArray = function( arr1, arr2 )
{
	if ( arr1 && arr2 )
	{
		return $(arr1).not(arr2).length === 0 && $(arr2).not(arr1).length === 0;
	}

	return false;
};

PULSE.CLIENT.Util.objectFoundById = function ( arr, obj )
{
	for ( var i = 0; i < arr.length; i++ )
	{
		var t = arr[i];
		if ( obj.id === t.id )
		{
			return true;
		}
	}

	return false;
};

PULSE.CLIENT.Util.getFormattedDate = function ( ISO8601DateString, desiredFormat )
{
	var matchDate = PULSE.CLIENT.DateUtil.parseDateTime( ISO8601DateString );
	//console.log(ISO8601DateString + ' ---- ' + matchDate);
	if ( matchDate )
	{
		return matchDate.format( desiredFormat || 'dd mmmm yyyy' );
	}
	return "";
};


PULSE.CLIENT.Util.$hide = function( $element )
{
	$element.css({ position: "absolute", visibility: "hidden", display: "block" });
};

PULSE.CLIENT.Util.$show = function( $element )
{
	$element.css({ position: "", visibility: "", display: "" });
};


/*
String.prototype.trim = function(){return
    (this.replace(/^[\s\xA0]+/, "").replace(/[\s\xA0]+$/, ""))}
*/
String.prototype.startsWith = function(str)
    {return (this.match("^"+str)==str)}

String.prototype.endsWith = function(str)
    {return (this.match(str+"$")==str)}

PULSE.CLIENT.Util.getPlayerNames = function( fullName )
{
	var names 		= fullName.split( ' ' ),
		firstName	= names[0],
		secondName 	= names.slice( 1 ).join( ' ' );

	return {firstName : firstName, secondName : secondName };
};

PULSE.CLIENT.Util.toOrdinal = function( n, $wrap )
{
    var s = ["th","st","nd","rd"],
    	v = n % 100;

    if( typeof $wrap === "undefined" )
    {
    	return n+(s[(v-20)%10]||s[v]||s[0]);
    }
    else
    {
    	return n + $('<div>').append($wrap.text( s[(v-20)%10]||s[v]||s[0] )).html();
    }
};

PULSE.CLIENT.Util.layerIdxInArray = function( array, id )
{
	for( var i = 0; i < array.length; i++ )
	{
		if( array[i].playerId === id )
		{
			return i;
		}
	}
	return -1;
};

PULSE.CLIENT.Util.keyFromValue = function( object, value )
{
	for( var property in object )
	{
		if( object[property] === value )
		{
			return property;
		}
	}
};

/**
 * @deprecated
 * Use commafy instead
 */
PULSE.CLIENT.Util.addCommaForThousands = function( number )
{
	if( number === "0" )
	{
		return "0";
	}

	var output = [],
		remainder = number % 1000,
		result = Math.floor( number / 1000 );

	var normaliseRemainder = function( remainder )
	{
		if( remainder < 100 )
		{
			if( remainder < 10 )
			{
				remainder = "00" + remainder;
			}
			else
			{
				remainder = "0" + remainder;
			}
		}

		return remainder;
	};

	output.push( result ? normaliseRemainder(remainder) : remainder );
	while( result )
	{
		remainder = result % 1000;
		result = Math.floor( result / 1000 );
		output.push( result ? normaliseRemainder(remainder) : remainder );
	}

	return output.reverse().join(',');
};

PULSE.CLIENT.Util.commafy = function ( value )
{
	if ( typeof value === 'undefined' )
	{
		return '';
	}
	return value.toString().replace( /.(?=(?:.{3})+$)/g, '$&,' );
};

PULSE.CLIENT.Util.getArrayFromString = function( string )
{
	if( !string )
	{
		return [];
	}

	var array = string.split(',');
	for( var i = 0; i < array.length; i++ )
	{
		array[i] = $.trim( array[i] );
	}
	return array;
};

PULSE.CLIENT.Util.prepareParams = function( params )
{
	var paramsArray = [];
    $.each( params, function( key, value ) {
    	// only add param if its value exists
    	// if the value's an array, make sure it's not empty
    	if( typeof value !== 'undefined' && ( Object.prototype.toString.call( value ) !== '[object Array]' || value.length ) )
    	{
    		value = [].concat( value ).join(",");
	        var keyValuePair = [ key, encodeURIComponent( value ) ];
	        paramsArray.push( keyValuePair.join("=") );
    	}
    } );

    return "?" + paramsArray.join( "&" );
};

PULSE.CLIENT.Util.getSafeCssClass = function(teamAbbr) {
	return teamAbbr.split('&').join('');
};

PULSE.CLIENT.Util.getKeyValuesFromString = function(string, delimiter)
{
	var parts = string.split(delimiter),
		retObj = {};

	 for (var i=0, length = parts.length; i < length; i++)
	 {
	 	var thisPart = parts[i];
	 	var keyVal = thisPart.split(':');

	 	retObj[keyVal[0]] = keyVal[1];
	 }

	return retObj;
}

PULSE.CLIENT.Util.isScoringID = function(meta)
{
	if (meta.fileName && meta.fileName === 'scoring')
	{
		return true;
	}
};

/**
 * Given a jQuery element, it establishes whether it's empty or not
 * @param  {Object}  $el
 * @return {Boolean} true if the element is empty (or only has spaces), false otherwise
 */
PULSE.CLIENT.Util.isEmpty = function( $el )
{
    return !$.trim( $el.html() );
};

/**
 * Gets the font size of the body; used to do em to px and vice versa conversions
 * @return {Number} the font size, or undefined, if somehow no font size
 */
PULSE.CLIENT.Util.getFontSize = function()
{
	var size = parseFloat( $( 'body' ).css( 'font-size' ) );

	if( !isNaN( size ) )
	{
		return size;
	}
};

/**
 * Converts em to pixels based on the page's font size; it defaults
 * to 16px per em if no font size can be detected
 * @param  {Number} em value in em to be converted
 * @return {Number}    value in pixels
 */
PULSE.CLIENT.Util.emToPx = function( em )
{
	var fontSize = PULSE.CLIENT.Util.getFontSize() || 16;
	return fontSize * em;
};

/**
 * Converts pixels to em based on the page's font size; it defaults
 * to 16px per em if no font size can be detected
 * @param  {Number} px value in em to be converted
 * @return {Number}    value in em
 */
PULSE.CLIENT.Util.pxToEm = function( px )
{
	var fontSize = PULSE.CLIENT.Util.getFontSize() || 16;
	return px / fontSize;
};

if ( !PULSE ) { var PULSE = {}; }

/** A simple static class to control the speed mode in the client. */
PULSE.SpeedModeController = {
		
		// MPH to KMH convertion unit
		MPH_TO_KMH : 1.609,
		// M/S to Km/h
		MPS_TO_KMH : 3.6,
		
		// Available modes
		MODE_MPH : 'mph',
		MODE_KMH : 'kmh',
		
		MPH_UNIT : 'mph',
		KMH_UNIT : 'km/h',
		
		// Current mode and unit
		mode : 'mph',
		unit : 'mph',
		
		setMode : function( mode )
		{
			this.mode = mode;
			this.unit = mode === this.MODE_KMH ? this.KMH_UNIT : this.MPH_UNIT; 
		},
		
		// Converts miles per hour to kilometers per hour
		mphToKmh : function( mph )
		{
			return mph * this.MPH_TO_KMH; 
		},
		
		// Converts metres per sec to kilometers per hour
		mpsToKmh : function( mps )
		{
			return mps * this.MPS_TO_KMH; 
		}
};
//appends pre-loading divs to a container element
//inserts a new image to the container
//default to a backup image if the image doesnt load

(function( $ ){

	$.fn.imgLoader = function( desiredImg, backupImg/*, height, width */ )
	{
		var that = this,
			height = this.height(),
			width = this.width();
		
		//empty the containing element
		this.empty();
		
		//create the preloader 
		var $loadOverlay = 
		$( '<div>' ).addClass( 'loadOverlay' )
		.hide()
		.append(
			$( '<div>' ).addClass( 'loadOverlayContent' )
			.append(
				$( '<div>' ).addClass( 'loadAnimate' )
			)
		);
		
		//create the img element 
		var $img = $( '<img>' );
		
		//append overlay
		$loadOverlay.appendTo( this );

		//append image
		//potentially append once fade in is complete
		$img.appendTo( that );
		
		//fadeIn
		$loadOverlay.fadeIn( 'slow', function()
		{ 
			
			$img
			.attr( 'src', desiredImg )
			.each(function() {
				if( this.complete )
				{
					//if the image was cached, fadeOut straight away
					$loadOverlay.fadeOut();
				}
				else
				{
					$(this).load( function()
					{
						//if the image was not cached, when the image loads, fadeOut
						$(this).data( 'loadAttempted', true );
						$loadOverlay.fadeOut();
					} )
				}
			} )
			.error( function() { if(!$(this).data('loadAttempted')){ $(this).attr( 'src', backupImg ); $loadOverlay.fadeOut(); $(this).data( 'loadAttempted', true ) } } );
		} );
		
		
	};
})( jQuery );
if( !PULSE ) { var PULSE = {}; }
if( !PULSE.CLIENT ) { PULSE.CLIENT = {}; }
if( !PULSE.CLIENT.CRICKET ) { PULSE.CLIENT.CRICKET = {}; }

PULSE.CLIENT.CRICKET.getAPICaller = function( config )
{
    return new PULSE.CLIENT.CRICKET.APICaller(
        $.extend( {
            live: PULSE.CLIENT.isTest() === false,
            //productionBaseUrl: "http://www.icc-cricket.com/api",
            //testBaseUrl: "http://testcma.icc-cricket.com/api",
            //productionVideoBaseUrl: "http://www.icc-cricket.com/apiVideo",
            //testVideoBaseUrl: "http://www.icc-cricket.com/apiVideo",
            //testFeedUrl: 'http://testcma.icc-cricket.com/feeds',
            //playerRankingsUrl: 'http://msapi.pulselive.com/prapi/'
        }, config || {} ) );
};

PULSE.CLIENT.CRICKET.APICaller = function( config )
{
    this.config = config;
    this.live = config.live;
    this.APIs = {
        production: config.productionBaseUrl,
        test: config.testBaseUrl,
        productionVideo: config.productionVideoBaseUrl,
        testVideo: config.testVideoBaseUrl,
        testFeed: config.testFeedUrl,
        playerRankings: config.playerRankingsUrl,
        testPhotos: config.testPhotos,
        prodPhotos: config.prodPhotos
    };

    // creates the DM instance if it doesn't already exist
    if ( window.datamgr === undefined )
    {
        window.datamgr = new PULSE.CLIENT.JqueryJSONPDataManager();
    }

    this.dm = window.datamgr;
};

PULSE.CLIENT.CRICKET.APICaller.prototype.makeFeedUrl = function( type, params )
{
    // Establish the feed depending on whether the API's looking at live or test data
    var feed = this.getFeedBaseUrl( type );
    // Prepare the call parameters such as limit, asc/desc and establish callback
    params = this.prepareParams( $.extend( params,
    {
        callback: 'on' + type
    } ) );

    // console.log( feed + "/get" + type + params );
    return feed + "/get" + type + params;
};

PULSE.CLIENT.CRICKET.APICaller.prototype.getFeedBaseUrl = function( type )
{
    if ( type === "Videos" )
    {
        return !this.live ? this.APIs.testVideo : this.APIs.productionVideo;
    }
    else if( type === 'ImageGalleries' )
    {
        return !this.live ? this.APIs.testPhotos || this.APIs.testFeed : this.APIs.prodPhotos || this.APIs.prodFeed;
    }
    return !this.live ? this.APIs.test : this.APIs.production;
};

/**
 *  Request videos feed
 *  @params
 *      feedId - string used by the onData method to identify the feed
 *      target - which onData methods to call
 *      params - can be order, limit, fields etc.
 *      start  - whether the feed starts itself or not
 */
PULSE.CLIENT.CRICKET.APICaller.prototype.getVideos = function( feedId, target, params, start )
{
    var feedUrl = this.makeFeedUrl( 'Videos', params );
    this.dm.addFeed( feedId, feedUrl, 600, 'onVideos', [].concat( target ) );
    if ( start )
    {
        this.dm.start( feedUrl );
    }
};

PULSE.CLIENT.CRICKET.APICaller.prototype.stopVideosFeed = function( params )
{
    var feedUrl = this.makeFeedUrl( 'Videos', params );
    this.dm.stop( feedUrl );
};

/**
 *  Request photo albums feed
 *  @params
 *      feedId - string used by the onData method to identify the feed
 *      target - which onData methods to call
 *      params - can be order, limit, fields etc.
 *      start  - whether the feed starts itself or not
 */
PULSE.CLIENT.CRICKET.APICaller.prototype.getPhotoAlbums = function( feedId, target, params, start )
{
    var feedUrl = this.makeFeedUrl( 'ImageGalleries', $.extend(
    {
        withImages: 'yes'
    }, params ) );
    this.dm.addFeed( feedId, feedUrl, 600, 'onImageGalleries', [].concat( target ) );
    if ( start )
    {
        this.dm.start( feedUrl );
    }
};

PULSE.CLIENT.CRICKET.APICaller.prototype.stopPhotoAlbumsFeed = function( params )
{
    var feedUrl = this.makeFeedUrl( 'ImageGalleries', $.extend(
    {
        withImages: 'yes'
    }, params ) );
    this.dm.stop( feedUrl );
};

/**
 *  Request photos within an album
 *  @params
 *      feedId - string used by the onData method to identify the feed
 *      target - which onData methods to call
 *      params - MUST be albumId
 *      start  - whether the feed starts itself or not
 */
PULSE.CLIENT.CRICKET.APICaller.prototype.getPhotos = function( feedId, target, params, start )
{
    var feedUrl = this.makeFeedUrl( 'Images', params );
    this.dm.addFeed( feedId, feedUrl, 600, 'onImages', [].concat( target ) );
    if ( start )
    {
        this.dm.start( feedUrl );
    }
};


PULSE.CLIENT.CRICKET.APICaller.prototype.getPhotosByAlbumName = function( feedId, target, params,
    start )
{

    var feedUrl = this.APIs.testFeed + '/' + 'getPhotosByAlbumName/';

    for ( var type in params )
    {
        if ( params.hasOwnProperty( type ) )
        {
            feedUrl = feedUrl + type + '/' + params[ type ] + '/';
        }
    }

    feedUrl = feedUrl.substring( 0, feedUrl.length - 1 );

    this.dm.addFeed( feedId, feedUrl, 600, params.callback, [].concat( target ) );
    if ( start )
    {
        this.dm.start( feedUrl );
    }
};

/**
 *  Request news feed
 *  @params
 *      feedId - string used by the onData method to identify the feed
 *      target - which onData methods to call
 *      params - can be order, limit, fields etc.
 *      start  - whether the feed starts itself or not
 */
PULSE.CLIENT.CRICKET.APICaller.prototype.getNews = function( feedId, target, params, start )
{
    var feedUrl = this.makeFeedUrl( 'News', params );
    this.dm.addFeed( feedId, feedUrl, 600, 'onNews', [].concat( target ) );
    if ( start )
    {
        this.dm.start( feedUrl );
    }
};

/**
 *  Request news item, given an id
 *  @params
 *      feedId - string used by the onData method to identify the feed
 *      target - which onData methods to call
 *      params - MUST be id!
 *      start  - whether the feed starts itself or not
 */
PULSE.CLIENT.CRICKET.APICaller.prototype.getNewsItem = function( feedId, target, params, start )
{
    var feedUrl = this.makeFeedUrl( 'News', $.extend( params,
    {
        withImages: 'yes',
        imageLimit: 1
    } ) );
    this.dm.addFeed( feedId, feedUrl, 600, 'onNews', [].concat( target ) );
    if ( start )
    {
        this.dm.start( feedUrl );
    }
};


/**
 *  Request venues list
 *  @params
 *      feedId - string used by the onData method to identify the feed
 *      target - which onData methods to call
 *      params - can be order, limit, fields etc.
 *      start  - whether the feed starts itself or not
 */
PULSE.CLIENT.CRICKET.APICaller.prototype.getVenuesList = function( feedId, target, params, start )
{
    var feedUrl = this.makeFeedUrl( 'Venues', params );
    this.dm.addFeed( feedId, feedUrl, 600, 'onVenues', [].concat( target ) );
    if ( start )
    {
        this.dm.start( feedUrl );
    }
};


/**
 *  Request about pages list
 *  @params
 *      feedId - string used by the onData method to identify the feed
 *      target - which onData methods to call
 *      params - can be order, limit, fields etc.
 *      start  - whether the feed starts itself or not
 */
PULSE.CLIENT.CRICKET.APICaller.prototype.getAboutPagesList = function( feedId, target, params,
    start )
{
    var feedUrl = this.makeFeedUrl( 'AboutPages', params );
    this.dm.addFeed( feedId, feedUrl, 600, 'onAboutPages', [].concat( target ) );
    if ( start )
    {
        this.dm.start( feedUrl );
    }
};


/**
 *  Request about page
 *  @params
 *      feedId - string used by the onData method to identify the feed
 *      target - which onData methods to call
 *      params - MUST be pageId
 *      start  - whether the feed starts itself or not
 */
PULSE.CLIENT.CRICKET.APICaller.prototype.getAboutPage = function( feedId, target, params, start )
{
    var feedUrl = this.makeFeedUrl( 'AboutPageArticles', params );
    this.dm.addFeed( feedId, feedUrl, 600, 'onAboutPageArticles', [].concat( target ) );
    if ( start )
    {
        this.dm.start( feedUrl );
    }
};


/**
 *  Request Player Data
 *  @params
 *      feedId - string used by the onData method to identify the feed
 *      target - which onData methods to call
 *      params - MUST be id
 *      start  - whether the feed starts itself or not
 */
PULSE.CLIENT.CRICKET.APICaller.prototype.getPlayer = function( feedId, target, params, start )
{
    var feedUrl = this.makeFeedUrl( 'PlayerData', params );
    this.dm.addFeed( feedId, feedUrl, 0, 'onPlayerData', [].concat( target ) );
    if ( start )
    {
        this.dm.start( feedUrl );
    }
};

PULSE.CLIENT.CRICKET.APICaller.prototype.stopPlayerFeed = function( params )
{
    var feedUrl = this.makeFeedUrl( 'PlayerData', params );
    this.dm.stop( feedUrl );
};


/**
 *  Request Rankings Data
 *  @params
 *      feedId - string used by the onData method to identify the feed
 *      target - which onData methods to call
 *      params - MUST be id
 *      start  - whether the feed starts itself or not
 */
PULSE.CLIENT.CRICKET.APICaller.prototype.getRankings = function( feedId, target, params, start )
{
    var defaultParams = {
        callback: 'onRankings'
    };
    params = params ? $.extend( params, defaultParams ) : defaultParams;

    var feedUrl = this.makeFeedUrl( 'Rankings', params );

    this.dm.addFeed( feedId, feedUrl, 600, 'onRankings', [].concat( target ) );
    if ( start )
    {
        this.dm.start( feedUrl );
    }
};


PULSE.CLIENT.CRICKET.APICaller.prototype.getPlayerRankings = function( feed, feedId, target, params,
    start )
{
    var feedUrl = this.APIs.test + feed;
    this.dm.addFeed( feedId, feedUrl, 600, 'onPlayerRankings', [].concat( target ) );
    if ( start )
    {
        this.dm.start( feedUrl );
    }
};



PULSE.CLIENT.CRICKET.APICaller.prototype.getTickets = function( feedId, target, params, start )
{
    //var feedUrl = this.APIs.test + 'tickets/tickets.js';
    var feedUrl = 'http://cdn.pulselive.com/test/client/icc/tickets/tickets.js';
    this.dm.addFeed( feedId, feedUrl, 600, 'onTicketLinks', [].concat( target ) );
    if ( start )
    {
        this.dm.start( feedUrl );
    }
};


PULSE.CLIENT.CRICKET.APICaller.prototype.prepareParams = function( params )
{
    var paramsArray = [];
    $.each( params, function( key, value )
    {
        value = [].concat( value ).join( "," );
        var keyValuePair = [ key, value ];
        paramsArray.push( keyValuePair.join( "=" ) );
    } );

    return "?" + paramsArray.join( "&" );
};


PULSE.CLIENT.CRICKET.APICaller.prototype.getRankingsPlayersList = function( feedId, target, start )
{
    var feedUrl = this.APIs.playerRankings + 'players' + '?callback=onPlayers';
    this.dm.addFeed( feedId, feedUrl, 600, 'onPlayers', [].concat( target ) );

    if ( start )
    {
        this.dm.start( feedUrl );
    }
};

PULSE.CLIENT.CRICKET.APICaller.prototype.getPlayerRankingsById = function( playerId, scope, feedId,
    target, start )
{
    var feedUrl = this.APIs.playerRankings + 'data?scope=' + scope + '&pid=' + playerId +
        '&callback=onPlayerRankings';
    this.dm.addFeed( feedId, feedUrl, 600, 'onPlayerRankings', [].concat( target ) );

    if ( start )
    {
        this.dm.start( feedUrl );
    }
};
if( !PULSE ) PULSE = {};
if( !PULSE.CLIENT ) PULSE.CLIENT = {};
if( !PULSE.CLIENT.FacebookController ) PULSE.CLIENT.FacebookController = {};

/*
 * Creates a new window for a specific fb share;
 *
 * @param  {String} page 	- page u want to share
 * @param  {Number} w      	- optional; the width of the pop-up window created
 * @param  {Number} h      	- optional; the height of the pop-up window created
 */
PULSE.CLIENT.FacebookController.publishEvent = function( page, w, h )
{
    var FC = PULSE.CLIENT.FacebookController,
        width = w || 575,
        height = h || 400,
        left = ( $( window ).width() - width ) / 2,
        top = ( $( window ).height() - height ) / 2,
        fbUrl = FC.getShareUrl( page ),
        options = 'status=1' +
                  ',width=' + width +
                  ',height=' + height +
                  ',top=' + top +
                  ',left=' + left;

    window.open( fbUrl, 'facebook', options );
};

PULSE.CLIENT.FacebookController.getShareUrl = function( temp_page )
{
    return "http://www.facebook.com/sharer/sharer.php?u=" + temp_page;
  	// <!-- for Google -->
    // <meta name="description" content="" />
    // <meta name="keywords" content="" />

    // <meta name="author" content="" />
    // <meta name="copyright" content="" />
    // <meta name="application-name" content="" />

    // <!-- for Facebook -->
    // <meta property="og:title" content="" />
    // <meta property="og:type" content="article" />
    // <meta property="og:image" content="" />
    // <meta property="og:url" content="" />
    // <meta property="og:description" content="" />

    // <!-- for Twitter -->
    // <meta name="twitter:card" content="summary" />
    // <meta name="twitter:title" content="" />
    // <meta name="twitter:description" content="" />
    // <meta name="twitter:image" content="" />
};
if( !PULSE ) PULSE = {};
if( !PULSE.CLIENT ) PULSE.CLIENT = {};
if( !PULSE.CLIENT.GooglePlusController ) PULSE.CLIENT.GooglePlusController = {};

PULSE.CLIENT.GooglePlusController.publishEvent = function( page, w, h )
{
  var GC = PULSE.CLIENT.GooglePlusController,
        width = w || 575,
        height = h || 400,
        left = ( $( window ).width() - width ) / 2,
        top = ( $( window ).height() - height ) / 2,
        gplusUrl = GC.getShareUrl( page ),
        options = 'status=1' +
                  ',width=' + width +
                  ',height=' + height +
                  ',top=' + top +
                  ',left=' + left;

    window.open( gplusUrl, 'google plus', options );
};

PULSE.CLIENT.GooglePlusController.getShareUrl = function( tmp_page )
{
    return "https://plus.google.com/share?url=" + tmp_page;
    //language
};
if (!PULSE)
{
    var PULSE = {};
}
if (!PULSE.CLIENT)
{
    PULSE.CLIENT = {};
}
if (!PULSE.CLIENT.CRICKET)
{
    PULSE.CLIENT.CRICKET = {};
}

PULSE.CLIENT.CRICKET.EventStructure = {
    'worldt20': [ 'Provisional Round', 'Super Round', 'Semi Finals', 'Runner Up', 'Winner' ],
    'cwc': [ 'Group Round', 'Super Round', 'Quarterfinals', 'Semi Finals', 'Runner Up', 'Winner' ]
};

PULSE.CLIENT.CRICKET.corporateMetaData = {

};

PULSE.CLIENT.CRICKET.Metadata = [
    {
        "tournamentName": "worldt20",
        "year": "",
        "fullName": "ICC World Twenty20",
        "shortName": "ICC WT20",
        "dateRange": "2007 - present",
        "country": "India",
        "urlRoot": "world-t20",
        "genderPrefix": "men",
        "linksForAllTeams": false,
        "supportsPlayerProfiles": false,

        "prodPlatform": "http://cdn.pulselive.com/dynamic/data/core/cricket/TournamentGroups/",
        "testPlatform": "http://cdn.pulselive.com/test/data/core/cricket/TournamentGroups/",

        "fixturesPath" : 'world-t20/fixtures/men',

        "staticUrl": "http://static3.icc-cricket.com/",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/worldt20-2016/",

        "standingsLink" : '/groups/men',

        "matchTypes": ["T20I"],

        "mcDefaults": {},

        "tweetUser":
        {
            "account": "icc",
            "list": "worldtwenty20",
            "hash": "wt20"
        },
        "twitterLists": [
            {
                name: 'WT20',
                list: "worldt20_list"
            },
            {
                name: "Women's WT20",
                list: "women-worldt20_list"
            }
        ],
        "hashTags": "#wt20",

        "stages": []
    },
    {
        "tournamentName": "women-worldt20",
        "year": "2016",
        "fullName": "Women's ICC World Twenty20",
        "shortName": "Women's ICC WT20",
        "dateRange": "2009 - present",
        "country": "India",
        "urlRoot": "world-t20",
        "genderPrefix": "women",
        "linksForAllTeams": false,
        "supportsPlayerProfiles": false,

        "prodPlatform": "http://cdn.pulselive.com/dynamic/data/core/cricket/TournamentGroups/",
        "testPlatform": "http://cdn.pulselive.com/test/data/core/cricket/TournamentGroups/",

        "fixturesPath" : 'world-t20/fixtures/women',

        "staticUrl": "http://static3.icc-cricket.com/",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/women-worldt20-2016/",

        "standingsLink" : '/groups/women',

        "matchTypes": ["T20"],

        "mcDefaults": {},

        "tweetUser":
        {
            "account": "icc",
            "list": "worldtwenty20",
            "hash": "wt20"
        },
        "twitterLists": [
            {
                name: 'WT20',
                list: "worldt20_list"
            },
            {
                name: "Women's WT20",
                list: "women-worldt20_list"
            }
        ],
        "hashTags": "#wt20",

        "stages": []
    },
    {
        "tournamentName": "cwc",
        "year": "",
        "fullName": "Cricket World Cup",
        "shortName": "CWC",
        "dateRange": "1987 - present",
        "country": "India",
        "urlRoot": "cricket-world-cup",
        "linksForAllTeams": false,
        "supportsPlayerProfiles": false,

        "prodPlatform": "http://cdn.pulselive.com/dynamic/data/core/cricket/TournamentGroups/",
        "testPlatform": "http://cdn.pulselive.com/test/data/core/cricket/TournamentGroups/",

        "staticUrl": "http://static3.icc-cricket.com/",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/cwc-2015/",

        "matchTypes": ["ODI"],

        "mcDefaults": {},

        "tweetUser":
        {
            "account": "icc",
            "list": "worldtwenty20",
            "hash": "wt20"
        },
        "twitterLists": [
            {
                name: 'WT20',
                list: "worldt20_list"
            },
            {
                name: "Women's WT20",
                list: "women-worldt20_list"
            }
        ],
        "hashTags": "#cwc",

        "stages": []
    },
    {
        "tournamentName": "worldt20-2016",
        "year": "2016",
        "fullName": "ICC World Twenty20 <span>2016</span>",
        "shortName": "ICC WT20 2016",
        "dateRange": "11 Mar 2016 - 3 Apr 2016",
        "country": "India",
        "urlRoot": "world-t20",
        "genderPrefix": "men",
        "linksForAllTeams": true,
        "supportsPlayerProfiles": true,

        "fixturesPath" : 'world-t20/fixtures/men',

        "staticUrl": "http://static3.icc-cricket.com/",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/worldt20-2016/",

        "standingsLink" : '/groups/men',

        "socialLink" : "/fanzone/social",

        "matchTypes": ["T20I"],

        "mcDefaults": {
            "interactiveScorecard": true,
            "noHawkeye" : false
        },

        "tweetUser":
        {
            "account": "icc",
            "list": "wt20-overall_list",
            "hash": "wt20"
        },
        "tweetCounter": "wt20_counter",
        "tweetTrendingTeams": "wt20-teams_trending",
        "hashTags": "#wt20",
        "teamTwitterPrefix" : "wt20-",

        "instagramUser": 'icc',

        "twitterLists": [
            {
                name: 'WT20',
                list: "worldt20_list"
            },
            {
                name: "Women's WT20",
                list: "women-worldt20_list"
            }
        ],

        "ticketLinks": {
            "worldt20-2016-01": ""
        },

        "stages": [
            {
                "name": "Super 10",
                "groups": [ "Group 1", "Group 2" ],
                "type": "table",
                "progressionIndex": 1
            },
            {
                "name": "Group Stage",
                "groups": [ "Group A", "Group B" ],
                "type": "table",
                "progressionIndex": 0
            }
        ]
    },
    {
        "tournamentName": "women-worldt20-2016",
        "year": "2016",
        "fullName": "Women's ICC World Twenty20 <span>2016</span>",
        "shortName": "Women's ICC WT20 2016",
        "dateRange": "11 Mar 2016 - 3 Apr 2016",
        "country": "India",
        "urlRoot": "world-t20",
        "genderPrefix": "women",
        "linksForAllTeams": true,
        "supportsPlayerProfiles": true,

        "fixturesPath" : 'world-t20/fixtures/women',

        "staticUrl": "http://static3.icc-cricket.com/",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/women-worldt20-2016/",
        "customerDataUrl": "http://cdn.pulselive.com/dynamic/data/icc/2016/worldt20-2016/",

        "standingsLink" : '/groups/women',

        "matchTypes": ["T20I"],

        "socialLink" : "/fanzone/social",
        "teamTwitterPrefix" : "wt20-",

        "mcDefaults": {
            "interactiveScorecard": true,
            "noHawkeye" : false
        },

        "tweetUser":
        {
            "account": "icc",
            "list": "worldtwenty20",
            "hash": "wt20"
        },
        "twitterLists": [
            {
                name: 'WT20',
                list: "worldt20_list"
            },
            {
                name: "Women's WT20",
                list: "women-worldt20_list"
            }
        ],
        "hashTags": "#wt20",

        "stages": [
            {
                "name": "Group Stage",
                "groups": [ "Group A", "Group B" ],
                "type": "table"
            }
        ]
    },
    {
        "tournamentName": "worldt20-2016-warmups",
        "year": "2016",
        "fullName": "ICC World Twenty20 2016 Warm-ups",
        "shortName": "ICC WT20 2016 Warm-ups",
        "dateRange": "11 Mar 2016 - 3 Apr 2016",
        "country": "India",
        "urlRoot": "world-t20",
        "genderPrefix": "men",
        "mcDefaults": {},
        "linksForAllTeams": false,
        "supportsPlayerProfiles": false,

        "fixturesPath" : 'world-t20/fixtures/men',

        "staticUrl": "http://static3.icc-cricket.com/",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/worldt20-2016/",
        "customerDataUrl": "http://cdn.pulselive.com/dynamic/data/icc/2016/worldt20-2016/",

        "standingsLink" : '/groups/men',

        "matchTypes": ["T20"],

        "mcDefaults": {
            "overviewStates" :
            {
                upcoming: [ 'matchDetails', 'commentary', 'preMatchTeams', 'overviewVideos', 'tournamentTwitter' ],
                live: [ 'matchDetails', 'commentary', 'inPlay', 'overSummary', 'overviewTeams', 'overviewVideos', 'inningsStats', 'tournamentTwitter' ],
                complete: [ 'postMatchReactions', 'matchDetails', 'commentary', 'overviewTeams', 'overviewVideos', 'tournamentTwitter' ]
            },
            "noHawkeye" : true
        },

        "tweetUser":
        {
            "account": "icc",
            "list": "worldtwenty20",
            "hash": "wt20"
        },
        "twitterLists": [
            {
                name: 'WT20',
                list: "worldt20_list"
            },
            {
                name: "Women's WT20",
                list: "women-worldt20_list"
            }
        ],
        "hashTags": "#wt20"
    },
    {
        "tournamentName": "women-worldt20-2016-warmups",
        "year": "2016",
        "fullName": "Women's World Twenty20 2016 Warm-ups",
        "shortName": "Women's ICC WT20 2016 Warm-ups",
        "dateRange": "11 Mar 2016 - 3 Apr 2016",
        "country": "India",
        "urlRoot": "world-t20",
        "genderPrefix": "women",
        "mcDefaults": {},
        "linksForAllTeams": false,
        "supportsPlayerProfiles": false,

        "fixturesPath" : 'world-t20/fixtures/women',

        "staticUrl": "http://static3.icc-cricket.com/",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/women-worldt20-2016/",
        "customerDataUrl": "http://cdn.pulselive.com/dynamic/data/icc/2016/worldt20-2016/",

        "standingsLink" : '/groups/women',

        "matchTypes": ["T20"],

        "mcDefaults": {
            "overviewStates" :
            {
                upcoming: [ 'matchDetails', 'commentary', 'preMatchTeams', 'overviewVideos', 'tournamentTwitter' ],
                live: [ 'matchDetails', 'commentary', 'inPlay', 'overSummary', 'overviewTeams', 'overviewVideos', 'inningsStats', 'tournamentTwitter' ],
                complete: [ 'postMatchReactions', 'matchDetails', 'commentary', 'overviewTeams', 'overviewVideos', 'tournamentTwitter' ]
            },
            "noHawkeye" : true
        },

        "tweetUser":
        {
            "account": "icc",
            "list": "worldtwenty20",
            "hash": "wt20"
        },
        "twitterLists": [
            {
                name: 'WT20',
                list: "worldt20_list"
            },
            {
                name: "Women's WT20",
                list: "women-worldt20_list"
            }
        ],
        "hashTags": "#wt20"
    },
    {
        "tournamentName": "u19cwc-2016-warmups",
        "year": "2016",
        "fullName": "Under-19 Cricket World Cup 2016 Warm-ups",
        "shortName": "U19 CWC 2016 Warm-ups",
        "dateRange": "27 Jan 2016 - 14 Feb 2016",
        "country": "Bangladesh",
        "urlRoot": "u19-world-cup",
        "linksForAllTeams": false,
        "supportsPlayerProfiles": false,

        "staticUrl": "http://static3.icc-cricket.com/",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/wwt20-qualifier/",

        "standingsLink" : '/pools',

        "tweetUser":
        {
            "account": "icc",
            "list": "u19cwc2016_list",
            "hash": "u19cwc"
        },

        "matchTypes": ["OTHER"],

        "mcDefaults": {
            "overviewStates" :
            {
                upcoming: [ 'matchDetails', 'commentary', 'preMatchTeams', 'overviewVideos', 'tournamentTwitter' ],
                live: [ 'matchDetails', 'commentary', 'inPlay', 'overSummary', 'overviewTeams', 'overviewVideos', 'inningsStats' ],
                complete: [ 'postMatchReactions', 'matchDetails', 'commentary', 'overviewTeams', 'overviewVideos' ]
            },
            "noHawkeye" : true
        },
        "ticketLinks": {}
    },
    {
        "tournamentName": "u19cwc-2016",
        "year": "2016",
        "fullName": "Under-19 Cricket World Cup 2016",
        "shortName": "U19 CWC 2016",
        "dateRange": "27 Jan 2016 - 14 Feb 2016",
        "country": "Bangladesh",
        "urlRoot": "u19-world-cup",
        "linksForAllTeams": false,
        "supportsPlayerProfiles": false,

        "staticUrl": "http://static3.icc-cricket.com/",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/wwt20-qualifier/",

        "standingsLink" : '/pools',

        "tweetUser":
        {
            "account": "icc",
            "list": "u19cwc2016_list",
            "hash": "u19cwc"
        },

        "matchTypes": ["OTHER"],

        "mcDefaults": {
            "overviewStates" :
            {
                upcoming: [ 'matchDetails', 'commentary', 'preMatchTeams', 'overviewVideos', 'tournamentTwitter' ],
                live: [ 'matchDetails', 'commentary', 'inPlay', 'overSummary', 'overviewTeams', 'overviewVideos', 'inningsStats', 'tournamentTwitter' ],
                complete: [ 'postMatchReactions', 'matchDetails', 'commentary', 'overviewTeams', 'overviewVideos', 'tournamentTwitter' ]
            },
            "noHawkeye" : false
        },

        "stages": [
            {
                "name": "Super League",
                "matches": [ "u19cwc-2016-27", "u19cwc-2016-30", "u19cwc-2016-31", "u19cwc-2016-33", "u19cwc-2016-36", "u19cwc-2016-37", "u19cwc-2016-39", "u19cwc-2016-41", "u19cwc-2016-44", "u19cwc-2016-47", "u19cwc-2016-48" ],
                "type": "list"
            },
            {
                "name": "Plate",
                "matches": [ "u19cwc-2016-25", "u19cwc-2016-26", "u19cwc-2016-28", "u19cwc-2016-29", "u19cwc-2016-32", "u19cwc-2016-34", "u19cwc-2016-35", "u19cwc-2016-38" ,"u19cwc-2016-40", "u19cwc-2016-42", "u19cwc-2016-43", "u19cwc-2016-45", "u19cwc-2016-46" ],
                "type": "list"
            },
            {
                "name": "Group Stage",
                "groups": [ "Group A", "Group B", "Group C", "Group D" ],
                "type": "table"
            }
        ]
    },
    {
        "tournamentName": "women-worldt20q-2015",
        "year": "2015",
        "fullName": "Women's ICC World Twenty20 Qualifier",
        "shortName": "ICC WWT20q 2015",
        "dateRange": "28 Nov 2015 - 5 Dec 2015",
        "country": "Thailand",
        "urlRoot": "wwt20-qualifier",
        "genderPrefix": "women",
        "linksForAllTeams": false,
        "supportsPlayerProfiles": false,

        "staticUrl": "http://static3.icc-cricket.com/",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/wwt20-qualifier/",

        "standingsLink" : '/pools',

        "matchTypes": ["T20I"],

        "mcDefaults": {
            "overviewStates" :
            {
                upcoming: [ 'matchDetails', 'commentary', 'preMatchTeams', 'overviewVideos', 'tournamentTwitter' ],
                live: [ 'matchDetails', 'commentary', 'inPlay', 'overSummary', 'overviewTeams', 'overviewVideos', 'inningsStats', 'tournamentTwitter' ],
                complete: [ 'postMatchReactions', 'matchDetails', 'commentary', 'overviewTeams', 'overviewVideos', 'tournamentTwitter' ]
            },
            "noHawkeye" : true,
            "simpleRenderComms": true
        },

        // "tweetUser":
        // {
        //     "account": "icc",
        //     "list": "icc-icclive_list",
        //     "hash": "WWT20"
        // },
        "twitterLists": [
            {
                name: 'icc-icclive_list',
                list: "icc-icclive_list"
            }
        ],
        // "hashTags": "#wt20",

        "stages": [
            {
                "name": "Trophy",
                "matches": [ "women-worldt20q-2015-14", "women-worldt20q-2015-16", "women-worldt20q-2015-18", "women-worldt20q-2015-20" ],
                "type": "list"
            },
            {
                "name": "Shield",
                "matches": [ "women-worldt20q-2015-13", "women-worldt20q-2015-15", "women-worldt20q-2015-17", "women-worldt20q-2015-19" ],
                "type": "list"
            },
            {
                "name": "Group Stage",
                "groups": [ "Group A", "Group B" ],
                "type": "table"
            }
        ]
    },
    {
        "tournamentName": "worldt20q-2015",
        "year": "2015",
        "fullName": "ICC World Twenty20 Qualifiers 2015",
        "shortName": "ICC WT20q 2015",
        "dateRange": "06 July 2015 – 26 July 2015",
        "country": "Ireland & Scotland",
        "urlRoot": "world-t20-qualifier",
        "linksForAllTeams": true,
        "supportsPlayerProfiles": false,

        "staticUrl": "http://static3.icc-cricket.com/",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/",

        "matchTypes": ["AGG"],

        "mcDefaults": {
            "overviewStates" :
            {
                upcoming: [ 'matchDetails', 'commentary', 'preMatchTeams', 'overviewVideos', 'tournamentTwitter' ],
                live: [ 'matchDetails', 'commentary', 'inPlay', 'overSummary', 'overviewTeams', 'overviewVideos', 'inningsStats', 'tournamentTwitter' ],
                complete: [ 'postMatchReactions', 'matchDetails', 'commentary', 'overviewTeams', 'overviewVideos', 'tournamentTwitter' ]
            },
            "noHawkeye" : true
        },

        "tweetUser":
        {
            "account": "icc",
            "list": "worldtwenty20",
            "hash": "wt20"
        },
        "twitterLists": [
            {
                name: 'wt20q_list',
                list: "wt20q_list"
            }
        ],
        "hashTags": "#wt20",

        "stages": [
            {
                "name": "Knockouts",
                "matches": [ "worldt20q-2015-59", "worldt20q-2015-60", "worldt20q-2015-61", "worldt20q-2015-60", "worldt20q-2015-61",
                "worldt20q-2015-62", "worldt20q-2015-63", "worldt20q-2015-64", "worldt20q-2015-65","worldt20q-2015-66", "worldt20q-2015-67" ],
                "type": "list"
            },
            {
                "name": "Group Stage",
                "groups": [ "Group A", "Group B" ],
                "type": "table"
            }
        ]
    },
    {
        "tournamentName": "intcup-2015",

        "testPlatform": "http://cdn.pulselive.com/dynamic/data/core/cricket/2012/",
        "prodPlatform": "http://cdn.pulselive.com/dynamic/data/core/cricket/2012/",

        'customDataUrl': 'http://cdn.pulselive.com/dynamic/data/core/cricket/2012/',
        'customerDataUrl': '', // used to override the auto-generated poll URL

        "staticUrl": "http://static3.icc-cricket.com/",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/",

        "mcDefaults": {
            "overviewStates" :
            {
                upcoming: [ 'matchDetails', 'commentary', 'preMatchTeams', 'overviewVideos', 'tournamentTwitter' ],
                live: [ 'matchDetails', 'commentary', 'inPlay', 'overSummary', 'overviewTeams', 'overviewVideos', 'inningsStats', 'tournamentTwitter' ],
                complete: [ 'postMatchReactions', 'matchDetails', 'commentary', 'overviewTeams', 'overviewVideos', 'tournamentTwitter' ]
            },
            "noHawkeye" : true,
            "simpleRenderComms": true
        }
    },

    {
        "tournamentName": "sl-pak-2015",
        "year": "2015",
        "fullName": "Sri Lanka/Pakistan 2015",
        "shortName": "WT20q 2015",
        "dateRange": "06 July 2015 – 26 July 2015",
        "country": "Ireland & Scotland",
        "linksForAllTeams": true,
        "supportsPlayerProfiles": false,

        "staticUrl": "http://static3.icc-cricket.com/",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/",

        "matchTypes": ["T20I"],

        "mcDefaults": {
            "overviewStates" :
            {
                upcoming: [ 'matchDetails', 'commentary', 'preMatchTeams', 'overviewVideos', 'tournamentTwitter' ],
                live: [ 'matchDetails', 'commentary', 'inPlay', 'overSummary', 'overviewTeams', 'overviewVideos', 'inningsStats', 'tournamentTwitter' ],
                complete: [ 'postMatchReactions', 'matchDetails', 'commentary', 'overviewTeams', 'overviewVideos', 'tournamentTwitter' ]
            }
        },

        "tweetUser":
        {
            "account": "icc",
            "list": "worldtwenty20",
            "hash": "wt20"
        },
        "twitterLists": [
            {
                name: 'wt20q_list',
                list: "wt20q_list"
            }
        ],
        "hashTags": "#wt20",

        "stages": [
            {
                "name": "Knockouts",
                "matches": [ "worldt20q-2015-59", "worldt20q-2015-60", "worldt20q-2015-61", "worldt20q-2015-60", "worldt20q-2015-61",
                "worldt20q-2015-62", "worldt20q-2015-63", "worldt20q-2015-64", "worldt20q-2015-65","worldt20q-2015-66", "worldt20q-2015-67" ],
                "type": "list"
            },
            {
                "name": "Group Stage",
                "groups": [ "Group A", "Group B" ],
                "type": "table"
            }
        ]
    },
    {
        "tournamentName": "worldt20q-2015-warmups",
        "year": "2015",
        "fullName": "ICC World Twenty20 Qualifiers 2015 Warm-ups",
        "shortName": "ICC WT20Q 2015 Warm-ups",
        "country": "Ireland & Scotland",
        "urlRoot": "world-t20-qualifier",
        "mcDefaults": {

        },
        "linksForAllTeams": true,
        "supportsPlayerProfiles": false,

        "staticUrl": "http://static3.icc-cricket.com/",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/",

        "matchTypes": ["T20I"],

        "mcDefaults": {
            "overviewStates" :
            {
                upcoming: [ 'matchDetails', 'commentary', 'preMatchTeams', 'overviewVideos', 'tournamentTwitter' ],
                live: [ 'matchDetails', 'commentary', 'inPlay', 'overSummary', 'overviewTeams', 'overviewVideos', 'inningsStats', 'tournamentTwitter' ],
                complete: [ 'postMatchReactions', 'matchDetails', 'commentary', 'overviewTeams', 'overviewVideos', 'tournamentTwitter' ]
            },
            "noHawkeye" : true
        },

        "tweetUser":
        {
            "account": "icc",
            "list": "worldtwenty20",
            "hash": "wt20"
        },
        "twitterLists": [
            {
                name: 'wt20q_list',
                list: "wt20q_list"
            }
        ],
        "hashTags": "#wt20"
    },
    {
        "tournamentName": "cwc-2015-warmups",
        "year": "2015",
        "fullName": "ICC Cricket World Cup 2015 Warm-ups",
        "shortName": "Cricket World Cup Warm-ups",
        "country": "New Zealand",
        "urlRoot": "cricket-world-cup",
        "scorecardOnly": true,
        "linksForAllTeams": true,
        "supportsPlayerProfiles": true,

        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/cwc-2015/",

        "ticketLinks": {
            // "cwc-2015-warmups-01": 50,
            "cwc-2015-warmups-02": 53,
            "cwc-2015-warmups-03": 54,
            "cwc-2015-warmups-04": 51,
            // "cwc-2015-warmups-05": 52,
            "cwc-2015-warmups-06": 56,
            "cwc-2015-warmups-07": 55,
            "cwc-2015-warmups-08": 57,
            "cwc-2015-warmups-09": 60,
            "cwc-2015-warmups-10": 59,
            "cwc-2015-warmups-11": 58,
            "cwc-2015-warmups-12": 61,
            "cwc-2015-warmups-13": 62,
            "cwc-2015-warmups-14": 63
        }
    },
    {
        "tournamentName": "ipl2014",
        "year": "2014",
        "fullName": "ICC Cricket World Cup 2015 Warm-ups",
        "shortName": "Cricket World Cup Warm-ups",
        "country": "New Zealand",
        "urlRoot": "cricket-world-cup",
        // "scorecardOnly": true,
        "linksForAllTeams": true,
        "supportsPlayerProfiles": true,

        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/cwc-2015/"
    },
    {
        "tournamentName": "cwc-2015",
        "scorecardOnly": false,
        "year": "2015",
        "fullName": "ICC Cricket World Cup 2015",
        "shortName": "ICC CWC 2015",
        "dateRange": "06 Jun 2015 - 23 Jun 2015",
        "country": "Australia & New Zealand",
        "urlRoot": "cricket-world-cup",

        "buyTicketsText": "Register now for tickets",
        "buyTicketsLink": "/cricket-world-cup/register",
        "linksForAllTeams": true,
        "supportsPlayerProfiles": true,


        "staticUrl": "http://static3.icc-cricket.com/",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/cwc-2015/",

        "mcDefaults": {
            "social": true,
            "interactiveScorecard": false,
            "onlyManual" : true
        },

        "matchTypes": ["ODI"],

        "stages": [
            {
                "name": "Knockouts",
                "matches": [ "cwcq-2014-2015-43", "cwc-2015-44", "cwc-2015-45", "cwc-2015-46", "cwc-2015-47", "cwc-2015-48", "cwc-2015-49" ],
                "type": "list"
            },
            {
                "name": "Group Stage",
                "groups": [ "Pool A", "Pool B" ],
                "type": "table",
                "progressionIndex": 0
            }
        ],

        "tweetUser":
        {
            "account": "cricketworldcup",
            "list": "cricketworldcup_list",
            "hash": "cwc15"
        },
        "tweetCounter": "CWC15_Counter",
        "tweetTrendingTeams": "cwc15teamsoverall_buzz",
        "hashTags": "#cwc15",

        "instagramUser": 'cricketworldcup',

        "editorialDescriptions": {
            "cwc-2015-01": "<p>Two of the tournament’s heavyweights clash in a blockbuster encounter to open the ICC Cricket World Cup 2015 in Christchurch.</p><p>Played at the newly redeveloped Hagley Oval, host nation New Zealand will be eager to avenge its semi-final losses to Sri Lanka in 2007 and 2011.</p><p>With plenty of history between the two sides, and the chance to make the early front-running in Pool A, this match promises to kick-start the tournament with a bang.</p>",
            "cwc-2015-02": "<p>There will be no Valentine’s Day love when two of cricket’s oldest rivals open the tournament on Australian soil at the world famous Melbourne Cricket Ground. </p><p>As the most successful team in ICC Cricket World Cup history, Australia will want to start its quest for a fifth title in positive fashion while England will look to put a dampener on Australia’s party. </p><p>When the tournament was last held down under in 1992, England beat Australia by eight wickets. If they repeat that result the Barmy Army will be heard loud and far. </p>",
            "cwc-2015-03": "<p>Bragging rights and competition points will be on offer as the only two African teams in the tournament clash in Hamilton. </p><p>Zimbabwe will take inspiration from its shock upset over South Africa at the 1999 tournament while the Proteas will rely on its consistency as one of the premier ODI teams in the world. </p><p>The African neighbours are tied on one win each in ICC Cricket World Cup history making this deadlock breaking game an intriguing prospect.</p>",
            "cwc-2015-04": "<p>One of cricket’s most intense rivalries will ignite when sub-continent powerhouses India and Pakistan open their ICC Cricket World Cup campaigns in Adelaide. </p><p>Pakistan will be desperate to snap a five game tournament losing streak against India, while the defending champions will be wary of a Pakistan team full of big-match players and ODI specialists. </p><p>The stakes are high in this clash with the winning side gaining much needed momentum early in the tournament. </p>",
            "cwc-2015-05": "<p>Associate nation Ireland will be looking to add to its previous big tournament scalps of Pakistan, England and Bangladesh when it takes on West Indies at Saxton Oval. </p><p>As two of the tournament’s crowd favourites, an exciting match-up is in store with both teams full of flamboyant personalities and exciting stroke makers. </p><p>As a two-time winner of the ICC Cricket World Cup, West Indies will be eager to start the tournament positively against a dangerous Ireland side always ready to cause an upset. </p>",
            "cwc-2015-06": "<p>Even though New Zealand is a co-host of the tournament, Scotland will feel right at home during this clash in the ‘Edinburgh of the South’ – Dunedin. </p><p>After winning the 2014 ICC World Cup Qualifier in New Zealand, Scotland will be familiar with New Zealand conditions and ready to claim an upset against the home side. </p><p>For New Zealand, this will be its last chance to impress Southern fans before its campaign moves to the North Island.</p>",
            "cwc-2015-07": "<p>Afghanistan caps off a meteoric rise through world cricket ranks with its ICC Cricket World Cup debut against Bangladesh at Manuka Oval. </p><p>After qualifying for the tournament through a second-place finish in the Pepsi ICC World Cricket League, Afghanistan’s young stars will be eager to make a splash on cricket’s biggest stage. </p><p>For Bangladesh, this is a chance to push for a big win following the disappointment of missing the 2011 quarter-finals due to net run rate. </p>",
            "cwc-2015-08": "<p>This match marks the return of United Arab Emirates (UAE) to the ICC Cricket World Cup for the first time since 1996. </p><p>UAE will be familiar with New Zealand conditions after coming second in the 2014 ICC World Cup Qualifier and provide a dangerous prospect for Zimbabwe. </p><p>Zimbabwe will be looking to quell the enthusiasm of UAE in a match which is vital to either team’s chances of making the quarter-finals. </p>",
            "cwc-2015-09": "<p>After taking on Australia at the Melbourne Cricket Ground, it doesn’t get any easier for England when it faces co-hosts New Zealand in Wellington. </p><p>The stage is set for an epic encounter between two sides evenly matched in ICC Cricket World Cup play. New Zealand have won four matches to England’s three, but all of England’s wins have come on English soil. </p><p>England will need to break this record to overcome a passionate New Zealand side, buoyed by its home support.</p>",
            "cwc-2015-10": "<p>Two of the tournament’s most thrilling teams come together for an absorbing clash at Hagley Oval. </p><p>West Indies hold the advantage over Pakistan in ICC Cricket World Cup history, having won six of the nine matches played between the countries. </p><p>However recent history favours Pakistan, with a ten wicket win knocking West Indies out of the 2011 tournament at the quarter-final stage. </p><p>Whatever the result, it is sure to be an action-packed match between two entertaining teams. </p>",
            "cwc-2015-11": "<p>In its only game in Brisbane, Australia will be eager to impress its home fans and build momentum as the tournament continues. </p><p>Bangladesh provide a big hurdle for Australia. They are young, fearless and always ready to cause an upset – as India found out in 2007. </p><p>On a fast Gabba wicket it will be Bangladesh’s youth and daring against Australia’s experience </p>",
            "cwc-2015-12": "<p>After opening its campaign in Canberra, ICC World Cup debutants Afghanistan head to Dunedin to take on one of the tournament favourites – Sri Lanka. </p><p>Coming off the back of the opening game against New Zealand in Christchurch, Sri Lanka will be looking to finish its South Island leg positively as the tournament progresses towards the quarter-final stage. </p><p>Afghanistan’s strong pace-bowling unit will play a vital role if the associate nation is to cause an upset at the batter-friendly University Oval.</p>",
            "cwc-2015-13": "<p>It will be a battle of South Africa’s ferocious pace and all-round ability against the high caliber batting and industrious fielding of defending champions India in this crucial clash. </p><p>India will have to overcome a team it has never beaten in three attempts in tournament play, while South Africa know a win will edge it closer to a quarter-final berth. </p><p>It will be a high-stakes clash between two of the world’s top ODI units on the tournament’s biggest stage – the Melbourne Cricket Ground.</p>",
            "cwc-2015-14": "<p>British pride will be on the line along with tournament points in this crunch match between neighbours – England and Scotland. </p><p>Scotland will take heart from Ireland’s memorable upset over England in 2011 and look to repeat the feat at Hagley Oval. With vital points on offer, England will leave nothing to chance in pursuit of a big win ahead of the knockout stage. </p><p>Whatever the result, history will be made in this first ICC Cricket World Cup clash between the two teams. </p>",
            "cwc-2015-15": "<p>It is sure to be a high-scoring thriller when two of the tournament’s most attacking teams square off at Manuka Oval. </p><p>Zimbabwe’s innovation and tenacity will be up against a charged-up West Indies outfit desperate to perform in a tournament it hasn’t won since 1979. </p><p>Although Zimbabwe is yet to beat West Indies in tournament play, its young lineup will show no fear as it guns for a place in the quarter-finals. </p>",
            "cwc-2015-16": "<p>This is a vital clash for the two rising cricket nations with a win putting either side in the frame for a quarter-final berth. </p><p>Ireland thrives on the big stage and The Gabba provides the perfect platform for a repeat of its entertaining deeds in previous tournaments. In its first outing on Australian soil, UAE will be looking to utilise the fast Brisbane track to get one over its associate nation counterparts. </p><p>Nothing will be left on the field in this clash between two teams eager to make a mark early in the tournament. </p>",
            "cwc-2015-17": "<p>An exciting clash is in store for University Oval’s final match with the ever-popular Scotland taking on tournament debutants Afghanistan. </p><p>Having played one game each at the venue, both teams will be familiar with the local conditions and eager to post a big victory as the tournament reaches a vital stage. </p><p>Afghanistan will be hoping its pace attack provide an edge but the crowd support will undoubtedly be with Scotland in the ‘Edinburgh of the South’ – Dunedin. </p>",
            "cwc-2015-18": "<p>It will be an all sub-continent bash when high-flying Sri Lanka take on the ever-improving Bangladesh in Melbourne. </p><p>Bangladesh’s strong spin bowling unit will enjoy the extra protection provided by the big MCG boundaries and be pivotal if they are to upset the 2011 finalists. </p><p>After two games in New Zealand, Sri Lanka will be eager to impress on Australian soil and take its tournament record against Bangladesh to 3-0.</p>",
            "cwc-2015-19": "<p>In one of the feature match-ups of Pool B, tournament heavyweights South Africa and West Indies slug it out in Sydney. </p><p>With power-hitters scattered throughout both teams, the Sydney Cricket Ground boundaries will be tested in what is sure to be a high-scoring thriller. </p><p>Although South Africa have the slight edge in tournament play with three wins to two, West Indies extravagance will pose problems for the Proteas clinical game-plan.</p>",
            "cwc-2015-20": "<p>Trans-Tasman pride is on the line as Australia and New Zealand clash in a replay of the epic opening match of the 1992 tournament at Eden Park. </p><p>Australia will want to erase memories of that day when it was stunned by New Zealand in a game which set Eden Park alight. Since then Australia has had it over New Zealand in tournament play, winning six games to two. </p><p>Despite its strong record, Australia will be weary of a New Zealand side buoyed by its passionate home crowd and always up for a Trans-Tasman battle.</p>",
            "cwc-2015-21": "<p>As the tournament progresses towards the quarter-final stage, defending champions India will look to flex its muscle against an improving UAE side in Perth. </p><p>Having never faced India in tournament play, UAE will have the surprise element to unsettle India on the fast WACA pitch. </p><p>India will look to its superstar batting lineup to score big and leave nothing to chance against one of world cricket’s big improvers. </p>",
            "cwc-2015-22": "<p>Two of the tournament favourites square off in a clash which could decide Pool A supremacy in Wellington. </p><p>After bundling England out of the 2011 tournament, Sri Lanka will be weary of an English side out for revenge and suited to the seam-friendly New Zealand conditions. </p><p>With both teams expected to get big support, Sri Lanka’s world class top order will be hunting for big runs in a match that is sure to set the Wellington Regional Stadium alight.</p>",
            "cwc-2015-23": "<p>It promises to be a thriller at the Gabba when Zimbabwe’s youth and exuberance takes on Pakistan’s flair and experience. </p><p>Having won all four previous world cup matches between the teams, Pakistan will want to extend its winning streak against a fearless Zimbabwe side. </p><p>With match-winners scattered throughout both teams, anything could happen as the competition for quarter-final positions intensifies. </p>",
            "cwc-2015-24": "<p>In the final tournament match to be played at Manuka Oval, Ireland will be looking to impress the Canberra crowd with a win over one of the tournament favourites – South Africa. </p><p>South Africa will be cautious of an Ireland side that lifts on cricket’s biggest stage and is unafraid to take risks in the pursuit of victory. </p><p>With a quarter-final place at stake, South Africa will be relying on its world class all-round ability to overcome the dangerous and defiant Ireland.</p>",
            "cwc-2015-25": "<p>The tournament moves to Napier for the first time as Pakistan take on the improving United Arab Emirates (UAE). </p><p>Laden with expansive stroke-makers, UAE will be hoping to score freely on the batter-friendly McLean Park and build pressure through its crafty slow bowling unit. </p><p>As one of the tournament favourites, Pakistan will be looking to stamp its mark with a big win but face an intriguing challenge from UAE. </p>",
            "cwc-2015-26": "<p>In its only game in Perth, Australia battle a strong Afghanistan pace attack on a traditionally fast and bouncy WACA wicket. </p><p>Boosted by strong home support, Australia will want to impress against one of world cricket’s most rapidly improving nations. When they clashed for the first and only time in 2012, Afghanistan caused Australia a scare before succumbing to a 66 run loss. </p><p>In conditions expected to suit Afghanistan’s pace attack, Australia will have to be on top of its game to ensure its fans are cheering long into the night. </p>",
            "cwc-2015-27": "<p>Bangladesh face a stern test from Scotland in the final tournament match to be played at Saxton Oval. </p><p>The last ICC Cricket World Cup encounter between the two teams was a thriller in 1999 with Bangladesh scraping home by 22 runs. </p><p>Bangladesh will be hoping for the same result but have to contend with a Scotland side familiar with local conditions, having played its previous three games in the South Island. </p>",
            "cwc-2015-28": "<p>It will be a battle of two superstar teams when defending champions India take on the mighty West Indies in Perth. </p><p>With innovative and powerful batsmen scattered throughout both teams, a high scoring clash is expected at the batter-friendly WACA. </p><p>West Indies will be looking to avenge its loss to India at the 2011 tournament while India will be earmarking this as a must-win clash ahead of the quarter-final stage. </p>",
            "cwc-2015-29": "<p>In a match 16 years in the making, ODI powerhouses South Africa and Pakistan meet in Auckland. </p><p>After taking out the first three World Cup encounters between the two teams in 1992, 1996 and 1999, South Africa have been waiting patiently to extend its winning run against Pakistan. </p><p>Pakistan will look to its Eden Park 1992 semi-final victory for inspiration as it attempts to break the South African streak. </p><p>Whatever happens, two of the tournament’s high-flyers will leave nothing on Eden Park as the race to the quarter-finals heats up.</p>",
            "cwc-2015-30": "<p>Nothing could separate Zimbabwe and Ireland in their only previous ICC Cricket World Cup match in 2007. </p><p>On that day, they battled to a tense draw and another tight encounter is in store at Bellerive Oval. </p><p>The two evenly-matched sides will be desperate to break their World Cup deadlock and stay in the frame for a quarter-final berth. It promises to be an exciting clash between two of the tournament’s entertainers in Hobart. </p>",
            "cwc-2015-31": "<p>History will be made at McLean Park as New Zealand and Afghanistan clash in an ODI for the very first time. </p><p>In its only game in Napier, New Zealand will be eager to impress its fans with a dominating performance – but will be weary of a fast-improving Afghanistan. </p><p>With the element of surprise, and a quality pace attack ready to be unleashed on one of New Zealand’s fastest pitches, Afghanistan will be looking to upset the home-town favourites.</p>",
            "cwc-2015-32": "<p>In one of the feature match-ups of pool play, Sri Lanka steps into the Sydney Cricket Ground cauldron to take on four-time champions Australia. </p><p>In a match pivotal to the make-up of the quarter-final stage, Sri Lanka will want to improve on its two win-six loss ICC Cricket World Cup record against Australia. </p><p>In front of a big home crowd, Australia will be hoping to put a dent in Sri Lanka’s charge towards another World Cup final appearance – following appearances in the 2007 and 2011 finals.</p>",
            "cwc-2015-33": "<p>England will be hoping to avenge one of the great upsets of the 2011 tournament when it takes on Bangladesh at the Adelaide Oval. </p><p>In 2011, England was stunned by a young Bangladesh side which has improved and developed during the last four years. </p><p>With a place in the quarter-final stage on the line, this is set to be tense clash between two teams eager to book a date in the knockout phase. </p>",
            "cwc-2015-34": "<p>Excitement is guaranteed in this clash between two of the tournament’s most popular teams in Hamilton. </p><p>Reigning ICC Cricket World Cup champions India will take no chances against Ireland. Having disposed of Pakistan and England in previous tournaments, Ireland will be looking for another big scalp to add to its World Cup bounty. </p><p>It will be a battle of the flamboyant and passionate Ireland against the undisputed class of India at Seddon Park. </p>",
            "cwc-2015-35": "<p>Scotland will be backing the element of surprise in its first ever ICC Cricket World Cup match against Sri Lanka. </p><p>Sri Lanka will want a comprehensive performance ahead of the knockout phase – but faces a unique challenge from Scotland. </p><p>If Scotland can get a roll on with the Bellerive Oval crowd behind it, Sri Lanka will face a tricky task against one of world cricket’s rising nations.</p>",
            "cwc-2015-36": "<p>A long wait ends when South Africa and the United Arab Emirates (UAE) face off in Wellington. </p><p>After winning the first ICC Cricket World Cup match between the two sides in 1996, South Africa will be hoping to take its World Cup record to 2-0 against the improving UAE. </p><p>With a well-balanced squad at its disposal, UAE will be hoping to continue the good form which saw it qualify for the ICC Cricket World Cup 2015. Wellington will be in for a treat, as two proud nations go head-to-head for the first time in 18 years.</p>",
            "cwc-2015-37": "<p>An intriguing encounter is in store as New Zealand plays it sonly game in Hamilton during the tournament. </p><p>Although New Zealand holds a 3-0 advantage in ICC Cricket World Cup history over Bangladesh, the visitors will take confidence from the ODI series whitewash it had over New Zealand in 2013. </p><p>New Zealand will need to counter the youthful exuberance and all-round talent of Bangladesh if it is to progress into the quarter-final stage.</p>",
            "cwc-2015-38": "<p>It is a battle of old versus new, as England takes on ICC Cricket World Cup debutants Afghanistan in Sydney. </p><p>Afghanistan will be buoyed by playing on one of cricket’s biggest stages, and pose a threat to England with its potent pace attack and fearless batting unit. </p><p>In its final pool match, England will be primed for a big performance in front of its committed fan base – the Barmy Army. </p>",
            "cwc-2015-39": "<p>Nothing will be left on the field in this crunch game between India and Zimbabwe at Eden Park. </p><p>Zimbabwe will look to its ICC Cricket World Cup 1999 upset over win India for inspiration, as it looks to topple the defending champions. </p><p>India will want a dominating display to build momentum as the knockout phase closes in. With both teams desperate for victory, this promises to be an exciting clash in Auckland. </p>",
            "cwc-2015-40": "<p>Australia will be looking to end the pool-phase on a high as it jousts with Scotland in Hobart. </p><p>Scotland proved during qualifying that they are a force to be reckoned with. But they will have to lift another gear to contend with Australia in front of its home crowd. </p><p>Excitement is guaranteed in this final Pool A clash which pits one of cricket’s big improvers against an established super-power. </p>",
            "cwc-2015-41": "<p>Napier’s McLean Park hosts the first ever ICC Cricket World Cup match between West Indies and United Arab Emirates (UAE). </p><p>With the knockout phase due to start, two-time champions West Indies will be weary of the threat posed by a seasoned UAE side. </p><p>It will be a battle of West Indies extravagant style against the industrious all-round skills of UAE in Napier. </p>",
            "cwc-2015-42": "<p>Ireland will be hoping St Patrick’s Day comes two days early when it takes on Pakistan at the Adelaide Oval. </p><p>After being stunned by Ireland at the ICC Cricket World Cup 2007, Pakistan will be desperate for revenge in this must-win clash. </p><p>It’s sure to be an epic showdown when Ireland and Pakistan square off in the final Pool match of the ICC Cricket World Cup 2015. </p>"
        }
    },
    {
        "tournamentName": "nz-pak-2015",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/cwc-2015/"
    },
    {
        "tournamentName": "aus-ind-2014",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/cwc-2015/"
    },
    {
        "tournamentName": "aus-triseries-2015",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/cwc-2015/"
    },
    {
        "tournamentName": "sa-wi-2014",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/cwc-2015/"
    },
    {
        "tournamentName": "wcl-div2-2015",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/cwc-2015/"
    },
    {
        "tournamentName": "women-championship",
        "stages": [
            {
                "name": "Points Table",
                "groups": [""],
                "type": "table"
            }
        ],
        "twitterLists": [
            {
                name: 'women-championship_list',
                list: "women-championship_list",
                account: 'women-championship'
            }
        ]
    },
    {
        "tournamentName": "worldt20-2014",
        "year": "2014",
        "fullName": "World Twenty20 <span>2014</span>",
        "shortName": "WT20 2014",
        "dateRange": "06 Jun 2015 - 23 Jun 2015",
        "country": "Bangladesh",
        "urlRoot": "world-t20/archive/men/2014",
        "genderPrefix": "men",
        "mcDefaults": {
            "interactiveScorecard": true
        },
        "linksForAllTeams": false,
        "supportsPlayerProfiles": false,
        "archive": true,

        "buyTicketsText": "Buy Tickets Now",
        "buyTicketsLink": "http://bd.bookmyshow.com/cricket/icc-t20-bangladesh/?utm_source=ICC-BD2",

        "staticUrl": "http://static3.icc-cricket.com/",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/worldt20-2014/",

        "matchTypes": ["T20I"],

        "tweetUser":
        {
            "account": "icc",
            "list": "worldtwenty20",
            "hash": "wt20"
        },
        "twitterLists": [
            {
                name: 'WT20',
                list: "worldt20_list"
            },
            {
                name: "Women's WT20",
                list: "women-worldt20_list"
            }
        ],
        "hashTags": "#wt20",

        "stages": [
            {
                "name": "Super 10",
                "groups": [ "Group 1", "Group 2" ],
                "type": "table",
                "progressionIndex": 1
            },
            {
                "name": "Group Stage",
                "groups": [ "Group A", "Group B" ],
                "type": "table",
                "progressionIndex": 0
            }
        ]
    },

    {
        "tournamentName": "u19cwc-2014",
        "year": "2014",
        "fullName": "U19 Cricket World Cup 2014",
        "shortName": "U19 CWC 2014",
        "country": "United Arab Emirates",
        "urlRoot": "u19-world-cup",
        "mcDefaults": {

        },
        "linksForAllTeams": true,
        "supportsPlayerProfiles": false,

        'customerDataUrl': '', // used to override the auto-generated poll URL
        "tweetUser":
        {
            "account": "icc",
            "list": "u19cwc_list",
            "hash": "u19cwc"
        },
        "twitterLists": [
            {
                name: 'U19 CWC',
                list: "u19cwc_list"
            },
            {
                name: 'ICC',
                list: 'icclist'
            }
        ],

        "stages": [
            {
                "name": "Matches",
                "matches": [
                             // "u19cwc-2014-41", "u19cwc-2014-42", "u19cwc-2014-43", "u19cwc-2014-44",
                             // "u19cwc-2014-45", "u19cwc-2014-46", "u19cwc-2014-47", "u19cwc-2014-48",
                             // "u19cwc-2014-49", "u19cwc-2014-50", "u19cwc-2014-51", "u19cwc-2014-52",
                             // "u19cwc-2014-53", "u19cwc-2014-54", "u19cwc-2014-55", "u19cwc-2014-56",
                             // "u19cwc-2014-57", "u19cwc-2014-58", "u19cwc-2014-59", "u19cwc-2014-60",
                             // "u19cwc-2014-61", "u19cwc-2014-62", "u19cwc-2014-63", "u19cwc-2014-64"
                ],
                "type": "list"
            },
            {
                "name": "Group Stage",
                "groups": [ "Group A", "Group B", "Group C", "Group D" ],
                "type": "table"
            }
        ],

        "hashTags": "#u19cwc",

        "staticUrl": "http://static3.icc-cricket.com/",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/"
    },
    {
        "tournamentName": "worldt20-2014-warmups",
        "year": "2014",
        "fullName": "ICC World Twenty20 2014 Warm-ups",
        "shortName": "ICC WT20 2014 Warm-ups",
        "dateRange": "06 Jun 2015 - 23 Jun 2015",
        "country": "Bangladesh",
        "urlRoot": "world-t20",
        "genderPrefix": "men",
        "mcDefaults": {

        },
        "linksForAllTeams": false,
        "supportsPlayerProfiles": false,

        "staticUrl": "http://static3.icc-cricket.com/",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/worldt20-2014/",

        "matchTypes": ["T20I"],

        "tweetUser":
        {
            "account": "icc",
            "list": "worldtwenty20",
            "hash": "wt20"
        },
        "hashTags": "#wt20"
    },
    {
        "tournamentName": "women-worldt20-2014",
        "year": "2014",
        "fullName": "Women’s ICC World Twenty20 <span>2014</span>",
        "shortName": "Women’s ICC WT20 2014",
        "dateRange": "06 Jun 2015 - 23 Jun 2015",
        "country": "Bangladesh",
        "urlRoot": "world-t20/archive/women/2014",
        "genderPrefix": "women",
        "mcDefaults": {

        },
        "linksForAllTeams": false,
        "supportsPlayerProfiles": false,
        "archive": true,

        "staticUrl": "http://static3.icc-cricket.com/",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/worldt20-2014/",

        "matchTypes": ["T20I"],

        "tweetUser":
        {
            "account": "icc",
            "hash": "wt20"
        },
        "twitterLists": [
            {
                name: "Women's WT20",
                list: "women-worldt20_list"
            },
            {
                name: 'WT20',
                list: "woldt20_list"
            }
        ],
        "hashTags": "#wt20",

        "stages": [
            {
                "name": "Group Stage",
                "groups": [ "Group A", "Group B" ],
                "type": "table",
                "progressionIndex": 0
            }
        ]
    },
    {
        "tournamentName": "women-worldt20-2014-warmups",
        "year": "2014",
        "fullName": "Women’s ICC World Twenty20 2014 Warm-ups",
        "shortName": "Women’s ICC WT20 2014 Warm-ups",
        "dateRange": "06 Jun 2015 - 23 Jun 2015",
        "country": "Bangladesh",
        "genderPrefix": "women",
        "mcDefaults": {

        },
        "linksForAllTeams": true,
        "supportsPlayerProfiles": true,


        "staticUrl": "http://static3.icc-cricket.com/",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/",

        "matchTypes": ["T20I"],

        "tweetUser":
        {
            "account": "icc",
            "list": "worldtwenty20",
            "hash": "wt20"
        },
        "hashTags": "#wt20"
    },
    {
        "tournamentName": "worldt20q-2013",
        "year": "2013",
        "fullName": "ICC World Twenty20 Qualifiers",
        "shortName": "ICC WT20 Qualifiers",
        "dateRange": "06 Jun 2015 - 23 Jun 2015",
        "country": "Bangladesh",
        "genderPrefix": "men",
        "mcDefaults": {},


        "staticUrl": "http://static3.icc-cricket.com/",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/",
        "supportsPlayerProfiles": true,

        "matchTypes": ["T20I"],

        "stages": [
            {
                "name": "Matches",
                // "groups": [ "Knockouts", "Playoffs" ],
                "matches": [ "worldt20q-2013-84", "worldt20q-2013-88", "worldt20q-2013-86" ],
                "type": "list"
            },
            {
                "name": "Group Stage",
                "groups": [ "Group A", "Group B" ],
                "type": "table"
            }
        ],

        "tweetUser":
        {
            "account": "icc",
            "list": "worldtwenty20",
            "hash": "wt20"
        },
        "hashTags": "#wt20",
        "teams":
        {

            "11":
            {
                "abbreviation": "ENG",
                "fullName": "England",
                "twitter": "",
                "hash": ""
            },
            "15":
            {
                "abbreviation": "AUS",
                "fullName": "Australia",
                "twitter": "",
                "hash": ""
            },
            "14":
            {
                "abbreviation": "IND",
                "fullName": "India",
                "twitter": "",
                "hash": ""
            },
            "16":
            {
                "abbreviation": "NZ",
                "fullName": "New Zealand",
                "twitter": "",
                "hash": ""
            },
            "20":
            {
                "abbreviation": "PAK",
                "fullName": "Pakistan",
                "twitter": "",
                "hash": ""
            },
            "19":
            {
                "abbreviation": "SA",
                "fullName": "South Africa",
                "twitter": "",
                "hash": ""
            },
            "13":
            {
                "abbreviation": "SL",
                "fullName": "Sri Lanka",
                "twitter": "",
                "hash": ""
            },
            "21":
            {
                "abbreviation": "WI",
                "fullName": "West Indies",
                "twitter": "",
                "hash": ""
            }
        }
    },
    {
        "tournamentName": "cwc-2011",
        "hasBallByBall": true,
        "matchTypes": ["CWC"],
        "fullName": "ICC Cricket World Cup 2011",
        "country": "India, Sri Lanka & Bangladesh",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/cwc-2015/",
        "urlRoot": "cricket-world-cup/archive/2011",
        "stages": [
            {
                "name": "Matches",
                "matches": [ "cwc-2011-43", "cwc-2011-44", "cwc-2011-45", "cwc-2011-46", "cwc-2011-47", "cwc-2011-48", "cwc-2011-49" ],
                "type": "list"
            },
            {
                "name": "Group Stage",
                "groups": [ "Pool A", "Pool B" ],
                "type": "table",
                "progressionIndex": 0
            }
        ]
    },
    {
        "tournamentName": "cwc-2007",
        "hasBallByBall": true,
        "matchTypes": ["CWC"],
        "fullName": "ICC Cricket World Cup 2007",
        "urlRoot": "cricket-world-cup/archive/2007",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/cwc-2015/",
        "country": "West Indies",
        "stages": [
            {
                "name": "Matches",
                "matches": [ "cwc-2007-49", "cwc-2007-50", "cwc-2007-51" ],
                "type": "list"
            },
            {
                "name": "Super Eight",
                "groups": ["Super Eight"],
                "type": "table",
                "progressionIndex": 1
            },
            {
                "name": "Group Stage",
                "groups": [ "Group A", "Group B", "Group C", "Group D" ],
                "type": "table",
                "progressionIndex": 0
            }
        ]
    },
    {
        "tournamentName": "cwc-2003",
        "matchTypes": ["CWC"],
        "fullName": "ICC Cricket World Cup 2003",
        "urlRoot": "cricket-world-cup/archive/2003",
        "country": "South Africa, Zimbabwe & Kenya",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/cwc-2015/",
        "stages": [
            {
                "name": "Matches",
                "matches": [ "cwc-2003-52", "cwc-2003-53", "cwc-2003-54" ],
                "type": "list"
            },
            {
                "name": "Super Six",
                "groups": ["Super Six"],
                "type": "table",
                "progressionIndex": 1
            },
            {
                "name": "Group Stage",
                "groups": [ "Pool A", "Pool B" ],
                "type": "table",
                "progressionIndex": 0
            }
        ]
    },
    {
        "tournamentName": "cwc-1999",
        "matchTypes": ["CWC"],
        "fullName": "ICC Cricket World Cup 1999",
        "urlRoot": "cricket-world-cup/archive/1999",
        "country": "England, Scotland, Ireland, Netherlands & Wales",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/cwc-2015/",
        "stages": [
            {
                "name": "Matches",
                "matches": [ "cwc-1999-40", "cwc-1999-41", "cwc-1999-42" ],
                "type": "list"
            },
            {
                "name": "Super Six",
                "groups": ["Super Six"],
                "type": "table",
                "progressionIndex": 1
            },
            {
                "name": "Group Stage",
                "groups": [ "Group A", "Group B" ],
                "type": "table",
                "progressionIndex": 0
            }
        ]
    },
    {
        "tournamentName": "cwc-1996",
        "matchTypes": ["CWC"],
        "fullName": "ICC Cricket World Cup 1996",
        "urlRoot": "cricket-world-cup/archive/1996",
        "country": "Pakistan, India & Sri Lanka",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/cwc-2015/",
        "stages": [
            {
                "name": "Matches",
                "matches": [ "cwc-1996-32", "cwc-1996-33", "cwc-1996-34", "cwc-1996-35", "cwc-1996-36", "cwc-1996-37", "cwc-1996-38" ],
                "type": "list",
                "progressionIndex": 1
            },
            {
                "name": "Group Stage",
                "groups": [ "Group A", "Group B" ],
                "type": "table",
                "progressionIndex": 0
            }
        ]
    },
    {
        "tournamentName": "cwc-1992",
        "matchTypes": ["CWC"],
        "fullName": "ICC Cricket World Cup 1992",
        "urlRoot": "cricket-world-cup/archive/1992",
        "country": "Australia & New Zealand",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/cwc-2015/",
        "stages": [
            {
                "name": "Matches",
                "matches": [ "cwc-1992-37", "cwc-1992-38", "cwc-1992-39" ],
                "type": "list",
                "progressionIndex": 1
            },
            {
                "name": "Group Stage",
                "groups": [ "" ],
                "type": "table",
                "progressionIndex": 0
            }
        ]
    },
    {
        "tournamentName": "cwc-1987",
        "matchTypes": ["CWC"],
        "fullName": "ICC Cricket World Cup 1987",
        "urlRoot": "cricket-world-cup/archive/1987",
        "country": "India & Pakistan",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/cwc-2015/",
        "stages": [
            {
                "name": "Matches",
                "matches": [ "cwc-1988-25", "cwc-1988-26", "cwc-1988-27" ],
                "type": "list",
                "progressionIndex": 1
            },
            {
                "name": "Group Stage",
                "groups": [ "Group A", "Group B"  ],
                "type": "table",
                "progressionIndex": 0
            }
        ]
    },
    {
        "tournamentName": "cwc-1983",
        "matchTypes": ["CWC"],
        "fullName": "ICC Cricket World Cup 1983",
        "urlRoot": "cricket-world-cup/archive/1983",
        "country": "England",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/cwc-2015/",
        "stages": [
            {
                "name": "Matches",
                "matches": [ "cwc-1983-25", "cwc-1983-26", "cwc-1983-27" ],
                "type": "list"
            },
            {
                "name": "Group Stage",
                "groups": [ "Group A", "Group B"  ],
                "type": "table",
                "progressionIndex": 0
            }
        ]
    },
    {
        "tournamentName": "cwc-1979",
        "matchTypes": ["CWC"],
        "fullName": "ICC Cricket World Cup 1979",
        "urlRoot": "cricket-world-cup/archive/1979",
        "country": "England",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/cwc-2015/",
        "stages": [
            {
                "name": "Matches",
                "matches": [ "cwc-1979-13", "cwc-1979-14", "cwc-1979-15" ],
                "type": "list"
            },
            {
                "name": "Group Stage",
                "groups": [ "Group A", "Group B"  ],
                "type": "table",
                "progressionIndex": 0
            }
        ]
    },
    {
        "tournamentName": "cwc-1975",
        "matchTypes": ["CWC"],
        "fullName": "ICC Cricket World Cup 1975",
        "urlRoot": "cricket-world-cup/archive/1975",
        "country": "England",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/cwc-2015/",
        "stages": [
            {
                "name": "Matches",
                "matches": [ "cwc-1975-13", "cwc-1975-14", "cwc-1975-15" ],
                "type": "list"
            },
            {
                "name": "Group Stage",
                "groups": [ "Group A", "Group B"  ],
                "type": "table",
                "progressionIndex": 0
            }
        ]
    },

    {
        "tournamentName": "champtrophy-2013",
        "year": "2013",
        "fullName": "ICC Champions Trophy 2013",
        "shortName": "ICC CT 2013",
        "dateRange": "06 Jun 2013 - 23 Jun 2013",
        "country": "England & Wales",
        "urlRoot": "champions-trophy",
        "mcDefaults": {
            "social": true,
            "playerProfiles": true
        },

        "staticUrl": "http://static3.icc-cricket.com/",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/",
        "supportsPlayerProfiles": true,

        "matchTypes": ["ODI"],

        "stages": [
            {
                "name": "Matches",
                "matches": [ "champtrophy-2013-13", "champtrophy-2013-14", "champtrophy-2013-15" ],
                "type": "list"
            },
            {
                "name": "Group Stage",
                "groups": [ "Group A", "Group B" ],
                "type": "table"
            }
        ],

        "tweetUser":
        {
            "account": "icc",
            "hash": "ICC"
        },
        "hashTags": "#cricket #liveeveryball #ct13",
        "teams":
        {

            "11":
            {
                "abbreviation": "ENG",
                "fullName": "England",
                "twitter": "",
                "hash": ""
            },
            "15":
            {
                "abbreviation": "AUS",
                "fullName": "Australia",
                "twitter": "",
                "hash": ""
            },
            "14":
            {
                "abbreviation": "IND",
                "fullName": "India",
                "twitter": "",
                "hash": ""
            },
            "16":
            {
                "abbreviation": "NZ",
                "fullName": "New Zealand",
                "twitter": "",
                "hash": ""
            },
            "20":
            {
                "abbreviation": "PAK",
                "fullName": "Pakistan",
                "twitter": "",
                "hash": ""
            },
            "19":
            {
                "abbreviation": "SA",
                "fullName": "South Africa",
                "twitter": "",
                "hash": ""
            },
            "13":
            {
                "abbreviation": "SL",
                "fullName": "Sri Lanka",
                "twitter": "",
                "hash": ""
            },
            "21":
            {
                "abbreviation": "WI",
                "fullName": "West Indies",
                "twitter": "",
                "hash": ""
            }
        }
    },

    {
        "tournamentName": "champtrophy-2013-warmups",
        "year": "2013",
        "fullName": "ICC Champions Trophy 2013 Warm-ups",
        "shortName": "ICC CT 2013 Warm-ups",
        "dateRange": "06 Jun 2013 - 23 Jun 2013",
        "country": "England & Wales",
        "mcDefaults": {},

        "staticUrl": "http://static3.icc-cricket.com/",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/",
        "supportsPlayerProfiles": true,

        "matchTypes": ["NO_STATS"],

        "tweetUser":
        {
            "account": "icc",
            "list": "icc",
            "hash": "ICC"
        },
        "teams":
        {

            "11":
            {
                "abbreviation": "ENG",
                "fullName": "England",
                "twitter": "",
                "hash": ""
            },
            "15":
            {
                "abbreviation": "AUS",
                "fullName": "Australia",
                "twitter": "",
                "hash": ""
            },
            "14":
            {
                "abbreviation": "IND",
                "fullName": "India",
                "twitter": "",
                "hash": ""
            },
            "16":
            {
                "abbreviation": "NZ",
                "fullName": "New Zealand",
                "twitter": "",
                "hash": ""
            },
            "20":
            {
                "abbreviation": "PAK",
                "fullName": "Pakistan",
                "twitter": "",
                "hash": ""
            },
            "19":
            {
                "abbreviation": "SA",
                "fullName": "South Africa",
                "twitter": "",
                "hash": ""
            },
            "13":
            {
                "abbreviation": "SL",
                "fullName": "Sri Lanka",
                "twitter": "",
                "hash": ""
            },
            "21":
            {
                "abbreviation": "WI",
                "fullName": "West Indies",
                "twitter": "",
                "hash": ""
            }
        }
    },
    {
        "tournamentName": "worldt20-2012",
        "year": "2012",
        "fullName": "ICC World Twenty20 <span>2012</span>",
        "shortName": "ICC WT20 2012",
        "dateRange": "06 Jun 2012 - 23 Jun 2012",
        "country": "Bangladesh",
        "urlRoot": "world-t20/archive/men/2012",
        "genderPrefix": "",
        "mcDefaults": {},
        "linksForAllTeams": false,
        "supportsPlayerProfiles": false,
        "archive": true,

        "buyTicketsText": "Buy Tickets Now",
        "buyTicketsLink": "http://bd.bookmyshow.com/cricket/icc-t20-bangladesh/?utm_source=ICC-BD2",

        'customerDataUrl': '', // used to override the auto-generated poll URL


        "staticUrl": "http://static3.icc-cricket.com/",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/",

        "matchTypes": ["T20I"],

        "tweetUser":
        {
            "account": "worldtwenty20",
            "list": "worldtwenty20",
            "hash": "wt20"
        },
        "hashTags": "#wt20",

        "stages": [
            {
                "name": "Super 8",
                "groups": [ "S8 G1", "S8 G2" ],
                "type": "table",
                "progressionIndex": 1
            },
            {
                "name": "Group Stage",
                "groups": [ "Group A", "Group B", "Group C", "Group D" ],
                "type": "table",
                "progressionIndex": 0
            }
        ]
    },
    {
        "tournamentName": "women-worldt20-2012",
        "year": "2012",
        "fullName": "Women's ICC World Twenty20 <span>2012</span>",
        "shortName": "Women's ICC WT20 2012",
        "dateRange": "06 Jun 2012 - 23 Jun 2012",
        "country": "Bangladesh",
        "urlRoot": "world-t20/archive/women/2012",
        "genderPrefix": "",
        "mcDefaults": {},
        "linksForAllTeams": false,
        "supportsPlayerProfiles": false,
        "archive": true,

        "buyTicketsText": "Buy Tickets Now",
        "buyTicketsLink": "http://bd.bookmyshow.com/cricket/icc-t20-bangladesh/?utm_source=ICC-BD2",


        "staticUrl": "http://static3.icc-cricket.com/",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/",

        "matchTypes": ["T20I"],

        "tweetUser":
        {
            "account": "worldtwenty20",
            "list": "worldtwenty20",
            "hash": "wt20"
        },
        "hashTags": "#wt20",

        "stages": [
            {
                "name": "Group Stage",
                "groups": [ "Group A", "Group B" ],
                "type": "table",
                "progressionIndex": 0
            }
        ]
    },

    {
        "tournamentName": "worldt20-2010",
        "year": "2012",
        "fullName": "ICC World Twenty20 <span>2010</span>",
        "shortName": "ICC WT20 2010",
        "dateRange": "06 Jun 2010 - 23 Jun 2010",
        "country": "West Indies",
        "urlRoot": "world-t20/archive/men/2010",
        "genderPrefix": "",
        "mcDefaults": {},
        "linksForAllTeams": false,
        "supportsPlayerProfiles": false,
        "archive": true,

        "staticUrl": "http://static3.icc-cricket.com/",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/",

        "matchTypes": ["T20I"],

        "stages": [
            {
                "name": "Super 8",
                "groups": [ "Group 1", "Group 2" ],
                "type": "table",
                "progressionIndex": 1
            },
            {
                "name": "Group Stage",
                "groups": [ "Group A", "Group B", "Group C", "Group D" ],
                "type": "table",
                "progressionIndex": 0
            }
        ]
    },

    {
        "tournamentName": "worldt20-2009",
        "year": "2009",
        "fullName": "ICC World Twenty20 <span>2009</span>",
        "shortName": "ICC WT20 2009",
        "dateRange": "06 Jun 2009 - 23 Jun 2009",
        "country": "England",
        "urlRoot": "world-t20/archive/men/2009",
        "genderPrefix": "",
        "mcDefaults": {},
        "linksForAllTeams": false,
        "supportsPlayerProfiles": false,
        "archive": true,

        "staticUrl": "http://static3.icc-cricket.com/",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/",

        "matchTypes": ["T20I"],

        "stages": [
            {
                "name": "Super 8",
                "groups": [ "Group 1", "Group 2" ],
                "type": "table",
                "progressionIndex": 1
            },
            {
                "name": "Group Stage",
                "groups": [ "Group A", "Group B", "Group C", "Group D" ],
                "type": "table",
                "progressionIndex": 0
            }
        ]
    },

    {
        "tournamentName": "worldt20-2007",
        "year": "2007",
        "fullName": "ICC World Twenty20 <span>2007</span>",
        "shortName": "ICC WT20 2007",
        "dateRange": "06 Jun 2007 - 23 Jun 2007",
        "country": "South Africa",
        "urlRoot": "world-t20/archive/men/2007",
        "genderPrefix": "",
        "mcDefaults": {},
        "linksForAllTeams": false,
        "supportsPlayerProfiles": false,
        "archive": true,

        "staticUrl": "http://static3.icc-cricket.com/",
        "playerImageUrl": "http://icc-corp-2013-live.s3.amazonaws.com/players/",

        "matchTypes": ["T20I"],

        "stages": [
            {
                "name": "Super 8",
                "groups": [ "Group 1", "Group 2" ],
                "type": "table",
                "progressionIndex": 1
            },
            {
                "name": "Group Stage",
                "groups": [ "Group A", "Group B", "Group C", "Group D" ],
                "type": "table",
                "progressionIndex": 0
            }
        ]
    }

];
if (!PULSE)                 { var PULSE = {}; }
if (!PULSE.CLIENT)          { PULSE.CLIENT = {}; }
if (!PULSE.CLIENT.CRICKET)  { PULSE.CLIENT.CRICKET = {}; }

PULSE.CLIENT.CRICKET.TEST_IDS = {
    TEST: 0,
    ODI: 1,
    T20I: 2
};
PULSE.CLIENT.CRICKET.PROD_IDS = {
    TEST: 0,
    ODI: 1,
    T20I: 2
};
// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.
if ( !PULSE )                   	{ var PULSE = {}; }
if ( !PULSE.CLIENT )            	{ PULSE.CLIENT = {}; }
if ( !PULSE.CLIENT.CRICKET )    	{ PULSE.CLIENT.CRICKET = {}; }

PULSE.CLIENT.CRICKET.Scrolla = function(config)
{

  this.$container = $(config.container);
  this.upSelector = config.upSelector;
  this.downSelector = config.downSelector;
};


PULSE.CLIENT.CRICKET.Scrolla.prototype.activate = function()
{
  this.containerHeight = this.$container.height();
  this.$listContainer = this.$container.find('ul');
  this.listHeight = this.$listContainer.height();

  this.currentListOffset = this.$listContainer
                                 .css('top').replace('px', '');

  this.maxOffset = (this.containerHeight - this.listHeight) - 30;

  this.addListeners();
};


PULSE.CLIENT.CRICKET.Scrolla.prototype.addListeners = function()
{
  var that = this;

  $('body').on('click', this.downSelector, function(e) {
    e.preventDefault();
  });
  $('body').on('click', this.upSelector, function(e) {
    e.preventDefault();
  });

  $('body').on('mousedown', this.downSelector, function(e) {

    that.scrollingDown = true;
    that.scrollDown();
  });

  $('body').on('mouseup', this.downSelector, function(e) {

    that.scrollingDown = false;
    that.scrollDown();
  });

  $('body').on('mousedown', this.upSelector, function(e) {

    that.scrollingUp = true;
    that.scrollUp();
  });

  $('body').on('mouseup', this.upSelector, function(e) {

    that.scrollingUp = false;
    that.scrollUp();
  });
};


PULSE.CLIENT.CRICKET.Scrolla.prototype.scrollDown = function()
{
  var that = this;

  if (this.scrollingDown && this.maxOffset < 0
  	  && this.currentListOffset > this.maxOffset) {
	
    this.downInterval = setInterval(function() {

      var offset = that.currentListOffset
        , newOffset = parseInt(offset) - 4;

      if (newOffset > that.maxOffset ) {      
        that.$listContainer.css('top', newOffset + 'px');
        that.currentListOffset = newOffset;
      }

    }, 10);
    
  }
  else if (!this.scrollingDown) 
  {
  	
  	clearInterval(this.downInterval);
  }


  if (this.currentListOffset < 0) {

  	$(this.upSelector).show();
  }
  else
  {

  	$(this.upSelector).hide();
  }
 
};

PULSE.CLIENT.CRICKET.Scrolla.prototype.scrollUp = function()
{
  var that = this;

  if (this.scrollingUp && this.currentListOffset < 0) {

  	this.upInterval = setInterval(function() {
    
      var offset = that.currentListOffset
        , newOffset = parseInt(offset) + 4;

      if (newOffset < 10) {

      	that.$listContainer.css('top', newOffset + 'px');
        that.currentListOffset = newOffset;
      }  
      

  	}, 10);
  }
  else if (!this.scrollingUp)
  {

  	clearInterval(this.upInterval);
  }

  if (this.currentListOffset >= -10) {

  	$(this.upSelector).hide();
  }
  else
  {

  	$(this.upSelector).show();
  }


};
$( function()
{
    $( 'div[data-widget-type] .pageShare' ).on( 'click', '.twitter', function( e )
    {
        PULSE.CLIENT.TwitterController.tweetEvent( 'tweet', { text: document.URL } );
    } );
    $( 'div[data-widget-type] .pageShare' ).on( 'click', '.google', function( e )
    {
        PULSE.CLIENT.GooglePlusController.publishEvent( document.URL );
    } );
    $( 'div[data-widget-type] .pageShare' ).on( 'click', '.facebook', function( e )
    {
        PULSE.CLIENT.FacebookController.publishEvent( document.URL );
    } );
} );
if (!PULSE) 						{ var PULSE = {}; }
if (!PULSE.CLIENT) 					{ PULSE.CLIENT = {}; }
if (!PULSE.CLIENT.CRICKET) 			{ PULSE.CLIENT.CRICKET = {}; }
if (!PULSE.CLIENT.CRICKET.STATS) 	{ PULSE.CLIENT.CRICKET.STATS = {}; }

PULSE.CLIENT.CRICKET.STATS.supportedStats = {
		batting: [ 'a', 'r', '4s', '6s', 'no', '50s', '100s', 'inns', 'sr' ],
		bowling: [ 'a', 'e', 'r', 'w', 'd', 'sr', 'inns' ]
};

PULSE.CLIENT.CRICKET.STATS.averages = {
		batting: [ 'a', 'sr' ],
		bowling: [ 'a', 'e', 'sr' ]
};

PULSE.CLIENT.CRICKET.STATS.inverseProportional = {
		batting: [],
		bowling: [ 'e', 'r', 'sr' ]
};

/**
 * Stats captured from WT20 2012
 * Used to determine percentages
 * @type {Object}
 */
PULSE.CLIENT.CRICKET.STATS.BEST = {
	"T20I": {
		'r' : 249,
		'6s': 16,
		'4s': 29,
		'w' : 15,
		'e' : 3.75,
		'a' : 8.00
	}
};

PULSE.CLIENT.CRICKET.STATS.getTitleFromKey = function( stat, type )
{
	if ( type.indexOf( 'Batting' ) > -1 )
	{
		switch ( stat )
		{
			case 'r':
		        return 'Runs';
		    case '4s':
		        return 'Fours';
		    case '6s':
		        return 'Sixes';
		    case 'sr':
		        return 'Batting Strike Rate';
		    case '50s':
		        return 'Fifties';
		    case '100s':
		        return 'Centuries';
		    case 'hs':
		        return 'Individual Score';
		    case 'a':
		        return 'Batting Average';
		    case 'm':
		    	return 'Matches';
		    case 'inns':
		    	return 'Innings';
	        default:
	        	return '';
	    }
	}
	else
	{
	    switch( stat )
	   	{
		    // BOWLING
		    case 'w':
		        return 'Wickets';
		    case '4w':
		        return 'Four Wickets';
		    case 'r':
		        return 'Runs Conceded';
		    case 'e':
		        return 'Economy';
		    case 'bbi':
		        return 'Bowling Figures';
		    case 'd':
		        return 'Dot Balls';
		    case 'sr':
		        return 'Bowling Strike Rate';
		    case 'maid':
		        return 'Maidens';
		    case 'a':
		        return 'Bowling Average';
		    // SPECIAL CASES
		    case 'ballSpeed':
		        return 'Fastest Ball';
		    case 'm':
		    	return 'Matches';
		    case 'inns':
		    	return 'Innings';
		    default:
		        return '';
	    }
	}
}

/**
 * Returns the percentages of stats in relation to each other
 * @param  {String} stat1 the first statistics value
 * @param  {String} stat2 the second statistics value
 * @return {Object}       an object with two parameters: stat1 and stat2,
 *                        for the percentage of the first stat and the
 *                        percentage of the second stat, respectively
 */
PULSE.CLIENT.CRICKET.STATS.getRelativePercentages = function( stat1, stat2 )
{
	stat1 = stat1 === '-' ? 0 : parseInt( stat1 );
	stat2 = stat2 === '-' ? 0 : parseInt( stat2 );

	if (stat1 === 0 && stat2 === 0)
	{
	  	return { stat1: 50, stat2: 50 };
	}

	var total 	 = stat1 + stat2,
		percent1 = ( stat1 * 100 ) / total,
		percent2 = ( stat2 * 100 ) / total;

	return { stat1: percent1, stat2: percent2 };
};

/**
 * Returns the percentage of a stat in relation to a max and a min
 * @param  {String} stat1 the first statistics value
 * @param  {String} stat2 the second statistics value
 * @param  {Number} max   the maximum to compare against (optional)
 * @param  {Number} min   the minimum to compare against (optional)
 * @return {Object}       an object with two parameters: stat1 and stat2,
 *                        for the percentage of the first stat and the
 *                        percentage of the second stat, respectively
 */
PULSE.CLIENT.CRICKET.STATS.getPercentageFromBoundaries = function( stat1, stat2, max, min )
{
	stat1 = stat1 === '-' ? 0 : parseInt( stat1 ),
	stat2 = stat2 === '-' ? 0 : parseInt( stat2 );

	var maxStat = Math.max( stat1, stat2 );

	max = max ? Math.max( max, maxStat ) : maxStat;

	if( min )
	{
		stat1 = stat1 - min;
		stat2 = stat2 - min;
	}
	else
	{
		min = 0;
	}

	max = max - min;

	max = max + ( max / 10 );

	var percent1 = ( stat1 * 100 ) / max,
		percent2 = ( stat2 * 100 ) / max;

	return { stat1: percent1, stat2: percent2 };
};

PULSE.CLIENT.CRICKET.STATS.getMax = function( matchType, statType )
{
	if( PULSE.CLIENT.CRICKET.STATS.BEST[ matchType ] )
	{
		if( PULSE.CLIENT.CRICKET.STATS.BEST[ matchType ][ statType ] )
		{
			return PULSE.CLIENT.CRICKET.STATS.BEST[ matchType ][ statType ];
		}
		else
		{
			console.log( 'STATS CALCULATOR: no default maximum for ' + statType );
		}
	}
	else
	{
		console.log( 'STATS CALCULATOR: no preset maximum values for ' + matchType );
	}
};

PULSE.CLIENT.CRICKET.STATS.getAverageFromMatches = function(stat1, stat2)
{

	stat1.s = stat1.s == '-' ? 0 : parseInt( stat1.s );
	stat2.s = stat2.s == '-' ? 0 : parseInt( stat2.s );

	var arr = [stat1, stat2],
		results = [];

	for (var i=0; i < arr.length; i++)
	{
		var stat = arr[i],
			ave = Math.round(stat.s / stat.m);

		results.push(ave);
	}

	return results;
};







if ( !PULSE )                   	{ var PULSE = {}; }
if ( !PULSE.CLIENT )            	{ PULSE.CLIENT = {}; }
if ( !PULSE.CLIENT.CRICKET )    	{ PULSE.CLIENT.CRICKET = {}; }

PULSE.CLIENT.CRICKET.Toggla = function(config)
{

  this.$container = $(config.container);
  this.sl = config.selector;
  this.type = config.type;
};


PULSE.CLIENT.CRICKET.Toggla.prototype.activate = function(index)
{
  var listWrapper = this.$container.find('ul');
  listWrapper.find('li').eq(index).find('.predictGame').removeClass('inactive');
  this.index = index;

  this.addListeners();
};


PULSE.CLIENT.CRICKET.Toggla.prototype.addListeners = function()
{
  var that = this;

  if (this.type === 'odi' || 't20') {

  	$('body').on('mousedown', this.sl + ' .toggle', function(e) { 
      e.preventDefault();

      if (!$(this).parents('.predictGame').hasClass('inactive')) {

        that.toggleStartX = e.pageX;
  	    that.dragging = true;
        that.$currentSelector = $(this);
        that.setToggleSlide();
      }
  	});

  	$('body').on('mouseup', function(e) {
  	  e.preventDefault();
  	  
  	  if (that.dragging === true) {

  	  	that.dragging = false;
  	    that.setToggleSlide( $(this) );
  	  }
      
  	});

  	$('body').on('click', this.sl + ' .team', function(e) {

      that.$currentSelector = $(this).siblings('.toggle');
  		that.setToggleClick( $(this) );
  	});
  }
  else if (this.type === 'test') {

    //Some Funky Test Stuff Here
  }
};


PULSE.CLIENT.CRICKET.Toggla.prototype.setToggleSlide = function()
{ 
  var $toggleContainer = this.$currentSelector.parents('.predict')
    , that = this;
  
  if (this.dragging) {

    $('body').on('mousemove', $toggleContainer, function(e) {
      e.preventDefault();
      
      that.toggleLastX = e.pageX;
    });

  }
  else
  {
  	//Remove Mousemove Listener
  	$('body').unbind('mousemove');

  	if (this.toggleStartX < this.toggleLastX) {

  	  this.$currentSelector.css('left', '30px');
  	  $toggleContainer.find('.toggleContainer').addClass('teamOne');
  	  $toggleContainer.find('.toggleContainer').removeClass('teamTwo');
  	}

  	else if (this.toggleStartX > this.toggleLastX) {

      this.$currentSelector.css('left', '0');
      $toggleContainer.find('.toggleContainer').addClass('teamTwo');
      $toggleContainer.find('.toggleContainer').removeClass('teamOne');
  	}

    else {

      //Default to home team
      this.$currentSelector.css('left', '30px');
      $toggleContainer.find('.toggleContainer').addClass('teamOne');
      $toggleContainer.find('.toggleContainer').removeClass('teamTwo');
    }

    PULSE.CLIENT.notify('predictor/toggleupdate', {});

  	var index = $toggleContainer.parents('li').index();
  	this.showNext(index);
  }  
};


PULSE.CLIENT.CRICKET.Toggla.prototype.setToggleClick = function($sl)
{

  var index = $sl.index()
    , parentLiIndex = $sl.parents('li').index()
    , $toggleContainer = this.$currentSelector.parents('.predict');

  if (index === 0) {

    this.$currentSelector.css('left', '0');
    $toggleContainer.find('.toggleContainer').addClass('teamTwo');
    $toggleContainer.find('.toggleContainer').removeClass('teamOne');
  }

  else if (index === 1) {
    
    this.$currentSelector.css('left', '30px');
    $toggleContainer.find('.toggleContainer').addClass('teamOne');
    $toggleContainer.find('.toggleContainer').removeClass('teamTwo');  
  }

  PULSE.CLIENT.notify('predictor/toggleupdate', {});
  this.showNext(parentLiIndex);
};


PULSE.CLIENT.CRICKET.Toggla.prototype.showNext = function(currentIndex)
{

  var nextIndex = currentIndex + 1
    , listWrapper = this.$container.find('ul li')
    , length = listWrapper.length
    , nextElState = listWrapper.eq(nextIndex).find('.predictGame').hasClass('inactive');

  if (nextIndex <= length && nextElState) {

  	this.activate(nextIndex);
  }
};
if ( !PULSE )                   { var PULSE = {}; }
if ( !PULSE.CLIENT )            { PULSE.CLIENT = {}; }
if ( !PULSE.CLIENT.Tracking )   { PULSE.CLIENT.Tracking = {}; }

PULSE.CLIENT.Tracking.pageview = function( page, title )
{
    if( window.ga )
    {
        ga( 'send', 'pageview', {
            page:  page,
            title: title
        } );
    }
    else
    {
        console.log( 'Track: PAGEVIEW ' + page );
    }
};

PULSE.CLIENT.Tracking.event = function( category, action, label )
{
    if( window.ga )
    {
        ga( 'send', 'event', category, action, label );
    }
    else
    {
        console.log( 'Track: EVENT ' + category + ' | ' + action + ( label ? ' | ' + label : '' ) );
    }
};
if (!PULSE)             { var PULSE = {}; }
if (!PULSE.CLIENT)      { PULSE.CLIENT = {}; }
if (!PULSE.CLIENT.UI )  { PULSE.CLIENT.UI = {}; }

$( function()
{
    $( 'div[data-widget-type]' ).on( 'click', '.filterDropdown', function( e )
    {
        var $filter = $( this );
        if( !$filter.data( 'initialised' ) )
        {
            $filter.selectionFilter( { optionsSelector: 'li a' } );
            $filter.openDropdown();
        }
    } );
} );

/**
 * Filter view logic specific to old HTML structure filters
 * @param {Object}   options  - classes and selector overrides
 * @param {Function} callback - function executed on click
 */
jQuery.fn.selectionFilter = function( options, callback )
{
    var settings = $.extend( {
        activeClass: 'active', // added to the $container when filter is active
        openClass: 'open', // added to the container to show the dropdown
        displaySelector: '.selection', // displays the default or current selection
        buttonSelector: undefined, // typically same as displaySelector, but can be separate
        optionsSelector: '.option', // selector for the options in the dropdown
        clickScope: 'selectionfilter' // special scope for the clicks attached to the body
    }, options || {} );

    var $container = $( this );
    var $selection = $container.find( settings.displaySelector );
    var $options = $container.find( settings.optionsSelector );
    var $button = settings.buttonSelector ? $container.find( settings.buttonSelector ) : $selection;
    var $body = $( 'body' );


    /**
     * PRIVATE
     */
    var chooseOption = function( $option )
    {
        $selection.html( $option.html() );
        $options.removeClass( settings.activeClass );
        $option.addClass( settings.activeClass );

        closeDropdown();

        if( callback && _.isFunction( callback ) )
        {
            callback( $option );
        }
    };

    var openDropdown = function()
    {
        $container.addClass( settings.openClass );
        $container.addClass( settings.activeClass );
        $body.on( getClickEvent(), function( e )
        {
            if ( !$button.is( e.target ) && $button.has( e.target ).length === 0 )
            {
                closeDropdown();
            }
        } );
    };

    var closeDropdown = function( keepActive )
    {
        $container.removeClass( settings.openClass );
        $container.toggleClass( settings.activeClass, keepActive === true );
        $body.off( getClickEvent() );
    };

    var getClickEvent = function()
    {
        return settings.clickScope ? 'click.' + settings.clickScope : 'click';
    };


    /**
     * PUBLIC
     */
    this.hide = function()
    {
        $container.hide();
    }
    this.show = function()
    {
        $container.show();
    }
    this.chooseOption = function( optionSelector )
    {
        chooseOption( $container.find( optionSelector ) );
    }
    this.openDropdown = function()
    {
        openDropdown();
    };
    this.closeDropdown = function()
    {
        closeDropdown();
    };


    /**
     * CLICK LISTENERS
     */
    $container.off( getClickEvent() ).on( getClickEvent(), settings.optionsSelector, function( e )
    {
        chooseOption( $( this ) );
        e.preventDefault();
    } );

    $button.off( getClickEvent() ).on( getClickEvent(), function( e )
    {
        if( $container.hasClass( settings.openClass ) )
        {
            closeDropdown();
        }
        else
        {
            openDropdown();
        }
        e.preventDefault();
    } );

    $container.data( 'initialised', true );
};

PULSE.CLIENT.UI.ToggleNav = function( options )
{
    if( !options )
	{
		return;
	}

	this.activeTab 		= typeof options.activeTab !== "undefined" ? options.activeTab : 0;
	this.navOnClass 	= options.navActiveClass 		|| 'active';
	this.contentClass 	= options.contentClassPrefix 	|| 'tab';
	this.$nav 			= $( options.navigationContainer ); // mandatory
	this.$content 		= $( options.contentContainer );	// mandatory
	this.$navLinks 		= options.navLinksSelector ? this.$nav.find( options.navLinksSelector ) : this.$nav.children(),
	this.$next 			= $( options.nextButton );
	this.$prev 			= $( options.prevButton );
	this.animate		= options.animate;
	this.callback 		= options.callback;
	this.callbackOnLoad = options.callbackOnLoad;

	if( this.activeTab !== undefined )
	{
		this.$navLinks.eq( this.activeTab ).addClass( this.navOnClass );

		this.$content.children().hide();
		this.$content.find( "." + this.contentClass + this.activeTab ).show();

		if( this.callbackOnLoad )
		{
			this.callback( this.activeTab );
		}
	}

	var that = this;
	this.$navLinks.each( function( index ) {
		$( this ).click( function(e) {
			if( that.activeTab !== index )
			{
				that.activeTab = index;
				that.switchTabs( that );
			}

			return false;
			if( e.preventDefault )
			{
				e.preventDefault();
			}
		} );
	} );

	if( options.nextButton )
	{
		this.$next.click( function(e) {
			if( that.$navLinks.length - 1 > that.activeTab )
			{
				that.activeTab++;
				that.switchTabs( that );
			}

			return false;
			if( e.preventDefault )
			{
				e.preventDefault();
			}
		} );
	}

	if( options.prevButton )
	{
		this.$prev.click( function(e) {
			if( 0 < that.activeTab )
			{
				that.activeTab--;
				that.switchTabs( that );
			}

			return false;
			if( e.preventDefault )
			{
				e.preventDefault();
			}
		} );
	}
};

PULSE.CLIENT.UI.ToggleNav.prototype.switchTabs = function( scope )
{
	if( !scope )
	{
		scope = this;
	}
	scope.$navLinks.removeClass( scope.navOnClass );
	scope.$navLinks.eq( scope.activeTab ).addClass( scope.navOnClass );

	var hideContentChildren = function( callback )
	{
		scope.$content.children().fadeOut('fast');
		if( callback )
		{
			callback( scope.activeTab );
		}
	}

	if( scope.animate )
	{
		hideContentChildren( function() {
			scope.$content.find( "." + scope.contentClass + scope.activeTab ).fadeIn('slow');
		} );
	}
	else
	{
		scope.$content.children().hide();
		scope.$content.find( "." + scope.contentClass + scope.activeTab ).show();
	}

	if( scope.callback )
	{
		scope.callback( scope.activeTab );
	}
};

PULSE.CLIENT.UI.ToggleNav.prototype.switchToTab = function( index )
{
	this.activeTab = index;
	this.switchTabs();
};

// --------- end toggle nav


PULSE.CLIENT.UI.ListScroller = function( options )
{
	var that = this;
	if( !options )
	{
		return;
	}

	this.$itemList		= $( options.listContainer );
	this.itemListWidth	= parseInt(this.$itemList.css('width').replace('px', ''));

	this.$wrapper 		= $( options.wrapper );
	this.wrapperWidth  = parseInt(this.$wrapper.css('width').replace('px', ''));

	this.$upScroll 		= $( options.upScrollButton );
	this.$downScroll 	= $( options.downScrollButton );
	this.maxHeight 		= options.maxHeight || this.$wrapper.css('max-height');
	this.maxWidth 		= options.maxWidth || this.$wrapper.css('max-width');
	this.scrollLength 	= options.scrollLength || 2;
	this.scrollSize 	= options.scrollSize;
	this.orientation 	= options.orientation || 'vertical';
	this.alignment		= options.alignment || 'right';
	this.animating 		= false;
	this.cssTrans 		= options.cssTrans || false;

	$('body').on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", this.$itemList, function() {
		that.animating = false;
		that.refreshScrolling();
	});

	if( this.orientation === 'vertical' )
	{
		this.$upScroll.click( function( e ) {
			e.preventDefault();
			if( that.animating )
			{
				return;
			}
			that.animating = true;
			var topOffset = Math.abs( parseInt( that.$itemList.css('top'), 10 ) ),
				listHeight = that.$itemList.height(),
				scrollHeight = ( listHeight / that.$itemList.children().length ) * that.scrollLength;
			var offset = topOffset < scrollHeight ? topOffset : scrollHeight;
			that.$itemList.animate(
				{
					top: "+=" + offset
				},
				"fast",
				'easeInSine',
				function() {
					that.animating = false;
					that.refreshScrolling();
				}
			);
		} );

		this.$downScroll.click( function( e ) {
			e.preventDefault();
			if( that.animating )
			{
				return;
			}
			that.animating = true;
			var topOffset = Math.abs( parseInt( that.$itemList.css('top'), 10 ) ),
				containerHeight = that.$wrapper.height(),
				listHeight = that.$itemList.height(),
				remainder = listHeight - containerHeight - topOffset,
				scrollHeight = ( listHeight / that.$itemList.children().length ) * that.scrollLength;
			var offset = remainder < scrollHeight ? remainder : scrollHeight;
			that.$itemList.animate(
				{
					top: "-=" + offset
				},
				"fast",
				'easeOutSine',
				function() {
					that.animating = false;
					that.refreshScrolling();
				}
			);
		} );
	}
	else
	{


		this.$upScroll.click( function( e ) {
			e.preventDefault();

			if( that.animating )
			{
				return;
			}

			that.animating = true;
			var topOffset = Math.abs( parseInt( that.$itemList.css(that.alignment), 10 ) ),
				listHeight = that.$itemList.innerWidth(),
				scrollLength = ( listHeight / that.$itemList.children().length ) * that.scrollLength;
			var offset = topOffset < scrollLength ? topOffset : scrollLength;
			var offset = that.scrollSize ? that.scrollSize : offset;

			if( that.alignment === 'right' )
			{

				if ($('html').hasClass('csstransitions') && that.cssTrans) {

					that.$itemList.css('right', '+=' + offset);

				} else {
						that.$itemList.animate(
							{
								right: "+=" + offset
							},
							"fast",
							'easeInSine',
							function() {
								that.animating = false;
								that.refreshScrolling();
							}
						);
				}
			}
			else
			{

				if ($('html').hasClass('csstransitions') && that.cssTrans) {

					var curPos = parseInt(that.$itemList.css('left').replace('px', ''));
					var newOffSet = parseInt(curPos + offset);
					if (newOffSet > 0) {

						that.$itemList.css('left', '0px');
					}
					else {

						that.$itemList.css('left', '+=' + offset);
					}

				} else {
					that.$itemList.animate(
						{
							left: "+=" + offset
						},
						"fast",
						'easeInSine',
						function() {
							that.animating = false;
							that.refreshScrolling();
						}
					);
				}
			}


		} );

		this.$downScroll.click( function( e ) {

			e.preventDefault();

			if( that.animating )
			{
				return;
			}
			that.animating = true;

			var topOffset = Math.abs( parseInt( that.$itemList.css( that.alignment ), 10 ) ),
				containerHeight = that.maxWidth || that.$wrapper.width(),
				listHeight = that.$itemList.innerWidth(),
				remainder = listHeight - containerHeight - topOffset,
				scrollLength = ( listHeight / that.$itemList.children().length ) * that.scrollLength;
			var offset = remainder < scrollLength ? remainder : scrollLength;
			var offset = that.scrollSize ? that.scrollSize : offset;

			if( that.alignment === 'right' )
			{

				if ($('html').hasClass('csstransitions') && that.cssTrans) {

					that.$itemList.css('right', '+=' + offset);

				} else {
					that.$itemList.animate(
						{
							right: "-=" + offset
						},
						"fast",
						'easeOutSine',
						function() {
							that.animating = false;
							that.refreshScrolling();
						}
					);
				}
			}
			else
			{

				if ($('html').hasClass('csstransitions') && that.cssTrans) {

					var maxScroll = -Math.abs(that.itemListWidth - that.wrapperWidth);
					var curPos = parseInt(that.$itemList.css('left').replace('px', ''))
					var newOffSet = parseInt(curPos - offset);

					if (newOffSet <= maxScroll ) {

						offset = curPos - maxScroll
						that.animating = false;
					}

					that.$itemList.css('left', '-=' + offset);

				} else {

					that.$itemList.animate(
						{
							left: "-=" + offset
						},
						"fast",
						'easeOutSine',
						function() {
							that.animating = false;
							that.refreshScrolling();
						}
					);
				}
			}
		} );
	}

	var that = this;

};

PULSE.CLIENT.UI.ListScroller.prototype.refreshScrolling = function()
{
	if( this.orientation === "vertical" )
	{
		var maxHeight = parseInt( this.maxHeight, 10 ),
			containerHeight = this.$wrapper.height(),
			listHeight = this.$itemList.height();

		if( containerHeight < maxHeight )
		{
			this.$upScroll.hide();
			this.$downScroll.hide();
		}
		else
		{
			var topOffset = parseInt( this.$itemList.css('top'), 10 );
			if( topOffset + 30 < 0 )
			{
				this.$upScroll.fadeIn();
			}
			else
			{
				this.$upScroll.hide();
			}

			if( -topOffset + containerHeight + 30 < listHeight )
			{
				this.$downScroll.fadeIn();
			}
			else
			{
				this.$downScroll.hide();
			}
		}
	}
	else
	{
		var maxWidth = parseInt( this.maxWidth, 10 ),
			containerWidth = this.$wrapper.width(),
			listWidth = 0;

		this.$itemList.children().each( function() {
			listWidth += $(this).outerWidth( true );
		} );

		if( listWidth === 0 )
		{
			listWidth = this.$itemList.width();
		}

		if( containerWidth < maxWidth )
		{
			this.$upScroll.hide();
			this.$downScroll.hide();
		}
		else
		{

			if( this.alignment === "right" )
			{

				var offset = parseInt( this.$itemList.css('right'), 10 );
			}
			else
			{
				var offset = parseInt( this.$itemList.css('left'), 10 );
			}



			if( offset + 30 < 0 )
			{
				this.$upScroll.fadeIn();
			}
			else
			{
				this.$upScroll.hide();
			}

			// console.log( "-offset + containerWidth + 30 < listWidth" );
			// console.log( "-offset + containerWidth + 30 = " + ( -offset + containerWidth + 30 ) );
			// console.log( "listWidth = " + listWidth );

			if( -offset + containerWidth + 30 < listWidth )
			{
				this.$downScroll.fadeIn();
			}
			else
			{
				this.$downScroll.hide();
			}
		}
	}
};

/**
 * Pulse scroller
 * @author tmarson
 */
PULSE.CLIENT.UI.Scroller = (function( $ )
{
    /**
     * Generic scroll functionality
     *
     * @param {HTMLElement} container - element to be scrolled
     * @param {object} [options]
     * @param {integer} [options.animSpeed = 250] - Time taken (ms) for scroller to change position
     * @param {integer} [options.scrollChange = 0.75] - Percentage change of scroller position
     * @param {string} [options.hideClass = 'hide'] - Class added to indicate control container superflousness
     * @param {string} [options.toggleClass = 'inactive'] - Class added to indicate controls threshold
     * @constructor
     */
    var Scroller = function( container, options )
    {
        var self = this;

        self.config = $.extend( {
            animSpeed: 250,
            scrollChange: 0.75,
            hideClass: 'hide',
            toggleClass: 'inactive'
        }, options );

        self.$container = $( container );
        self.container = self.$container[ 0 ];
        self.$scrollControls = $( '<div class="controls"></div>' ).appendTo( self.$container.parent() );
        self.$scrollRight = $( '<span class="horizontalNavArrow next"></span>' ).appendTo( self.$scrollControls ).data( 'posChange', self.config.scrollChange );
        self.$scrollLeft = $( '<span class="horizontalNavArrow prev"></span>' ).addClass( self.config.toggleClass ).appendTo( self.$scrollControls ).data( 'posChange', -self.config.scrollChange );
        self.scrollPosition = 0;
        this.checkThresholds();

        if( parseInt(self.$scrollControls.css("opacity")) == 0 )
        {
            self.$scrollControls.css({opacity: 1});
        }

        // Scroll element
        self.$scrollControls.on( 'click', 'span', function( e )
        {
            e.preventDefault();
            self.posChange = $( this ).data( 'posChange' ) * self.container.clientWidth;
            if ( self.posChange )
            {
                self.scrollTo( self.scrollPosition + self.posChange );
            }
        } );

        // Refresh scroll controls on resize (with grace period)
        $( window ).on( 'resize', function()
        {
            clearTimeout( self.windowTimeout );
            self.windowTimeout = setTimeout( function()
            {
                self.scrollPosition = self.container.scrollLeft;
                self.checkThresholds();
            }, 150 );
        } );

        // Refresh scroll controls on scroll (with grace period)
        self.$container.on( 'scroll', function()
        {
            if ( !self.scrollDisabled )
            {
                clearTimeout( self.scrollTimeout );
                self.scrollTimeout = setTimeout( function()
                {
                    self.scrollPosition = self.container.scrollLeft;
                    self.checkThresholds();
                }, 150 );
            }
        } )
    };

    Scroller.prototype = {

        /**
         * Checks the current scroll position -
         * if no scroll required, hide the controls, otherwise toggle state of left / right buttons.
         *
         * @returns {boolean} - Returns true if container can be scrolled
         */
        checkThresholds: function()
        {
            var self = this;

            // If scroll container is not visible, don't check scroll position
            if ( !self.$container.is( ':visible' ) )
            {
                self.$scrollControls.addClass( self.config.hideClass );
                return false;
            }

            // Hide scroll if not needed
            if ( self.container.scrollWidth <= self.container.clientWidth )
            {
                self.$scrollControls.addClass( self.config.hideClass );
                return false;
            }
            else
            {
                self.$scrollControls.removeClass( self.config.hideClass );
            }

            self.currentScroll = self.container.scrollLeft;
            self.maxScroll = self.container.scrollWidth - self.container.clientWidth;

            // Check for scroll beyond left threshold
            if ( self.scrollPosition <= 0 )
            {
                self.scrollPosition = 0;
                self.$scrollLeft.addClass( self.config.toggleClass );
            }
            else
            {
                self.$scrollLeft.removeClass( self.config.toggleClass );
            }

            // Check for scroll beyond right threshold
            if ( self.scrollPosition >= ( self.maxScroll ) )
            {
                self.scrollPosition = self.maxScroll;
                self.$scrollRight.addClass( self.config.toggleClass );
            }
            else
            {
                self.$scrollRight.removeClass( self.config.toggleClass );
            }

            return true;
        },

        /**
         * Scroll the container to a specific position and update controls
         *
         * @param {integer} position - the target position to scroll to
         * @param {boolean} [instantChange = false] - if true, do not animate
         */
        scrollTo: function( position, instantChange )
        {
            var self = this;
            self.scrollPosition = position;

            if ( self.scrollDisabled || !self.checkThresholds() )
            {
                return;
            }

            // Instant change
            if ( instantChange )
            {
                self.container.scrollLeft = self.scrollPosition;
                return;
            }

            // Animated change
            self.scrollDisabled = true;
            self.$container.animate(
                {
                    scrollLeft: self.scrollPosition + 'px'
                },
                self.config.animSpeed,
                function()
                {
                    self.scrollDisabled = false;
                    self.checkThresholds()
                } );
        }
    };

    $( function()
    {
        $.each( $( '[data-widget-type="scroller_widget"]' ), function()
        {
            this.scroller = new Scroller( this );
        } );
    });

    return Scroller;

})
( jQuery );
if ( !PULSE )                   { var PULSE = {}; }
if ( !PULSE.CLIENT )            { PULSE.CLIENT = {}; }
if ( !PULSE.CLIENT.CRICKET )    { PULSE.CLIENT.CRICKET = {}; }

PULSE.CLIENT.CRICKET.DEFAULT_URL_CONFIG = {
    prodPlatform: "http://cdn.pulselive.com/dynamic/data/core/cricket/2012/",
    testPlatform: "http://cdn.pulselive.com/dynamic/data/core/cricket/2012/",
    playerImageUrl: "http://internationalplayers.s3.amazonaws.com/",
    domestic: false
};

PULSE.CLIENT.CRICKET.getUrlGenerator = function( config )
{
	if( config )
	{
		return new PULSE.CLIENT.CRICKET.UrlGenerator( config );
	}
	if( window.urlGenerator === undefined )
	{
		var metadata = PULSE.CLIENT.CRICKET.Metadata;
		window.urlGenerator = new PULSE.CLIENT.CRICKET.UrlGenerator( metadata[0] );
	}

	return window.urlGenerator;
};

PULSE.CLIENT.CRICKET.UrlGenerator = function( config )
{
	this.config = config;
	this.config.prodPlatform  = this.config.prodPlatform  || "http://cdn.pulselive.com/dynamic/data/core/cricket/2012/";
	this.config.testPlatform  = this.config.testPlatform  || "http://cdn.pulselive.com/test/data/core/cricket/2012/";
	this.config.customDataUrl = this.config.customDataUrl;
	this.config.iccDataUrl = "http://cdn.pulselive.com/dynamic/data/icc/";
	this.config.canaryDataUrl = "http://cdn.pulselive.com/dynamic/data/canary/";
	this.config.tournamentGroupUrl = "http://cdn.pulselive.com/dynamic/data/core/cricket/TournamentGroups/"

	var params = PULSE.CLIENT.Util.parseUrlParameters();
	this.production = params[ "test" ] === 'true' ? false : true;

	this.statsURLs = {
		'MostRuns'				: 'most-runs',
		'MostSixes'				: 'most-sixes',
		'MostFours'				: 'most-fours',
		'HighestScores'			: 'highest-scores',
		'BestBattingStrikeRate'	: 'highest-strikerate',

		'MostWickets'			: 'most-wickets',
		'BestBowling'			: 'best-bowling-figures',
		'BowlingAverage'		: 'best-averages',
		'BestEconomy'			: 'best-economy',

		'AllFairplay'			: 'all-fairplay'
	};

    this.updateCoreDataUrl();
};

PULSE.CLIENT.CRICKET.UrlGenerator.prototype.setProduction = function( bool )
{
	this.production = bool;
	this.updateCoreDataUrl();
};

PULSE.CLIENT.CRICKET.UrlGenerator.prototype.getMSIds = function( env )
{
	var production = this.production;
	if( env )
	{
		if( env !== 'production' )
		{
			production = false;
		}
	}

	return production ? PULSE.CLIENT.CRICKET.PROD_IDS : PULSE.CLIENT.CRICKET.TEST_IDS;
};

PULSE.CLIENT.CRICKET.UrlGenerator.prototype.updateCoreDataUrl = function()
{
	this.config.coreDataUrl = this.production ? this.config.prodPlatform : ( this.config.customDataUrl || this.config.testPlatform );
};

/**
 *	Site navigation
 */
PULSE.CLIENT.CRICKET.UrlGenerator.prototype.getMatchURL = function( matchId )
{
	if( !matchId )
	{
		return;
	}

	if( this.config.archive === true )
	{
		return this.getArchiveMatchURL( matchId );
	}

	var array = matchId.split( '-' );
	var string = array[array.length-1];
	if( string )
	{
		var number = parseInt( string, 10 );
		if( !this.config.urlRoot )
		{
			return "/match/" + this.config.tournamentName + "/" + number;
		}
		else
		{
			return "/" + this.config.urlRoot + "/match/" + this.config.tournamentName + "/" + number;
		}
	}
};

PULSE.CLIENT.CRICKET.UrlGenerator.prototype.getArchiveMatchURL = function( matchId )
{
	if( !matchId )
	{
		return;
	}

	var array = matchId.split( '-' );
	var string = array[array.length-1];
	if( string )
	{
		var number = parseInt( string, 10 );
		return "/" + this.config.urlRoot + "/results/scorecard/" + number;
	}
};

// team page URL
PULSE.CLIENT.CRICKET.UrlGenerator.prototype.getTeamURL = function ( teamId, teamFullName )
{
	if( !teamId || !teamFullName )
	{
		return;
	}

	if( this.config.teams && this.config.teams[ teamId ] || this.config.linksForAllTeams )
	{

		teamFullName = teamFullName.toLowerCase();
		if( !this.config.urlRoot )
		{
			return "/teams/" + ( this.config.genderPrefix ? this.config.genderPrefix + '/' : '' ) + teamFullName.replace(/\s/g, "-").replace('-women', '').split('&').join('and') + "/";
		}
		else
		{
			return "/" + this.config.urlRoot + "/teams/" + ( this.config.genderPrefix ? this.config.genderPrefix + '/' : '' ) + teamFullName.replace(/\s/g, "-").replace('-women', '').split('&').join('and') + "/";
		}
	}
};

// player page URL
PULSE.CLIENT.CRICKET.UrlGenerator.prototype.getPlayerURL = function( playerId, playerFullName, teamId, teamFullName)
{
	if( !teamId || !teamFullName || !playerId || !playerFullName )
	{
		return;
	}

	var teamURL = this.getTeamURL( teamId, teamFullName);

	if( teamURL && this.config.supportsPlayerProfiles )
	{
		return teamURL + 'squad/' + playerId + "/" + playerFullName.replace(/\s/g, "-") + "/";
	}
};


PULSE.CLIENT.CRICKET.UrlGenerator.prototype.getVenueUrl = function ( venueId, venueName)
{
	if( !venueId || !venueName )
	{
		return;
	}


	return "/" + this.config.urlRoot + "/venues/" + venueId + "/" + venueName.replace(/\s/g, "-").toLowerCase() + "/overview";
};

PULSE.CLIENT.CRICKET.UrlGenerator.prototype.getFixturesUrl = function()
{
	var pathArray = [ 'fixtures' ];

	if( this.config.urlRoot )
	{
		pathArray.unshift( this.config.urlRoot );
	}

	if( this.config.genderPrefix )
	{
		pathArray.push( this.config.genderPrefix );
	}

	// default for icc-cricket.com
	return '/' + pathArray.join( '/' );
};

PULSE.CLIENT.CRICKET.UrlGenerator.prototype.getArchiveUrl = function()
{
	var pathArray = [ 'archive' ];

	if( this.config.urlRoot )
	{
		pathArray.unshift( this.config.urlRoot );
	}

	if( this.config.genderPrefix )
	{
		pathArray.push( this.config.genderPrefix );
	}

	// default for icc-cricket.com
	return '/' + pathArray.join( '/' );
};

PULSE.CLIENT.CRICKET.UrlGenerator.prototype.getResultsUrl = function()
{
	var pathArray = [ 'results' ];

	if( this.config.urlRoot )
	{
		pathArray.unshift( this.config.urlRoot );
	}

	if( this.config.genderPrefix )
	{
		pathArray.push( this.config.genderPrefix );
	}

	// default for icc-cricket.com
	return '/' + pathArray.join( '/' );
};

PULSE.CLIENT.CRICKET.UrlGenerator.prototype.getStandingsUrl = function()
{
	var pathArray = [ this.getStandingsEndPath() ];

	if( this.config.urlRoot )
	{
		pathArray.unshift( this.config.urlRoot );
	}

	if( this.config.genderPrefix )
	{
		pathArray.push( this.config.genderPrefix );
	}

	// default for icc-cricket.com
	return '/' + pathArray.join( '/' );
};

PULSE.CLIENT.CRICKET.UrlGenerator.prototype.getStandingsEndPath = function()
{
	if( this.config.tournamentName.search( 'cwc' ) > -1 ||
		this.config.tournamentName.search( 'u19cwc' ) > -1 )
	{
		return 'pools';
	}
	else if( this.config.tournamentName.search( 'worldt20' ) > -1 )
	{
		return 'groups';
	}
	else
	{
		return 'standings';
	}
};

PULSE.CLIENT.CRICKET.UrlGenerator.prototype.getStatsUrl = function( type, year )
{
	var paths = [ 'stats' ];
	if( this.config.urlRoot )
	{
		paths.unshift( this.config.urlRoot );
	}
	if( this.config.genderPrefix && !this.config.archive )
	{
		paths.push( this.config.genderPrefix );
	}

	if( !this.config.archive )
	{
		paths.push( year || 'records' );
		paths.push( 'player' );
	}
	if( type && this.statsURLs[ type ] )
	{
		paths.push( this.statsURLs[ type ] );
	}

	return '/' + paths.join( '/' );
};

// full stats of type URL
PULSE.CLIENT.CRICKET.UrlGenerator.prototype.getStatsUrlFor = function( type, year )
{
	return this.getStatsUrl( type, year );
};


/**
 *	Resources
 */
PULSE.CLIENT.CRICKET.UrlGenerator.prototype.makeImgUrl = function( url )
{
	return this.config.staticUrl + url;
};

PULSE.CLIENT.CRICKET.UrlGenerator.prototype.getPlayerImg = function ( playerId, size, extension )
{
	return this.config.playerImageUrl + size + "/" + playerId + ( "." + ( extension || "png" ) );
};

PULSE.CLIENT.CRICKET.UrlGenerator.prototype.getShadowPlayerImg = function( imgSize )
{
	return this.getPlayerImg( 'Photo-Missing', imgSize );
}

PULSE.CLIENT.CRICKET.UrlGenerator.prototype.setPlayerImageLoader = function( playerId, imgSize, $imageWrapper, imgExt )
{
	var playerImg	= this.getPlayerImg( playerId, imgSize, imgExt ),
		noImage		= this.getPlayerImg( 'Photo-Missing', imgSize );

	$( $imageWrapper ).imgLoader( playerImg, noImage );
};

/**
 * 	News articles and other Hit-API-related
 */
PULSE.CLIENT.CRICKET.UrlGenerator.prototype.getArticleURL = function( articleId, articleTitle, year )
{
	if( !articleId || !articleTitle )
	{
		return;
	}

	if( !year )
	{
		year = this.config.year;
	}
	articleTitle.toLowerCase().replace(/\s/g, "-").split('&').join('and');
	return "/news/" + year + "/features/" + articleId + "/" + articleTitle;
};

PULSE.CLIENT.CRICKET.UrlGenerator.prototype.getVideoURL = function( videoId, videoTitle )
{
	if( !videoId || !videoTitle )
	{
		return;
	}

	videoTitle.toLowerCase().replace(/\s/g, "-").split('&').join('and');
	return "/videos/media/id/" + videoId;
};

PULSE.CLIENT.CRICKET.UrlGenerator.prototype.getPhotoAlbumURL = function( albumId, albumTitle )
{
	if( !albumId || !albumTitle )
	{
		return;
	}

	albumTitle.toLowerCase().replace(/\s/g, "-").split('&').join('and');
	return "/photos/" + albumId + "/" + albumTitle;
};


/**
 *	Data urls
 */

PULSE.CLIENT.CRICKET.UrlGenerator.prototype.makeDataUrl = function ( fileName, matchId )
{
	return this.config.coreDataUrl + this.config.tournamentName + "/" + ( matchId ? matchId + '/' : '' ) + fileName + '.js';
};

PULSE.CLIENT.CRICKET.UrlGenerator.prototype.makeICCDataUrl = function ( fileName )
{
	return this.config.iccDataUrl + fileName + '.js';
};

PULSE.CLIENT.CRICKET.UrlGenerator.prototype.makePollDataUrl = function ( fileName )
{
	var url = '';
	if( this.config.customerDataUrl )
	{
		url = this.config.customerDataUrl + 'poll.js';
	}
	else
	{
		url = 'http://cdn.pulselive.com/dynamic/data/icc/' +
              ( this.config.year || new Date().getFullYear() ) + '/' +
              ( fileName || this.config.tournamentName.split( '-warmups' ).join('') ) +
              '/poll.js';
	}
	return url;
};

PULSE.CLIENT.CRICKET.UrlGenerator.prototype.makeCustomTweetMessageUrl = function ( fileName )
{
	return this.config.customerDataUrl + ( fileName || 'customTweet' ) + '.js';
};

PULSE.CLIENT.CRICKET.UrlGenerator.prototype.makeTwitterDataUrl = function ( fileName )
{
	return this.config.canaryDataUrl + fileName + ".js";
};

PULSE.CLIENT.CRICKET.UrlGenerator.prototype.makeAbridgedStatsDataUrl = function( fileName )
{
	return this.config.coreDataUrl + this.config.tournamentName + '/stats/player/abridged/' + fileName + '.js';
};

PULSE.CLIENT.CRICKET.UrlGenerator.prototype.makeFullStatsDataUrl = function( fileName )
{
	return this.config.coreDataUrl + this.config.tournamentName + '/stats/player/full/' + fileName + '.js';
};

PULSE.CLIENT.CRICKET.UrlGenerator.prototype.makeTournamentGroupFullStatsDataUrl = function( fileName )
{
	return this.config.tournamentGroupUrl + this.config.tournamentGroup + '/stats/player/full/' + fileName + '.js';
};

PULSE.CLIENT.CRICKET.UrlGenerator.prototype.makeTournamentGroupAbridgedStatsDataUrl = function( fileName )
{
	return this.config.tournamentGroupUrl + this.config.tournamentGroup + '/stats/player/abridged/' + fileName + '.js';
};

PULSE.CLIENT.CRICKET.UrlGenerator.prototype.makeTeamTournamentStatsDataUrl = function( teamId )
{
	return this.config.coreDataUrl + this.config.tournamentName + '/stats/team/' + teamId + '_tournamentStats.js';
};

PULSE.CLIENT.CRICKET.UrlGenerator.prototype.makeTeamCareerStatsDataUrl = function( teamId )
{
	return this.config.coreDataUrl + this.config.tournamentName + '/stats/team/' + teamId + '_teamCareerStats.js';
};

PULSE.CLIENT.CRICKET.UrlGenerator.prototype.makePlayerCareerStatsDataUrl = function( playerId )
{
	return 'http://cdn.pulselive.com/dynamic/data/core/cricket/careerStats/' + playerId + '_careerStats.js';
};

PULSE.CLIENT.CRICKET.UrlGenerator.prototype.makeCustomerDataUrl = function ( fileName )
{
	return this.config.customerDataUrl + fileName + '.js';
};

PULSE.CLIENT.CRICKET.UrlGenerator.prototype.makeInstagramDataUrl = function()
{
	return this.config.iccDataUrl + 'instagram/';
};

PULSE.CLIENT.CRICKET.UrlGenerator.prototype.makeInstagramAccountUrl = function( account )
{
	return this.makeInstagramDataUrl() + account + '/media.js';
};

// notifies all subscribed components of a certain event
PULSE.CLIENT.notify = function( messageType, params )
{
	$('body').trigger( messageType, params );
};

// retrieves (or creates if it doesn't exist) the data manager object instance
PULSE.CLIENT.getDataManager = function()
{
	if( window.datamgr === undefined ) {
		window.datamgr = new PULSE.CLIENT.JqueryJSONPDataManager();
	}

	return window.datamgr;
};

PULSE.CLIENT.isTest = function()
{
	try
	{
		this.domain = document.domain;
	}
	catch ( err )
	{
		this.domain = 'icc-cricket.com';
	}

	if( this.domain.search('icc-cricket.com') > -1 && this.domain.search('testcma') === -1 )
	{
		return false;
	}
	return true;
};

PULSE.CLIENT.makeBrightcoveVideoModel = function( video, sinceStringFormat )
{
	sinceStringFormat = sinceStringFormat || {
		seconds: " secs ago",
		minutes: " mins ago",
		hours: " hrs ago",
		days: " days ago"
	};
	var date = new Date( video.publishedDate * 1000 );
    return {
        title: video.name,
        description: video.shortDescription,
        publish_date: video.publishedDate,
        date: dateFormat( date, "dd mmmm yyyy" ),
        sinceString: PULSE.CLIENT.DateUtil.getSinceString( date, sinceStringFormat ),
        thumb: _.last( video.thumbnails ).url,
        smallThumb: _.first( video.thumbnails ).url ? _.first( video.thumbnails ).url : _.last( video.thumbnails ).url,
        id: video.id,
        cls: $.map( video.tags, function( value, key ) {
			return value.split( ' ' ).join( '-' );
		} ).join( ' ' ),
        tags: video.tags,
        length: video.length,
        duration: PULSE.CLIENT.extractDuration( video.length ),
        plays: video.plays,
        videoUrl: video.videoUrl
    };
};

PULSE.CLIENT.extractDuration = function( milliseconds )
{
	var seconds = Math.floor( milliseconds / 1000 );
    var h = 0, m = 0, s = 0;

    if( seconds )
    {
	    h = Math.floor( ( seconds %= 86400 ) / 3600 );
	    m = Math.floor( ( seconds %= 3600 ) / 60 );
	    s = seconds % 60;
    }

    return {
        h: h,
        m: m,
        s: s
    };
};

PULSE.CLIENT.pluralise = function( number, singularString, pluralString )
{
	if( number === 1 )
	{
		return singularString;
	}
	else
	{
		return pluralString || singularString + "s";
	}
};

/**
 * Method to take a team abbreviation and work out whether it needs sanitising.
 * Mantis issue #0003238
 * JIRA issue number BWP-1
 */
PULSE.CLIENT.getUserFacingAbbr = function( abbr )
{
	var result = abbr;
    return result;
};

PULSE.CLIENT.getBallClass = function( ballText )
{
	switch( ballText )
	{
	case "6":
		return 'six';
		break;
	case "4":
		return 'four';
		break;
	case "W":
		return 'wicket';
		break;
	default:
		// find any W (except when they're a wide - Wd)
		if( ballText.match(/W(?!d)/) )
		{
			return 'wicket';
		}
		return '';
		break;
	}
};

/**
 * Compares two over arrays to see if they are the same
 * @param  {Array} overA - the first over
 * @param  {Array} overB - the second over
 * @return {Boolean}     - true if they are the same, false if they are not
 */
PULSE.CLIENT.sameOver = function( overA, overB )
{
	if( overA.length !== overB.length )
	{
		return false;
	}

	for( var i = 0, iLimit = overA.length; i < iLimit; i++ )
	{
	    var overAball = overA[ i ].toString();
	    var overBball = overB[ i ].toString();
	    if( overBball !== overAball )
	    {
	    	return false;
	    }
	}

	return true;
};

PULSE.CLIENT.getBallSpeedModel = function( commentaryEntry )
{
	if( commentaryEntry.speed )
	{
		var kmph = commentaryEntry.speed * 3.6;
	    return {
	        'kmph': kmph,
	        'mph': commentaryEntry.speed
	    };
	}
};

PULSE.CLIENT.getMatchInfoFromUrl = function()
{
	var url 		= window.location.href;
	var urlSplit	= url.split("/");

	if( urlSplit.length > 1 )
	{
		var matchNumber = urlSplit[ urlSplit.length - 1 ];
		var tournament 	= urlSplit[ urlSplit.length - 2 ];
		var number 		= parseInt( matchNumber, 10 );

		if( tournament === 'women-championship' )
		{
			var matchId = tournament + '-2014-' + ( number < 10 ? '0' + number : number );
		}
		else
		{
			var matchId = tournament + '-' + ( number < 10 ? '0' + number : number );
		}

		return {
			matchId: matchId,
			tournamentName: tournament
		};
	}

	return {
		matchId: undefined,
		tournamentName: undefined
	};
};

PULSE.CLIENT.getCalendarLink = function( content )
{
    var icsContent = escape( 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//hacksw/handcal//NONSGML v1.0//EN\r\nCALSCALE:GREGORIAN\r\n' + content +'END:VCALENDAR\r\n' ),
        link = 'data:text/calendar;charset=utf8,'+ icsContent;

    return link;
};

// Object.create polyfill
if ( !Object.create )
{
	Object.create = ( function()
	{
		function F() {}

		return function( o )
		{
			if ( arguments.length != 1 )
			{
				throw new Error( 'Object.create implementation only accepts one parameter.' );
			}
			F.prototype = o;
			return new F();
		};
	} )();
};
if (!PULSE) 				{ var PULSE = {}; }
if (!PULSE.CLIENT) 			{ PULSE.CLIENT = {}; }
if (!PULSE.CLIENT.CRICKET) 	{ PULSE.CLIENT.CRICKET = {}; }

PULSE.CLIENT.CRICKET.Tournament = function( data )
{
	//console.log(data);
	this.dm = PULSE.CLIENT.getDataManager();
	this.globalUrlGenerator = PULSE.CLIENT.CRICKET.getUrlGenerator();
	this.tournamentUrlGenerator = PULSE.CLIENT.CRICKET.getUrlGenerator( data );
	
	this.setData( data );

	var path = this.urlRoot ? '/' + this.urlRoot : '';
	this.APICaller = PULSE.CLIENT.CRICKET.getAPICaller( {
		testPhotos: 'http://www.icc-cricket.com' + path + '/api',
		prodPhotos: 'http://www.icc-cricket.com' + path + '/api'
	} );


	this.matches = {};

	this.completeMatches 	= [];
	this.liveMatches 		= [];
	this.upcomingMatches 	= [];

	this.scheduleData 		= [];
	this.squadsData 		= [];
	this.standingsData 		= [];

	this.twitterTeamUrls 		 = {};
	this.twitterTeamData 		 = {};
	this.teamTournamentStatsData = {};
	this.teamCareerStatsData 	 = {};
	this.playerCareerStatsData 	 = {};
	this.twitterHistData 		 = {};

	this.players = {};
};

/**
 * Gets a tournament objects and saves its properties as the properties
 * of this tournament object (i.e., this.tournamentName)
 */
PULSE.CLIENT.CRICKET.Tournament.prototype.setData = function( data )
{
	for( var d in data )
	{
		this[d] = data[d];
	}
};



/**
 *
 * TOURNAMENT MATCHES
 *
 */



/**
 * Gets the match count for a particular type of match (upcoming, live or complete), or
 * the total count of matches in the tournament, if no type is specified
 * @param  {String} type - optional, if given should be 'upcoming', 'live' or 'complete'
 * @return {Number}      - the number of matches of the type (or total matches if no type given)
 */
PULSE.CLIENT.CRICKET.Tournament.prototype.matchCount = function( type )
{
    if( type )
    {
        if( this[ type + 'Matches' ] )
        {
            return this[ type + 'Matches' ].length;
        }
        else
        {
            return 0;
        }
    }

    return this.upcomingMatches.length +
           this.liveMatches.length +
           this.completeMatches.length;
};

PULSE.CLIENT.CRICKET.Tournament.prototype.updateMatches = function ()
{
	var schedule = this.scheduleData;
	if( !schedule ) return;

	for( var i = 0, iLimit = schedule.length; i < iLimit; i++ )
	{
		var match 	= schedule[i],
			matchId = match.matchId.name;

		if( !this.matches[ matchId ] )
		{
			this.matches[ matchId ] = new PULSE.CLIENT.CRICKET.Match( this, matchId );
		}
		this.matches[ matchId ].setScheduleData( match );
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getMatchById = function( matchId )
{
	return this.matches[matchId];
};

PULSE.CLIENT.CRICKET.Tournament.prototype.totalMatches = function()
{
	if( this.scheduleData )
	{
		return this.scheduleData.length;
	}
	return 0;
};


/*
 * The tournament always keeps track of its matches and their states through
 * the schedule file and the scoring files belonging to live matches
 * @params 'live' / 'upcoming' / 'complete'
 */

PULSE.CLIENT.CRICKET.Tournament.prototype.registerMatchAs = function( type, matchId )
{
	this.unregisterMatchAs( type, matchId );
	this[ type + 'Matches' ].push( matchId );
};
PULSE.CLIENT.CRICKET.Tournament.prototype.hasMatchRegisteredAs = function( type, matchId )
{
	var that = this;
	if( $.inArray( matchId, that[ type + 'Matches' ] ) > -1 )
	{
		return true;
	}
	return false;
};
PULSE.CLIENT.CRICKET.Tournament.prototype.unregisterMatchAs = function( type, matchId )
{
	var that = this;
	this[ type + 'Matches' ] = jQuery.grep( that[ type + 'Matches' ], function( value ) {
  		return value !== matchId;
	} );
};


/*
 * Used to retrieve the match object that's upcoming or complete for a respective team
 */
PULSE.CLIENT.CRICKET.Tournament.prototype.getNextMatchForTeam = function( teamId )
{
	for( var i = 0, iLimit = this.upcomingMatches.length; i < iLimit; i++ )
	{
		var matchId = this.upcomingMatches[i],
			match 	= this.getMatchById( matchId );

		if( match.hasTeamWithId( teamId ) )
		{
			return match;
		}
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getLastMatchForTeam = function( teamId )
{
	for( var i = this.completeMatches.length - 1; i >= 0; i-- )
	{
		var matchId = this.completeMatches[i],
			match 	= this.getMatchById( matchId );

		if( match.hasTeamWithId( teamId ) )
		{
			return match;
		}
	}
};

/*
 * Used to retrieve the next consecutive match object following a given id
 */
PULSE.CLIENT.CRICKET.Tournament.prototype.getNextMatchForId = function( matchId )
{
    if( !this.scheduleData ) return;

    var i, entry, match, nextEntry;

    for( i = 0, iLimit = this.scheduleData.length; i < iLimit; i++ )
    {
        entry = this.scheduleData[ i ];
        if( entry.matchId.name === matchId )
        {
            nextEntry = this.scheduleData[ i + 1 ];
            match = nextEntry ? this.matches[ nextEntry.matchId.name ] : undefined;
            return match;
        }
    }
};

/*
 * Used to retrieve the previous consecutive match object following a given id
 */
PULSE.CLIENT.CRICKET.Tournament.prototype.getPreviousMatchForId = function( matchId )
{
    if( !this.scheduleData ) return;

    var i, entry, match, previousEntry;

    for( i = 0, iLimit = this.scheduleData.length; i < iLimit; i++ )
    {
        entry = this.scheduleData[ i ];
        if( entry.matchId.name === matchId )
        {
            previousEntry = this.scheduleData[ i - 1 ];
            match = previousEntry ? this.matches[ previousEntry.matchId.name ] : undefined;
            return match;
        }
    }
};



/**
 *
 * 	USEFUL TOURNAMENT FUNCTIONS
 *	for extracting teams, matches, players etc.
 * 	please note: these are not models
 */

PULSE.CLIENT.CRICKET.Tournament.prototype.getTeamById = function( id )
{
	if( !this.squadsData || this.squadsData.length === 0 ) return;

	for( var i = 0, iLimit = this.squadsData.length; i < iLimit; i++ )
	{
		var squad = this.squadsData[i];
		if( squad && squad.team.id === +id )
		{
			return squad;
		}
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getTeamByAbbr = function( abbr )
{
	if( !this.squadsData || this.squadsData.length === 0 ) return;

	for( var i = 0, iLimit = this.squadsData.length; i < iLimit; i++ )
	{
		var squad = this.squadsData[i];
		if( squad.team.abbreviation === abbr )
		{
			return squad;
		}
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getTeamByPlayerId = function( playerId )
{
	if( !this.squadsData || this.squadsData.length === 0 ) return;

	for( var i = 0, iLimit = this.squadsData.length; i < iLimit; i++ )
	{
		var squad = this.squadsData[i];
		for( var j = 0, jLimit = squad.players.length; j < jLimit; j++ )
		{
			if( squad.players[j].id === +playerId )
			{
				return squad.team;
			}
		}
	}
};

/**
 * Returns an array of team objects, given a match type (state)
 * Match types (states) = [ "upcoming", "live", "complete" ]
 *
 * See Team object in Tipsy3 spec
 */
PULSE.CLIENT.CRICKET.Tournament.prototype.getTeamListFromSchedule = function( matchState )
{
	if( matchState && this[ matchState + 'Matches' ].length === 0 ) return [];

	var data  = this.scheduleData,
		teams = [];

	for ( var i = 0; i < data.length; i++ )
	{
		matchId = data[i].matchId.name;

		if( this.hasMatchRegisteredAs( matchState, matchId ) ||
			!matchState )
		{
			var team1 = data[i].team1;
			var team2 = data[i].team2;

			if ( team1 && team1.team )
			{
				var t1 = team1.team;
				if ( !PULSE.CLIENT.Util.objectFoundById( teams, t1 ) )
				{
					teams.push( t1 );
				}
			}

			if ( team2 && team2.team )
			{
				var t2 = team2.team;
				if ( !PULSE.CLIENT.Util.objectFoundById( teams, t2 ) )
				{
					teams.push( t2 );
				}
			}
		}
	}

	// Sort teams array ( by abbreviation ) alphabetically
	teams.sort( function(a, b)
	{
        var abbrA = a.fullName, abbrB = b.fullName;
        if ( abbrA < abbrB ) //sort abbreviation ascending
        {
        	return -1;
        }
        if ( abbrA > abbrB )
        {
            return 1;
        }
        return 0; //default return value (no sorting)
    } );

	return teams;
};

/**
 * Returns a hash map venue id mapped to venue objects, given a match type (state)
 * Match types (states) = [ "upcoming", "live", "complete" ]
 *
 * See Venue object in Tipsy3 spec
 */
PULSE.CLIENT.CRICKET.Tournament.prototype.getVenueListFromSchedule = function( matchState )
{
	if( matchState && this[ matchState + 'Matches' ].length === 0 ) return [];

	var data  = this.scheduleData,
		venues = [];

	for ( var i = 0; i < data.length; i++ )
	{
		matchId = data[i].matchId.name;

		if( !matchState || this.hasMatchRegisteredAs( matchState, matchId ) )
		{
			var venue = data[i].venue;
			if ( !PULSE.CLIENT.Util.objectFoundById( venues, venue ) )
			{
				venues.push( venue );
			}
		}
	}

	// Sort teams array ( by abbreviation ) alphabetically
	venues.sort( function(a, b)
	{
        var abbrA = a.shortName, abbrB = b.shortName;
        if ( abbrA < abbrB ) //sort abbreviation ascending
        {
        	return -1;
        }
        if ( abbrA > abbrB )
        {
            return 1;
        }
        return 0; //default return value (no sorting)
    } );

	return venues;
};


PULSE.CLIENT.CRICKET.Tournament.prototype.getGroupListFromSchedule = function( matchState )
{
	if( matchState && this[ matchState + 'Matches' ].length === 0 ) return [];

	var data  = this.scheduleData,
		groups = [];

	for ( var i = 0; i < data.length; i++ )
	{
		matchId = data[i].matchId.name;

		if( !matchState || this.hasMatchRegisteredAs( matchState, matchId ) )
		{
			var group = data[i].groupName;
			if ($.inArray( group, groups ) === - 1 && group !== '')
			{
				groups.push( group );
			}
		}
	}

	return groups;
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getPlayerAge = function( dob )
{

	if( dob ) {
		var fullYearMillis = ( ( ( 60 * 60 ) * 24 ) * 365.25 ) * 1000;
		var birth = new Date( dob ).getTime();
		var now = new Date().getTime();
		var dMs = now - birth;

		return Math.floor( dMs / fullYearMillis )

	}

	return false;

};

PULSE.CLIENT.CRICKET.Tournament.prototype.getLatestDidYouKnowText = function()
{
	if( this.DYK && this.DYK[0] )
	return this.DYK[0].text;
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getPollModel = function()
{
	if (this.pulsePollData.length === 0) {
		return false;
	}

	var array = [];

	for (var i=0; i < this.pulsePollData.length; i++ )
	{
		var poll = this.pulsePollData[i];

		var model = {
			id 		   : poll.id,
			text 	   : poll.text,
			totalVotes : poll.totalVotes
		}

		for (var x =0; x < poll.options.length; x++)
		{
			var opts = poll.options[x];

			if (opts.option == 'Yes') {

				model.yes = {
					percent: opts.percentage,
					voteOpt: x
				}
			}
			else if (opts.option == 'No') {

				model.no = {
					percent: opts.percentage,
					voteOpt: x
				}
			}
		}

		array.push(model);
	}

	return { polls: array }
};


PULSE.CLIENT.CRICKET.Tournament.prototype.getPollById = function(id)
{
	var polls = this.getPollModel();

	for (var i=0; i < polls.polls.length; i++)
	{
		var poll = polls.polls[i];

		if (poll.id == id) {

			return poll;
		}
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getTournamentState = function()
{
	if( this.scheduleData.length )
	{
		var match = this.scheduleData[0];
		if( this.scheduleData.length === this.upcomingMatches.length )
		{
			return "U";
		}

		match = this.scheduleData[ this.scheduleData.length - 1 ];
		if( this.scheduleData.length === this.completeMatches.length )
		{
			return "C";
		}

		return "L";
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.isInPlayoffStage = function()
{
	for( var i = this.scheduleData.length - 1; i > 0; i-- )
	{
		var matchData 	= this.scheduleData[ i - 1 ],
			matchId 	= matchData.matchId.name,
			match 		= this.getMatchById( matchId ),
			matchState 	= match.getMatchState();

		// if a playoff match is complete, or if the last group match is complete
		if( this.playoffs[ this.scheduleData[i].matchId.name ] && matchState === "C" )
		{
			return true;
		}
	}
	return false;
};

/**
 * Returns the index of first stage that is yet to be completed.
 *
 * @return {Number} Index of the current stage in progress within the tournament stages.
 */
PULSE.CLIENT.CRICKET.Tournament.prototype.getIndexOfCurrentStage = function( groupsOnly )
{
    // Return the first stage if no data is available
    if( this.scheduleData.length === 0 )
    {
    	return this.stages.length - 1;
    }

    if( !this.stages || this.stages.length === 1 )
    {
    	return 0;
    }

    var tournamentState = this.getTournamentState();

    // Return first stage if tournament is upcoming
    if( tournamentState == 'U' )
    {
        return this.stages.length - 1;
    }
    // Return stage of the next upcoming match if tournament is underway
    else if( tournamentState == 'L' )
    {
        for( var i = 0; i < this.scheduleData.length; i++ )
        {
            var match = this.scheduleData[i],
                matchState = match.matchState;

            if( matchState == 'L' || matchState == 'U' )
            {
                var matchGroup = match.groupName;

                // Return the stage that matches the next upcoming match
                for( var j = 0; j < this.stages.length; j++ )
                {
                    var stage = this.stages[j];

                    if( _.indexOf( stage.groups, matchGroup ) > -1 )
                    {
                        return j;
                    }
                }
            }
        }
    }

    // Return final stage if tournament is complete or none of the groups matched
    if( this.stages[0].type == 'list' && groupsOnly )
    {
        return 1;
    }

    return 0;
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getNextMatchId = function( filter )
{
    if ( this.upcomingMatches.length )
    {
        if( filter )
        {
            var teamId = filter.teamId;
            var venueId = filter.venueId;
            var groupId = filter.groupId;
            var teamIds = filter.teamIds;

            for( var i = 0, iLimit = this.upcomingMatches.length; i < iLimit; i++ )
            {
                var matchId = this.upcomingMatches[ i ];
                var match = this.getMatchById( matchId );

                if( ( !teamId || match.hasTeamWithId( teamId ) ) &&
                    ( !venueId || match.hasVenueWithId( venueId ) )  &&
                    ( !groupId || match.hasGroupWithId( groupId ) ) &&
                    ( ( match.getTeamId( 0 ) < 0 && match.getTeamId( 1 ) < 0 ) ||
                        !_.isArray( teamIds ) ||
                        teamIds.length === 0 ||
                        -1 < PULSE.CLIENT.fuzzyInArray( match.getTeamId( 0 ), teamIds ) ||
                        -1 < PULSE.CLIENT.fuzzyInArray( match.getTeamId( 1 ), teamIds ) ) )
                {
                    return matchId;
                }
            }
        }
        else
        {
            return this.upcomingMatches[ 0 ];
        }
    }
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getLastMatchId = function( filter )
{
    if ( this.completeMatches.length )
    {
        if( filter )
        {
            var teamId = filter.teamId;
            var venueId = filter.venueId;
            var groupId = filter.groupId;
            var teamIds = filter.teamIds;

            for( var i = this.completeMatches.length - 1; i >= 0; i-- )
            {
                var matchId = this.completeMatches[ i ];
                var match = this.getMatchById( matchId );

                if( ( !teamId || match.hasTeamWithId( teamId ) ) &&
                    ( !venueId || match.hasVenueWithId( venueId ) )  &&
                    ( !groupId || match.hasGroupWithId( groupId ) ) &&
                    ( ( match.getTeamId( 0 ) < 0 && match.getTeamId( 1 ) < 0 ) ||
                        !_.isArray( teamIds ) ||
                        teamIds.length === 0 ||
                        -1 < PULSE.CLIENT.fuzzyInArray( match.getTeamId( 0 ), teamIds ) ||
                        -1 < PULSE.CLIENT.fuzzyInArray( match.getTeamId( 1 ), teamIds ) ) )
                {
                    return matchId;
                }
            }
        }
        else
        {
            return this.completeMatches[ this.completeMatches.length - 1 ];
        }
    }
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getMCSettings = function()
{
	var MCSettings = this["mcDefaults"] || {};
	return MCSettings;
};

PULSE.CLIENT.CRICKET.Tournament.prototype.supportsSocial = function()
{
	var settings = this.getMCSettings();
	return settings.social;
};

PULSE.CLIENT.CRICKET.Tournament.prototype.supportsProfileLinks = function()
{
	var settings = this.getMCSettings();
	return settings.playerProfiles;
};
if (!PULSE) 							{ var PULSE = {}; }
if (!PULSE.CLIENT) 						{ PULSE.CLIENT = {}; }
if (!PULSE.CLIENT.CRICKET) 				{ PULSE.CLIENT.CRICKET = {}; }
if (!PULSE.CLIENT.CRICKET.Tournament) 	{ PULSE.CLIENT.CRICKET.Tournament = {}; }

/**
 *
 * START TOURNAMENT-SPECIFIC FEEDS
 *
 */

PULSE.CLIENT.CRICKET.Tournament.prototype.getMatchSchedule = function( start )
{
	if ( this.scheduleLoaded )
	{
		return;
	}
	this.scheduleUrl 	 = this.tournamentUrlGenerator.makeDataUrl( 'matchSchedule2' );
	this.feedSchedule 	 = 'matchSchedule2';
	this.scheduleInterval = 60;
	this.scheduleCallback = 'onMatchSchedule';

	this.dm.addFeed( this.feedSchedule, this.scheduleUrl,
	 	this.scheduleInterval, this.scheduleCallback, [ this ] );

	this.scheduleLoaded = true;

	if( start )
	{
		this.dm.start( this.scheduleUrl );
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getSquads = function( start )
{
	if ( this.squadsLoaded )
	{
		return;
	}
	this.squadsUrl		= this.tournamentUrlGenerator.makeDataUrl( 'squads' );
	this.feedSquads		= 'squads';
	this.squadsInterval	= 300;
	this.squadsCallback	= 'onSquads';

	this.dm.addFeed( this.feedSquads, this.squadsUrl,
	 	this.squadsInterval, this.squadsCallback, [ this ] );

	this.squadsLoaded = true;

	if( start )
	{
		this.dm.start( this.squadsUrl );
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getGroupStandings = function( start )
{
	if ( this.groupStandingsLoaded )
	{
		return;
	}
	this.standingsUrl		= this.tournamentUrlGenerator.makeDataUrl( 'groupStandings' );
	this.feedStandings		= 'groupStandings';
	this.standingsInterval	= 300;
	this.standingsCallback	= 'onGroupStandings';

	this.dm.addFeed( this.feedStandings, this.standingsUrl,
	 	this.standingsInterval, this.standingsCallback, [ this ] );

	this.groupStandingsLoaded = true;

	if( start )
	{
		this.dm.start( this.standingsUrl );
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getPlayersLookup = function( start )
{
	if( !this.playersLookupLoaded )
	{
		return;
	}

	this.playersMapUrl		= this.tournamentUrlGenerator.makeDataUrl( 'playersMap' );
	this.feedPlayersMap		= 'playersMap';
	this.playersMapInterval	= 0; // doesn't need to refresh
	this.playersMapCallback	= 'onPlayersMap';

	this.dm.addFeed( this.feedPlayersMap, this.playersMapUrl,
	 	this.playersMapInterval, this.playersMapCallback, [ this ] );

	this.playersLookupLoaded = true;

	if( start )
	{
		this.dm.start( this.playersMapUrl );
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getAllStats = function( abridged )
{
	if ( this.statsLoaded )
	{
		return;
	}

	this.getMostRunsData( abridged );
	this.getMostWicketsData( abridged );
	this.getMostFoursData( abridged );
	this.getMostSixesData( abridged );

	this.getBestBattingStrikeRateData( abridged );

	this.getMostFiftiesData( abridged );
	this.getMostCenturiesData( abridged );


	this.getHighestScoresData();
	this.getBattingAverageData( abridged );

	this.getBestEconomyData();
	this.getBowlingAverageData( abridged );

	this.statsLoaded = true;
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getMostRunsData = function( abridged, start )
{
	if( abridged )
	{
		this.mostRunsUrl	= this.tournamentUrlGenerator.makeAbridgedStatsDataUrl( 'mostRuns' );
	}
	else
	{
		this.mostRunsUrl	= this.tournamentUrlGenerator.makeFullStatsDataUrl( 'mostRuns' );
	}

	this.feedMostRuns		= 'mostRuns';
	this.mostRunsInterval	= 90;
	this.mostRunsCallback	= 'onMostRuns';

	this.dm.addFeed( this.feedMostRuns, this.mostRunsUrl,
	 	this.mostRunsInterval, this.mostRunsCallback, [ this ] );

	if( start )
	{
		this.dm.start( this.mostRunsUrl );
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.stopMostRunsData = function( abridged )
{
	var mostRunsUrl = this.tournamentUrlGenerator.makeFullStatsDataUrl( 'mostRuns' );
	if( abridged )
	{
		var mostRunsUrl = this.tournamentUrlGenerator.makeAbridgedStatsDataUrl( 'mostRuns' );
	}
	this.dm.stop( mostRunsUrl );
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getMostWicketsData = function( abridged, start )
{
	if ( this.mostWicketsLoaded )
	{
		return;
	}

	if( abridged )
	{
		this.mostWicketsUrl	= this.tournamentUrlGenerator.makeAbridgedStatsDataUrl( 'mostWickets' );
	}
	else
	{
		this.mostWicketsUrl	= this.tournamentUrlGenerator.makeFullStatsDataUrl( 'mostWickets' );
	}

	this.feedMostWickets		= 'mostWickets';
	this.mostWicketsInterval	= 90;
	this.mostWicketsCallback	= 'onMostWickets';

	this.dm.addFeed( this.feedMostWickets, this.mostWicketsUrl,
	 	this.mostWicketsInterval, this.mostWicketsCallback, [ this ] );

	this.mostWicketsLoaded = true;

	if( start )
	{
		this.dm.start( this.mostWicketsUrl );
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.stopMostWicketsData = function( abridged )
{
	var mostWicketsUrl = this.tournamentUrlGenerator.makeFullStatsDataUrl( 'mostWickets' );
	if( abridged )
	{
		var mostWicketsUrl = this.tournamentUrlGenerator.makeAbridgedStatsDataUrl( 'mostWickets' );
	}
	this.dm.stop( mostWicketsUrl );
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getMostFourWicketsData = function( start )
{
	this.mostFourWicketsUrl	= this.tournamentUrlGenerator.makeFullStatsDataUrl( 'mostFourWickets' );

	this.feedMostFourWickets		= 'mostFourWickets';
	this.mostFourWicketsInterval	= 90;
	this.mostFourWicketsCallback	= 'onMostWickets';

	this.dm.addFeed( this.feedMostFourWickets, this.mostFourWicketsUrl,
	 	this.mostFourWicketsInterval, this.mostFourWicketsCallback, [ this ] );

	if( start )
	{
		this.dm.start( this.mostFourWicketsUrl );
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.stopMostFourWicketsData = function( abridged )
{
	var mostFourWicketsUrl = this.tournamentUrlGenerator.makeFullStatsDataUrl( 'mostFourWickets' );
	this.dm.stop( mostFourWicketsUrl );
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getMostRunsConcededData = function( abridged, start )
{
	if( abridged )
	{
		this.mostRunsConcededUrl	= this.tournamentUrlGenerator.makeAbridgedStatsDataUrl( 'mostRunsConcededInnings' );
	}
	else
	{
		this.mostRunsConcededUrl	= this.tournamentUrlGenerator.makeFullStatsDataUrl( 'mostRunsConcededInnings' );
	}

	this.feedMostRunsConceded	= 'mostRunsConcededInnings';
	this.mostRunsConcededInterval	= 90;
	this.mostRunsConcededCallback	= 'onMostRuns';

	this.dm.addFeed( this.feedMostRunsConceded, this.mostRunsConcededUrl,
	 	this.mostRunsConcededInterval, this.mostRunsConcededCallback, [ this ] );

	if( start )
	{
		this.dm.start( this.mostRunsConcededUrl );
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.stopMostRunsConcededData = function( abridged )
{
	var mostRunsConcededUrl = this.tournamentUrlGenerator.makeFullStatsDataUrl( 'mostRunsConcededInnings' );
	if( abridged )
	{
		var mostRunsConcededUrl = this.tournamentUrlGenerator.makeAbridgedStatsDataUrl( 'mostRunsConcededInnings' );
	}
	this.dm.stop( mostRunsConcededUrl );
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getMostSixesData = function( abridged, start )
{
	if ( this.mostSixesLoaded )
	{
		return;
	}

	if( abridged )
	{
		this.mostSixesUrl	= this.tournamentUrlGenerator.makeAbridgedStatsDataUrl( 'mostSixes' );
	}
	else
	{
		this.mostSixesUrl	= this.tournamentUrlGenerator.makeFullStatsDataUrl( 'mostSixes' );
	}

	this.feedMostSixes		= 'mostSixes';
	this.mostSixesInterval	= 90;
	this.mostSixesCallback	= 'onMostSixes';

	this.dm.addFeed( this.feedMostSixes, this.mostSixesUrl,
	 	this.mostSixesInterval, this.mostSixesCallback, [ this ] );

	this.mostSixesLoaded = true;

	if( start )
	{
		this.dm.start( this.mostSixesUrl );
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.stopMostSixesData = function( abridged )
{
	var mostSixesUrl = this.tournamentUrlGenerator.makeFullStatsDataUrl( 'mostSixes' );
	if( abridged )
	{
		var mostSixesUrl = this.tournamentUrlGenerator.makeAbridgedStatsDataUrl( 'mostSixes' );
	}
	this.dm.stop( mostSixesUrl );
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getMostSixesInningsData = function( abridged, start )
{
	if( abridged )
	{
		this.mostSixesInningsUrl	= this.tournamentUrlGenerator.makeAbridgedStatsDataUrl( 'mostSixesInnings' );
	}
	else
	{
		this.mostSixesInningsUrl	= this.tournamentUrlGenerator.makeFullStatsDataUrl( 'mostSixesInnings' );
	}

	this.feedMostSixesInnings		= 'mostSixesInnings';
	this.mostSixesInningsInterval	= 90;
	this.mostSixesInningsCallback	= 'onMostSixes';

	this.dm.addFeed( this.feedMostSixesInnings, this.mostSixesInningsUrl,
	 	this.mostSixesInningsInterval, this.mostSixesInningsCallback, [ this ] );

	if( start )
	{
		this.dm.start( this.mostSixesInningsUrl );
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.stopMostSixesInningsData = function( abridged )
{
	var mostSixesInningsUrl = this.tournamentUrlGenerator.makeFullStatsDataUrl( 'mostSixesInnings' );
	if( abridged )
	{
		var mostSixesInningsUrl = this.tournamentUrlGenerator.makeAbridgedStatsDataUrl( 'mostSixesInnings' );
	}
	this.dm.stop( mostSixesInningsUrl );
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getBestBattingStrikeRateData = function( abridged, start )
{
	if( abridged )
	{
		this.bestBattingStrikeRateUrl	= this.tournamentUrlGenerator.makeAbridgedStatsDataUrl( 'bestBattingStrikeRate' );
	}
	else
	{
		this.bestBattingStrikeRateUrl	= this.tournamentUrlGenerator.makeFullStatsDataUrl( 'bestBattingStrikeRate' );
	}

	this.feedBestBattingStrikeRate	= 'bestBattingStrikeRate';
	this.bestBattingStrikeRateInterval	= 90;
	this.bestBattingStrikeRateCallback	= 'onBestBattingStrikeRate';

	this.dm.addFeed( this.feedBestBattingStrikeRate, this.bestBattingStrikeRateUrl,
	 	this.bestBattingStrikeRateInterval, this.bestBattingStrikeRateCallback, [ this ] );

	if( start )
	{
		this.dm.start( this.bestBattingStrikeRateUrl );
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.stopBestBattingStrikeRateData = function( abridged )
{
	var bestBattingStrikeRateUrl = this.tournamentUrlGenerator.makeFullStatsDataUrl( 'bestBattingStrikeRate' );
	if( abridged )
	{
		var bestBattingStrikeRateUrl = this.tournamentUrlGenerator.makeAbridgedStatsDataUrl( 'bestBattingStrikeRate' );
	}
	this.dm.stop( bestBattingStrikeRateUrl );
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getBestBattingStrikeRateInningsData = function( abridged, start )
{
	if( abridged )
	{
		this.bestBattingStrikeRateInningsUrl	= this.tournamentUrlGenerator.makeAbridgedStatsDataUrl( 'bestBattingStrikeRateInnings' );
	}
	else
	{
		this.bestBattingStrikeRateInningsUrl	= this.tournamentUrlGenerator.makeFullStatsDataUrl( 'bestBattingStrikeRateInnings' );
	}

	this.feedBestBattingStrikeInningsRate		= 'bestBattingStrikeRateInnings';
	this.bestBattingStrikeRateInningsInterval	= 90;
	this.bestBattingStrikeRateInningsCallback	= 'onBestBattingStrikeRate';

	this.dm.addFeed( this.feedBestBattingStrikeInningsRate, this.bestBattingStrikeRateInningsUrl,
	 	this.bestBattingStrikeRateInningsInterval, this.bestBattingStrikeRateInningsCallback, [ this ] );

	if( start )
	{
		this.dm.start( this.bestBattingStrikeRateInningsUrl );
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.stopBestBattingStrikeRateInningsData = function( abridged )
{
	var bestBattingStrikeRateInningsUrl = this.tournamentUrlGenerator.makeFullStatsDataUrl( 'bestBattingStrikeRateInnings' );
	if( abridged )
	{
		var bestBattingStrikeRateInningsUrl = this.tournamentUrlGenerator.makeAbridgedStatsDataUrl( 'bestBattingStrikeRateInnings' );
	}
	this.dm.stop( bestBattingStrikeRateInningsUrl );
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getMostFoursData = function( abridged, start )
{
	this.mostFoursUrl	= this.tournamentUrlGenerator.makeFullStatsDataUrl( 'mostFours' );

	this.feedMostFours		= 'mostFours';
	this.mostFoursInterval	= 90;
	this.mostFoursCallback	= 'onMostFours';

	this.dm.addFeed( this.feedMostFours, this.mostFoursUrl,
	 	this.mostFoursInterval, this.mostFoursCallback, [ this ] );

	if( start )
	{
		this.dm.start( this.mostFoursUrl );
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.stopMostFoursData = function( abridged )
{
	var mostFoursUrl = this.tournamentUrlGenerator.makeFullStatsDataUrl( 'mostFours' );
	this.dm.stop( mostFoursUrl );
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getMostFoursInningsData = function( abridged, start )
{
	if( abridged )
	{
		this.mostFoursInningsUrl	= this.tournamentUrlGenerator.makeAbridgedStatsDataUrl( 'mostFoursInnings' );
	}
	else
	{
		this.mostFoursInningsUrl	= this.tournamentUrlGenerator.makeFullStatsDataUrl( 'mostFoursInnings' );
	}

	this.feedMostFoursInnings		= 'mostFoursInnings';
	this.mostFoursInningsInterval	= 90;
	this.mostFoursInningsCallback	= 'onMostFours';

	this.dm.addFeed( this.feedMostFoursInnings, this.mostFoursInningsUrl,
	 	this.mostFoursInningsInterval, this.mostFoursInningsCallback, [ this ] );

	if( start )
	{
		this.dm.start( this.mostFoursInningsUrl );
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.stopMostFoursInningsData = function( abridged )
{
	var mostFoursInningsUrl = this.tournamentUrlGenerator.makeFullStatsDataUrl( 'mostFoursInnings' );
	if( abridged )
	{
		var mostFoursInningsUrl = this.tournamentUrlGenerator.makeAbridgedStatsDataUrl( 'mostFoursInnings' );
	}
	this.dm.stop( mostFoursInningsUrl );
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getMostFiftiesData = function( abridged, start )
{
	if( abridged )
	{
		this.mostFiftiesUrl	= this.tournamentUrlGenerator.makeAbridgedStatsDataUrl( 'mostFifties' );
	}
	else
	{
		this.mostFiftiesUrl	= this.tournamentUrlGenerator.makeFullStatsDataUrl( 'mostFifties' );
	}

	this.feedMostFifties		= 'mostFifties';
	this.mostFiftiesInterval	= 90;
	this.mostFiftiesCallback		= 'onMostFifties';

	this.dm.addFeed( this.feedMostFifties, this.mostFiftiesUrl,
	 	this.mostFiftiesInterval, this.mostFiftiesCallback, [ this ] );

	if( start )
	{
		this.dm.start( this.mostFiftiesUrl );
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.stopMostFiftiesData = function( abridged, start )
{
	var mostFiftiesUrl = this.tournamentUrlGenerator.makeFullStatsDataUrl( 'mostFifties' );
	if( abridged )
	{
		var mostFiftiesUrl = this.tournamentUrlGenerator.makeAbridgedStatsDataUrl( 'mostFifties' );
	}
	this.dm.stop( mostFiftiesUrl );
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getMostCenturiesData = function( abridged, start )
{
	if( abridged )
	{
		this.mostCenturiesUrl	= this.tournamentUrlGenerator.makeAbridgedStatsDataUrl( 'mostCenturies' );
	}
	else
	{
		this.mostCenturiesUrl	= this.tournamentUrlGenerator.makeFullStatsDataUrl( 'mostCenturies' );
	}

	this.feedMostCenturies		= 'mostCenturies';
	this.mostCenturiesInterval	= 90;
	this.mostCenturiesCallback	= 'onMostCenturies';

	this.dm.addFeed( this.feedMostCenturies, this.mostCenturiesUrl,
	 	this.mostCenturiesInterval, this.mostCenturiesCallback, [ this ] );

	if( start )
	{
		this.dm.start( this.mostCenturiesUrl );
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.stopMostCenturiesData = function( abridged, start )
{
	var mostCenturiesUrl = this.tournamentUrlGenerator.makeFullStatsDataUrl( 'mostCenturies' );
	if( abridged )
	{
		var mostCenturiesUrl = this.tournamentUrlGenerator.makeAbridgedStatsDataUrl( 'mostCenturies' );
	}
	this.dm.stop( mostCenturiesUrl );
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getBestEconomyData = function( abridged, start )
{
	this.bestEconomyUrl			= this.tournamentUrlGenerator.makeFullStatsDataUrl( 'bestBowlingEconomy' );
	this.feedBestEconomy		= 'bestBowlingEconomy';
	this.bestEconomyInterval	= 90;
	this.bestEconomyCallback	= 'onBestEconomy';

	this.dm.addFeed( this.feedBestEconomy, this.bestEconomyUrl,
	 	this.bestEconomyInterval, this.bestEconomyCallback, [ this ] );

	if( start )
	{
		this.dm.start( this.bestEconomyUrl );
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.stopBestEconomyData = function( abridged, start )
{
	var bestEconomyUrl = this.tournamentUrlGenerator.makeFullStatsDataUrl( 'bestBowlingEconomy' );
	this.dm.stop( bestEconomyUrl );
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getBestEconomyInningsData = function( abridged, start )
{
	this.bestEconomyInningsUrl		= this.tournamentUrlGenerator.makeFullStatsDataUrl( 'bestBowlingEconomyInnings' );
	this.feedBestEconomyInnings		= 'bestBowlingEconomyInnings';
	this.bestEconomyInningsInterval	= 90;
	this.bestEconomyInningsCallback	= 'onBestEconomy';

	this.dm.addFeed( this.feedBestEconomyInnings, this.bestEconomyInningsUrl,
	 	this.bestEconomyInningsInterval, this.bestEconomyInningsCallback, [ this ] );

	if( start )
	{
		this.dm.start( this.bestEconomyInningsUrl );
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.stopBestEconomyInningsData = function( abridged, start )
{
	var bestEconomyInningsUrl = this.tournamentUrlGenerator.makeFullStatsDataUrl( 'bestBowlingEconomyInnings' );
	this.dm.stop( bestEconomyInningsUrl );
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getBestBowlingData = function( abridged, start )
{
	this.bestBowlingUrl			= this.tournamentUrlGenerator.makeFullStatsDataUrl( 'bestBowlingInnings' );
	this.feedBestBowling		= 'bestBowlingInnings';
	this.bestBowlingInterval	= 90;
	this.bestBowlingCallback	= 'onBestBowlingInnings';

	this.dm.addFeed( this.feedBestBowling, this.bestBowlingUrl,
	 	this.bestBowlingInterval, this.bestBowlingCallback, [ this ] );

	if( start )
	{
		this.dm.start( this.bestBowlingUrl );
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.stopBestBowlingData = function( abridged, start )
{
	var bestBowlingUrl = this.tournamentUrlGenerator.makeFullStatsDataUrl( 'bestBowlingInnings' );
	this.dm.stop( bestBowlingUrl );
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getFastestBallData = function( abridged, start )
{
	this.fastestBallUrl			= this.tournamentUrlGenerator.makeFullStatsDataUrl( 'fastestBall' );
	this.feedFastestBall		= 'fastestBall';
	this.fastestBallInterval	= 90;
	this.fastestBallCallback	= 'onFastestBall';

	this.dm.addFeed( this.feedFastestBall, this.fastestBallUrl,
	 	this.fastestBallInterval, this.fastestBallCallback, [ this ] );

	if( start )
	{
		this.dm.start( this.fastestBallUrl );
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.stopFastestBallData = function( abridged )
{
	var fastestBallUrl = this.tournamentUrlGenerator.makeFullStatsDataUrl( 'fastestBall' );
	this.dm.stop( fastestBallUrl );
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getMostDotBallsData = function( abridged, start )
{
	this.mostDotBallsUrl		= this.tournamentUrlGenerator.makeFullStatsDataUrl( 'mostDotBalls' );
	this.feedMostDotBalls		= 'mostDotBalls';
	this.mostDotBallsInterval	= 90;
	this.mostDotBallsCallback	= 'onMostDotBalls';

	this.dm.addFeed( this.feedMostDotBalls, this.mostDotBallsUrl,
	 	this.mostDotBallsInterval, this.mostDotBallsCallback, [ this ] );

	if( start )
	{
		this.dm.start( this.mostDotBallsUrl );
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.stopMostDotBallsData = function( abridged, start )
{
	var mostDotBallsUrl = this.tournamentUrlGenerator.makeFullStatsDataUrl( 'mostDotBalls' );
	this.dm.stop( mostDotBallsUrl );
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getMostDotBallsInningsData = function( abridged, start )
{
	this.mostDotBallsInningsUrl		= this.tournamentUrlGenerator.makeFullStatsDataUrl( 'mostDotBallsInnings' );
	this.feedMostDotBallsInnings	= 'mostDotBallsInnings';
	this.mostDotBallsInningsInterval	= 90;
	this.mostDotBallsInningsCallback	= 'onMostDotBalls';

	this.dm.addFeed( this.feedMostDotBallsInnings, this.mostDotBallsInningsUrl,
	 	this.mostDotBallsInningsInterval, this.mostDotBallsInningsCallback, [ this ] );

	if( start )
	{
		this.dm.start( this.mostDotBallsInningsUrl );
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.stopMostDotBallsInningsData = function( abridged )
{
	var mostDotBallsInningsUrl = this.tournamentUrlGenerator.makeFullStatsDataUrl( 'mostDotBallsInnings' );
	this.dm.stop( mostDotBallsInningsUrl );
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getBestStrikeRateData = function( abridged, start )
{
	this.bestStrikeRateUrl		= this.tournamentUrlGenerator.makeFullStatsDataUrl( 'bestBowlingStrikeRate' );
	this.feedBestStrikeRate	= 'bestBowlingStrikeRate';
	this.bestStrikeRateInterval	= 90;
	this.bestStrikeRateCallback	= 'onBestBowlingStrikeRate';

	this.dm.addFeed( this.feedBestStrikeRate, this.bestStrikeRateUrl,
	 	this.bestStrikeRateInterval, this.bestStrikeRateCallback, [ this ] );

	if( start )
	{
		this.dm.start( this.bestStrikeRateUrl );
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.stopBestStrikeRateData = function( abridged )
{
	var bestStrikeRateUrl = this.tournamentUrlGenerator.makeFullStatsDataUrl( 'bestBowlingStrikeRate' );
	this.dm.stop( bestStrikeRateUrl );
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getBestStrikeRateInningsData = function( abridged, start )
{
	this.bestStrikeRateInningsUrl		= this.tournamentUrlGenerator.makeFullStatsDataUrl( 'bestBowlingStrikeRateInnings' );
	this.feedBestStrikeRateInnings	= 'bestBowlingStrikeRateInnings';
	this.bestStrikeRateInningsInterval	= 90;
	this.bestStrikeRateInningsCallback	= 'onBestBowlingStrikeRate';

	this.dm.addFeed( this.feedBestStrikeRateInnings, this.bestStrikeRateInningsUrl,
	 	this.bestStrikeRateInningsInterval, this.bestStrikeRateInningsCallback, [ this ] );

	if( start )
	{
		this.dm.start( this.bestStrikeRateInningsUrl );
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.stopBestStrikeRateInningsData = function( abridged )
{
	var bestStrikeRateInningsUrl = this.tournamentUrlGenerator.makeFullStatsDataUrl( 'bestBowlingStrikeRateInnings' );
	this.dm.stop( bestStrikeRateInningsUrl );
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getMostMaidensData = function( abridged, start )
{
	this.mostMaidensUrl			= this.tournamentUrlGenerator.makeFullStatsDataUrl( 'mostMaidens' );
	this.feedMostMaidens		= 'mostMaidens';
	this.mostMaidensInterval	= 90;
	this.mostMaidensCallback	= 'onMostMaidens';

	this.dm.addFeed( this.feedMostMaidens, this.mostMaidensUrl,
	 	this.mostMaidensInterval, this.mostMaidensCallback, [ this ] );

	if( start )
	{
		this.dm.start( this.mostMaidensUrl );
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.stopMostMaidensData = function( abridged )
{
	var mostMaidensUrl = this.tournamentUrlGenerator.makeFullStatsDataUrl( 'mostMaidens' );
	this.dm.stop( mostMaidensUrl );
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getHighestScoresData = function( abridged, start )
{
	this.highestScoresUrl		= this.tournamentUrlGenerator.makeFullStatsDataUrl( 'highestScoresInnings' );
	this.feedHighestScores		= 'highestScoresInnings';
	this.highestScoresInterval	= 90;
	this.highestScoresCallback	= 'onHighestScores';

	this.dm.addFeed( this.feedHighestScores, this.highestScoresUrl,
	 	this.highestScoresInterval, this.highestScoresCallback, [ this ] );

	if( start )
	{
		this.dm.start( this.highestScoresUrl );
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.stopHighestScoresData = function( abridged )
{
	var highestScoresUrl = this.tournamentUrlGenerator.makeFullStatsDataUrl( 'highestScoresInnings' );
	this.dm.stop( highestScoresUrl );
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getBattingAverageData = function( abridged, start )
{
	this.battingAverageUrl		= this.tournamentUrlGenerator.makeFullStatsDataUrl( 'bestBattingAverage' );
	this.feedBattingAverage		= 'bestBattingAverage';
	this.battingAverageInterval	= 90;
	this.battingAverageCallback	= 'onBestBattingAverage';

	this.dm.addFeed( this.feedBattingAverage, this.battingAverageUrl,
	 	this.battingAverageInterval, this.battingAverageCallback, [ this ] );

	if( start )
	{
		this.dm.start( this.battingAverageUrl );
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.stopBattingAverageData = function( abridged )
{
	var battingAverageUrl = this.tournamentUrlGenerator.makeFullStatsDataUrl( 'bestBattingAverage' );
	this.dm.stop( battingAverageUrl );
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getBowlingAverageData = function( abridged, start )
{
	this.bowlingAverageUrl		= this.tournamentUrlGenerator.makeFullStatsDataUrl( 'bestBowlingAverage' );
	this.feedBowlingAverage		= 'bestBowlingAverage';
	this.bowlingAverageInterval	= 90;
	this.bowlingAverageCallback	= 'onBestBowlingAverage';

	this.dm.addFeed( this.feedBowlingAverage, this.bowlingAverageUrl,
	 	this.bowlingAverageInterval, this.bowlingAverageCallback, [ this ] );

	if( start )
	{
		this.dm.start( this.bowlingAverageUrl );
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.stopBowlingAverageData = function( abridged )
{
	var bowlingAverageUrl = this.tournamentUrlGenerator.makeFullStatsDataUrl( 'bestBowlingAverage' );
	this.dm.stop( bowlingAverageUrl );
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getTeamStatsData = function( teamId, start )
{
	var teamStatsUrl = this.tournamentUrlGenerator.makeTeamTournamentStatsDataUrl( teamId );
	var feedName = "teamStats-" + teamId;
	var teamStatsDataInterval = 120;
	var teamStatsCallback = "onTournamentStats";

	this.dm.addFeed( feedName, teamStatsUrl, teamStatsDataInterval, teamStatsCallback, [ this ] );

	if( start )
	{
		this.dm.start( teamStatsUrl );
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getTeamCareerStatsData = function( teamId, start )
{
	var teamStatsUrl = this.tournamentUrlGenerator.makeTeamCareerStatsDataUrl( teamId );
	var feedName = "teamCareerStats-" + teamId;
	var teamStatsDataInterval = 120;
	var teamStatsCallback = "onTeamCareerStats";

	this.dm.addFeed( feedName, teamStatsUrl, teamStatsDataInterval, teamStatsCallback, [ this ] );

	if( start )
	{
		this.dm.start( teamStatsUrl );
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getPlayerCareerStatsData = function( playerId, start )
{
	var playerStatsUrl = this.tournamentUrlGenerator.makePlayerCareerStatsDataUrl( playerId );
	var feedName = "playerCareerStats-" + playerId;
	var careerStatsDataInterval = 120;
	var careerStatsCallback = "onPlayerCareerStats";

	this.dm.addFeed( feedName, playerStatsUrl, careerStatsDataInterval, careerStatsCallback, [ this ] );

	if( start )
	{
		this.dm.start( playerStatsUrl );
	}
};


PULSE.CLIENT.CRICKET.Tournament.prototype.stopPlayerCareerStatsData = function( playerId )
{
	var playerStatsUrl = this.tournamentUrlGenerator.makePlayerCareerStatsDataUrl( playerId );
	this.dm.stop( playerStatsUrl );
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getTournamentInNumbers = function( start )
{
	this.inNumbersUrl = this.tournamentUrlGenerator.makeDataUrl( 'TournamentInNumbers' );
	this.feedInNumbers = 'inNumbers';
	this.inNumbersInterval = 30;
	this.inNumbersCallback = 'onTournamentInNumbers';

	this.dm.addFeed( this.feedInNumbers, this.inNumbersUrl,
		this.inNumbersInterval, this.inNumbersCallback, [ this ] );

	if( start )
	{
		this.dm.start( this.inNumbersUrl );
	}
};



PULSE.CLIENT.CRICKET.Tournament.prototype.getCanaryTallyData = function( feedName, start )
{
	this.canaryUrl = this.tournamentUrlGenerator.makeTwitterDataUrl( feedName + '/tally' );
	this.feedCanaryName = 'tallyFor' + feedName;
	this.canaryInterval = 5;
	this.canaryCallback = 'onTweetTotal';

	this.dm.addFeed( this.feedCanaryName, this.canaryUrl,
		this.canaryInterval, this.canaryCallback, [ this ] );

	if( start )
	{
		this.dm.start( this.canaryUrl );
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getTwitterData = function( start )
{
	var tweetHandle = 'icclist/tweetList';
	//var tweetHandle = 'ipl_list/tweetList';
	this.twitterUrl = this.tournamentUrlGenerator.makeTwitterDataUrl( tweetHandle );
	this.feedTwitterName = 'twitter',
	this.twitterInterval = 20;
	this.twitterCallback = 'onTwitter';

	this.dm.addFeed( this.feedTwitterName, this.twitterUrl,
		this.twitterInterval, this.twitterCallback, [ this ] );

	if( start )
	{
		this.dm.start( this.twitterUrl );
	}
};


PULSE.CLIENT.CRICKET.Tournament.prototype.getTwitterHistoricalData = function( feedName, start )
{
	this.twitterHistoricalCallback = 'onHistory';
	this.twitterHistoricalInterval = 15;
	var feedURL = this.tournamentUrlGenerator.makeTwitterDataUrl( feedName + "/history" );

	this.dm.addFeed( 'tweetBattle', feedURL,
		this.twitterHistoricalInterval, this.twitterHistoricalCallback, [ this ] );

	if( start )
	{
		this.dm.start( feedURL );
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getTwitterTopicsRanking = function( feedName, fileName, start )
{
	this.rankingCallback = 'onRanking';
	this.rankingInterval = 10;

	this.dm.addFeed( feedName, this.tournamentUrlGenerator.makeTwitterDataUrl( fileName ),
		this.rankingInterval, this.rankingCallback, [ this ] );

	if( start )
	{
		this.dm.start( this.canaryDataUrl + fileName + '.js' );
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getCustomTweetMessageData = function( fileName, start )
{
	var tweetCallback = 'onCustomTweet';
	var tweetInterval = 10;
	var feedName 	  = 'customTweetMessage';
	var feedURL 	  = this.tournamentUrlGenerator.makeCustomTweetMessageUrl(fileName);

	this.dm.addFeed( feedName, feedURL, tweetInterval, tweetCallback, [ this ] );

	if( start )
	{
		this.dm.start( feedURL );
	}
};


PULSE.CLIENT.CRICKET.Tournament.prototype.getPollData = function( start )
{

	var feedUrl = this.tournamentUrlGenerator.makePollDataUrl('');
	var feedName = 'pulsePoll';
	this.dm.addFeed( feedName, feedUrl, 30, 'onPollCallback', [ this ] );
	if( start )
	{
		this.dm.start( feedUrl );
	}
};


PULSE.CLIENT.CRICKET.Tournament.prototype.getTwitterMirrorData = function(feed,  start )
{

	this.twitterMirrorUrl = this.tournamentUrlGenerator.makeTwitterDataUrl(feed);
	this.feedTwitterMirror = 'twitterMirror';
	this.twitterMirrorInterval = 30;
	this.twitterMirrorCallback = 'onTwitter';

	this.dm.addFeed(this.feedTwitterMirror, this.twitterMirrorUrl, this.twitterMirrorInterval,
					this.twitterMirrorCallback, [ this ]);

	if (start)
	{
		this.dm.start( feedUrl );
	}
};
if (!PULSE)                             { var PULSE = {}; }
if (!PULSE.CLIENT)                      { PULSE.CLIENT = {}; }
if (!PULSE.CLIENT.CRICKET)              { PULSE.CLIENT.CRICKET = {}; }
if (!PULSE.CLIENT.CRICKET.Tournament)   { PULSE.CLIENT.CRICKET.Tournament = {}; }


/**
 * Returns an array of live and upcoming match models (as per Match.js)
 * See matchSchedule2.js and scoring.js in Tipsy3 spec
 * @param  {String} dateFormat - formatter for the date (e.g., 'dddd, mmmm d, yyyy')
 * @param  {String} timeFormat - formatter for the time (e.g., 'HH:MM')
 * @return {Object}            - { matches: [ match models ] }
 */
PULSE.CLIENT.CRICKET.Tournament.prototype.getScheduleModel = function( dateFormat, timeFormat )
{
    var model = { matches: [] };

    var liveModel = this.getMatchArrayModelForType(
            'live',
            false,
            {
                dateFormat: dateFormat,
                timeFormat: timeFormat
            }
        );

    var upcomingModel = this.getMatchArrayModelForType(
            'upcoming',
            false,
            {
                dateFormat: dateFormat,
                timeFormat: timeFormat
            }
        );

    model.matches = model.matches.concat( liveModel.matches, upcomingModel.matches );

    return model;
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getResultsModel = function( dateFormat, timeFormat )
{
    var model = { matches: [] };

    var completeModel = this.getMatchArrayModelForType(
            'complete',
            false,
            {
                dateFormat: dateFormat,
                timeFormat: timeFormat
            }
        );

    model.matches = model.matches.concat( completeModel.matches );

    return model;
};

/**
 * Finds the index of a match in a schedule model or returns -1
 */
PULSE.CLIENT.CRICKET.Tournament.prototype.scheduleMatchIdx = function( scheduleModel, matchId )
{
    for( var i = 0; i < scheduleModel.length; i++ )
    {
        var match = scheduleModel[i];

        if( match.matchId === matchId )
        {
            return i;
        }
    }
    return -1;
};

/**
 * Returns an array of match models
 * Match models are generated from PULSE.CLIENT.CRICKET.Match.prototype.getFullModel
 *
 * See Match.js for full model spec
 */
PULSE.CLIENT.CRICKET.Tournament.prototype.getAllMatchesModel = function( dateFormat, timeFormat )
{
    var matches = [];
    for( var i = 0, iLimit = this.scheduleData.length; i < iLimit; i++ )
    {
        var matchId = this.scheduleData[i].matchId.name,
            match = this.getMatchById( matchId ),
            model = match.getFullModel( dateFormat, timeFormat );

        matches.push( model );
    }

    return { matches: matches };
};

/**
 * Returns an array of playoff matches
 * Match models are generated from PULSE.CLIENT.CRICKET.Match.prototype.getFullModel
 *
 * See Match.js for full model spec
 */
PULSE.CLIENT.CRICKET.Tournament.prototype.getPlayoffsMatchesModels = function()
{
    var playoffsArray   = [];

    for( var i = 0, iLimit = this.scheduleData.length; i < iLimit; i++ )
    {
        var match       = this.scheduleData[i],
            matchId     = match.matchId.name,
            matchObj    = this.getMatchById( matchId ),
            fixture     = this.playoffs[ matchId ];

        if( fixture )
        {
            var model   = matchObj.getFullModel( "dddd d mmmm" );

            playoffsArray.push( model );
        }
    }

    return { matches: playoffsArray };
};

/**
 * Returns an array of match models, given a match type (state)
 * Match type = [ "upcoming", "live", "complete" ]
 * Match models are generated from PULSE.CLIENT.CRICKET.Match.prototype.getFullModel
 *
 * See Match.js for full model spec
 */
PULSE.CLIENT.CRICKET.Tournament.prototype.getMatchArrayModelForType = function( type, reverse, options )
{

    if( !options )
    {
        options = {};
    }

    var matches         = [],
        storedMatches   = [].concat( this[ type + 'Matches' ] ),
        limit           = options.limit ? Math.min( options.limit, storedMatches.length ) : storedMatches.length,
        teamId          = options.teamId,
        venueId         = options.venueId,
        groupId         = options.groupId,
        dateFormat      = options.dateFormat,
        timeFormat      = options.timeFormat;

    if( reverse )
    {
        storedMatches.reverse();
    }

    for( var i = 0; i < limit; i++ )
    {
        var matchId = storedMatches[i],
            match   = this.getMatchById( matchId );

        if(( !teamId || match.hasTeamWithId( teamId ) ) && ( !venueId || match.hasVenueWithId( venueId ) )  && ( !groupId || match.hasGroupWithId( groupId ) ) )
        {
            var model = match.getFullModel( dateFormat, timeFormat );
            matches.push( model );
        }
    }

    return { matches: matches };
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getMatchesGroupedByDate = function(type, options)
{
    options = options || {};
    var matchesObj      = {},
        venueId         = options.venueId,
        teamId          = options.teamId,
        teamIds         = options.teamIds,
        groupId         = options.groupId,
        dateFormat      = options.dateFormat,
        timeFormat      = options.timeFormat,
        storedMatches   = this.scheduleData;

    if ( type )
    {
        storedMatches = this[type + 'Matches'];
    }

    for (var i=0, length = storedMatches.length; i < length; i++)
    {
        var match;

        if ( storedMatches[i].matchId )
        {
            match = this.getMatchById( storedMatches[i].matchId.name );
        }
        else
        {
            var matchId = storedMatches[i];
            match = this.getMatchById(matchId);
        }

        var team1Id = match.getTeamId( 0 );
        var team2Id = match.getTeamId( 1 );

        if( ( !teamId || match.hasTeamWithId( teamId ) ) &&
            ( !venueId || match.hasVenueWithId( venueId ) )  &&
            ( !groupId || match.hasGroupWithId( groupId ) ) &&
            ( ( team1Id < 0 && team2Id < 0 ) ||
                !_.isArray( teamIds ) ||
                teamIds.length === 0 ||
                -1 < PULSE.CLIENT.fuzzyInArray( team1Id, teamIds ) ||
                -1 < PULSE.CLIENT.fuzzyInArray( team2Id, teamIds ) ) )
        {
            var model = match.getFullModel(dateFormat, timeFormat),
                matchDate = model.matchDate.substring(0, model.matchDate.indexOf('T'));


            if (!matchesObj[matchDate])
            {
                matchesObj[matchDate] = [];
                matchesObj[matchDate].push(model);
            }
            else
            {
                matchesObj[matchDate].push(model);
            }
        }
    }

    return { matches : matchesObj };
};

/**
 * Retrieve an array of match types (in chronological order of match start date),
 * with the match obejct models
 * @param  {Object} options   date/time format strings and filtering options such as
 *                            teamId, venueId or groupId (name)
 * @return {Object}           { "groups": Array<{ "name": matchType, "matches": Array<matchModels> }> }
 */
PULSE.CLIENT.CRICKET.Tournament.prototype.getMatchesGroupedByType = function( options )
{
    options = options || {};

    var matches = [],
        venueId = options.venueId,
        teamId  = options.teamId,
        teamIds = options.teamIds,
        order  = options.order,
        groupId = options.groupId;

    for( var i = 0, iLimit = this.scheduleData.length; i < iLimit; i++ )
    {
        var match = this.getMatchById( this.scheduleData[i].matchId.name );

        var team1Id = match.getTeamId( 0 );
        var team2Id = match.getTeamId( 1 );

        if( ( !teamId || match.hasTeamWithId( teamId ) ) &&
            ( !venueId || match.hasVenueWithId( venueId ) ) &&
            ( !groupId || match.hasGroupWithId( groupId ) ) &&
            ( ( team1Id < 0 && team2Id < 0 ) ||  !_.isArray( teamIds ) || teamIds.length === 0 || -1 < PULSE.CLIENT.fuzzyInArray( team1Id, teamIds ) || -1 < PULSE.CLIENT.fuzzyInArray( team2Id, teamIds ) ) )
        {
            var matchType = match.getMatchType();
            var model = match.getFullModel( options.dateFormat, options.timeFormat );

            if( i === 0 )
            {
                matches.push( { matchType: matchType, matches: [ model ] } );
                continue;
            }

            var lastGroup = _.last( matches );
            if( !lastGroup || matchType !== lastGroup.matchType )
            {
                matches.push( { matchType: matchType, matches: [ model ] } );
            }
            else
            {
                lastGroup.matches.push( model );
            }
        }
    }

    if( order === 'desc' )
    {
        matches.reverse();

        for( i = 0; i < matches.length; i++ )
        {
            matches[i].matches.reverse();
        }
    }

    return { groups: matches };
};

/**
 * Retrieve an array of groups (in chronological order of group start date),
 * with the match obejct models
 * Note that all ungrouped matches will be added to the 'Ungrouped Matches' group
 *
 * @param  {Object} options   date/time format strings and filtering options such as
 *                            teamId, venueId or groupId (name)
 * @return {Object}           { "groups": Array<{ "name": groupName, "matches": Array<matchModels> }> }
 */
PULSE.CLIENT.CRICKET.Tournament.prototype.getMatchesGroupedByGroup = function( options )
{
    options = options || {};

    var matches = {},
        groups  = [],
        venueId = options.venueId,
        teamId  = options.teamId,
        teamIds  = options.teamIds,
        order  = options.order,
        groupId = options.groupId;

    for( var i = 0, iLimit = this.scheduleData.length; i < iLimit; i++ )
    {
        var match = this.getMatchById( this.scheduleData[i].matchId.name );

        var team1Id = match.getTeamId( 0 );
        var team2Id = match.getTeamId( 1 );

        if(( !teamId || match.hasTeamWithId( teamId ) ) &&
            ( !venueId || match.hasVenueWithId( venueId ) ) &&
            ( !groupId || match.hasGroupWithId( groupId ) ) &&
            ( !_.isArray( teamIds ) || teamIds.length === 0 || -1 < PULSE.CLIENT.fuzzyInArray( team1Id, teamIds ) || -1 < PULSE.CLIENT.fuzzyInArray( team2Id, teamIds ) )  )
        {
            var groupName = match.getGroupName() || 'Ungrouped Matches';
            var model = match.getFullModel( options.dateFormat, options.timeFormat );

            if( !matches[ groupName ] )
            {
                groups.push( groupName );
                matches[ groupName ] = [];
            }

            matches[ groupName ].push( model );
        }
    }

    // !TODO
    // Possible extension includes not putting ungrouped matches all in the same group unless they are all
    // one after another and instead creating an 'Ungrouped Matches' group for every individual match clump
    // This could be specified optionally (via the options param)
    var matchesByGroup = $.map( groups, function( groupName, i )
    {
        return { name: groupName, matches: matches[ groupName ] };
    } );

    if( order === 'desc' )
    {
        matchesByGroup.reverse();

        for( i = 0; i < matchesByGroup.length; i++ )
        {
            matchesByGroup[i].matches.reverse();
        }
    }

    return { groups: matchesByGroup };
};
if (!PULSE) 							{ var PULSE = {}; }
if (!PULSE.CLIENT) 						{ PULSE.CLIENT = {}; }
if (!PULSE.CLIENT.CRICKET) 				{ PULSE.CLIENT.CRICKET = {}; }
if (!PULSE.CLIENT.CRICKET.Tournament) 	{ PULSE.CLIENT.CRICKET.Tournament = {}; }

/**
 *	Tournament onData
 * 	onData gets called by the data manager when the file called is retrieved and the JSONP's read
 */

PULSE.CLIENT.CRICKET.Tournament.prototype.onData = function( data, id )
{
	var that = this;

	if( id === this.feedSchedule
		&& data
		&& data.schedule )
	{
		this.scheduleData = data.schedule;

		this.updateMatches();

		PULSE.CLIENT.notify( 'schedule/update', {
			tournamentName: that.tournamentName,
			success: true
		} );
	}
	else if ( id === this.feedSquads
			&& data
			&& data.squads )
	{
		this.squadsData = data.squads;

		PULSE.CLIENT.notify( 'squads/update', {
			tournamentName: that.tournamentName,
			success: true
		} );
	}
	else if( id === this.feedStandings
			&& data
			&& data.groups )
	{
		this.standingsData = data.groups;

		PULSE.CLIENT.notify( 'standings/update', {
			tournamentName: that.tournamentName,
			success: true
		} );
	}
	else if( id === this.feedPlayersMap
			&& data
			&& data.players )
	{
		this.playersMap = data.players;

		PULSE.CLIENT.notify( 'playersMap/update', {
			tournamentName: that.tournamentName,
			success: true
		} );
	}
	else if ( id.startsWith( 'teamStats-' )
			&& data
			&& data.playersStats
			&& data.team )
	{
		var teamId = id.split('-')[1];
		this.teamTournamentStatsData[ teamId ] = data;

		PULSE.CLIENT.notify( 'teamStats/update', {
			tournamentName: this.tournamentName,
			teamId: teamId,
			success: true
		} );
	}
	else if ( id.startsWith( 'teamCareerStats-' )
			&& data
			&& data.careerStats
			&& data.team )
	{
		var teamId = id.split('-')[1];
		this.teamCareerStatsData[ teamId ] = data;

		PULSE.CLIENT.notify( 'teamCareerStats/update', {
			tournamentName: this.tournamentName,
			teamId: teamId,
			success: true
		} );
	}
	else if ( id.startsWith( 'playerCareerStats-' )
			&& data
			&& data.player
			&& data.stats )
	{
		var playerId = id.split('-')[1];

		for( var i = 0, iLimit = data.stats.length; i < iLimit; i++ )
		{
			var statsGroup = data.stats[i];

			if( !this.playerCareerStatsData[ playerId ] )
			{
				this.playerCareerStatsData[ playerId ] = {};
			}
			this.playerCareerStatsData[ playerId ][ statsGroup.matchType ] = statsGroup;
		}

		this.players[ playerId ] = data.player;

		PULSE.CLIENT.notify( 'playerCareerStats/update', {
			playerId: playerId,
			success: true
		} );
	}
	else if ( id === this.feedMostRuns
			&& data )
	{
		if( data.mostRuns )
		{
			for( var i = 0, iLimit = data.mostRuns.length; i < iLimit; i++ )
			{
				if( data.mostRuns[i].matchType === this.matchTypes[0] )
				{
					this.mostRunsData = data.mostRuns[i].topPlayers;

					break;
				}
				else
				{
					this.mostRunsData = [];
				}
			}
		}
		else
		{
			this.mostRunsData = [];
		}

		PULSE.CLIENT.notify( 'stats/update', {
			tournamentName: that.tournamentName,
			statName: 'MostRuns',
			url: 'mostRuns',
			success: true
		} );
		PULSE.CLIENT.notify( 'mostRunsStats/update', {
			tournamentName: that.tournamentName,
			statName: 'MostRuns',
			url: 'mostRuns',
			success: true
		} );
	}
	else if ( id === this.feedMostWickets
			&& data )
	{
		if( data.mostWickets )
		{
			for( var i = 0, iLimit = data.mostWickets.length; i < iLimit; i++ )
			{
				if( data.mostWickets[i].matchType === this.matchTypes[0] )
				{
					this.mostWicketsData = data.mostWickets[i].topPlayers;

					break;
				}
				else
				{
					this.mostWicketsData = [];
				}
			}
		}
		else
		{
			this.mostWicketsData = [];
		}

		PULSE.CLIENT.notify( 'stats/update', {
			tournamentName: that.tournamentName,
			statName: 'MostWickets',
			url: 'mostWickets',
			success: true
		} );
		PULSE.CLIENT.notify( 'mostWicketsStats/update', {
			tournamentName: that.tournamentName,
			statName: 'MostWickets',
			url: 'mostWickets',
			success: true
		} );
	}
	else if ( id === this.feedMostFourWickets
			&& data )
	{
		if( data.mostWickets )
		{
			for( var i = 0, iLimit = data.mostWickets.length; i < iLimit; i++ )
			{
				if( data.mostWickets[i].matchType === this.matchTypes[0] )
				{
					this.mostFourWicketsData = data.mostWickets[i].topPlayers;

					break;
				}
				else
				{
					this.mostFourWicketsData = [];
				}
			}
		}
		else
		{
			this.mostFourWicketsData = [];
		}

		PULSE.CLIENT.notify( 'stats/update', {
			tournamentName: that.tournamentName,
			statName: 'MostFourWickets',
			url: 'mostFourWickets',
			success: true
		} );
		PULSE.CLIENT.notify( 'mostFourWicketsStats/update' );
	}
	else if ( id === this.feedMostFours || this.feedMostFoursInnings
			&& data )
	{
		if( data.mostFours )
		{
			for( var i = 0, iLimit = data.mostFours.length; i < iLimit; i++ )
			{
				if( data.mostFours[i].matchType === this.matchTypes[0] )
				{
					if (this.feedMostFours)
					{
						this.mostFoursData = data.mostFours[i].topPlayers;
					}
					else if (this.feedMostFoursInnings)
					{
						this.mostFoursInningsData = data.mostFours[i].topPlayers;
					}

					break;
				}
				else
				{
					if (this.feedMostFours)
					{
						this.mostFoursData = [];
					}
					else if (this.feedMostFoursInnings)
					{
						this.mostFoursInningsData = [];
					}
				}
			}
		}
		else
		{
			if (this.feedMostFours)
			{
				this.mostFoursData = [];
			}
			else if (this.feedMostFoursInnings)
			{
				this.mostFoursInningsData = [];
			}
		}

		PULSE.CLIENT.notify( 'stats/update', {
			tournamentName: that.tournamentName,
			statName: 'MostFours',
			url: 'mostFours',
			success: true
		} );
		PULSE.CLIENT.notify( 'mostFoursStats/update', {
			tournamentName: that.tournamentName,
			statName: 'MostFours',
			url: 'mostFours',
			success: true
		} );
	}
	else if ( id === this.feedMostSixes || id === this.feedMostSixesInnings
			&& data )
	{
		if( data.mostSixes )
		{
			for( var i = 0, iLimit = data.mostSixes.length; i < iLimit; i++ )
			{
				if( data.mostSixes[i].matchType === this.matchTypes[0] )
				{

					if (this.feedMostSixes)
					{
						this.mostSixesData = data.mostSixes[i].topPlayers;
					}
					else if (this.feedMostSixesInnings)
					{
						this.mostSixesInningsData = data.mostSixes[i].topPlayers;
					}

					this.mostSixesData = data.mostSixes[i].topPlayers;

					break;
				}
				else
				{
					if (this.feedMostSixes)
					{
						this.mostSixesData = [];
					}
					else if (this.feedMostSixesInnings)
					{
						this.mostSixesInningsData = [];
					}
				}
			}
		}
		else
		{
			if (this.feedMostSixes)
			{
				this.mostSixesData = [];
			}
			else if (this.feedMostSixesInnings)
			{
				this.mostSixesInningsData = [];
			}
		}

		PULSE.CLIENT.notify( 'stats/update', {
			tournamentName: that.tournamentName,
			statName: 'MostSixes',
			url: 'mostSixes',
			success: true
		} );
		PULSE.CLIENT.notify( 'mostSixesStats/update', {
			tournamentName: that.tournamentName,
			statName: 'MostSixes',
			url: 'mostSixes',
			success: true
		} );
	}
	else if ( id === this.feedMostFifties
			&& data )
	{
		if( data.mostFifties )
		{
			for( var i = 0, iLimit = data.mostFifties.length; i < iLimit; i++ )
			{
				if( data.mostFifties[i].matchType === this.matchTypes[0] )
				{
					this.mostFiftiesData = data.mostFifties[i].topPlayers;

					break;
				}
				else
				{
					this.mostFiftiesData = [];
				}
			}
		}
		else
		{
			this.mostFiftiesData = [];
		}

		PULSE.CLIENT.notify( 'stats/update', {
			tournamentName: that.tournamentName,
			statName: 'MostFifties',
			url: 'mostFifties',
			success: true
		} );
		PULSE.CLIENT.notify( 'mostFiftiesStats/update' );
	}
	else if ( id === this.feedMostCenturies
			&& data )
	{
		if( data.mostCenturies )
		{
			for( var i = 0, iLimit = data.mostCenturies.length; i < iLimit; i++ )
			{
				if( data.mostCenturies[i].matchType === this.matchTypes[0] )
				{
					this.mostCenturiesData = data.mostCenturies[i].topPlayers;

					break;
				}
				else
				{
					this.mostCenturiesData = [];
				}
			}
		}
		else
		{
			this.mostCenturiesData = [];
		}

		PULSE.CLIENT.notify( 'stats/update', {
			tournamentName: that.tournamentName,
			statName: 'MostCenturies',
			url: 'mostCenturies',
			success: true
		} );
		PULSE.CLIENT.notify( 'mostCenturiesStats/update' );
	}
	else if ( id === this.feedBestBattingStrikeRate || this.feedBestBattingStrikeInningsRate
			&& data )
	{
		if( data.bestStrikeRate )
		{
			for( var i = 0, iLimit = data.bestStrikeRate.length; i < iLimit; i++ )
			{
				if( data.bestStrikeRate[i].matchType === this.matchTypes[0] )
				{

					if (this.feedBestBattingStrikeRate)
					{
						this.bestBattingStrikeRateData = data.bestStrikeRate[i].topPlayers;
					}
					else  if (this.feedBestBattingStrikeInningsRate)
					{
						this.bestBattingStrikeRateInningsData = data.bestStrikeRate[i].topPlayers;
					}

					break;
				}
				else
				{
					if (this.feedBestBattingStrikeRate)
					{
						this.bestBattingStrikeRateData = [];
					}
					else  if (this.feedBestBattingStrikeInningsRate)
					{
						this.bestBattingStrikeRateInningsData = [];
					}
				}
			}
		}
		else
		{
			if (this.feedBestBattingStrikeRate)
			{
				this.bestBattingStrikeRateData = [];
			}
			else  if (this.feedBestBattingStrikeInningsRate)
			{
				this.bestBattingStrikeRateInningsData = [];
			}
		}

		PULSE.CLIENT.notify( 'stats/update', {
			tournamentName: that.tournamentName,
			statName: 'BestBattingStrikeRate',
			url: 'bestBattingStrikeRate',
			success: true
		} );
		PULSE.CLIENT.notify( 'bestBattingStrikeRate/update' );
	}
	else if ( id === this.feedBestEconomy || this.feedBestEconomyInnings
			&& data )
	{
		if( data.bestEconomy )
		{
			for( var i = 0, iLimit = data.bestEconomy.length; i < iLimit; i++ )
			{
				if( data.bestEconomy[i].matchType === this.matchTypes[0] )
				{

					if (this.feedBestEconomy)
					{
						this.bestEconomyData = data.bestEconomy[i].topPlayers;
					}
					else if (this.feedBestEconomyInnings)
					{
						this.bestEconomyInningsData = data.bestEconomy[i].topPlayers;
					}

					break;
				}
				else
				{
					if (this.feedBestEconomy)
					{
						this.bestEconomyData = [];
					}
					else if (this.feedBestEconomyInnings)
					{
						this.bestEconomyInningsData = [];
					}
				}
			}
		}
		else
		{
			if (this.feedBestEconomy)
			{
				this.bestEconomyData = [];
			}
			else if (this.feedBestEconomyInnings)
			{
				this.bestEconomyInningsData = [];
			}
		}

		PULSE.CLIENT.notify( 'stats/update', {
			tournamentName: that.tournamentName,
			statName: 'BestEconomy',
			url: 'bestEconomy',
			success: true
		} );
		PULSE.CLIENT.notify( 'bestEconomyStats/update' );
	}
	else if ( id === this.feedHighestScores
			&& data )
	{
		if( data.highestScores )
		{
			for( var i = 0, iLimit = data.highestScores.length; i < iLimit; i++ )
			{
				if( data.highestScores[i].matchType === this.matchTypes[0] )
				{
					this.highestScoresData = data.highestScores[i].topPlayers;
					break;
				}
				else
				{
					this.highestScoresData = [];
				}
			}
		}
		else
		{
			this.highestScoresData = [];
		}

		PULSE.CLIENT.notify( 'stats/update', {
			tournamentName: that.tournamentName,
			statName: 'HighestScores',
			url: 'highestScores',
			success: true
		} );
		PULSE.CLIENT.notify( 'highestScoreStats/update' );
	}
	else if ( id === this.feedBattingAverage
			&& data )
	{
		if( data.bestAverage )
		{
			for( var i = 0, iLimit = data.bestAverage.length; i < iLimit; i++ )
			{
				if( data.bestAverage[i].matchType === this.matchTypes[0] )
				{
					this.battingAverageData = data.bestAverage[i].topPlayers;

					break;
				}
				else
				{
					this.battingAverageData = [];
				}
			}
		}
		else
		{
			this.battingAverageData = [];
		}

		PULSE.CLIENT.notify( 'stats/update', {
			tournamentName: that.tournamentName,
			statName: 'BattingAverage',
			url: 'battingAverage',
			success: true
		 } );
		PULSE.CLIENT.notify( 'battingAverageStats/update' );
	}
	else if ( id === this.feedBowlingAverage
			&& data )
	{
		if( data.bestAverage )
		{
			for( var i = 0, iLimit = data.bestAverage.length; i < iLimit; i++ )
			{
				if( data.bestAverage[i].matchType === this.matchTypes[0] )
				{
					this.bowlingAverageData = data.bestAverage[i].topPlayers;

					break;
				}
				else
				{
					this.bowlingAverageData = [];
				}
			}
		}
		else
		{
			this.bowlingAverageData = [];
		}

		PULSE.CLIENT.notify( 'stats/update', {
			tournamentName: that.tournamentName,
			statName: 'BowlingAverage',
			url: 'bowlingAverage',
			success: true
		 } );
		PULSE.CLIENT.notify( 'bowlingAverageStats/update' );
	}
	else if ( id === this.feedBestBowling
			&& data )
	{
		if( data.bestBowling )
		{
			for( var i = 0, iLimit = data.bestBowling.length; i < iLimit; i++ )
			{
				if( data.bestBowling[i].matchType === this.matchTypes[0] )
				{
					this.bestBowlingInningsData = data.bestBowling[i].topPlayers;

					break;
				}
				else
				{
					this.bestBowlingInningsData = [];
				}
			}
		}
		else
		{
			this.bestBowlingInningsData = [];
		}

		PULSE.CLIENT.notify( 'stats/update', {
			tournamentName: that.tournamentName,
			statName: 'BestBowling',
			url: 'bestBowling',
			success: true
		 } );
		PULSE.CLIENT.notify( 'bestBowlingStats/update' );
	}
	else if ( id === this.feedFastestBall
			&& data )
	{
		if( data.fastestBall )
		{
			for( var i = 0, iLimit = data.fastestBall.length; i < iLimit; i++ )
			{
				if( data.fastestBall[i].matchType === this.matchTypes[0] )
				{
					this.fastestBallData = data.fastestBall[i].topPlayers;

					break;
				}
				else
				{
					this.fastestBallData = [];
				}
			}
		}
		else
		{
			this.fastestBallData = [];
		}

		PULSE.CLIENT.notify( 'stats/update', {
			tournamentName: that.tournamentName,
			statName: 'FastestBall',
			url: 'fastestBall',
			success: true
		 } );
		PULSE.CLIENT.notify( 'FastestBallStats/update' );
	}
	else if ( id === this.feedMostRunsConceded
			&& data )
	{
		if( data.mostRuns )
		{
			for( var i = 0, iLimit = data.mostRuns.length; i < iLimit; i++ )
			{
				if( data.mostRuns[i].matchType === this.matchTypes[0] )
				{
					this.mostRunsConcededInningsData = data.mostRuns[i].topPlayers;

					break;
				}
				else
				{
					this.mostRunsConcededInningsData = [];
				}
			}
		}
		else
		{
			this.mostRunsConcededInningsData = [];
		}

		PULSE.CLIENT.notify( 'stats/update', {
			tournamentName: that.tournamentName,
			statName: 'MostRunsConceded',
			url: 'mostRunsConceded',
			success: true
		 } );
		PULSE.CLIENT.notify( 'MostRunsConcededInnings/update' );
	}
	else if ( id === this.feedMostDotBalls || this.feedMostDotBallsInnings
			&& data )
	{
		if( data.mostDotBalls )
		{
			for( var i = 0, iLimit = data.mostDotBalls.length; i < iLimit; i++ )
			{
				if( data.mostDotBalls[i].matchType === this.matchTypes[0] )
				{

					if (this.feedMostDotBalls)
					{
						this.mostDotBallsData = data.mostDotBalls[i].topPlayers;

					} else if (this.feedMostDotBallsInnings) {

						this.mostDotBallsInningsData = data.mostDotBalls[i].topPlayers;
					}

					break;
				}
				else
				{
					if (this.feedMostDotBalls)
					{
						this.mostDotBallsData = [];

					} else if (this.feedMostDotBallsInnings) {

						this.mostDotBallsInningsData = [];
					}
				}
			}
		}
		else
		{
			if (this.feedMostDotBalls)
			{
				this.mostDotBallsData = [];

			} else if (this.feedMostDotBallsInnings) {

				this.mostDotBallsInningsData = [];
			}
		}

		PULSE.CLIENT.notify( 'stats/update', {
			tournamentName: that.tournamentName,
			statName: 'MostDotBalls',
			url: 'mostDotBalls',
			success: true
		 } );
		PULSE.CLIENT.notify( 'MostDotBalls/update' );
	}
	else if ( id === this.feedMostMaidens
			&& data )
	{
		if( data.mostMaidens )
		{
			for( var i = 0, iLimit = data.mostMaidens.length; i < iLimit; i++ )
			{
				if( data.mostMaidens[i].matchType === this.matchTypes[0] )
				{
					this.mostMaidensData = data.mostMaidens[i].topPlayers;

					break;
				}
				else
				{
					this.mostMaidensData = [];
				}
			}
		}
		else
		{
			this.mostMaidensData = [];
		}

		PULSE.CLIENT.notify( 'stats/update', {
			tournamentName: that.tournamentName,
			statName: 'MostMaidens',
			url: 'mostMaidens',
			success: true
		 } );
		PULSE.CLIENT.notify( 'MostMaidens/update' );
	}
	else if ( id === this.feedBestStrikeRate || this.feedBestStrikeRateInnings
			&& data )
	{
		if( data.bestStrikeRate )
		{
			for( var i = 0, iLimit = data.bestStrikeRate.length; i < iLimit; i++ )
			{
				if( data.bestStrikeRate[i].matchType === this.matchTypes[0] )
				{
					if (this.feedBestStrikeRate) {

						this.bestStrikeRateData = data.bestStrikeRate[i].topPlayers;
					}
					else if (this.feedBestStrikeRateInnings) {

						this.bestStrikeRateInningsData = data.bestStrikeRate[i].topPlayers;
					}

					break;
				}
				else
				{
					if (this.feedBestStrikeRate) {

						this.bestStrikeRateData = [];
					}
					else if (this.feedBestStrikeRateInnings) {

						this.bestStrikeRateInningsData = [];
					}
				}
			}
		}
		else
		{
			if (this.feedBestStrikeRate) {

				this.bestStrikeRateData = [];
			}
			else if (this.feedBestStrikeRateInnings) {

				this.bestStrikeRateInningsData = [];
			}
		}

		PULSE.CLIENT.notify( 'stats/update', {
			tournamentName: that.tournamentName,
			statName: 'BestStrikeRate',
			url: 'bestStrikeRate',
			success: true
		 } );
		PULSE.CLIENT.notify( 'BestStrikeRate/update' );
	}
	else if( id === this.feedInNumbers
			&& data )
	{
		if( data.tournamentInNumbers )
		{
			this.tournamentInNumbersData = data.tournamentInNumbers[0];

		}
		PULSE.CLIENT.notify( 'inNumbers/update', { success:true } );
	}
	else if( id === this.feedDidYouKnow
			&& data
			&& data.length )
	{
		this.DYK = data;
		PULSE.CLIENT.notify( 'didYouKnow/update', { success: true, tournamentName: this.tournamentName } );
	}
	else if ( id === this.feedFairPlay
			&& data
			&& data.awardWinners )
	{
		this.fairPlayData = data.awardWinners;
		PULSE.CLIENT.notify( 'fairPlayStats/update', {
			success: true,
			tournamentName: this.tournamentName
		} );
	}
	else if( id.startsWith('tallyFor') && data && data.total )
	{
		var feedName = id.substring(8);
		this[ feedName + 'TweetCount' ] = data.total;
		PULSE.CLIENT.notify( 'canary/tally', { feedName: feedName, total: data.total, success: true } );
	}
	else if( id === 'twitter' && data )
	{
		this.twitterData = data.reverse();
		PULSE.CLIENT.notify( 'twitter/update' );
	}
	else if( id.startsWith( 'twitter_' ) && data )
	{
		var teamId = id.split('_')[1];
		this.twitterTeamData[ teamId ] = data.reverse();
		PULSE.CLIENT.notify( 'twitterTeam/update', { teamId: teamId, success: true } );
	}
	else if (id === this.feedTwitterMirror && data)
	{
		this.twitterMirrorData = data;
		PULSE.CLIENT.notify('twitterMirror/update', { success: true });
	}
	else if( id === 'hottest-topics' && data )
	{
		this.hottestTopicsData = data.entries;
		PULSE.CLIENT.notify( 'hottestTopics/update', { success: true } );
	}
	else if( id === 'customTweetMessage' && data && data.text )
	{
		this.customTweetMessage = data.text;
		PULSE.CLIENT.notify( 'customTweetMessage/update', { success: true, text: data.text } );
	}
	else if (id === 'pulsePoll' && data && data[0].results)
	{
		this.pulsePollData = data[0].results;
		PULSE.CLIENT.notify('pulsePoll/update',
		{
			success: true
		});
	}
	else if( id === 'tweetBattle' )
	{
		var feedId = data[0].scope;
		this.twitterHistData[ feedId ] = data[0];
		PULSE.CLIENT.notify('tweetBattle/update',
		{
			success: true
		});
	}
};
if (!PULSE) 							{ var PULSE = {}; }
if (!PULSE.CLIENT) 						{ PULSE.CLIENT = {}; }
if (!PULSE.CLIENT.CRICKET) 				{ PULSE.CLIENT.CRICKET = {}; }
if (!PULSE.CLIENT.CRICKET.Tournament) 	{ PULSE.CLIENT.CRICKET.Tournament = {}; }

/**
 *	Tournament onError
 * 	onError gets called by the data manager when the file that's requested doesn't exist
 */

PULSE.CLIENT.CRICKET.Tournament.prototype.onError = function( id )
{
	var that = this;

	if( id === this.feedSchedule )
	{
		PULSE.CLIENT.notify( 'schedule/update', {
			tournamentName: that.tournamentName,
			success: false
		} );
	}
	else if ( id === this.feedSquads )
	{
		PULSE.CLIENT.notify( 'squads/update', {
			tournamentName: that.tournamentName,
			success: false
		} );
	}
	else if( id === this.feedStandings )
	{
		PULSE.CLIENT.notify( 'standings/update', {
			tournamentName: that.tournamentName,
			success: false
		} );
	}
	else if( id === this.feedPlayersMap )
	{
		PULSE.CLIENT.notify( 'playersMap/update', {
			tournamentName: that.tournamentName,
			success: false
		} );
	}
	else if( id.startsWith( 'teamStats-' ) )
	{
		var teamId = id.split('-')[1];
		PULSE.CLIENT.notify( 'teamStats/update', {
			tournamentName: that.tournamentName,
			success: false,
			teamId: teamId
		} );
	}
	else if( id.startsWith( 'teamCareerStats-' ) )
	{
		var teamId = id.split('-')[1];
		PULSE.CLIENT.notify( 'teamCareerStats/update', {
			tournamentName: that.tournamentName,
			success: false,
			teamId: teamId
		} );
	}
	else if ( id.startsWith( 'playerCareerStats-' ) )
	{
		var playerId = id.split('-')[1];
		PULSE.CLIENT.notify( 'playerCareerStats/update', {
			playerId: playerId,
			success: false
		} );
	}
	else if ( id === this.feedMostRuns )
	{
		PULSE.CLIENT.notify( 'stats/update', {
			tournamentName: that.tournamentName,
			statName: 'MostRuns',
			url: 'mostRuns',
			success: false
		} );
		PULSE.CLIENT.notify( 'mostRunsStats/update', {
			tournamentName: that.tournamentName,
			success: false
		} );
	}
	else if ( id === this.feedMostWickets )
	{
		PULSE.CLIENT.notify( 'stats/update', {
			tournamentName: that.tournamentName,
			statName: 'MostWickets',
			url: 'mostWickets',
			success: false
		} );
		PULSE.CLIENT.notify( 'mostWicketsStats/update', {
			tournamentName: that.tournamentName,
			success: false
		} );
	}
	else if ( id === this.feedMostFours || this.feedMostFoursInnings)
	{
		PULSE.CLIENT.notify( 'stats/update', {
			tournamentName: that.tournamentName,
			statName: 'MostFours',
			url: 'mostFours',
			success: false
		} );
		PULSE.CLIENT.notify( 'mostFoursStats/update', {
			tournamentName: that.tournamentName,
			success: false
		} );

	}
	else if ( id === this.feedMostSixes || this.feedMostSixesInnings )
	{
		PULSE.CLIENT.notify( 'stats/update', {
			tournamentName: that.tournamentName,
			statName: 'MostSixes',
			url: 'mostSixes',
			success: false
		} );
		PULSE.CLIENT.notify( 'mostSixesStats/update', {
			tournamentName: that.tournamentName,
			statName: 'MostSixes',
			url: 'mostSixes',
			success: false
		} );
	}
	else if ( id === this.feedMostFifties )
	{
		PULSE.CLIENT.notify( 'stats/update', {
			tournamentName: that.tournamentName,
			statName: 'MostFifties',
			url: 'mostFifties',
			success: false
		} );
		PULSE.CLIENT.notify( 'mostFiftiesStats/update', {
			tournamentName: that.tournamentName,
			success: false
		} );
	}
	else if ( id === this.feedMostCenturies )
	{
		PULSE.CLIENT.notify( 'stats/update', {
			tournamentName: that.tournamentName,
			statName: 'MostCenturies',
			url: 'mostCenturies',
			success: false
		} );
		PULSE.CLIENT.notify( 'mostCenturiesStats/update', {
			tournamentName: that.tournamentName,
			success: false
		} );
	}
	else if ( id === this.feedBestBattingStrikeRateUrl || this.feedBestBattingStrikeRateInningsUrl || id === this.feedBestBattingStrikeRate || this.feedBestBattingStrikeInningsRate )
	{
		PULSE.CLIENT.notify( 'stats/update', {
			tournamentName: that.tournamentName,
			statName: 'BestBattingStrikeRate',
			url: 'bestBattingStrikeRate',
			success: false
		} );
		PULSE.CLIENT.notify( 'bestBattingStrikeRate/update', {
			tournamentName: that.tournamentName,
			success: false
		} );
	}
	else if ( id === this.feedBestEconomy || this.feedBestEconomyInnings)
	{
		PULSE.CLIENT.notify( 'stats/update', {
			tournamentName: that.tournamentName,
			statName: 'BestEconomy',
			url: 'bestEconomy',
			success: false
		} );
		PULSE.CLIENT.notify( 'bestEconomyStats/update', {
			tournamentName: that.tournamentName,
			success: false
		} );
	}
	else if ( id === this.feedHighestScores )
	{
		PULSE.CLIENT.notify( 'stats/update', {
			tournamentName: that.tournamentName,
			statName: 'HighestScores',
			url: 'highestScores',
			success: false
		} );
		PULSE.CLIENT.notify( 'highestScoreStats/update', {
			tournamentName: that.tournamentName,
			success: false
		} );
	}
	else if ( id === this.feedBattingAverage )
	{
		PULSE.CLIENT.notify( 'stats/update', {
			tournamentName: that.tournamentName,
			statName: 'BattingAverage',
			url: 'battingAverage',
			success: false
		} );
		PULSE.CLIENT.notify( 'battingAverageStats/update', {
			tournamentName: that.tournamentName,
			success: false
		} );
	}
	else if ( id === this.feedBowlingAverage )
	{
		PULSE.CLIENT.notify( 'stats/update', {
			tournamentName: that.tournamentName,
			statName: 'BowlingAverage',
			url: 'bowlingAverage',
			success: false
		 } );
		PULSE.CLIENT.notify( 'bowlingAverageStats/update', {
			tournamentName: that.tournamentName,
			success: false
		} );
	}
	else if ( id === this.feedBestBowling )
	{
		PULSE.CLIENT.notify( 'stats/update', {
			tournamentName: that.tournamentName,
			statName: 'BestBowling',
			url: 'bestBowling',
			success: false
		 } );
		PULSE.CLIENT.notify( 'BestBowlingStats/update', {
			tournamentName: that.tournamentName,
			success: false
		} );
	}

	else if ( id === this.feedFastestBall )
	{
		PULSE.CLIENT.notify( 'stats/update', {
			tournamentName: that.tournamentName,
			statName: 'FastestBall',
			url: 'fastestBall',
			success: false
		 } );
		PULSE.CLIENT.notify( 'FastestBallStats/update', {
			tournamentName: that.tournamentName,
			success: false
		} );
	}
	else if ( id === this.feedMostDotBalls || this.feedMostDotBallsInnings)
	{
		PULSE.CLIENT.notify( 'stats/update', {
			tournamentName: that.tournamentName,
			statName: 'MostDotBalls',
			url: 'mostDotBalls',
			success: false
		 } );
		PULSE.CLIENT.notify( 'MostDotBalls/update', {
			tournamentName: that.tournamentName,
			success: false
		} );
	}
	else if ( id === this.feedMostMaidens )
	{
		PULSE.CLIENT.notify( 'stats/update', {
			tournamentName: that.tournamentName,
			statName: 'MostMaidens',
			url: 'mostMaidens',
			success: false
		 } );
		PULSE.CLIENT.notify( 'MostMaidens/update', {
			tournamentName: that.tournamentName,
			success: false
		} );
	}
	else if ( id === this.feedBestStrikeRate  || this.feedBestStrikeRateInnings)
	{
		PULSE.CLIENT.notify( 'stats/update', {
			tournamentName: that.tournamentName,
			statName: 'BestBowlingStrikeRate',
			url: 'bestBowlingStrikeRate',
			success: false
		 } );
		PULSE.CLIENT.notify( 'BestBowlingStrikeRate/update', {
			tournamentName: that.tournamentName,
			success: false
		} );
	}
	else if ( id === this.feedMostRunsConceded )
	{
		PULSE.CLIENT.notify( 'stats/update', {
			tournamentName: that.tournamentName,
			statName: 'MostRunsConceded',
			url: 'mostRunsConceded',
			success: false
		 } );
		PULSE.CLIENT.notify( 'MostRunsConceded/update', {
			tournamentName: that.tournamentName,
			success: false
		} );
	}
	else if ( id === this.feedMostFourWickets )
	{
		PULSE.CLIENT.notify( 'stats/update', {
			tournamentName: that.tournamentName,
			statName: 'MostFourWickets',
			url: 'mostFourWickets',
			success: false
		 } );
		PULSE.CLIENT.notify( 'MostFourWickets/update', {
			tournamentName: that.tournamentName,
			success: false
		} );
	}
	else if ( id === this.feedTwitterMirror)
	{
		PULSE.CLIENT.notify('twitterMirror/Update', {
			tournamentName: that.tournamentName,
			success: false
		});
	}
};
if (!PULSE) 							{ var PULSE = {}; }
if (!PULSE.CLIENT) 						{ PULSE.CLIENT = {}; }
if (!PULSE.CLIENT.CRICKET) 				{ PULSE.CLIENT.CRICKET = {}; }
if (!PULSE.CLIENT.CRICKET.Tournament) 	{ PULSE.CLIENT.CRICKET.Tournament = {}; }

/**
 * Set for multi group tournaments
 * Functions under the assumption that the returned array is in order of the group object
 * Returns and object containing groupName and an array of team standings
 *
 * See groupStandings.js in the Tipsy3 spec
 */

PULSE.CLIENT.CRICKET.Tournament.prototype.getStandingsModelByGroupName = function( groupName, limit )
{
	if( this.standingsData.length === 0 ) return { standings: [] };

	for( var i = 0, iLimit = this.standingsData.length; i < iLimit; i++ )
	{
		if( this.standingsData[i].groupName === groupName ||
            ( !this.standingsData[i].groupName && !groupName ) )
		{
			return this.getStandingsModel( i, limit );
		}
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getStandingsModel = function( groupIndex, limit )
{
	if( this.standingsData.length === 0 ) return { standings: [] };

    // if( !this.standingsData[ groupIndex ].standings ) this.standingsData[ groupIndex ].standings = [];

	var group = this.standingsData[ groupIndex ],
		model = this.getStandingsModelForGroup( group, limit );
	model.year = this.year;
	model.standingsMessage = this.standingsMessage || "";

	return model;
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getStandingsModelForGroup = function( group, limit )
{
	var model 			= {},
		standings 		= group.standings,
    	standingsArray 	= [],
		iLimit			= limit ? Math.min( limit, standings.length ) : standings.length;

	for( var i = 0; i < iLimit; i++ )
	{
		var recentForm = this.makeRecentFormModel( standings[i].recentForm, 5 );
		var standing = {
			position: standings[i].position,
			qualified: this.teamHasQualified( standings[i].team ),
            label: standings[i].positionLabel || standings[i].position,
			team: {
				id: standings[i].team.id,
				link: this.tournamentUrlGenerator.getTeamURL( standings[i].team.id, standings[i].team.fullName ),
				fullName: standings[i].team.fullName || "",
				shortName: standings[i].team.shortName || "",
				abbreviation: standings[i].team.abbreviation || "",
				type: standings[i].team.type || "m"
			},
			played: standings[i].played || 0,
			won: standings[i].won || 0,
			lost: standings[i].lost || 0,
			noResult: standings[i].noResult || 0,
			drawn: standings[i].tied || 0,
			points: standings[i].points || 0,
			netRunRate: standings[i].netRunRate || '+0.000',
			_for: PULSE.CLIENT.CRICKET.Utils.getStandingsForValue( standings[i] ),
			_against: PULSE.CLIENT.CRICKET.Utils.getStandingsAgainstValue( standings[i] ),
			recentForm: recentForm.form
		};

		standingsArray.push( standing );
	}

	model.groupName = group.groupName;
	model.standings = standingsArray;
    model.tournamentName = this.tournamentName;

	return model;
};

/**
 * Helper method to determine whether a team qualified to Playoffs
 */
PULSE.CLIENT.CRICKET.Tournament.prototype.teamHasQualified = function( team )
{
	teamIdToString = team.id + "";

	if( this.qualifiedTeams && $.inArray( teamIdToString, this.qualifiedTeams ) > -1 )
	{
		return true;
	}
	return false;
};

/**
 * Helper method to return an array of match outcomes
 *
 * See recentForm in Tipsy3 spec
 */
PULSE.CLIENT.CRICKET.Tournament.prototype.makeRecentFormModel = function( recentForm, limit )
{
	if( !recentForm ) return [];
	var array = recentForm;

	var iLimit = limit ? Math.min( limit, recentForm.length ) : recentForm.length;

	array.reverse();
	var outcomesArray = [];
	for( var i = 0; i < iLimit; i++ )
	{
		var recentResult = array[i];
		if( recentResult.outcome )
		{
			switch( recentResult.outcome )
			{
			case "W":
				outcomesArray.push( "win" );
				break;
			case "L":
				outcomesArray.push( "lose" );
				break;
			case "T":
			case "NR":
			case "D":
			default:
				outcomesArray.push( "draw" );
				break;
			}
		}
	}

	return { form: outcomesArray };
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getStandingsGroupModels = function( options )
{
    options = options || {};

    var model = { groups: [] };
    for( var i = 0, iLimit = this.standingsData.length; i < iLimit; i++ )
    {
        var group = this.standingsData[i];

        var groupName = group.groupName || '';
        var isKnockoutGroup =  -1 < groupName.toLowerCase().search('knockout') || -1 < groupName.toLowerCase().search('playoff');

        // ungrouped matches where there are groups already should be ignored since they're probably
        // playoffs or warmups or the like
        if( isKnockoutGroup || ( !groupName && this.standingsData.length > 2 ) )
        {
            continue;
        }
        for( var j = 0, jLimit = group.standings.length; j < jLimit; j++ )
        {
            var standing = group.standings[j];
            if( !_.isArray( options.teamIds ) || options.teamIds.length === 0 || -1 < PULSE.CLIENT.fuzzyInArray( standing.team.id, options.teamIds ) )
            {
                model.groups.push( this.getStandingsModelForGroup( group ) );
                break;
            }
        }
    }
    model.tournamentName = this.tournamentName;
    return model;
};

// Assumes no groups
PULSE.CLIENT.CRICKET.Tournament.prototype.getStandingsModelForTeam = function( teamId )
{
	var standingsModel = this.getStandingsModel();

	for( var i = 0, iLimit = standingsModel.standings.length; i < iLimit; i++ )
	{
		var standing = standingsModel.standings[i];
		if( standing.team.id === +teamId )
		{
			return standing;
		}
	}
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getTeamsFromStandings = function()
{
    var teams = [];
    if( this.standingsData.length )
    {
        for( var i = 0, iLimit = this.standingsData.length; i < iLimit; i++ )
        {
            var group = this.standingsData[i];
            for( var j = 0, jLimit = group.standings.length; j < jLimit; j++ )
            {
                var standing = group.standings[j];
                var match = $.grep( teams, function( team, i ) {
                    return team.id === standing.team.id;
                } );
                if( match.length === 0 )
                {
                    teams.push( standing.team );
                }
            }
        }
    }

    return teams;
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getStandingsForStages = function( standingsModel )
{
	var stages = [];
	if ( !standingsModel )
	{
		standingsModel = [];
		if ( this.standingsData )
		{
			for( var i = 0; i < this.standingsData.length; i++ )
		    {
		        if( this.standingsData[ i ].standings && this.standingsData[ i ].groupName && this.standingsData[ i ].groupName.toLowerCase().indexOf( 'knockouts' ) < 0 )
		        {
		            standingsModel.push( this.getStandingsModel( i ) );
		        }
		    }

		    standingsModel.sort( function(a, b)
		    {
		        var abbrA = a.groupName, abbrB = b.groupName;
		       if ( abbrA < abbrB ) //sort abbreviation ascending
		        {
		            return -1;
		        }
		        else
		        {
		            return 1;
		        }
		       return 0; //default return value (no sorting)
		    } );
		}
	}
	if ( this.stages && this.stages.length > 1 && standingsModel && standingsModel.length > 0 )
	{
		for ( var i = 0; i < this.stages.length; i++ )
		{
			if ( this.stages[ i ] && this.stages[ i ].groups && this.stages[ i ].groups.length > 0 )
			{
				var stageGroups = { name : this.stages[ i ].name, groups : [] };
				for ( var j = 0; j < this.stages[ i ].groups.length; j++ )
				{
					var stageName = this.stages[ i ].groups[ j ];
					for ( var q = 0; q < standingsModel.length; q++ )
					{
						var standName = standingsModel[ q ].groupName;
						if ( standName.indexOf( stageName ) > -1 )
						{
							stageGroups.groups.push( standingsModel[ q ] );
							standingsModel.splice( q, 1 );
							break;
						}
					}
				}
				stages.push( stageGroups );
			}
		}
	}
	else
	{
		stages.push( { groups : standingsModel, name : 'Group Stages' } );
	}
	return stages;
}
if (!PULSE) 							{ var PULSE = {}; }
if (!PULSE.CLIENT) 						{ PULSE.CLIENT = {}; }
if (!PULSE.CLIENT.CRICKET) 				{ PULSE.CLIENT.CRICKET = {}; }
if (!PULSE.CLIENT.CRICKET.Tournament) 	{ PULSE.CLIENT.CRICKET.Tournament = {}; }

/**
 *
 * STATS MODELS
 *
 */

PULSE.CLIENT.CRICKET.Tournament.prototype.getBattingModel = function( statsData, statsType, placeholder )
{
	var stats = statsData.battingStats || {};

	var model = {
		player : this.getPlayerModel( statsData.player, statsData.team ),
		team: this.getTeamModel( statsData.team ),
		stats: statsData.battingStats
	};

	if ( statsType )
	{
		if ( typeof stats[ statsType ] !== 'undefined' )
		{
			model.stat = stats[ statsType ]
		}
		else
		{
			if ( placeholder )
			{
				model.stat = placeholder;
			}
		}
	}

	return model;
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getBowlingModel = function( statsData, statsType, placeholder )
{
	var stats = statsData.bowlingStats || {};
	if( typeof stats.bbiw !== 'undefined' && typeof stats.bbir !== 'undefined' )
	{
		stats.bbi = stats.bbiw + '/' + stats.bbir;
	}
	var model = {
		player : this.getPlayerModel( statsData.player, statsData.team ),
		team: this.getTeamModel( statsData.team ),
		stats: stats
	};

	if ( statsType )
	{
		if ( typeof stats[ statsType ] !== 'undefined' )
		{
			model.stat = stats[ statsType ]
		}
		else
		{
			if ( placeholder )
			{
				model.stat = placeholder;
			}
		}
	}

	return model;
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getInningsScopedStatsModel = function( statsData, dateFormat )
{
	if( statsData.battingStats )
	{
		model = this.getBattingModel( statsData );
	}
	else if( statsData.bowlingStats )
	{
		model = this.getBowlingModel( statsData );
	}
	else
	{
		return { stats: {} };
	}

	model.stats.opposition = this.getTeamModel( statsData.opposition );
	model.stats.matchDate = PULSE.CLIENT.Util.getFormattedDate( statsData.matchDate, dateFormat );
	model.stats.venue = statsData.venue; // TODO: replace with getVenueModel to include venue URL

	return model;
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getMostRunsModel = function( index )
{
	var i = typeof index === "undefined" ? 0 : index,
		statsData = this.mostRunsData[i],
		model = this.getBattingModel( statsData );

	model.title = "Most Runs";
	model.label = 'runs';
	model.stat = statsData ? statsData.battingStats.r : "0";

	return model;
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getMostFoursInningsModel = function( index )
{
	return this.getMostFoursModel( index, true );
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getMostFoursModel = function( index, inningsScoped )
{
	var i = typeof index === "undefined" ? 0 : index,
		statsData = inningsScoped ? this.mostFoursInningsData[i] : this.mostFoursData[i],
		model = inningsScoped ? this.getInningsScopedStatsModel( statsData ) : this.getBattingModel( statsData );

	model.title = "Most Fours" + ( inningsScoped ? ' (Innings)' : '' );
	model.label = 'fours';
	model.stat = statsData ? statsData.battingStats['4s'] : "0";

	return model;
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getMostSixesInningsModel = function( index )
{
	return this.getMostSixesModel( index, true );
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getMostSixesModel = function( index, inningsScoped )
{
	var i = typeof index === "undefined" ? 0 : index,
		statsData = inningsScoped ? this.mostSixesInningsData[i] : this.mostSixesData[i],
		model = inningsScoped ? this.getInningsScopedStatsModel( statsData ) : this.getBattingModel( statsData );

	model.title = "Most Sixes" + ( inningsScoped ? ' (Innings)' : '' );
	model.label = 'sixes';
	model.stat = statsData ? statsData.battingStats['6s'] : "0";

	return model;
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getMostFiftiesModel = function( index )
{
	var i = typeof index === "undefined" ? 0 : index,
		statsData = this.mostFiftiesData[i],
		model = this.getBattingModel( statsData );

	model.title = "Most Fifties";
	model.label = 'fifties';
	model.stat = statsData ? statsData.battingStats['50s'] : "0";

	return model;
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getMostCenturiesModel = function( index )
{
	var i = typeof index === "undefined" ? 0 : index,
		statsData = this.mostCenturiesData[i],
		model = this.getBattingModel( statsData );

	model.title = "Most Centuries";
	model.label = 'centuries';
	model.stat = statsData ? statsData.battingStats['100s'] : "0";

	return model;
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getBestBattingStrikeRateInningsModel = function( index )
{
	return this.getBestBattingStrikeRateModel( index, true );
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getBestBattingStrikeRateModel = function( index, inningsScoped )
{
	var i = typeof index === "undefined" ? 0 : index,
		statsData = inningsScoped ? this.bestBattingStrikeRateInningsData[i] : this.bestBattingStrikeRateData[i],
		model = inningsScoped ? this.getInningsScopedStatsModel( statsData ) : this.getBattingModel( statsData );

	model.title = "Best Batting Strike Rate" + ( inningsScoped ? ' (Innings)' : '' );
	model.label = '';
	model.stat = statsData ? statsData.battingStats.sr : "-";

	return model;
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getBattingAverageModel = function( index )
{
	var i = typeof index === "undefined" ? 0 : index,
		statsData = this.battingAverageData[i],
		model = this.getBattingModel( statsData );

	model.title = "Best Batting Average";
	model.label = '';
	model.stat = statsData ? statsData.battingStats.a : "-";

	return model;
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getBestBattingAverageModel = function( index )
{
    var i = typeof index === "undefined" ? 0 : index,
        statsData = this.bestBattingAverageData[i],
        model = this.getBattingModel( statsData );

    model.title = "Best Batting Average";
    model.label = '';
    model.stat = statsData ? statsData.battingStats.a : "-";

    return model;
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getHighestScoresModel = function( index )
{
	var i = typeof index === "undefined" ? 0 : index,
		statsData = this.highestScoresData[i],
		model = this.getInningsScopedStatsModel( statsData );

	model.title = "Highest Individual Score";
	model.label = '';
	model.stat = statsData ? statsData.battingStats.hs : "0";

	return model;
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getHighestScoresInningsModel = function( index )
{
    var i = typeof index === "undefined" ? 0 : index,
        statsData = this.highestScoresInningsData[i],
        model = this.getInningsScopedStatsModel( statsData );

    model.title = "Highest Individual Score";
    model.label = '';
    model.stat = statsData ? statsData.battingStats.hs : "0";

    return model;
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getMostWicketsModel = function( index )
{
	var i = typeof index === "undefined" ? 0 : index,
		statsData = this.mostWicketsData[i],
		model = this.getBowlingModel( statsData );

	model.title = "Most Wickets";
	model.label = 'wickets';
	model.stat = statsData ? statsData.bowlingStats.w : "0";

	return model;
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getMostFourWicketsModel = function( index )
{
	var i = typeof index === "undefined" ? 0 : index,
		statsData = this.mostFourWicketsData[i],
		model = this.getBowlingModel( statsData );

	model.title = "Most Four Wickets";
	model.label = '';
	model.stat = statsData ? statsData.bowlingStats['4w'] : "0";

	return model;
};


PULSE.CLIENT.CRICKET.Tournament.prototype.getMostRunsConcededModel = function( index )
{
	var inningsScoped = true;
	var i = typeof index === "undefined" ? 0 : index,
		statsData = this.mostRunsConcededInningsData[i],
		model = this.getInningsScopedStatsModel( statsData );

	model.title = "Most Runs Conceded (Innings)";
	model.label = 'runs';
	model.stat = statsData ? statsData.bowlingStats.r : "0";

	return model;
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getBestEconomyInningsModel = function( index )
{
	return this.getBestEconomyModel( index, true );
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getBestEconomyModel = function( index, inningsScoped )
{
	var i = typeof index === "undefined" ? 0 : index,
		statsData = inningsScoped ? this.bestEconomyInningsData[i] : this.bestEconomyData[i],
		model = inningsScoped ? this.getInningsScopedStatsModel( statsData ) : this.getBowlingModel( statsData );

	model.title = "Best Economy" + ( inningsScoped ? ' (Innings)' : '' );
	model.label = '';
	model.stat = statsData ? statsData.bowlingStats.e : "-";

	return model;
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getBestBowlingEconomyModel = function( index )
{
    var i = typeof index === "undefined" ? 0 : index,
        statsData = this.bestBowlingEconomyData[i],
        model = this.getBowlingModel( statsData );

    model.title = "Best Economy";
    model.label = '';
    model.stat = statsData ? statsData.bowlingStats.e : "-";

    return model;
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getBowlingAverageModel = function( index )
{
	var i = typeof index === "undefined" ? 0 : index,
		statsData = this.bowlingAverageData[i],
		model = this.getBowlingModel( statsData );

	model.title = "Best Bowling Average";
	model.label = '';
	model.stat = statsData ? statsData.bowlingStats.a : "-";

	return model;
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getBestBowlingAverageModel = function( index )
{
    var i = typeof index === "undefined" ? 0 : index,
        statsData = this.bestBowlingAverageData[i],
        model = this.getBowlingModel( statsData );

    model.title = "Best Bowling Average";
    model.label = '';
    model.stat = statsData ? statsData.bowlingStats.a : "-";

    return model;
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getBestBowlingModel = function( index )
{
	var i = typeof index === "undefined" ? 0 : index,
		statsData = this.bestBowlingInningsData[i],
		model = this.getInningsScopedStatsModel( statsData );

	model.title = "Best Bowling Figures";
	model.label = '';
	model.stat = statsData ? statsData.bowlingStats.bbi : "-";

	return model;
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getBestBowlingInningsModel = function( index )
{
    var i = typeof index === "undefined" ? 0 : index,
        statsData = this.bestBowlingInningsData[i],
        model = this.getInningsScopedStatsModel( statsData );

    model.title = "Best Bowling Figures";
    model.label = '';
    model.stat = statsData ? statsData.bowlingStats.bbi : "-";

    return model;
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getMostDotBallsInningsModel = function( index )
{
	return this.getMostDotBallsModel( index, true );
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getMostDotBallsModel = function( index, inningsScoped )
{
	var i = typeof index === "undefined" ? 0 : index,
		statsData = inningsScoped ? this.mostDotBallsInningsData[i] : this.mostDotBallsData[i],
		model = inningsScoped ? this.getInningsScopedStatsModel( statsData ) : this.getBowlingModel( statsData );

	model.title = "Most Dot Balls" + ( inningsScoped ? ' (Innings)' : '' );
	model.label = 'dots';
	model.stat = statsData ? statsData.bowlingStats.d : "0";

	return model;
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getMostMaidensModel = function( index )
{
	var i = typeof index === "undefined" ? 0 : index,
		statsData = this.mostMaidensData[i],
		model = this.getBowlingModel( statsData );

	model.title = "Most Maidens";
	model.label = 'maidens';
	model.stat = statsData ? statsData.bowlingStats.maid : "0";

	return model;
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getBestStrikeRateInningsModel = function( index )
{
	this.getBestStrikeRateModel( index, true );
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getBestStrikeRateModel = function( index, inningsScoped )
{
	var i = typeof index === "undefined" ? 0 : index,
		statsData = inningsScoped ? this.bestStrikeRateInningsData[i] : this.bestStrikeRateData[i],
		model;

    if ( inningsScoped )
    {
        model = this.getInningsScopedStatsModel( statsData );
    }
    else if ( statsData && statsData.bowlingStats )
    {
        model = this.getBowlingModel( statsData );
    }
    else
    {
        model = this.getBattingModel( statsData );
    }

	model.title = "Best Bowling Strike Rate" + ( inningsScoped ? ' (Innings)' : '' );
	model.label = '';
    if ( statsData )
    {
        if ( statsData.bowlingStats )
        {
            model.stat = statsData.bowlingStats.sr;
        }
        else if ( statsData.battingStats )
        {
            model.stat = statsData.battingStats.sr;
        }
	    else
        {
            model.stat = '-';
        }
    }
    else
    {
        model.stat = '-';
    }

	return model;
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getFastestBallModel = function( statsData )
{
	var model 		= {
			title: "Fastest Balls Delivered",
			player: this.getPlayerModel( statsData.player, statsData.team ),
			team: this.getTeamModel( statsData.team ),
			stats: {
				ballSpeed: statsData.ballSpeed
			},
			label: '',
			stat: statsData.ballSpeed
		};

	return model;
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getFastestBuildModel = function( statsData )
{
    var stats = statsData.fastestBuild,
        model = {
            player: this.getPlayerModel( statsData.player, statsData.team ),
            stats: statsData.fastestBuild,
            stat: statsData.fastestBuild.balls,
            team: this.getTeamModel( statsData.team )
        };

    return model;
};

/**
 * Returns an array of stats models
 * @params
 *	statsType - used for calling the model generation function (e.g., getMostRunsData())
 * 	statsDataName - used to identify the feed: e.g., mostRuns.js
 * 	innings - used to distinguish between innings-scoped feeds and non-innings scoped feeds (e.g., mostSixes.js vs. mostSixesInnings.js)
 * 	options - various filters; currently supported: limit (the length of the array) and teamId (filter results by team)
 */
PULSE.CLIENT.CRICKET.Tournament.prototype.getModelArrayFor = function( statsType, statsDataName, innings, options )
{
	if( !options )
	{
		options = {};
	}

	var inn = innings ? 'InningsData' : 'Data';

	var models = [],
		iLimit = iLimit = options.limit ? Math.min( this[ statsDataName + inn ].length, options.limit ) : this[ statsDataName + inn ].length;

	var i = 0;
	while( i < this[ statsDataName + inn ].length )
	{
		var stat = this[ statsDataName + inn ][i];
		if( !options.teamId || ( options.teamId && +options.teamId === stat.team.id ) )
		{
			var model = this[ "get" + statsType + "Model" ]( i, innings );
			models.push( model );
		}
		if( models.length === iLimit )
		{
			break;
		}
		i++;
	}

	return { statsArray: models };
};


/**
 * Returns an object with an array of stats models and other metadata information about the stat type requested
 * @param  {String} matchType - 'TEST', 'T20I' etc. (match type)
 * @param  {String} statsType - Stat type to match Tournament.getStatsLabelsForType function
 *      Batting Types:
 *          MostRuns, MostFours, MostSixes, MostFoursInnings, MostSixesInnings, BestBattingStrikeRate,
 *          BestBattingStrikeRateInnings, MostFifties, MostCenturies, HighestScores, BattingAverage
 *       Bowling Types:
 *           MostWickets, MostFourWickets, MostRunsConceded, BestEconomy, BestEconomyInnings,
 *           BestBowling, MostDotBalls, MostDotBallsInnings, BestStrikeRate, BestStrikeRateInnings,
 *           MostMaidens, BowlingAverage
 *       Other:
 *           FastestBall
 * @param  {Boolean} innings  - whether data is innings scoped or not
 * @param  {Object} options   - additional options such as team IDs (array) to sort by, array limit etc.
 * @return {Object}           - object containing the array of stats models, a user-friendly title, labels and other meta
 */
PULSE.CLIENT.CRICKET.Tournament.prototype.getModelArrayForMatchType = function( matchType, statsType, options )
{
    var model = { statsArray: [], matchType: matchType };

    if( !matchType || !statsType )
    {
        return model;
    }

    options = options || {};

    var meta = this.getStatsLabelsForType( statsType );
    var data = this.getDataForType( matchType, statsType );

    if( !meta || !data.length )
    {
        return model;
    }

    var statsArray = model.statsArray,
        iLimit = options.limit ? Math.min( data.length, options.limit ) : data.length;

    var i = 0;
    while( i < data.length )
    {
        var statRecord = data[i];
        if( !_.isArray( options.teamIds ) || options.teamIds.length === 0 || -1 < $.inArray( statRecord.team.id, options.teamIds ) )
        {
            var coreModel = this[ "get" + meta.type + "Model" ]( statRecord, meta.key, meta.placeholder );
            if( meta.inningsScoped )
            {
                coreModel.stats = _.extend( coreModel.stats, this.getInningsScopedStatsModel( statRecord ) );
            }

            statsArray.push( coreModel );
        }

        if( statsArray.length === iLimit )
        {
            break;
        }
        i++;
    }

    model = _.extend( model, meta );

    return model;
};


PULSE.CLIENT.CRICKET.Tournament.prototype.getDataForType = function( matchType, statsType )
{
    var statsDataName = statsType.charAt(0).toLowerCase() + statsType.slice(1, statsType.length);
    var meta = this.getStatsLabelsForType( statsType );
    var dataType = statsDataName + 'Data';

    if( !this[ dataType ] )
    {
        return [];
    }

    for( var i = 0, iLimit = this[ dataType ].length; i < iLimit; i++ )
    {
        var stats = this[ dataType ][ i ];
        if( stats.matchType === matchType )
        {
            return stats.topPlayers;
        }
    }

    return [];
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getTotalStatsModel = function()
{
	var model,
		data = this.tournamentInNumbersData;

	if( data )
	{
		model = {
			dotBalls:  PULSE.CLIENT.Util.addCommaForThousands( data.dotBalls ),
			fastestBallMph: data.fastestBallMph,
			fastestBallKmh: data.fastestBallKmh,
			fastestBall: data.fastestBall,
			fifties: PULSE.CLIENT.Util.addCommaForThousands( data.fifties ),
			runs: PULSE.CLIENT.Util.addCommaForThousands( data.runs ),
			runsFromBoundaries: PULSE.CLIENT.Util.addCommaForThousands( data.runsFromBoundaries ),
			sixDistance: parseInt( data.sixDistance, undefined ),
			sixes: PULSE.CLIENT.Util.addCommaForThousands( data.sixes ),
			wickets: PULSE.CLIENT.Util.addCommaForThousands( data.wickets )
		};
	}
	else
	{
		model = {
			dotBalls: 0,
			fastestBallMph: "-",
			fastestBallKmh: "-",
			fastestBall: "-",
			fifties: 0,
			runs: 0,
			runsFromBoundaries: 0,
			sixDistance: 0,
			sixes: 0,
			wickets: 0
		};
	}

	return model;
};

/**
 * Returns standardised labeling and default values for a given stats type
 * @param  {String} statsType Name of the given stats type
 * @return {Object}           Object containing defaults for the matched stat type
 */
PULSE.CLIENT.CRICKET.Tournament.prototype.getStatsLabelsForType = function( statsType )
{
    switch( statsType )
    {
    // BATTING
    case "MostRuns":
        return {
            title: 'Most Runs',
            label: 'runs',
            key: 'r',
            type: 'Batting',
            placeholder: '0',
            inningsScoped: false
        };
    case "MostFours":
        return {
            title: 'Most Fours',
            label: 'fours',
            key: '4s',
            type: 'Batting',
            placeholder: '0',
            inningsScoped: false
        };
    case "MostSixes":
        return {
            title: 'Most Sixes',
            label: 'sixes',
            key: '6s',
            type: 'Batting',
            placeholder: '0',
            inningsScoped: false
        };
    case "MostFoursInnings":
        return {
            title: 'Most Fours (Innings)',
            label: 'fours',
            key: '4s',
            type: 'Batting',
            placeholder: '0',
            inningsScoped: true
        };
    case "MostSixesInnings":
        return {
            title: 'Most Sixes (Innings)',
            label: 'sixes',
            key: '6s',
            type: 'Batting',
            placeholder: '0',
            inningsScoped: true
        };
    case "BestBattingStrikeRate":
        return {
            title: 'Best Batting Strike Rate',
            label: '',
            key: 'sr',
            type: 'Batting',
            placeholder: '-',
            inningsScoped: false
        };
    case "BestBattingStrikeRateInnings":
        return {
            title: 'Best Batting Strike Rate (Innings)',
            label: '',
            key: 'sr',
            type: 'Batting',
            placeholder: '-',
            inningsScoped: true
        };
    case "MostFifties":
        return {
            title: 'Most Fifties',
            label: 'fifties',
            key: '50s',
            type: 'Batting',
            placeholder: '0',
            inningsScoped: false
        };
    case "MostCenturies":
        return {
            title: 'Most Centuries',
            label: 'centuries',
            key: '100s',
            type: 'Batting',
            placeholder: '0',
            inningsScoped: false
        };
    case "HighestScores":
        return {
            title: 'Highest Individual Score',
            label: '',
            key: 'hs',
            type: 'Batting',
            placeholder: '-',
            inningsScoped: true
        };
    case "BattingAverage":
        return {
            title: 'Best Batting Average',
            label: '',
            key: 'a',
            type: 'Batting',
            placeholder: '-',
            inningsScoped: false
        };
    case 'FastestFiftiesInnings':
        return {
            title: 'Fastest Fifties',
            label: '',
            key: 'a',
            type: 'FastestBuild',
            placeholder: '-',
            inningsScoped: true
        };
    case 'FastestCenturiesInnings':
        return {
            title: 'Fastest Centuries',
            label: '',
            key: 'a',
            type: 'FastestBuild',
            placeholder: '-',
            inningsScoped: true
        };


    // BOWLING
    case 'MostWickets':
        return {
            title: 'Most Wickets',
            label: 'wickets',
            key: 'w',
            type: 'Bowling',
            placeholder: '0',
            inningsScoped: false
        };
    case 'MostFourWickets':
        return {
            title: 'Most Four Wickets',
            label: '',
            key: '4w',
            type: 'Bowling',
            placeholder: '0',
            inningsScoped: false
        };
    case 'MostRunsConceded':
        return {
            title: 'Most Runs Conceded',
            label: 'runs',
            key: 'r',
            type: 'Bowling',
            placeholder: '0',
            inningsScoped: false
        };
    case 'BestEconomy':
        return {
            title: 'Best Economy',
            label: '',
            key: 'e',
            type: 'Bowling',
            placeholder: '-',
            inningsScoped: false
        };
    case 'BestEconomyInnings':
        return {
            title: 'Best Economy (Innings)',
            label: '',
            key: 'e',
            type: 'Bowling',
            placeholder: '-',
            inningsScoped: true
        };
    case 'BestBowlingInnings':
        return {
            title: 'Best Bowling Figures',
            label: '',
            key: 'bbi',
            type: 'Bowling',
            placeholder: '-',
            inningsScoped: true
        };
    case 'MostDotBalls':
        return {
            title: 'Most Dot Balls',
            label: 'dots',
            key: 'd',
            type: 'Bowling',
            placeholder: '0',
            inningsScoped: false
        };
    case 'MostDotBallsInnings':
        return {
            title: 'Most Dot Balls (Innings)',
            label: '',
            key: 'd',
            type: 'Bowling',
            placeholder: '0',
            inningsScoped: true
        };
    case 'BestStrikeRate':
        return {
            title: 'Best Bowling Strike Rate',
            label: '',
            key: 'sr',
            type: 'Bowling',
            placeholder: '-',
            inningsScoped: false
        };
    case 'BestStrikeRateInnings':
        return {
            title: 'Best Bowling Strike Rate (Innings)',
            label: '',
            key: 'sr',
            type: 'Bowling',
            placeholder: '-',
            inningsScoped: true
        };
    case 'MostMaidens':
        return {
            title: 'Most Maidens',
            label: 'maidens',
            key: 'maid',
            type: 'Bowling',
            placeholder: '0',
            inningsScoped: false
        };
    case 'BowlingAverage':
        return {
            title: 'Best Bowling Average',
            label: '',
            key: 'a',
            type: 'Bowling',
            placeholder: '-',
            inningsScoped: false
        };

    // SPECIAL CASES
    case 'FastestBall':
        return {
            title: 'Fastest Ball',
            label: '',
            key: 'ballSpeed',
            type: 'FastestBall',
            placeholder: '',
            inningsScoped: false
        };
    default:
        return {};

    }
};
if( !PULSE) 							{ var PULSE = {}; }
if( !PULSE.CLIENT) 						{ PULSE.CLIENT = {}; }
if( !PULSE.CLIENT.CRICKET) 				{ PULSE.CLIENT.CRICKET = {}; }
if( !PULSE.CLIENT.CRICKET.Tournament) 	{ PULSE.CLIENT.CRICKET.Tournament = {}; }

/**
 * Given a DMS team object, it returns the same object, more or less, but
 * with a team URL if the tournament supports it
 * @param  {DMS.Team} team  the DMS object for a team
 * @return {Object}         the team model
 */
PULSE.CLIENT.CRICKET.Tournament.prototype.getTeamModel = function( team )
{
	if( team )
	{
		return $.extend( {
			url: this.tournamentUrlGenerator.getTeamURL( team.id, team.fullName )
		}, team );
	}
};

/**
 * Returns an array of squad objects, including squad URL
 * See squads.js Tipsy3 specification
 */
PULSE.CLIENT.CRICKET.Tournament.prototype.getTeamListModel = function()
{
	if( !this.squadsData ) return { teams: [] };

	var that = this,
		squads = this.squadsData,
		teamsArray = $.map( squads, function( squad ) {
			// TODO: refactor to use 'url' instead of 'teamUrl'
			squad.teamUrl = that.tournamentUrlGenerator.getTeamURL( squad.team.id, squad.team.fullName );
			return squad.team;
		} );

	return { teams: teamsArray };
};

/**
 * Returns an array of player objects, captain separately, including player URLs
 * See squads.js Tipsy3 specification
 */
PULSE.CLIENT.CRICKET.Tournament.prototype.getSquadWithCaptainModel = function( teamId )
{
    var model = { team: {}, players: [] };

    if( !teamId || teamId == -1 )
    {
        return model;
    }

	var squad = this.getTeamById( teamId );
	if( !squad )
	{
		return model;
	}

	var teamName = squad.team.fullName;

	// Create squad list model
	model = {};
	model.captain = undefined;
	model.players = [];
	model.team = squad.team;
	model.team.url = this.tournamentUrlGenerator.getTeamURL( squad.team.id, squad.team.fullName );

    if( squad.players === undefined ) return model;

	for( var i = 0; i < squad.players.length; i++ )
	{
		var player = squad.players[ i ];
		var url = this.tournamentUrlGenerator.getPlayerURL( player.id, player.fullName, teamId, teamName );
		var stats = {};

		if( this.teamTournamentStatsData[ model.team.id ] )
		{
			var statsArray = this.teamTournamentStatsData[ model.team.id ].playersStats;
			for( var j = 0, jLimit = statsArray.length; j < jLimit; j++ )
			{
				if( statsArray[j].stats )
				{
					for( var x = 0, xLimit = statsArray[j].stats.length; x < xLimit; x++ )
					{
						if( ( !this.matchTypes || !this.matchTypes.length || statsArray[j].stats[x].matchType === this.matchTypes[ 0 ] ) &&
                            statsArray[j].player.id === player.id )
						{
							stats = statsArray[j].stats[x];
						}
					}
				}
			}
		}

		if( player.id === squad.captainId )
		{
			// Fill in captain model
			var captainName = PULSE.CLIENT.Util.getPlayerNames( player.fullName );
			model.captain = {
				id: player.id,
				fullName: player.fullName,
				firstName: captainName.firstName,
				lastName: captainName.secondName,
				nationality : player.nationality,
				url: url,
				wicketKeeper: squad.wicketKeeperId === player.id,
				captain: squad.captainId === player.id,
				stats: stats
			};

		}
		else
		{
			var playerName = PULSE.CLIENT.Util.getPlayerNames( player.fullName );
			var playerModel = {
					id: player.id,
					url: url,
					fullName: player.fullName,
					firstName: playerName.firstName,
					lastName: playerName.secondName,
					nationality : player.nationality,
					wicketKeeper: squad.wicketKeeperId === player.id,
					captain: squad.captainId === player.id,
					stats: stats
			};
			model.players.push( playerModel );
		}
	}

	if( !squad.captainId )
	{
		model.captain = undefined;
	}

	return model;
};

// Given a team abbreviation it will return the team's hashtag or the abbreviation

PULSE.CLIENT.CRICKET.Tournament.prototype.getHashTag = function( abbr )
{
	if( this.hashTags && this.hashTags[abbr] )
	{
		return this.hashTags[abbr];
	}

	return abbr;

};
/**
 * Returns a player model with a team URL, firstName and lastName as well as imgRoot
 * @param  {DMS.Player} player    the player object as it is pulled in from the DMS JSON feeds
 * @param  {DMS.Team}   team      the team object, as it is pulled in from the DMS JSON feeds
 * @param  {Boolean}    withTeam  whether to include the team object model in the player model or not
 * @return {Object}               returns the player model
 */
PULSE.CLIENT.CRICKET.Tournament.prototype.getPlayerModel = function( player, team, withTeam )
{
	if( team )
	{
		var url = this.tournamentUrlGenerator.getPlayerURL( player.id, player.fullName, team.id, team.fullName );
	}


	this.playerNames = PULSE.CLIENT.Util.getPlayerNames( player.fullName );
	var model = $.extend(
		true,
		{
			url: url,
			imgRoot: this.playerImageUrl,
			firstName: this.playerNames.firstName,
			lastName: this.playerNames.secondName,
			age: this.getPlayerAge( player.dateOfBirth )
        },
		player
	);

	if( team && withTeam )
	{
		model.team = this.getTeamModel( team );
	}

	return model;
};
if (!PULSE) 							{ var PULSE = {}; }
if (!PULSE.CLIENT) 						{ PULSE.CLIENT = {}; }
if (!PULSE.CLIENT.CRICKET) 				{ PULSE.CLIENT.CRICKET = {}; }
if (!PULSE.CLIENT.CRICKET.Tournament) 	{ PULSE.CLIENT.CRICKET.Tournament = {}; }

/**
 *
 * TWITTER AND CANARY MODELS
 *
 */

PULSE.CLIENT.CRICKET.Tournament.prototype.getTweetCount = function( prefix )
{
	var tweetCount = this[ prefix + 'TweetCount' ];
	if( tweetCount )
	{
		return PULSE.CLIENT.Util.addCommaForThousands( tweetCount );
	}
	return "";
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getTwitterTopicsCount = function( limit )
{
	if( !limit || this.hottestTopicsData.length < limit )
	{
		limit = this.hottestTopicsData.length;
	}

	var topics 		= [],
		max 		= this.hottestTopicsData[0].count,
		min 		= this.hottestTopicsData[ limit - 1 ].count,
		diff 		= max - min,
		baseValue 	= 1,
		onePerCent 	= diff / ( 100 - baseValue );

	for( var i = 0; i < limit; i++ )
	{
		var topic = this.hottestTopicsData[i],
			model = {
				rank: topic.rank,
				label: topic.label,
				link: PULSE.CLIENT.TwitterController.getSearchTagUrl( topic.label ),
				count: PULSE.CLIENT.Util.addCommaForThousands( topic.count ),
				percent: baseValue + Math.floor( ( topic.count - min ) / onePerCent )
			};

		topics.push( model );
	}

	return { topics: topics };
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getTweetsArrayModel = function( limit )
{
	var array = this.getTweetsArray( this.twitterData, limit );

	return { tweets: array };
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getTweetsArray = function( data, limit )
{
	if( !data ) return;

	if( !limit || limit > data.length )
	{
		limit = data.length;
	}

	var array = [];
	for( var i = 0; i < limit; i++ )
	{
		var tweet = data[i],

			TC = PULSE.CLIENT.TwitterController,
			userAccountLink = TC.getUserAccountUrl( tweet.user.screen_name ),
			tweetDate = TC.parseTwitterDate( tweet.created_at ),
			timestamp = PULSE.CLIENT.DateUtil.getSinceString( tweetDate ),
			model;

		model = {
			timestamp: timestamp,
			id: tweet.id_str,
			text: TC.markUpLinks( tweet.text ),
			user: {
				id: tweet.user.id_str,
				name: tweet.user.name,
				account: tweet.user.screen_name,
				link: userAccountLink,
				description: tweet.user.description,
				avatarUrl: tweet.user.profile_image_url
			}
		};

		array.push( model );
	}

	return array;
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getTwitterForTeam = function( teamId )
{

	var tweetDetails = this.teams[ teamId ] ? this.teams[ teamId ].twitter : undefined;
	if( tweetDetails )
	{	
		return tweetDetails;
	}
	return "";
};

PULSE.CLIENT.CRICKET.Tournament.prototype.getTwitterHistoricalModel = function( feedId, limit )
{
	var history = this.twitterHistData[ feedId ];
	var model = { total: 0, buckets: [] };

	if( history && history.data )
	{
		var iLimit = limit ? Math.min( limit, history.data.length ) : history.data.length;
		for( var i = 0; i < iLimit; i++ )
		{
			var pool = history.data[i];
			if( pool.resolution && pool.resolution.unit === "MINUTE" )
			{
				model.buckets = $.map( pool.buckets, function( bucket ) {
					return bucket.count;
				} );
				model.buckets = model.buckets.reverse();
			}
			else if( pool.resolution && pool.resolution.unit === "DAY" )
			{
				model.total = pool.buckets[0].count;
			}
		}
	}

	return model;
};

if( !PULSE )
{
    var PULSE = {};
}
if( !PULSE.CLIENT)
{
    PULSE.CLIENT = {};
}
if( !PULSE.CLIENT.CRICKET)
{
    PULSE.CLIENT.CRICKET = {};
}

PULSE.CLIENT.CRICKET.Match = function( tournament, matchId )
{
    this.tournament = tournament;
    this.matchId = matchId;

    this.dm = PULSE.CLIENT.getDataManager();
    this.urlGenerator = tournament.tournamentUrlGenerator;
    this.APICaller = tournament.APICaller;

    this.scoringData = undefined;
    this.scheduleData = undefined;
    this.playerLookup = undefined;

    this.commentaryUrls = [];
    this.chunks = {};
};

/**
 * Only fired off by schedule data, so won't be used by match-centric pages ( i.e., match home )
 */
PULSE.CLIENT.CRICKET.Match.prototype.setScheduleData = function( data )
{
    this.scheduleData = data;

    if( this.getMatchState() === 'U')
    {
        // Add the match to the tournament's list of upcoming matches
        this.tournament.registerMatchAs('upcoming', data.matchId.name );
    }

    if( this.getMatchState() === 'L' && !this.scoringLoaded )
    {
        // Remove the match from the tournament's list of upcoming matches
        this.tournament.unregisterMatchAs('upcoming', data.matchId.name );
        // Add the match to the tournament's list of current live matches
        this.tournament.registerMatchAs('live', data.matchId.name );

        this.startScoringFeed( true );
        this.scoringLoaded = true;
    }

    if( this.getMatchState() === 'C' && !this.scoringLoaded )
    {
        // Remove the match from the tournament's list of current live matches
        this.tournament.unregisterMatchAs('live', data.matchId.name );
        // Add the match to the tournament's list of complete matches
        this.tournament.registerMatchAs('complete', data.matchId.name );
    }
};

PULSE.CLIENT.CRICKET.Match.prototype.setScoringData = function( data )
{
    this.scoringData = data;
};

PULSE.CLIENT.CRICKET.Match.prototype.hasScoringData = function()
{
    if( this.scoringData )
    {
        return true;
    }
    return false;
};

/**
 * Given a teamId, returns whether the team is in this match
 */
PULSE.CLIENT.CRICKET.Match.prototype.hasTeamWithId = function( teamId )
{
    if( !teamId || teamId === -1 )
    {
        return;
    }

    if( +teamId === this.getTeamId(0) || +teamId === this.getTeamId(1 ) )
    {
        return true;
    }
};

/**
 * Given a venueId, returns whether the match is at that venue
 */
PULSE.CLIENT.CRICKET.Match.prototype.hasVenueWithId = function( venueId )
{
    if( !venueId || venueId === -1 )
    {
        return;
    }

    var venue = this.getVenue();

    if( venue && +venueId === venue.id )
    {
        return true;
    }
};


PULSE.CLIENT.CRICKET.Match.prototype.hasGroupWithId = function( groupId )
{
    if( !groupId || groupId === -1 || !this.scheduleData )
    {
        return;
    }

    if( groupId === this.scheduleData.groupName )
    {
        return true;
    }
};


PULSE.CLIENT.CRICKET.Match.prototype.getMatchType = function()
{
    if( this.scheduleData )
    {
        return this.scheduleData.matchType;
    }
    else if( this.scoringData )
    {
        return this.scoringData.matchInfo.matchType;
    }
};

PULSE.CLIENT.CRICKET.Match.prototype.getMatchDate = function()
{
    var dateString = "";

    if( this.scheduleData )
    {
        dateString = this.scheduleData.matchDate;
    }
    else if( this.scoringData )
    {
        dateString = this.scoringData.matchInfo.matchDate;
    }

    return dateString;
};


PULSE.CLIENT.CRICKET.Match.prototype.getMatchNumberFromId = function()
{
    if( this.matchId )
    {

        var arr = this.matchId.split('-'),
            len = arr.length,
            matchNumber = arr[len - 1];

        return matchNumber;
    }
};

PULSE.CLIENT.CRICKET.Match.prototype.getFormattedMatchDate = function( dateFormat )
{
    var dateString = this.getMatchDate();
    if( dateString )
    {

        var formattedDate = PULSE.CLIENT.Util.getFormattedDate( dateString, dateFormat );
        //console.log( dateString + ' ' + formattedDate );
        return formattedDate;
    }
};

PULSE.CLIENT.CRICKET.Match.prototype.getFormattedMatchDateWithOffset = function ( desiredFormat , offset )
{
    var matchDate = PULSE.CLIENT.DateUtil.parseDateTime( this.getMatchDate() );
    if( matchDate )
    {
        var offsetDate = new Date( matchDate.getTime() + ( 3600000 * offset ) )
        if ( offsetDate )
        {
            return offsetDate.format( desiredFormat || 'dd mmmm yyyy' );
        }
    }
    return "";
};

PULSE.CLIENT.CRICKET.Match.prototype.getFormattedTimeZoneDate = function( dateFormatString )
{
    var dateString = this.getMatchDate(),
        timezoneOffset = parseInt( _.last( dateString.split( '+' ) ).slice( 0,2 ), undefined ),
        date = PULSE.CLIENT.DateUtil.parseDateTime( dateString ),
        offsetDate = new Date( date.getTime() + ( 3600000 * timezoneOffset ) ),
        utcDate = PULSE.CLIENT.DateUtil.getUtcDateObject( offsetDate );

    if( utcDate )
    {
        var formattedDateString = dateFormat( utcDate, 'dddd mmmm dS yyyy| HH:MM | Z' ).split('|')[0];
        return formattedDateString;
    }
};

PULSE.CLIENT.CRICKET.Match.prototype.getFormattedTimeZoneTime = function( dateFormatString )
{
    var dateString = this.getMatchDate(),
        timezoneHalfHour = _.last( dateString.split( '+' ) ).slice( 2,4 ) === '00' ? 0 : 0.5,
        timezoneOffset = parseInt( _.last( dateString.split( '+' ) ).slice( 0,2 ), undefined ) + timezoneHalfHour,
        date = PULSE.CLIENT.DateUtil.parseDateTime( dateString ),
        offsetDate = new Date( date.getTime() + ( 3600000 * timezoneOffset ) ),
        utcDate = PULSE.CLIENT.DateUtil.getUtcDateObject( offsetDate );

    if( utcDate )
    {
        var formattedDateString = dateFormat( utcDate, 'dddd mmmm dS yyyy| HH:MM | Z' ).split('|')[ 1 ];
        return formattedDateString;
    }
};

PULSE.CLIENT.CRICKET.Match.prototype.getFormattedMatchTime = function( timeFormat, timezoneOffset )
{
    var dateString = this.getMatchDate();
    if( dateString )
    {

        var timeString = PULSE.CLIENT.DateUtil.getTimeFromTimestamp( dateString, timezoneOffset,
            timeFormat);
        return timeString;
    }
};

PULSE.CLIENT.CRICKET.Match.prototype.getDayNight = function()
{
    var time = this.getMatchDate().substring(11, 13);
    var timeNum = parseInt( time );

    if( isNaN( timeNum ) )
    {
        return 'Day';
    }

    if( timeNum <= 12 )
    {
        return 'Day';
    }

    return 'Day/Night';
};

PULSE.CLIENT.CRICKET.Match.prototype.getVenueShortName = function()
{
    var venue = "";

    if( this.scheduleData )
    {
        venue = this.scheduleData.venue.shortName;
    }
    else if( this.scoringData )
    {
        venue = this.scoringData.matchInfo.venue.shortName;
    }

    return venue;
};


PULSE.CLIENT.CRICKET.Match.prototype.getVenueCity = function()
{
    var city = "";

    if( this.scheduleData )
    {
        city = this.scheduleData.venue.city;
    }
    else if( this.scoringData )
    {
        city = this.scoringData.matchInfo.venue.city;
    }

    return city;
};

PULSE.CLIENT.CRICKET.Match.prototype.getVenue = function()
{
    var venue = {};

    if( this.scheduleData )
    {
        venue = this.scheduleData.venue;
    }
    else if( this.scoringData )
    {
        venue = this.scoringData.matchInfo.venue;
    }

    return venue;
};

PULSE.CLIENT.CRICKET.Match.prototype.getVenueUrl = function()
{
    var url;

    if( this.scheduleData )
    {
        url = this.urlGenerator.getVenueUrl( this.scheduleData.venue.id, this.scheduleData.venue.fullName );
    }
    else if( this.scoringData )
    {
        url = this.urlGenerator.getVenueUrl( this.scoringData.matchInfo.venue.id, this.scoringData.matchInfo
            .venue.fullName );
    }

    return url;
};


PULSE.CLIENT.CRICKET.Match.prototype.getMatchDescription = function()
{
    var description = "";

    if( this.scoringData )
    {
        description = this.scoringData.matchInfo.description;
    }

    if( this.scheduleData )
    {
        description = this.scheduleData.description;
    }

    return description;
};

PULSE.CLIENT.CRICKET.Match.prototype.getMatchDuration = function()
{
    if( this.scoringData && this.scoringData.matchInfo.additionalInfo )
    {
        return this.scoringData.matchInfo.additionalInfo['match.duration'];
    }
};
PULSE.CLIENT.CRICKET.Match.prototype.getMatchDay = function()
{
    if( this.scoringData && this.scoringData.matchInfo.additionalInfo )
    {
        return this.scoringData.matchInfo.additionalInfo['match.day'];
    }
};

PULSE.CLIENT.CRICKET.Match.prototype.getGroupName = function()
{
    var groupName = '';

    if( this.scoringData )
    {
        groupName = this.scoringData.groupName || '';
    }

    if( this.scheduleData )
    {

        groupName = this.scheduleData.groupName || '';
    }

    return groupName;
};

PULSE.CLIENT.CRICKET.Match.prototype.getStageName = function()
{
    if( this.tournament.stages )
    {
        for( var i = 0, iLimit = this.tournament.stages.length; i < iLimit; i++ )
        {
            var stage = this.tournament.stages[ i ];
            if( stage.type === 'list' )
            {
                if( -1 < _.indexOf( stage.matches, this.matchId ) )
                {
                    return stage.name;
                }
            }
            else if( this.getGroupName() && -1 < _.indexOf( stage.groups, this.getGroupName() ) )
            {
                return stage.name;
            }
        }
    }
};

PULSE.CLIENT.CRICKET.Match.prototype.getTournamentLabel = function()
{
    var tournamentLabel = "";

    if( this.scoringData )
    {
        tournamentLabel = this.scoringData.matchInfo.tournamentLabel || "";

    }

    return tournamentLabel;
};


PULSE.CLIENT.CRICKET.Match.prototype.getTournamentId = function()
{
    var tournamentId;

    if( this.scheduleData )
    {
        tournamentId = this.scheduleData.tournamentId;
    }

    return tournamentId;
};

PULSE.CLIENT.CRICKET.Match.prototype.getTournamentName = function()
{
    if( this.tournament )
    {
        return this.tournament.tournamentName;
    }
};


PULSE.CLIENT.CRICKET.Match.prototype.getMatchLink = function( tab )
{
    var link = this.urlGenerator.getMatchURL( this.matchId );
    return link;
};

PULSE.CLIENT.CRICKET.Match.prototype.getTeamLink = function( teamIndex )
{
    var teamName = this.getFullName( teamIndex ),
        teamId = this.getTeamId( teamIndex );
    if( teamName && teamId )
    {
        var link = this.tournament.globalUrlGenerator.getTeamURL( teamId, teamName );
        return link;
    }

    return "";
};

PULSE.CLIENT.CRICKET.Match.prototype.getPreviewLink = function()
{
    if (this.scheduleData)
    {
        return this.scheduleData.matchPreviewLink;
    }
    else
    {
        if (this.scoringData && this.scoringData.matchInfo.additionalInfo)
        {
            return this.scoringData.matchInfo.additionalInfo['preview.link'];
        }
    }
};
PULSE.CLIENT.CRICKET.Match.prototype.getReportLink = function()
{
    if (this.scheduleData)
    {
        return this.scheduleData.reportLink;
    }
    else
    {
        if (this.scoringData && this.scoringData.matchInfo.additionalInfo)
        {
            return this.scoringData.matchInfo.additionalInfo['report.link'];
        }
    }
};
PULSE.CLIENT.CRICKET.Match.prototype.getReportThumb = function()
{
    if (this.scoringData && this.scoringData.matchInfo.additionalInfo)
    {
        return this.scoringData.matchInfo.additionalInfo['report.thumb'];
    }
};
PULSE.CLIENT.CRICKET.Match.prototype.getHighlightsLink = function()
{
    if (this.scheduleData)
    {
        return this.scheduleData.highlightsLink;
    }
    else
    {
        if (this.scoringData && this.scoringData.matchInfo.additionalInfo)
        {
            return this.scoringData.matchInfo.additionalInfo['highlights.link'];
        }
    }
};
PULSE.CLIENT.CRICKET.Match.prototype.getHighlightsThumb = function()
{
    if (this.scoringData && this.scoringData.matchInfo.additionalInfo)
    {
        return this.scoringData.matchInfo.additionalInfo['match.video.thumb'];
    }
};
PULSE.CLIENT.CRICKET.Match.prototype.getHighlightsId = function()
{
    if (this.scoringData && this.scoringData.matchInfo.additionalInfo)
    {
        return this.scoringData.matchInfo.additionalInfo['match.video.id'];
    }
};
PULSE.CLIENT.CRICKET.Match.prototype.getManOfTheMatchId = function()
{
    if (this.scoringData && this.scoringData.matchInfo.additionalInfo)
    {
        return this.scoringData.matchInfo.additionalInfo['mom.video.id'];
    }
};
PULSE.CLIENT.CRICKET.Match.prototype.getManOfTheMatchThumb = function()
{
    if (this.scoringData && this.scoringData.matchInfo.additionalInfo)
    {
        return this.scoringData.matchInfo.additionalInfo['mom.video.thumb'];
    }
};
PULSE.CLIENT.CRICKET.Match.prototype.getPhotostreamLink = function()
{
    if( this.scheduleData )
    {
        return this.scheduleData.photostreamLink;
    }
    else
    {
        if( this.scoringData && this.scoringData.matchInfo.additionalInfo )
        {
            return this.scoringData.matchInfo.additionalInfo['photostream.link'];
        }
    }
};
PULSE.CLIENT.CRICKET.Match.prototype.getTicketsLink = function()
{
    return this.tournament.ticketLinks ? this.tournament.ticketLinks[ this.matchId ] : '';
};

PULSE.CLIENT.CRICKET.Match.prototype.getCalendarLink = function()
{
    return PULSE.CLIENT.getCalendarLink( this.generateCalendarEvent() );
};

PULSE.CLIENT.CRICKET.Match.prototype.generateCalendarEvent = function()
{
    var matchBetween = this.getFullName( 0 ) + ' v ' + this.getFullName( 1 ),
        matchDescription = this.getMatchDescription(),
        startTime = this.getFormattedMatchDate( 'yyyymmdd' ) + 'T' + this.getFormattedMatchTime( 'HHMM00' ),
        approxEnd = this.getApproximateEndDate(),
        endTime = approxEnd.format( 'yyyymmdd') + 'T' + approxEnd.format( 'HHMM00' ),
        title = this.getFullName( 0 ) + ' v ' + this.getFullName( 1 ),
        venue = this.getVenue();

    icsContent = 'BEGIN:VEVENT\r\nDTEND:'  + endTime + '\r\nUID:'  + this.matchId +
        '\r\nDTSTAMP:20120315T170000Z\r\nSUMMARY:' + title +'\r\nLOCATION:' + venue.fullName +
        '\r\nDESCRIPTION:' + matchBetween + ' - ' + matchDescription + '\r\nDTSTART:' + startTime +
        '\r\nEND:VEVENT\r\n';

    return icsContent;
};

PULSE.CLIENT.CRICKET.Match.prototype.getApproximateEndDate = function()
{
    var offset = 0;
    if( this.isLimitedOvers() )
    {
        if( -1 < _.indexOf( [ 'T20I', 'T20' ], this.getMatchType() ) )
        {
            offset = 3.5 * 60 * 60 * 1000;
        }
        else
        {
            offset = 10 * 60 * 60 * 1000;
        }
    }
    else
    {
        offset = 5 * 24 * 60 * 60 * 1000;
    }

    return new Date( PULSE.CLIENT.DateUtil.parseDateTime( this.getMatchDate() ).getTime() + offset );
};

PULSE.CLIENT.CRICKET.Match.prototype.getMatchVideoMediaId = function()
{
    if( this.scoringData && this.scoringData.matchInfo.additionalInfo )
    {
        return this.scoringData.matchInfo.additionalInfo['match.video.id'];
    }
};
PULSE.CLIENT.CRICKET.Match.prototype.getMatchPhoto = function()
{
    if( this.scoringData && this.scoringData.matchInfo.additionalInfo )
    {
        return this.scoringData.matchInfo.additionalInfo["match.photo.id"];
    }
};

PULSE.CLIENT.CRICKET.Match.prototype.getTeamTweetCount = function( teamIndex )
{
    if( this.scoringData && this.scoringData.matchInfo.additionalInfo )
    {
        if( teamIndex === 1 )
        {
            return this.scoringData.matchInfo.additionalInfo["away.team.fan.total"];
        }
        return this.scoringData.matchInfo.additionalInfo["home.team.fan.total"];
    }
};

PULSE.CLIENT.CRICKET.Match.prototype.getMatchState = function()
{
    if( this.scoringData )
    {
        var matchState = '';

        switch( this.scoringData.currentState.phase )
        {
            case 'E':
            case 'U':
                matchState = 'U';
                break;
            case 'C':
            case 'O':
                matchState = 'C';
                break;
            default:
                matchState = 'L';
                break;
        }

        return matchState;
    }
    else if( this.scheduleData )
    {
        /*
		// Breaks in old-format games
		var matchDate 	= this.scheduleData.matchDate,
			date 		= PULSE.CLIENT.DateUtil.parseDateTime( matchDate ),
			now  		= new Date();

		if( date && date - now > 0 )
		{
			return "U";
		}
		*/

        return this.scheduleData.matchState;
    }
};

PULSE.CLIENT.CRICKET.Match.prototype.isMatchLive = function()
{
    var stateString;
    if( this.scoringData )
    {
        stateString = this.scoringData.currentState.phase;
    }
    else if( this.scheduleData )
    {
        stateString = this.scheduleData.matchState;
    }
    if(stateString && $.inArray(stateString, ["U", "C"] ) === -1 )
    {
        return true;
    }
};

PULSE.CLIENT.CRICKET.Match.prototype.isInInningsBreak = function()
{
    var inningsBreak = false;

    if( this.scoringData )
    {
        switch( this.scoringData.currentState.phase )
        {
            case '12':
            case '23':
            case '34':
                inningsBreak = true;
                break;
        }
    }

    return inningsBreak;
};

PULSE.CLIENT.CRICKET.Match.prototype.getCurrentInningsIndex = function()
{
    if( !this.scoringData || !this.scoringData.currentState )
    {
        return;
    }
    return this.scoringData.currentState.currentInningsIndex;
};

PULSE.CLIENT.CRICKET.Match.prototype.getTeamInnings = function( index )
{
    var innings = [];

    //if scoring data exists, it takes precedence
    if( this.scoringData )
    {
        var battingOrder = this.scoringData.matchInfo.battingOrder,
            cii = this.scoringData.currentState.currentInningsIndex;

        if( this.scoringData.innings )
        {
            for( var i = 0; i < this.scoringData.innings.length; i++ )
            {
                var inning = this.scoringData.innings[ i ],
                    battingIdx = battingOrder[ i ];

                if( inning.scorecard && battingIdx === index )
                {
                    innings.push(PULSE.CLIENT.CRICKET.Utils.getInningsScore( inning.scorecard.runs,
                        inning.scorecard.wkts, inning.scorecard.allOut, inning.declared, false ) );
                }
            }
        }
        //if a new innings has started and an innings object
        //doesn't exist for the new innings and
        //batting index for this innings === index
        //add an empty score
        if( ( !this.scoringData.innings || this.scoringData.innings.length < ( cii + 1 ) ) &&
            battingOrder &&
            battingOrder[ cii ] === index )
        {
            innings.push( this.getMatchState() === 'L' ? '0/0' : '' );
        }
    }
    else if( this.scheduleData && this.scheduleData[ 'team' + ( index + 1 ) ] &&
             this.scheduleData[ 'team' + ( index + 1 ) ].innings )
    {
        for( var i = 0; i < this.scheduleData[ 'team' + ( index + 1 ) ].innings.length; i++ )
        {
            var inning = this.scheduleData['team' + ( index + 1 ) ].innings[ i ];

            // sometimes the data feed returns an innings object,
            // but with no balls faced means the inns never started, so it needs to be ignored
            if( inning.ballsFaced )
            {
                innings.push(PULSE.CLIENT.CRICKET.Utils.getInningsScore( inning.runs, inning.wkts,
                    inning.allOut, inning.declared, false ) );
            }
        }
    }
    else
    {
        innings.push('');
    }

    return innings;
};

/**
 * Returns an array of innings objects, so the score can be built from it, rather than simply
 * returning the score strings for each innings
 * @param  {Number} index - the index of the team for which to return the innings objects
 * @return {Array}        - array of innings objects for the given team
 */
PULSE.CLIENT.CRICKET.Match.prototype.getRawTeamInnings = function( index )
{
    var innings = [];
    var defaultInnings = { runs: 0, wkts: 0, allOut: false, declared: false };

    //if scoring data exists, it takes precedence
    if( this.scoringData )
    {
        var battingOrder = this.scoringData.matchInfo.battingOrder,
            cii = this.scoringData.currentState.currentInningsIndex;

        if( this.scoringData.innings )
        {
            for( var i = 0; i < this.scoringData.innings.length; i++ )
            {
                var inning = this.scoringData.innings[ i ],
                    battingIdx = battingOrder[ i ];

                if( inning.scorecard && battingIdx === index )
                {
                    innings.push( $.extend( defaultInnings, {
                        runs: inning.scorecard.runs,
                        wkts: inning.scorecard.wkts,
                        allOut: inning.scorecard.allOut,
                        declared: inning.declared
                    } ) );
                }
            }
        }
        //if a new innings has started and an innings object
        //doesn't exist for the new innings and
        //batting index for this innings === index
        //add an empty score
        if( ( !this.scoringData.innings || this.scoringData.innings.length < ( cii + 1 ) ) &&
            battingOrder &&
            battingOrder[ cii ] === index )
        {
            innings.push( this.getMatchState() === 'L' ? defaultInnings : '' );
        }
    }
    else if( this.scheduleData && this.scheduleData[ 'team' + ( index + 1 ) ] &&
             this.scheduleData[ 'team' + ( index + 1 ) ].innings )
    {
        for( var i = 0; i < this.scheduleData[ 'team' + ( index + 1 ) ].innings.length; i++ )
        {
            var inning = this.scheduleData['team' + ( index + 1 ) ].innings[ i ];

            // sometimes the data feed returns an innings object,
            // but with no balls faced means the inns never started, so it needs to be ignored
            if( inning.ballsFaced )
            {
                innings.push( $.extend( defaultInnings, inning ) );
            }
        }
    }
    else
    {
        innings.push('');
    }

    return innings;
};

/**
 * Returns the score of the latest innings
 */
PULSE.CLIENT.CRICKET.Match.prototype.getCurrentScore = function()
{

    if( this.scoringData && ( this.getMatchState() === 'L' || this.getMatchState() === 'C' ) )
    {
        var cii = this.scoringData.currentState.currentInningsIndex;

        if( ( !this.scoringData.innings || this.scoringData.innings.length < ( cii + 1 ) ) )
        {
            return {
                runs: 0,
                wickets: 0
            };
        }

        var inningsArray = this.scoringData.innings;
        if( inningsArray )
        {
            var lastInnings = inningsArray[ inningsArray.length - 1 ];

            if( lastInnings.scorecard )
            {
                var currentScore = {
                    runs: lastInnings.scorecard.runs,
                    wickets: lastInnings.scorecard.wkts || 0,
                    allOut: lastInnings.scorecard.allOut,
                    declared: lastInnings.declared
                };

                return currentScore;
            }

            return {
                runs: undefined,
                wickets: undefined
            };
        }
    }
};

PULSE.CLIENT.CRICKET.Match.prototype.getOverHistory = function( innsIndex )
{
    if( !this.scoringData || !this.scoringData.innings || ( typeof innsIndex === "undefined") || !this.scoringData.innings[innsIndex] )
    {
        return [];
    }

    return this.scoringData.innings[ innsIndex ].overHistory || [];
};

PULSE.CLIENT.CRICKET.Match.prototype.getOver = function( innsIndex, overIndex )
{
    var overHistory = this.getOverHistory( innsIndex );
    if( overHistory )
    {
        return overHistory[ overIndex ];
    }
};

PULSE.CLIENT.CRICKET.Match.prototype.getTeamWon = function( index )
{
    var desiredOutcome = index === 0 ? 'A' : 'B',
        outcome = this.getOutcome();

    return desiredOutcome === outcome;
};

PULSE.CLIENT.CRICKET.Match.prototype.getTeamRunRate = function( index )
{
    //if scoring data exists, it takes precedence
    if( this.scoringData && this.scoringData.innings )
    {
        var battingOrder = this.scoringData.matchInfo.battingOrder,
            cii = this.scoringData.currentState.currentInningsIndex,
            battingIdx = battingOrder[cii],
            batting = battingIdx === index,
            inning = PULSE.CLIENT.CRICKET.Utils.getTeamLatestInnings( this.scoringData.innings,
                battingOrder, index );

        if( inning && inning.runRate ) // && batting )
        {
            return inning.runRate;
        }
    }
    return '';
};

PULSE.CLIENT.CRICKET.Match.prototype.getMaxOvers = function( index )
{
    if( this.scoringData )
    {
        if( this.scoringData.innings )
        {
            var battingOrder = this.scoringData.matchInfo.battingOrder,
                cii = this.scoringData.currentState.currentInningsIndex,
                inning = PULSE.CLIENT.CRICKET.Utils.getTeamLatestInnings(
                    this.scoringData.innings,
                    battingOrder,
                    index
                ),
                oversLimit = this.scoringData.matchInfo.oversLimit;

            return inning && inning.rodl ? inning.rodl.overs : oversLimit;
        }
        else
        {
            return this.scoringData.matchInfo.oversLimit;
        }

    }
    else if( this.scheduleData &&
             this.scheduleData['team' + (index + 1 ) ] &&
             this.scheduleData['team' + (index + 1 ) ].innings )
    {
        var innings = this.scheduleData['team' + (index + 1 ) ].innings,
            inning = innings[innings.length - 1];

        inning.maxBalls = inning.maxBalls || this.maxBalls;

        var oversLimit = inning.maxBalls ? PULSE.CLIENT.CRICKET.Utils.getFakeOversFraction(
            {
                ballsFaced: inning.maxBalls
            }) : undefined;

        return oversLimit;
    }
};

//returns the over progress for a team's latest innings
//returns ovProg/maxOvers for limited overs
//returns ovProg ov for unlimited overs

PULSE.CLIENT.CRICKET.Match.prototype.getOverProgress = function( index )
{
    var overProgress = '';

    //if scoring data exists, it takes precedence
    if( this.scoringData && this.scoringData.innings )
    {
        var battingOrder = this.scoringData.matchInfo.battingOrder,
            cii = this.scoringData.currentState.currentInningsIndex,
            inning = PULSE.CLIENT.CRICKET.Utils.getTeamLatestInnings( this.scoringData.innings,
                battingOrder,
                index ),
            batting = this.teamIsBatting( index ),
            limited = this.scoringData.matchInfo.isLimitedOvers,
            matchType = this.scoringData.matchInfo.matchType,
            maxOvers = ( matchType === 'ODI' || matchType === "LIST_A" || matchType === 'OTHER' ) ? 50 : 20;

        if( this.tournament.tournamentName === "champtrophy-2013-warmups")
        {
            maxOvers = 50;
        }

        if( inning && inning.overProgress )
        {
            if( limited )
            {
                overProgress = inning.overProgress + '/' + ( inning.rodl ? inning.rodl.overs :
                    maxOvers );
            }
            else
            {
                //for unlimited overs only add over progress if team is batting
                //this means also checking if an innings has started but no innings object exists for it
                if( this.scoringData.matchInfo.matchState !== 'L' || batting )
                {
                    if( this.scoringData.innings.length < ( cii + 1 ) && batting )
                    {

                    }
                    else
                    {
                        overProgress = inning.overProgress;
                    }
                }

            }
        }

        // if the match has started but this team is batting but no ball have been bowled, return default
        if( !overProgress && this.teamIsBatting( index ) )
        {
            if( !limited )
            {
                return "0";
            }
            else
            {
                return "0/" + ( inning && inning.rodl ? inning.rodl.overs : maxOvers );
            }
        }
    }
    else if( this.scheduleData && this.scheduleData['team' + ( index + 1 ) ]
        && this.scheduleData[ 'team' + ( index + 1 ) ].innings )
    {
        var innings = this.scheduleData['team' + ( index + 1 ) ].innings,
            inning = innings[innings.length - 1],
            overFraction = PULSE.CLIENT.CRICKET.Utils.getFakeOversFraction( inning ),
            oversLimit = inning.maxBalls ? PULSE.CLIENT.CRICKET.Utils.getFakeOversFraction(
            {
                ballsFaced: inning.maxBalls
            }) : undefined,
            matchType = this.scheduleData.matchType,
            maxOvers = (matchType === 'ODI' || matchType === "LIST_A" || matchType === 'OTHER' ) ? 50 : 20,
            limited = (matchType === 'TEST' || matchType === "FIRST_CLASS") ? false : true;

        if( this.tournament.tournamentName === "champtrophy-2013-warmups")
        {
            maxOvers = 50;
        }

        if( inning && overFraction )
        {
            if( limited )
            {
                overProgress = overFraction + '/' + ( oversLimit || maxOvers );
            }
            else
            {
                overProgress = overFraction;
            }
        }
    }

    return overProgress;
};

// requires a team index
PULSE.CLIENT.CRICKET.Match.prototype.getOverProgressArray = function( index )
{
    var overProgress = [];

    //if scoring data exists, it takes precedence
    if( this.scoringData && this.scoringData.innings )
    {
        var battingOrder = this.scoringData.matchInfo.battingOrder,
            cii = this.scoringData.currentState.currentInningsIndex,
            innings = this.scoringData.innings,
            batting = this.teamIsBatting( index ),
            limited = this.scoringData.matchInfo.isLimitedOvers,
            matchType = this.scoringData.matchInfo.matchType,
            maxOvers = (matchType === 'ODI' || matchType === "LIST_A") ? 50 : 20;

        if( this.tournament.tournamentName === "champtrophy-2013-warmups")
        {
            maxOvers = 50;
        }

        for( var i = 0; i < innings.length; i++ )
        {
            var inning = innings[ i ],
                battingIdx = battingOrder[ i ];

            if(battingIdx === index )
            {
                if( inning && inning.overProgress && !limited )
                {
                    if( !limited )
                    {
                        overProgress.push( inning.overProgress );
                    }
                }
            }
            else if((!inning || !inning.overProgress ) && !limited )
            {
                overProgress.push("0");
            }
        }
    }
    else if( this.scheduleData && this.scheduleData['team' + ( index + 1 ) ] &&
        this.scheduleData[ 'team' + ( index + 1 ) ].innings )
    {
        var innings = this.scheduleData['team' + ( index + 1 ) ].innings,
            matchType = this.scheduleData.matchType,
            limited = (matchType === 'TEST' || matchType === "FIRST_CLASS") ? false : true;

        if( this.tournament.tournamentName === "champtrophy-2013-warmups")
        {
            maxOvers = 50;
        }

        for( var i = 0, iLimit = innings.length; i < iLimit; i++ )
        {
            if( !limited && innings[ i ] )
            {
                var overFraction = PULSE.CLIENT.CRICKET.Utils.getFakeOversFraction( innings[ i ] );
                overProgress.push( overFraction)
            }
        }
    }

    return overProgress;
};

PULSE.CLIENT.CRICKET.Match.prototype.getOvers = function( index )
{
    //if scoring data exists, it takes precedence
    if( this.scoringData && this.scoringData.innings)
    {
        var battingOrder = this.scoringData.matchInfo.battingOrder,
            inning = PULSE.CLIENT.CRICKET.Utils.getTeamLatestInnings(
                this.scoringData.innings,
                battingOrder,
                index );

        if( inning && inning.overProgress)
        {
            return inning.overProgress;
        }
    }
    else if( this.scheduleData && this.scheduleData['team' + (index + 1 ) ] &&
             this.scheduleData[ 'team' + (index + 1 ) ].innings )
    {
        var innings = this.scheduleData['team' + (index + 1 ) ].innings,
            inning = innings[innings.length - 1];

        inning.maxBalls = inning.maxBalls || this.maxBalls;

        var oversLimit = inning.maxBalls ? PULSE.CLIENT.CRICKET.Utils.getFakeOversFraction(
            {
                ballsFaced: inning.maxBalls
            }) : undefined;

        return oversLimit;
    }
};


PULSE.CLIENT.CRICKET.Match.prototype.getOverPercentage = function( index )
{
    var overProgress = '';

    //if scoring data exists, it takes precedence
    if( this.scoringData && this.scoringData.innings )
    {
        var battingOrder = this.scoringData.matchInfo.battingOrder,
            cii = this.scoringData.currentState.currentInningsIndex,
            inning = PULSE.CLIENT.CRICKET.Utils.getTeamLatestInnings( this.scoringData.innings,
                battingOrder,
                index ),
            batting = this.teamIsBatting( index ),
            limited = this.scoringData.matchInfo.isLimitedOvers,
            matchType = this.scoringData.matchInfo.matchType,
            maxOvers = (matchType === 'ODI' || matchType === "LIST_A" || matchType === 'OTHER' ) ? 50 : 20;

        if( this.tournament.tournamentName === "champtrophy-2013-warmups")
        {
            maxOvers = 50;
        }

        if( inning && inning.overProgress )
        {
            if( limited )
            {
                overProgress = Math.round( inning.overProgress * 100 / ( inning.rodl ? inning.rodl.overs :
                    maxOvers ) );
            }
            else
            {
                overProgress = 100;

            }
        }
    }
    else if( this.scheduleData && this.scheduleData['team' + ( index + 1 ) ] &&
             this.scheduleData[ 'team' + ( index + 1 ) ].innings )
    {
        var innings = this.scheduleData['team' + ( index + 1 ) ].innings,
            inning = innings[innings.length - 1],
            overFraction = PULSE.CLIENT.CRICKET.Utils.getFakeOversFraction( inning ),
            oversLimit = inning.maxBalls ? PULSE.CLIENT.CRICKET.Utils.getFakeOversFraction(
            {
                ballsFaced: inning.maxBalls
            }) : undefined,
            matchType = this.scheduleData.matchType,
            maxOvers = (matchType === 'ODI' || matchType === "LIST_A" || matchType === 'OTHER' ) ? 50 : 20,
            limited = (matchType === 'TEST' || matchType === "FIRST_CLASS") ? false : true;

        if( this.tournament.tournamentName === "champtrophy-2013-warmups" )
        {
            maxOvers = 50;
        }

        if( inning && overFraction )
        {
            if( limited )
            {
                overProgress = Math.round( inning.overFraction * 100 / ( oversLimit || maxOvers ) );
            }
            else
            {
                overProgress = 100;
            }
        }
    }

    return overProgress;
};

PULSE.CLIENT.CRICKET.Match.prototype.teamIsBatting = function( index )
{
    //only determined via scoring data
    //(schedule doesn't contain enough info )
    if( this.scoringData && this.scoringData.matchInfo.battingOrder)
    {
        var cii = this.scoringData.currentState.currentInningsIndex,
            inProgress = this.scoringData.currentState.inProgress,
            battingOrder = this.scoringData.matchInfo.battingOrder,
            battingIdx = battingOrder[cii];

        return ( inProgress && battingIdx === index );
    }
};

PULSE.CLIENT.CRICKET.Match.prototype.teamIsBowling = function( index )
{
    //only deermined via scoring data
    //(schedule doesn't contain enough info )
    if( this.scoringData && this.scoringData.matchInfo.battingOrder)
    {
        var cii = this.scoringData.currentState.currentInningsIndex,
            inProgress = this.scoringData.currentState.inProgress,
            battingOrder = this.scoringData.matchInfo.battingOrder,
            battingIdx = battingOrder[cii],
            bowlingIdx = battingIdx === 0 ? 1 : 0;

        return ( inProgress && bowlingIdx === index );
    }
};

PULSE.CLIENT.CRICKET.Match.prototype.getTeamAbbr = function( index )
{
    var abbr = 'TBD',
        teamNumber = 'team' + ( index + 1 );

    if( this.scoringData && this.scoringData.matchInfo && this.scoringData.matchInfo.teams )
    {
        var team = this.scoringData.matchInfo.teams[index];

        abbr = team && team.team ? team.team.abbreviation : 'TBD';
    }
    else if( this.scheduleData && this.scheduleData[teamNumber] && this.scheduleData[teamNumber].team)
    {
        abbr = this.scheduleData[teamNumber].team.abbreviation;
    }

    return abbr;
};

PULSE.CLIENT.CRICKET.Match.prototype.getIndexOfTeamByAbbr = function( abbr )
{
    if( this.scoringData && this.scoringData.matchInfo && this.scoringData.matchInfo.teams )
    {
        var team = this.scoringData.matchInfo.teams[0];

        if( team && team.team && team.team.abbreviation == abbr )
        {
            return 0;
        }
        else
        {
            return 1;
        }
    }
};

PULSE.CLIENT.CRICKET.Match.prototype.getTeam = function( index )
{
    var teamNumber = 'team' + ( index + 1 );

    if( this.scoringData && this.scoringData.matchInfo && this.scoringData.matchInfo.teams )
    {
        return this.scoringData.matchInfo.teams[index];
    }
    else if( this.scheduleData && this.scheduleData[teamNumber] &&
        this.scheduleData[teamNumber].team)
    {
        return this.scheduleData[teamNumber].team;
    }

    return id;
};

PULSE.CLIENT.CRICKET.Match.prototype.getTeamId = function( index )
{
    var id = -1,
        teamNumber = 'team' + ( index + 1 );

    if( this.scoringData && this.scoringData.matchInfo && this.scoringData.matchInfo.teams )
    {
        var team = this.scoringData.matchInfo.teams[index];

        id = team && team.team ? team.team.id : -1;
    }
    else if( this.scheduleData && this.scheduleData[teamNumber] && this.scheduleData[teamNumber].team)
    {
        id = this.scheduleData[teamNumber].team.id;
    }

    return id;
};

PULSE.CLIENT.CRICKET.Match.prototype.getFullName = function( index )
{
    var fullName = 'TBD',
        teamNumber = 'team' + ( index + 1 );

    if( this.scoringData && this.scoringData.matchInfo && this.scoringData.matchInfo.teams )
    {
        var team = this.scoringData.matchInfo.teams[index];

        fullName = team && team.team ? team.team.fullName : 'TBD';
    }
    else if( this.scheduleData && this.scheduleData[teamNumber] && this.scheduleData[teamNumber].team)
    {
        fullName = this.scheduleData[teamNumber].team.fullName;
    }

    return fullName;
};

PULSE.CLIENT.CRICKET.Match.prototype.getTeamType = function( index )
{
    var team = this.getTeam( index );
    if( team )
    {
        return team.type;
    }
    else
    {
        return "m";
    }
};

PULSE.CLIENT.CRICKET.Match.prototype.getShortName = function( index )
{
    var shortName = 'TBD',
        teamNumber = 'team' + ( index + 1 );

    if( this.scoringData && this.scoringData.matchInfo && this.scoringData.matchInfo.teams )
    {
        var team = this.scoringData.matchInfo.teams[index];

        shortName = team && team.team ? team.team.shortName : 'TBD';
    }
    else if( this.scheduleData && this.scheduleData[teamNumber] && this.scheduleData[teamNumber].team )
    {
        shortName = this.scheduleData[teamNumber].team.shortName;
    }

    return shortName;
};

PULSE.CLIENT.CRICKET.Match.prototype.getYetToBat = function( index )
{
    var innings = this.getTeamInnings( index ),
        batting = this.teamIsBatting( index ),
        matchState = this.getMatchState();

    if( !( innings.length || batting ) && matchState !== 'C')
    {
        return true;
    }

    return false;
};

PULSE.CLIENT.CRICKET.Match.prototype.getCurrentPartnership = function()
{
    if( !this.scoringData )
    {
        return;
    }

    return this.scoringData.currentState.currentPartnership || '0';
};

PULSE.CLIENT.CRICKET.Match.prototype.getCurrentBattingTeam = function()
{
    //only determined via scoring data
    //(schedule doesn't contain enough info )
    if( this.scoringData && this.scoringData.matchInfo.battingOrder)
    {
        var cii = this.scoringData.currentState.currentInningsIndex,
            inProgress = this.scoringData.currentState.inProgress,
            battingOrder = this.scoringData.matchInfo.battingOrder,
            battingIdx = battingOrder[cii],
            team = this.scoringData.matchInfo.teams[battingIdx];

        return team;
    }
};

PULSE.CLIENT.CRICKET.Match.prototype.getCurrentBowlingTeam = function()
{
    //only determined via scoring data
    //(schedule doesn't contain enough info )
    if( this.scoringData && this.scoringData.matchInfo.teams && this.scoringData.matchInfo.teams.length ===
        2 )
    {
        if( this.teamIsBowling( 0 ) )
        {
            return this.scoringData.matchInfo.teams[ 0 ];
        }
        else if( this.teamIsBowling( 1 ) )
        {
            return this.scoringData.matchInfo.teams[ 1 ];
        }
    }
};

PULSE.CLIENT.CRICKET.Match.prototype.getRequiredRunRate = function()
{
    if( !this.scoringData )
    {
        return;
    }
    var requiredRunRate = this.scoringData.currentState ? this.scoringData.currentState.requiredRunRate :
        "";

    return requiredRunRate;
};

PULSE.CLIENT.CRICKET.Match.prototype.getDLCondition = function()
{
    if( this.scoringData && this.scoringData.innings )
    {
        var latestInnings = _.last( this.scoringData.innings || [] );
        if( latestInnings && latestInnings.rodl && latestInnings.rodl.target )
        {
            return latestInnings.rodl;
        }
    }
};

PULSE.CLIENT.CRICKET.Match.prototype.getMatchSummary = function()
{
    var text = "",
        inningsSummary,
        values,
        currentBattingTeam,
        requiredRunRate;

    if( this.scoringData )
    {
        if( this.scoringData.matchInfo.matchSummary)
        {
            text = this.scoringData.matchInfo.matchSummary;
        }
        else if( this.scoringData.matchInfo.matchStatus )
        {
            text = this.scoringData.matchInfo.matchStatus.text;
        }
        else if( this.scoringData.matchInfo.inningsSummary &&
            this.scoringData.matchInfo.inningsSummary.version === 1 )
        {
            inningsSummary = this.scoringData.matchInfo.inningsSummary;
            values = inningsSummary.values;
            currentBattingTeam = this.getCurrentBattingTeam();
            requiredRunRate = this.getRequiredRunRate();

            switch( inningsSummary.type )
            {
                case "P":
                    text = currentBattingTeam.team.abbreviation + " Projections: " + values[ 0 ] +
                        " &#64; Current Run Rate &#124; " + values[ 1 ] + " runs @ 6 RPO &#124; " +
                        values[ 2 ] + " runs @ 8 RPO";
                    break;

                case "C":
                    var reqRR = this.scoringData.currentState && requiredRunRate ?
                        " &#124; Req RR&#58; " + requiredRunRate : "";
                    text = currentBattingTeam.team.abbreviation + " require " + values[ 0 ] +
                        " runs with " + values[ 1 ] + " balls remaining" + reqRR;
                    break;

                case "T":
                    text = this.getTestMatchSummary();
                    break;
            }
        }
    }
    else if( this.scheduleData && this.scheduleData.matchStatus )
    {
        text = this.scheduleData.matchStatus.text;
    }

    return text;
};

/**
 * If test scores, then for the current innings and the current batting team
 * we need to work out whether or not we're chasing or leading.
 * For instance Team B has a lead of 100 in the second innings then [100][ 1 ][ 1 ]
 * would be returned.
 *
 *   [0] The run delta between the two teams.
 *   [ 1 ] No-Score recorded (0), Ahead(1 ), or Behind(-1 )
 *   [2] To-Win flag. If(1 ) then run count is to "win". This is only set in the final innings.
 */
PULSE.CLIENT.CRICKET.Match.prototype.getTestMatchSummary = function()
{
    var text,

        values = this.scoringData.matchInfo.inningsSummary.values,

        delta = values[ 0 ],
        state = values[ 1 ],
        toWin = values[ 2 ],

        cii = this.getCurrentInningsIndex(),
        teamIndex = this.teamIsBatting( 0 ) ? 0 : 1,
        score = _.last( this.getTeamInnings( teamIndex ) ),
        overs = this.getOverProgress( teamIndex ),
        followOn = this.isFollowOn(),
        currentBattingTeam = this.getCurrentBattingTeam(),
        followOnText = '';

    if( followOn && cii === 2 ) // check for cii possibly redundant
    {
        followOnText = ' are following on and';
    }

    /**
     * If it's the first innings, there's no 'leading' or 'trailing'
     */
    if( cii === 0 )
    {
        text = currentBattingTeam.team.abbreviation + ' are ' + score + ' off ' +
            overs + ' overs';
    }
    /**
     * If it's the last innings and the teams aren't tied
     */
    else if( toWin && delta )
    {
        text = currentBattingTeam.team.abbreviation + ' require ' + delta +
            ' runs to win';
    }
    else
    {
        switch( state )
        {
            case -1:
                text = currentBattingTeam.team.abbreviation + followOnText + ' trail by ' + delta +
                    ' runs';
                break;
            case 0:
                if( followOn )
                {
                    text = currentBattingTeam.team.abbreviation + followOnText + ' scores are level';
                }
                else
                {
                    text = 'Scores are level';
                }
                break;
            case 1:
                text = currentBattingTeam.team.abbreviation + followOnText + ' lead by ' + delta +
                    ' runs';
                break;
        }
    }

    return text;
};

PULSE.CLIENT.CRICKET.Match.prototype.getWinnerIndex = function()
{
    if( 'C' == this.getMatchState() && this.scoringData && this.scoringData.matchInfo )
    {
        var matchStatus = this.scoringData.matchInfo.matchStatus;

        if( matchStatus && matchStatus.outcome == 'A' )
        {
            return 0;
        }
        else if( matchStatus && matchStatus.outcome == 'B' )
        {
            return 1;
        }
        else
        {
            return undefined;
        }
    }
    else if( 'C' == this.getMatchState() && this.scheduleData )
    {
        var matchStatus = this.scheduleData.matchStatus;

        if( matchStatus && matchStatus.outcome == 'A' )
        {
            return 0;
        }
        else if( matchStatus && matchStatus.outcome == 'B' )
        {
            return 1;
        }
        else
        {
            return undefined;
        }
    }
};

PULSE.CLIENT.CRICKET.Match.prototype.getInnsBreakOverride = function()
{
    if( this.scoringData && this.scoringData.matchInfo && this.scoringData.matchInfo.matchSummary )
    {
        return this.scoringData.matchInfo.matchSummary;
    }
};

PULSE.CLIENT.CRICKET.Match.prototype.getOutcome = function()
{
    if( this.scoringData && this.scoringData.matchInfo.matchStatus )
    {
        return this.scoringData.matchInfo.matchStatus.outcome;
    }
    else if( this.scheduleData && this.scheduleData.matchStatus )
    {
        return this.scheduleData.matchStatus.outcome;
    }
};

/**
 * 	Match-specific additional info
 */
PULSE.CLIENT.CRICKET.Match.prototype.getMatchInfoModel = function()
{
    var model = {
        matchType: this.getMatchType(),
        summary: this.getMatchSummary(),
        venue: this.getVenue(),
        umpires: this.getUmpires(),
        referee: this.getReferee(),
        toss: this.getToss(),
        notes: this.getNotes(),
        range: this.getMatchRange(),
        MoM: this.getManOfTheMatch(),
        teams : this.getMatchInfoTeams()
    };

    return model;
};

PULSE.CLIENT.CRICKET.Match.prototype.getMatchInfoTeams = function()
{
    if( this.scoringData && this.scoringData.matchInfo.teams )
    {
        return this.scoringData.matchInfo.teams;
    }
    return [];
};

PULSE.CLIENT.CRICKET.Match.prototype.getUmpires = function()
{
    if( !this.scoringData || !this.scoringData.matchInfo.additionalInfo )
    {
        return [];
    }

    var limit = 10, // assumes no more than 10 umpires get assigned to a match
        umpires = [];

    for( var i = 0; i < limit; i++ )
    {
        var umpire = this.scoringData.matchInfo.additionalInfo[ "umpire.name." + ( i + 1 ) ];
        if(umpire )
        {
            umpires.push(umpire );
        }
    }

    return umpires;
};

/**
 * Determines whether the match is a limited overs match or not
 * IMPORTANT: note that it returns false if there's no data
 *
 * @return {Boolean} true if it is limited, false if it isn't
 */
PULSE.CLIENT.CRICKET.Match.prototype.isLimitedOvers = function()
{
    var matchInfo, team1exists, team2exists, i, innings;

    if( this.scoringData && this.scoringData.matchInfo )
    {
        matchInfo = this.scoringData.matchInfo;
        return matchInfo.isLimitedOvers || matchInfo.oversLimit;
    }
    else if( this.scheduleData )
    {
        team1exists = true;
        team2exists = true;
        if( this.scheduleData.team1 && this.scheduleData.team1.innings )
        {
            for( i = 0, iLimit = this.scheduleData.team1.innings.length; i < iLimit; i++ )
            {
                innings = this.scheduleData.team1.innings[ i ];
                if( innings.maxBalls )
                {
                    return true;
                }
            }
        }

        if( this.scheduleData.team2 && this.scheduleData.team2.innings )
        {
            for( i = 0, iLimit = this.scheduleData.team2.innings.length; i < iLimit; i++ )
            {
                innings = this.scheduleData.team2.innings[ i ];
                if( innings.maxBalls )
                {
                    return true;
                }
            }
        }

        if( -1 < $.inArray( this.getMatchType(), ["TEST", "FIRST_CLASS"] ) )
        {
            return false;
        }
        else if( -1 < $.inArray( this.getMatchType(), ["T20", "T20I", "ODI", "CLT20", "IPLT20", "LIST_A"] ) )
        {
            return true;
        }
    }
    return false;
};

/**
 * Determines whether the match has a follow-on situation by checking whether the
 * third-innings team is the same as the second-innings team
 *
 * @return {Boolean} true if it is a follow-on, false if it isn't
 */
PULSE.CLIENT.CRICKET.Match.prototype.isFollowOn = function()
{
    var innsIndex = this.getCurrentInningsIndex(),
        order;

    if( innsIndex < 2 )
    {
        return false;
    }

    if( this.scoringData && this.scoringData.matchInfo.battingOrder )
    {
        order = this.scoringData.matchInfo.battingOrder;
        return order[ 2 ] === order[ 1 ];
    }
};

PULSE.CLIENT.CRICKET.Match.prototype.getToss = function()
{
    if( !this.scoringData || !this.scoringData.matchInfo.additionalInfo )
    {
        return '';
    }

    return this.scoringData.matchInfo.additionalInfo["toss.elected"];

};

PULSE.CLIENT.CRICKET.Match.prototype.getManOfTheMatch = function()
{
    if( !this.scoringData || !this.scoringData.matchInfo.additionalInfo )
    {
        return '';
    }

    return this.scoringData.matchInfo.additionalInfo["result.playerofthematch"];
};

PULSE.CLIENT.CRICKET.Match.prototype.getReferee = function()
{
    if( !this.scoringData || !this.scoringData.matchInfo.additionalInfo )
    {
        return '';
    }

    return this.scoringData.matchInfo.additionalInfo["referee.name"];
};

PULSE.CLIENT.CRICKET.Match.prototype.getMatchRange = function()
{
    if( !this.scoringData ||
        !this.scoringData.matchInfo.additionalInfo ||
        this.isLimitedOvers() )
    {
        return "";
    }

    return this.scoringData.matchInfo.additionalInfo["match.range"];
};

PULSE.CLIENT.CRICKET.Match.prototype.getTeamBatFirst = function( index )
{
    // Use scoring data if possible
    if( this.scoringData &&
        this.scoringData.matchInfo &&
        this.scoringData.matchInfo.battingOrder )
    {
        if( _.first( this.scoringData.matchInfo.battingOrder ) === index )
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    // Fallback to schedule data - not sure if this is reliable?
    var indexName = 'team' + ( index + 1 );
    if( this.scheduleData &&
        this.scheduleData[ indexName ] &&
        this.scheduleData[ indexName ].innings &&
        this.scheduleData[ indexName ].innings.length > 0 )
    {
        for( var i = 0; i < this.scheduleData[ indexName ].innings.length; i++ )
        {
            if( this.scheduleData[ indexName ].innings[ i ].inningsNumber == 1 )
            {
                return true;
            }
        }
    }
    return false;
};

PULSE.CLIENT.CRICKET.Match.prototype.getNotes = function()
{
    if( !this.scoringData )
    {
        return [];
    }

    var cii = this.scoringData.currentState.currentInningsIndex,
        limit = typeof cii !== "undefined" ? cii + 1 : 0,
        teams = this.scoringData.matchInfo.teams,
        order = this.scoringData.matchInfo.battingOrder,
        notes = [];

    if( order)
    {
        for( var i = 0; i < limit; i++ )
        {
            var note = {};
            var team = teams[ order[ i ] ].team;
            var entries = [];

            note.team = team;

            if( this.scoringData.matchInfo.additionalInfo )
            {
                var j = 1;
                while ( this.scoringData.matchInfo.additionalInfo["notes." + ( i + 1 ) + "." + j ] )
                {
                    entries.push( this.scoringData.matchInfo.additionalInfo["notes." + ( i + 1 ) + "." +
                        j ] );
                    j++;
                }
            }

            note.entries = entries;

            if( note.entries.length )
            {
                notes.push( note );
            }
        }
    }

    return notes;
};

PULSE.CLIENT.CRICKET.Match.prototype.getScorecardSource = function()
{
    if( this.scoringData && this.scoringData.matchInfo.additionalInfo )
    {
        return this.scoringData.matchInfo.additionalInfo._scorecard_source;
    }
};

PULSE.CLIENT.CRICKET.Match.prototype.getVenueLocation = function()
{
    var venue = "",
        shortName = this.getVenueShortName(),
        city = this.getVenueCity();

    if( shortName || city )
    {
        if( shortName )
        {
            venue = venue + shortName;
            if( city )
            {
                venue = venue + ', ';
            }
        }

        if( city )
        {
            venue = venue + city;
        }
    }
    return venue;
};

PULSE.CLIENT.CRICKET.Match.prototype.getEstimatedDuration = function()
{
    var sport,
        timeDiff = 360,
        matchType = this.getMatchType();

    if( matchType ) {
        if ( matchType.indexOf( 'T20' ) > -1 )
        {
            timeDiff = 180;
        }
    }

    return timeDiff;
};

PULSE.CLIENT.CRICKET.Match.prototype.getTournamentShortName = function()
{
    if ( this.tournament && this.tournament.shortName )
    {
        return this.tournament.shortName;
    }
    return '';
};

PULSE.CLIENT.CRICKET.Match.prototype.generateCalendarData = function()
{
    var location, details;
    var    tournament = this.getTournamentShortName();
    var    groupName = this.getGroupName();
    var    matchTitle;
    var    timeDiff = this.getEstimatedDuration();
    var    startTime = this.getFormattedMatchDate( 'yyyymmdd' ) + 'T' + this.getFormattedMatchDate( 'HHMM00' );
    var    endTime = this.getFormattedMatchDateWithOffset( 'yyyymmdd', ( timeDiff / 60 ) ) + 'T' + this.getFormattedMatchDateWithOffset( 'HHMM00', ( timeDiff / 60 ) );
    var    title = this.getFullName( 0 ) + ' v ' + this.getFullName( 1 );

    if( tournament && ( tournament.length > 0 ) )
    {
        title = title + ' - ' + tournament;
        details = tournament;
    }

    if( groupName )
    {
        if( details && details.length > 0 )
        {
            details = details + ', ' + groupName;
        }
    }

    location = this.getVenueLocation();
    //details = "MAtch of ruggers";
    icsContent = 'BEGIN:VEVENT\r\nDTEND:'  + endTime + '\r\nUID:'  + this.matchId + '\r\nDTSTAMP:20120315T170000Z\r\nSUMMARY:' + title +'\r\nLOCATION:' + location + '\r\nDESCRIPTION:' + details + '\r\nDTSTART:' + startTime + '\r\nEND:VEVENT\r\n';

    return icsContent;
};

PULSE.CLIENT.CRICKET.Match.prototype.generateCalendarLink = function()
{
    var icsContent = escape( 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//hacksw/handcal//NONSGML v1.0//EN\r\nCALSCALE:GREGORIAN\r\n' + this.generateCalendarData() +'END:VCALENDAR\r\n' ),
        link = 'data:text/calendar;charset=utf8,'+ icsContent;

    return link;
};

PULSE.CLIENT.CRICKET.Match.prototype.getHashtag = function()
{
    var abbr1 = this.getTeamAbbr(0),
        abbr2 = this.getTeamAbbr(1),
        id1 = this.getTeamId(0),
        id2 = this.getTeamId(1);

    if( id1 !== -1 && id2 !== -1 )
    {
        // cwc only
        if( this.tournament.tournamentName === 'cwc-2015' )
        {
            if( abbr1 === 'IND' )
            {
                return '#INDv' + abbr2;
            }
            else if( abbr2 === 'IND' )
            {
                return '#INDv' + abbr1;
            }
            else if( abbr1 === 'AUS' )
            {
                return '#AUSv' + abbr2;
            }
            else if( abbr2 === 'AUS' )
            {
                return '#AUSv' + abbr1;
            }
            else if( abbr1 === 'NZ' )
            {
                return '#NZv' + abbr2;
            }
            else if( abbr2 === 'NZ' )
            {
                return '#NZv' + abbr1;
            }
        }

        // return ABBR1vABBR2 by default
        return '#' + abbr1 + 'v' + abbr2;
    }
};
if (!PULSE) 						{ var PULSE = {}; }
if (!PULSE.CLIENT) 					{ PULSE.CLIENT = {}; }
if (!PULSE.CLIENT.CRICKET) 			{ PULSE.CLIENT.CRICKET = {}; }
if (!PULSE.CLIENT.CRICKET.Match) 	{ PULSE.CLIENT.CRICKET.Match = {}; }

/**
 *	Data requesting
 * 	These are match-specific requests
 */

PULSE.CLIENT.CRICKET.Match.prototype.startScoringFeed = function( start )
{
	if( !this.matchScoringLoaded )
	{
		this.scoringUrl 	 = this.urlGenerator.makeDataUrl( 'scoring', this.matchId );
		//this.scoringUrl = 'http://cdn.pulselive.com/test/data/core/cricket/2012-dan/ipl2013/ipl2013-10/scoring.js';
		this.feedScoring 	 = 'scoring-' + this.matchId;
		this.scoringInterval = 10;
		this.scoringCallback = 'onScoring';

		this.dm.addFeed( this.feedScoring, this.scoringUrl,
			this.scoringInterval, this.scoringCallback, [ this ] );

		if( start )
		{
			this.dm.start( this.scoringUrl );
		}

		this.matchScoringLoaded = true;
	}
};

PULSE.CLIENT.CRICKET.Match.prototype.stopScoringFeed = function()
{
	this.dm.stop( this.scoringUrl );
};

PULSE.CLIENT.CRICKET.Match.prototype.startCommentaryFeed = function( customer, start )
{
	if (!this.commentaryFeedLoaded)
	{
		this.commentaryUrl   = this.urlGenerator.makeDataUrl( ( customer ? customer + '/' : '' ) + 'commentary-meta', this.matchId );
		this.feedCommentary  = 'commentary-' + this.matchId;
		this.commentaryInterval = 13;
		this.commentaryCallback = 'onCommentaryMetadata';

		this.dm.addFeed(this.feedCommentary, this.commentaryUrl,
			this.commentaryInterval, this.commentaryCallback, [ this ]);

		if ( start )
		{
			this.dm.start( this.commentaryUrl );
		}

		this.commentaryFeedLoaded = true;
	}
};

PULSE.CLIENT.CRICKET.Match.prototype.getCommentarySegment = function( index, start, options )
{
	options = options || {};

	this.chunkFeedName = options.feedName || 'commentaryChunk';

	var chunkUrl = this.urlGenerator.makeDataUrl( ( options.customer ? options.customer + '/' : '' ) + 'commentary-' + index, this.matchId );
	var interval = typeof options.interval !== 'undefined' ? options.interval : 0;
	var callback = 'onCommentary';
	var target 	 = options.target ? options.target : this;

	this.dm.addFeed( this.chunkFeedName, chunkUrl, interval, callback, [ target ] );

	if ( start )
	{
		this.dm.start( chunkUrl );
	}
};

PULSE.CLIENT.CRICKET.Match.prototype.getTwitterBattlesData = function( start )
{
	var team1abbr = this.getTeamAbbr(0);
	if( team1abbr && team1abbr !== 'TBD' )
	{
		var dirName = this.tournament.tournamentName + '-' + team1abbr.toLowerCase() + '-battle';
		this.urlGenerator.getTwitterHistoricalData( dirName, start );
	}

	var team2abbr = this.getTeamAbbr(1);
	if( team2abbr && team2abbr !== 'TBD' )
	{
		var dirName = this.tournament.tournamentName + '-' + team2abbr.toLowerCase() + '-battle';
		this.urlGenerator.getTwitterHistoricalData( dirName, start );
	}
};

PULSE.CLIENT.CRICKET.Match.prototype.getVideosData = function( start )
{
	this.videoUrl = this.urlGenerator.makeDataUrl( 'matchVideo', this.matchId );
	this.feedVideo = 'video';
	this.videoCallback = "onMatchVideo";
	this.videoInterval = 30;

	this.dm.addFeed( this.feedVideo, this.videoUrl,
		this.videoInterval, this.videoCallback, [ this ] );

	if( start )
	{
		this.dm.start( this.videoUrl );
	}
};

/**
 * Get match related videos using the Brightcove API
 */
PULSE.CLIENT.CRICKET.Match.prototype.getMatchVideosData = function( start )
{
    this.feedMatchVideo = 'match-videos';

    var params = {
        order: 'desc',
        limit: '100',
        encodingFields: 'url',
        terms: 'match:' + this.matchId
    };

    this.APICaller.getVideos( this.feedMatchVideo, this, params, start );
};

PULSE.CLIENT.CRICKET.Match.prototype.getPhotosDataParams = function()
{
    var matchNumber = this.matchId.split( '-' );
    matchNumber = matchNumber[ matchNumber.length - 1 ];
    matchNumber = parseInt( matchNumber, 10 );

    if( matchNumber < 10 )
    {
        matchNumber = '0' + matchNumber
    }

    return {
        withImages: 'yes',
        order: 'desc',
        season: this.tournament.tournamentName === 'cwc-2015-warmups' ? 'cwc-2015' : this.tournament.tournamentName,
        matchNumber: ( this.tournament.tournamentName === 'cwc-2015-warmups' ? 'warmups-' : '' ) + matchNumber
    };
};

PULSE.CLIENT.CRICKET.Match.prototype.getPhotosData = function( start )
{
	/**
     * Returns jsonp - array of photo objects,
     * containing photo metadata (caption and title) and urls to various photo sizes
     * Usage:
     *      call to: http://www.iplt20.com/feeds/getPhotosByAlbumName?seasonId=ipl2012&matchNumber=23&callback=callbackMethod
     * Returns:
     *      1. callbackMethod({"photos":[{},{},{}]}); - array of photo objects, in case there are album images which match get params
     *      2. callbackMethod({"error":["Undefined seasonId key", "Undefined callback key"]}); - in case there's a key missing in url params
     *      3. callbackMethod({"notice":"No album matches given parameters"}); - in case there is no album or there are no images associated with an album
     */

    var params = this.getPhotosDataParams();
	this.APICaller.getPhotoAlbums( this.feedMatchPhotoAlbums, this,	params, start );
};

PULSE.CLIENT.CRICKET.Match.prototype.stopPhotosData = function()
{
    var params = this.getPhotosDataParams();
    this.APICaller.stopPhotoAlbumsFeed( params );
};
if (!PULSE) 						{ var PULSE = {}; }
if (!PULSE.CLIENT) 					{ PULSE.CLIENT = {}; }
if (!PULSE.CLIENT.CRICKET) 			{ PULSE.CLIENT.CRICKET = {}; }
if (!PULSE.CLIENT.CRICKET.Match) 	{ PULSE.CLIENT.CRICKET.Match = {}; }

/**
 * Returns the upcoming match model from the perspective of a team
 * So if the team is team1, the opponent is team 2 and vice versa
 */
PULSE.CLIENT.CRICKET.Match.prototype.getScheduleSummaryModelForTeam = function( teamId, dateFormat, timeFormat )
{
	if( !teamId ) return;

	var opponentName,
		model = {},
		matchDate = this.getMatchDate();

	if( this.getMatchState() === 'U' )
	{
		if( this.getTeamId(0) === teamId )
		{
			opponent = {
				fullName: this.getFullName(1),
				shortName: this.getShortName(1),
				abbreviation: this.getTeamAbbr(1)
			};
		}
		else if( this.getTeamId(1) === teamId )
		{
			opponent = {
				fullName: this.getFullName(0),
				shortName: this.getShortName(0),
				abbreviation: this.getTeamAbbr(0)
			};
		}

		if( opponent )
		{
			model = {
				matchId: this.matchId,
				matchLink: this.getMatchLink(),
				previewLink: this.getPreviewLink(),

				matchDate: matchDate,
				utcTime: PULSE.CLIENT.DateUtil.getUtcTime( matchDate ),
				formattedMatchDate: this.getFormattedMatchDate( dateFormat ),
				formattedMatchTime: {
					GMT: this.getFormattedMatchTime( timeFormat, 0 ),
					IST: this.getFormattedMatchTime( timeFormat, +5.5 )
				},

				matchDescription: this.getMatchDescription(),

				venue: {
					name: this.getVenueShortName(),
					city: this.getVenueCity()
				},

				opponent: opponent
			};
		}
	}

	return model;
};

/**
 * Returns the complete match model from the perspective of a team
 * So if the team is team1, the opponent is team 2 and vice versa
 * Possible outcome strings in this scenario:
 *
 *		team1fullName + " beat " + team2fullName + " by 7 wickets"
 *		team1fullName + " lost to " + team2fullName + " by 7 wickets"
 *		team1fullName + " tied with " + team2fullName
 */
PULSE.CLIENT.CRICKET.Match.prototype.getResultsSummaryModelForTeam = function( teamId, dateFormat )
{
	if( !teamId ) return;

	var that = this,
		model;

	if( this.getMatchState() === 'C' )
	{
		model = {
			matchId: this.matchId,
			matchLink: this.getMatchLink(),
			reportLink: this.getReportLink(),
			highlightsLink: this.getHighlightsLink(),

			matchSummary: this.getTeamSpecificOutcomeString( teamId ),
			venue: {
				name: this.getVenueShortName(),
				city: this.getVenueCity()
			}
		};
	}

	return model;
};

/**
 * Returns an object covering match details and team details based on either the schedule or the scoring file
 * For more info, check out matchSchedule2.js and scoring.js in Tipsy3 spec
 * This model will return TBD instead of team names if the team hasn't been set etc.
 *
 * This model does not return batsmen or bowler models; see getBatsmanModel or getBowlerModel instead
 */
PULSE.CLIENT.CRICKET.Match.prototype.getFullModel = function( dateFormat, timeFormat )
{
	var that = this;

	var matchDate 	= this.getMatchDate(),
		matchState  = this.getMatchState();


	var	model = {
		matchLink: this.getMatchLink(),
		previewLink: this.getPreviewLink(),
		reportLink: this.getReportLink(),
        reportThumb: this.getReportThumb(),
		highlightsLink: this.getHighlightsLink(),
        highlightsThumb: this.getHighlightsThumb(),
        highlightsId: this.getHighlightsId(),
        momId: this.getManOfTheMatchId(),
        momThumb: this.getManOfTheMatchThumb(),
		photostreamLink: this.getPhotostreamLink(),
		ticketsLink: this.getTicketsLink(),
		calendarLink: this.getCalendarLink(),
        hashtag: this.getHashtag(),

		matchType: this.getMatchType(),
		isLimitedOvers: this.isLimitedOvers(),
		matchState: matchState,
		live: this.isMatchLive(),
		inningsBreak: this.isInInningsBreak(),
        winnerIndex: this.getWinnerIndex(),
        archive: this.tournament.archive === true,

		matchSummary: this.getMatchSummary(),
		matchDate: matchDate,
		formattedMatchDate: this.getFormattedMatchDate( dateFormat ),
		formattedTimeZoneDate: this.getFormattedTimeZoneDate( dateFormat ),
		formattedTimeZoneTime: this.getFormattedTimeZoneTime( dateFormat ),
		formattedMatchTime: {
			GMT: this.getFormattedMatchTime( timeFormat, 0 ),
			BST: this.getFormattedMatchTime( timeFormat, +1 ),
			IST: this.getFormattedMatchTime( timeFormat, +5.5 ),
			AWST: this.getFormattedMatchTime( timeFormat, +8 ),
			ACST: this.getFormattedMatchTime( timeFormat, +9.5 ),
			AEST: this.getFormattedMatchTime( timeFormat, +10.5 ),
			NZST: this.getFormattedMatchTime( timeFormat, +12 ),
            NZDT: this.getFormattedMatchTime( timeFormat, +13 )
		},
		dayNight: this.getDayNight(),
		matchId: that.matchId,
		groupName: this.getGroupName(),
		stageName: this.getStageName(),
		matchDescription: this.getMatchDescription(),
		tournamentLabel: this.getTournamentLabel(),
		tournamentId: this.getTournamentId(),
		tournamentName: this.getTournamentName(),
		venue: this.getVenue(),
		venueUrl: this.getVenueUrl(),

		currentScore: this.getCurrentScore(),
		requiredRunRate: this.getRequiredRunRate(),
		dl: this.getDLCondition(),

		team1link: this.getTeamLink(0),
		team1id: this.getTeamId(0),
		team1innings: this.getTeamInnings(0),
		team1inningsRaw: this.getRawTeamInnings(0),
		team1overProgress: this.getOverProgress(0),
		team1overProgressArray: this.getOverProgressArray(0),
		team1batting: this.teamIsBatting(0),
		team1bowling: this.teamIsBowling(0),
		team1abbr: this.getTeamAbbr(0),
		team1fullName: this.getFullName(0),
		team1shortName: this.getShortName(0),
		team1runRate: this.getTeamRunRate(0),
		team1yetToBat: this.getYetToBat(0),
		team1won: this.getTeamWon(0),
		team1Link: this.getTeamLink(0),
		team1battingFirst: this.getTeamBatFirst( 0 ),

		team2link: this.getTeamLink(1),
		team2id: this.getTeamId(1),
		team2innings: this.getTeamInnings(1),
		team2inningsRaw: this.getRawTeamInnings(1),
		team2overProgress: this.getOverProgress(1),
		team2overProgressArray: this.getOverProgressArray(1),
		team2batting: this.teamIsBatting(1),
		team2bowling: this.teamIsBowling(1),
		team2abbr: this.getTeamAbbr(1),
		team2fullName: this.getFullName(1),
		team2shortName: this.getShortName(1),
		team2runRate: this.getTeamRunRate(1),
		team2yetToBat: this.getYetToBat(1),
		team2won: this.getTeamWon(1),
		team2Link: this.getTeamLink(1),
		team2battingFirst: this.getTeamBatFirst( 1 )

	};

	return model;
};
if( !PULSE ) { var PULSE = {}; }
if( !PULSE.CLIENT ) { PULSE.CLIENT = {}; }
if( !PULSE.CLIENT.CRICKET ) { PULSE.CLIENT.CRICKET = {}; }
if( !PULSE.CLIENT.CRICKET.Match ) { PULSE.CLIENT.CRICKET.Match = {}; }

/**
 * 	MATCH MEDIA MODELS
 */
PULSE.CLIENT.CRICKET.Match.prototype.getModalTheatre = function()
{
	if( !this.photosData )
	{
		return;
	}
	var model = _.omit( this.photosData, 'images' );

	return model;
};

PULSE.CLIENT.CRICKET.Match.prototype.getMatchPhotosModel = function( limit )
{
	if( !this.photosData || !this.photosData.photos )
	{
		return { photos: [] };
	}
	var model = {},
		array = [],
		totalPhotos = this.photosData.photos.length,
		iLimit = limit ? Math.min( limit, totalPhotos ) : totalPhotos;

	for( var i = 0; i < iLimit; i++ )
	{
		var photo = this.photosData.photos[ i ],
            caption = photo.Caption,
			orientation = parseInt( photo.IsPortrait, undefined ) ? 'portrait' : 'landscape',
    		thumb = photo.photoThumbUrl,
    		largeThumb = photo.heroUrl,
            id = photo.Id,
            position = parseInt( photo.Position, undefined ),
            url;

        if( orientation === 'landscape' )
        {
            url = 'http://icc-live.s3.amazonaws.com/cms/media/images/1200x800/' + id + '.jpg';
        }
        else
        {
            url = 'http://icc-live.s3.amazonaws.com/cms/media/images/640x960/' + id + '.jpg';
        }


        // Construct model
		var photoModel = {
            caption: caption,
			orientation: orientation,
			thumb: thumb,
			largeThumb: largeThumb,
			position: position,
            id: id,
            url: url
		};
		array.push( photoModel );
	}
	model.photos = array;

	return model;
};

PULSE.CLIENT.CRICKET.Match.prototype.hasVideos = function()
{
	if( this.videosData && this.videosData.media_list.length )
	{
		return true;
	}
	return false;
};

PULSE.CLIENT.CRICKET.Match.prototype.getMatchVideosModel = function( limit )
{
	if( !this.videosData )
	{
		return { videos: [] };
	}

	var model = {},
		array = [],
		totalVideos = this.videosData.items.length,
		iLimit = limit ? Math.min( limit, totalVideos ) : totalVideos;

	for( var i = 0; i < iLimit; i++ )
	{
		var video = this.videosData.items[i];

        var videoModel = PULSE.CLIENT.makeBrightcoveVideoModel( video );
        array.push( videoModel );
	}

	array.sort( function( a, b ) { return b.publish_date - a.publish_date } );
	model.videos = array;

	return model;
};


PULSE.CLIENT.CRICKET.Match.prototype.getMatchVideoByIdModel = function( id )
{
	if( !this.videosData )
	{
		return {}
	}

	var videos = this.getMatchVideosModel();

	for( var i = 0, length = videos.videos.length; i < length; i++ )
    {

		var video = videos.videos[ i ]
		if( video.id === id )
        {

			return video;
		}
	}
}

PULSE.CLIENT.CRICKET.Match.prototype.getMatchVideosByTagName = function( tag )
{
	var model = this.getMatchVideosModel()
	  , returnArr = []

	for ( var i = 0, length = model.videos.length; i < length; i++ )
    {
		var match = model.videos[ i ];
		if( ~ $.inArray(tag, match.tags ) )
        {
			returnArr.push(match);
		}
	}

	return { videos : returnArr }
}


PULSE.CLIENT.CRICKET.Match.prototype.getMatchVideosByPlayerIdModel = function( id )
{
	return this.getMatchVideosByTagName( 'playerid ' + id )
};
if (!PULSE) 						{ var PULSE = {}; }
if (!PULSE.CLIENT) 					{ PULSE.CLIENT = {}; }
if (!PULSE.CLIENT.CRICKET) 			{ PULSE.CLIENT.CRICKET = {}; }
if (!PULSE.CLIENT.CRICKET.Match) 	{ PULSE.CLIENT.CRICKET.Match = {}; }

PULSE.CLIENT.CRICKET.Match.prototype.onData = function( data, id )
{
	var that = this;
	if( id === this.feedScoring )
	{
		this.scoringData = data;
		var matchInfo 	= data.matchInfo,
			matchState 	= this.getMatchState();

		if( !this.playerLookup && matchInfo.teams && matchInfo.teams.length && matchState === "L" )
		{
			this.playerLookup = PULSE.CLIENT.Util.CreatePlayerLookup( matchInfo.teams );
		}

		// This assumes you would never start a scoring feed for an upcoming match
		if(!this.playerLookup && matchState === 'C' )
		{
			this.playerLookup = PULSE.CLIENT.Util.CreatePlayerLookup( matchInfo.teams );
			// Remove the match from the tournament's list of current live matches
			this.tournament.unregisterMatchAs( 'live', data.matchId.name );
			// Add the match to the tournament's list of complete matches
			this.tournament.registerMatchAs( 'complete', data.matchId.name );
		}

		PULSE.CLIENT.notify( 'scoring/update', {
			success: true,
			matchId: data.matchId.name,
			tournamentName: that.tournament.tournamentName
		} );
	}
	else if( id === this.feedPhotos )
	{
		this.photosData = data[0] ? { photos: data[0].images } : data;
		PULSE.CLIENT.notify( 'match/photos', {
			success: true,
			matchId: this.matchId,
			tournamentName: that.tournament.tournamentName
		} );
	}
	else if( id === this.feedVideo )
	{
		this.videosData = data;
		PULSE.CLIENT.notify( 'match/videos', {
			success: true,
			matchId: this.matchId,
			tournamentName: that.tournament.tournamentName
		} );
	}
    else if( id === this.feedMatchVideo )
    {
        this.videosData = data;
        PULSE.CLIENT.notify( 'match/videos', {
            success: true,
            matchId: this.matchId,
            tournamentName: that.tournament.tournamentName
        } );
    }
	else if( id === this.feedCommentary )
	{
		this.commentaryMeta = data.timestamps;

		PULSE.CLIENT.notify( 'commentary/meta', {
			success: true,
			matchId: this.matchId,
			tournamentName: that.tournament.tournamentName
		} );
	}
	else if( id === this.chunkFeedName )
	{
		this.chunks[ data.fragment ] = data;

		PULSE.CLIENT.notify( 'commentary/chunk', {
			success: true,
			matchId: this.matchId,
			tournamentName: that.tournament.tournamentName,
			data: data
		} );
	}
};
if (!PULSE) 						{ var PULSE = {}; }
if (!PULSE.CLIENT) 					{ PULSE.CLIENT = {}; }
if (!PULSE.CLIENT.CRICKET) 			{ PULSE.CLIENT.CRICKET = {}; }
if (!PULSE.CLIENT.CRICKET.Match) 	{ PULSE.CLIENT.CRICKET.Match = {}; }

PULSE.CLIENT.CRICKET.Match.prototype.onError = function( id )
{
	var that = this;
	if( id === this.feedScoring )
	{
		PULSE.CLIENT.notify( 'scoring/update', { 
			success: false,
			matchId: that.matchId, 
			tournamentName: that.tournament.tournamentName 
		} );
	}
	else if( id === this.feedCommentary )
	{
		PULSE.CLIENT.notify( 'commentary/meta', { 
			success: false,
			matchId: that.matchId, 
			tournamentName: that.tournament.tournamentName 
		} );
	}
	else if( id === this.chunkFeedName )
	{
		PULSE.CLIENT.notify( 'commentary/chunk', {
			success: false,
			matchId: that.matchId, 
			tournamentName: that.tournament.tournamentName 
		} );
	}
	else if( id === this.feedPhotos )
	{
		PULSE.CLIENT.notify( 'match/photos', { 
			success: false,
			matchId: this.matchId, 
			tournamentName: that.tournament.tournamentName 
		} );
	}
	else if( id === this.feedVideo )
	{
		PULSE.CLIENT.notify( 'match/videos', { 
			success: false,
			matchId: this.matchId, 
			tournamentName: that.tournament.tournamentName 
		} );
	}
};
if (!PULSE) 						{ var PULSE = {}; }
if (!PULSE.CLIENT) 					{ PULSE.CLIENT = {}; }
if (!PULSE.CLIENT.CRICKET) 			{ PULSE.CLIENT.CRICKET = {}; }
if (!PULSE.CLIENT.CRICKET.Match) 	{ PULSE.CLIENT.CRICKET.Match = {}; }

/**
 *	Player models
 */

PULSE.CLIENT.CRICKET.Match.prototype.getAwaitingPlayerModel = function( role )
{
	switch( role )
	{
	case 'bowler':
		var label = "Bowler";
		var team = this.getCurrentBowlingTeam();
		break;

	case 'striker':
		var label = "Striker";
		var team = this.getCurrentBattingTeam();
		break;

	case 'nonstriker':
		var label = "Non-Striker";
		var team = this.getCurrentBattingTeam();
		break;
	}

	team = team ? team.team : {};

	var model = {
		playerRole: role,
		role: label,
		teamAbbr: team.abbreviation
	};

	return model;
};

PULSE.CLIENT.CRICKET.Match.prototype.getCurrentBowler = function()
{
	if( !this.scoringData || !this.scoringData.currentState )
	{
		return;
	}

	var bowlerId = this.scoringData.currentState.currentBowler;

	if( bowlerId > 0 )
	{
		var model = this.getBowlerModel( bowlerId );
		return model;
	}
};

PULSE.CLIENT.CRICKET.Match.prototype.getCurrentFacingBatsman = function()
{
	if( !this.scoringData || !this.scoringData.currentState )
	{
		return;
	}

	var data = this.scoringData;

	if( data.currentState.currentBatsmen[0] === data.currentState.facingBatsman )
	{
		var batsmanId = data.currentState.currentBatsmen[0];
	}
	else
	{
		var batsmanId = data.currentState.currentBatsmen[1];
	}

	if( batsmanId === -1 )
	{
		return;
	}

	var model = this.getBatsmanModel( true, batsmanId );
	return model;
};

PULSE.CLIENT.CRICKET.Match.prototype.getCurrentNonFacingBatsman = function()
{
	if( !this.scoringData || !this.scoringData.currentState )
	{
		return;
	}

	var data = this.scoringData;

	if( data.currentState.currentBatsmen[0] === data.currentState.facingBatsman )
	{
		var batsmanId = data.currentState.currentBatsmen[1];
	}
	else
	{
		var batsmanId = data.currentState.currentBatsmen[0];
	}

	if( batsmanId === -1 )
	{
		return;
	}

	var model = this.getBatsmanModel( false, batsmanId );
	return model;
};

PULSE.CLIENT.CRICKET.Match.prototype.getBatsmanModel = function( facing, id )
{
	var stats 		= this.getBattingStats( id ),
		player 		= this.playerLookup[ id ];

    if( !player )
    {
        return {};
    }

	var playerName 	= PULSE.CLIENT.Util.getPlayerNames( player.fullName ),
		team 		= this.getTeamByPlayerId( id ),
		matchType	= this.getMatchType(),
		playerUrl   = this.urlGenerator.getPlayerURL( player.id, player.fullName, team.id, team.fullName);

	team = team || {};


	var model = {
		id: player.id,
		facing: facing,
		fullName: player.fullName,
		firstName: playerName.firstName,
		lastName: playerName.secondName,
		playerUrl: playerUrl,
		runs: stats ? stats.r : "0",
		ballsFaced: stats ? stats.b : "0",
		strikeRate: stats ? stats.sr : "-",
		fours: stats ? stats['4s'] : "0",
		sixes: stats ? stats['6s'] : "0",
		status: stats ? 'NOT OUT' : '',
		team: team,
		matchType: matchType
	}

	if (stats && stats.mod) {
		model.status = stats.mod.text
	}

	return model;
};

PULSE.CLIENT.CRICKET.Match.prototype.getBowlerModel = function( id )
{
	var stats 		= this.getBowlingStats( id ),
		player 		= this.playerLookup[ id ];

    if( !player )
    {
        return {};
    }

	var playerName 	= PULSE.CLIENT.Util.getPlayerNames( player.fullName ),
		team 		= this.getTeamByPlayerId( id ),
		matchType	= this.getMatchType(),
		playerUrl   = this.urlGenerator.getPlayerURL( player.id, player.fullName, team.id, team.fullName);

	team = team || {};

	var model = {
		id: player.id,
		fullName: player.fullName,
		firstName: playerName.firstName,
		lastName: playerName.secondName,
		playerUrl: playerUrl,
		wickets: stats ? stats.w : "0",
		runsConceded: stats ? stats.r : "0",
		overs: stats ? stats.ov : "0",
		dots: stats ? stats.d : "0",
		maidens: stats ? stats.maid : "0",
		economy: stats ? stats.e : "-",
		team: team,
		matchType: matchType
	}

	return model;
};
if (!PULSE)                         { var PULSE = {}; }
if (!PULSE.CLIENT)                     { PULSE.CLIENT = {}; }
if (!PULSE.CLIENT.CRICKET)             { PULSE.CLIENT.CRICKET = {}; }
if (!PULSE.CLIENT.CRICKET.Match)     { PULSE.CLIENT.CRICKET.Match = {}; }

PULSE.CLIENT.CRICKET.Match.prototype.getScorecardModel = function()
{
    if( !this.scoringData )
    {
        return;
    }

    var scorecardModel = {},
        inningsModels = [];

        var battingOrder = this.scoringData.matchInfo.battingOrder,
            cii         = this.scoringData.currentState.currentInningsIndex;

    if( this.scoringData.innings)
    {

        for( var i = 0, iLimit = this.scoringData.innings.length; i < iLimit; i++ )
        {

            var inning = this.scoringData.innings[i],
                teamIndex    = battingOrder[i];

            var score = PULSE.CLIENT.CRICKET.Utils.getInningsScore( inning.scorecard.runs, inning.scorecard.wkts, inning.allOut, inning.declared, false );

            var overProgress = inning.overProgress;

            var inningModel = {

                teamFullName : this.getFullName(teamIndex),
                teamAbbr : this.getTeamAbbr(teamIndex),

                currentScore : inning.scorecard.runs,
                wickets : inning.scorecard.wkts,
                allOut : inning.scorecard.allOut,
                declared : inning.declared,
                overProgress : overProgress,
                runRate : inning.runRate,

                batsmen : this.getBatsmen(i),
                bowlers : this.getBowlers(i),

                extras : this.getExtras(i),
                fow : this.getFOW(i)
            };

            inningsModels.push( inningModel );
        }

    }

    var matchType = this.getMatchType();
    scorecardModel.limited = $.inArray( matchType, [ "TEST", "FIRST_CLASS" ] ) === -1;

    scorecardModel.innings = inningsModels;

    return scorecardModel;
};

PULSE.CLIENT.CRICKET.Match.prototype.getBatsmen = function( inningIndex )
{
    if( !this.scoringData )
    {
        return;
    }

    var batsmen = [];

    if( this.scoringData.innings && this.scoringData.innings[inningIndex] )
    {
        var stats = this.scoringData.innings[inningIndex].scorecard.battingStats;

        for (var i=0; i < stats.length; i++) {

            var batsman = this.getBatsmanModel(true, stats[i].playerId);

            var playerStats = stats[i];

            var model =  {
                id: batsman.id,
                fullName: batsman.fullName,
                firstName: batsman.firstName,
                lastName: batsman.secondName || batsman.lastName,
                runs: playerStats ? playerStats.r : "0",
                ballsFaced: playerStats ? playerStats.b : "0",
                strikeRate: playerStats ? playerStats.sr || "0.00" : "0.00",
                fours: playerStats ? playerStats['4s'] : "0",
                sixes: playerStats ? playerStats['6s'] : "0",
                status: playerStats.mod ? playerStats.mod.text : 'NOT OUT',
                url : batsman.playerUrl || undefined
            }

            batsmen.push(model);
        }
    }


    return batsmen;
};

PULSE.CLIENT.CRICKET.Match.prototype.getBowlers = function( inningIndex )
{
    if( !this.scoringData )
    {
        return;
    }

    var bowlers = [];

    var stats = this.scoringData.innings[inningIndex].scorecard.bowlingStats;

    if( this.scoringData.innings && this.scoringData.innings[inningIndex] )
    {
        for (var i=0; i < stats.length; i++) {

            var bowler = this.getBowlerModel(stats[i].playerId);
            var playerStats = stats[i];

            var model = {
                id: bowler.id,
                fullName: bowler.fullName,
                firstName: bowler.firstName,
                lastName: bowler.secondName || bowler.lastName,
                url: bowler.playerUrl || undefined,
                wickets: playerStats ? playerStats.w : "0",
                runsConceded: playerStats ? playerStats.r : "0",
                overs: playerStats ? playerStats.ov : "0",
                dots: playerStats ? playerStats.d : "0",
                maidens: playerStats ? playerStats.maid : "0",
                economy: playerStats ? playerStats.e : "-"
            }


            bowlers.push(model);
        }
    }

    return bowlers;
};

PULSE.CLIENT.CRICKET.Match.prototype.getExtras = function( inningIndex )
{
    if( !this.scoringData )
    {
        return;
    }

    var stats = this.scoringData.innings[inningIndex].scorecard.extras,
        extras = {},
        total = 0,
        statTypes = {
            noBallRuns: 'nb',
            wideRuns: 'w',
            byeRuns: 'b',
            legByeRuns: 'lb',
            penaltyRuns: 'pen'
          };

    for (var type in statTypes) {

        if (typeof stats[type] !== 'undefined') {

            var name = statTypes[type]
            extras[name] = stats[type]

            total = (total + stats[type])
        }
    }

    extras.total = (total > 0 ? total : '')
    return extras;
};

PULSE.CLIENT.CRICKET.Match.prototype.getFOW = function( inningIndex )
{
    if( !this.scoringData || !this.scoringData.innings ||
        !this.scoringData.innings[ inningIndex ] || !this.scoringData.innings[ inningIndex ] )
    {
        return;
    }

    var stats = this.scoringData.innings[ inningIndex ].scorecard.fow;

    var wickets = [];

    for( var i = 0; i < stats.length; i++ )
    {
        var fow         = stats[ i ],
            player      = this.playerLookup[ fow.playerId ];

        if( !player )
        {
            continue;
        }

        var playerName  = PULSE.CLIENT.Util.getPlayerNames( player.fullName ),
            score = fow.w + '-' + fow.r,
            over = ( parseInt( fow.bp.over, 10 ) - 1) + '.' + ( fow.bp.ball || '1' ); // scoring file bug fix (DMS-38)

        var model = {
            score : score,
            player: playerName.secondName ? playerName.secondName : player.fullName,
            id: fow.playerId,
            over: over
        }

        wickets.push( model );
    }

    return wickets;
};


/**
 * Gets the batting stats available in the scoring.js scorecard
 * @params id - the player id
 * @return the batting stats object for that player
 */
PULSE.CLIENT.CRICKET.Match.prototype.getBattingStats = function( id )
{

    if( !this.scoringData.innings || !this.scoringData.innings[ this.scoringData.innings.length - 1 ].scorecard ) return;

    var battingStats = this.scoringData.innings[ this.scoringData.innings.length - 1 ].scorecard.battingStats,
        totalBatsmen = battingStats.length,
        i             = totalBatsmen;

    while( i-- )
    {

        if( battingStats[i].playerId == id )
        {
            return battingStats[i];
        }
    }
};

/**
 * Gets the bowling stats available in the scoring.js scorecard
 * @params id - the player id
 * @return the bowling stats object for that player
 */
PULSE.CLIENT.CRICKET.Match.prototype.getBowlingStats = function( id )
{
    if( !this.scoringData.innings || !this.scoringData.innings[ this.scoringData.innings.length - 1 ].scorecard ) return;

    var bowlingStats = this.scoringData.innings[ this.scoringData.innings.length - 1 ].scorecard.bowlingStats,
        totalBowlers = bowlingStats.length,
        i             = totalBowlers;

    while( i-- )
    {
        if( bowlingStats[i].playerId == id )
        {
            return bowlingStats[i];
        }
    }
};
if (!PULSE) 						{ var PULSE = {}; }
if (!PULSE.CLIENT) 					{ PULSE.CLIENT = {}; }
if (!PULSE.CLIENT.CRICKET) 			{ PULSE.CLIENT.CRICKET = {}; }
if (!PULSE.CLIENT.CRICKET.Match) 	{ PULSE.CLIENT.CRICKET.Match = {}; }

// Get playing XI for one of the match's teams, if they have been set
PULSE.CLIENT.CRICKET.Match.prototype.getPlayingXI = function( teamIndex )
{
	if( this.scoringData && this.scoringData.matchInfo && this.scoringData.matchInfo.teams )
	{
		var model = {};
		var team = this.scoringData.matchInfo.teams[ teamIndex ];
		var players = team.players;

		if( !players )
		{
			return;
		}


		model.players = [];
		model.team = team.team;
		model.team.url = this.urlGenerator.getTeamURL( team.team.id, team.team.fullName );

		for( var i = 0, iLimit = players.length; i < iLimit; i++ )
		{
			var player = players[i],
				url = this.urlGenerator.getPlayerURL( player.id, player.fullName, team.team.id, team.team.fullName );

            var stats = {};

            if( this.tournament.teamTournamentStatsData[ team.team.id ] )
            {
                var statsArray = this.tournament.teamTournamentStatsData[ team.team.id ].playersStats;
                for( var j = 0, jLimit = statsArray.length; j < jLimit; j++ )
                {
                    if( statsArray[j].stats )
                    {
                        for( var x = 0, xLimit = statsArray[j].stats.length; x < xLimit; x++ )
                        {
                            if( ( !this.tournament.matchTypes || !this.tournament.matchTypes.length ||
                                statsArray[j].stats[x].matchType === this.tournament.matchTypes[ 0 ] ) &&
                                statsArray[j].player.id === player.id )
                            {
                                stats = statsArray[j].stats[x];
                            }
                        }
                    }
                }
            }

			var playerName = PULSE.CLIENT.Util.getPlayerNames( player.fullName );
			var playerModel = {
					id: player.id,
					url: url,
					fullName: player.fullName,
					shortName: player.shortName,
					firstName: playerName.firstName,
					lastName: playerName.secondName,
					nationality : player.nationality,
					wicketKeeper: team.wicketKeeper ? team.wicketKeeper.id === player.id : "",
					captain: team.captain ? team.captain.id === player.id : "",
                    stats: stats
			};
			model.players.push( playerModel );
		}
		return model;
	}

	return;
};

PULSE.CLIENT.CRICKET.Match.prototype.getCaptain = function( teamIndex )
{
    if( this.scoringData && this.scoringData.matchInfo && this.scoringData.matchInfo.teams )
    {
        var team = this.scoringData.matchInfo.teams[ teamIndex ],
            captain = team.captain;

        if( captain )
        {
            var captainNames = PULSE.CLIENT.Util.getPlayerNames( captain.fullName ),
                url = this.urlGenerator.getPlayerURL( captain.id, captain.fullName, team.team.id, team.team.fullName ),
                captainModel = {
                    id: captain.id,
                    url: url,
                    fullName: captain.fullName,
                    shortName: captain.shortName,
                    firstName: captainNames.firstName,
                    lastName: captainNames.secondName,
                    nationality : captain.nationality,
                    wicketKeeper: team.wicketKeeper ? team.wicketKeeper.id === captain.id : "",
                    captain: captain.id
                };

            return captainModel;
        }
    }

    return;
};

PULSE.CLIENT.CRICKET.Match.prototype.getTeam = function( teamIndex )
{
	var teamNumber = 'team' + (teamIndex + 1);

    if (this.scoringData && this.scoringData.matchInfo.teams && this.scoringData.matchInfo.teams[teamIndex])
    {
        return this.scoringData.matchInfo.teams[teamIndex].team;
    }
    else if (this.scheduleData && this.scheduleData[teamNumber])
    {
        return this.scheduleData[teamNumber].team;
    }
};

PULSE.CLIENT.CRICKET.Match.prototype.getSquad = function( teamIndex )
{
	var teamId = this.getTeamId( teamIndex );
	var model = this.tournament.getSquadWithCaptainModel( teamId );

	return model;
};

PULSE.CLIENT.CRICKET.Match.prototype.getTeamByPlayerId = function( id )
{
	if( this.scoringData && this.scoringData.matchInfo && this.scoringData.matchInfo.teams )
	{
		for( var i = 0, iLimit = this.scoringData.matchInfo.teams.length; i < iLimit; i++ )
		{
			var matchTeam = this.scoringData.matchInfo.teams[i];
			for( var j = 0, jLimit = matchTeam.players.length; j < jLimit; j++ )
			{
				var player = matchTeam.players[j];
				if( player.id == id )
				{
					return matchTeam.team;
				}
			}
		}
	}

	if( this.playerLookup[ id ] )
	{
		return this.playerLookup[ id ].team;
	}
};
if (!PULSE)                         { var PULSE = {}; }
if (!PULSE.CLIENT)                  { PULSE.CLIENT = {}; }
if (!PULSE.CLIENT.CRICKET)          { PULSE.CLIENT.CRICKET = {}; }
if (!PULSE.CLIENT.CRICKET.Match)    { PULSE.CLIENT.CRICKET.Match = {}; }

/**
 * Calls to get team stats if they have not already been received.
 */
PULSE.CLIENT.CRICKET.Match.prototype.getTeamTournamentStatsData = function()
{
    var team1id = this.getTeamId(0);
    var team2id = this.getTeamId(1);

    if( !this.team1statsRequested && team1id && team1id > -1 )
    {
        this.tournament.getTeamStatsData( team1id, true );
        this.team1statsRequested = true;
    }

    if( !this.team2statsRequested && team1id && team1id > -1 )
    {
        this.tournament.getTeamStatsData( team2id, true );
        this.team2statsRequested = true;
    }
};

/**
 * Updates stats for the current match upon receiving scoring data.
 */
PULSE.CLIENT.CRICKET.Match.prototype.getTeamMatchStats = function()
{
    var teams = this.scoringData.matchInfo.teams;

    var innings = this.scoringData.innings;

    if( innings && innings.length )
    {
        for( var i = 0, iLimit = innings.length; i < iLimit; i++ )
        {
            var inns = innings[i];
            if( inns.scorecard && inns.scorecard.battingStats )
            {
                var stats = inns.scorecard.battingStats;
                this.addMatchStatsToPlayerLookup( stats, "bat", i );
            }

            if( inns.scorecard && inns.scorecard.bowlingStats )
            {
                var stats = inns.scorecard.bowlingStats;
                this.addMatchStatsToPlayerLookup( stats, "bowl", i );
            }
        }
    }
};

/**
 * Returns the best bowling figures for innings by calling getTopStatsForInnings
 *   with wickets as primary sort and runs as secondary sort (runs/wickets)
 * @param  {Number} inningsIndex Index of innings to get stats for
 * @param  {Number} limit        Length of the return stats array
 * @return {Array}               Sorted stats array
 */
PULSE.CLIENT.CRICKET.Match.prototype.getBestBowlingFiguresForInnings = function( inningsIndex, limit )
{
    var stats = this.getTopStatsForInnings(
                    inningsIndex,
                    limit,
                    'wickets',
                    function( a, b ) { return ( b.runsConceded - a.runsConceded ) * -1 }
                );

    return stats;
};

/**
 * Returns the top players for a given stat type in a given innings
 *   - Does not work for 'lower is better' stat types...
 *   - Defaults to top runs scorers if no stat is supplied
 *
 * @param  {Number} inningsIndex Index of innings to get stats for
 * @param  {Number} limit        Length of the return stats array
 * @param  {String} statType     Primary stat to sort (e.g. 'runs'/'wickets'/'sixes')
 * @param  {Function} secondarySort Optional function for providing secondary sort criterea
 * @return {Array}              Sorted stats array
 */
PULSE.CLIENT.CRICKET.Match.prototype.getTopStatsForInnings = function( inningsIndex, limit, statType, secondarySort )
{
    var innings = this.getScorecardModel().innings[ inningsIndex ],
        battingStatsTypes = [ 'runs', 'ballsFaced', 'strikeRate', 'fours', 'sixes' ],
        bowlingStatsTypes = [ 'wickets', 'economy', 'dots', 'maidens' ];
        players = [],
        type = statType || 'runs';

    // Get appropriate stats array
    if( _.indexOf( battingStatsTypes, type ) > -1 )
    {
        players = innings.batsmen;
    }
    else if( _.indexOf( bowlingStatsTypes, type ) > -1 )
    {
        players = innings.bowlers;
    }

    // Sort stats
    players = players.sort( function( a, b )
    {
        var diff = parseInt( a[ type ] ) - parseInt( b[ type ] );

        if( diff < 0 )
        {
            return 1;
        }
        else if( diff > 0 )
        {
            return -1;
        }
        // Only use secondary sort function if it exists and returns a number
        else if( diff === 0 && secondarySort && !isNaN( secondarySort( a, b ) ) )
        {
            return secondarySort( a, b );
        }
        return 0;
    } );

    // Limit stats
    players = limit ? players.slice( 0, limit ) : players;

    return players;
};

/**
 * Adds match stats for each player to the match playerLookup.
 *
 * @param {array} stats Stats array.
 * @param {string} type Stat type string?.
 * @param {number} i    Index of innings.
 */
PULSE.CLIENT.CRICKET.Match.prototype.addMatchStatsToPlayerLookup = function( stats, type, i )
{
    for( var j = 0, jLimit = stats.length; j < jLimit; j++ )
    {
        var playerStats = stats[j];
        if( !this.playerLookup[playerStats.playerId] )
        {
            this.playerLookup[playerStats.playerId] = {};
        }

        var player = this.playerLookup[playerStats.playerId];

        if( !player.matchStats )
        {
            player.matchStats = {
                innings: []
            };
        }

        if( !player.matchStats.innings[i] )
        {
            player.matchStats.innings[i] = {};
        }

        player.matchStats.innings[i] = playerStats;
        player.matchStats.innings[i].type = type;
    }
};

/**
 * Adds tournament scope stats for a player to the match playerLookup
 * @param  {number} teamId Unique team id.
 */
PULSE.CLIENT.CRICKET.Match.prototype.addTournamentStatsToPlayerLookup = function( teamId )
{
    var teamStats = this.tournament.teamTournamentStatsData[teamId].playersStats;
    if( teamStats )
    {
        for( var i = 0, iLimit = teamStats.length; i < iLimit; i++ )
        {
            var player = teamStats[i].player;

            // Create player objects if they don't exist
            if( !this.playerLookup[player.id] ) this.playerLookup[player.id] = player;
            if( !this.playerLookup[player.id].fullName ) this.playerLookup[player.id] = player;
            this.playerLookup[player.id].team = this.tournament.teamTournamentStatsData[teamId].team;

            // Add stats objects if stats for this
            if( teamStats[i].stats )
            {
                if( !this.playerLookup[player.id].stats ) this.playerLookup[player.id].stats = {};

                for( var j = 0, jLimit = teamStats[i].stats.length; j < jLimit; j++ )
                {
                    var stats = teamStats[i].stats[j];
                    this.playerLookup[player.id].stats[stats.matchType] = stats;
                }
            }
        }
    }
};
if (!PULSE) 						{ var PULSE = {}; }
if (!PULSE.CLIENT) 					{ PULSE.CLIENT = {}; }
if (!PULSE.CLIENT.CRICKET) 			{ PULSE.CLIENT.CRICKET = {}; }
if (!PULSE.CLIENT.CRICKET.Match) 	{ PULSE.CLIENT.CRICKET.Match = {}; }

/**
 * This is required for running commentary in old style match centres (pre CWC 2015)
 */

PULSE.CLIENT.CRICKET.Match.Commentary = function( match, container, templates )
{
	this.match 		= match;
	this.$container = $( container );
    this.customer   = this.match.customer;
	this.templates	= {
		eov: templates.eov,
		auto: templates.auto,
		manual: templates.manual
	};

	this.timestamps = [];

	this.setSubscriptions();

	this.match.startCommentaryFeed( this.customer );
};

PULSE.CLIENT.CRICKET.Match.Commentary.prototype.setSubscriptions = function()
{
	var that = this;
	$('body').on( 'commentary/meta', function( e, params ) {
		if( params.success && params.matchId === that.match.matchId )
		{
			that.refreshCommentary();
		}
	} );

	$('body').on( 'commentary/chunk', function( e, params ) {
		if( params.success && params.matchId === that.match.matchId )
		{
			that.updateFragment( params.data );
		}
	} );
};

PULSE.CLIENT.CRICKET.Match.Commentary.prototype.refreshCommentary = function()
{
    // refreshCommentary's sometimes called externally, so make sure there's data first
    if( !this.match.commentaryMeta )
    {
        return;
    }

	// get missing/new/updated chunks
	var neededChunks = this.chunkDifference();

	// store updated commentary meta
	this.timestamps = this.match.commentaryMeta;

	// request each needed chunk
	for( var i = neededChunks.length - 1; i >= 0; i-- )
	{
		this.match.getCommentarySegment( neededChunks[i] + 1, true, { customer: this.customer } );
	}
};

// compare new meta with existing meta
PULSE.CLIENT.CRICKET.Match.Commentary.prototype.chunkDifference = function()
{
	var chunks 		= [],
		chunksToAdd = [];

	for( var i = 0; i < this.timestamps.length; i++ )
    {
        if( this.match.commentaryMeta[i] !== this.timestamps[i] )
        {
            chunks.push( i );
        }
    }

    if( this.match.commentaryMeta.length > this.timestamps.length )
    {
        for( var i = this.timestamps.length; i < this.match.commentaryMeta.length; i++ )
        {
            chunks.push( i );
        }
    }

    return chunks;
};

PULSE.CLIENT.CRICKET.Match.Commentary.prototype.updateFragment = function( data )
{
    if( data.fragment )
    {
        var $chunk = $( '#' + this.match.matchId + 'chunk' + data.fragment );

        // Check to see if the chunk already exists.
        if ( $chunk.length == 0 )
        {
            // Create chunk that we want
            $chunk = $('<div>').attr( 'id', this.match.matchId + 'chunk' + data.fragment );

            // Add to the begining of our content
            this.$container.prepend( $chunk );

            var $previousChunk = $chunk;

            // Check that all previous chunks also exist, create them if not
            for ( var i = data.fragment - 1; i > 0; i-- )
            {
                var $oldChunk = $('#' + this.match.matchId + 'chunk' + i );
                if ( $oldChunk.length == 0 )
                {
                    $oldChunk = $('<div>').attr( 'id', this.match.matchId + 'chunk' + i );
                    $oldChunk.insertAfter( $previousChunk );
                    $previousChunk = $oldChunk;
                }
                else
                {
                    break;
                }
            }
        }

        this.renderChunk( $chunk, data.commentaries );
    }
};

PULSE.CLIENT.CRICKET.Match.Commentary.prototype.renderChunk = function( $chunk, commentaries )
{
    $chunk.empty();

    for( var i = commentaries.length - 1; i >= 0; i-- )
    {
        var commentary = commentaries[i];
        var $entry = null;
        var type = commentary.type;
        if ( type === 'Eov' )
        {
            $entry = this.getEndOfOverCommentary( commentary );
        }
        else if ( type === 'Auto' )
        {
            $entry = this.getAutoCommentary( commentary );
        }
        else
        {
            $entry = this.getStandardCommentary( commentary );
        }

        $chunk.append( $entry );
    }
};

// returns the DOM object for the end-of-over commentary
PULSE.CLIENT.CRICKET.Match.Commentary.prototype.getEndOfOverCommentary = function( commentary )
{
        var $comm = $('<div class="commentaryContainer">');

        // Put the data through the template.
        PULSE.CLIENT.Template.fetch( this.templates.eov, function( commentaryTemplate )
        {
            var html = commentaryTemplate( commentary );

            $comm.html( html );
        } );

    return $comm;
};

// returns the DOM object for the automatic commentary
PULSE.CLIENT.CRICKET.Match.Commentary.prototype.getAutoCommentary = function( commentary )
{
    var $comm = $('<div class="commentaryContainer">');

    var haveBallSpeed = commentary.autoText.indexOf( "%SPEED%" );

    // If we have a link to show the traj
    if( haveBallSpeed !== -1 )
    {
        // Convert speed to km/h
        var ballSpeed = commentary.speed * 3.6;
        commentary.autoText = commentary.autoText.replace( /%SPEED%/, ballSpeed.toFixed( 1 ) + ' km/h' );
    }

    var gender = this.match.getTeamType(0);
    if( gender === 'w' )
    {
        commentary.autoText = commentary.autoText.replace( /(\W)he(\W)/, '$1she$2' );
        commentary.autoText = commentary.autoText.replace( /(\W)He(\W)/, '$1She$2' );
    }

    // Put the data through the template.
    PULSE.CLIENT.Template.fetch( this.templates.auto, function( commentaryTemplate )
    {
        var html = commentaryTemplate( commentary );

        $comm.html( html );
    } );

    return $comm;
};

// returns the DOM object for the manual commentary
PULSE.CLIENT.CRICKET.Match.Commentary.prototype.getStandardCommentary = function( commentary )
{
    var $comm = $('<div class="commentaryContainer">');

        // Put the data through the template.
        PULSE.CLIENT.Template.fetch( this.templates.manual, function( commentaryTemplate )
        {
            var html = commentaryTemplate( commentary );

            $comm.html( html );
        } );

    return $comm;
};

PULSE.CLIENT.CRICKET.Match.Commentary.prototype.activate = function()
{
    this.active = true;
};

PULSE.CLIENT.CRICKET.Match.Commentary.prototype.deactivate = function()
{
    this.active = false;
};
if (!PULSE) 				{ var PULSE = {}; }
if (!PULSE.CLIENT) 			{ PULSE.CLIENT = {}; }
if (!PULSE.CLIENT.CRICKET) 	{ PULSE.CLIENT.CRICKET = {}; }


PULSE.CLIENT.CRICKET.PlayerRankingsModels = function()
{
    this.dm = PULSE.CLIENT.getDataManager();
    this.tournamentUrlGenerator = PULSE.CLIENT.CRICKET.getUrlGenerator();
    this.apiCaller = PULSE.CLIENT.CRICKET.getAPICaller();

    // the player rankings data model
    this.data = {
        men: {
            batting: {
                TEST:   undefined,
                ODI:    undefined,
                T20:    undefined
            },
            bowling: {
                TEST:   undefined,
                ODI:    undefined,
                T20:    undefined
            }
        },
        women: {
            batting: {
                WOMEN_TEST: undefined,
                WOMEN_ODI:  undefined,
                WOMEN_T20:  undefined
            },
            bowling: {
                WOMEN_TEST: undefined,
                WOMEN_ODI:  undefined,
                WOMEN_T20:  undefined
            }
        }
    };

    this.lastUpdated = {
        men: {
            batting: {
                TEST:   undefined,
                ODI:    undefined,
                T20:    undefined
            },
            bowling: {
                TEST:   undefined,
                ODI:    undefined,
                T20:    undefined
            }
        },
        women: {
            batting: {
                WOMEN_TEST: undefined,
                WOMEN_ODI:  undefined,
                WOMEN_T20:  undefined
            },
            bowling: {
                WOMEN_TEST: undefined,
                WOMEN_ODI:  undefined,
                WOMEN_T20:  undefined
            }
        }
    };

    this.bowlingStyles =
    {
        'RF'    : 'Right Arm Fast',
        'RFM'   : 'Right Arm Fast Medium',
        'RMF'   : 'Right Arm Medium Fast',
        'RM'    : 'Right Arm Medium',
        'RSM'   : 'Right Arm Slow Medium',

        'ROB'   : 'Right Arm Off Break',
        'RLB'   : 'Right Arm Leg Break',

        'LF'    : 'Left Arm Fast',
        'LFM'   : 'Left Arm Fast Medium',
        'LMF'   : 'Left Arm Medium Fast',
        'LM'    : 'Left Arm Medium',

        'LSL'   : 'Left Arm Slow',
        'LCH'   : 'Left Arm Wrist Spin'
    }

    this.battingStyles =
    {
        'RHB'   : 'Right Hand Bat',
        'LHB'   : 'Left Hand Bat'
    }


    this.playersData = {};
};


PULSE.CLIENT.CRICKET.PlayerRankingsModels.prototype.getPlayersListData = function( start )
{
    if (this.iccPlayerListData)
    {
        PULSE.CLIENT.notify('iccPlayerList/update', { success: true } );
        return;
    }

    this.playersListId = 'playersList';
    this.apiCaller.getRankingsPlayersList( this.playersListId , [ this ], start );
}

PULSE.CLIENT.CRICKET.PlayerRankingsModels.prototype.getPlayerDataById = function(id, scope, start)
{
    this.playerId = 'playerRankingsData';
    this.apiCaller.getPlayerRankingsById( id, scope, this.playerId, [this], start)
}

PULSE.CLIENT.CRICKET.PlayerRankingsModels.prototype.getTopPlayerRankingsData = function( start )
{
    if( !this.topPlayerRankingsFeedLoaded )
    {
      	this.feedTopPlayerRankings = 'topRankings';
    	this.topPlayerRankingsUrl = this.tournamentUrlGenerator.makeICCDataUrl('top-player-rankings');
        this.topPlayerRankingsInterval = 50;
      	this.topPlayerRankingsCallback = 'onTopPlayerRankings';

        this.dm.addFeed( this.feedTopPlayerRankings, this.topPlayerRankingsUrl, this.topPlayerRankingsInterval, this.topPlayerRankingsCallback, [this] );

        this.topPlayerRankingsFeedLoaded = true;
    }

    if( start && this.topPlayerRankingsUrl )
    {
        this.dm.start( this.topPlayerRankingsUrl );
    }
};

PULSE.CLIENT.CRICKET.PlayerRankingsModels.prototype.stopTopPlayerRankingsFeed = function()
{
    this.dm.stop( this.topPlayerRankingsUrl );
};


PULSE.CLIENT.CRICKET.PlayerRankingsModels.prototype.onData = function( data, id )
{
    if( id === this.feedTopPlayerRankings )
    {
        for( var statType in data.batting )
        {
            var player = data.batting[statType];
            if( statType.startsWith( 'WOMEN_' ) )
            {
                this.data.women.batting[ statType ] = this.data.women[ statType ] || [];
                this.data.women.batting[ statType ][0] = player;
            }
            else
            {
                this.data.men.batting[ statType ] = this.data.men[ statType ] || [];
                this.data.men.batting[ statType ][0] = player;
            }
        }

        for( var statType in data.bowling )
        {
            var player = data.bowling[statType];
            if( statType.startsWith( 'WOMEN_' ) )
            {
                this.data.women.bowling[ statType ] = this.data.women[ statType ] || [];
                this.data.women.bowling[ statType ][0] = player;
            }
            else
            {
                this.data.men.bowling[ statType ] = this.data.men[ statType ] || [];
                this.data.men.bowling[ statType ][0] = player;
            }
        }

        PULSE.CLIENT.notify('player-rankings/top', { success: true } );
    }

    // drafted, not yet used
    else if( id.startsWith( 'men' ) && data )
    {
        this.data.men[ data.statistic.toLowerCase() ][ data.scope ] = data.data;
        this.lastUpdated.men[ data.statistic.toLowerCase() ][ data.scope ] = dateFormat( new Date( data.feedUpdated ), 'dddd dS mmmm yyyy' );

        PULSE.CLIENT.notify('player-rankings/update', {
            type: "men",
            batBowl: data.statistic,
            matchType: data.scope,
            success: true
        } );
        PULSE.CLIENT.notify('player-rankings/men/' + data.statistic.toLowerCase() + '/' + data.scope, { success: true } );
    }
    // drafted, not yet used
    else if( id.startsWith( 'women' ) && data )
    {
        this.data.women[ data.statistic.toLowerCase() ][ data.scope ] = data.data;
        this.lastUpdated.women[ data.statistic.toLowerCase() ][ data.scope ] = dateFormat( new Date( data.feedUpdated ), 'dddd dS mmmm yyyy' );

        PULSE.CLIENT.notify('player-rankings/update', {
            type: "women",
            batBowl: data.statistic,
            matchType: data.scope,
            success: true
        } );
        PULSE.CLIENT.notify('player-rankings/women/' + data.statistic.toLowerCase() + '/' + data.scope, { success: true } );
    }

    else if (id === this.playersListId && data)
    {
        this.iccPlayerListData = data.iccPlayerList;
        PULSE.CLIENT.notify('iccPlayerList/update', { success: true } );
    }

    else if (id === this.playerId && data)
    {
        this.playersData[data.playerEvents.player.id] = data;
        PULSE.CLIENT.notify('iccPlayer/update', { success: true, playerId : data.playerEvents.player.id } );
    }
};


PULSE.CLIENT.CRICKET.PlayerRankingsModels.prototype.getTopPlayersModel = function()
{
    var model = $.extend( {}, this.data );
    return model;
};

PULSE.CLIENT.CRICKET.PlayerRankingsModels.prototype.getLastUpdatedModel = function()
{
    var model = $.extend({}, this.lastUpdated);
    return model;
}

PULSE.CLIENT.CRICKET.PlayerRankingsModels.prototype.getMensTestBattingRankings = function(start)
{
    if( !this.mensTestBattingRankingsFeedLoaded )
    {
        this.feedMensTestBattingRankings = 'mensTestBattingRankings';
        this.topMensTestBattingRankingsUrl = this.tournamentUrlGenerator.makeICCDataUrl('men-test-batting-player-rankings');
        this.mensTestBattingRankingsInterval = 50;
        this.mensTestBattingRankingsInterval = 'onPlayerRankings';

        this.dm.addFeed( this.feedMensTestBattingRankings, this.topMensTestBattingRankingsUrl, this.mensTestBattingRankingsInterval, this.mensTestBattingRankingsInterval, [this] );

        this.mensTestBattingRankingsFeedLoaded = true;
    }

    if( start && this.topMensTestBattingRankingsUrl )
    {
        this.dm.start( this.topMensTestBattingRankingsUrl );
    }
};

PULSE.CLIENT.CRICKET.PlayerRankingsModels.prototype.getMensTestBowlingRankings = function(start)
{
    if( !this.mensTestBowlingRankingsFeedLoaded )
    {
        this.feedMensTestBowlingRankings = 'mensTestBowlingRankings';
        this.topMensTestBowlingRankingsUrl = this.tournamentUrlGenerator.makeICCDataUrl('men-test-bowling-player-rankings');
        this.mensTestBowlingRankingsInterval = 50;
        this.mensTestBowlingRankingsInterval = 'onPlayerRankings';

        this.dm.addFeed( this.feedMensTestBowlingRankings, this.topMensTestBowlingRankingsUrl, this.mensTestBowlingRankingsInterval, this.mensTestBowlingRankingsInterval, [this] );

        this.mensTestBowlingRankingsFeedLoaded = true;
    }

    if( start && this.topMensTestBowlingRankingsUrl )
    {
        this.dm.start( this.topMensTestBowlingRankingsUrl );
    }
};

PULSE.CLIENT.CRICKET.PlayerRankingsModels.prototype.getMensODIBattingRankings = function(start)
{
    if( !this.mensODIBattingRankingsFeedLoaded )
    {
        this.feedMensODIBattingRankings = 'mensODIBattingRankings';
        this.topMensODIBattingRankingsUrl = this.tournamentUrlGenerator.makeICCDataUrl('men-odi-batting-player-rankings');
        this.mensODIBattingRankingsInterval = 50;
        this.mensODIBattingRankingsInterval = 'onPlayerRankings';

        this.dm.addFeed( this.feedMensODIBattingRankings, this.topMensODIBattingRankingsUrl, this.mensODIBattingRankingsInterval, this.mensODIBattingRankingsInterval, [this] );

        this.mensODIBattingRankingsFeedLoaded = true;
    }

    if( start && this.topMensODIBattingRankingsUrl )
    {
        this.dm.start( this.topMensODIBattingRankingsUrl );
    }
};

PULSE.CLIENT.CRICKET.PlayerRankingsModels.prototype.getMensODIBowlingRankings = function(start)
{
    if( !this.mensODIBowlingRankingsFeedLoaded )
    {
        this.feedMensODIBowlingRankings = 'mensODIBowlingRankings';
        this.topMensODIBowlingRankingsUrl = this.tournamentUrlGenerator.makeICCDataUrl('men-odi-bowling-player-rankings');
        this.mensODIBowlingRankingsInterval = 50;
        this.mensODIBowlingRankingsInterval = 'onPlayerRankings';

        this.dm.addFeed( this.feedMensODIBowlingRankings, this.topMensODIBowlingRankingsUrl, this.mensODIBowlingRankingsInterval, this.mensODIBowlingRankingsInterval, [this] );

        this.mensODIBowlingRankingsFeedLoaded = true;
    }

    if( start && this.topMensODIBowlingRankingsUrl )
    {
        this.dm.start( this.topMensODIBowlingRankingsUrl );
    }
};


PULSE.CLIENT.CRICKET.PlayerRankingsModels.prototype.getMensT20BattingRankings = function(start)
{
    if( !this.mensT20BattingRankingsFeedLoaded )
    {
        this.feedMensT20BattingRankings = 'mensT20BattingRankings';
        this.topMensT20BattingRankingsUrl = this.tournamentUrlGenerator.makeICCDataUrl('men-t20-batting-player-rankings');
        this.mensT20BattingRankingsInterval = 50;
        this.mensT20BattingRankingsInterval = 'onPlayerRankings';

        this.dm.addFeed( this.feedMensT20BattingRankings, this.topMensT20BattingRankingsUrl, this.mensT20BattingRankingsInterval, this.mensT20BattingRankingsInterval, [this] );

        this.mensT20BattingRankingsFeedLoaded = true;
    }

    if( start && this.topMensT20BattingRankingsUrl )
    {
        this.dm.start( this.topMensT20BattingRankingsUrl );
    }
};


PULSE.CLIENT.CRICKET.PlayerRankingsModels.prototype.getMensT20BowlingRankings = function(start)
{
    if( !this.mensT20BowlingRankingsFeedLoaded )
    {
        this.feedMensT20BowlingRankings = 'mensT20BowlingRankings';
        this.topMensT20BowlingRankingsUrl = this.tournamentUrlGenerator.makeICCDataUrl('men-t20-bowling-player-rankings');
        this.mensT20BowlingRankingsInterval = 50;
        this.mensT20BowlingRankingsInterval = 'onPlayerRankings';

        this.dm.addFeed( this.feedMensT20BowlingRankings, this.topMensT20BowlingRankingsUrl, this.mensT20BowlingRankingsInterval, this.mensT20BowlingRankingsInterval, [this] );

        this.mensT20BowlingRankingsFeedLoaded = true;
    }

    if( start && this.topMensT20BowlingRankingsUrl )
    {
        this.dm.start( this.topMensT20BowlingRankingsUrl );
    }
};


PULSE.CLIENT.CRICKET.PlayerRankingsModels.prototype.getWomensT20BattingRankings = function(start)
{
    if( !this.womensT20BattingRankingsFeedLoaded )
    {
        this.feedWomensT20BattingRankings = 'womensT20BattingRankings';
        this.topWomensT20BattingRankingsUrl = this.tournamentUrlGenerator.makeICCDataUrl('women-t20-batting-player-rankings');
        this.womensT20BattingRankingsInterval = 50;
        this.womensT20BattingRankingsInterval = 'onPlayerRankings';

        this.dm.addFeed( this.feedWomensT20BattingRankings, this.topWomensT20BattingRankingsUrl, this.womensT20BattingRankingsInterval, this.womensT20BattingRankingsInterval, [this] );

        this.womensT20BattingRankingsFeedLoaded = true;
    }

    if( start && this.topWomensT20BattingRankingsUrl )
    {
        this.dm.start( this.topWomensT20BattingRankingsUrl );
    }
};


PULSE.CLIENT.CRICKET.PlayerRankingsModels.prototype.getWomensODIBattingRankings = function(start)
{
    if( !this.womensODIBattingRankingsFeedLoaded )
    {
        this.feedWomensODIBattingRankings = 'womensODIBattingRankings';
        this.topWomensODIBattingRankingsUrl = this.tournamentUrlGenerator.makeICCDataUrl('women-odi-batting-player-rankings');
        this.womensODIBattingRankingsInterval = 50;
        this.womensODIBattingRankingsInterval = 'onPlayerRankings';

        this.dm.addFeed( this.feedWomensODIBattingRankings, this.topWomensODIBattingRankingsUrl, this.womensODIBattingRankingsInterval, this.womensODIBattingRankingsInterval, [this] );

        this.womensODIBattingRankingsFeedLoaded = true;
    }

    if( start && this.topWomensODIBattingRankingsUrl )
    {
        this.dm.start( this.topWomensODIBattingRankingsUrl );
    }
};


PULSE.CLIENT.CRICKET.PlayerRankingsModels.prototype.getWomensT20BowlingRankings = function(start)
{
    if( !this.womensT20BowlingRankingsFeedLoaded )
    {
        this.feedWomensT20BowlingRankings = 'womensT20BowlingRankings';
        this.topWomensT20BowlingRankingsUrl = this.tournamentUrlGenerator.makeICCDataUrl('women-t20-bowling-player-rankings');
        this.womensT20BowlingRankingsInterval = 50;
        this.womensT20BowlingRankingsInterval = 'onPlayerRankings';

        this.dm.addFeed( this.feedWomensT20BowlingRankings, this.topWomensT20BowlingRankingsUrl, this.womensT20BowlingRankingsInterval, this.womensT20BowlingRankingsInterval, [this] );

        this.womensT20BowlingRankingsFeedLoaded = true;
    }

    if( start && this.topWomensT20BowlingRankingsUrl )
    {
        this.dm.start( this.topWomensT20BowlingRankingsUrl );
    }
};


PULSE.CLIENT.CRICKET.PlayerRankingsModels.prototype.getWomensODIBowlingRankings = function(start)
{
    if( !this.womensODIBowlingRankingsFeedLoaded )
    {
        this.feedWomensODIBowlingRankings = 'womensODIBowlingRankings';
        this.topWomensODIBowlingRankingsUrl = this.tournamentUrlGenerator.makeICCDataUrl('women-odi-bowling-player-rankings');
        this.womensODIBowlingRankingsInterval = 50;
        this.womensODIBowlingRankingsInterval = 'onPlayerRankings';

        this.dm.addFeed( this.feedWomensODIBowlingRankings, this.topWomensODIBowlingRankingsUrl, this.womensODIBowlingRankingsInterval, this.womensODIBowlingRankingsInterval, [this] );

        this.womensODIBowlingRankingsFeedLoaded = true;
    }

    if( start && this.topWomensODIBowlingRankingsUrl )
    {
        this.dm.start( this.topWomensODIBowlingRankingsUrl );
    }
};

PULSE.CLIENT.CRICKET.PlayerRankingsModels.prototype.getPlayerByNameModel = function(name)
{
    var retObj = {}

    var mappedObj = {}

    if (!this.iccPlayerListData)
    {
        return false;
    }

    for (var i=0, len = this.iccPlayerListData.length; i < len; i++)
    {
        var player = this.iccPlayerListData[i];

        if (player.name.toLowerCase() === name.toLowerCase())
        {

           retObj.battingStyle = this.battingStyles[ player.battingStyle ];
           retObj.bowlingStyle = this.bowlingStyles[ player.bowlingStyle ];
           retObj.dob = dateFormat( new Date( player.dateOfBirth ), 'dddd dS mmmm yyyy' )
           retObj.firstName = player.firstname;
           retObj.lastName = player.lastname;
           retObj.initials = player.initials;
           retObj.fullName = player.name;
           retObj.id = player.id;
           retObj.role = player.role;
           retObj.sex = player.sex;
        }
    }

    return retObj;
}

PULSE.CLIENT.CRICKET.PlayerRankingsModels.prototype.getPlayerEventsModelById = function( playerId )
{
    var retObj;

    if ( _.size(this.playersData) === 0 )
    {
        return false;
    }

    for ( var type in this.playersData )
    {
        if ( this.playersData.hasOwnProperty(type) )
        {
            var player = this.playersData[type];

            if ( player.playerEvents.player.id === playerId )
            {
                player.playerEvents.player.battingStyle = this.battingStyles[ player.playerEvents.player.battingStyle ];
                player.playerEvents.player.bowlingStyle = this.bowlingStyles[ player.playerEvents.player.bowlingStyle ];

                player.playerEvents.lastMatchUpdate.startDate = dateFormat( new Date( player.playerEvents.lastMatchUpdate.startDate ), 'dd mmm yyyy' );
                player.playerEvents.player.dateOfBirth = dateFormat( new Date( player.playerEvents.player.dateOfBirth ), 'dd mmm yyyy' );

                if( player.playerEvents.events.length > 0 )
                {
                    var eventIndex = 0;
                    var event = player.playerEvents.events[eventIndex];
                    while( !event.played && eventIndex < player.playerEvents.events.length )
                    {
                        event = player.playerEvents.events[eventIndex++];
                    }
                    player.playerEvents.debutDate = dateFormat( new Date( event.match.startDate ), 'dd mmm yyyy' );
                }

                retObj = player.playerEvents;
            }
        }
    }

    return retObj;
}

/**
 * Gets players career ranking from data - Top 100 only. API does not return highest rating. Where events
 * are available use getCurrentPlayerRankingFromEvents(); and getPlayerCareerRankingsFromEvents();
 * @param  {Array} params     Array of strings ['men/women', 'batting/bowling', 'match type']
 * @param  {String} playerName Name of player
 * @return {Object}            Contains current ranking and rating as well as all time best rating
 */
PULSE.CLIENT.CRICKET.PlayerRankingsModels.prototype.getPlayerCareerRankingsByFormat = function( params, playerName )
{
    this.data.women.batting.women_test = [];
    this.data.women.bowling.women_test = [];

    var data = this.data[params[0]][params[1]][params[2].toUpperCase()]
      , retObj = {}

    if (!data)
    {
        retObj.ranking = '-';
        retObj.rating = '-';

        return retObj;
    }

    for (var i=0, len = data.length; i < len; i++)
    {
        var player = data[i];

        if ( player.player.fullName.toLowerCase() === playerName.toLowerCase() )
        {
            retObj = player;
            retObj.ranking = (i + 1);
        }
    }

    return retObj;
}

/**
 * Loops through the historic events of a player to get their highest (lowest number) ranking. More
 * expensive than getPlayerCareerRankingsByFormat(); but provides additional historic information.
 * @param  {string} type   String to designate whether to look at 'batting' or 'bowling' rankings
 * @param  {array} events Array of matches including player ranking for each match
 * @return {Object}        Highest ever ranking and rating in key value pairs
 */
PULSE.CLIENT.CRICKET.PlayerRankingsModels.prototype.getPlayerCareerRankingsFromEvents = function( type, events )
{
    if( !type || events.length == 0  || !events[0].battingRanking )
    {
        return;
    }

    var retObj = {},
        ranking = 10000,
        rankType = type + 'Ranking',
        rating = 0,
        ratingType = type + 'Rating';

    for( var match in events )
    {
        if( events[match][rankType] > 0 && events[match][rankType] < ranking )
        {
            ranking = events[match][rankType].toString();
        }

        if( events[match][ratingType] > rating )
        {
            rating = events[match][ratingType].toString();
        }
    }

    if( rating === 0 ) rating = '0'

    retObj = { 'rating' : rating, 'ranking' : ranking }

    return retObj;
}

/**
 * Gets current ranking from the most recent match in events
 * @param  {string} type   Either 'batting' or 'bowling'
 * @param  {events} events Array of matches including player ranking for each match
 * @return {Object}        Object containing current ranking and rating in key value pairs
 */
PULSE.CLIENT.CRICKET.PlayerRankingsModels.prototype.getPlayerCurrentRankingsFromEvents = function( type, events )
{
    if( !type || events.length == 0  || !events[0].battingRanking )
    {
        return;
    }

    var latestEvent = events.length - 1,
        rankType = type + 'Ranking',
        ranking = events[latestEvent][rankType].toString(),
        ratingType = type + 'Rating',
        rating = events[latestEvent][ratingType].toString(),
        retObj = { 'ranking' : ranking, 'rating' : rating }

    // Fallback for data anomaly where event contains no ranking data
    if( retObj.ranking == -1 || retObj.rating == -1 )
    {
        var latestEvent = events.length - 2,
        rankType = type + 'Ranking',
        ranking = events[latestEvent][rankType].toString(),
        ratingType = type + 'Rating',
        rating = events[latestEvent][ratingType].toString(),
        retObj = { 'ranking' : ranking, 'rating' : rating }
    }

    return retObj;
}
if (!PULSE) 				{ var PULSE = {}; }
if (!PULSE.CLIENT) 			{ PULSE.CLIENT = {}; }
if (!PULSE.CLIENT.CRICKET) 	{ PULSE.CLIENT.CRICKET = {}; }

PULSE.CLIENT.CRICKET.RankingsModels = function()
{
    //this.dm = PULSE.CLIENT.getDataManager();
    //This is a better method for calling the data while under Hit's control
    this.apiCaller = PULSE.CLIENT.CRICKET.getAPICaller();
    this.feedRankings = 'rankings';
    this.feedRankingsData = {};
};

PULSE.CLIENT.CRICKET.RankingsModels.prototype.getRankingsData = function( type, start )
{
    this.apiCaller.getRankings( this.feedRankings + type, this, { gender: type === 'women' ? 'female' : 'male' }, true );
};

PULSE.CLIENT.CRICKET.RankingsModels.prototype.getRankingsModel = function( cat, ranked )
{
    cat = typeof cat === 'undefined' ? 'men' : cat;
    if ( this.feedRankingsData[ cat ] )
    {
        this.isRanked = ( typeof ranked === 'undefined' ? true : ranked );
        var model = this.makeRankingsModel( this.feedRankingsData[ cat ] );

        for ( var type in model )
        {
            if ( model.hasOwnProperty( type ) )
            {
                model[ type ] = this.sortByPosition( model[ type ] );
            }
        }

        return model;
    }
};

PULSE.CLIENT.CRICKET.RankingsModels.prototype.makeRankingsModel = function( data )
{
    var model = {};

    for ( var _i = 0, _length = data.length; _i < _length; _i++ )
    {
        var matchTypeRankings = data[ _i ];
        var dataSet = this.isRanked ? matchTypeRankings.rankings : matchTypeRankings.unranked;
        model[ matchTypeRankings.matchType ] = this.makeFormatModel( dataSet );
    }

    return model;
};

PULSE.CLIENT.CRICKET.RankingsModels.prototype.makeFormatModel = function( rankings )
{
    var teams = [];

    for ( var _i = 0, _length = rankings.length; _i < _length; _i++ )
    {

        var team = rankings[ _i ];

        if ( this.isRanked && !team.position )
        {
            continue;
        }

        var model = {
            matches: parseFloat( team.played || 0 ),
            qlfMatches: ( typeof team.qfyMatches !== 'undefined' ? parseFloat( team.qfyMatches ) :
                undefined ),
            position: !team.position ? '' : parseFloat( team.position ),
            points: parseFloat( team.points ),
            rating: team.played ? parseFloat( team.points ) / parseFloat( team.played ) : 0,
            formattedRating: team.rating,
            teamAbbr: team.team.abbreviation,
            teamFullName: team.team.fullName
        };

        teams.push( model );
    }

    if ( this.isRanked )
    {
        this.sortByPosition( teams );
    }
    else
    {
        this.sortByRating( teams );
    }
    return teams;
};

PULSE.CLIENT.CRICKET.RankingsModels.prototype.sortByPosition = function( teams )
{
    teams.sort( function( a, b )
    {
        if ( parseInt( a.position ) < parseInt( b.position ) )
        {
            return -1;
        }

        if ( parseInt( a.position ) > parseInt( b.position ) )
        {
            return 1;
        }

        return 0;
    } );

    return teams;
};

PULSE.CLIENT.CRICKET.RankingsModels.prototype.sortByRating = function( teams )
{

    teams.sort( function( a, b )
    {
        if ( a.rating < b.rating )
        {
            return 1;
        }

        if ( a.rating > b.rating )
        {
            return -1;
        }

        return 0;
    } );

    return teams;
};

PULSE.CLIENT.CRICKET.RankingsModels.prototype.getTeamRankings = function( rankings, team )
{

    for ( var _i = 0, _length = rankings.length; _i < _length; _i++ )
    {
        var teamRanking = rankings[ _i ];

        if ( team === teamRanking.teamFullName )
        {

            return teamRanking;
        }

    }
};

PULSE.CLIENT.CRICKET.RankingsModels.prototype.updateTeamRankings = function( rankings, stats )
{

    for ( var _i = 0, _length = rankings.length; _i < _length; _i++ )
    {
        if ( rankings[ _i ].teamFullName === stats.team )
        {
            if ( rankings[ _i ].position === 'unranked' && stats.matches >= 8 )
            {
                //Sets arbitrary value higher than total teams  
                //to ensure chevron is correct when real position is calculated
                rankings[ _i ].position = rankings.length;
            }

            rankings[ _i ].matches = stats.matches;
            rankings[ _i ].qlfMatches = stats.qlfMatches;
            rankings[ _i ].points = stats.points;
            rankings[ _i ].rating = stats.rating;

        }
    }

    return rankings;
};

PULSE.CLIENT.CRICKET.RankingsModels.prototype.filterRankedTeams = function( ranked, unranked )
{
    var teams = [];

    for ( var _i = 0, _length = unranked.length; _i < _length; _i++ )
    {
        var team = unranked[ _i ];

        if ( !this.getTeamRankings( ranked, team.teamFullName ) )
        {
            teams.push( team );
        }
    }

    return teams;
};

PULSE.CLIENT.CRICKET.RankingsModels.prototype.filterUnrankedTeams = function( rankings )
{
    var teams = [];

    for ( var _i = 0, _length = rankings.length; _i < _length; _i++ )
    {
        var team = rankings[ _i ];

        if ( team.position !== 'unranked' )
        {
            teams.push( team );
        }
    }

    return teams;
};

PULSE.CLIENT.CRICKET.RankingsModels.prototype.updateTeamPositions = function( rankings )
{

    rankings.sort( function( a, b )
    {

        if ( a.rating < b.rating )
        {
            return 1;
        }

        if ( a.rating > b.rating )
        {
            return -1;
        }

        // if (a.rating === b.rating) {

        //   if (a.points < b.points) {

        //     return 1
        //   }

        //   if (a.points > b.points) {

        //     return - 1
        //   }
        // }

        return 0;

    } );

    for ( var _i = 0, _length = rankings.length; _i < _length; _i++ )
    {
        if ( rankings[ _i ].position === 'unranked' )
        {
            continue;
        }

        var pos = _i + 1;

        if ( rankings[ _i ].position < pos )
        {
            //Move Down
            rankings[ _i ].mv = '<i class="icon-chevron-down"></i>';
        }
        else if ( rankings[ _i ].position > pos )
        {
            //Move Up
            rankings[ _i ].mv = '<i class="icon-chevron-up"></i>';
        }
        else if ( rankings[ _i ].position === pos )
        {
            rankings[ _i ].mv = '<i class="icon-chevron-right"></i>';
        }

        rankings[ _i ].position = pos;

    }


    return rankings;
};

PULSE.CLIENT.CRICKET.RankingsModels.prototype.onData = function( data, id )
{
    if ( id.startsWith( this.feedRankings ) && data )
    {
        var type = id.substring( 8 );
        this.feedRankingsData[ type ] = data;

        PULSE.CLIENT.notify( 'rankings/update',
        {
            success: true
        } );
    }
};

PULSE.CLIENT.CRICKET.RankingsModels.prototype.onError = function( id ) {

};

PULSE.CLIENT.CRICKET.RankingsModels.prototype.getAPIUrl = function()
{
    return PULSE.CLIENT.isTest() ? this.testAPI : this.prodAPI;
};
if (!PULSE) { var PULSE = {}; }
if (!PULSE.CLIENT) { PULSE.CLIENT = {}; }
if (!PULSE.CLIENT.CRICKET) { PULSE.CLIENT.CRICKET = {}; }


PULSE.CLIENT.CRICKET.AllMatches = function()
{
	this.dm = PULSE.CLIENT.getDataManager();

	// the API links
	this.prodAPI = "http://msapi.pulselive.com/msapi/";
	this.testAPI = "http://msapi.pulselive.com/msapi/";
	//this.testAPI = "http://msapitest.pulselive.com:8080/msapi/";
	// this.prodAPI = "http://ec2-23-22-42-190.compute-1.amazonaws.com:8080/msapi/";

	this.feedMetaSchedule = ["data"];

	this.meta = {};
	this.data = {};

	// matches are stored in a this.dates[timestamp][matchId] structure
	this.dates = {};
};



/******************
 *	Data management
 */
PULSE.CLIENT.CRICKET.AllMatches.prototype.onData = function( data, id )
{
	if( id === this.feedMetadata && data.metaResponse )
	{
		this.meta = data.metaResponse;
		PULSE.CLIENT.notify( 'metaSchedule/meta', { success: true } );
	}
	else if( $.inArray( id, this.feedMetaSchedule ) > -1 && data.dataResponse )
	{
		this.data = data.dataResponse;
		this.updateMatches();
		PULSE.CLIENT.notify( 'metaSchedule/data', { success: true, id: id } );
	}
};

PULSE.CLIENT.CRICKET.AllMatches.prototype.onError = function( id )
{
	if( id === this.feedMetadata )
	{
		PULSE.CLIENT.notify( 'metaSchedule/meta', { success: false } );
		console.log('no data');
	}
	else if( $.inArray( id, this.feedMetaSchedule ) > -1 )
	{
		PULSE.CLIENT.notify( 'metaSchedule/data', { success: false, id: id } );
		console.log('no data');
	}
};

PULSE.CLIENT.CRICKET.AllMatches.prototype.updateMatches = function()
{
	var matches = this.data.matches;

	if( !matches )
	{
		return;
	}

	for( var i = 0, iLimit = this.data.matches.length; i < iLimit; i++ )
	{
		var match = matches[i];
		var timestamp = match.timestamp;

		// check if there are any tournaments other than the ones already collected
		// create any new tournaments that aren't already there
		if( !window.tournaments[ match.tournamentId.name ] )
		{
			window.tournaments[ match.tournamentId.name ] = new PULSE.CLIENT.CRICKET.Tournament( {
				tournamentName: match.tournamentId.name
			} );
		}

		// check if the match is new; create it if it doesn't exist already
		if( !this.dates[ timestamp ] || !this.dates[ timestamp ][ match.scheduleEntry.matchId.name ] )
		{
			this.dates[ timestamp ] = this.dates[ timestamp ] || {};
			this.dates[ timestamp ][ match.scheduleEntry.matchId.name ] = new PULSE.CLIENT.CRICKET.Match(
				window.tournaments[ match.tournamentId.name ],
				match.scheduleEntry.matchId.name
			);
		}

		// update the match information
		if( match.timestamp )
		{
			match.scheduleEntry.matchDate = match.timestamp;
		}

        //Add Tournament Data to scheduleEntry object
        match.scheduleEntry.tournamentLabel = match.tournamentLabel;
        match.scheduleEntry.tournamentName = match.tournamentId.name;
        match.scheduleEntry.tournamentId = match.tournamentId.id;

		this.dates[ timestamp ][ match.scheduleEntry.matchId.name ].setScheduleData( match.scheduleEntry );
	}
};

PULSE.CLIENT.CRICKET.AllMatches.prototype.getMatchIds = function()
{
	var ids = [];
	for( var timestamp in this.dates )
	{
		var matchIds = $.map( this.dates[timestamp], function( value, key ) {
			return key;
		} );

		ids = ids.concat( matchIds );
	}

	return _.uniq(ids);
};

PULSE.CLIENT.CRICKET.AllMatches.prototype.getTournamentIds = function()
{
	var that = this,
		ids = [];

	for ( var timestamp in this.dates )
	{
		var tournamentIds = $.map( this.dates[ timestamp ], function( value, key )
		{
			return value.scheduleData.tournamentName;
		} );

		ids = ids.concat( tournamentIds );
	}

	return _.uniq( ids );
};

PULSE.CLIENT.CRICKET.AllMatches.prototype.getMatch = function( matchId )
{
	var match, firstMatch;
	for( var timestamp in this.dates )
	{
		if( this.dates[timestamp][matchId] )
		{
			match = this.dates[timestamp][matchId];
			// there's only one instance of non-test matches
			if( match.getMatchType() !== "TEST" && match.getMatchType() !== "FIRST_CLASS" )
			{
				return match;
			}
			else
			{
				var date = PULSE.CLIENT.DateUtil.parseDateTime(timestamp),
					now  = new Date();

				// stop if there is a match playing that day
				if( Math.abs( now - date ) < 86400000 )
				{
					break;
				}
				// if not, remember the first instance of the match
				else if( !firstMatch )
				{
					firstMatch = match;
				}
			}
		}
	}

	// if there's a first instance, it means there was no live match
	return firstMatch || match;
};

PULSE.CLIENT.CRICKET.AllMatches.prototype.getMatchModel = function( matchId )
{
	var matches = this.data.matches,
		firstMatch,
		liveMatchModel;

	if( !matches )
	{
		return;
	}

	for( var i = 0, iLimit = matches.length; i < iLimit; i++ )
	{
		var id 			= matches[i].scheduleEntry.matchId.name,
			timestamp 	= matches[i].timestamp;

		if( matchId === id )
		{
			var match = this.dates[timestamp][ matchId ];
			var matchModel = match.getFullModel();
			matchModel.label = matches[i].label;
			matchModel.tournamentLabel = matches[i].tournamentLabel;

			// if the metaschedule says this is a result-only match, don't include the match link
			matchModel.matchLink = this.data.matches[i].resultOnly ? "" : matchModel.matchLink;

			if( match.getMatchType() !== "TEST" && match.getMatchType() !== "FIRST_CLASS" )
			{
				return matchModel;
			}
			else
			{
				var date = PULSE.CLIENT.DateUtil.parseDateTime(timestamp),
					now  = new Date();

				// stop if there is a match playing that day
				if( date - now > -43200000 && date - now < 43200000 )
				{
					liveMatchModel = matchModel;
					break;
				}
				// if not, remember the first instance of the match
				else if( !firstMatch )
				{
					firstMatch = matchModel;
				}
			}
		}
	}
	return liveMatchModel || firstMatch;
};

// assuming matches are sorted chronologically, it gets the first upcoming non-live match
PULSE.CLIENT.CRICKET.AllMatches.prototype.getNextMatchKeys = function()
{
	var matches = this.data.matches,
		firstMatch,
		liveMatchModel;

	if( !matches )
	{
		return;
	}

	for( var i = 0, iLimit = matches.length; i < iLimit; i++ )
	{
		var matchId 	= matches[i].scheduleEntry.matchId.name,
			timestamp 	= matches[i].timestamp;

		var match = this.dates[timestamp][ matchId ];

		if( match.getMatchState() === 'U' )
		{
			return { timestamp: timestamp, matchId: matchId };
		}
	}
};

PULSE.CLIENT.CRICKET.AllMatches.prototype.getMatchesGroupedByDayModel = function( filterByPresentDay )
{
	var matches = this.data.matches,
		model 	= { days: [] };

	if( !matches )
	{
		return model;
	}

	for( var i = 0, iLimit = this.data.matches.length; i < iLimit; i++ )
	{
		var matchId = matches[i].scheduleEntry.matchId.name,
			timestamp = matches[i].timestamp,
			date = PULSE.CLIENT.DateUtil.parseDateTime( timestamp ),
			now = new Date(),
			match 	= this.dates[timestamp][ matchId ],
			matchModel = match.getFullModel();

		matchModel.label = matches[i].label;
		matchModel.tournamentLabel = matches[i].tournamentLabel;
		matchModel.matchDate = timestamp;

		// if the metaschedule says this is a result-only match, don't include the match link
		matchModel.matchLink = this.data.matches[i].resultOnly ? "" : matchModel.matchLink;

		// for test matches, ignore days which have passed (12 hours cap)
		if( filterByPresentDay && (match.getMatchType() === 'TEST' || match.getMatchType() === "FIRST_CLASS") && date - now < -43200000 )
		{
			continue;
		}
		if( filterByPresentDay && (match.getMatchType() === 'TEST' || match.getMatchType() === "FIRST_CLASS") && date - now > 43200000 )
		{
			matchModel.live = false;
		}

		this.groupByDay( model.days, matchModel );
	}

	return model;
};

PULSE.CLIENT.CRICKET.AllMatches.prototype.getResultsGroupedByDayModel = function( filterByPresentDay )
{
	var matches = this.data.matches,
		model 	= { days: [] },
		matchIds = [];

	if( !matches )
	{
		return model;
	}

	for( var i = 0, iLimit = this.data.matches.length; i < iLimit; i++ )
	{
		var matchId = matches[i].scheduleEntry.matchId.name,
			timestamp = matches[i].timestamp,
			date = PULSE.CLIENT.DateUtil.parseDateTime( timestamp ),
			now = new Date(),
			match 	= this.dates[timestamp][ matchId ],
			matchModel = match.getFullModel();

		matchModel.label = matches[i].label;
		matchModel.tournamentLabel = matches[i].tournamentLabel;

		// if the metaschedule says this is a result-only match, don't include the match link
		matchModel.matchLink = this.data.matches[i].resultOnly ? "" : matchModel.matchLink;

		if( $.inArray( matchId, matchIds ) > -1 )
		{
			continue;
		}

		matchIds.push( matchId );
		this.groupByDay( model.days, matchModel );
	}

	return model;
};

PULSE.CLIENT.CRICKET.AllMatches.prototype.groupByDay = function( list, match )
{
	var date 		= PULSE.CLIENT.DateUtil.parseDateTime( match.matchDate );
	var dateString 	= dateFormat( date, 'dddd, dS mmmm' );

	if( list.length === 0 || list[ list.length - 1 ].date !== dateString )
	{
		list.push( {
			date: dateString,
			matches: []
		} );
	}

	list[ list.length - 1 ].matches.push( match );
};


PULSE.CLIENT.CRICKET.AllMatches.prototype.groupMatchesBySeries = function( series )
{
	var matches = this.getMatchesModel(),
		tournamentIds = series || this.getTournamentIds(),
		series = [];

    for( var i = 0, length = matches.matches.length; i < length; i++ )
    {
        var match = matches.matches[i];
        if( -1 < $.inArray( match.tournamentName, tournamentIds ) )
        {
            var hasSeriesIndex = this.arrHasSeriesIndex(series, match.tournamentId);

            if (hasSeriesIndex === 'no-match')
            {
                series.push([ match ])
            }
            else
            {
                series[hasSeriesIndex].push(match);
            }
        }
	}

	return { series : series };
};

PULSE.CLIENT.CRICKET.AllMatches.prototype.arrHasSeriesIndex = function(series, id)
{

	for (var i=0, len = series.length; i < len; i++) {

		var array = series[i];

		for (var m=0, mLength = array.length; m < mLength; m++) {

			var match = array[m];

			if (match.tournamentId === id) {

				return i;
			}
		}
	}

	//String required so index 0 can be returned
	return 'no-match';
}

PULSE.CLIENT.CRICKET.AllMatches.prototype.getMatchesModel = function()
{
	var matches = this.data.matches,
		model  = { matches: [] };

	if( !matches )
	{
		return model;
	}

	for( var i = 0, iLimit = this.data.matches.length; i < iLimit; i++ )
	{
		var matchId = matches[i].scheduleEntry.matchId.name,
	 	timestamp = matches[i].timestamp,
	   	match  = this.dates[timestamp][ matchId ];

	   	var matchModel = match.getFullModel();
	   	matchModel.label = matches[i].label;
	   	matchModel.tournamentName = match.tournament.tournamentName;
		matchModel.tournamentLabel = matches[i].tournamentLabel;

		// if the metaschedule says this is a result-only match, don't include the match link
		matchModel.matchLink = this.data.matches[i].resultOnly ? "" : matchModel.matchLink;

	    model.matches.push( matchModel );
	}

 	return model;
};

/**
 * 	Returns an array of match models
 * 	For test matches, only the first instance (Day 5, if ordered anti-chronological) is returned
 */
PULSE.CLIENT.CRICKET.AllMatches.prototype.getCompleteModel = function()
{
	var matches = this.data.matches,
		model  = { matches: [] },
		matchIds = [];

	if( !matches )
	{
		return model;
	}

	for( var i = 0, iLimit = this.data.matches.length; i < iLimit; i++ )
	{
		var matchId = matches[i].scheduleEntry.matchId.name,
	 	timestamp = matches[i].timestamp,
	   	match = this.dates[timestamp][matchId];

		// there's only one instance of non-test matches
		if( $.inArray( matchId, matchIds ) === -1 )
		{
			var matchModel = match.getFullModel();
			matchModel.label = matches[i].label;
			matchModel.tournamentLabel = matches[i].tournamentLabel;

			// if the metaschedule says this is a result-only match, don't include the match link
			matchModel.matchLink = this.data.matches[i].resultOnly ? "" : matchModel.matchLink;

			model.matches.push( matchModel );

			matchIds.push( matchId );
		}
	}

 	return model;
};

/**
 * 	Returns an array of match models
 * 	For test matches, only the first instance (Day 5, if ordered anti-chronological) is returned
 */
PULSE.CLIENT.CRICKET.AllMatches.prototype.getCompleteModelByTeams = function()
{
	var matches = this.data.matches,
		model  = {},
		matchIds = [];

	if( !matches )
	{
		return model;
	}

	for( var i = 0, iLimit = this.data.matches.length; i < iLimit; i++ )
	{
		var matchId = matches[i].scheduleEntry.matchId.name,
	 	timestamp = matches[i].timestamp,
	   	match = this.dates[timestamp][matchId];

		// there's only one instance of non-test matches
		if( $.inArray( matchId, matchIds ) === -1 )
		{
			var matchModel = match.getFullModel();
			matchModel.label = matches[i].label;
			matchModel.tournamentLabel = matches[i].tournamentLabel;

			// if the metaschedule says this is a result-only match, don't include the match link
			matchModel.matchLink = this.data.matches[i].resultOnly ? "" : matchModel.matchLink;

			if ( matchModel.team1id in model )
			{
				model[ matchModel.team1id ].matches.push( matchModel );
			}
			else
			{
				model[ matchModel.team1id ] = { matches: [ matchModel ],
												team : {
														id : matchModel.team1id,
														fullName : matchModel.team1fullName,
														abbreviation : matchModel.team1abbr
														}
												}
			}

			if ( matchModel.team2id in model )
			{
				model[ matchModel.team2id ].matches.push( matchModel );
			}
			else
			{
				model[ matchModel.team2id ] = { matches: [ matchModel ],
												team : {
														id : matchModel.team2id,
														fullName : matchModel.team2fullName,
														abbreviation : matchModel.team2abbr
														}
												}
			}

			matchIds.push( matchId );
		}
	}

 	return model;
};

/**
 * 	Returns an array of match models
 * 	For test matches, it checks the date and ignores previous day isntances
 */
PULSE.CLIENT.CRICKET.AllMatches.prototype.getUpcomingModel = function( limit )
{
	var matches = this.data.matches,
		model  	= { matches: [] },
		count 	= 0;

	if( !matches )
	{
		return model;
	}

	for( var i = 0, iLimit = this.data.matches.length; i < iLimit; i++ )
	{
		var matchId 	= matches[i].scheduleEntry.matchId.name,
		 	timestamp 	= matches[i].timestamp,
		 	date 		= PULSE.CLIENT.DateUtil.parseDateTime( timestamp ),
			now 		= new Date(),
		   	match 		= this.dates[timestamp][matchId];

		// for test matches, check the date to find out if they're still upcoming
		if( ( (match.getMatchType() === 'TEST' || match.getMatchType() === "FIRST_CLASS") && date - now < 3600000 ) || ( match.getMatchType() !== 'TEST'  && match.getMatchType() !== "FIRST_CLASS" && match.getMatchState() === 'L' ) )
		{
			continue;
		}

		var matchModel = match.getFullModel();

		matchModel.label = matches[i].label;
		matchModel.tournamentLabel = matches[i].tournamentLabel;

		// if the metaschedule says this is a result-only match, don't include the match link
		matchModel.matchLink = this.data.matches[i].resultOnly ? "" : matchModel.matchLink;

		model.matches.push( matchModel );

		count++;
		if( count === limit )
		{
			break;
		}
	}

 	return model;
};

/*
 *	Given a region ID, returns the countries in that region
 */

PULSE.CLIENT.CRICKET.AllMatches.prototype.getCountriesForRegion = function( regionId )
{
	var that  		= this,
		meta  		= this.meta;
	if( regionId && meta )
	{
		for( var i = 0, iLimit = meta.venues.regions.length; i < iLimit; i++ )
		{
			var region = meta.venues.regions[i];
			if( region.id == regionId )
			{
				return region.countries;
			}
		}
	}
	return [];
};

PULSE.CLIENT.CRICKET.AllMatches.prototype.getVenuesForCountry = function( regionId, countryId )
{
	var countries = this.getCountriesForRegion( regionId );
	for( var i = 0, iLimit = countries.length; i < iLimit; i++ )
	{
		if( countries[i].id == countryId )
		{
			return countries[i].venues;
		}
	}
	return [];
};




/************
 *	API calls
 */
PULSE.CLIENT.CRICKET.AllMatches.prototype.getAPIUrl = function()
{
	return PULSE.CLIENT.isTest() ? this.testAPI : this.prodAPI;
};

PULSE.CLIENT.CRICKET.AllMatches.prototype.requestMetaScheduleMeta = function( options, start )
{

	this.metadataCallback 	= options.callback || 'onMetaScheduleMetadata';
	var params = options.params ? PULSE.CLIENT.Util.prepareParams( $.extend( options.params || {}, { callback: this.metadataCallback  } ) ) : ""

	this.metadataUrl 		= options.feedUrl  || this.getAPIUrl() + "meta" + params;
	this.feedMetadata 		= options.feedName || "metadata";
	this.metadataInterval 	= options.interval ? options.interval : 0; // don't repeat

	var target = options.target ? [ this ].concat( options.target ) : [ this ];

	this.dm.addFeed( this.feedMetadata, this.metadataUrl,
		this.metadataInterval, this.metadataCallback, target );

	if( start )
	{
		this.dm.start( this.metadataUrl );
	}

};

PULSE.CLIENT.CRICKET.AllMatches.prototype.requestMetaScheduleData = function( options, start )
{
	this.metaScheduleCallback 	= options.callback || 'onMetaScheduleData';
	var params = options.params ? PULSE.CLIENT.Util.prepareParams( $.extend( options.params || {}, { callback: this.metaScheduleCallback  } ) ) : "";

	if( $.inArray( options.feedName, this.feedMetaSchedule ) === -1 )
	{
		this.feedMetaSchedule.push( options.feedName );
	}

	this.metaScheduleUrl 		= options.feedUrl  || this.getAPIUrl() + "data" + params;
	this.metaScheduleInterval 	= options.interval ? options.interval : 0; // don't repeat

	var target = options.target ? [ this ].concat( options.target ) : [ this ];

	this.dm.addFeed( options.feedName || this.feedMetaSchedule[0], this.metaScheduleUrl,
		this.metaScheduleInterval, this.metaScheduleCallback, target );

	if( start )
	{
		this.dm.start( this.metaScheduleUrl );
	}
};

PULSE.CLIENT.CRICKET.AllMatches.prototype.getMatchTypeIdFromType = function(type)
{
  var id;

  if (this.meta.matchTypes ) {

  	var matchTypes = this.meta.matchTypes;

  	for (var _i=0, _length = matchTypes.length; _i < _length; _i++) {

  		var match = matchTypes[_i];
  		if ( match.name.toUpperCase() === type.toUpperCase() ) {

  			id = match.id;
  			break;
  		}
  	}
  }

  return id;
};
if (!PULSE)                 { var PULSE = {}; }
if (!PULSE.CLIENT)          { PULSE.CLIENT = {}; }
if (!PULSE.CLIENT.CRICKET)  { PULSE.CLIENT.CRICKET = {}; }

/**
 * Component that, given an array of tournament objects, requests and combines their schedules
 * into one big model that can be queried
 * @constructor
 * @param {Array} tournaments - instances of PULSE.CLIENT.CRICKET.Tournament
 */
PULSE.CLIENT.CRICKET.CombinedMatches = function( tournaments )
{
    this.tournaments = tournaments;

    this.tournamentNames = $.map( this.tournaments, function( tournament, i )
    {
        return tournament.tournamentName;
    } );

    this.upcoming = [];
    this.live = [];
    this.complete = [];

    this.matchSchedules = 0;

    this.setSubscriptions();
};

PULSE.CLIENT.CRICKET.CombinedMatches.prototype.requestData = function( start )
{
    for( var i = 0, iLimit = this.tournaments.length; i < iLimit; i++ )
    {
        var tournament = this.tournaments[i];
        tournament.getMatchSchedule( start );
    }
};

PULSE.CLIENT.CRICKET.CombinedMatches.prototype.setSubscriptions = function()
{
    var that = this;
    $('body').on( 'schedule/update', function( e, params )
    {
        if( !that.ready )
        {
            if( $.inArray( params.tournamentName, that.tournamentNames ) > -1 )
            {
                that.matchSchedules++;
                if( that.matchSchedules === that.tournaments.length )
                {
                    that.ready = true;
                    that.storeMatches();
                    PULSE.CLIENT.notify( 'combined-matches/update', {
                        success: true,
                        tournamentNames: that.tournamentNames
                    } );
                }

            }
        }
        else
        {
            PULSE.CLIENT.notify( 'combined-matches/update', {
                success: true,
                tournamentNames: that.tournamentNames
            } );
        }
    } );
};

PULSE.CLIENT.CRICKET.CombinedMatches.prototype.isReady = function()
{
    return this.ready;
};

/**
 * Quick handle function with no filtering, just returning live and upcoming mathces,
 * in chronological order, so no further sorting/filtering is required
 * @return {Array<PULSE.CLIENT.CRICKET.Match>} the array of matches
 */
PULSE.CLIENT.CRICKET.CombinedMatches.prototype.getSchedule = function()
{
    return [].concat( this.live, this.upcoming );
};

/**
 * Quick handle function with no filtering, just returning complete mathces,
 * in inverse-chronological order, with no filtering required
 * @return {Array<PULSE.CLIENT.CRICKET.Match>} the array of matches
 */
PULSE.CLIENT.CRICKET.CombinedMatches.prototype.getResults = function()
{
    return this.getMatches( { reverse: true, matchState: 'C' } );
};

PULSE.CLIENT.CRICKET.CombinedMatches.prototype.getMatchById = function( matchId )
{
    for( var i = 0, iLimit = this.tournaments.length; i < iLimit; i++ )
    {
        var t = this.tournaments[ i ];
        var match = t.getMatchById( matchId );
        if( match )
        {
            return match;
        }
    }
};

/**
 * Sort matches given certain criteria
 * @param  {Object} filter
 * @param  {Boolean} filter.reverse  Whether the matches should be in chronological (false) or inverse chronological (true) order
 * @param  {String} filter.matchType Whether the list should be of a given type.
 * @param  {String} tournamentId Whether the list should only be of matches with a specific tournament.
 * @param  {String} venueId Whether the list should only be of matches with a specific venue.
 * @return {Array<PULSE.CLIENT.CRICKET.Match>}  return all matches that match the given criteria.
 */
PULSE.CLIENT.CRICKET.CombinedMatches.prototype.getMatches = function( filter )
{
    filter = filter || {};

    var matches = [];

    if( filter.matchState )
    {
        var allMatches = this.getMatchesForState( filter.matchState );
        matches = this.sort( allMatches, filter );
    }
    else
    {
        var upcoming = this.sort( this.upcoming, filter );
        var live = this.sort( this.live, filter );
        var complete = this.sort( this.complete, filter );

        if( filter.reverse )
        {
            matches = matches.concat( upcoming, live, complete );
        }
        else
        {
            matches = matches.concat( complete, live, upcoming );
        }
    }

    return matches;
};

PULSE.CLIENT.CRICKET.CombinedMatches.prototype.sort = function( allMatches, filter )
{
    if( !filter )
    {
        filter = {};
    }

    var teamId = filter.teamId;
    var tournamentId = filter.tournamentId;
    var venueId = filter.venueId;

    var matches = [];

    for( var i = 0, iLimit = allMatches.length; i < iLimit; i++ )
    {
        var match = allMatches[i];

        if( this.matchTeamByName( match, teamId )
            && ( !tournamentId || match.tournamentName == tournamentId || match.tournament.tournamentName === tournamentId )
            && ( !venueId || match.scheduleData.venue.id == venueId ))
        {
            matches.push( match );
        }

    }

    matches.sort( filter.reverse ? this.sortMatchesByDateDescending : this.sortMatchesByDateAscending );

    return matches;
};

PULSE.CLIENT.CRICKET.CombinedMatches.prototype.matchTeamByName = function( match, teamName )
{
    if( !teamName )
    {
        return true;
    }
    else if( match.scheduleData.team1 && match.scheduleData.team1.team.fullName == teamName )
    {
        return true;
    }
    else if( match.scheduleData.team2 && match.scheduleData.team2.team.fullName == teamName )
    {
        return true;
    }

    return false;
};

PULSE.CLIENT.CRICKET.CombinedMatches.prototype.getMatchesForState = function( matchState )
{
    switch( matchState )
    {
        case 'U':
            return this.upcoming;
            break;
        case 'L':
            return this.live;
            break;
        case 'C':
            return this.complete;
            break;
    }
};

/**
 * Retrieves the latest match that is upcoming
 * @param  {Object} filter - optional filter by teamId, teamIds, venueId or groupId
 * @return {Object}        - instance of PULSE.CLIENT.CRICKET.Match
 */
PULSE.CLIENT.CRICKET.CombinedMatches.prototype.getNextMatch = function( filter )
{
    if ( this.upcoming.length )
    {
        if( filter )
        {
            var teamId = filter.teamId;
            var venueId = filter.venueId;
            var groupId = filter.groupId;
            var teamIds = filter.teamIds;

            for( var i = 0, iLimit = this.upcoming.length; i < iLimit; i++ )
            {
                var match = this.upcoming[ i ];

                if( ( !teamId || match.hasTeamWithId( teamId ) ) &&
                    ( !venueId || match.hasVenueWithId( venueId ) )  &&
                    ( !groupId || match.hasGroupWithId( groupId ) ) &&
                    ( ( match.getTeamId( 0 ) < 0 && match.getTeamId( 1 ) < 0 ) ||
                        !_.isArray( teamIds ) ||
                        teamIds.length === 0 ||
                        -1 < PULSE.CLIENT.fuzzyInArray( match.getTeamId( 0 ), teamIds ) ||
                        -1 < PULSE.CLIENT.fuzzyInArray( match.getTeamId( 1 ), teamIds ) ) )
                {
                    return match;
                }
            }
        }
        else
        {
            return this.upcoming[ 0 ];
        }
    }
};

/**
 * Retrieves the latest match that has finished
 * @param  {Object} filter - optional filter by teamId, teamIds, venueId or groupId
 * @return {Object}        - instance of PULSE.CLIENT.CRICKET.Match
 */
PULSE.CLIENT.CRICKET.CombinedMatches.prototype.getLastMatch = function( filter )
{
    if ( this.complete.length )
    {
        if( filter )
        {
            var teamId = filter.teamId;
            var venueId = filter.venueId;
            var groupId = filter.groupId;
            var teamIds = filter.teamIds;

            for( var i = this.complete.length - 1; i >= 0; i-- )
            {
                var match = this.complete[ i ];

                if( ( !teamId || match.hasTeamWithId( teamId ) ) &&
                    ( !venueId || match.hasVenueWithId( venueId ) )  &&
                    ( !groupId || match.hasGroupWithId( groupId ) ) &&
                    ( ( match.getTeamId( 0 ) < 0 && match.getTeamId( 1 ) < 0 ) ||
                        !_.isArray( teamIds ) ||
                        teamIds.length === 0 ||
                        -1 < PULSE.CLIENT.fuzzyInArray( match.getTeamId( 0 ), teamIds ) ||
                        -1 < PULSE.CLIENT.fuzzyInArray( match.getTeamId( 1 ), teamIds ) ) )
                {
                    return match;
                }
            }
        }
        else
        {
            return this.complete[ this.complete.length - 1 ];
        }
    }
};

/**
 * Save the matches from all the tournaments given into three arrays:
 *     upcoming (for matches in the future)
 *     live (for current matches)
 *     complete (for matches which have ended)
 */
PULSE.CLIENT.CRICKET.CombinedMatches.prototype.storeMatches = function()
{
    var upcoming = [];
    var live = [];
    var complete = [];

    for( var i = 0, iLimit = this.tournaments.length; i < iLimit; i++ )
    {
        var tournament = this.tournaments[i];

        upcoming = $.map( tournament.upcomingMatches, function( matchId, i )
        {
            return tournament.getMatchById( matchId );
        } );
        this.upcoming = this.upcoming.concat( upcoming );

        live = $.map( tournament.liveMatches, function( matchId, i )
        {
            return tournament.getMatchById( matchId );
        } );
        this.live = this.live.concat( live );

        complete = $.map( tournament.completeMatches, function( matchId, i )
        {
            return tournament.getMatchById( matchId );
        } );
        this.complete = this.complete.concat( complete );
    }

    this.upcoming = this.sort( this.upcoming );
    this.live = this.sort( this.live );
    this.complete = this.sort( this.complete );
};

PULSE.CLIENT.CRICKET.CombinedMatches.prototype.sortMatchesByDateAscending = function( a, b )
{
    var aDate = PULSE.CLIENT.DateUtil.parseDateTime( a.getMatchDate() ),
        bDate = PULSE.CLIENT.DateUtil.parseDateTime( b.getMatchDate() );
    if( aDate > bDate )
    {
        return 1;
    }
    else if( aDate < bDate )
    {
        return -1;
    }
    return 0;
};

PULSE.CLIENT.CRICKET.CombinedMatches.prototype.sortMatchesByDateDescending = function( a, b )
{
    var aDate = PULSE.CLIENT.DateUtil.parseDateTime( a.getMatchDate() ),
        bDate = PULSE.CLIENT.DateUtil.parseDateTime( b.getMatchDate() );
    if( aDate < bDate )
    {
        return 1;
    }
    else if( aDate > bDate )
    {
        return -1;
    }
    return 0;
};

/**
 * @param {Array<PULSE.CLIETN.CRICKET.Match>} matches
 * @param {Number} pageSize
 * @param {Number} pageIndex  the zero-based number of the page
 */
PULSE.CLIENT.CRICKET.CombinedMatches.prototype.getPage = function( matches, pageSize, pageIndex )
{
    var index = pageIndex * pageSize;
    return matches.slice( index, index + pageSize );
};

/**
 * Passed an array of matches to collate a list of tournaments.
 * @param  {array} matches Array of matches.
 * @return {array}         Array of tournament name strings.
 */
PULSE.CLIENT.CRICKET.CombinedMatches.prototype.getTournamentListFromMatches = function( matches )
{
    var matches = matches,
        tournaments = [],
        tournamentIds = [],
        i, id, label, tournament;

    for( i = 0, iLimit = matches.length; i < iLimit; i++ )
    {
        id = matches[i].matchId.slice( 0, _.lastIndexOf( matches[i].matchId, '-' ) );
        label =  matches[i].tournamentLabel;
        tournament = { 'label':label, 'id':id };

        // Push the id to an array if the array does not already contain it
        if( tournament && $.inArray( id, tournamentIds ) == -1 )
        {
            tournaments.push( tournament );
            tournamentIds.push( id );
        }
    }

    tournaments.sort(function( a, b )
    {
        return ( a.label > b.label ) ? 1 : ( ( b.label > a.label ) ? -1 : 0 );
    } );

    return tournaments;
};

/**
 * Passed an array of matches to collate a list of teams.
 * @param  {array} matches Array of matches.
 * @return {array}         Array of team name strings.
 */
PULSE.CLIENT.CRICKET.CombinedMatches.prototype.getTeamListFromMatches = function( matches )
{
    var matches = matches,
        teams = [],
        teamIds = [];

    for( var i = 0, iLimit = matches.length; i < iLimit; i++ )
    {
        var id1 = matches[i].team1id,
            name1 =  matches[i].team1fullName,
            team1 = { 'name':name1, 'id':id1 };

        if( team1  &&  team1.name != 'TBD'  &&  $.inArray(name1, teamIds ) == -1 )
        {
            teams.push( team1 );
            teamIds.push( name1 );
        }

        var id2 = matches[i].team2id,
            name2 =  matches[i].team2fullName,
            team2 = { 'name':name2, 'id':id2 };

        if( team2 &&  team2.name != 'TBD'  &&  $.inArray(name2, teamIds ) == -1 )
        {
            teams.push( team2 );
            teamIds.push( name2 );
        }
    }

    teams.sort(function(a,b)
    {
        return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
    } );

    return teams;
};

/**
 * Passed an array of matches to collate a list of venues played at.
 * @param  {array} matches Array of matches.
 * @return {array}         Array of venue objects.
 */
PULSE.CLIENT.CRICKET.CombinedMatches.prototype.getVenueListFromMatches = function( matches )
{
    var matches = matches,
        venues = [],
        venueIds = [];

    for( var i = 0, iLimit = matches.length; i < iLimit; i++ )
    {
        var venue = matches[i].venue,
            venueId = matches[i].venue.fullName;

        if( venue && $.inArray( venueId, venueIds ) == -1 )
        {
            venues.push( venue );
            venueIds.push( venue.fullName );
        }
    }

    venues.sort(function(a,b)
    {
        return (a.fullName > b.fullName) ? 1 : ((b.fullName > a.fullName) ? -1 : 0);
    } );

    return venues;
};
if (!PULSE)         { var PULSE = {}; }
if (!PULSE.CLIENT)  { PULSE.CLIENT = {}; }

// only one instance of the instagram model needed
PULSE.CLIENT.getInstagramInstance = function()
{
    if( !window.Instagram )
    {
        window.Instagram = new PULSE.CLIENT.Instagram();
    }
    return window.Instagram;
};

PULSE.CLIENT.Instagram = function()
{
    this.userMediaListData = {};
    this.dm = PULSE.CLIENT.getDataManager();
    this.urlGenerator = PULSE.CLIENT.CRICKET.getUrlGenerator();
};

PULSE.CLIENT.Instagram.prototype.onData = function( data, id )
{
    if( id.startsWith( 'media_account' ) )
    {
        var account = id.substring( 14 );
        this.userMediaListData[ account ] = data.data || [];

        PULSE.CLIENT.notify( 'instagram/user/latest', { success: true, account: account } );
    }
};

PULSE.CLIENT.Instagram.prototype.onError = function( id )
{
    if( id.startsWith( 'media_account' ) )
    {
        var account = id.substring( 14 );
        PULSE.CLIENT.notify( 'instagram/user/latest', { success: false, account: account } );
    }
};

PULSE.CLIENT.Instagram.prototype.getMediaListDataForUser = function( account, options )
{
    if( !options )
    {
        options = {};
    }

    options = $.extend( options, { callback: "onInstagram" } );
    options.interval = typeof options.interval !== "undefined" ? options.interval : 60;

    var url = this.urlGenerator.makeInstagramAccountUrl( account );

    this.dm.addFeed( 'media_account-' + account, url, options.interval, options.callback,
        [ this ].concat( options.targets || [] ) );

    if( options.start )
    {
        this.dm.start( url );
    }
};

PULSE.CLIENT.Instagram.prototype.stopMediaListDataForUser = function( account )
{
    var url = this.urlGenerator.makeInstagramAccountUrl( account );
    this.dm.stop( url );
};

PULSE.CLIENT.Instagram.prototype.getMediaListModelForUser = function( account, limit )
{
    var model = { items: [] };

    var data = this.userMediaListData[ account ];
    if( data )
    {
        model.items = this.getMediaListForUser( data, limit );
    }

    return model;
};

PULSE.CLIENT.Instagram.prototype.getMediaListForUser = function( data, limit )
{
    var items = [];
    var iLimit = Math.min( limit, data.length );
    for( var i = 0; i < iLimit; i++ )
    {
        var item = data[ i ];
        items.push( this.getMediaItemModel( item ) );
    }

    return items;
};

PULSE.CLIENT.Instagram.prototype.getMediaItemModel = function( itemData )
{
    var date = new Date( itemData.created_time * 1000 );
    var timestamp = PULSE.CLIENT.DateUtil.getSinceString( date );
    return $.extend( { timestamp: timestamp }, itemData );
};
if ( !PULSE )        		{ var PULSE = {}; }
if ( !PULSE.CLIENT ) 		{ PULSE.CLIENT = {}; }
if ( !PULSE.CLIENT.Poll ) 	{ PULSE.CLIENT.Poll = {}; }

/**
 * Handles the data-retrieval and processing for a poll
 * @constructor
 * @param {Object} config includes the name of the poll, used as the ID of the data feed
 *                        as well as feed options (url, interval, start)
 */
PULSE.CLIENT.Poll.Model = function( container, config )
{
	this.$container = $( container );
	this.config 	= config;
	this.name 		= config.name || 'poll';
	this.url 		= config.url;
	this.interval 	= config.interval || 60;

	if( !config.popupQuestionId )
	{
		this.pqid = undefined;
	}
	else
	{
		/**
		 * The popupQuestionId
		 * @type {String}
		 */
		this.pqid = config.popupQuestionId;
	}

	if( !config.answeredQuestions )
	{
		this.answeredQuestions = [];
	}
	else
	{
		/**
		 * The questions the user's already answered; running through the array
		 * to turn any strings into Numbers
		 * @type {Array<Number>}
		 */
		this.answeredQuestions = $.map( config.answeredQuestions, function( stringId, i )
		{
			return parseInt( stringId, 10 );
		} );
	}

	this.data = {
		results: []
	};

	this.dm = PULSE.CLIENT.getDataManager();
	this.dm.addFeed( this.name, this.url, this.interval, 'onPollCallback', [ this ] );

	if( this.config.start )
	{
		this.dm.start( this.url );
	}

	/**
	 * Defer poll PQID setup so poll/data notifications get set first
	 */
	var that = this;
	this.$container.on( 'poll/data', function( e, params )
	{
		if( params.poll === that.name )
		{
			that.setPQId( that.data.popupQuestionId );
		}
	} );
};

/**
 * Sets the popupQuestionId; avoid using externally!
 * @param {Number} newId  the new popupQuestionId
 */
PULSE.CLIENT.Poll.Model.prototype.setPQId = function( newId )
{
	if( typeof newId === 'undefined' )
	{
		this.$container.trigger( 'poll/popup/removed', {
			poll: this.name
		} );
	}
	else if( this.pqid != newId && _.indexOf( this.answeredQuestions, this.pqid ) === -1 )
	{
		this.$container.trigger( 'poll/popup/new', {
			poll: this.name,
			popupQuestionId: newId
		} );
	}

	this.pqid = newId;
};

PULSE.CLIENT.Poll.Model.prototype.addAnsweredQuestion = function( questionId )
{
	if( typeof questionId === 'undefined' )
	{
		return;
	}

	questionId = parseInt( questionId, 10 );
	this.answeredQuestions.push( questionId );
};

PULSE.CLIENT.Poll.Model.prototype.onData = function( data, id )
{
	if( id === this.name )
	{
		if( data && data[0] )
		{
			this.data = data[0];

			this.$container.trigger( 'poll/data', {
				poll: id
			} );
		}
		else
		{
			this.$container.trigger( 'poll/error', {
				poll: id,
				type: 'no data'
			} );
		}
	}
};

PULSE.CLIENT.Poll.Model.prototype.onError = function( data, id )
{
	if( id === this.name )
	{
		this.$container.trigger( 'poll/error', {
			poll: id,
			type: 'unable to retrieve file'
		} );
	}
};

PULSE.CLIENT.Poll.Model.prototype.getQuestions = function( type )
{
	var questions = this.data.results;
	if( !questions )
	{
		return [];
	}
	if( !type || -1 === _.indexOf( [ 'answered', 'unanswered' ], type ) )
	{
		return questions;
	}

	var getAnswered = type === 'answered';

	var that = this;
	return $.grep( questions, function( q, i )
	{
		var isAnswered = -1 < _.indexOf( that.answeredQuestions, q.id );
		return getAnswered ? isAnswered : !isAnswered;
	} );
};

PULSE.CLIENT.Poll.Model.prototype.getLatestQuestion = function( type )
{
    return _.last( this.getQuestions( type ) );
};

PULSE.CLIENT.Poll.Model.prototype.getQuestionById = function( questionId )
{
	var questions = this.getQuestions();
	for( var i = 0, iLimit = questions.length; i < iLimit; i++ )
	{
		if( questions[i].id === +questionId )
		{
			return questions[i];
		}
	}
};

PULSE.CLIENT.Poll.Model.prototype.getOptions = function( questionId )
{
	var question = this.getQuestionById( questionId );
	if( question )
	{
		return question.options;
	}
	else
	{
		return [];
	}
};

PULSE.CLIENT.Poll.Model.prototype.getPopupQuestion = function()
{
	return this.getQuestionById( this.data.popupQuestionId );
};
if (!PULSE) 		{ var PULSE = {}; }
if (!PULSE.CLIENT) 	{ PULSE.CLIENT = {}; }

/**
 * Ensure only one instance of the twitter object is ever used
 * @return {Object} the Twitter "singleton"
 */
PULSE.CLIENT.getTwitterInstance = function()
{
	if( !window.Twitter )
	{
		window.Twitter = new PULSE.CLIENT.Twitter();
	}
	return window.Twitter;
};

/**
 * Data-handler/model-maker for Canary-produced Twitter data
 * @constructor
 */
PULSE.CLIENT.Twitter = function()
{
	/**
     * Stores twitter list data, with the feed name (folder) as key and
     * the array of tweets as the stored value
     * @dict
     */
    this.listData = {};

    /**
     * Stores twitter tally/count totals, with feed name (folder) as key and
     * the total (integer) as the stored value
     * @dict
     */
    this.tallyData = {};

    /**
     * Stores twitter ranked topics data, with feed name as key and the
     * array of ranked entries as the stored value
     * @dict
     */
    this.trendingData = {};

    /**
     * Stores twitter historical data, with feed name as key and the
     * array of ranked entries as the stored value
     * @dict
     */
    this.historicalData = {};

    /**
     * The instance of the data manager
     * @type {Object}
     */
    this.dm = PULSE.CLIENT.getDataManager();

    /**
     * The instance of the URL generator
     * @type {Object}
     */
    this.urlGenerator = PULSE.CLIENT.CRICKET.getUrlGenerator();
};


PULSE.CLIENT.Twitter.prototype.onData = function( data, id )
{
	if( id.startsWith( 'list_' ) )
	{
		var name = id.substring( 5 );
		this.listData[ name ] = data;
		PULSE.CLIENT.notify( 'twitter/list', { success: true, name: name } );
	}
	else if( id.startsWith( 'tally_' ) )
	{
		var name = id.substring( 6 );
		this.tallyData[ name ] = data.total;
		PULSE.CLIENT.notify( 'twitter/tally', { success: true, name: name } );
	}
    else if( id.startsWith( 'trending_' ) )
    {
        var name = id.substring( 9 );
        this.trendingData[ name ] = data.entries;
        PULSE.CLIENT.notify( 'twitter/trending', { success: true, name: name } );
    }
    else if( id.startsWith( 'history_' ) )
    {
        var name = id.substring( 8 );
        this.historicalData[ name ] = data.data;
        PULSE.CLIENT.notify( 'twitter/history', { success: true, name: name } );
    }
};

PULSE.CLIENT.Twitter.prototype.onError = function( id )
{
	if( id.startsWith( 'list_' ) )
	{
		var name = id.substring( 5 );
		PULSE.CLIENT.notify( 'twitter/list', { success: false, name: name } );
	}
	else if( id.startsWith( 'tally_' ) )
	{
		var name = id.substring( 6 );
		PULSE.CLIENT.notify( 'twitter/tally', { success: false, name: name } );
	}
    else if( id.startsWith( 'trending_' ) )
    {
        var name = id.substring( 9 );
        PULSE.CLIENT.notify( 'twitter/trending', { success: false, name: name } );
    }
    else if( id.startsWith( 'history_' ) )
    {
        var name = id.substring( 8 );
        PULSE.CLIENT.notify( 'twitter/history', { success: false, name: name } );
    }
};

PULSE.CLIENT.Twitter.prototype.getList = function( name, options )
{
	if( !options )
	{
		return;
	}

	options = $.extend( options, { callback: "onTwitter", fileName: ( options.fileName || ( name + "_list" ) ) + "/tweetList" } );
	options.interval = typeof options.interval !== "undefined" ? options.interval : 20;
	this.getFeed( name, 'list', options );
};

PULSE.CLIENT.Twitter.prototype.stopList = function( name, options )
{
    if( !options )
    {
        return;
    }

    $.extend( options, { fileName: ( options.fileName || ( name + "_list" ) ) + "/tweetList" } );
    this.stopFeed( name, 'list', options );
};

PULSE.CLIENT.Twitter.prototype.getTally = function( name, options )
{
	if( !options )
	{
		return;
	}

	options = $.extend( options, { callback: "onTweetTotal", fileName: ( options.fileName || ( name + "_count" ) ) + "/tally" } );
	options.interval = typeof options.interval !== "undefined" ? options.interval : 5;
	this.getFeed( name, 'tally', options );
};

PULSE.CLIENT.Twitter.prototype.getTrending = function( name, options )
{
    if( !options )
    {
        return;
    }

    options = $.extend( options, { callback: "onRanking", fileName: ( options.fileName || ( name + "_buzz" ) ) + "/tweetRanking" } );
    options.interval = typeof options.interval !== "undefined" ? options.interval : 20;
    this.getFeed( name, 'trending', options );
};

PULSE.CLIENT.Twitter.prototype.getHistory = function( name, options )
{
    if( !options )
    {
        return;
    }

    options = $.extend( options, { callback: "onHistoryData", fileName: ( options.fileName || ( name + "_history" ) ) + "/history" } );
    options.interval = typeof options.interval !== "undefined" ? options.interval : 30;
    this.getFeed( name, 'history', options );
};

// type can be 'list', 'history', 'tally' etc.
PULSE.CLIENT.Twitter.prototype.getFeed = function( name, type, options )
{
	var feed = this.urlGenerator.makeTwitterDataUrl( options.fileName );
	this.dm.addFeed( type + "_" + name, feed, options.interval, options.callback, [ this ].concat( options.targets || [] ) );

	if( options.start )
	{
		this.dm.start( feed );
	}
};

PULSE.CLIENT.Twitter.prototype.stopFeed = function( name, type, options )
{
    var feed = this.urlGenerator.makeTwitterDataUrl( options.fileName );
    this.dm.stop( feed );
};


/**
 *
 * TWITTER AND CANARY MODELS
 *
 */

PULSE.CLIENT.Twitter.prototype.getTweetCount = function( name )
{
	var tweetCount = this.tallyData[ name ];
	if( tweetCount )
	{
		return PULSE.CLIENT.Util.addCommaForThousands( tweetCount );
	}
	return "";
};

PULSE.CLIENT.Twitter.prototype.getTweetsListModel = function( name, limit )
{
	var array = this.getTweetsArray( this.listData[ name ], limit );

	return { tweets: array };
};



PULSE.CLIENT.Twitter.prototype.getTweetsArray = function( data, limit )
{
    if( !data ) return;

    if( !limit || limit > data.length )
    {
        limit = data.length;
    }

    var array = [];
    for( var i = data.length - 1; i >= data.length - limit; i-- )
    {
        var tweet = data[i];
        var model = PULSE.CLIENT.Twitter.getTweetModel( tweet );

        array.push( model );
    }

    return array;
};

PULSE.CLIENT.Twitter.getTweetModel = function( tweet )
{
    var TC = PULSE.CLIENT.TwitterController,
        userAccountLink = TC.getUserAccountUrl( tweet.user.screen_name ),
        tweetDate = TC.parseTwitterDate( tweet.created_at ),
        timestamp = PULSE.CLIENT.DateUtil.getSinceString( tweetDate ),
        photo = '',
        extended_media = [],
        model;

    if( tweet.entities && tweet.entities.media )
    {
        for( var i = 0, iLimit = tweet.entities.media.length; i < iLimit; i++ )
        {
            if( tweet.entities.media[i].type === 'photo' )
            {
                photo = tweet.entities.media[i].media_url;
            }
        }
    }

    if( tweet.extended_entities && tweet.extended_entities.media )
    {
        for( var i = 0, iLimit = tweet.extended_entities.media.length; i < iLimit; i++ )
        {
            var p = tweet.extended_entities.media[ i ];
            extended_media.push( p.media_url );
        }
    }

    model = {
        timestamp: timestamp,
        id: tweet.id_str,
        text: TC.markUpLinks( tweet.text ),
        link: TC.getPermalink( tweet ),
        photo: photo,
        extended_media: extended_media,
        user: {
            id: tweet.user.id_str,
            name: tweet.user.name,
            account: tweet.user.screen_name,
            link: userAccountLink,
            description: tweet.user.description,
            avatarUrl: tweet.user.profile_image_url
        },
        favorites: tweet.favorite_count,
        retweets: tweet.retweet_count
    };

    return model;
};

/**
 * Looks up account name in trending data array.
 *     - Returns early if no name is specified or no data exists.
 *     - If limit is specified will return top n number of entries.
 *     - If no limit is specified will return all entries in this file.
 *     - Adds percentage relative to the highest count.
 *
 * @param  {string} name  Account name string to lookup.
 * @param  {number} limit Number of entries to return.
 * @return {array}        Array of trending data entries at the specified length.
 */
PULSE.CLIENT.Twitter.prototype.getTrendingModel = function( name, limit )
{
    var model = { rankings: [] };
    if( name && this.trendingData[ name ] )
    {
        var array = this.trendingData[ name ],
            limit = limit || array.length,
            highest = array.length ? array[0].count : 0;

        model.rankings = array.slice( 0, limit )

        for( var i = 0; i < model.rankings.length; i++ )
        {
            var entry = model.rankings[i];
            entry.percentage =  Math.round( ( entry.count / highest ) * 100 ) + '%';
            entry.formattedCount = entry.count > 999 ? PULSE.CLIENT.Util.commafy( entry.count ) : entry.count;
        }
    }

    return model;
};

/**
 * Looksup historical data after it's been received and stored. Returns count values
 * based on resolution.
 * @param  {string} name  Value for looking up in historical data
 * @param  {number} limit Limitation of how many previous counts to return
 * @return {array}       Array of hsitoric counts
 */
PULSE.CLIENT.Twitter.prototype.getHistoricalModel = function( name, limit )
{
    var pools = this.historicalData[ name ];
    var model = { total: 0, buckets: [] };

    if( pools )
    {
        var iLimit = limit ? Math.min( limit, pools.length ) : pools.length;
        for( var i = 0; i < iLimit; i++ )
        {
            var pool = pools[i];
            if( pool.resolution && pool.resolution.unit === "MINUTE" )
            {
                model.buckets = $.map( pool.buckets, function( bucket ) {
                    return bucket.count;
                } );
                model.buckets = model.buckets.reverse();
            }
            else if( pool.resolution && pool.resolution.unit === "DAY" )
            {
                model.total = pool.buckets[0].count;
            }
        }
    }

    return model;
};
if (!PULSE)                             { var PULSE = {}; }
if (!PULSE.CLIENT)                      { PULSE.CLIENT = {}; }
if (!PULSE.CLIENT.CRICKET)      { PULSE.CLIENT.CRICKET = {}; }

PULSE.CLIENT.CRICKET.CountdownManager = function( $container )
{
        this.$container = $container
};

PULSE.CLIENT.CRICKET.CountdownManager.prototype.setConfig = function( config )
{
        this.config = config;
};

PULSE.CLIENT.CRICKET.CountdownManager.prototype.update = function()
{
        var that = this;

        this.$container.find('.dhms-container')
        .each(function()
        {
                var $element = $(this);

                that.initCountdown( $element );
        } );
};

PULSE.CLIENT.CRICKET.CountdownManager.prototype.initCountdown = function( $element )
{
        var that                = this,
                matchId         = $element.attr( 'data-match-id' ),
                matchDate       = $element.attr( 'data-match-date' ),
                id              = matchId + '-countdown';
                //$parent         = $element.parent();
        
        $element.find('.countdown').attr( 'id', id );

        //create countdown object if it doenst exist
        if( !this.countdown )
        {
                this.countdown = {};
        }


        if( !this.countdown[matchId] )
        {
                //create countdown for given matchId
                this.countdown[matchId] = {};

                // The time it takes for a flip, in ms
                // Instantiate the counter
                this.countdown[matchId].element = $element;

                this.countdown[matchId].countdownCounter = new PULSE.CLIENT.FlipCounter( '#' + id, 
                        this.config ); 

                this.countdown[matchId].controllerConfig =
                {
                        incrementing : false, // This is a countdown
                        format :  this.config.format || 'dddhhmm'
                };

                // Format
                this.countdown[matchId].countdownController = 
                        new PULSE.CLIENT.CountdownController(
                                this.countdown[matchId].countdownCounter, 
                                        this.countdown[matchId].controllerConfig );

                //Update / start the countdown
                var countingTo = +PULSE.CLIENT.DateUtil.parseDateTime( matchDate );

                // countingTo = (new Date( 2013, 2, 19, 8, 30, 10 ));
                
                this.countdown[matchId].countdownController.setTargetTimeMs( countingTo );
                
                this.countdown[matchId].countdownController.start( );
        }
        else
        {
                //this.countdown[matchId].element.detach().appendTo( $parent.empty() );
        }
};

if ( !PULSE )                   	{ var PULSE = {}; }
if ( !PULSE.CLIENT )            	{ PULSE.CLIENT = {}; }

PULSE.CLIENT.FlipTweetCounter = function ( container, config, tournament )
{
	this.$container = $( container );
	this.tournament = tournament;	
	this.config 	= config;
	this.feedName 	= config.feedName;
	this.template 	= config.template;
	
	// Instantiate the counter
	var tweetConfig = { 
        imgPrefix : 'http://static3.icc-cricket.com/resources/20/img/flip-counter/',
		flipTime: this.config.flipTime || 400 
	};  // The time it takes for a flip, in ms
	this.tweetCounter = new PULSE.CLIENT.FlipCounter( '#tweet-counter', tweetConfig );

	var controllerConfig = { showInterimValues: typeof this.config.showInterimValues === "undefined" ? false : true };
	this.tweetController = new PULSE.CLIENT.CounterController( this.tweetCounter, controllerConfig );

	// Add feeds to data manager
	this.tournament.getCanaryTallyData( this.feedName, true );

	// React to data updates
	this.setSubscriptions();
};

PULSE.CLIENT.FlipTweetCounter.prototype.setSubscriptions = function()
{
	var that = this;

	$('body').on( 'canary/tally', function( e, params ) {

		if( params.success && params.feedName === that.feedName )
		{
			that.refreshTweetCounter( params.total );
		} 
    } );
};

PULSE.CLIENT.FlipTweetCounter.prototype.refreshTweetCounter = function( total )
{
	if( typeof total !== "undefined" )
	{
		this.tweetController.setValue( total );
	}
};

if ( !PULSE )                       { var PULSE = {}; }
if ( !PULSE.CLIENT )                { PULSE.CLIENT = {}; }
if ( !PULSE.CLIENT.CRICKET )        { PULSE.CLIENT.CRICKET = {}; }

PULSE.CLIENT.CRICKET.Leaders = function ( container, config, tournament, options )
{
    this.$container = $( container );
    this.tournament = tournament;
    this.config     = config || {};
    this.statTypes  = options.statTypes;
    this.teamId     = config['data-team-id'] || options.teamId;
    this.imageSize  = options.imageSize || 284;
    this.limit      = options.limit || 3;
    this.widgetSize = options.widgetSize;

    this.urlGenerator = PULSE.CLIENT.CRICKET.getUrlGenerator( tournament );

    // React to data updates
    this.setSubscriptions();

    this.templates = {
        leaderCard:         'templates/stats/leader-card.html',
        mobileLeaderCard:   'templates/mobile/stats/leader-card-mobile.html',
        teamsLeaderCard:    'templates/stats/leader-card-team.html'
    };

    if( this.config.templates )
    {
        $.extend( this.templates, this.config.templates );
    }

    this.containers = {};
    for( var i = 0, iLimit = this.statTypes.length; i < iLimit; i++ )
    {
        // Add feeds
        this.tournament[ "get" + this.statTypes[i] + "Data" ]( false, this.config.start );
        this.containers[ this.statTypes[i] ] = this.$container.find( '.leaderCard' ).eq(i);
    }
};

PULSE.CLIENT.CRICKET.Leaders.prototype.setSubscriptions = function()
{
    var that = this;

    $('body').on( 'stats/update', function( e, params ) {
        if( params.success
            && params.tournamentName === that.tournament.tournamentName
            && $.inArray( params.statName, that.statTypes ) > -1 )
        {
            if( that.teamId )
            {
                that.refreshTeamLeaders( params.statName, params.url );
            }
            else
            {
                that.refreshLeaders( params.statName, params.url );
            }
        }
    } );
};


PULSE.CLIENT.CRICKET.Leaders.prototype.refreshTeamLeaders = function( statsName, statsDataName )
{
    var that  = this,
        model = this.tournament.getModelArrayFor( statsName, statsDataName, false, { limit: this.limit, teamId: this.teamId } );

    model.cardType = statsName;
    model.fullListLink = this.urlGenerator.getStatsUrlFor( statsName, this.tournament.year );
    model.tournament = this.tournament;

    PULSE.CLIENT.Template.publish(
        that.templates.teamsLeaderCard,
        that.containers[ statsName ],
        model,
        function() {
            var $container = that.containers[ statsName ];
            that.loadImages( $container, that.urlGenerator, that.imageSize );
        }
    );
};

PULSE.CLIENT.CRICKET.Leaders.prototype.refreshLeaders = function( statsName, statsDataName )
{
    var that  = this,
        model = this.tournament.getModelArrayFor( statsName, statsDataName, false, { limit: this.limit } ),
        template = this.widgetSize == 'mobile' ? this.templates.mobileLeaderCard : this.templates.leaderCard;

    model.cardType = statsName;
    model.fullListLink = this.urlGenerator.getStatsUrlFor( statsName, this.tournament.year );
    model.tournament = this.tournament;

    PULSE.CLIENT.Template.publish(
        template,
        that.containers[ statsName ],
        model,
        function() {
            var $container = that.containers[ statsName ];
            that.loadImages( $container, that.urlGenerator, that.imageSize );
        }
    );
};

PULSE.CLIENT.CRICKET.Leaders.prototype.loadImages = function( $container, urlGenerator, imgSize )
{
    $imgContainers = $container.find( '.imageContainer' );

    $imgContainers.each( function() {
        var playerId = $(this).attr( 'data-player-id' );
        urlGenerator.setPlayerImageLoader( playerId, imgSize, this );
    } );
};

if ( !PULSE )                   	{ var PULSE = {}; }
if ( !PULSE.CLIENT )            	{ PULSE.CLIENT = {}; }
if ( !PULSE.CLIENT.CRICKET )    	{ PULSE.CLIENT.CRICKET = {}; }
if ( !PULSE.CLIENT.CRICKET.Mobile ) { PULSE.CLIENT.CRICKET.Mobile = {}; }

PULSE.CLIENT.CRICKET.MatchList = function( container, config, tournament, options )
{
	// Contants
	this.$container = $( container );
	this.tournament = tournament;
	this.teamId 	= config['data-team-id'];
	
	this.widgetType = options.widgetType;
	this.maxMatches = options.maxMatches;
	this.matchesType = options.matchesType;
	this.reverseMatchOrder = options.reverseMatches;

	this.templates 	= {
		results: "templates/mobile/results.html",
		schedule: "templates/mobile/schedule.html"
	};
	
	this.tournament.getMatchSchedule();
	
	this.setSubscriptions();
};

PULSE.CLIENT.CRICKET.MatchList.prototype.setSubscriptions = function()
{
	var that = this;
	$('body').on( 'schedule/update', function( e, params ){
		that.populateTeams();
		that.refreshMatches();
	} );
};

PULSE.CLIENT.CRICKET.MatchList.prototype.populateTeams = function()
{
	var $teamsDropdown = this.$container.find( '.teamFilter select' );
	if( $teamsDropdown.length === 0 ) return;

	var that = this;
		teams = this.tournament.getTeamListFromSchedule( this.matchesType );

	$teamsDropdown.append( 
		$( '<option>' )
		.val( 'all' )
		.text( 'All Teams' )
	);

	for( var i = 0, iLimit = teams.length; i < iLimit; i++ )
	{
		var team = teams[i];
		$teamsDropdown.append( 
			$( '<option>' )
			.val( team.id )
			.text( team.fullName || team.fullname )
		);
	}

	$teamsDropdown.change( function() {
		that.teamId = $( this ).val();
		that.refreshMatches();
	} );
};

PULSE.CLIENT.CRICKET.MatchList.prototype.refreshMatches = function()
{
	var that = this,
		model = this.tournament.getMatchArrayModelForType( 
			this.matchesType, 
			this.reverseMatchOrder, 
			{ 
				limit: this.maxMatches, 
				teamId: this.teamId,
				dateFormat: "dddd, mmmm dS yyyy",
				timeFormat: "HH:MM"
			} 
		);

	PULSE.CLIENT.Template.publish( 
		that.templates[ that.widgetType ],
		that.$container.find( '.matchList' ),
		model
	);
};
if (!PULSE) 				{ var PULSE = {}; }
if (!PULSE.CLIENT) 			{ PULSE.CLIENT = {}; }
if (!PULSE.CLIENT.CRICKET) 	{ PULSE.CLIENT.CRICKET = {}; }

PULSE.CLIENT.CRICKET.MetaSchedule = function( options )
{
	options = options || {};
	this.mdl = new PULSE.CLIENT.CRICKET.AllMatches();
	this.feedMetadata = options.metaFeedName || "metadata";
	this.feedMetaSchedule = options.dataFeedName || "metasched";
	this.currentMetaSchedId = options.metaSchedule || "icc";

	this.setSubscriptions();

	var thisDate = PULSE.CLIENT.DateUtil.getUtcDateObject( new Date() );

    var today = thisDate.format('yyyy-mm-dd'),
        sd = options.widgetConfig === 'metaschedule_widget' ? today : undefined,
        ed = options.widgetConfig === 'metaresults_widget' ? today : undefined;

	this.mdl.requestMetaScheduleMeta(
		{ // the request options
			params: { ms: this.currentMetaSchedId, sd: sd, ed: ed }, // required parameters by the API
			feedName: this.feedMetadata
		},
		true
	);


};

PULSE.CLIENT.CRICKET.MetaSchedule.prototype.setSubscriptions = function()
{
	var that = this;
	$('body').on( 'metaSchedule/meta', function( e, params ) {
		if( params.success )
		{
			// that.requestData();
		}
	} );
};

PULSE.CLIENT.CRICKET.MetaSchedule.prototype.onData = function( data, id )
{
	if( id === this.feedMetadata && data.metaResponse )
	{
		this.meta = data.metaResponse;
	}
	else if( id === this.feedMetaSchedule )
	{
		this.data = data.dataResponse;
	}
};

PULSE.CLIENT.CRICKET.MetaSchedule.prototype.requestData = function(params, name)
{
	var defaultParams = { "ms": this.currentMetaSchedId };
	var feedName = name ? name : this.feedMetaSchedule;

	if( params )
	{
		$.extend( defaultParams, params );
	}

	this.mdl.requestMetaScheduleData(
		{
			params: defaultParams,
			feedName: feedName,
			target: this
		},
		true // start it straight away
	);
};

PULSE.CLIENT.CRICKET.MetaSchedule.prototype.requestMetaData = function(params, name)
{
	var defaultParams = { "ms": this.currentMetaSchedId };
	var feedName = name ? name : this.feedMetaSchedule;

	if( params )
	{
		$.extend( defaultParams, params );
	}

	this.mdl.requestMetaScheduleMeta(
		{
			params: defaultParams,
			feedName: feedName,
			target: this
		},
		true // start it straight away
	);
};

if ( !PULSE )                       { var PULSE = {}; }
if ( !PULSE.CLIENT )                { PULSE.CLIENT = {}; }
if ( !PULSE.CLIENT.CRICKET )        { PULSE.CLIENT.CRICKET = {}; }

/**
 * Controls pagination
 * @param {Object} container Container of widget using the pagination
 * @param {String} paginationId A unique Id for the pagination
 * @param {Object} options Contains the following options for pagination:
 *
 * - {String} pageSize : The amount of entries per page
 * - {String} pageNum : The current page number
 * - {Object} $pagination : The overall pagination container
 * - {Object} $paginationSpan : The span of the pagination ( finds the span class, place that holds 1 of 1... )
 * - {Object} $paginationLeft : The pagination left arrow
 * - {Object} $paginationRight : The pagination right arrow
 * - {String} sectionClass : The class of the different sections/pages ( used to show hide the pages )
 */
PULSE.CLIENT.CRICKET.Pagination = function ( container, paginationId, config )
{
    this.$container = $( container );
    this.paginationId = paginationId;

    this.config = config;
    this.pageSize = 10;
    this.pageNum = 0;
    this.notify = true;
    this.doPaginationAction =  true;

    this.$pagination =  this.$container.find( '.pagePagination' );
    this.$paginationSpan = this.$pagination.find( 'span' );
    this.$paginationLeft = this.$pagination.find( '.paginationLeft' );
    this.$paginationRight = this.$pagination.find( '.paginationRight' );
    this.sectionClass = '.section';

    if ( this.config )
    {
        for ( var key in this.config )
        {
            if ( this[ key ] )
            {
                this[ key ] = this.config[ key ];
            }
        }
    }

    this.setListeners();

};

PULSE.CLIENT.CRICKET.Pagination.prototype.setListeners = function()
{
    var that = this;

    this.$paginationLeft.on( 'click', function( e )
    {
        e.preventDefault();

        that.$paginationRight.removeClass( 'inactive' );

        if ( that.pageNum > 0 )
        {
            that.pageNum--;
            if ( that.doPaginationAction )
            {
                that.doPagination();
            }
        }

        if ( that.pageNum === 0 )
        {
            that.$paginationLeft.addClass( 'inactive' );
        }

        if ( that.notify )
        {
            PULSE.CLIENT.notify( 'pagination', { success: true,
                                                id : that.paginationId,
                                                pageNum : that.pageNum } );
        }

    });

    this.$paginationRight.on( 'click', function( e )
    {
        e.preventDefault();

        that.$paginationLeft.removeClass( 'inactive' );

        if ( that.pageNum < that.maxPages - 1 )
        {
            that.pageNum++;
            if ( that.doPaginationAction )
            {
                that.doPagination();
            }
        }

        if ( that.pageNum === that.maxPages - 1 )
        {
            that.$paginationRight.addClass( 'inactive' );
        }

        if ( that.notify )
        {
            PULSE.CLIENT.notify( 'pagination', { success: true,
                                                id : that.paginationId,
                                                pageNum : that.pageNum } );
        }

    });
};

/**
 * Sorts out the pagination text and shows/hides the different sections
 */
PULSE.CLIENT.CRICKET.Pagination.prototype.doPagination = function()
{
    var sections = this.$container.find( this.sectionClass );

    this.setPaginationText();

    for ( var i = 0; i < sections.length; i++ )
    {
        if ( this.pageNum == $( sections[ i ] ).data( 'sectionid' ) )
        {
            $( sections[ i ] ).show();
        }
        else
        {
            $( sections[ i ] ).hide();
        }
    }
};

PULSE.CLIENT.CRICKET.Pagination.prototype.setPaginationText = function()
{
    this.$paginationSpan.text( ( this.pageNum + 1) + ' of ' + this.maxPages );
}

PULSE.CLIENT.CRICKET.Pagination.prototype.setPageNum = function( number )
{
    this.pageNum = number;

    this.$paginationRight.removeClass( 'inactive' );
    this.$paginationLeft.removeClass( 'inactive' );

    if ( this.pageNum === 0 )
    {
        this.$paginationLeft.addClass( 'inactive' );
    }

    if ( this.pageNum === this.maxPages - 1 )
    {
        this.$paginationRight.addClass( 'inactive' );
    }

    this.$paginationSpan.text( ( this.pageNum + 1) + ' of ' + this.maxPages );
}

PULSE.CLIENT.CRICKET.Pagination.prototype.show = function()
{
    this.$pagination.show();
}

/**
 * Determines whether to show/hide pagination and sets the maximum amount of pages
 * @param  {Array} results The full results to be rendered
 * ( used to work out the max amount of pages and whether show/hide pagination )
 */
PULSE.CLIENT.CRICKET.Pagination.prototype.render = function( results )
{
    this.results = results;
    this.contentAmount = this.results.length;
    // If the results are larger than the page size, then display the pagination.
    if ( this.results.length > this.pageSize )
    {
        this.$pagination.show();
        this.maxPages = Math.ceil( this.results.length / this.pageSize );
        this.$paginationSpan.text( ( this.pageNum + 1) + ' of ' + this.maxPages );
    }
    else
    {
        this.$pagination.hide();
    }
};

PULSE.CLIENT.CRICKET.Pagination.prototype.setContentAmount = function( size )
{
    this.contentAmount = size;
    // If the results are larger than the page size, then display the pagination.
    if ( this.contentAmount > this.pageSize )
    {
        this.$pagination.show();
        this.maxPages = Math.ceil( this.contentAmount / this.pageSize );
        this.$paginationSpan.text( ( this.pageNum + 1) + ' of ' + this.maxPages );
    }
    else
    {
        this.$pagination.hide();
    }
};
if ( !PULSE )                       { var PULSE = {}; }
if ( !PULSE.CLIENT )                { PULSE.CLIENT = {}; }
if ( !PULSE.CLIENT.CRICKET )        { PULSE.CLIENT.CRICKET = {}; }

/**
 * Widget for displaying a statistic for a single player.
 */
PULSE.CLIENT.CRICKET.PlayerStat = function ( container, config, tournament, tournamentGroup )
{
    this.$container = $( container );

    if ( !this.$container || this.$container.length < 1 )
    {
        return;
    }

    this.tournament = tournament;

    this.config = config;

    this.teamId = config.teamId;
    this.statClass = config.statClass;
    this.limit = config.limit || 10;

     if ( tournament )
    {
        this.photoUrl = tournament.playerImageUrl;
    }
    else
    {
        this.photoUrl = 'http://icc-corp-2013-live.s3.amazonaws.com/players/';
    }

    this.teamId = config.teamId;

    this.notify = config.notify

    this.tournamentGroup = tournamentGroup;
    if ( this.tournamentGroup )
    {
        this.tournamentGroupName = this.tournamentGroup.getName();
        this.urlGenerator = PULSE.CLIENT.CRICKET.getUrlGenerator( { tournamentGroup : this.tournamentGroup, playerImageUrl : this.photoUrl } );
    }
    else
    {
        var urlConfig = tournament;
        if ( !urlConfig )
        {
            urlConfig = {};
        }
        urlConfig.playerImageUrl = this.photoUrl;
        this.urlGenerator = PULSE.CLIENT.CRICKET.getUrlGenerator( tournament );
    }

    if ( this.tournamentGroup )
    {
        this.model = this.tournamentGroup;
    }
    else
    {
        this.model = this.tournament;
    }

    this.template =  config.template || 'templates/stats/player-card.html';
    this.type = config.type || 'default';

    this.urlPrefix = config.urlPrefix;

    this.header = config.header;

    this.statName = 'default';

    this.setSubscriptions();
    this.init();
};

PULSE.CLIENT.CRICKET.PlayerStat.prototype.statTypes = {

    //Batting
    BATTING_STATS               : 'batting-stats',
    BATTING_STATS_INNINGS       : 'batting-stats-innings',

    MOST_RUNS                   : 'most-runs',
    MOST_FOURS                  : 'most-fours',
    MOST_FOURS_INNINGS          : 'most-fours-innings',
    MOST_SIXES                  : 'most-sixes',
    MOST_SIXES_INNINGS          : 'most-sixes-innings',
    BATTING_STRIKE_RATE         : 'highest-strikerate',
    BATTING_STRIKE_RATE_INNINGS : 'highest-strikerate-innings',
    HIGHEST_SCORE               : 'highest-scores',
    HIGHEST_AVERAGES            : 'highest-averages',
    MOST_FIFTIES                : 'most-fifties',
    MOST_CENTURIES              : 'most-centuries',

    //Bowling
    BOWLING_STATS               : 'bowling-stats',
    BOWLING_STATS_INNINGS       : 'bowling-stats-innings',

    MOST_WICKETS                : 'most-wickets',
    BOWLING_AVERAGES            : 'best-averages',
    BEST_ECON                   : 'best-economy',
    BEST_ECON_INNINGS           : 'best-economy-innings',
    BEST_BOWLING                : 'best-bowling-figures',
    FASTEST_BALL                : 'fastest-ball',
    MOST_DOT_BALLS              : 'most-dot-balls-bowled',
    MOST_DOT_BALLS_INNINGS      : 'most-dot-balls-bowled-innings',
    MOST_MAIDENS                : 'most-maiden-overs-bowled',
    BOWLING_STRIKE_RATE         : 'best-strikerates',
    BOWLING_STRIKE_RATE_INNINGS : 'best-strikerates-innings',
    RUNS_CONCEDED               : 'most-runs-conceded-innings',
    MOST_FOUR_WICKETS           : 'most-four-wickets-innings'
};

/**
 * Set subscriptions
 */
PULSE.CLIENT.CRICKET.PlayerStat.prototype.setSubscriptions = function()
{
    var that = this;

    /**
     * Render the stat once the data is received
     */
    $( 'body' ).on( 'stats/update', function( e, params )
    {
        if ( ( ( that.tournament && params.tournamentName === that.tournament.tournamentName ) || params.tournamentGroup === that.tournamentGroupName ) && params.url === that.statName )
        {
            that.hasStats = params.success;
            if( that.type != 'default' )
            {
                that.statType = params.statName;
                that.statDataName = params.url;
                that.renderStat();
            }
        }
    });
};

/**
 * Get data for the relevant stat type. Stat type is fetched from the url and set to this.type.
 * If no stat is set in the url, load the default feeds and assign this.type to 'default'.
 */
PULSE.CLIENT.CRICKET.PlayerStat.prototype.init = function()
{
    switch ( this.type )
    {
        /* Batting Stats */

        case this.statTypes.MOST_RUNS:
            this.model.getMostRunsData( false, true );
            this.statName = 'mostRuns';
            this.statHeader = 'Top Run Scorer';
            this.statCategory = 'Batting';
            this.statUrl = 'most-runs';
            break;

        case this.statTypes.BATTING_STRIKE_RATE:
            this.statName = 'bestBattingStrikeRate';
            this.model.getBestBattingStrikeRateData( false, true );
            this.statHeader = 'Highest Strike Rate';
            this.statCategory = 'Batting';
            this.statUrl = 'highest-strikerate';
            break;

        case this.statTypes.HIGHEST_SCORE:
            this.model.getHighestScoresData( false, true );
            this.statName = 'highestScores';
            this.statHeader = 'Highest Individual Score';
            this.statCategory = 'Batting';
            this.statUrl = 'highest-scores';
            break;

        case this.statTypes.HIGHEST_AVERAGES:
            this.statName = 'battingAverage';
            this.model.getBattingAverageData( false, true );
            this.statHeader = 'Best Average';
            this.statCategory = 'Batting';
            this.statUrl = 'highest-averages';
            break;

        case this.statTypes.MOST_CENTURIES:
            this.model.getMostCenturiesData( false, true );
            this.statName = 'mostCenturies';
            this.statHeader = "Most Centuries";
            this.statCategory = 'Batting';
            this.statUrl = 'most-centuries';
            break;

        case this.statTypes.MOST_FIFTIES:
            this.model.getMostFiftiesData( false, true );
            this.statName = 'mostFifties';
            this.statHeader = "Most Fifties";
            this.statCategory = 'Batting';
            this.statUrl = 'most-fifties';
            break;

        case this.statTypes.MOST_SIXES:
            this.model.getMostSixesData( false, true );
            this.statName = 'mostSixes';
            this.statHeader = 'Most Sixes';
            this.statCategory = 'Batting';
            this.statUrl = 'most-sixes';
            break;

        case this.statTypes.MOST_FOURS:
            this.model.getMostFoursData( false, true );
            this.statName = 'mostFours';
            this.statHeader = 'Most Fours';
            this.statCategory = 'Batting';
            this.statUrl = 'most-fours';
            break;

        /* Bowling Stats */

        case this.statTypes.MOST_WICKETS:
            this.model.getMostWicketsData( false, true );
            this.statName = 'mostWickets';
            this.statHeader = 'Top Wicket Taker';
            this.statCategory = 'Bowling';
            this.statUrl = 'most-wickets';
            break;

        case this.statTypes.BEST_ECON:
            this.statName = 'bestEconomy';
            this.model.getBestEconomyData( false, true );
            this.statHeader = 'Best Economy';
            this.statCategory = 'Bowling';
            this.statUrl = 'best-economy';
            break;

        case this.statTypes.BOWLING_AVERAGES:
            this.statName = 'bowlingAverage';
            this.model.getBowlingAverageData( false, true );
            this.statHeader = 'Best Average';
            this.statCategory = 'Bowling';
            this.statUrl = 'best-averages';
            break;

        case this.statTypes.BEST_BOWLING:
            this.model.getBestBowlingData( false, true );
            this.innings = true;
            this.statName = 'bestBowling';
            this.statHeader = 'Best Bowling Figures';
            this.statCategory = 'Bowling';
            this.statUrl = 'best-bowling-figures';
            break;

        case this.statTypes.MOST_FOUR_WICKETS:
            this.model.getMostFourWicketsData( true );
            this.statName = 'mostFourWickets';
            this.statHeader = 'Most Four Wickets';
            this.statCategory = 'Bowling';
            this.statUrl = 'most-four-wickets-innings';
            break;

        case this.statTypes.MOST_MAIDENS:
            this.model.getMostMaidensData( true );
            this.statName = 'mostMaidens';
            this.statHeader = 'Maidens';
            this.statCategory = 'Bowling';
            this.statUrl = 'most-maiden-overs-bowled';
            break

        default:
            this.type = 'most-runs';
            this.model.getMostRunsData( false, true );
            this.statName = 'mostRuns';
            this.statHeader = 'Most Runs Scorer';
            this.statCategory = 'Bowling';
            break;
    }
};

/**
 * Renders the player stat.
 */
PULSE.CLIENT.CRICKET.PlayerStat.prototype.renderStat = function()
{
    var that = this,
        details = {},
        stats;

    if( this.hasStats )
    {
        stats = this.model.getModelArrayFor( this.statType, this.statDataName, this.innings, { limit : this.limit, teamId : this.teamId } );
    }
    else
    {
        stats = { statsArray: [] };
    }

    stats = stats.statsArray;

    stats = this.filterByTeamId( stats );

    details.stats = stats;

    if ( this.statType == 'MostFourWickets' && details.stats)
    {
        for ( var i = 0; i < details.stats.length; i++ )
        {
            details.stats[ i ].stat = details.stats[ i ].stats['4w'] + details.stats[ i ].stats['5w'] + details.stats[ i ].stats['10w'];
        }
    }

    if ( this.header )
    {
        details.statHeader = this.header
    }
    else
    {
        details.statHeader = this.statHeader;
    }
    details.statClass = this.statClass;
    details.statCategory = this.statCategory;
    details.statUrl = this.statUrl;
    details.teamId = this.teamId;

    if ( this.urlPrefix )
    {
        details.statUrl = this.urlPrefix + details.statUrl;
    }

    if ( !details.statClass )
    {
        if ( this.statCategory && this.statCategory.indexOf( 'Bowling' ) > -1)
        {
            details.statClass = 'bowler';
        }
        else
        {
            details.statClass = '';
        }
    }

    if ( details.stats && details.stats.length > 0 )
    {
        this.$container.show();
        PULSE.CLIENT.Template.publish(
            this.template,
            this.$container,
            details
        );

        var $imgContainer = this.$container.find( '.playerPhoto' );
        // set to work with templates that have player photos and with templates that don't
        if( $imgContainer.length > 0 )
        {
            $imgContainer.each( function()
            {
                var image = this;
                var main = that.urlGenerator.getPlayerImg( $( this ).data( 'player-id' ), '210', 'png' );
                var missing = that.urlGenerator.getPlayerImg( 'Photo-Missing', '210', 'png' );
                var loadAttempted = false;
                $( image )
                .each( function() {
                    if ( !this.complete )
                    {
                        $(this).data( 'loadAttempted', true );
                    }
                } )
                .error(function() {
                        $( image ).attr( 'src', missing );
                })
                .attr( 'src', main )

            } );
        }

        if ( this.notify )
        {
            PULSE.CLIENT.notify( 'playerStat/data', { success: true, stat : this.type, tournamentGroup : this.tournamentGroup, tournament : this.tournament } );
        }
    }
    else
    {
        this.$container.hide();
        if ( this.notify )
        {
            PULSE.CLIENT.notify( 'playerStat/noData', { success: true, stat : this.type, tournamentGroup : this.tournamentGroup, tournament : this.tournament } );
        }
    }
};

/**
 * Filters team card to players from a given team.
 * @param  {array} stats Filters the array of players to find those in a specific team if this.teamId
 *                       has been set.
 * @return {array}       Returns a team specific filtered array. Returns original array if no team
 *                       has been set.
 */
PULSE.CLIENT.CRICKET.PlayerStat.prototype.filterByTeamId = function( stats )
{
    var filtered = [];

    if ( !this.teamId ) {
        return stats;
    }

    for (var i=0; i < stats.length; i++) {

        if (stats[i].team.id == this.teamId) {
            filtered.push(stats[i]);
        }
    }

    return filtered;
};
if ( !PULSE )        		{ var PULSE = {}; }
if ( !PULSE.CLIENT ) 		{ PULSE.CLIENT = {}; }
if ( !PULSE.CLIENT.Poll ) 	{ PULSE.CLIENT.Poll = {}; }


PULSE.CLIENT.Poll.Controller = function( container, config )
{
	this.$container = $( container );
	this.config 	= config;
	this.name 		= config.name || 'poll';

	this.POPUP_COOKIE 	= this.name + '_popup_cookie';
	this.ANSWERS_COOKIE = this.name + '_answers_cookie';

    this.cookiePath = config.cookieOptions ? config.cookieOptions.path : undefined;
    this.backwardsCompatible = config.backwardsCompatible; // uses the old style of cookies

	this.answersString = $.cookie( this.ANSWERS_COOKIE );
	this.popupQuestion = $.cookie( this.POPUP_COOKIE );

	this.answers = [];
	if( this.answersString )
	{
		this.answers = this.answersString.split(',');
	}

	// this.setSubscriptions();

	var feedOptions = this.config.feedOptions || {};
	this.model 	= new PULSE.CLIENT.Poll.Model( container, $.extend( {
		name: this.name,
		popupQuestionId: this.popupQuestion,
		answeredQuestions: this.answers
	}, feedOptions ) );

	/**
     * If there's a new popup question to be display,
     * show the poll
     */
    var that = this;
    this.$container.on( 'poll/popup/new', function( e, params )
    {
    	if( params.poll === that.name )
    	{
    	  	$.cookie( that.POPUP_COOKIE, params.popupQuestionId, { path: that.cookiePath } );
            that.$container.trigger( 'poll/show', { name: that.name } );
    	}
    } );

    this.$container.on( 'poll/popup/removed', function( e, params )
    {
    	if( params.poll === that.name )
    	{
        	$.cookie( that.POPUP_COOKIE, null, { path: that.cookiePath } );
        }
    } );

    /**
     * For backwards compatibility with the old poll, make sure the poll reads the
     * old style cookies and adds them to the answers array and the model
     */
    this.$container.on( 'poll/data', function( e, params )
    {
        if( params.poll === that.name && that.backwardsCompatible )
        {
            that.setOldStyleCookies();
        }
    } );
};

PULSE.CLIENT.Poll.Controller.prototype.setOldStyleCookies = function()
{
    var questions = this.model.data.results;
    for( var i = 0, iLimit = questions.length; i < iLimit; i++ )
    {
        if( $.cookie( 'answered_' + questions[i].id ) &&
        _.indexOf( this.answers, questions[i].id.toString() ) == -1 )
        {
            this.answers.push( questions[i].id.toString() );
            this.model.answeredQuestions.push( questions[i].id );
        }
    }
};

PULSE.CLIENT.Poll.Controller.prototype.answerQuestion = function( questionId, answerIndex )
{
	var that = this;
	if( questionId && answerIndex > -1 )
	{
		$.ajax(
        {
            dataType: 'jsonp',
            url: "http://play2.pulselive.com/cms/answerQuestion?questionId=" + questionId + "&option=" + answerIndex,
            data: {},
            complete: function( data )
            {
                if( data.success )
                {
                    that.addAnsweredQuestion( questionId );
                    return true;
                }
                return;
            },
            error: function()
           	{
           		that.$container.trigger( 'poll/answer', { success: false, questionId: questionId } );
           	}
        } );
	}
};

PULSE.CLIENT.Poll.Controller.prototype.addAnsweredQuestion = function( questionId )
{
	this.model.addAnsweredQuestion( questionId );
	this.answers.push( questionId );
	this.answers = _.uniq( this.answers );

	$.cookie( this.ANSWERS_COOKIE, this.answers.join(','), { path: this.cookiePath } );
    if( this.backwardsCompatible )
    {
        $.cookie( 'answered_' + questionId, 1, { path: this.cookiePath } );
    }

	this.$container.trigger( 'poll/answer', { success: true, questionId: questionId } );
};
if (!PULSE) 		{ var PULSE = {}; }
if (!PULSE.CLIENT) 	{ PULSE.CLIENT = {}; }

/**
 *	Generic controller for the pulse poll content
 * 	Requires the following common libraries:
 * 		* lib/common/poll/PollModel.js
 * 		* lib/common/poll/PollView.js
 * 		* lib/common/poll/PollController.js
 * 		* lib/common/NewJSONPTimer.js
 * 		* lib/common/Set.js
 * 		* lib/common/Swingometer.js
 * 		* lib/common/Cookie.js
 *
 *	Requires config
 * 	params is an optional parameter (see the poll controller for information on params)
 */
PULSE.CLIENT.PulsePoll = function( config, params )
{
	this.urlFactory	= PULSE.CLIENT.CRICKET.getUrlGenerator();
	var url = this.urlFactory.makeCustomerDataUrl( config.account + "/poll" );

	this.pollModel = new PULSE.CLIENT.PollModel( this );
	this.pollController = new PULSE.CLIENT.PollController( this.pollModel, url, 60000, params || {} );
	this.pollView = new PULSE.CLIENT.PollView( 
		this.pollController, 
		config.container, 		// the selector (be it a class or an id) of the container
		config.popupSelector, 	// the popup selector (must be a class so please omit the '.')
		config.cookieName, 		// the name under which the cookie is saved
		config.hideClass		// the class used to hide the poll (must be a class so please omit the '.')
	);
};
if (!PULSE)
{
    var PULSE = {};
}
if (!PULSE.CLIENT)
{
    PULSE.CLIENT = {};
}
if (!PULSE.CLIENT.ICC)
{
    PULSE.CLIENT.ICC = {};
}
if (!PULSE.CLIENT.ICC.Common)
{
    PULSE.CLIENT.ICC.Common = {};
}

/** function to animate the schedule slider at runtime */
PULSE.CLIENT.ICC.Common.ToggleScheduleBar = undefined;
PULSE.CLIENT.ICC.Common.TogglePollBar = undefined;
PULSE.CLIENT.ICC.Common.PollBarToggled = undefined;
PULSE.CLIENT.ICC.Common.PollDialogIsHidden = undefined;
PULSE.CLIENT.ICC.Common.ScheduleToggleAnimating = false;
PULSE.CLIENT.ICC.Common.ScheduleToggleState = false;
PULSE.CLIENT.ICC.Common.ScheduleBarToggled = undefined;

PULSE.CLIENT.ICC.Common.SchedulePollToggle = function()
{
    var Common = PULSE.CLIENT.ICC.Common;
    if (typeof Common.ToggleScheduleBar !== "undefined" && typeof Common.TogglePollBar !==
        "undefined" && !
        Common.ScheduleToggleAnimating)
    {
        /* if both are toggled */
        if (Common.ScheduleBarToggled() && Common.PollBarToggled())
        {
            Common.ToggleScheduleBar();
        }
        /* if poll is toggled and not schedule */
        else if (Common.PollBarToggled())
        {
            Common.TogglePollBar(Common.ToggleScheduleBar);
        }
        /* if poll is toggled and not schedule */
        else if (Common.ScheduleBarToggled())
        {
            Common.ToggleScheduleBar(Common.TogglePollBar);
        }
    }
};

/** functions to slide the schedule slider at runtime */
PULSE.CLIENT.ICC.Common.TogglePollView = undefined;
PULSE.CLIENT.ICC.Common.PollToggle = function()
{
    if (typeof PULSE.CLIENT.ICC.Common.TogglePollView !== "undefined")
    {
        PULSE.CLIENT.ICC.Common.TogglePollView();
    }
};


/** generic functions for setting and getting cookies */

PULSE.CLIENT.ICC.Common.COOKIE_FIRST_LOAD_KEY = "matchhero_poll_first_load";
PULSE.CLIENT.ICC.Common.COOKIE_FIRST_LOAD_MIN = 60 * 12;

PULSE.CLIENT.ICC.Common.COOKIE_SLIDE_IS_UP_KEY = "matchhero_poll_up";
PULSE.CLIENT.ICC.Common.COOKIE_SLIDE_IS_UP_MIN = 60 * 24;

PULSE.CLIENT.ICC.Common.getCookie = function(c_name)
{
    var c_name = c_name;
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++)
    {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name)
        {
            return unescape(y);
        }
    }
    return false;
};

PULSE.CLIENT.ICC.Common.setCookie = function(c_name, c_value, mins)
{
    var c_name = c_name;
    var value = c_value;
    var ex_minutes = mins;
    var extime = new Date();
    extime.setTime(extime.getTime() + (ex_minutes * 60 * 1000));
    var c_value = escape(value) + ((ex_minutes == null) ? "" : "; expires=" + extime.toUTCString());
    document.cookie = c_name + "=" + c_value;
};


PULSE.CLIENT.ICC.Poll = function(container, config, tournament)
{

    this.$container = $(container);
    this.config = config;

    this.tournament = tournament;

    // Constants
    this.POLL_INTERVAL = 30;
    this.POLL_CALLBACK = 'onPollCallback';
    this.FEED_POLL = 'poll';

    this.$pollWidgets = $(container);
    this.season = config['data-season'];

    //data
    this.pollData = [];

    //DOAs
    this.questions = {};

    //vars for DOM manipulation
    this.animating = false;
    this.currentQuestion = 0;
    this.initialised = false;

    this.pulseOverlayCont = this.$container.find(".pulseOverlay");

    this.pulseOverlay = new PULSE.CLIENT.CRICKET.PulseOverlay(this.pulseOverlayCont);
    this.pulseHistory = new PULSE.CLIENT.CRICKET.PulseHistory(this.pulseOverlayCont.children(
        ".pulseHistory"));

    var that = this;

    // Create the data manager
    this.dm = PULSE.CLIENT.getDataManager();
    this.urlGenerator = PULSE.CLIENT.CRICKET.getUrlGenerator( { tournamentName: config['data-season'] } );

    if (config.account)
    {
        // Add feed to data manager
        this.dm.addFeed(this.FEED_POLL, this.urlGenerator.makeCustomerDataUrl(config.account),
            this.POLL_INTERVAL, this.POLL_CALLBACK, [this]);

        this.dm.start(this.urlGenerator.makeCustomerDataUrl(config.account));
    }
    else if (config.url)
    {
        // Add feed to data manager
        this.dm.addFeed(this.FEED_POLL, config.url,
            this.POLL_INTERVAL, this.POLL_CALLBACK, [this]);

        this.dm.start(config.url);
    }
};


/**
 * This is called by the match-schedule feed
 */
PULSE.CLIENT.ICC.Poll.prototype.onData = function(data, id)
{

    var that = this;

    // If data-array exists
    if (id === this.FEED_POLL &&
        data &&
        data[0].results &&
        data[0].results.length > 0)
    {
        this.pollData = data[0];
        this.refreshData();
        this.pulseHistory.updateQuestions(this.pollData.results);
    }
};

/**
 * Refresh the main match schedule container with the data.
 */
PULSE.CLIENT.ICC.Poll.prototype.refreshData = function()
{
    var that = this;

    this.refreshScheduleCntr(this.$container, this.pollData);
};

PULSE.CLIENT.ICC.Poll.prototype.refreshScheduleCntr = function($container, data)
{
    var that = this;

    //sends the view the container element and the commandHandler ( handles interactions )
    this.view = (typeof this.view === "undefined") ? new this.HTMLView($container, this) : this.view;

    //foreach questions
    var i = data.results.length;
    while (i--)
    {
        var qData = data.results[i];

        //add cookie look up

        this.updateQuestionById(qData, this.view);
    };

    this.checkDeleted(data.results);

    // if there's a pop-up question and it differs from the last one shown, show the pop-up
    if (data.popupQuestionId && this.view.cookie_last_question_id.getCookie() != data.popupQuestionId)
    {

        var bool = (this.initialised == true);

        this.view.pulseDialog.addClass('current');
        // console.log( this.tournament.tournamentName + ' adding current from popupquestion check' );
        this.view.cssAdjustments(bool);

        this.view.cookie_last_question_id.setValue(data.popupQuestionId);
        this.view.cookie_last_question_id.setExpireMinutes(this.dayInMinutes * 60);
        this.view.cookie_last_question_id.setCookie();

    }
    // if there isn't, it's first load or the user's told the pop-up to close already, hide the pop-up
    else if(!this.initialised && this.view.cookie_last_question_id.getCookie() && !(this.view.cookie_close_btn_pressed.getCookie() == 'true'))
    {
        PULSE.CLIENT.ICC.Common.TogglePollView(true);
        if( !this.view.pulseDialog.is(':visible') )
        {
            this.view.pulseDialog.removeClass('current');
            // console.log( this.tournament.tournamentName + ' removing current from popupquestion check' );
        }
    }

    // If data length is zero show 'no matches found' message.
    if (data.length === 0 || data.results.length === 0)
    {
        $(this.$container.find('ul.contentSlide')).append($('<h4>').text('No questions.'));
    }

    this.initialised = true;

};

PULSE.CLIENT.ICC.Poll.prototype.updateQuestionById = function(qData, view)
{
    var question = this.questionById(qData.id);

    if (question)
    {
        question.onData(qData);
    }
    else
    {
        question = new this.Question(qData, view);

        this.questions[qData.id] = question;
    }
};

PULSE.CLIENT.ICC.Poll.prototype.questionById = function(id)
{
    if (typeof this.questions[id] !== "undefined")
    {
        var question = this.questions[id];
        return question;
    }
    return false;
};

PULSE.CLIENT.ICC.Poll.prototype.checkDeleted = function(results)
{
    for (q in this.questions)
    {

        var exists = false;

        for (var i = 0; i < results.length; i++)
        {
            var result = results[i];

            exists = exists ? true : (q == result.id);
        }

        if (!exists)
        {
            this.questions[q].setAnswered(true);
            this.questions[q].view.updateQuestion(this.questions[q]);
        }
    }
};

PULSE.CLIENT.ICC.Poll.prototype.commandHandler = function(cmdArray)
{

    var cmdName = cmdArray[0];

    var intArray = [];

    for (var i = 1; i < cmdArray.length; i++)
    {
        intArray.push(parseInt(cmdArray[i]));
    }

    switch (cmdName.toString().toLowerCase())
    {

        case "options":

            //this is should populate the question options view and animate to that view
            var question = this.questionById(intArray[intArray.length - 1]);

            if (question)
            {

                if (!question.getAnswered())
                {

                    this.view.populateOptions(question);

                    this.view.QuestionView();

                }
                else
                {

                    this.view.populateResults(question);

                    this.view.ResultsView();

                }

            }

            break;

        case "results":

            //this is should populate the results options view and animate to that view
            var answer = intArray[0];

            var question = this.questionById(intArray[intArray.length - 1]);

            if (question)
            {


                question.setAnswered(true);

                //answer question func sends an ajax request to pulse live server and sets a cookie to stop the user answering the question again
                question.answerQuestion(answer);

                this.view.populateResults(question);

                this.view.ResultsView();
            }

            break;

        case "home":

            this.view.HomeView();

            break;

        case "homenextsteps":

            this.view.HomeNextStepsView();

            break;

        default:

            //define a default/do nothing
            break;
    };
};

/**
 * DAO's
 */


/**
 * Question object
 */
PULSE.CLIENT.ICC.Poll.prototype.HTMLView = function($container, main)
{

    //find DOM elements
    this.pulseDialog = $container.children('.pulseDialog');
    this.pulseDialogAni = false;
    this.selector = this.pulseDialog.find("ul.contentSlide");
    this.containerChild = $container.children('.bottomSbMin');
    this.selectorClrn = this.selector.children();
    this.pollHomeView = this.selectorClrn.eq(0);
    this.pollQuestionView = this.selectorClrn.eq(1);
    this.pollResultsView = this.selectorClrn.eq(2);
    this.pollWrapper = this.selector.parent();
    this.viewWidth = this.pollHomeView.width();
    this.initialised = false;

    /* pol home elements */
    this.HomeList = this.pollHomeView.find(".questionList ul");

    /* question editable elements */
    this.QuestionHeader = this.pollQuestionView.find("h1");
    this.QuestionList = this.pollQuestionView.find(".optionsList ul");

    /* results editable elements */
    this.ResultsHeader = this.pollResultsView.find("h1");
    this.ResultsList = this.pollResultsView.find(".resultsList ul");
    this.voteCount = this.pollResultsView.find(".voteCount");

    /* misc UI buttons */
    this.HomeButton = this.selector.find(".prevSlide");
    this.pulsePopupButton = $container.find('.ctaPoll');
    this.bottomSbButton = this.containerChild.find('.bottomSbButton.show');
    this.closeModal = this.pulseDialog.find("a.closeModal");
    this.chkTVQuestions = this.pulseDialog.find("#chkTVQuestions");

    this.nextSteps = this.pollResultsView.find(".nextSteps").find("a");

    /* settings */
    this.settings = this.pulseDialog.find(".settings");

    /* commandHandler controller */
    this.main = main;
    this.currentQuestion;

    //empty elements
    this.HomeList.empty();
    this.QuestionList.empty();
    this.QuestionHeader.empty();
    this.ResultsHeader.empty();
    this.ResultsList.empty();

    this.setCookies();

    //css adjustments
    this.selector.css("left", 0);
    this.pollWrapper.css("background-color", "#EFEFEF");
    if (this.cookie_show_tv.getCookie() == "true")
    {
        this.chkTVQuestions.attr("checked", "checked");
    }
    //end of css adjustments

    this.setEventHandlers();

    this.initialised = true;

};

PULSE.CLIENT.ICC.Poll.prototype.HTMLView.prototype.addQuestion = function(qModel)
{
    var li = $("<li>");
    this.HomeList.prepend(li);
    qModel.setHTML(li);
    this.updateQuestion(qModel);
};

PULSE.CLIENT.ICC.Poll.prototype.HTMLView.prototype.updateQuestion = function(
    qModel)
{

    var li = qModel.getHTML();

    if (qModel.getAnswered())
    {
        li.remove();
    }
    else
    {
        var a = $("<a>").attr(
        {
            "href": "#",
            "class": "options_" + qModel.getId()
        }).html(qModel.getText());;
        li.empty().append(a);
        qModel.setHTML(li);
    }
};

PULSE.CLIENT.ICC.Poll.prototype.HTMLView.prototype.updateQuestions = function(
    results)
{

    this.pulseHistoryNav.empty();

    this.checkDeleted(results);

    for (var i = 0; i < results.length; i++)
    {

        var result = results[i];
        var selected = (this.currentQuestion == -1);

        this.pulseHistoryNav
            .append(
                $("<li>")
                .append(
                    $("<a>").attr(
                    {
                        "href": "#"
                    })
                    .data("question", result)
                    .html(
                        result.text
                    )
                )
        );

        if (this.currentQuestion == -1 || this.currentQuestion == result.id)
        {
            this.setOptions(result);
        }

    };

};

PULSE.CLIENT.ICC.Poll.prototype.HTMLView.prototype.deleteQuestion = function(
    qModel)
{
    var li = qModel.getHTML();
    $(li).remove();
    qModel.setHTML(null);
};

PULSE.CLIENT.ICC.Poll.prototype.HTMLView.prototype.populateOptions = function(
    qModel)
{

    /* populate question list */

    this.QuestionList.empty();

    var options = qModel.getOptions();

    for (var i = 0; i < options.length; i++)
    {

        var option = options[i];

        this.QuestionList.append(
            $("<li>")
            .append(
                $("<a>")
                .attr(
                {
                    "href": "#",
                    "class": "results_" + i + "_" + qModel.getId()
                })
                .html(option.option)
            )
        );

    };

    /* populate header */
    this.QuestionHeader.html(qModel.getText());

};

PULSE.CLIENT.ICC.Poll.prototype.HTMLView.prototype.populateResults = function(
    qModel)
{

    this.ResultsList.empty();

    var options = qModel.getOptions();

    for (var i = 0; i < options.length; i++)
    {

        var option = options[i];

        this.ResultsList.append(
            $("<li>")
            .append(
                $("<span>")
                .addClass("optionLabel")
                .html(option.option)
            )
            .append(
                $("<span>")
                .addClass("optionPercentage")
                .html(option.percentage)
            )
            .append(
                $("<div>")
                .css("width", option.percentage)
                .html("bar")
            )
        );
    };

    this.voteCount.empty();

    if (qModel.json.totalVotes && qModel.json.totalVotes > 1000)
    {
        var votes = this.addCommas(qModel.json.totalVotes);
        this.voteCount.html(votes + " votes")
    }

    var questions = this.HomeList.find("li");

    if (questions.length > 0)
    {
        var plural = questions.length == 1 ? "" : "s";
        this.nextSteps.html(questions.length + " question" + plural + " left to answer");
    }
    else
    {
        this.nextSteps.html("Return to Home");
    }

    /* populate header */
    this.ResultsHeader.html(qModel.getText());

};

PULSE.CLIENT.ICC.Poll.prototype.HTMLView.prototype.HomeView = function()
{
    var that = this;
    this.selector.animate(
    {
        "left": 0
    }, function()
    {
        that.wrapperHeight("pollHomeView")
    });
};

PULSE.CLIENT.ICC.Poll.prototype.HTMLView.prototype.QuestionView = function()
{
    var that = this;
    this.selector.animate(
    {
        "left": -(this.viewWidth)
    }, function()
    {
        that.wrapperHeight("pollQuestionView")
    });
};

PULSE.CLIENT.ICC.Poll.prototype.HTMLView.prototype.ResultsView = function()
{
    var that = this;
    this.selector.animate(
    {
        "left": -(this.viewWidth * 2)
    }, function()
    {
        that.wrapperHeight("pollResultsView")
    });
};

PULSE.CLIENT.ICC.Poll.prototype.HTMLView.prototype.HomeNextStepsView = function()
{
    var that = this;
    //fake append results to he beginning
    this.pollResultsView.insertBefore(this.selector.children().eq(0));
    this.selector.css(
    {
        "left": "0"
    });

    this.selector.animate(
    {
        "left": -(this.viewWidth)
    }, function()
    {
        that.pollResultsView.insertAfter(that.selector.children().eq(-1));
        that.selector.css(
        {
            "left": "0"
        });
        that.wrapperHeight("pollHomeView")
    });
};

PULSE.CLIENT.ICC.Poll.prototype.HTMLView.prototype.wrapperHeight = function(view)
{
    this.pollWrapper.animate(
    {
        "height": this[view].height()
    })
};

PULSE.CLIENT.ICC.Poll.prototype.HTMLView.prototype.canToggle = function()
{
    return this.cookie_show_tv.getCookie() != "false";
};

PULSE.CLIENT.ICC.Poll.prototype.HTMLView.prototype.closedByUser = function()
{
    return this.cookie_close_btn_pressed.getCookie() != "true";
};

PULSE.CLIENT.ICC.Poll.prototype.HTMLView.prototype.setEventHandlers = function()
{

    var that = this;

    //set click handlers
    $(this.HomeList).off("click").on("click", "a", function(e)
    {

        if (e && e.preventDefault) e.preventDefault();

        var jQ = $(this);

        var ClassName = jQ.attr("class");

        var command = ClassName.split("_");

        //send the command array to the commandHandler
        that.main.commandHandler(command);

        return false;

    });

    $(this.HomeButton).off("click").on("click", function(e)
    {

        if (e && e.preventDefault) e.preventDefault();

        //send the command array to the commandHandler
        that.main.commandHandler(["home"]);

        return false;

    });

    $(this.nextSteps).off("click").on("click", function(e)
    {

        if (e && e.preventDefault) e.preventDefault();

        //send the command array to the commandHandler
        that.main.commandHandler(["homeNextSteps"]);

        return false;

    });


    $(this.QuestionList).off("click").on("click", "a", function(e)
    {

        if (e && e.preventDefault) e.preventDefault();

        var jQ = $(this);

        var ClassName = jQ.attr("class");

        var command = ClassName.split("_");

        //send the command array to the commandHandler
        that.main.commandHandler(command);

        return false;

    });

    //what's pulse, pulse history, tv questions
    this.settings.off("click").on("click", "a", function(e)
    {

        if (e && e.preventDefault) e.preventDefault();

        jQ = $(this);

        var id = jQ.attr("href").replace("#", "");

        that.main.pulseOverlay.showView(id);

        return false;

    });

    $(this.chkTVQuestions).off("click").on("click", function()
    {

        var jQ = $(this);

        var setValue = (typeof jQ.attr("checked") !== "undefined" && jQ.attr("checked").toString()
            .toLowerCase() ==
            "checked") ? "true" : "false";

        that.cookie_show_tv.setValue(setValue);
        that.cookie_show_tv.setExpireMinutes(this.dayInMinutes * 60);
        that.cookie_show_tv.setCookie();

    });

    /** toggles the schedule slider up and down */
    $(this.bottomSbButton).off("click").on("click", PULSE.CLIENT.ICC.Common.SchedulePollToggle);

    /** toggles the poll in and out */

    $(this.pulsePopupButton).off("click").on("click", function()
    {
        if( that.pulseDialog.is(':visible') )
        {
            PULSE.CLIENT.ICC.Common.PollToggle();
            that.pulseDialog.removeClass('current');
            // console.log( that.main.tournament.tournamentName + ' removing current from popupButton click event' );
        }
        else
        {
            that.pulseDialog.addClass('current');
            // console.log( that.main.tournament.tournamentName + ' adding current from popupButton click event' );
            PULSE.CLIENT.ICC.Common.PollToggle();
        }
    } );
    $(this.closeModal).off("click").on("click", function()
    {
        PULSE.CLIENT.ICC.Common.PollToggle();
        that.pulseDialog.removeClass('current');
        // console.log( that.main.tournament.tournamentName + ' removing current from close click event' );
    } );

    var that = this;

    if (!this.initialised)
    {

        /** declare common variables */

        PULSE.CLIENT.ICC.Common.TogglePollBar = function(callback, firstLoad)
        {

            var amt = (PULSE.CLIENT.ICC.Common.PollBarToggled()) ? "-61px" : "0";

            var Common = PULSE.CLIENT.ICC.Common;

            Common.ScheduleToggleAnimating = true;

            if (firstLoad)
            {

                if (Common.getCookie && !Common.getCookie(Common.COOKIE_FIRST_LOAD_KEY))
                {
                    that.containerChild.animate(
                    {
                        "bottom": amt
                    });
                    Common.ScheduleToggleAnimating = false;
                    this.cookie_close_btn_pressed.getCookie() != "true"
                }
                else
                {
                    that.containerChild.css(
                    {
                        "bottom": amt
                    });
                    Common.ScheduleToggleAnimating = false;
                }

            }
            else
            {

                if (callback)
                {

                    that.containerChild.animate(
                    {
                        "bottom": amt
                    }, function()
                    {
                        PULSE.CLIENT.ICC.Common.ToggleScheduleBar();
                    });

                }
                else
                {

                    that.containerChild.animate(
                    {
                        "bottom": amt
                    }, function()
                    {
                        Common.ScheduleToggleAnimating = false;
                    });

                }

            }

        };

        PULSE.CLIENT.ICC.Common.PollBarToggled = function()
        {
            var top = parseInt(that.containerChild.css("bottom").replace("px", ""));
            return (top > -61);
        };

        PULSE.CLIENT.ICC.Common.TogglePollView = function(bool)
        {
            var pulseDialog = $('.pulseDialog.current');
            if (!that.pulseDialogAni)
            {
                that.pulseDialogAni = true;

                var cookieValue = pulseDialog.is(':visible') ? "true" : "false";

                if (!bool)
                {
                    if (cookieValue === 'false')
                    {
                        pulseDialog.fadeIn("fast");
                        that.pulseDialogAni = false;
                    }
                    else
                    {
                        pulseDialog.fadeOut("fast", function()
                        {
                            that.pulseDialogAni = false;
                        });
                    }
                }
                else
                {
                    if (cookieValue === 'false')
                    {
                        pulseDialog.css("display", "block");
                        that.pulseDialogAni = false;
                    }
                    else
                    {
                        pulseDialog.css("display", "none");
                        that.pulseDialogAni = false;
                    }
                }

                /** sets cookie_slid_in as true to stop it sliding in multiple times */
                that.cookie_close_btn_pressed.setValue(cookieValue);
                that.cookie_close_btn_pressed.setExpireMinutes(this.dayInMinutes);
                that.cookie_close_btn_pressed.setCookie();
            }
        };

        PULSE.CLIENT.ICC.Common.PollDialogIsHidden = function()
        {
            if (that.pulseDialog.is(':visible'))
            {
                return false;
            }
            else
            {
                return true;
            }
        };

        // var Common = PULSE.CLIENT.ICC.Common;
        //if schedule slider is toggled, un-toggle poll
        // if (Common.getCookie && Common.getCookie(Common.COOKIE_SLIDE_IS_UP_KEY) == "false")
        // {
        //     Common.TogglePollBar(false, true);
        //     Common.TogglePollView(true);
        // }
    }

};

PULSE.CLIENT.ICC.Poll.prototype.HTMLView.prototype.addCommas = function(nStr)
{
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1))
    {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
};

PULSE.CLIENT.ICC.Poll.prototype.HTMLView.prototype.setCookies = function()
{
    var suffix = '';
    if( this.main.tournament )
    {
        suffix = this.main.tournament.tournamentName;
    }
    /** stores whether they have unchecked the tv poll checkbox */

    this.cookie_show_tv = new this.Cookie("show_tv_poll" + suffix);

    /** stores whether they have pressed the close button recently */

    this.cookie_close_btn_pressed = new this.Cookie("close_btn_pressed" + suffix);

    /** stores whether they have seen the box slide in recently */

    this.cookie_slid_in = new this.Cookie("slid_in" + suffix);

    this.cookie_last_question_id = new this.Cookie("pulse_poll_last_question" + suffix);

    this.hourInMinutes = 1 * 60;

    this.dayInMinutes = this.hourInMinutes * 24;

    /** sets cookie_show_tv as checked by default */
    if (!this.cookie_show_tv.getCookie())
    {
        this.cookie_show_tv.setValue("true");
        this.cookie_show_tv.setExpireMinutes(this.dayInMinutes);
        this.cookie_show_tv.setCookie();
    }

    /** sets cookie_close_btn_pressed as checked by default */
    if (!this.cookie_close_btn_pressed.getCookie())
    {
        this.cookie_close_btn_pressed.setValue("false");
        this.cookie_close_btn_pressed.setExpireMinutes(this.dayInMinutes);
        this.cookie_close_btn_pressed.setCookie();
    }

    /** sets cookie_close_btn_pressed as checked by default */
    if (!this.cookie_slid_in.getCookie())
    {
        this.cookie_slid_in.setValue("false");
        this.cookie_slid_in.setExpireMinutes(this.dayInMinutes);
        this.cookie_slid_in.setCookie();
    }

};

PULSE.CLIENT.ICC.Poll.prototype.HTMLView.prototype.cssAdjustments = function( bool )
{
    // if you've got to this point, there is a question being pushed
    // should i show the poll?
    if( this.canToggle() && !this.pulseDialog.is(':visible') )
    {
        this.pulseDialog.addClass('current');
        // console.log( this.main.tournament.tournamentName + ' adding current from cssAdjustments' );
        // how should i show the poll?
        if( this.cookie_slid_in.getCookie() == "false" || bool )
        {
            // slide
            PULSE.CLIENT.ICC.Common.TogglePollView();

            /** sets cookie_slid_in as true to stop it sliding in multiple times */
            this.cookie_slid_in.setValue("true");
            this.cookie_slid_in.setExpireMinutes(this.dayInMinutes);
            this.cookie_slid_in.setCookie();
        }
        else
        {
            //don't slide
            PULSE.CLIENT.ICC.Common.TogglePollView(true);
        }
    }
    else
    {
        this.pulseDialog.removeClass('current');
        // console.log( this.main.tournament.tournamentName + ' removing current from cssAdjustments' );
    }
};

PULSE.CLIENT.ICC.Poll.prototype.HTMLView.prototype.Cookie = function(c_name)
{
    this.c_name = c_name;
    this.c_value;
    this.ex_minutes = 0;
};

PULSE.CLIENT.ICC.Poll.prototype.HTMLView.prototype.Cookie.prototype.setName =
    function(newName)
    {
        this.c_name = newName;
};

PULSE.CLIENT.ICC.Poll.prototype.HTMLView.prototype.Cookie.prototype.setValue =
    function(newValue)
    {
        this.c_value = newValue;
};

PULSE.CLIENT.ICC.Poll.prototype.HTMLView.prototype.Cookie.prototype.setExpireMinutes =
    function(newValue)
    {
        this.ex_minutes = newValue;
};

PULSE.CLIENT.ICC.Poll.prototype.HTMLView.prototype.Cookie.prototype.getCookie =
    function()
    {
        var c_name = this.c_name;
        var i, x, y, ARRcookies = document.cookie.split(";");
        for (i = 0; i < ARRcookies.length; i++)
        {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x == c_name)
            {
                return unescape(y);
            }
        }
        return false;
};

PULSE.CLIENT.ICC.Poll.prototype.HTMLView.prototype.Cookie.prototype.setCookie =
    function()
    {
        var c_name = this.c_name;
        var value = this.c_value;
        var ex_minutes = this.ex_minutes;
        var extime = new Date();
        extime.setTime(extime.getTime() + (ex_minutes * 60 * 1000));
        var c_value = escape(value) + ((ex_minutes == null) ? "" : "; expires=" + extime.toUTCString() + '; path=/');
        document.cookie = c_name + "=" + c_value;
}

PULSE.CLIENT.ICC.Poll.prototype.Question = function(obj, view)
{

    this.id = -1;
    this.text = "";
    this.options = [];
    this.selectedOption = -1;
    this.cookieExpires = 60;
    this.li_html = "foo"; //the jquery list element
    this.html; //html inside the list element
    this.view;
    this.answered;
    this.json;

    if (typeof obj !== "undefined" && typeof obj !== "string")
    {
        this.initialise(obj, view);
    }

};

//getters and setters

PULSE.CLIENT.ICC.Poll.prototype.Question.prototype.getId = function()
{
    return this.id;
};

PULSE.CLIENT.ICC.Poll.prototype.Question.prototype.setId = function(newId)
{
    this.id = parseInt(newId);
};

PULSE.CLIENT.ICC.Poll.prototype.Question.prototype.getText = function()
{
    return this.text;
};

PULSE.CLIENT.ICC.Poll.prototype.Question.prototype.setText = function(newText)
{
    this.text = newText;
};

PULSE.CLIENT.ICC.Poll.prototype.Question.prototype.getOptions = function()
{
    return this.options;
};

PULSE.CLIENT.ICC.Poll.prototype.Question.prototype.setOptions = function(
    newOptions)
{
    this.options = newOptions;
};

PULSE.CLIENT.ICC.Poll.prototype.Question.prototype.getHTML = function()
{
    return this.li_html;
};

PULSE.CLIENT.ICC.Poll.prototype.Question.prototype.setHTML = function(newHTML)
{
    this.li_html = newHTML;
};

PULSE.CLIENT.ICC.Poll.prototype.Question.prototype.getAnswered = function()
{
    return this.answered;
};

PULSE.CLIENT.ICC.Poll.prototype.Question.prototype.setAnswered = function(
    newAnswer)
{
    this.answered = newAnswer;
};

PULSE.CLIENT.ICC.Poll.prototype.Question.prototype.setSelectedOption = function(
    newOption)
{
    this.selectedOption = parseInt(newOption);
};

PULSE.CLIENT.ICC.Poll.prototype.Question.prototype.getSelectedOption = function()
{
    return this.selectedOption;
};

PULSE.CLIENT.ICC.Poll.prototype.Question.prototype.initialise = function(obj,
    view)
{
    this.json = obj;
    this.setId(obj.id);
    this.setText(obj.text);
    this.setOptions(obj.options);
    this.setAnswered(this.getCookie());

    if (typeof view !== "undefined")
    {
        this.view = view;
        this.view.addQuestion(this);
    }
    else
    {
        this.view.updateQuestion(this);
    }
};

PULSE.CLIENT.ICC.Poll.prototype.Question.prototype.getCookie = function()
{
    var c_name = "answered_" + this.getId();
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++)
    {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name)
        {
            return unescape(y);
        }
    }
    return false;
};

PULSE.CLIENT.ICC.Poll.prototype.Question.prototype.setCookie = function()
{
    var c_name = "answered_" + this.getId();
    var value = this.getSelectedOption();
    var exdays = this.cookieExpires;
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
    return false;
}

PULSE.CLIENT.ICC.Poll.prototype.Question.prototype.onData = function(data)
{

    if (!this.equals(data, this.json))
    {
        //do changes and update html
        this.initialise(data);
    }
};

PULSE.CLIENT.ICC.Poll.prototype.Question.prototype.answerQuestion = function(
    option)
{

    if (isNaN(option)) return;

    this.setSelectedOption(option);

    var that = this;

    if (this.getSelectedOption() > -1)
    {

        //ajax request inline as the DataManagers seems to be tethered to the "fireTimer" function

        $.ajax(
        {

            dataType: 'jsonp',
            url: that.makeAjaxURL(),
            data:
            {},
            complete: function(data)
            {
                // var data = $.parseJSON(data);
                if (data.success)
                {
                    that.setCookie();
                    return true;
                }
                return;
            }

        });

    }

    this.view.updateQuestion(this);

    return;

};

PULSE.CLIENT.ICC.Poll.prototype.Question.prototype.makeAjaxURL = function()
{
    return "http://play2.pulselive.com/cms/answerQuestion?questionId=" + this.getId() + "&option=" +
        this.getSelectedOption();
};

PULSE.CLIENT.ICC.Poll.prototype.Question.prototype.equals = function(x, y)
{
    var p;
    for (p in y)
    {
        if (typeof(x[p]) == 'undefined')
        {
            return false;
        }
    }

    for (p in y)
    {
        if (y[p])
        {
            switch (typeof(y[p]))
            {
                case 'object':
                    if (!this.equals(y[p], x[p]))
                    {
                        return false;
                    }
                    break;
                case 'function':
                    if (typeof(x[p]) == 'undefined' ||
                        (p != 'equals' && y[p].toString() != x[p].toString()))
                        return false;
                    break;
                default:
                    if (y[p] != x[p])
                    {
                        return false;
                    }
            }
        }
        else
        {
            if (x[p])
                return false;
        }
    }

    for (p in x)
    {
        if (typeof(y[p]) == 'undefined')
        {
            return false;
        }
    }

    return true;
};


PULSE.CLIENT.CRICKET.PulseOverlay = function(container)
{
    this.container = container;
    this.children = this.container.children();
    this.closeModal = this.container.find(".closeModal");

    //set event handlers
    this.setEventHandlers();
};

PULSE.CLIENT.CRICKET.PulseOverlay.prototype.showView = function(view)
{

    this.children.each(function()
    {

        var jQ = $(this);

        if (jQ.hasClass("pulse" + view))
        {
            jQ.show();
        }
        else
        {
            jQ.hide();
        }
    });

    this.show();

};

PULSE.CLIENT.CRICKET.PulseOverlay.prototype.show = function()
{
    var that = this;
    this.container.fadeIn("fast", function()
    {
        that.container.css('display', 'block');
    });
};

PULSE.CLIENT.CRICKET.PulseOverlay.prototype.hide = function()
{
    this.container.fadeOut();
};

PULSE.CLIENT.CRICKET.PulseOverlay.prototype.setEventHandlers = function()
{

    var that = this;

    this.closeModal.off("click").on("click", function(e)
    {
        if (e && e.preventDefault) e.preventDefault();

        that.hide();

        return false;
    });

};

PULSE.CLIENT.CRICKET.PulseHistory = function(container)
{
    this.container = container;
    this.header = this.container.find(".pulseHistoryContent h1");
    this.resultList = this.container.find(".resultsList ul");
    this.resultOptions = this.resultList.find("li");
    this.voteCount = this.container.find(".voteCount");
    this.pulseHistoryNav = this.container.find(".pulseHistoryNav ul");
    this.currentQuestion = -1;

    //event listeners
    var that = this;
    this.pulseHistoryNav.off("click").on("click", "a", function(e)
    {

        if (e && e.preventDefault) e.preventDefault();

        var jQ = $(this);

        if (jQ.data("question"))
        {
            that.setOptions(jQ.data("question"));
        }

        return false;

    });

};

PULSE.CLIENT.CRICKET.PulseHistory.prototype.updateQuestions = function(results)
{

    this.pulseHistoryNav.empty();

    this.checkDeleted(results);

    for (var i = 0; i < results.length; i++)
    {

        var result = results[i];
        var selected = (this.currentQuestion == -1);

        this.pulseHistoryNav
            .append(
                $("<li>")
                .append(
                    $("<a>").attr(
                    {
                        "href": "#"
                    })
                    .data("question", result)
                    .html(
                        result.text
                    )
                )
        );

        if (this.currentQuestion == -1 || this.currentQuestion == result.id)
        {
            this.setOptions(result);
        }

    };

};

PULSE.CLIENT.CRICKET.PulseHistory.prototype.setOptions = function(result)
{

    this.resultList.empty();

    this.header.text(result.text);

    for (var i = 0; i < result.options.length; i++)
    {
        var option = result.options[i];
        this.resultList
            .append(
                $("<li>")
                .append(
                    $("<span>").addClass("optionLabel")
                    .text(option.option)
                )
                .append(
                    $("<span>").addClass("optionPercentage")
                    .text(option.percentage)
                )
                .append(
                    $("<div>").css("width", option.percentage)
                )
        )
    };

    this.pulseHistoryNav.each(function()
    {
        var jQ = $(this);

        if (jQ.data("question") && jQ.data("question").id == result.id)
        {
            jQ.removeClass("active").addClass("active");
        }
        else
        {
            jQ.removeClass("active");
        }
    });

    this.currentQuestion = result.id;

};

PULSE.CLIENT.CRICKET.PulseHistory.prototype.checkDeleted = function(results)
{

    if (this.currentQuestion > -1)
    {
        for (var i = 0; i < results.length; i++)
        {
            var result = results[i];
            if (result.id == this.currentQuestion) return;
        }
    }

    this.currentQuestion = -1;

};
if ( !PULSE )                { var PULSE = {}; }
if ( !PULSE.CLIENT )         { PULSE.CLIENT = {}; }
if ( !PULSE.CLIENT.Poll )     { PULSE.CLIENT.Poll = {}; }


PULSE.CLIENT.Poll.ListView = function( container, config, tournament )
{
    this.$container = $( container );
    this.config = config;
    this.name = config.name || 'poll';
    this.cookiePath = config.cookieOptions ? config.cookieOptions.path : undefined;

    this.templates = {
        unanswered: config.templates.unanswered,
        question: config.templates.question,
        answered: config.templates.answered
    };
    this.currentView = 'home';

    /**
     * $container is the wrapper for the template
     */
    this.views = {
        $homeView: this.$container.find( 'div.fanPollSection.homeScreen' ),
        $questionView: this.$container.find( 'div.fanPollSection.question' )
    };
    this.$message = this.$container.find( '.message' );

    this.controller = new PULSE.CLIENT.Poll.Controller( container, config );
    this.setSubscriptions();
    this.setEventListeners();
};

PULSE.CLIENT.Poll.ListView.prototype.setEventListeners = function()
{
    var that = this;

    /**
     * Whenever a question in a question list is clicked, render the next views
     * and slide to the next view (the question-with-options) view
     */
    this.$container.on( 'click', 'a.fanPollBtn', function( e )
    {
        var qid = $(this).attr( 'data-question-id' );

        that.currentQuestion = parseInt( qid, 10 );
        that.update( 'question' );

        e.preventDefault();
        e.stopPropagation();
    } );

    /**
     * Whenever a question option is clicked on, call the controller's
     * 'answerQuestion' function, which sends an ajax request for the vote
     */
    this.views.$questionView.on( 'click', 'a.answer', function( e )
    {
        var qid = $( this ).attr( 'data-question-id' ),
            option = $( this ).attr( 'data-option-index' );

        that.controller.answerQuestion( qid, option );

        e.preventDefault();
        e.stopPropagation();
    } );
};

PULSE.CLIENT.Poll.ListView.prototype.setSubscriptions = function()
{
    var that = this;

    /**
     * When new data comes in, update the current view
     */
    this.$container.on( 'poll/data', function( e, params )
    {
        if( that.$container.hasClass( 'open' ) )
        {
            // Update the view that is currently being displayed
            that.update( that.currentView );
        }
    } );

    /**
     * If an answer was accepted/went through correctly,
     * slide to the answers breakdown view
     */
    this.$container.on( 'poll/answer', function( e, params )
    {
        if( params.success )
        {
            that.update( 'answer' );
        }
        else
        {
            that.update( 'home', 'There was a problem with your vote. Please try again later' );
        }
    } );
};

PULSE.CLIENT.Poll.ListView.prototype.refresh = function()
{
    this.update( this.currentView );
};

PULSE.CLIENT.Poll.ListView.prototype.update = function( view, message )
{
    var that = this,
        $view;

    if( message )
    {
        this.$message.html( message ).show();
    }
    else
    {
        this.$message.hide();
    }

    // Hide all views
    for( $view in this.views )
    {
        this.views[ $view ].hide();
    }

    // Update and show the given view
    switch( view )
    {
        case 'home':
            this.renderUnansweredQuestions();
            this.renderAnsweredQuestions();
            this.views.$homeView.show();
            break;
        case 'question':
            this.renderQuestion( this.currentQuestion );
            this.renderUnansweredQuestions();
            this.renderAnsweredQuestions();
            this.views.$questionView.show();
            break;
        case 'answer':
            this.renderAnswer( this.currentQuestion );
            this.renderUnansweredQuestions();
            this.renderAnsweredQuestions();
            this.views.$questionView.show();
            break
        default: // default to home view
            this.renderUnansweredQuestions();
            this.renderAnsweredQuestions();
            this.views.$homeView.show();
            break;
    }

    this.currentView = view;
};

/**
 * Question lists
 */

PULSE.CLIENT.Poll.ListView.prototype.renderUnansweredQuestions = function()
{
    var model = this.controller.model.getQuestions( 'unanswered' ),
        $unansweredList = this.$container.find( 'ul.unanswered' );

    PULSE.CLIENT.Template.publish(
        this.templates.unanswered,
        $unansweredList,
        { questions: model }
    );
};

PULSE.CLIENT.Poll.ListView.prototype.renderAnsweredQuestions = function()
{
    var model = this.controller.model.getQuestions( 'answered' ),
        $answeredList = this.$container.find( 'ul.answered' );

    PULSE.CLIENT.Template.publish(
        this.templates.answered,
        $answeredList,
        { questions: model }
    );
};

/**
 * Single questions
 */

PULSE.CLIENT.Poll.ListView.prototype.renderQuestion = function( questionId )
{
    if( !questionId )
    {
        return;
    }

    var model = this.controller.model.getQuestionById( questionId ),
        $question = this.views.$questionView.find( '.openedQuestion' );

    $question.removeClass( 'showResults' );

    PULSE.CLIENT.Template.publish(
        this.templates.question,
        $question,
        model
    );
};

PULSE.CLIENT.Poll.ListView.prototype.renderAnswer = function( questionId )
{
    if( !questionId )
    {
        return;
    }

    this.renderQuestion( questionId );
    this.views.$questionView.find( '.openedQuestion .answer' ).addClass( 'showResults' );
};
if ( !PULSE )                   	{ var PULSE = {}; }
if ( !PULSE.CLIENT )            	{ PULSE.CLIENT = {}; }
if ( !PULSE.CLIENT.CRICKET )    	{ PULSE.CLIENT.CRICKET = {}; }

PULSE.CLIENT.CRICKET.Rankings = function(container, config, widget)
{
    this.$container = container;
    this.config = config;

    this.widget = ( typeof widget === 'undefined' ? 'Table' : widget );

    this.type;

    this.rankingTypes = [
       'TEST',
       'ODI',
       'T20I',
       'WOMENS'
    ]

    this.templateHeaders = {
        TEST: [ 'Rank', 'Team', 'Matches', 'Points', 'Rating' ],
        ODI: [ 'Rank', 'Team', 'Matches', 'Points', 'Rating' ],
        T20I: [ 'Rank', 'Team', 'Matches', 'Points', 'Rating' ],
        All: [ 'Rank', 'Team', 'Matches', 'Points', 'Rating' ]
    }

    this.template = 'templates/rankings/rankingstable/table.html';

    this.model = new PULSE.CLIENT.CRICKET.RankingsModels();

    if ( this.setType() )
    {
        this.model.getRankingsData( this.category );
    }
};


PULSE.CLIENT.CRICKET.Rankings.prototype.setType = function()
{
    if( typeof this.config['data-match-type'] !== 'undefined')
    {
        var type = this.config['data-match-type'];
    }
    else
    {
        var url = window.location.href,
            type = url.substring(url.lastIndexOf('/') + 1, url.length);
    }

    type = type.toUpperCase();

    if( ~ $.inArray( type, this.rankingTypes ) )
    {
        this.category = type === 'WOMENS' ? 'women' : 'men';
        this.type = type === 'WOMENS' ? 'All' : type;
        this.setTabHeader();
        this.showHidePredictor();
        return true;
    }
};


PULSE.CLIENT.CRICKET.Rankings.prototype.render = function(details)
{
    if( typeof details === 'undefined' )
    {
        var model = this.model.getRankingsModel( this.category, true ),
            unrankedModel;

        if( this.type === 'T20I' )
        {
            unrankedModel = this.model.getRankingsModel( this.category, false );
            unrankedModel = unrankedModel[ this.type ];
        }

        details = {
            model: model[ this.type ],
            unrankedModel: unrankedModel,
            template : this.template,
            headings: this.templateHeaders[ this.type ],
            type: this.type,
            widget: this.widget,
            selector: 'section.standings'
        }
    }

    PULSE.CLIENT.Template.publish(
        details.template,
        details.selector,
        details
    );
};

PULSE.CLIENT.CRICKET.Rankings.prototype.setTabHeader = function()
{
    switch( this.type )
    {
        case 'TEST':
        $('.secondaryNav ul li').eq(0).find('a').addClass('active')
                                              .append('<span></span>');
        break;

        case 'ODI':
        $('.secondaryNav ul li').eq(1).find('a').addClass('active')
                                              .append('<span></span>');
        break;

        case 'T20I':
        $('.secondaryNav ul li').eq(2).find('a').addClass('active')
                                              .append('<span></span>');
        break;

        case 'All':
        $('.secondaryNav ul li').eq(3).find('a').addClass('active')
                                              .append('<span></span>');
        break;
    }
};

PULSE.CLIENT.CRICKET.Rankings.prototype.showHidePredictor = function()
{
    $( '.column.right' ).toggle( this.category !== 'women' );
};

if ( !PULSE )                   	{ var PULSE = {}; }
if ( !PULSE.CLIENT )            	{ PULSE.CLIENT = {}; }
if ( !PULSE.CLIENT.CRICKET )    	{ PULSE.CLIENT.CRICKET = {}; }

/**
 * Requires a div.pointsTable wrapper in which to drop the table template
 * Please adjust PULSE.CLIENT.CRICKET.Standings.prototype.updateTable otherwise
 */
PULSE.CLIENT.CRICKET.Standings = function ( container, tournament, groups, options )
{
	this.$container = $( container );
	this.tournament = tournament;
	this.groups 	= groups;
	this.options 	= options || {};
	this.hide 		= this.options.hideIfOutsideOfStage;
	this.widgetType = this.options.widgetType || "full";
	this.callback 	= this.options.callback;
    this.start      = this.options.start;

	this.components = {};

	if( this.options.templates )
	{
		this.templates = this.options.templates;
	}
	else
	{
		this.templates = {
			full: "templates/standings/standings-table-full.html",
			groups: "templates/standings/standings-table-groups.html",
			abridged: "templates/standings/standings-table-abridged.html"
		};
	}

	this.tournament.getMatchSchedule( this.start );
	this.tournament.getGroupStandings( this.start );

	var that = this;
	$( 'body' ).on( 'standings/update', function( e, params )
    {
		if( params.success && !that.stopUpdating )
		{
			that.updateTable();
		}
	} );
	$( 'body' ).on( 'schedule/update', function( e, params )
    {
		if( params.success && that.hide )
		{
            that.hasSchedule = true;
			that.updateWidgetState();
		}
	} );
};

PULSE.CLIENT.CRICKET.Standings.prototype.updateTable = function()
{
    var that = this,
        model = {
            groups: [],
            tournamentName: this.tournament.tournamentName
        },
        i, groupName, groupModel;

	for( i = 0, iLimit = this.groups.length; i < iLimit; i++ )
	{
		groupName = this.groups[i];

        if( this.groups.length === 1 && !groupName )
        {
        	groupModel = this.tournament.getStandingsModel( 0 );
        }
        else
        {
        	groupModel = this.tournament.getStandingsModelByGroupName( groupName );
        }

		model.groups.push( groupModel );
	}

	PULSE.CLIENT.Template.publish(
		this.templates[ this.widgetType ],
		this.$container,
		model,
		function() {
			if( that.callback )
			{
				that.callback();
			}
		}
	);
};

// Hide widget if no longer needed (i.e., all group matches are complete)
PULSE.CLIENT.CRICKET.Standings.prototype.updateWidgetState = function()
{
	if( this.tournament.isInPlayoffStage() )
	{
		this.stopUpdating = true;
		this.$container.hide();
	}
};
if( !PULSE ) { var PULSE = {}; }
if( !PULSE.CLIENT ) { PULSE.CLIENT = {}; }
if( !PULSE.CLIENT.CRICKET ) { PULSE.CLIENT.CRICKET = {}; }

/**
 * Widget for displaying a statistic for a single player.
 */
PULSE.CLIENT.CRICKET.TeamHeadToHead = function ( config )
{
    this.config = config;
    this.tournaments = config.tournaments;

    this.template = config.template;

    if ( config.container )
    {
        this.$container = $( config.container )
    }

    this.teamStats = new PULSE.CLIENT.CRICKET.TeamStat( this.$container, this.config, this.tournaments );

};

PULSE.CLIENT.CRICKET.TeamHeadToHead.prototype.getHeadToHead = function( team1, team2 )
{

    var team1Matches = this.teamStats.teamMatches[ team1 ],
        details = { headToHeadMatches : [],
            teamDraw : 0,
            team1 : {},
            team2 : {}
        },
        infoFound = false;

    details.team1.won = 0;
    details.team1.lost = 0;
    details.team2.won = 0;
    details.team2.lost = 0;

    if ( team1Matches )
    {
        for ( var i = 0; i < team1Matches.matches.length; i++ )
        {
            if ( team1Matches.matches[ i ].team1id == team2 || team1Matches.matches[ i ].team2id == team2 )
            {
                if ( team1Matches.matches[ i ].team1id == team2 )
                {

                    if ( team1Matches.matches[ i ].team1won )
                    {
                        details.team2.won = details.team2.won + 1;
                        details.team1.lost = details.team1.lost + 1;
                    }
                    else if ( team1Matches.matches[ i ].team2won )
                    {
                        details.team1.won = details.team1.won + 1;
                        details.team2.lost = details.team2.lost + 1;
                    }
                    else
                    {
                        details.teamDraw = details.teamDraw + 1;
                    }
                }
                else
                {
                    if ( team1Matches.matches[ i ].team1won )
                    {
                        details.team1.won = details.team1.won + 1;
                        details.team2.lost = details.team2.lost + 1;
                    }
                    else if ( team1Matches.matches[ i ].team2won )
                    {
                        details.team2.won = details.team2.won + 1;
                        details.team1.lost = details.team1.lost + 1;
                    }
                    else
                    {
                        details.teamDraw = details.teamDraw + 1;
                    }
                }
                details.headToHeadMatches.push( team1Matches.matches[ i ] );
            }
        }
    }

    details.team1.winRate = ( this.teamStats.getWinPercentageForTeam( team1 ).stat * 100 ).toFixed( 0 ) + '%';
    details.team2.winRate = ( this.teamStats.getWinPercentageForTeam( team2 ).stat * 100 ).toFixed( 0 ) + '%';

    details.team1.headToHeadRate = ( ( details.team1.won / details.headToHeadMatches.length ) * 100 ).toFixed( 0 ) + '%';
    details.team2.headToHeadRate = ( ( details.team2.won / details.headToHeadMatches.length ) * 100 ).toFixed( 0 ) + '%';

    return details;
}

PULSE.CLIENT.CRICKET.TeamHeadToHead.prototype.renderHeadToHead = function( container, team1, team2, extraFields, template )
{
    if (!( team1 && team2 ) || team1 < 0 || team2 < 0 )
    {
        return;
    }

    var details = this.getHeadToHead( team1, team2 ),
        $useContainer = this.$container,
        useTemplate = this.template;

    if ( container )
    {
        $useContainer = $( container );
    }

    if ( template )
    {
        useTemplate = template;
    }

    if ( extraFields )
    {
        for ( var element in extraFields )
        {
            details[ element ] = extraFields[ element ];
        }
    }

    console.log( details )

    PULSE.CLIENT.Template.publish(
        useTemplate,
        $useContainer,
        details
    );
}
if ( !PULSE )                       { var PULSE = {}; }
if ( !PULSE.CLIENT )                { PULSE.CLIENT = {}; }
if ( !PULSE.CLIENT.CRICKET )        { PULSE.CLIENT.CRICKET = {}; }

/**
 * Widget for displaying a statistic for a single player.
 */
PULSE.CLIENT.CRICKET.TeamStat = function ( container, config, tournaments )
{
    this.$container = $( container );
    this.tournaments = tournaments;

    this.config = config;

    this.teamId = config.teamId;
    this.statClass = config.statClass;

    this.num = config.num;
    this.template =  config.template || 'templates/stats/team-card.html';
    this.team = config.team;
    this.tournamentGroupName = config.tournamentGroupName || 'cwc';
    this.statsIcon = config.statsIcon || 'statsIcon';
    this.url = undefined;

    if ( config.url )
    {
        this.url = config.url;
    }

    this.teams = [];
    this.tournaments = [];

    var options = {
        metaSchedule: this.tournamentGroupName,
        widgetConfig: 'metaresults_widget'
    };

    this.tournamentGroup = window.WidgetController.getTournamentByName( this.tournamentGroupName );
    this.metaSched = new PULSE.CLIENT.CRICKET.MetaSchedule( options );
    this.urlGenerator = PULSE.CLIENT.CRICKET.getUrlGenerator( this.tournamentGroupName );

    var MS_IDS = this.urlGenerator.getMSIds();
    var matchTypes = [];

    if( this.tournamentGroup && this.tournamentGroup.matchTypes &&
        this.tournamentGroup.matchTypes.length && MS_IDS[ this.tournamentGroup.matchTypes[ 0 ] ] )
    {
        matchTypes.push( MS_IDS[ this.tournamentGroup.matchTypes[ 0 ] ] );
    }

    this.filters = {
        'mt' : matchTypes,  // match types ids
        'te' : [],          // team ids
        'to' : this.tournaments,          // tournaqment ids
        'vr' : [],          // region ids
        'vc' : [],          // country ids
        'v'  : [],          // venue ids
        'tt' : [],          // team types
        's'  : ['C'],       // results requires 'C' matches
        'sd' : undefined,
        'ed' : undefined,
        'p'  : 1,
        'ps' : 500,
        'o'  : ['cd'],
        'se' : true
    };

    this.metaSched.requestData( this.filters );

    this.setSubscriptions();
};

PULSE.CLIENT.CRICKET.TeamStat.prototype.setSubscriptions = function()
{
    var that = this;
    $('body').on( 'metaSchedule/data', function( e, params ) {
        if( params.success )
        {
            that.getCompleteMatchModels();
        }
    } );

    $('body').on( 'metaSchedule/meta', function( e, params ) {
        if( params.success )
        {
            that.getMetaDataModel();
        }
    } );

};

PULSE.CLIENT.CRICKET.TeamStat.prototype.getCompleteMatchModels = function()
{
    this.teamMatches = this.metaSched.mdl.getCompleteModelByTeams();
    this.allMatches = this.metaSched.mdl.getCompleteModel();

    PULSE.CLIENT.notify( 'teamStats/model', { success: true } );
}

PULSE.CLIENT.CRICKET.TeamStat.prototype.getTeams = function()
{
    return this.teams;
}

PULSE.CLIENT.CRICKET.TeamStat.prototype.getTournaments = function()
{
    return this.tournaments;
}

PULSE.CLIENT.CRICKET.TeamStat.prototype.getMetaDataModel = function()
{
    this.tournaments = this.metaSched.mdl.meta.tournaments;

    this.teams = [];
    if ( this.metaSched && this.metaSched.mdl && this.metaSched.mdl.meta && this.metaSched.mdl.meta.teams )
    {
        var teams = this.metaSched.mdl.meta.teams;
        for ( var i = 0; i < teams.length; i++ )
        {
            if ( teams[ i ].members )
            {
                for ( var j = 0; j < teams[ i ].members.length; j++ )
                {
                    this.teams.push( teams[ i ].members[ j ] );
                }
            }
        }
    }

    PULSE.CLIENT.notify( 'teamStats/meta', { success: true } );
}

PULSE.CLIENT.CRICKET.TeamStat.prototype.statTypes = {

    WIN_PERCENTAGE              : 'win-percentage',
    MOST_TROPHIES               : 'most-trophies',
    HIGHEST_TOTAL               : 'highest-total',
    LOWEST_TOTAL                : 'lowest-total',
    BIGGEST_WIN_MARGIN_FIRST    : 'biggest-win-margin-first',
    BIGGEST_WIN_MARGIN_SECOND   : 'biggest-win-margin-second',
    SMALLEST_WIN_MARGIN_FIRST   : 'smallest-win-margin-first',
    SMALLEST_WIN_MARGIN_SECOND  : 'smallest-win-margin-second',
    HIGHEST_MATCH_AGGREGATE     : 'highest-match-aggregate',
    LOWEST_MATCH_AGGREGATE      : 'lowest-match-aggregate',
    MOST_WINS                   : 'most-wins',
    MOST_LOST                   : 'most-lost'
};

PULSE.CLIENT.CRICKET.TeamStat.prototype.renderStat = function( container, type, config )
{
    var useNum,
        useTemplate,
        useTeam,
        useIcon,
        useHeader,
        $useContainer,
        useUrl;

    switch ( type )
    {
        case this.statTypes.WIN_PERCENTAGE:
            this.stats = this.getMatches( 'percent' );
            this.statName = 'winPercentage';
            this.statHeader = 'Highest Win Percentage';
            this.statCategory = 'overallData';
            break;

        case this.statTypes.MOST_TROPHIES:
            this.stats = this.getMostTrophies();
            this.statName = 'mostTrophies';
            this.statHeader = 'Most Trophies';
            this.statCategory = 'trophy';
            break;

        case this.statTypes.HIGHEST_TOTAL:
            this.stats = this.getTotal( true );
            this.statName = 'highestTotal';
            this.statHeader = 'Highest Total';
            this.statCategory = 'matchData';
            break;

        case this.statTypes.LOWEST_TOTAL:
            this.stats = this.getTotal( false );
            this.statName = 'lowestTotal';
            this.statHeader = 'Lowest Total';
            this.statCategory = 'matchData';
            break;

        case this.statTypes.BIGGEST_WIN_MARGIN_FIRST:
            this.stats = this.getMargin( true, true );
            this.statName = 'biggestWinMarginFirst';
            this.statHeader = 'Biggest Winning Margin Batting 1st';
            this.statCategory = 'matchData';
            break;

        case this.statTypes.BIGGEST_WIN_MARGIN_SECOND:
            this.stats = this.getMargin( true, false );
            this.statName = 'biggestWinMarginSecond';
            this.statHeader = 'Biggest Winning Margin Batting 2nd';
            this.statCategory = 'matchData';
            break;


        case this.statTypes.SMALLEST_WIN_MARGIN_FIRST:
            this.stats = this.getMargin( false, true );
            this.statName = 'smallestWinMarginFirst';
            this.statHeader = 'Smallest Winning Margin Batting 1st';
            this.statCategory = 'matchData';
            break;

        case this.statTypes.SMALLEST_WIN_MARGIN_SECOND:
            this.stats = this.getMargin( false, false );
            this.statName = 'smallestWinMarginSecond';
            this.statHeader = 'Smallest Winning Margin Batting 2nd';
            this.statCategory = 'matchData';
            break;

        case this.statTypes.HIGHEST_MATCH_AGGREGATE:
            this.stats = this.getAggregate( true );
            this.statName = 'highestMatchAggregate';
            this.statHeader = 'Highest Match Aggregate';
            this.statCategory = 'matchData';
            break;

        case this.statTypes.LOWEST_MATCH_AGGREGATE:
            this.stats = this.getAggregate( false );
            this.statName = 'lowestMatchAggregate';
            this.statHeader = 'Lowest Match Aggregate';
            this.statCategory = 'matchData';
            break;

        case this.statTypes.MOST_WINS:
            this.stats = this.getMatches( 'won' );
            this.statName = 'mostWins';
            this.statHeader = 'Most Wins';
            this.statCategory = 'matchData';
            break;

        case this.statTypes.MOST_LOST:
            this.stats = this.getMatches( 'lost' );
            this.statName = 'mostLost';
            this.statHeader = 'Most Lost';
            this.statCategory = 'matchData';
            break;

        default:
            this.stats = this.getMatches( 'percent' );
            this.statName = 'winPercentage';
            this.statHeader = 'Win Percentage';
            this.statCategory = 'matchData';
            break;
    }

    if ( container )
    {
        $useContainer = $( container );
    }
    else
    {
        $useContainer = this.$container;
    }

    if ( config )
    {
        if ( config.num )
        {
            useNum = config.num;
        }
        else
        {
            useNum = this.num;
        }

        if ( config.template )
        {
            useTemplate = config.template;
        }
        else
        {
            useTemplate = this.template
        }

        if ( config.teamId )
        {
            useTeam = config.teamId;
        }
        else
        {
            useTeam = this.teamId;
        }

        if ( config.statsIcon )
        {
            useIcon = config.statsIcon
        }
        else
        {
            useIcon = this.statsIcon;
        }

        if ( config.header )
        {
            useHeader = config.header
        }
        else
        {
            useHeader = this.statHeader;
        }

        if ( config.url )
        {
            useUrl = config.url;
        }
        else
        {
            useUrl = this.url;
        }
    }

    if ( useTeam )
    {
        this.stats = this.filterByTeamId( this.stats, useTeam );
    }

    if ( !useNum || this.stats.length <= useNum - 1 )
    {
        useNum = this.stats.length;
    }

    if ( useNum > 0 )
    {
        PULSE.CLIENT.Template.publish(
            useTemplate,
            $useContainer,
            { stats : this.stats,
              header : useHeader,
              num : useNum,
              icon : useIcon,
              teamId : useTeam,
              url : useUrl }
        );
    }
};

/**
 * Filters team card to players from a given team.
 * @param  {array} stats Filters the array of players to find those in a specific team if this.teamId
 *                       has been set.
 * @return {array}       Returns a team specific filtered array. Returns original array if no team
 *                       has been set.
 */
PULSE.CLIENT.CRICKET.TeamStat.prototype.filterByTeamId = function( stats, teamId )
{
    var filtered = [];

    if ( !teamId ) {
        return stats;
    }

    for (var i=0; i < stats.length; i++) {

        if (stats[i].team.id == teamId) {
            filtered.push(stats[i]);
        }
    }

    return filtered;
};

PULSE.CLIENT.CRICKET.TeamStat.prototype.hasTeam = function( key )
{
    if ( this.teamMatches && this.teamMatches[ key ] )
    {
        return true;
    }
    else
    {
        return false;
    }
}

PULSE.CLIENT.CRICKET.TeamStat.prototype.getWinPercentageForTeam = function( key, type )
{
    if ( this.teamMatches && this.teamMatches[ key ] )
    {
        var amountWon = 0,
                amountLost = 0,
                numMatches = this.teamMatches[ key ].matches.length;
        for ( var i = 0; i < numMatches; i++ )
        {
            if ( this.teamMatches[ key ].matches[ i ].team1id == parseInt( key ) )
            {
                if ( this.teamMatches[ key ].matches[ i ].team1won )
                {
                    amountWon = amountWon + 1;
                }
                else if ( this.teamMatches[ key ].matches[ i ].team2won )
                {
                    amountLost = amountLost + 1;
                }
            }
            else
            {
                if ( this.teamMatches[ key ].matches[ i ].team2won )
                {
                    amountWon = amountWon + 1;
                }
                else if ( this.teamMatches[ key ].matches[ i ].team1won )
                {
                    amountLost = amountLost + 1;
                }
            }
        }
        var extra = 'PLD ' + numMatches + ' WON ' + amountWon + ' LOST ' + amountLost;
        var info;
        var stat;
        switch ( type )
        {
            case 'won':
                stat = amountWon;
                info = {
                    played : numMatches,
                    lost : amountLost
                }
                break;
            case 'lost':
                stat = amountLost;
                info = {
                    played : numMatches,
                    won : amountWon
                }
                break;
            default:
                stat = amountWon / this.teamMatches[ key ].matches.length;
                info = {
                    played : numMatches,
                    won : amountWon,
                    lost : amountLost
                }
                break;
        }
        return { extra : extra, stat: stat, team : this.teamMatches[ key ].team, info : info };
    }
    else
    {
        return { extra: 'PLD 0 WIN 0 LOSE 0', stat : 0, team : undefined };
    }

}

PULSE.CLIENT.CRICKET.TeamStat.prototype.getMatches = function( type )
{
    var amountWonArray = [];

    for ( var key in this.teamMatches )
    {
        amountWonArray.push( this.getWinPercentageForTeam( key, type ) );
    }

    amountWonArray.sort( function( a, b )
    {
        var abbrA = a.stat, abbrB = b.stat;
        if( abbrA < abbrB ) //sort abbreviation ascending
        {
            return 1;
        }
        else
        {
            return -1;
        }
       return 0; //default return value (no sorting)
    } );

    if ( type === 'percent' )
    {
        for ( var i = 0; i < amountWonArray.length; i++ )
        {
            amountWonArray[ i ].stat = ( amountWonArray[ i ].stat * 100 ).toFixed( 0 ) + '%';
        }
    }

    return amountWonArray;
}

PULSE.CLIENT.CRICKET.TeamStat.prototype.getMostTrophies = function()
{
    var mostTrophiesArray = [];

    for ( var key in this.teamMatches )
    {
        var trophiesWon = 0;
        var tournaments = [];

        for ( var i = 0; i < this.teamMatches[ key ].matches.length; i++ )
        {
            if ( this.teamMatches[ key ].matches[ i ].label && 'Final'.indexOf( this.teamMatches[ key ].matches[ i ].label ) > -1 )
            {
                if ( this.teamMatches[ key ].matches[ i ].team1id == parseInt( key ) )
                {
                    if ( this.teamMatches[ key ].matches[ i ].team1won )
                    {
                        trophiesWon = trophiesWon + 1;
                    }
                }
                else
                {
                    if ( this.teamMatches[ key ].matches[ i ].team2won )
                    {
                        trophiesWon = trophiesWon + 1;
                    }
                }
            }
            if ( tournaments.indexOf( this.teamMatches[ key ].matches[ i ].tournamentLabel ) < 0 )
            {
                tournaments.push( this.teamMatches[ key ].matches[ i ].tournamentLabel );
            }
        }
        var extra = 'Tournaments Played ' + tournaments.length;
        var info = {
            Tournaments : tournaments.length
        }   
        mostTrophiesArray.push( { extra : extra, stat: trophiesWon, team : this.teamMatches[ key ].team, info : info } );
    }

    mostTrophiesArray.sort( function( a, b )
    {
        var abbrA = a.stat, abbrB = b.stat;
        if( abbrA < abbrB ) //sort abbreviation ascending
        {
            return 1;
        }
        else
        {
            return -1;
        }
       return 0; //default return value (no sorting)
    } );

    return mostTrophiesArray;
}

PULSE.CLIENT.CRICKET.TeamStat.prototype.getTotal = function( highest )
{
    var highestTotal = [];

    for ( var i = 0; i < this.allMatches.matches.length; i++ )
    {
        if ( this.allMatches.matches[ i ].team1innings && this.allMatches.matches[ i ].team2innings && this.allMatches.matches[ i ].team1innings.length > 0 && this.allMatches.matches[ i ].team2innings.length > 0 && ( this.allMatches.matches[ i ].team1won || this.allMatches.matches[ i ].team2won ) )
        {
            for ( var j = 0; j < this.allMatches.matches[ i ].team1innings.length; j++ )
            {
                var extra = 'AGAINST ' + this.allMatches.matches[ i ].team2fullName;
                var info = { opponent : this.allMatches.matches[ i ].team2fullName };
                if ( this.allMatches.matches[ i ].formattedMatchDate )
                {
                    var splitDate = this.allMatches.matches[ i ].formattedMatchDate.split( ' ' );
                    if ( splitDate && splitDate.length > 0 )
                    {
                        extra = extra + ' ( ' + splitDate[ splitDate.length - 1 ] + ' ) ';
                        info.year = splitDate[ splitDate.length - 1 ];
                    }
                }
                highestTotal.push( { extra : extra,
                                    stat: this.allMatches.matches[ i ].team1innings[ j ],
                                    team : {
                                            id : this.allMatches.matches[ i ].team1id,
                                            fullName : this.allMatches.matches[ i ].team1fullName,
                                            abbreviation : this.allMatches.matches[ i ].team1abbr
                                            },
                                    info : info
                                    } );
            }
            for ( var j = 0; j < this.allMatches.matches[ i ].team2innings.length; j++ )
            {
                var extra = 'AGAINST ' + this.allMatches.matches[ i ].team1fullName;
                var info = { opponent : this.allMatches.matches[ i ].team1fullName };
                if ( this.allMatches.matches[ i ].formattedMatchDate )
                {
                    var splitDate = this.allMatches.matches[ i ].formattedMatchDate.split( ' ' );
                    if ( splitDate && splitDate.length > 0 )
                    {
                        extra = extra + ' ( ' + splitDate[ splitDate.length - 1 ] + ' ) ';
                        info.year = splitDate[ splitDate.length - 1 ];
                    }
                }
                highestTotal.push( { extra : extra,
                                    stat: this.allMatches.matches[ i ].team2innings[ j ],
                                    team : {
                                            id : this.allMatches.matches[ i ].team2id,
                                            fullName : this.allMatches.matches[ i ].team2fullName,
                                            abbreviation : this.allMatches.matches[ i ].team2abbr
                                            },
                                    info : info
                                    }
                                     );
            }
        }
    }

    highestTotal.sort( function( a, b )
    {
        var abbrA = parseInt( a.stat.split( "/" )[ 0 ] ), abbrB = parseInt( b.stat.split( "/" )[ 0 ] );
        if( abbrA < abbrB ) //sort abbreviation ascending
        {
            if ( highest )
            {
                return 1;
            }
            else
            {
                return -1;
            }
        }
        else
        {
            if ( highest )
            {
                return -1;
            }
            else
            {
                return 1;
            }
        }
       return 0; //default return value (no sorting)
    } );

    return highestTotal;
}

PULSE.CLIENT.CRICKET.TeamStat.prototype.getScore = function( runs, matchIndex, teamIndex )
{
     var totalScore = 0,
        inningsName = 'team' + ( teamIndex + 1 ) + 'innings';
    for ( var j = 0; j < this.allMatches.matches[ matchIndex ][ inningsName ].length; j++ )
    {
        var splitInnings = this.allMatches.matches[ matchIndex ][ inningsName ][ j ].split( "/" );
        if ( runs )
        {
            totalScore = totalScore + parseInt( splitInnings[ 0 ] );
        }
        else
        {
            if ( splitInnings.length > 1 )
            {
                totalScore = totalScore + parseInt( splitInnings[ 1 ] );
            }
            else
            {
                totalScore = totalScore + 10;
            }
        }
    }

    return totalScore;
}

PULSE.CLIENT.CRICKET.TeamStat.prototype.getMargin = function( highest, first )
{
    var margins = [];

    for ( var i = 0; i < this.allMatches.matches.length; i++ )
    {
        if ( this.allMatches.matches[ i ].team1innings && this.allMatches.matches[ i ].team2innings && this.allMatches.matches[ i ].team1innings.length > 0 && this.allMatches.matches[ i ].team2innings.length > 0 )
        {
                var score1 = this.getScore( first, i, 0 ),
                    score2 = this.getScore( first, i, 1 ),
                    diff,
                    opponent,
                    team;

                if ( first )
                {
                    if ( this.allMatches.matches[ i ].team1battingFirst && this.allMatches.matches[ i ].team1won )
                    {
                        diff = score1 - score2;
                    }

                    if ( this.allMatches.matches[ i ].team2battingFirst && this.allMatches.matches[ i ].team2won )
                    {
                        diff = score2 - score1;
                    }
                }
                else
                {
                    if ( this.allMatches.matches[ i ].team2battingFirst && this.allMatches.matches[ i ].team1won )
                    {
                        diff = score2 - score1;
                    }

                    if ( this.allMatches.matches[ i ].team1battingFirst && this.allMatches.matches[ i ].team2won )
                    {
                        diff = score1- score2;
                    }
                }

                if ( diff > 0 )
                {

                    if ( this.allMatches.matches[ i ].team1won )
                    {
                        opponent = this.allMatches.matches[ i ].team2fullName;
                        team = {
                                id : this.allMatches.matches[ i ].team1id,
                                fullName : this.allMatches.matches[ i ].team1fullName,
                                abbreviation : this.allMatches.matches[ i ].team1abbr
                                }
                    }
                    else
                    {
                        opponent = this.allMatches.matches[ i ].team1fullName;
                        team = {
                                id : this.allMatches.matches[ i ].team2id,
                                fullName : this.allMatches.matches[ i ].team2fullName,
                                abbreviation : this.allMatches.matches[ i ].team2abbr
                                }
                    }

                    var extra = 'AGAINST ' + opponent;
                    var info = { opponent : opponent };
                    if ( this.allMatches.matches[ i ].formattedMatchDate )
                    {
                        var splitDate = this.allMatches.matches[ i ].formattedMatchDate.split( ' ' );
                        if ( splitDate && splitDate.length > 0 )
                        {
                            extra = extra + ' ( ' + splitDate[ splitDate.length - 1 ] + ' ) ';
                            info.year = splitDate[ splitDate.length - 1 ];
                        }
                    }
                    margins.push( { extra : extra,
                                    stat: diff,
                                    team : team,
                                    info : info
                                } );
                }
        }
    }

    margins.sort( function( a, b )
    {
        var abbrA = parseInt( a.stat ), abbrB = parseInt( b.stat );
        if( abbrA < abbrB ) //sort abbreviation ascending
        {
            if ( highest )
            {
                return 1;
            }
            else
            {
                return -1;
            }
        }
        else
        {
            if ( highest )
            {
                return -1;
            }
            else
            {
                return 1;
            }
        }
       return 0; //default return value (no sorting)
    } );

    for ( var i = 0; i < margins.length; i++ )
    {
        var suffix = ' Wicket';
        if ( first )
        {
            suffix = ' Run';
        }


        if ( margins[ i ].stat != 1 )
        {
            suffix = suffix + 's';
        }

        margins[ i ].stat = margins[ i ].stat + suffix;
    }

    return margins;
}

PULSE.CLIENT.CRICKET.TeamStat.prototype.getAggregate = function( highest )
{
    var aggregate = [];

    for ( var i = 0; i < this.allMatches.matches.length; i++ )
    {
        if ( this.allMatches.matches[ i ].team1innings && this.allMatches.matches[ i ].team2innings && this.allMatches.matches[ i ].team1innings.length > 0 && this.allMatches.matches[ i ].team2innings.length > 0 )
        {
            var score = this.getScore( true, i, 0 ) + this.getScore( true, i, 1 );

            var extra = '';
            var info  = {};
            if ( this.allMatches.matches[ i ].formattedMatchDate )
            {
                var splitDate = this.allMatches.matches[ i ].formattedMatchDate.split( ' ' );
                if ( splitDate && splitDate.length > 0 )
                {
                    extra = extra + ' ( ' + splitDate[ splitDate.length - 1 ] + ' ) ';
                    info.year = splitDate[ splitDate.length - 1 ];
                }
            }

            aggregate.push( {
                stat: score,
                team1 : {
                        id : this.allMatches.matches[ i ].team1id,
                        fullName : this.allMatches.matches[ i ].team1fullName,
                        abbreviation : this.allMatches.matches[ i ].team1abbr
                        },
                team2 : {
                        id : this.allMatches.matches[ i ].team2id,
                        fullName : this.allMatches.matches[ i ].team2fullName,
                        abbreviation : this.allMatches.matches[ i ].team2abbr
                        },
                extra : extra,
                info : info
                } );
        }
    }

    aggregate.sort( function( a, b )
    {
        var abbrA = parseInt( a.stat ), abbrB = parseInt( b.stat );
        if( abbrA < abbrB ) //sort abbreviation ascending
        {
            if ( highest )
            {
                return 1;
            }
            else
            {
                return -1;
            }
        }
        else
        {
            if ( highest )
            {
                return -1;
            }
            else
            {
                return 1;
            }
        }
       return 0; //default return value (no sorting)
    } );

    for ( var i = 0; i < aggregate.length; i++ )
    {
        var suffix = ' Runs';
        if ( aggregate[ i ].stat == 1 )
        {
            suffix = ' Run';
        }

        aggregate[ i ].stat = aggregate[ i ].stat + suffix;
    }

    return aggregate;
}
if (!PULSE)                             { var PULSE = {}; }
if (!PULSE.CLIENT)                      { PULSE.CLIENT = {}; }
if (!PULSE.CLIENT.CRICKET)              { PULSE.CLIENT.CRICKET = {}; }

PULSE.CLIENT.CRICKET.TournamentGroupStats = function( group )
{
    this.groupName = group;
    this.dm = PULSE.CLIENT.getDataManager();
    this.tournamentGroup = window.WidgetController.getTournamentByName( group );

    this.tournamentGroupUrlGenerator = PULSE.CLIENT.CRICKET.getUrlGenerator( {
        tournamentGroup : this.groupName
    } );
}

PULSE.CLIENT.CRICKET.TournamentGroupStats.prototype.getName = function()
{
    return this.groupName;
}

PULSE.CLIENT.CRICKET.TournamentGroupStats.prototype.getMostRunsData = function( abridged, start )
{
    this.getStat( abridged, start, 'mostRuns' );
}

PULSE.CLIENT.CRICKET.TournamentGroupStats.prototype.getBestBattingStrikeRateData = function( abridged, start )
{
    this.getStat( abridged, start, 'bestBattingStrikeRate' );
}

PULSE.CLIENT.CRICKET.TournamentGroupStats.prototype.getHighestScoresData = function( abridged, start )
{
    this.getStat( abridged, start, 'highestScoresInnings' );
}

PULSE.CLIENT.CRICKET.TournamentGroupStats.prototype.getBattingAverageData = function( abridged, start )
{
    this.getStat( abridged, start, 'bestBattingAverage' );
}

PULSE.CLIENT.CRICKET.TournamentGroupStats.prototype.getMostCenturiesData = function( abridged, start )
{
    this.getStat( abridged, start, 'mostCenturies' );
}

PULSE.CLIENT.CRICKET.TournamentGroupStats.prototype.getMostFiftiesData = function( abridged, start )
{
    this.getStat( abridged, start, 'mostFifties' );
}

PULSE.CLIENT.CRICKET.TournamentGroupStats.prototype.getMostSixesData = function( abridged, start )
{
    this.getStat( abridged, start, 'mostSixes' );
}

PULSE.CLIENT.CRICKET.TournamentGroupStats.prototype.getMostFoursData = function( abridged, start )
{
    this.getStat( abridged, start, 'mostFours' );
}

PULSE.CLIENT.CRICKET.TournamentGroupStats.prototype.getMostWicketsData = function( abridged, start )
{
    this.getStat( abridged, start, 'mostWickets' );
}

PULSE.CLIENT.CRICKET.TournamentGroupStats.prototype.getBestEconomyData = function( abridged, start )
{
    this.getStat( abridged, start, 'bestBowlingEconomy' );
}

PULSE.CLIENT.CRICKET.TournamentGroupStats.prototype.getBowlingAverageData = function( abridged, start )
{
    this.getStat( abridged, start, 'bestBowlingAverage' );
}

//Best bowling figure - to innings
PULSE.CLIENT.CRICKET.TournamentGroupStats.prototype.getBestBowlingData = function( abridged, start )
{
    this.getStat( abridged, start, 'bestBowlingInnings' );
}

//was best
PULSE.CLIENT.CRICKET.TournamentGroupStats.prototype.getMostFourWicketsData = function( start )
{
    this.getStat( false, start, 'mostFourWickets' );
}

PULSE.CLIENT.CRICKET.TournamentGroupStats.prototype.getMostMaidensData = function( start )
{
    this.getStat( false, start, 'mostMaidens' );
}

PULSE.CLIENT.CRICKET.TournamentGroupStats.prototype.getStat = function( abridged, start, type )
{
    var callback = type;

    if ( type == 'highestScoresInnings' )
    {
        callback = 'highestScores';
    }
    else if ( type == 'bestBowlingEconomy' )
    {
        callback = 'bestEconomy';
    }
    else if ( type == 'mostFourWickets' )
    {
        callback = 'mostWickets';
    }

    if( abridged )
    {
        this.bestStatUrl = this.tournamentGroupUrlGenerator.makeTournamentGroupAbridgedStatsDataUrl( type );
    }
    else
    {
        this.bestStatUrl    = this.tournamentGroupUrlGenerator.makeTournamentGroupFullStatsDataUrl( type );
    }

    this.feedBestStat       = type;
    this.bestStatInterval   = 90;
    this.bestStatsCallback   = 'on' + callback.charAt(0).toUpperCase() + callback.slice(1);

    this.dm.addFeed( this.feedBestStat, this.bestStatUrl,
        this.bestStatInterval, this.bestStatsCallback, [ this ] );

    if( start )
    {
        this.dm.start( this.bestStatUrl );
    }
};

PULSE.CLIENT.CRICKET.TournamentGroupStats.prototype.onData = function( data, id )
{
    var dataId = id;

    if ( data && id )
    {
        if ( id == 'bestBattingStrikeRate' )
        {
            dataId = 'bestStrikeRate';
        }
        else if ( id == 'bestBattingAverage' )
        {
            dataId = 'bestAverage';
            id = 'battingAverage';
        }
        else if ( id == 'bestBowlingAverage' )
        {
            dataId = 'bestAverage';
            id = 'bowlingAverage';
        }
        else if ( id == 'bestBowlingEconomy' )
        {
            dataId = 'bestEconomy';
            id = 'bestEconomy';
        }
        else if ( id == 'bestBowlingInnings' )
        {
            dataId = 'bestBowling';
        }
        else if ( id == 'highestScoresInnings' )
        {
            dataId = 'highestScores';
            id = 'highestScores';
        }
        else if ( id == 'mostFourWickets' )
        {
            dataId = 'mostWickets';
        }

        if( data[ dataId ] && data[ dataId ].length > 0 )
        {
            this.tournamentGroup[ id + 'Data' ] = data[ dataId ][0].topPlayers;
        }
        else
        {
            this.tournamentGroup[ id + 'Data' ] = [];
        }

        PULSE.CLIENT.notify( 'stats/update', {
            tournamentGroup: this.getName(),
            statName: id.charAt(0).toUpperCase() + id.slice(1),
            url: id.replace( 'Innings', '' ),
            success: true
        } );
        PULSE.CLIENT.notify( id + 'Stats/update', {
            tournamentGroup: this.getName(),
            statName: id.charAt(0).toUpperCase() + id.slice(1),
            url: id.replace( 'Innings', '' ),
            success: true
        } );
    }
}

/**
 * Returns an array of stats models
 * @params
 *  statsType - used for calling the model generation function (e.g., getMostRunsData())
 *  statsDataName - used to identify the feed: e.g., mostRuns.js
 *  innings - used to distinguish between innings-scoped feeds and non-innings scoped feeds (e.g., mostSixes.js vs. mostSixesInnings.js)
 *  options - various filters; currently supported: limit (the length of the array) and teamId (filter results by team)
 */
PULSE.CLIENT.CRICKET.TournamentGroupStats.prototype.getModelArrayFor = function( statsType, statsDataName, innings, options )
{
    if( !options )
    {
        options = {};
    }

    var inn = innings ? 'InningsData' : 'Data',
        models = []

    if ( this.tournamentGroup[ statsDataName + inn ] )
    {
        var start = options.start ? Math.min( this.tournamentGroup[ statsDataName + inn ].length, options.start ) : 0;

        var pageSize = options.pageSize || 0;

        var iLimit = options.limit || this.tournamentGroup[ statsDataName + inn ].length;

        if ( options.pageSize )
        {
            iLimit = Math.min( iLimit, options.pageSize + start )
        }

        var add = true,
            count = start,
            i = start;
        while( i < this.tournamentGroup[ statsDataName + inn ].length )
        {
            var stat = this.tournamentGroup[ statsDataName + inn ][i];
            if( !options.teamId || ( options.teamId && stat.team && +options.teamId === stat.team.id ) )
            {
                if ( count < iLimit )
                {
                    if ( add )
                    {
                        var model = this.tournamentGroup[ "get" + statsType + "Model" ]( i, innings );
                        models.push( model );
                    }
                }
                count = count + 1;
            }
            if( models.length === iLimit )
            {
                add = false;
            }
            i++;
        }
    }

    return { statsArray: models, count : count };
};

PULSE.CLIENT.CRICKET.TournamentGroupStats.prototype.getStatSize = function( statsDataName, innings )
{
    var inn = innings ? 'InningsData' : 'Data';
    if ( this.tournamentGroup[ statsDataName + inn ] )
    {
        return this.tournamentGroup[ statsDataName + inn ].length;
    }
    else
    {
        return 0;
    }
}

if ( !PULSE )                   	{ var PULSE = {}; }
if ( !PULSE.CLIENT )            	{ PULSE.CLIENT = {}; }
if ( !PULSE.CLIENT.CRICKET )    	{ PULSE.CLIENT.CRICKET = {}; }

PULSE.CLIENT.CRICKET.TwitterBox = function ( container, tournament, defaultText, characterLimit )
{
	this.$container 	= $( container );
	this.tournament 	= tournament;
	this.characterLimit	= characterLimit || 140;

	// if defaultText exists, it's assumed a feed's not needed to update the box text
	if( !defaultText && this.tournament )
	{
		var defaultText = this.tournament.hashTags || "";
	}

	this.defaultText = defaultText;
	this.update( defaultText );

	this.setListeners();
};

PULSE.CLIENT.CRICKET.TwitterBox.prototype.setListeners = function()
{
	var that = this;
	this.$container.find('textarea').live( 'keyup', function( e ) 
	{
		var total = $(this).val().length;

		that.$container.find( '.characterCount' ).html( that.characterLimit - total );

		if( that.characterLimit - total < 0 )
		{
			that.$container.find( '.characterCount' ).addClass('red');
		}
		else
		{
			that.$container.find( '.characterCount' ).removeClass('red');
		}
    } );

	this.$container.find('a').live( 'click', function( e ) 
	{
		e.preventDefault();
		
		var tweetUser  = that.tournament.tweetUser,
			iplAccount = tweetUser.account,
			iplHashTag = tweetUser.hash;

		var params = { text: that.$container.find('textarea').val() };
		
		PULSE.CLIENT.TwitterController.tweetEvent('tweet', params );
	} );
};

PULSE.CLIENT.CRICKET.TwitterBox.prototype.update = function( defaultText )
{
	if( defaultText )
	{
		this.$container.find( 'textarea' ).val( defaultText );
		this.$container.find( '.characterCount' ).html( this.characterLimit - defaultText.length );
	}
	else
	{
		var existingText = this.$container.find( 'textarea' ).val() || "";
		this.$container.find( '.characterCount' ).html( this.characterLimit - existingText.length );
	}
};

if ( !PULSE )           { var PULSE = {}; }
if ( !PULSE.CLIENT ) 	{ PULSE.CLIENT = {}; }

/**
 *	Works off a twitter feed and displays the tweets for it
 * 	Dependent on the Twitter module (PULSE.CLIENT.Twitter from Twitter.js)
 */
PULSE.CLIENT.TwitterFeed = function ( container, config, active )
{
	config = config || {};

	this.$container = $( container );
	this.config 	= config;
	this.account 	= config.account;
	this.maxTweets 	= config.maxTweets;
	this.interval 	= config.interval;
	this.twitter 	= PULSE.CLIENT.getTwitterInstance();
	this.callback	= config.callback;
	this.trackName  = 'pulse-icc-twitter-list' || config.trackName;
	this.active 	= active;

	this.ids = [];

	this.templates = {
		latestTweets: config.template || "templates/twitter/tweetList.html"
	};

	this.setSubscriptions();

	if( this.active )
	{
		this.getData();
	}
};

PULSE.CLIENT.TwitterFeed.prototype.setSubscriptions = function()
{
	var that = this;
	$('body').on( 'twitter/list', function( e, params ) {
		// check if the received notification's for the right account
		if( params.name === that.account )
		{
			if( params.success )
			{
				if( that.active )
				{
					// only update active elements
					that.update();
				}
	       	}
	       	else
	       	{
	       		// do something when no data's retrieved
	       	}
	    }
    } );
};

PULSE.CLIENT.TwitterFeed.prototype.getData = function( start )
{
	this.twitter.getList( this.account, { 
		fileName: 	this.config.fileName, 
		start: 		this.config.start || start, 
		interval: 	this.config.interval, 
		targets: 	this.config.targets 
	} );
};

PULSE.CLIENT.TwitterFeed.prototype.update = function()
{
	var that 	= this,
		model 	= this.twitter.getTweetsListModel( this.account, this.maxTweets );

	if( window.twttr && twttr.impressions && _.isFunction( twttr.impressions.logTweets ) )
	{
		var tweetIds = $.map( model.tweets, function( tweet )
		{
			return tweet.id;
		} );
		var newTweets = _.difference( tweetIds, this.ids );
		this.ids = this.ids.concat( newTweets );

		twttr.impressions.logTweets( newTweets, this.trackName );
	}

	PULSE.CLIENT.Template.publish(
		this.templates.latestTweets,
		this.$container.find('#tweets'),
		model,
		function() {
			if( that.callback )
			{
				that.callback();
			}
			if( that.timeRefresh )
			{
				that.stopRefresh();
			}
		}
	);

	this.timeRefresh = setInterval( function() {
		var model = that.twitter.getTweetsListModel( that.account, that.maxTweets );
		for( var i = 0, iLimit = model.tweets.length; i < iLimit; i++ )
		{
			var tweet = model.tweets[i],
				timeString = tweet.timestamp,
				$container = that.$container.find( '.time' ).eq( i );

			$container
			.empty()
			.append( $('<i>').text('bird') )
			.append( tweet.timestamp );
		}
	}, 60000 );
};

PULSE.CLIENT.TwitterFeed.prototype.stopRefresh = function()
{
	clearInterval( this.timeRefresh );
};

PULSE.CLIENT.TwitterFeed.prototype.activate = function()
{
	this.active = true;
	this.getData( true );
	this.$container.show();
};

PULSE.CLIENT.TwitterFeed.prototype.deactivate = function()
{
	this.active = false;
	this.stopRefresh();
	this.$container.hide();
};
if (!PULSE)
{
	var PULSE = {};
}
if (!PULSE.CLIENT)
{
	PULSE.CLIENT = {};
}
if (!PULSE.CLIENT.CRICKET)
{
	PULSE.CLIENT.CRICKET = {};
}

PULSE.CLIENT.CRICKET.WidgetController = function()
{
	var that = this;

    // Singleton access
    if( PULSE.CLIENT.CRICKET.WidgetController.prototype._singletonInstance )
    {
        return PULSE.CLIENT.CRICKET.WidgetController.prototype._singletonInstance;
    }
    PULSE.CLIENT.CRICKET.WidgetController.prototype._singletonInstance = this;

	// Get tournament specifics, like data feeds, naming conventions etc.
	this.metadata = PULSE.CLIENT.CRICKET.Metadata;
	this.urlGenerator = PULSE.CLIENT.CRICKET.getUrlGenerator();
	this.tournaments = {};
};

PULSE.CLIENT.CRICKET.WidgetController.prototype.init = function()
{
	var that = this;

	// Create all tournaments supported
	for ( var i = 0, iLimit = this.metadata.length; i < iLimit; i++ )
	{
		var metadata = this.metadata[i];
		this.tournaments[metadata.tournamentName] = new PULSE.CLIENT.CRICKET.Tournament(metadata);
	}

	window.tournaments = this.tournaments;

	/**
	 * scan the page for all widgets and initialise each with a given container,
	 * configuration specifics, whilst also passing the required tournament
	 */
	this.$widgets = $('[data-widget-type]');
	this.widgets = [];

	this.$widgets.each(function()
	{

		try
		{
			var config = {};
			$.each( this.attributes, function( i, attr )
			{
				var name = attr.name;
				var value = attr.value;

				config[ name ] = value;
			} );

            if( config[ 'data-season' ] )
            {
                var tournamentNames = config[ 'data-season' ].split( ',' );
                tournamentNames = $.map( tournamentNames, function( name )
                {
                    return $.trim( name );
                } );

                if( tournamentNames.length > 1 )
                {
                    var tournaments = [];
                    for( var i = 0, iLimit = tournamentNames.length; i < iLimit; i++ )
                    {
                        var name = tournamentNames[ i ];
                        if( name )
                        {
                           tournaments.push( that.getTournamentByName( name ) );
                        }
                    }

                    that.initialiseWidget( this, config, tournaments );
                }
                else
                {
                    var tournament = that.getTournamentByName( config[ 'data-season' ] );
                    that.initialiseWidget( this, config, tournament );
                }
            }
            else
            {
                that.initialiseWidget( this, config );
            }
		}
		catch (err)
		{
			// if any widget fails
		}
	});

	/**
	 * since there is only one instance of the data manager on the page,
	 * any tournament can be used to start the data feeds
	 */
	if (this.metadata.length)
	{
		this.tournaments[this.metadata[0].tournamentName].dm.startAll();
	}
};

/**
 * Return a tournament object with the given name
 *     - Return the existing if possible otherwise create a new one
 * @param  {String} tournamentName Tournament name string
 * @return {Object}                Tournament object
 */
PULSE.CLIENT.CRICKET.WidgetController.prototype.getTournamentByName = function( tournamentName )
{
    if( tournamentName && !this.tournaments[ tournamentName ] )
    {
        var url_defaults = PULSE.CLIENT.CRICKET.DEFAULT_URL_CONFIG,
            metadata_overrides = this.metadata[ tournamentName ],
            meta = $.extend( $.extend( true, { tournamentName: tournamentName }, url_defaults ), metadata_overrides );

        this.tournaments[ tournamentName ] = new PULSE.CLIENT.CRICKET.Tournament( meta );
    }

    return this.tournaments[ tournamentName ];
};

PULSE.CLIENT.CRICKET.WidgetController.prototype.currentTournament = function()
{
	if (this.metadata.length)
	{
		return this.tournaments[this.metadata[0].tournamentName];
	}
};

/**
 * Clear reference to all widgets on the page and reinitialise each
 *   - Created for switching mc matches without reloading the page
 */
PULSE.CLIENT.CRICKET.WidgetController.prototype.cleanWidgets = function()
{
    this.$widgets.off( 'click' ).off( 'click', '**' ); // Remove all listeners and delegated listeners
    this.widgets.empty(); // Empty the array of widgets
};

/**
 * Cleans and reinitialises all widgets
 */
PULSE.CLIENT.CRICKET.WidgetController.prototype.resetWidgets = function()
{
    this.cleanWidgets();
    this.init();
};

PULSE.CLIENT.CRICKET.WidgetController.prototype.initialiseWidget = function(container, config,
	tournament)
{
	var type = config['data-widget-type'];

	switch (type)
	{
		case 'alltimeteamstatcards_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.AllTimeTeamStatCards(container, config, tournament));
			break;

		case 'alltimeteamstatcardspreview_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.AllTimeTeamStatCards(container, config, tournament));
			break;

		case 'archiveheader_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.ArchiveHeader(container, config, tournament));
			break;

		case 'archiveresults_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.CWCMatchSchedule(container, config, tournament));
			break;

		case 'archivescorecard_widget':
		case 'archivescorecard_worldt20_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.ArchiveScoreCard(container, config, tournament));
			break;

		case 'compareplayers_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.ComparePlayers(container, config, tournament));
			break;

		case 'compareplayerscwc_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.ComparePlayersCWC(container, config, tournament));
			break;

		case 'dualtwitterfeed_widget':
		case 'dualtwitterfeed_facebook_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.DualTwitterFeed(container, config, tournament));
			break;

		case 'tournamentcountdown_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.TournamentCountdown(container, config, tournament));
			break;

		case 'globalmatches_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.GlobalMatches(container, config));
			break;

		case 'leadersbatting_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.BattingLeaders(container, config, tournament));
			break;

		case 'leadersbowling_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.BowlingLeaders(container, config, tournament));
			break;

        case 'leadersindex_widget':
            this.widgets.push(new PULSE.CLIENT.CRICKET.LeadersIndex(container, config, tournament));
            break;

		case 'leadersteam_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.TeamLeaders(container, config, tournament));
			break;

        case 'leaderstoggle_widget':
            this.widgets.push(new PULSE.CLIENT.CRICKET.LeadersToggle(container, config, tournament));
            break;

		case 'leadersruns_widget':
		case 'leaderswickets_widget':
		case 'leadersstrikerate_widget':
		case 'leaderseconomy_widget':
		case 'leaderhighestscore_widget':
			this.widgets.push( new PULSE.CLIENT.CRICKET.LeadersColumn( container, config, tournament ) );
			break;

		case 'leadersruns_wt20_widget':
		case 'leaderswickets_wt20_widget':
		case 'leadersstrikerate_wt20_widget':
		case 'leaderseconomy_wt20_widget':
		case 'leaderhighestscore_wt20_widget':
			this.widgets.push( new PULSE.CLIENT.CRICKET.LeadersColumnWT20( container, config, tournament ) );
			break;

		case 'leadersplayerrankings_menst20batting_widget':
		case 'leadersplayerrankings_menst20bowling_widget':
		case 'leadersplayerrankings_mensodibatting_widget':
		case 'leadersplayerrankings_mensodibowling_widget':
		case 'leadersplayerrankings_menstestbatting_widget':
		case 'leadersplayerrankings_menstestbowling_widget':
		case 'leadersplayerrankings_womenst20batting_widget':
		case 'leadersplayerrankings_womenst20bowling_widget':
		case 'leadersplayerrankings_womensodibatting_widget':
		case 'leadersplayerrankings_womensodibowling_widget':
			this.widgets.push( new PULSE.CLIENT.CRICKET.LeadersPlayerRankings( container, config ) );
			break;

		case 'livematches_widget':
			this.widgets.push( new PULSE.CLIENT.CRICKET.LiveMatches( container, config ) );
			break;

        case 'mc_widget':
        case 'mc_cwc_widget':
        case 'mc_worldt20_widget':
            this.widgets.push(new PULSE.CLIENT.CRICKET.MC.Main(container, config, tournament));
            break;

		case 'mc_corporate_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.CorporateMatchCentre(container, config, tournament));
			break;

		case 'mc_event_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.EventMatchCentre(container, config, tournament));
			break;

        case 'matchesbydateschedule_worldt20_widget':
        case 'matchesbydateresults_worldt20_widget':
            this.widgets.push( new PULSE.CLIENT.CRICKET.MatchesByDate( container, config, tournament ) );
            break;

		case 'matchhero_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.MatchHero(container, config, tournament));
			break;

        case 'matchhero_cwc_widget':
        case 'matchhero_worldt20_widget':
            this.widgets.push(new PULSE.CLIENT.CRICKET.MatchHero.Main(container, config, tournament));
            break;

        case 'matchhero_multiple_worldt20_widget':
            this.widgets.push(new PULSE.CLIENT.CRICKET.MatchHero.Multiple(container, config, tournament));
            break;

		case 'matchresults_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.MatchResults(container, config, tournament));
			break;

		case 'matchschedule_widget':
		case 'matchschedule_corporate_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.MatchSchedule(container, config, tournament));
			break;

		case 'matchschedule_cwc_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.CWCMatchSchedule(container, config, tournament));
			break;

		case 'matchresults_cwc_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.CWCMatchSchedule(container, config, tournament));
			break;

		case 'matchschedulewarmup_cwc_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.CWCMatchScheduleWarmUp(container, config, tournament));
			break;

        case 'matchschedule_cwcq_widget':
            this.widgets.push(new PULSE.CLIENT.CRICKET.CWCQMatchSchedule(container, config, tournament));
            break;

		case 'metaschedule_widget':
		case 'metaresults_widget':
		case 'metaschedule_wtc_widget':
		case 'metaresults_wtc_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.MetaScheduleController(container, config));
			break;

		case 'matchscroller_wt20_widget':
			this.widgets.push( new PULSE.CLIENT.CRICKET.MatchScroller( container, config, tournament ) );
			break;

		case 'minirankings_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.MiniRankings(container, config));
			break;

		case 'ministats_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.MiniStats(container, config, tournament));
			break;

		case 'myteam_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.MyTeam(container, config, tournament));
			break;

        case 'nextfixture_worldt20_widget':
		case 'lastresult_worldt20_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.SingleMatch(container, config, tournament));
			break;

		case 'playerstats_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.PlayerStats(container, config, tournament));
			break;

		case 'playerstatscard_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.PlayerStatsCard(container, config, tournament));
			break;

		case 'playerstatstable_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.PlayerStatsTable(container, config, tournament));
			break;

		case 'playerrankings_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.PlayerRankings.Main(container, config));
			break;

		case 'playerrankingsbar_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.PlayerRankingsBar(container, config));
			break;

		case 'poll_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.Poll(container, config, tournament));
			break;

		case 'rankingsabridged_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.RankingsAbridged(container, config, tournament));
			break;

		case 'rankings_wt20_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.WT20RankingsAbridged(container, config, tournament));
			break;

		case 'rankingspredictor_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.RankingsPredictor(container, config));
			break;

		case 'rankingstable_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.RankingsTable(container, config));
			break;

		case 'recordholders_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.StatCards(container, config, tournament));
			break;

		case 'homepagerecords_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.StatCards(container, config, tournament));
			break;

		case 'socialblock_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.SocialBlock(container, config, tournament));
			break;

		case 'socialblock_cwc_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.CWC.SocialBlock.Main(container, config, tournament));
			break;

		case 'socialblock_wt20_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.WT20.SocialBlock.Main(container, config, tournament));
			break;

		case 'socialhub_cwc_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.CWC.SocialHub.Main(container, config, tournament));
			break;

        case 'socialhubwithteams_worldt20_widget':
            this.widgets.push(new PULSE.CLIENT.CRICKET.SocialHubWithTeams.Main(container, config, tournament));
            break;

		case 'scheduleslider_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.ScheduleSlider(container, config, tournament));
			break;

		case 'scorecard_widget':
			// If you see .Main as a constructor then the widget's being rendered the new full model/view way
			this.widgets.push(new PULSE.CLIENT.CRICKET.ScorecardArchive.Main(container, config, tournament));
			break;

		case 'squadcards_widget':
		case 'squadcardscwc_widget':
		case 'squadcardswt20_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.SquadCards(container, config, tournament));
			break;

		case 'squadcarousel_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.SquadCarousel(container, config, tournament));
			break;

		case 'squadlist_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.SquadList(container, config, tournament));
			break;

        case 'squadslider_widget':
            this.widgets.push( new PULSE.CLIENT.CRICKET.SquadSlider( container, config, tournament ) );
            break;

        case 'squadslider_worldt20_widget':
            this.widgets.push( new PULSE.CLIENT.CRICKET.SquadSlider( container, config, tournament ) );
            break;

		case 'squadtable_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.SquadTable(container, config, tournament));
			break;

        case 'smallsquadtable_widget':
            config.widgetSize = 'small';
            this.widgets.push(new PULSE.CLIENT.CRICKET.SquadTable(container, config, tournament));
            break;

		case 'standingsabridged_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.StandingsAbridged(container, config, tournament));
			break;

        case 'u19_standingsabridged_widget':
            this.widgets.push(new PULSE.CLIENT.CRICKET.StandingsAbridged(container, config, tournament));
            break;

        case 'standingsfull_widget':
		case 'standingsfull_worldt20_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.StandingsFull(container, config, tournament));
			break;

		case 'standingshome_widget':
		case 'standingshometabbed_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.StandingsHome(container, config, tournament));
			break;

		case 'standingshome_wt20_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.StandingsHomeWT20(container, config, tournament));
			break;

		case 'statcards_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.StatCards(container, config, tournament));
			break;

		case 'statcardshome_widget':
		case 'statcardshome-cwc_widget':
		case 'statcardshome-wt20_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.StatCardsHome(container, config, tournament));
			break;

		case 'statshero_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.StatsHero(container, config, tournament));
			break;

		case 'teamfixtureshome_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.TeamFixturesHome(container, config, tournament));
			break;

		case 'teamfixtureshome_worldt20_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.TeamFixturesHome(container, config, tournament));
			break;

		case 'teamtournamentgroupperformance_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.TeamTournamentGroupPerformance(container, config, tournament));
			break;

		case 'topteams_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.TopTeams(container, config, tournament));
			break;

		case 'tournamentcountdown_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.TournamentCountdown(container, config, tournament));
			break;

		case 'tournamentpools_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.TournamentPools(container, config, tournament));
			break;

		case 'tournamentgroups_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.TournamentPools(container, config, tournament));
			break;

		case 'tournamentstandings_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.TournamentPools(container, config, tournament));
			break;

		case 'todaypanel_widget':
			this.widgets.push( new PULSE.CLIENT.CRICKET.TodayPanel( container, config, tournament ) )
			break;

		case 'archivepools_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.TournamentPools(container, config, tournament));
			break;

		case 'tournamentstats_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.TournamentStats(container, config, tournament));
			break;
		case 'tournamentnumbers_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.TournamentNumbers(container, config, tournament));
			break;

		case 'tournamentstats_worldt20_widget':
		case 'alltimestats_worldt20_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.TournamentStats(container, config, tournament));
			break;

		case 'tournamentstats_cwc_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.TournamentStatsCWC(container, config, tournament));
			break;

		case 'tournamenttwitter_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.TournamentTwitter(container, config, tournament));
			break;

		case 'twitterandpollvoting_widget':
		case 'lgiccawards_widget':
		case 'fanschoice360_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.TwitterAndPollVoting(container, config));
			break;

		case 'twitterlist_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.TwitterList(container, config, tournament));
			break;

		case 'twittercount_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.TwitterCounterAndBox(container, config, tournament));
			break;

		case 'twitterbox_widget':
		case 'twitterbox_article_widget':
		case 'twitterbox_video_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.TwitterBoxWidget(container, config, tournament));
			break;

		case 'twitterhero_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.TwitterHero(container, config, tournament));
			break;

		case 'twittermirror_widget':
			this.widgets.push(new PULSE.CLIENT.TwitterMirror(container, config, tournament));
			break;

        case 'twitterslider_widget':
            this.widgets.push(new PULSE.CLIENT.CRICKET.TwitterSlider(container, config, tournament));
            break;


			// mobile widgets
		case 'latest_results_mobile':
			//var options = { widgetType: 'results', maxMatches: 2, matchesType: 'complete', reverseMatches: true };
			this.widgets.push(new PULSE.CLIENT.CRICKET.Mobile.ResultsAbridged(container, config, tournament,
				options));
			break;

		case 'match_summary_mobile':
			this.widgets.push(new PULSE.CLIENT.CRICKET.Mobile.Summary(container, config, tournament));
			break;

		case 'more_mobile':
			this.widgets.push(new PULSE.CLIENT.CRICKET.Mobile.More(container, config, tournament));
			break;


		case 'match_hero_mobile':
			this.widgets.push(new PULSE.CLIENT.CRICKET.NextMatch.Main(container, config, tournament));
			break;

		case 'mobile_metaschedule_widget':
		case 'mobile_metaresults_widget':
			this.widgets.push(new PULSE.CLIENT.CRICKET.MobileMetaScheduleController(container, config));
			break;

		case 'mc_mobile':
			this.widgets.push(new PULSE.CLIENT.CRICKET.Mobile.EventMatchCentre.Main(container, config,
				tournament));
			break;

        case 'mc_corporate_mobile':
            this.widgets.push(new PULSE.CLIENT.CRICKET.Mobile.CorporateMatchCentre.Main(container, config,
                tournament));
            break;

		case 'player_mobile':
			this.widgets.push(new PULSE.CLIENT.CRICKET.Mobile.Player(container, config, tournament, true));
			break;

		case 'playoffs_mobile':
			this.widgets.push(new PULSE.CLIENT.CRICKET.Mobile.Playoffs(container, config, tournament, true));
			break;

		case 'poll_mobile':
			this.widgets.push(new PULSE.CLIENT.CRICKET.Mobile.Poll(container, config, tournament));
			break;

		case 'results_mobile':
			var options = {
				widgetType: 'results',
				matchesType: 'complete',
				reverseMatches: true
			};
			this.widgets.push(new PULSE.CLIENT.CRICKET.Mobile.MatchList(container, config, tournament,
				options));
			break;

		case 'schedule_mobile':
			var options = {
				widgetType: 'schedule',
				matchesType: 'upcoming',
				reverseMatches: false
			};
			this.widgets.push(new PULSE.CLIENT.CRICKET.Mobile.MatchList(container, config, tournament,
				options));
			break;

		case 'schedule_cwc_mobile':
			var options = {
				widgetType: 'schedule',
				matchesType: 'upcoming',
				reverseMatches: false
			};
			this.widgets.push(new PULSE.CLIENT.CRICKET.Mobile.MatchListCwc(container, config, tournament,
				options));
			break;

		case 'scorecard_mobile':
			this.widgets.push(new PULSE.CLIENT.CRICKET.Mobile.Scorecard(container, config, tournament));
			break;

		case 'standings_mobile':
			this.widgets.push(new PULSE.CLIENT.CRICKET.Mobile.Standings(container, config, tournament, true));
			break;


		case 'teamsquad_mobile':
			this.widgets.push(new PULSE.CLIENT.CRICKET.Mobile.TeamSquad(container, config, tournament));
			break;

		case 'teamlist_mobile':
			this.widgets.push(new PULSE.CLIENT.CRICKET.Mobile.TeamList(container, config, tournament));
			break;

        case 'recenttweets_mobile':
            this.widgets.push(new PULSE.CLIENT.CRICKET.Mobile.RecentTweets(container, config, tournament));
            break;

        case 'leaders_mobile':
            this.widgets.push(new PULSE.CLIENT.CRICKET.Mobile.Leaders(container, config, tournament));
            break;

        case 'tournamentstats_mobile':
        	this.widgets.push(new PULSE.CLIENT.CRICKET.Mobile.TournamentStats(container, config, tournament));
        	break;

		default:
			// do nothing
			break;
	}
};

$( function()
{
    if( !window.WidgetController )
    {
        window.WidgetController = new PULSE.CLIENT.CRICKET.WidgetController();
        window.WidgetController.init();
    }
} );
