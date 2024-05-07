// current timestamp in milliseconds
let ts = Date.now();

let date_ob = new Date(ts);

let day = date_ob.getDate();
let month = date_ob.getMonth() + 1;
let year = date_ob.getFullYear();

// prints date & time in YYYY-MM-DD format
console.log(year + "-" + month + "-" + day);