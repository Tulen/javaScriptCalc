$(document).ready(function(){
  var input = '';
  var toEval = '0';
  var numHolder = 0;
  var total = 0;
  var equalCheck = false;
  var deciCount = 0;
  
  function previousInput() {
    return toEval[toEval.length-1];
  } 
 
  function updateScreen(x,y) {
    var shifter;
    $('#screen-top').html("<h2>"+x+"</h2>");
    $('#screen-bottom').html("<h4>"+y+"</h4>");
    shifter = -16.7 + x.toString().length * 16.7;
    $('#screen-top h2').css("padding-left", "-="+shifter+"px");
     if (y == "Digit Limit Met") {
      $('#screen-bottom h4').css("padding-left", "-=70px");
     } 
     else {
      shifter = -8 + y.length * 8;
      $('#screen-bottom h4').css("padding-left", "-="+shifter+"px");
     }
  }
  
  $('.key').on('click',function(){
    input =  ($(this).children().html());
     
    if (equalCheck == true && input != '=') {
      total = 0;
      equalCheck = false;
      
      if (input >= 0 || input == '.') {
        numHolder = 0;
        deciCount = 0;
      }
      
      toEval = numHolder.toString();
      updateScreen(numHolder,toEval);
    }
   // AC // Check
    if (input == 'AC') {
      toEval = '0';
      numHolder = 0;
      deciCount = 0;
      updateScreen(numHolder,toEval);
     
    } 
    // CE // Check
    else if (input == 'CE') {
      // If the previous input was not a number, clear just the last value of toEval
      if (isNaN(previousInput())) { 
         toEval = toEval.split('');
         toEval.pop();
         toEval = toEval.join('');
       } 
      // else it was a number, clear all values numbers and decunaks until the first +,-,* or /.
      else {
         toEval = toEval.split('');
         while (previousInput() >= 0 || previousInput() == '.') {
           toEval.pop();
         }
         toEval = toEval.join('');
         // reset numHolder and deciCount
         numHolder = 0;
         deciCount = 0;
       }
      
     if (toEval == '') {
       toEval = '0';
     }
     updateScreen(0,toEval);
    } 
    
    // Number 
    else if (input > -1 ) { 
      //If top display is zero, it gets replaced by input. Else, input is concatenated to it.
       if (numHolder == 0) {
         numHolder = input;
      } else {
        numHolder = parseFloat(numHolder.toString() + input.toString());
      };
      
      //If the previous input was a decimal, numHolder gets divided by 10
      if (previousInput() == '.') {
        numHolder /= 10;
      }
      
      // If either top or bottom display get to long, output "digit limit met"
      if (numHolder.toString().length > 8 || toEval.length > 21) {
        toEval = '0';
        numHolder = 0;
      updateScreen(numHolder,"Digit Limit Met");
      return;
      }
      
      // If bottom display is '0', it gets replaced by input. Else, input is concatenated to it.
       if (toEval == '0') {
         toEval = input.toString();
      } else {
        toEval += input;
      };
      
      // Update the display to show the new values.
      updateScreen(numHolder,toEval);
    }
    
    // Function //
    else if (input == "*" || 
             input == "/" ||
             input == "+" ||
             input == "-") { 
      // If the previous input is not a number and it is not a decimal, replace it with current input.
      // Else if it is a number, concatenate input to toEval.
      // Else it is a decimal, thus do nothing and return.
       if (isNaN(previousInput()) && previousInput() != ".") { 
         toEval = toEval.split('');
         toEval.pop();
         toEval = toEval.join('');
         toEval += input;
       } else if (previousInput() >= 0) {
          toEval +=input;
       } else {
          return;
       }
      
      //Update display to show new values, reset numHolder and deciCount to 0.
      updateScreen(input,toEval);
      numHolder = 0; // Reset for the next upcoming number value
      deciCount = 0; // To allow for decimals for next number value
    } 
    
    //Decimal //
    else if (input == '.') {
      
      //  If current numHolder doesn't already has a decimal
      if (deciCount < 1) {
        // If the previous input was not a decimal
        if(previousInput() !== input){
            // If the previous input was a number, concatenate just a decimal
            if (previousInput() >= 0) {
              toEval +='.';
            } else { // else concatenate a zero and a decimal
              toEval +='0.';
            }
            
        }
        deciCount++; // set deciCount to 1 to avoid multiple decimals
        updateScreen((numHolder+'.'),toEval);
      }
    } 
    
    
    // Equal //
    else if (input == '=') {
      
      // If current expression has not yet been evalated out
      if (equalCheck !== true) {
        
        // Set total to evalulation of totalEval string
        total = eval(toEval);
        
        // If the total has decimals, cap it at 2.
        if (Number.isInteger(total) === false) {
          total = total.toFixed([2]);
        }
        
        // Set bottom display to show full expression and total.
        toEval = toEval + "=" + total;
        
        // Digit Limit check on total
        if (total.toString().length > 8) {
        toEval = '0';
        numHolder = 0;
        total = 0;
        updateScreen(numHolder,"Digit Limit Met");
        return;
        }
        
        // Update display to show new values.
        // Set numHolder to total in order to be used for future calculations.
        // Set equalCheck to true to avoid duplicate evaluations.
        // Adjust deciCount based on if total has a decimal or not.
        updateScreen(total,toEval);
        numHolder = total;
        equalCheck = true;
        if (Number.isInteger(total)) {
        deciCount = 0;
        } 
        else {
        deciCount = 1;
        }
      }   
    }
  });
});