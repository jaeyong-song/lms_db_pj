document.addEventListener("DOMContentLoaded", () => {
    parameterTemplating();
})

function parameterTemplating() {
    let iptArea = document.getElementById("question_template");
    let areaHtml = iptArea.innerHTML;
    let parameterTxt = document.getElementById("parameters").innerText;
    let parameterArr = parameterTxt.split(",");
    let bindTemplate = Handlebars.compile(areaHtml);
    iptArea.innerHTML = bindTemplate(parameterArr).replace("{params}", parameterArr[0])
                                                    .replace("{params}", parameterArr[1])
                                                    .replace("{params}", parameterArr[2]
                                                    .replace("{params}", parameterArr[3])
                                                    .replace("{params}", parameterArr[4]));
}