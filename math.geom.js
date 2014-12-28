/* 
Author: PRF
mm-yr: 12-2014
Description: Triangle graphics and animation.
*/
 
(function(){

    // constructor function for line object
    function line(x0,y0,angle,length,arrow){
        
        var x1 = x0 + length*Math.cos(angle*Math.PI/180);
        var y1 = y0 + length*Math.sin(angle*Math.PI/180);
        this.endpts = [  // end point coords
            [x0,y0],
            [x1,y1]
        ];
        
        this.angle = angle;  // from horizontal
        this.length = length;
        
        if (arrow===1){
            var x11 = x1 + 10*Math.cos((angle+130)*Math.PI/180);
            var y11 = y1 + 10*Math.sin((angle+130)*Math.PI/180);
            var x12 = x1 + 10*Math.cos((angle-130)*Math.PI/180);
            var y12 = y1 + 10*Math.sin((angle-130)*Math.PI/180);
            this.arrowhead = [
                [x11,y11],
                [x12,y12]
            ];
        } else {
            this.arrowhead = 0;
        }
        
        if (arrow===2){
            var x01 = x0 + 10*Math.cos((angle+50)*Math.PI/180);
            var y01 = y0 + 10*Math.sin((angle+50)*Math.PI/180);
            var x02 = x0 + 10*Math.cos((angle-50)*Math.PI/180);
            var y02 = y0 + 10*Math.sin((angle-50)*Math.PI/180);
            this.arrowtail = [
                [x01,y01],
                [x02,y02]
            ];
        } else {
            this.arrowtail = 0;
        }
    }

    // constructor function for triangle object
    function triangle(x,y,base,baseFrac){

        this.x = x;  // start coord x
        this.y = y;  // start coord y
        this.base = base;  // length of triangle base
        this.height = (this.base/2.0)*Math.tan(60.0*Math.PI/180.0);
        this.xatpeak = this.x + (base*baseFrac);
        this.yatpeak = this.y + this.height;
        if (baseFrac===0){          // left angle off base
            this.angle1 = 90;
        } else {
            this.angle1 = Math.atan(this.height/(base*baseFrac))/(Math.PI/180.0);
        }
        if (baseFrac===1){          // right angle off base
            this.angle2 = 90;
        } else {
            this.angle2 = Math.atan(this.height/(base*(1-baseFrac)))/(Math.PI/180.0);
        }
        this.angle3 = 180 - this.angle1 - this.angle2;  // top angle

        this.v = [
            [this.x,this.y],
            [this.xatpeak,this.yatpeak],
            [this.x+this.base,this.y]
        ];  // length of a is 3!
    }

    // triangles nested within a larger triangle
    function nestedTriangles(v){

        var x0 = v[0][0];   // lower left vertex x
        var y0 = v[0][1];   // lower left vertex y
        var base = v[2][0]-v[0][0];
        var incx = base/10.0;
        var height = v[1][1]-v[0][1];
        var incy = height/10.0;

        var i;
        var v1 = new Array();
        for (i=0; i<10; i++) {
            var b = base-(i*incx);
            var tri = new triangle(v[0][0],v[0][1],b,0.5);
            v1[i]=tri.v;
        };
        var v2 = new Array();
        for (i=0; i<10; i++) {
            var b = base-(i*incx);
            var x = x0 + i*incx;
            var tri = new triangle(x,y0,b,0.5);   
            v2[i]=tri.v;
        };
        var v3 = new Array();
        for (i=0; i<10; i++) {
            var b = base-(i*incx);
            var x = x0 + (i*incx)/2;
            var y = y0 + i*incy;
            var tri = new triangle(x,y,b,0.5);   
            v3[i]=tri.v;
        };

        return [v1,v2,v3];
    }

    // function for presenting coordinates in triangle
    function getTrianglePercents(tri1,canvasName,v1Name,v2Name,v3Name){

        var id =document.getElementById(canvasName); // canvas element

        var rect = id.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = rect.bottom - event.clientY;  // y coords positive downward

        var mB = -1.0 * Math.tan(tri1.angle1*Math.PI/180.0); // B line slope
        var cB = y - (mB*x);  // Intercept for B line through x,y
        var cB0 = tri1.y - (mB*(tri1.x+tri1.base));  // Intercept for B line connecting AC
        var mC = Math.tan(tri1.angle1*Math.PI/180.0);  // C line slope
        var cC = y - (mC*x);  // Intercept for C line through x,y
        var cC0 = tri1.y - (mC*tri1.x);          // Intercept for C line connecting AB

        // Get Apercent
        var Apercent = Math.round((y-tri1.y)/tri1.height*1000)/10;
        // Get Bpercent
        var xC = (cB-cC0)/(mC-mB); // x value on C line connecting AB 
        var xCtoB = (xC-tri1.x)/Math.cos(tri1.angle1*Math.PI/180);
        var Bpercent = Math.round((1-(xCtoB/tri1.base))*1000)/10;
        // Get Cpercent
        var xB = (cC-cB0)/(mB-mC); // x value on B line connecting AC
        var xBtoC = ((tri1.x+tri1.base)-xB)/Math.cos(tri1.angle1*Math.PI/180);
        var Cpercent = Math.round((1-(xBtoC/tri1.base))*1000)/10;


        if (Apercent>0 & Bpercent>0 & Cpercent>0) {
            alert(v1Name + ": " + Apercent +"%\n" 
                + v2Name + ": " + Bpercent +"%\n"
                + v3Name + ": " + Cpercent +"% ");
        } else {
            alert("Please click inside the triangle");
        }
    }

    // audio for harp
    function playSound(filePath){
        var soundC = document.createElement("audio");
        soundC.setAttribute("src",filePath);
        soundC.play();
    }
        
    // drift points for physics example
    function drift(x0,y0,endpts1,endpts2,endpts3){

        var xNet = (endpts1[1][0]-endpts1[0][0]) +
                (endpts2[1][0]-endpts2[0][0]);
        var yNet = (endpts1[1][1]-endpts1[0][1]) +
                (endpts2[1][1]-endpts2[0][1]);

        if (endpts3.length > 1) {   // If 3 vectors
            xNet = xNet + (endpts3[1][0]-endpts3[0][0]);
            yNet = yNet + (endpts3[1][1]-endpts3[0][1]);
        }

        var xyDrift = new Array();
        var slp, intr, inc, x, y;
        var angle, driftDist, driftLine;
        var i;

        xNet = Math.round(xNet);  // to nearest integer
        yNet = Math.round(yNet);

        if (xNet!==0) {

            slp = yNet/xNet;
            intr = yNet + y0 - (slp*(xNet+x0));
            inc = 20; // drift increment between plotted points
            if (xNet>0){
                angle = Math.atan(slp)/(Math.PI/180.0);
            } else {
                angle = 180 + Math.atan(slp)/(Math.PI/180.0);
            }
            for (i=0;i<20;i++){         // must start at 0 for xyDrift row 0
                x = x0+((i*inc)*Math.cos(angle*Math.PI/180));
                y = slp * x + intr;
                totalDrift = Math.sqrt((x-x0)*(x-x0) + (y-y0)*(y-y0));
                if (totalDrift<200) {
                    xyDrift[i] = [x,y];
                }
            }
            driftDist = xNet/Math.cos(angle*Math.PI/180);
            
        } else {

            if (yNet>0){
                angle=90;
                x = 0;
                for (i=0;i<20;i++){
                    y = y0 + i*inc;
                    totalDrift = Math.sqrt((x-x0)*(x-x0) + (y-y0)*(y-y0));
                    if (totalDrift<200) {
                        xyDrift[i] = [x,y];
                    }
                }
            } else if (yNet<0){
                angle=-90;
                x = 0;
                for (i=0;i<20;i++){
                    y = y0 + (-1*i)*inc;
                    totalDrift = Math.sqrt((x-x0)*(x-x0) + (y-y0)*(y-y0));
                    if (totalDrift<200) {
                        xyDrift[i] = [x,y];
                    }
                }
            } else {
                angle = -999;
            }
            driftDist = yNet;

        }

        if (angle!==-999) {
            driftLine = new line(x0,y0,angle,driftDist,2);
        } else {
            driftLine = new line(x0,y0,angle,driftDist,0);
        }

        return [xyDrift,driftLine];
    }

    $(document).ready(function(){     // JQ approach to window.onload
        
        $("#canvas1").click(
            function(){getTrianglePercents(tri1,"canvas1","A","B","C");});
        $("#b1").click(
            function(){
                var nts = nestedTriangles(tri1.v);
                mm.draw.nestedtriangles("canvas1",tri1.v,nts[0],nts[1],nts[2],
                    "red","black","black");
                });
        $("#canvas2").click(
            function(){getTrianglePercents(tri1,"canvas2","Water","Flour","Choc.");});
        $("#b2").click(
            function(){mm.draw.circle("canvas2",198,140,5,"brown",4);});
        $("#bS1").click(
            function(){playSound("data/audio/cHigh.m4a");});
        $("#bS2").click(
            function(){playSound("data/audio/cMed.m4a");});
        $("#bS3").click(
            function(){playSound("data/audio/fSharpLow.m4a");});
        //var $container = $('#mycontainer');
        //$container.find('.bs1').click().end()
        //       .find('.bs2').click();
        $("#bS4").click(
            function(){playSound("data/audio/cLow.m4a");});
        $("#bwt").click(
            function(){
                ctx5.clearRect(0, 0, ctx5.canvas.width, ctx5.canvas.height);
                mm.draw.circle("canvas5",225,200,200,"blue",1);
                mm.draw.circle("canvas5",225,200,2,"brown",5);
                mm.draw.line("canvas5",line1.endpts,line1.arrowhead,line1.arrowtail,"blue",2);
                line2 = new line(225,200,Math.random()*360-180,100,1);  // wind
                mm.draw.line("canvas5",line2.endpts,line2.arrowhead,line1.arrowtail,"black",2);
            });
        $("#bdrift1").click(
            function(){
                var j = 1;
                var d = drift(225,200,line1.endpts,line2.endpts,0);
                var dxy = d[0];
                var dline = d[1];
                var intvl = 1200-(8*dline.length);
                //alert(intvl);
                si = setInterval(function(){
                        mm.draw.circle("canvas5",dxy[j][0],dxy[j][1],2,"brown",5);
                        j++;
                    },intvl); //200; 
                setTimeout(function(){clearInterval(si);},(intvl*dxy.length+10));
            });
        $("#bformTriangle").click(
            function(){
                var line2shifted = 
                    new line(line1.endpts[1][0],line1.endpts[1][1],
                        line2.angle,line2.length,1);
                var d = drift(225,200,line1.endpts,line2.endpts,0);
                line3 = d[1];
                mm.draw.line("canvas5",line2shifted.endpts,
                                line2shifted.arrowhead,line2shifted.arrowtail,"grey",2);
                mm.draw.line("canvas5",line3.endpts,line3.arrowhead,line3.arrowtail,"orange",2);
                motorForce = line3.length;
            });
        // Initialize slider must be done before canvas 6 buttons
        $("#slider").slider({   // initialize
            range : false,      // one handle
            min : 0,
            max : 200,
            value : 10,         // initial handle value
            slide : function(event,ui) {    // callback
                // Put slider value to page once a slider event happens
                $("#sliderVal").val(ui.value);  // slider value to page
            }
        });
        // Put initial slider value to page, before slider event
        $( "#sliderVal" ).val($("#slider").slider("values",0));
        $("#bwtm").click(
            function(){
                ctx6.clearRect(0, 0, ctx6.canvas.width, ctx6.canvas.height);
                mm.draw.circle("canvas6",225,200,200,"blue",1);
                mm.draw.circle("canvas6",225,200,2,"brown",5);
                mm.draw.line("canvas6",line1.endpts,line1.arrowhead,line1.arrowtail,"blue",2);
                mm.draw.line("canvas6",line2.endpts,line2.arrowhead,line2.arrowtail,"black",2);
                var line3shifted = 
                    new line(line3.endpts[0][0],line3.endpts[0][1],
                        line3.angle+180,line3.length,1);
                mm.draw.circle("canvas6",
                    line3shifted.endpts[1][0],line3shifted.endpts[1][1],2,"grey",5);
                motorForce = $("#slider").slider("values",0);
                line4 =
                    new line(line3.endpts[0][0],line3.endpts[0][1],
                        line3.angle+180,motorForce,1);
                mm.draw.line("canvas6",line4.endpts,
                    line4.arrowhead,line4.arrowtail,"orange",2);
            });
        $("#bdrift2").click(
            function(){
                var j = 1;
                var d = drift(225,200,line1.endpts,line2.endpts,line4.endpts);
                var dxy = d[0];
                var dline = d[1];
                var intvl = 1200-(8*dline.length);
                si = setInterval(function(){
                        mm.draw.circle("canvas6",dxy[j][0],dxy[j][1],2,"brown",5);
                        j++;
                    },intvl); //200; 
                setTimeout(function(){clearInterval(si);},(intvl*dxy.length));
            });

        var c1=document.getElementById("canvas1"); // canvas element
        var c2=document.getElementById("canvas2"); // canvas element
        var c3=document.getElementById("canvas3"); // canvas element
        var c4=document.getElementById("canvas4"); // canvas element
        var c5=document.getElementById("canvas5"); // canvas element
        var c6=document.getElementById("canvas6"); // canvas element
        
        // Set up canvas 1
        var ctx1=c1.getContext("2d");
        var c1w =c1.getAttribute("width");  //450;
        var c1h =c1.getAttribute("height");  //400;
        ctx1.font = "28px Arial";
        ctx1.fillText("A",(c1w/2)-10,22);
        ctx1.fillText("B",0,c1h);
        ctx1.fillText("C",(c1w-20),c1h);
        ctx1.save();             // save canvas state before transformations; use restore() later
        ctx1.translate(0,c1h);   // move origin from uplft to lwrlft
        ctx1.scale(1,-1);        // invert y coordinate values

        // Set up canvas 2
        var ctx2=c2.getContext("2d");
        var c2w =c2.getAttribute("width");  //450;
        var c2h =c2.getAttribute("height");  //400;
        ctx2.font = "28px Arial";
        ctx2.fillText("Water",(c2w/2)-40,22);
        ctx2.fillText("Flour",0,c2h);
        ctx2.fillText("Choc.",(c2w-80),c2h);
        ctx2.save();             // save canvas state before transformations; use restore() later
        ctx2.translate(0,c2h);   // move origin from uplft to lwrlft
        ctx2.scale(1,-1);        // invert y coordinate values

        // Set up canvas 3
        var ctx3=c3.getContext("2d");
        var c3h =c3.getAttribute("height");  //400;
        ctx3.save();             // save canvas state before transformations; use restore() later
        ctx3.translate(0,c3h);   // move origin from uplft to lwrlft
        ctx3.scale(1,-1);        // invert y coordinate values

        // Set up canvas 4
        var ctx4=c4.getContext("2d");
        var c4h =c4.getAttribute("height");  //400;
        ctx4.save();             // save canvas state before transformations; use restore() later
        ctx4.translate(0,c4h);   // move origin from uplft to lwrlft
        ctx4.scale(1,-1);        // invert y coordinate values

        // Set up canvas 5
        var ctx5=c5.getContext("2d");
        var c5h =c5.getAttribute("height");  //400;
        ctx5.save();             // save canvas state before transformations; use restore() later
        ctx5.translate(0,c5h);   // move origin from uplft to lwrlft
        ctx5.scale(1,-1);        // invert y coordinate values
     
        // Set up canvas 6
        var ctx6=c6.getContext("2d");
        var c6h =c6.getAttribute("height");  //400;
        ctx6.save();             // save canvas state before transformations; use restore() later
        ctx6.translate(0,c6h);   // move origin from uplft to lwrlft
        ctx6.scale(1,-1);        // invert y coordinate values
        

        // CANVAS 1
        // Main triangle specs
        var base=400.0;
        var baseFrac=0.5;
        var tri0 = new triangle(0,0,base,baseFrac);    // To get triangle height
        var x0=(c1w/2)-(tri0.base/2.0);            // start x   **CHECK
        var y0=(c1h/2)-(tri0.height/2.0);         // start y   **CHECK
        var tri1 = new triangle(x0,y0,base,baseFrac);
        mm.draw.polygon("canvas1",tri1.v,"black",2);  // Main triangle

        // CANVAS 2
        var nts = nestedTriangles(tri1.v);
        mm.draw.polygon("canvas2",tri1.v,"black",2);  // Main triangle
        mm.draw.nestedtriangles("canvas2",tri1.v,nts[0],nts[1],nts[2],"black","black","black");
        mm.draw.circle("canvas2",tri1.v[1][0]-20,200,5,"blue",4);  // Batter point info: A=50%, B=30%, C=20%
        var batterCBratio = 20/30;
        var cakeA = 32.5;
        var cakeBplusC = 100-cakeA; // A percent for cake
        var cakeB = cakeBplusC/(1+batterCBratio);
        var cakeC = 100 - cakeA - cakeB;
        //document.write(cakeB + " " + cakeC);
        
        // CANVAS 3
        var base=400;
        var baseFrac=0;
        var triR0 = new triangle(0,0,base,baseFrac);    // To get triangle height
        var x0=(c1w/2)-(triR0.base/2);           // start x
        var y0=(c1h/2)-(triR0.height/2);         // start y
        var triR = new triangle(x0,y0,base,baseFrac);
        mm.draw.polygon("canvas3",triR.v,"black",2);  // Main triangle
        
        var height0 = triR.height*0.24;
        var hbRatio = triR.height/triR.base;
        for (var i=1;i<5;i++){
            var height = height0*i;
            var base = height/hbRatio;
            var xS = (triR.x + triR.base) - base;
            var yS = triR.y;
            var line1 = new line(xS,yS,90,height,0);
            var clr="blue";
            if (i===3) clr="orange";
            mm.draw.line("canvas3",line1.endpts,line1.arrowhead,line1.arrowtail,clr,1);
        }
        
        // CANVAS 4
        var base=400;
        var baseFrac=0;
        var triR0 = new triangle(0,0,base,baseFrac);    // To get triangle height
        var x0=(c1w/2)-(triR0.base/2);           // start x
        var y0=(c1h/2)-(triR0.height/2);         // start y
        var triR = new triangle(x0,y0,base,baseFrac);
        mm.draw.polygon("canvas4",triR.v,"black",2);  // Main triangle
        
        var hbRatio = triR.height/triR.base;
        for (var i=4;i>0;i--){
            var height = height0*i;
            var base = height/hbRatio;
            var xS = (triR.x + triR.base) - base;
            var yS = triR.y + 10;
            var triR = new triangle(xS,yS,base,0);
            clr="blue";
            if (i===3)clr="orange";
            mm.draw.polygon("canvas4",triR.v,clr,0.75);
        };
        
        // CANVAS 5
        mm.draw.circle("canvas5",225,200,200,"blue",1);
        mm.draw.circle("canvas5",225,200,2,"brown",5);
        var line1 = new line(225,200,-45,50,1);  // tide
        var line2;
        
        // CANVAS 6
        mm.draw.circle("canvas6",225,200,200,"blue",1);
        mm.draw.circle("canvas6",225,200,2,"brown",5);
        var motorForce = 0;

    });

})();
