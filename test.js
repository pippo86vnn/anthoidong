const url = "https://script.google.com/macros/s/AKfycbye3XqTAWTSc-1CfJLODH6Ex78irzFakBfZhW0kUMnGnmlhn5KFnQC8mnUARN17Y0oBfw/exec";
fetch(url + "?action=getAll")
  .then(res => res.text())
  .then(text => console.log(text.substring(0, 100)))
  .catch(err => console.error(err));
