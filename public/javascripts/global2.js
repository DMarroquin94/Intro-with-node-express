$(document).ready(function() {

	populateTable();

	$("#customerlist table tbody").on('click', 'td a.linkdeleteuser', deleteUser)
	$("#customerlist table tbody").on('click', 'td a.linkedituser', editUser)
});

var populateTable = function() {
	var tableContent = '';

	 $.getJSON( '/customerlist', function( data ) {
	 	
	 	for (var i = 0; i < data.length; i++) {
	 	
	 		tableContent += '<tr>';
	 		//tableContent += '<td><img src='+data[i].pic+' height="50" width="42"></td>';
            tableContent += '<td>'+data[i].username+'</td>';
            tableContent += '<td>' + data[i].email + '</td>';
            tableContent += '<td>' + data[i].phone + '</td>';
            tableContent += '</tr>';
   	 	}
	 	
	 	$('#customerlist table tbody').html(tableContent);
	});	
};

var deleteUser = function(event) {
	event.preventDefault();

	var confirmation = confirm('Are you sure you want to delete this customer?');

	if (confirmation === true) {
		  $.ajax({
            type: 'DELETE',
            url: '/deleteuser/' + $(this).attr('rel')
        }).done(function( response ) {
            // Check for a successful (blank) response
            if (response.msg === '') {
         	
            }
            else {
        		alert("err")
            }
            // Update the table
            populateTable();
        });
	}
	 else {
		return false;
	}
}

var editUser = function(event) {
	event.preventDefault();
	var confirmation = confirm("Are you sure you want to edit this customer?");
	if (confirmation === true) {
		location.replace('/edituser/' + $(this).attr('rel'))
	} else {
		return false;
	}
} 