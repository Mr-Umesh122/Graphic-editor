const canvas = new fabric.Canvas("canvas", {
    width: 600,
    height: 300,
    backgroundColor: "#ffffff"
});
const addTextBtn = document.getElementById("addTextBtn");

addTextBtn.addEventListener("click", () => {

    const text = new fabric.IText("Your Text", {
        left: 100,
        top: 100,

        fontSize: 50,
        fill: "#000000",

        fontFamily: "Arial"
    });

    canvas.add(text);

    canvas.setActiveObject(text);

    canvas.renderAll();
});
const addRectBtn = document.getElementById("addRectBtn");

addRectBtn.addEventListener("click", () => {

    const rect = new fabric.Rect({
        left: 150,
        top: 200,

        width: 250,
        height: 150,

        fill: "#ff3b30"
    });

    canvas.add(rect);

    canvas.setActiveObject(rect);

    canvas.renderAll();
});
const imageInput = document.getElementById("imageInput");

imageInput.addEventListener("change", function(event) {

    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(e) {

        fabric.Image.fromURL(e.target.result).then((img) => {

            img.scaleToWidth(300);

            img.set({
                left: 100,
                top: 100
            });

            canvas.add(img);

            canvas.setActiveObject(img);

            canvas.renderAll();

        });

    };

    reader.readAsDataURL(file);
});
const noSelection = document.querySelector(".no-selection");
const objectProperties = document.getElementById("objectProperties");

const textInput = document.getElementById("textInput");
const fontSizeInput = document.getElementById("fontSizeInput");
const colorInput = document.getElementById("colorInput");
const opacityInput = document.getElementById("opacityInput");
const xInput = document.getElementById("xInput");
const yInput = document.getElementById("yInput");
const rotationInput = document.getElementById("rotationInput");

const deleteBtn = document.getElementById("deleteBtn");
canvas.on("selection:created", updateProperties);
canvas.on("selection:updated", updateProperties);
canvas.on("selection:cleared", clearProperties);

function updateProperties() {

    const object = canvas.getActiveObject();

    if (!object) return;

    noSelection.hidden = true;
    objectProperties.hidden = false;

    textInput.value = object.text || "";

    fontSizeInput.value = object.fontSize || 0;

    colorInput.value = object.fill || "#000000";

    opacityInput.value = object.opacity ?? 1;

    xInput.value = Math.round(object.left || 0);

    yInput.value = Math.round(object.top || 0);

    rotationInput.value = Math.round(object.angle || 0);
}

function clearProperties() {

    noSelection.hidden = false;
    objectProperties.hidden = true;
}
textInput.addEventListener("input", () => {

    const object = canvas.getActiveObject();

    if (!object || !object.text) return;

    object.set("text", textInput.value);

    canvas.renderAll();
});
fontSizeInput.addEventListener("input", () => {

    const object = canvas.getActiveObject();

    if (!object) return;

    object.set(
        "fontSize",
        Number(fontSizeInput.value)
    );

    canvas.renderAll();
});
colorInput.addEventListener("input", () => {

    const object = canvas.getActiveObject();

    if (!object) return;

    object.set(
        "fill",
        colorInput.value
    );

    canvas.renderAll();
});
opacityInput.addEventListener("input", () => {

    const object = canvas.getActiveObject();

    if (!object) return;

    object.set(
        "opacity",
        Number(opacityInput.value)
    );

    canvas.renderAll();
});
xInput.addEventListener("input", () => {

    const object = canvas.getActiveObject();

    if (!object) return;

    object.set(
        "left",
        Number(xInput.value)
    );

    canvas.renderAll();
});
yInput.addEventListener("input", () => {

    const object = canvas.getActiveObject();

    if (!object) return;

    object.set(
        "top",
        Number(yInput.value)
    );

    canvas.renderAll();
});
rotationInput.addEventListener("input", () => {

    const object = canvas.getActiveObject();

    if (!object) return;

    object.set(
        "angle",
        Number(rotationInput.value)
    );

    canvas.renderAll();
});
deleteBtn.addEventListener("click", () => {

    const object = canvas.getActiveObject();

    if (!object) return;

    canvas.remove(object);

    canvas.discardActiveObject();

    canvas.renderAll();

    clearProperties();
});
const layersList = document.getElementById("layersList");

function getObjectName(object) {

    if (object.type === "i-text" || object.type === "text") {
        return object.text || "Text";
    }

    if (object.type === "image") {
        return "Image";
    }

    if (object.type === "rect") {
        return "Rectangle";
    }

    if (object.type === "circle") {
        return "Circle";
    }

    return "Object";
}
function renderLayers() {

    layersList.innerHTML = "";

    const objects = canvas.getObjects();

    // Top layer first
    [...objects].reverse().forEach((object, index) => {

        const layer = document.createElement("div");

        layer.className = "layer-item";

        if (object === canvas.getActiveObject()) {
            layer.classList.add("active");
        }

        const name = document.createElement("span");

        name.className = "layer-name";

        name.textContent = getObjectName(object);


        const buttons = document.createElement("div");

        buttons.className = "layer-buttons";


        const upButton = document.createElement("button");

        upButton.textContent = "↑";

        upButton.addEventListener("click", (event) => {

            event.stopPropagation();

            canvas.bringObjectForward(object);

            canvas.renderAll();

            renderLayers();
        });


        const downButton = document.createElement("button");

        downButton.textContent = "↓";

        downButton.addEventListener("click", (event) => {

            event.stopPropagation();

            canvas.sendObjectBackwards(object);

            canvas.renderAll();

            renderLayers();
        });


        buttons.appendChild(upButton);
        buttons.appendChild(downButton);

        layer.appendChild(name);
        layer.appendChild(buttons);


        layer.addEventListener("click", () => {

            canvas.setActiveObject(object);

            canvas.renderAll();

            updateProperties();

            renderLayers();
        });


        layersList.appendChild(layer);

    });
}
canvas.on("object:added", () => {
    renderLayers();
});
canvas.on("object:removed", () => {
    renderLayers();
});
canvas.on("selection:created", () => {
    updateProperties();
    renderLayers();
});

canvas.on("selection:updated", () => {
    updateProperties();
    renderLayers();
});

canvas.on("selection:cleared", () => {
    clearProperties();
    renderLayers();
});