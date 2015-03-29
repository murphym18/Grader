
function Identity(name, domain) {
   this.name = name;
   this.domain = domain;
}

function Subject() {
   this.authenticatedIdentities = [];
}

function User(first, last) {
   this.first = first;
   this.last = last;
}