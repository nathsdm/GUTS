const userAccount = localStorage.getItem('Account')

if(userAccount !== "Admin") {
    window.location.href = '/index.html';
}

var Nathan_card = document.getElementById("Nathan");

Nathan_card.addEventListener('click', function() {
    alert('test')
})

Nathan_card.addEventListener('mouseover', function() {
    document.body.style.cursor = "pointer";
})

Nathan_card.addEventListener('mouseout', function() {
    document.body.style.cursor = "default";
})