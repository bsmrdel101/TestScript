document.addEventListener('DOMContentLoaded', () => onLoad());

const onLoad = () => {
  const input = document.querySelector('textarea');
  document.getElementById('run-btn').addEventListener('click', () => runCode(input.value));
};

const runCode = (script) => {
  console.log(script);
};
