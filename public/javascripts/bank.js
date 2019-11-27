document.addEventListener("DOMContentLoaded", () => {
    const tableEl = document.querySelector("table");
    new Library(tableEl);
});

function Library(element) {
    this.element = element;
    this.registerEvt(this.element);
}

Library.prototype = {
    registerEvt: function(element) {
        element.addEventListener("click", (evt) => {
            if(evt.target.innerText == "등록") {
                console.log(evt.target.id);
                this.add();
            }
        })
    },
    add: function() {

    }
}