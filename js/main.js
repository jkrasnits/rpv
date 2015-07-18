var linkObjectArr = [];
var linkObjectArrStartSize = 0;
var currentImageID = 0;
//REMOVE BEFORE PUSHING

imgurAuth = config.imgurAuth;

//add link objects to linkObjectArr
var populateArray = function(numLinks) {
    reddit.top("pics").t("day").limit(numLinks).fetch(function (res) {
      for (var i = linkObjectArrStartSize; i < numLinks; i++) {
        linkObjectArr.push(res.data.children[i]);
        linkObjectArr[i].data.embed = linkObjectArr[i].data.url;//maybe put generate embed here
        //add embed code attribute?
      }
      displayLinkObjects();
      
      //if arrowed over, change to first newly generated pic
      if (linkObjectArrStartSize === 0) {
        displayLinkImage(currentImageID);
        //console.log(linkObjectArr[1].data.url);
    }
    linkObjectArrStartSize = linkObjectArr.length;
  });
};

//changes main image to linkID
var displayLinkImage = function(linkID){
    //this has to be changed so that the proper embed code replaces the line below this
    $( "#main_image" ).attr( "src", linkObjectArr[linkID].data.url );
    // maybe add spinner if loading?
    //include stuff to make link dark and what not
};

//displays all link boxes left in linkObjectArr
var displayLinkObjects = function() {
    for (var i = linkObjectArrStartSize; i < linkObjectArr.length; i++) {
        var subData = linkObjectArr[i].data;
        console.log(subData.thumbnail + ", " + subData.permalink + ", embed:" + subData.embed);
        $( "#link_area" ).append("<div class='large-8 large-centered columns'><div class='link_holder' onclick='linkClick("+i+")' id='"+i+"'>"+subData.title+"</div></div>");
    }
};

//called whenever scrolled to bottom
var generateMoreLinks = function() {
    if (linkObjectArrStartSize === 0) {
        populateArray(linkObjectArrStartSize+20);
    } else {
        populateArray(linkObjectArrStartSize+10);
    }
};

//goes to next image in array
var nextImage = function() {
    if(currentImageID === linkObjectArr.length){
        var temp = linkObjectArrStartSize+1;
        generateMoreLinks();
        linkClick(temp);
    }
    currentImageID++;
    displayLinkImage(currentImageID);
};

//goes to previous image in array
var prevImage = function() {
    if(currentImageID !== 0){
        currentImageID--;
        displayLinkImage(currentImageID);
    } else {
        alert("cant go back");
    }
};

//calls displayLinkImage when link is clicked
var linkClick = function(id) {
    console.log(id);
    currentImageID = id;
    displayLinkImage(currentImageID);
};

//meant to create proper link if not direct link
var imgError = function(url){
    var imgSrc = url;

    //Check image embed and implement
    //If it exists use that, if not call generate embed, assign returned value to embed attr of current imageid linkobj, implement embed

    //checks if its imgur and not album
    if (imgSrc.indexOf('imgur') !== -1 || imgSrc.indexOf('/a/') === -1) {
        var idIndex = imgSrc.indexOf('.com/') +5;
        var id = imgSrc.substring(idIndex);
        //generateDirectURL(id) and add that as attr to object to reduce calls
    }//checks if its imgur and album 
    else if (imgSrc.indexOf('imgur') !== -1 || imgSrc.indexOf('/a/') !== -1){
        //all the stuff to handle an album
    }
    
};

//generates direct link to image, only use if image is broken to diminish calls to API
//only call if not an album
var generateEmbed = function(linkObj) {
    //maybe just return embed string/array
    //var embed = big ass embed string
    //link = linkObj.data.url or something

    //if imgur img
        //embed = imgurImgEmbed(link)
    //if imgur album
        //run album init(imguralbumembed(link)-->will return array of links) and embed=array
    //if imgur gfy
        //''
    //if gfycat
        //''
    //if mediacrush
        //''

    //add properembed attr to linkObj

};

var imgurImgEmbed = function(link) {

    var idIndex = link.indexOf('.com/') +5;
    var id = link.substring(idIndex);

    var idURL = "https://api.imgur.com/3/image/" + id;
    var directURL;

    $.ajax({
            type:"GET",
            headers: {Authorization: imgurAuth},
            async: false,
            url: idURL,
            //data: ,
            success: function(msg) {
               directURL = msg.data.link;
            }
    });

    console.log(directURL);
    //return string for embed
};

var imgurAlbumEmbed = function(link) {

    var idIndex = link.indexOf('.com/a/') +7;
    var id = link.substring(idIndex);

    var idURL = "https://api.imgur.com/3/album/" + id;
    var directURL;
    var directURLArr = [];

    $.ajax({
            type:"GET",
            headers: {Authorization: imgurAuth},
            async: false,
            url: idURL,
            //data: ,
            success: function(msg) {
               imgsObject = msg.data.images;
            }
    });

    for (var i = 0; i < imgsObject.length; i++) {
        //console.log(imgsObject[i].link);
        directURLArr.push(imgsObject[i].link);
    }

    console.log(directURLArr);
    return directURLArr;
    //console.log(imgsObject);
    //return string for embed
};

var imgurGFYEmbed = function(link) {

    var idIndex = link.indexOf('.com/')+5;
    var id = link.substring(idIndex,link.lastIndexOf("."));
    console.log(id);

    var idURL = "https://api.imgur.com/3/image/" + id;
    var directURL, fullEmbed;

    $.ajax({
            type:"GET",

            headers: {Authorization: imgurAuth},
            async: false,
            url: idURL,
            //data: ,
            success: function(msg) {
               directURL = msg.data.webm;
            }
    });

    fullEmbed = "<iframe src='"+ directURL +"' frameborder='0' scrolling='no' width='100%' height='100%' ></iframe>";
    console.log(fullEmbed);
    return fullEmbed;
    //return string for embed
};

var gfycatEmbed = function(link) {

    var idIndex = link.indexOf('.com/') +5;
    var id = link.substring(idIndex);
    idURL = "http://gfycat.com/cajax/get/"+id;
    console.log(idURL);

    $.ajax({
            type:"GET",
            async: false,
            url: idURL,
            //data: ,
            success: function(msg) {
               directURL = msg.gfyItem.webmUrl;
            }
    });

    fullEmbed = "<video src='" + directURL + "' height='100%' width='100%' loop autoplay></video>";
    console.log(fullEmbed);
    //return string for embed
};

var albumInit = function (linkArr) {
    //unhide album when it starts, hide album and reset values when album goes away
    albumLinkArr = linkArr;
    albumIndex = 0;
    $('#main_image').attr('src', albumLinkArr[albumIndex]);
    //$('#main_image').attr('src', albumLinkArr[albumIndex]);
    console.log(albumIndex);

    
};


var initialize = function () {
    generateMoreLinks();

    $('#link_area').bind('scroll', function() {
        if($(this).scrollTop() + $(this).innerHeight() >= this.scrollHeight) {
            generateMoreLinks();
        }
    });

    $('#prevButton').on('click', function(event) {
        event.preventDefault();
        prevImage();
    });

    $('#nextButton').on('click', function(event) {
        event.preventDefault();
        nextImage();
    });

/*    */

};

var albumIndex = 0;
var albumLinkArr=[];

$('#album_prev').on('click', function(event) {
    event.preventDefault();
    if (albumIndex>0) {
        albumIndex--;
        console.log(albumIndex);
        $('#main_image').attr('src', albumLinkArr[albumIndex]);
    }
});

$('#album_next').on('click', function(event) {
    event.preventDefault();
    if (albumIndex<albumLinkArr.length) {
        albumIndex++;
        console.log(albumIndex);
        $('#main_image').attr('src', albumLinkArr[albumIndex]);
    }
});






initialize();




