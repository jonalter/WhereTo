var args = arguments[0] || {},
	tab = args.tab;

var rows = [],
	person;
	
$.tableView.addEventListener('click', function(e) {
	person = e.row.itemData;
	var formatted_address = "",
		addressObj = person.address,
		emailObj = person.email,
		currentAddress,
		currentEmail,
		icon;
	
	// Address
	for (var key in addressObj) {
		if (addressObj[key].length) {
			currentAddress = addressObj[key][0];
			formatted_address += (currentAddress.Street) ? currentAddress.Street+", " : "";
			formatted_address += (currentAddress.City) ? currentAddress.City+" " : ""; 
			formatted_address += (currentAddress.State) ? currentAddress.State+", " : ""; 
			formatted_address += (currentAddress.ZIP) ? currentAddress.ZIP+" " : ""; 
		}
		
		// only using the first address for now 
		break;
	}
	
	// Email
	for (var key in emailObj) {
		if (emailObj[key].length) {
			currentEmail = emailObj[key][0];
			icon = 'http://www.gravatar.com/avatar/'+Ti.Utils.md5HexDigest(currentEmail.trim().toLowerCase()); 
		}	
		// only using the first email for now 
		break;
	}
	icon = icon || "http://www.gravatar.com/avatar/00000000000000000000000000000000?d=wavatar&f=y";
	
	
	tab.open(Alloy.createController('locationDetails', {
		itemData: {
			name: person.firstName + ' ' + person.lastName,
			icon: icon,
			formatted_address: formatted_address
		}
	}).win);
});

var singleValue = [
  'recordId', 'firstName', 'middleName', 'lastName', 'fullName', 'prefix', 'suffix', 
  'nickname', 'firstPhonetic', 'middlePhonetic', 'lastPhonetic', 'organization', 
  'jobTitle', 'department', 'note', 'birthday', 'created', 'modified', 'kind'
];
var multiValue = [
  'email', 'address', 'phone', 'instantMessage', 'relatedNames', 'date', 'url'
];
var people = Ti.Contacts.getAllPeople();
Ti.API.info('Total contacts: ' + people.length);

for (var i=0, ilen=people.length; i<ilen; i++){
  person = people[i];
  rows.push(Ti.UI.createTableViewRow({
  	title: person.firstName + ' ' + person.lastName,
  	itemData: person
  }));
  
  // for (var j=0, jlen=singleValue.length; j<jlen; j++){
    // Ti.API.info(singleValue[j] + ': ' + person[singleValue[j]]);
  // }
  // for (var j=0, jlen=multiValue.length; j<jlen; j++){
    // Ti.API.info(multiValue[j] + ': ' + JSON.stringify(person[multiValue[j]]));
  // }
}

$.tableView.data = rows;


