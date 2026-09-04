import { basicSetup, EditorView } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { compile } from './scripts/lexer';
import { Interpreter } from './scripts/interpreter';
import './style.css';

const input = 'var num1 = 5;\nvar num2 = 10 + num1;\n\nprint num1 + (num2 - 5) * 8;\nprint "Hello World";\n\nif (num1 > ((2 + 1) * 2)) {\n  print true;\n} else {\n  print false;\n}';

const editor = new EditorView({
  doc: input,
  extensions: [basicSetup, javascript()],
  parent: document.body
});

document.getElementById('app')!.appendChild(editor.dom);
document.getElementById('app')!.insertAdjacentHTML('beforeend', `
  <button id="run-btn" class="run-btn">Run</button>
`);

document.getElementById('run-btn')!.addEventListener('click', () => {
  console.log('===========');
  const source = editor.state.doc.toString();
  const result = compile(source);

  if (result.error || !result.program) {
    console.error(result.error);
    return;
  }

  const interpreter = new Interpreter();
  interpreter.execute(result.program);
});
