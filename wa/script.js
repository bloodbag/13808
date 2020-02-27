let textArea = document.getElementById("text");
let wcSpan = document.getElementById("wordCount");
let lcSpan = document.getElementById("lineCount");

textArea.oninput = () => onInput();

let onInput = () => {
    let totalWords = 0;

    let wordArrWordCount = textArea.value.split("\n").filter(el => el != "");

    console.log(wordArrWordCount);

    let wordArrNewline = textArea.value.split("\n").filter(el => el != "");

    wcSpan.innerHTML = `${totalWords} word${totalWords != 1 ? "s" : ""}`;
    lcSpan.innerHTML = `${wordArrNewline.length} line${wordArrNewline.length != 1 ? "s" : ""}`;
};
