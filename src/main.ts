import { basicSetup, EditorView } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { compile } from './scripts/lexer';
import { Interpreter } from './scripts/interpreter';
import './style.css';

const interpreter = new Interpreter();
const input = 'event OnLoad(ctx) {\n  var num1 = 5;\n  var num2 = 10 + num1;\n\n  print num1 + (num2 - 5) * 8;\n  print "Hello World";\n\n  if (num1 > ((2 + 1) * 2)) {\n    print true;\n  } else {\n    print false;\n  }\n}';

const loadPrograms = (): Program[] => {
  const source = editor.state.doc.toString();
  const result = compile(source);
  
  if (result.error || !result.program) {
    console.error(result.error);
    return [];
  }
  
  return [result.program];
};

const editor = new EditorView({
  doc: input,
  extensions: [basicSetup, javascript()],
  parent: document.body
});
const programs: Program[] = loadPrograms();

document.getElementById('app')!.appendChild(editor.dom);
document.getElementById('app')!.insertAdjacentHTML('beforeend', `
  <button id="run-btn" class="run-btn">Run</button>
  |
  <button id="after-roll" class="run-btn">AfterRoll</button>
`);

document.getElementById('run-btn')!.addEventListener('click', () => {
  programs.forEach((program) => {
    interpreter.trigger(program, 'OnLoad');
  });
});
