document.getElementById('input').select();
document.getElementById('add_batch_time_button').addEventListener('click', add_up_your_times);
document.getElementById('input').addEventListener(
	'keydown',
	function (key_event)
	{
		call_function_on_enter(key_event, add_up_your_times);
	}
);

var input_check = /\d+:\d\d\s*[A|P]M\s-\s\d+:\d\d\s*[A|P]M/gi;
var full_time = /^\d+:\d\d\s*[A|P]M$/i;
var colon_and_minutes = /:\d\d\s*[A|P]M$/i;
var hour_and_colon = /^\d+:/;
var am_pm = /\s*[A|P]M/i;
var pm_only = /\s*PM/i;

var previous_input;
var total_minutes = 0;

var previous_start_time, previous_stop_time;

function add_up_your_times()
{
	var input = document.getElementById('input').value;
	if ( input != previous_input && input != '' )
	{
		total_minutes = 0;
		document.getElementById('total').innerHTML = '';
		previous_input = input;
		var batch_times = input.match(input_check);
		add_batch_times(batch_times);
	}
}

function run_input(input)
{
	if ( input != previous_input )
	{
		total_minutes = 0;
		document.getElementById('total').innerHTML = '';
		previous_input = input;
		var batch_times = input.match(input_check);
		add_batch_times(batch_times);
	}
}

function check_batch_time_input(input)
{
	return ! input.match(input_check);
}

function add_batch_times(batch_times)
{
	for (var counter = 0; counter < batch_times.length; counter++)
	{
		var index_of_dash = batch_times[counter].indexOf('-');
		var new_start_time = batch_times[counter].substring(0, index_of_dash - 1);
		var new_stop_time = batch_times[counter].substring(index_of_dash + 2, batch_times[counter].length);
		display_new_time(new_start_time, new_stop_time);
		add_to_total_time(new_start_time, new_stop_time);
	}
}

function check_start_time(input_time)
{
	if (input_time.match(full_time) && input_time != previous_start_time)
	{
		previous_start_time = input_time;
		document.getElementById('stop_time').select();
	}
}

function check_stop_time(input_time)
{
	if (input_time.match(full_time) && input_time != previous_stop_time)
	{
		previous_stop_time = input_time;
		var new_start_time = document.getElementById('start_time').value;
		var new_stop_time = document.getElementById('stop_time').value;
		add_single_time(new_start_time, new_stop_time);
		clear_time_values();
		document.getElementById('start_time').select();
	}
}

function add_single_time(new_start_time, new_stop_time)
{
	display_new_time(new_start_time, new_stop_time);
	add_to_total_time(new_start_time, new_stop_time);
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

function add_to_total_time(new_start_time, new_stop_time)
{
	total_minutes += (convert_time_to_minutes(new_stop_time)
					  - convert_time_to_minutes(new_start_time));
	document.getElementById('total').innerHTML = convert_minutes_to_time(total_minutes);
}

function convert_time_to_minutes(time)
{
	var hours = time.replace(colon_and_minutes, '');
	var minutes = time.replace(hour_and_colon, '');
	minutes = minutes.replace(am_pm, '');
	if (hours != 12 && time.match(pm_only))
	{
		hours = parseInt(hours) + 12;
	}
	return (parseInt(hours) * 60) + (parseInt(minutes));
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

function clear_time_values()
{
	previous_start_time = previous_stop_time = null;
	document.getElementById('start_time').value
		= document.getElementById('stop_time').value
		= '';
}

function display_error(error)
{
	document.getElementById('error').innerHTML = error;
}

function call_function_on_enter(key_event, function_to_call)
{
	if ( key_event.keyCode === 13 )
	{
		key_event.preventDefault();
		function_to_call();
	}
}