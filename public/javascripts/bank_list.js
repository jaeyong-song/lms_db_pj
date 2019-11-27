document.addEventListener("DOMContentLoaded", () => {
    const libEl = document.querySelector("#library");
    const listEl = document.querySelector("#alllist");
    const outputEl = document.querySelector("#outputlist");
    const originEl = document.querySelector("#originlist")
    new Library(libEl, listEl, outputEl, originEl);
});

function Library(lib, table, newform, oldform) {
    this.lib = lib;
    this.table = table;
    this.newform = newform;
    this.oldform = oldform;

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
        let moveEl = element.closest("tr");
        if(moveEl.getAttribute("value") == "not-bank") {
            this.newform.value = this.newform.value + element.id + ",";
            let aimEl = this.lib.querySelector("tbody");
            element.classList.remove('btn-success');
            element.classList.add('btn-danger');
            element.innerText = "해제"
            aimEl.appendChild(moveEl);
        } else {
            this.oldform.value = this.oldform.value + element.id + ",";
            let aimEl = this.lib.querySelector("tbody");
            element.classList.remove('btn-success');
            element.classList.add('btn-danger');
            element.innerText = "해제"
            aimEl.appendChild(moveEl);
        }

    },
    remove: function(element) {
        let decideEl = element.closest("tr");
        let valArr;
        if(decideEl.getAttribute("value") == "not-bank") {
            valArr = this.newform.value.split(/\D/);
            valArr.sort();
            let spaceIdx = valArr.indexOf("");
            if(spaceIdx != -1) {
                valArr.splice(spaceIdx, 1);
            }
            let idx = valArr.indexOf(element.id);
            valArr.splice(idx, 1);
            this.newform.value = valArr.join(',');
            let moveEl = element.closest("tr");
            let aimEl = this.table.querySelector("tbody");
            element.classList.remove('btn-danger');
            element.classList.add('btn-success');
            element.innerText = "등록"
            aimEl.appendChild(moveEl);
        } else {
            valArr = this.oldform.value.split(/\D/);
            valArr.sort();
            let spaceIdx = valArr.indexOf("");
            if(spaceIdx != -1) {
                valArr.splice(spaceIdx, 1);
            }
            let idx = valArr.indexOf(element.id);
            valArr.splice(idx, 1);
            this.oldform.value = valArr.join(',');
            let moveEl = element.closest("tr");
            let aimEl = this.table.querySelector("tbody");
            element.classList.remove('btn-danger');
            element.classList.add('btn-success');
            element.innerText = "등록"
            aimEl.appendChild(moveEl);
        }
        
    }
}