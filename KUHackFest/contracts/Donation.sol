// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Donation{

   struct Appealers{
      uint id;
      string name;
      string occupation;
      string home;
       uint time;
       bool grant;
       bool reg;
   } 
   mapping (address=>Appealers) public appealers;
   mapping(uint=>address) public getAddress;
   uint public appeals;
   event Appeal (address by,uint id);
   event Donate(address from,address to,uint amount);
    constructor() public{
        appeals=0;
    }
  
    function appeal(string memory _name,string memory _occupation,string memory _home) public
    {
            uint id=appeals+1;
        
        appeals++;
        address adr=msg.sender;
            require(block.timestamp>appealers[adr].time+180 days,"can appeal once in 6 months");
            getAddress[id]=adr;
            appealers[adr].id=id;
            appealers[adr].name=_name;
            appealers[adr].occupation=_occupation;
            appealers[adr].home=_home;
            
           uint t=block.timestamp;
             appealers[adr].grant=false;
             appealers[adr].time=t;
             appealers[adr].reg=true;
         
            assert(appealers[adr].time==t);
            emit Appeal(adr,id);
    }
    function pay(uint id, uint amount)   public
    {
      address adr=getAddress[id];
        require(msg.sender!=adr,"cannot donate to yourself");
        require(appealers[adr].reg==true,"user has not appealed");
        require(appealers[adr].grant==false,"already granted");
  
        appealers[adr].grant=true;
        assert(appealers[adr].grant==true);
        emit Donate(msg.sender,adr,amount);
    }

}