const display = document.getElementById('display');
let current = '';
let lastKey = '';

function updateDisplay(text){
  display.textContent = text || '0';
}

function sanitizeExpression(expr){
  // Prevent leading operators and repeated operators
  return expr.replace(/^([*/+.-])+/, '').replace(/([+\-*/]){2,}/g, '$1');
}

document.querySelectorAll('.btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const val = btn.dataset.value;
    const action = btn.dataset.action;
    if(action === 'clear'){
      current = '';
      updateDisplay(current);
      return;
    }
    if(action === 'back'){
      current = current.slice(0,-1);
      updateDisplay(current);
      return;
    }
    if(action === 'calculate'){
      try{
        const safe = sanitizeExpression(current);
        // Evaluate using Function to avoid eval issues
        const result = Function(`return (${safe})`)();
        current = String(result);
        updateDisplay(current);
      }catch(e){
        updateDisplay('Error');
        current = '';
      }
      return;
    }
    // value button
    if(val){
      // prevent multiple dots in a number
      if(val === '.' ){
        const parts = current.split(/[\+\-\*\/]/);
        if(parts[parts.length-1].includes('.')) return;
      }
      current += val;
      updateDisplay(current);
    }
  });
});

// Keyboard support
window.addEventListener('keydown', (e)=>{
  if((e.key >= '0' && e.key <= '9') || ['+','-','*','/','.'].includes(e.key)){
    document.querySelector(`[data-value="${e.key}"]`)?.click();
  } else if(e.key === 'Enter' || e.key === '='){
    document.querySelector('[data-action="calculate"]').click();
  } else if(e.key === 'Backspace'){
    document.querySelector('[data-action="back"]').click();
  } else if(e.key.toLowerCase() === 'c'){
    document.querySelector('[data-action="clear"]').click();
  }
});
