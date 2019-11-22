function hovered(ele){
    document.getElementById(ele.id).style.width = '300px';
    document.getElementById(ele.id).style.borderColor = 'green';
    document.getElementById(ele.id).style.transition = '0.3s';
}

function removed(ele){
    document.getElementById(ele.id).style.width = '250px';  
    document.getElementById(ele.id).style.borderColor = 'purple';
    document.getElementById(ele.id).style.transition = '0.5s';
}

function check(){
    var x = document.getElementById('second').value
    var y = document.getElementById('fourth').value
    if(x!=y)
    document.getElementById('show').innerHTML = 'The Passwords do not match'
}