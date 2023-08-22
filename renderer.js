
const runButton = document.getElementById('runButton');
const outputElement = document.getElementById('output');

function runCommand() {
  const inputElement = document.getElementById('input');
  const checkbox = document.getElementById('checkbox');
  const inputText = inputElement.value;
  window.api.send("command", inputText, checkbox.checked);

  window.api.receive("response", (data) => {
    appendOutput(inputText, data);
  });
  inputElement.value = '';
}

function appendOutput(text, data) {
  outputElement.textContent = `$ ${text}\n${data}\n`;
}

inputElement.addEventListener('keydown', (event) => {
  console.log("run command");
  if (event.key === 'Enter') {
    runCommand();
    event.preventDefault();
  } 
});

runButton.addEventListener('click', runCommand);