// --------------------Globals-------------------- //

var previous_input;
var previous_output;

var COLON_AND_MINUTES = /:\d\d\s*[A|P]M/i;
var HOUR_AND_COLON = /^\d[\d]?:/;
var AM_PM = /[A|P]M/i;
var PM_ONLY = /PM/i;
var AM_ONLY = /AM/i;




// --------------------Initialization-------------------- //

// ----------Event Listeners---------- //
document.getElementById('input').select();
document.getElementById('add_batch_time_button').addEventListener('click', add_up_times);
document.getElementById('input').addEventListener(
	'keydown',
	function (key_event)
	{
		call_function_on_enter(key_event, add_up_times_user_event);
	}
);




// --------------------Functionality-------------------- //

function add_up_times_user_event()
{
	var input = document.getElementById('input').value;
	var total_minutes = add_up_times(input);
	document.getElementById('total').innerHTML
		= convert_minutes_to_time(total_minutes);
}

function add_up_times(input)
{
	if ( input === previous_input || input === '' ) { return previous_output; }
	
	reset_global_state( input );
	
	var full_time_entries = collect_full_time_entries(input);
	var time_entries = split_full_time_entries(full_time_entries);
	var total_minutes = add_time_entries(time_entries);
	previous_output = total_minutes;
	return total_minutes;
}

function reset_global_state(input)
{
	previous_input = input;
	document.getElementById('total').innerHTML = '';
}

function collect_full_time_entries(input)
{
	var full_time_entry_regex = /\d[\d]?:\d\d\s*[A|P]M\s*-\s*\d[\d]?:\d\d\s*[A|P]M/gi;
	return input.match(full_time_entry_regex);
}

function split_full_time_entries(full_time_entries)
{
	var time_entries = new Array();
	for (var counter = 0; counter < full_time_entries.length; counter++)
	{
		var index_of_dash = full_time_entries[counter].indexOf('-');
		var new_start_time
			= full_time_entries[counter]
				.substring(0, index_of_dash)
				.replace(/ /g, '');
		var new_stop_time
			= full_time_entries[counter]
				.substring(index_of_dash + 1, full_time_entries[counter].length)
				.replace(/ /g, '');
		time_entries[ counter ] = [new_start_time, new_stop_time];
	}
	return time_entries;
}

function add_time_entries(time_entries)
{
	var total_minutes = 0;
	for (var i = 0; i < time_entries.length; i++)
	{
		var time_difference = collect_time_entries_difference(
			time_entries[i][0],
			time_entries[i][1]
		);
		total_minutes += time_difference;
	}
	return total_minutes;
}

function collect_time_entries_difference(start_time, stop_time)
{
	var start_minutes = convert_time_to_minutes(start_time);
	var stop_minutes = convert_time_to_minutes(stop_time);
	if ( stop_minutes < start_minutes )
	{
		stop_minutes += 12 * 60;
	}
	var time_difference = stop_minutes - start_minutes;
	return time_difference;
}

function display_new_time(new_start_time, new_stop_time)
{
	var new_time_to_display = new Element('p');
	var text_to_add = new_start_time
			+ ' - '
			+ new_stop_time;
	new_time_to_display.appendText(text_to_add);
	document.getElementById('total').appendChild(new_time_to_display);
}

function convert_time_to_minutes(time)
{
	var hours = parseInt(time.replace(COLON_AND_MINUTES, ''));
	var minutes = parseInt(
		time.replace(HOUR_AND_COLON, '').replace(AM_PM, '')
	);
	var is_am = time.match(AM_ONLY);
	if (hours == 12 && is_am ) { is_am = !is_am; }
	if (is_am) { hours += 12; }
	return (hours * 60) + minutes;
}

function convert_minutes_to_time(minutes_to_convert)
{
	var hours = Math.floor(minutes_to_convert / 60);
	var minutes = (minutes_to_convert % 60);
	var time = '';
	if (hours == 1)
	{
		if (minutes == 1)
		{
			time = '1 hour - 1 minute';
		} else
		{
			time = '1 hour - ' + minutes + ' minutes';
		}
	}
	else
	{
		time = hours + ' hours - ' + minutes + ' minutes';
	}
	return time;
}

function call_function_on_enter(key_event, function_to_call)
{
	if ( key_event.altKey || key_event.ctrlKey || key_event.metaKey ) { return; }
	if ( key_event.shiftKey ) { return; }
	
	if ( key_event.keyCode === 13 )
	{
		key_event.preventDefault();
		function_to_call();
	}
}


var test_results = '';
var test_input = [
	'12:00 am - 1:00 am',
	'1:00 am - 2:00 am',
	'2:00 am - 3:00 am',
	'3:00 am - 4:00 am',
	'4:00 am - 5:00 am',
	'5:00 am - 6:00 am',
	'6:00 am - 7:00 am',
	'7:00 am - 8:00 am',
	'8:00 am - 9:00 am',
	'9:00 am - 10:00 am',
	'10:00 am - 11:00 am',
	'11:00 am - 12:00 pm',
	'12:00 pm - 1:00 pm',
	'1:00 pm - 2:00 pm',
	'2:00 pm - 3:00 pm',
	'3:00 pm - 4:00 pm',
	'4:00 pm - 5:00 pm',
	'5:00 pm - 6:00 pm',
	'6:00 pm - 7:00 pm',
	'7:00 pm - 8:00 pm',
	'8:00 pm - 9:00 pm',
	'9:00 pm - 10:00 pm',
	'10:00 pm - 11:00 pm',
	'11:00 pm - 12:00 am'
];
var test_expected_output = '1 hour - 0 minutes';

function run_test_suite()
{
	for (var i = 0; i < test_input.length; i++) {
		console.log(test_input[i], convert_minutes_to_time(add_up_times(test_input[i])));
	}
}

if ( window.location.hash.match(/test/) ) { run_test_suite(); }