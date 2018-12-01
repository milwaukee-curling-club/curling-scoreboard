(function() {
    const minusButtons = document.getElementsByClassName('button-minus');

    for(var i=0; i < minusButtons.length; i++) {
        minusButtons[i].onclick = function(e) {
            e.target.parentElement.querySelectorAll('input[type=number]')[0].value -= 1;
        }
    }


    const plusButtons = document.getElementsByClassName('button-plus');

    for(var i=0; i < plusButtons.length; i++) {
        plusButtons[i].onclick = function(e) {
            numberField = e.target.parentElement.querySelectorAll('input[type=number]')[0]
            value = parseInt(numberField.value)
            numberField.value = value + 1;
        }
    }
})();
