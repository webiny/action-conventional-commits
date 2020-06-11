const got = require("got");

got.get("https://api.github.com/repos/doitadrian/contreebutors-action/pulls/2/commits", {
    responseType: "json",
}).then((response) => {
    console.log(response.body);
});
