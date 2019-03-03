function searchFunction(){
    var input = document.getElementById("searchBar").value;
    var n = input.length;
    var letters = /^[A-Za-z]+$/;
    if(letters.test(input) == true){
    if (n>5 | n==0) 
    {
       alert("Please Enter A Valid Ticker");
    }

}
   else{
       alert("Please Enter A Valid Ticker");
   }
 }
     var input = document.getElementById("searchBar");
     input.addEventListener("keyup", function(event){
         if(event.keyCode == 13){
             event.preventDefault();
             document.getElementById("submit").click();
         }
     })