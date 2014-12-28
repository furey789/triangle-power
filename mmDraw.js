/* 
Author: PRF
mm-yr: 12-2014
Description: Drawing functions
*/

var mm = mm || {};   // mm for my module

mm.draw = (function(){
    
    function drawLine(canvasName,endpts,arrowhead,arrowtail,clrName,lwidth){
   
        var id =document.getElementById(canvasName); // canvas element
        var ctx =id.getContext("2d");
        
        ctx.strokeStyle=getColor(clrName);
        ctx.lineWidth=lwidth;
        ctx.beginPath();
        ctx.moveTo(endpts[0][0],endpts[0][1]);
        ctx.lineTo(endpts[1][0],endpts[1][1]);
        ctx.stroke();
        if (arrowhead.length>1){
            ctx.moveTo(endpts[1][0],endpts[1][1]);
            ctx.lineTo(arrowhead[0][0],arrowhead[0][1]);
            ctx.stroke();
            ctx.moveTo(endpts[1][0],endpts[1][1]);
            ctx.lineTo(arrowhead[1][0],arrowhead[1][1]);
            ctx.stroke(); 
        }
        if (arrowtail.length>1){
            ctx.moveTo(endpts[0][0],endpts[0][1]);
            ctx.lineTo(arrowtail[0][0],arrowtail[0][1]);
            ctx.stroke();
            ctx.moveTo(endpts[0][0],endpts[0][1]);
            ctx.lineTo(arrowtail[1][0],arrowtail[1][1]);
            ctx.stroke(); 
        }
        
    }
    
    function drawPolygon(canvasName,v,clrName,lwidth){

        var id =document.getElementById(canvasName); // canvas element
        var ctx =id.getContext("2d");
        ctx.strokeStyle = getColor(clrName);
        ctx.lineWidth=lwidth;  //0.5
        ctx.beginPath();
        var j;
        // Note: j-1 since indices start at 0
        for (j=0;j<v.length-1;j++){
            ctx.moveTo(v[j][0],v[j][1]);
            ctx.lineTo(v[j+1][0],v[j+1][1]);
            ctx.stroke();
        }
        // Note: out of loop, j = v.length
        ctx.moveTo(v[j][0],v[j][1]);
        ctx.lineTo(v[0][0],v[0][1]);
        ctx.stroke();  // closes the polygon
        
    };
    
    function drawNestedTriangles(canvasName,v0,v1,v2,v3,clrName1,clrName2,clrName3){
        
        // triangles nested within a larger triangle
        var i;
        var v;
        for (i=0; i<v1.length; i++) {
            v = v1[i];
            drawPolygon(canvasName,v,clrName1,0.5);
        };
        for (i=0; i<v2.length; i++) {
            v = v2[i];  
            drawPolygon(canvasName,v,clrName2,0.5);
        };
        for (i=0; i<v3.length; i++) {
            v = v3[i];  
            drawPolygon(canvasName,v,clrName3,0.5);
        };
        drawPolygon(canvasName,v0,clrName3,3);

    }

    function drawCircle(canvasName,x,y,radius,clrName,lwidth){
        
        var id =document.getElementById(canvasName); // canvas element
        var ctx =id.getContext("2d");
        ctx.lineWidth = lwidth;
        ctx.strokeStyle=getColor(clrName);
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        ctx.stroke();

    }
    
    function getColor(clrName){
        
        switch (clrName) {
            case "red":
                clrID="#FF0000";
                break;
            case "green":
                clrID="#00FF00";
                break;
            case "blue":
                clrID="#0000FF";
                break;
            case "orange":
                clrID="#FFA500";
                break;
            case "brown":
                clrID="#A52A2A";
                break;
            case "grey":
                clrID="#D3D3D3";
                break;
            case "white":
                clrID="#FFFFFF";
                break;
            default:  // black
                clrID="#000000";
        }
        
        return clrID;
 
    }
    
    return{
        
        line : drawLine,
        polygon : drawPolygon,
        nestedtriangles : drawNestedTriangles,
        circle : drawCircle
        
    };
    
 
}());

