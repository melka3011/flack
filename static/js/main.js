document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#form').onsubmit = function() {
        const name = document.querySelector('#displayname').value;
        localStorage.setItem("displayname", name);
    };
});
