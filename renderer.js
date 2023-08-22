
const runButton = document.getElementById('runButton');

function runCommand() {
  const inputElement = document.getElementById('input');
  const inputText = inputElement.value;
  window.api.send("command", inputText);
  window.api.receive("response", (data) => {
    appendOutput(`> ${inputText}\n`+data);
  });
  inputElement.value = '';
  console.log(inputText);
}

function appendOutput(text) {
  const outputElement = document.getElementById('output');
  console.log(text);
  outputElement.textContent += text + '\n';
}

inputElement.addEventListener('keydown', (event) => {
  console.log("run command");
  if (event.key === 'Enter') {
    runCommand();
    event.preventDefault();
  } 
});

function run() {
  console.log("Run...");
}

runButton.addEventListener('click', runCommand);
console.log("hola")