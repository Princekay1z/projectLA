// SPDX-License-Identifier: MIT
pragma solidity 0.8.18; 

contract conditions { 
    
    uint public factor = 3; 

    // require
    function multiplyFactor(uint x) public {
        require(x !=0, "if you multiply by zero the factor will become 0");
        uint result = x * factor;
        factor = result; 
    } 

    
    //revert
    function resetFactor(uint x) public {
        if (x == 0) {
            revert ("you can't reset the factor to zero"); 
        } else { 
            factor = x;
        }
    } 

    //assert
    function divideFactor(uint x) public{
        assert(x !=0);
        factor = factor/x;   
    }

}  
