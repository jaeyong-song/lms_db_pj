document.addEventListener("DOMContentLoaded", () => {
    const libEl = document.querySelector("#library");
    const listEl = document.querySelector("#alllist");
    const outputEl = document.querySelector("#outputlist");
    new Library(libEl, listEl, outputEl);
});

function Library(lib, table, form) {
    this.lib = lib;
    this.table = table;
    this.form = form;
    this.registerEvt(this.lib, this.table);
}

Library.prototype = {
    registerEvt: function(lib, table) {
        lib.addEventListener("click", (evt) => {
            if(evt.target.innerText == "해제") {
                this.remove(evt.target);
            }
        })
        table.addEventListener("click", (evt) => {
            if(evt.target.innerText == "등록") {
                this.add(evt.target);
            }
        })
    },
    add: function(element) {
        this.form.value = this.form.value + element.id + ",";
        let moveEl = element.closest("tr");
        let aimEl = this.lib.querySelector("tbody");
        element.classList.remove('btn-success');
        element.classList.add('btn-danger');
        element.innerText = "해제"
        aimEl.appendChild(moveEl);
    },
    remove: function(element) {
        let valArr = this.form.value.split(/\D/);
        valArr.sort();
        let spaceIdx = valArr.indexOf("");
        if(spaceIdx != -1) {
            valArr.splice(spaceIdx, 1);
        }
        let idx = valArr.indexOf(element.id);
        valArr.splice(idx, 1);
        this.form.value = valArr.join(',');
        let moveEl = element.closest("tr");
        let aimEl = this.table.querySelector("tbody");
        element.classList.remove('btn-danger');
        element.classList.add('btn-success');
        element.innerText = "등록"
        aimEl.appendChild(moveEl);
    }
}