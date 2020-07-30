function getSources(category)
{
    xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.onreadystatechange = function () 
    {
        if(this.readyState == 4 && this.status == 200)
        {
            response = xhr.responseText;
            json = JSON.parse(response);
            addSources(json);
        }
    };
    xhr.open("GET","/getSources?category="+category,true);
    try
    {
        xhr.send();
    }
    catch
    {
        window.alert("JSON file not found");
        return;
    }
}

function displaySearchDiv()
{
    getSources("all");
    
    document.getElementById("news").style.backgroundColor = "";
    document.getElementById("news").style.color = "black";
    document.getElementById("search").style.backgroundColor = "#555555";
    document.getElementById("search").style.color = "white";
    document.getElementById("search").onmouseover = function()
    {
        this.style.backgroundColor = "green";
        this.style.color = "white";
    };
    document.getElementById("search").onmouseout= function()
    {
        this.style.backgroundColor = "#555555";
        this.style.color = "white";
    };
    document.getElementById("news").onmouseover = function()
    {
        this.style.backgroundColor = "green";
        this.style.color = "white";
    };
    document.getElementById("news").onmouseout = function()
    {
        this.style.backgroundColor = "";
        this.style.color = "black";
    };
    formDiv = document.getElementById("form-div");
    formDiv.style.display = "block";
    formDiv.innerHTML = '';
    document.getElementById("display").style.display = 'none';
    
    searchForm = document.createElement("form");
    searchForm.onsubmit = formSubmit;
    searchForm.onreset = formReset;
    searchForm.id = "formId"
   
    row1 = document.createElement("div");
    row1.className = "row1";
    keyWordLabel = document.createElement("label");
    keyWordLabel.setAttribute("for","keyword");
    keyWordLabel.innerHTML = "Keyword <span class='asterix'>*</span>";
    row1.appendChild(keyWordLabel);
    keyWord = document.createElement("input");
    keyWord.setAttribute("type","text");
    keyWord.id = "keyword";
    keyWord.required = true;
    row1.appendChild(keyWord);
    keyWord.addEventListener("input",function()
    {
        this.style.border = "None";
    });
    fromLabel = document.createElement("label");
    fromLabel.id = "fromLabel";
    fromLabel.setAttribute("for","from");
    fromLabel.innerHTML = "From <span class='asterix'>*</span>";
    row1.appendChild(fromLabel);
    from = document.createElement("input");
    from.setAttribute("type","date");
    from.id = "from";
    from.required = true;
    today = new Date();
    from.valueAsDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()-7);
    
    row1.appendChild(from);
    toLabel = document.createElement("label");
    toLabel.id = "toLabel";
    toLabel.setAttribute("for","to");
    toLabel.innerHTML = "To <span class='asterix'>*</span>";
    row1.appendChild(toLabel);
    to = document.createElement("input");
    to.setAttribute("type","date");
    to.id = "to";
    to.required = true;
    to.valueAsDate = today;
    row1.appendChild(to);
    searchForm.appendChild(row1);

    row2 = document.createElement("div");
    row2.className = "row2";
    categoryLabel = document.createElement("label");
    categoryLabel.id = "categoryLabel";
    categoryLabel.setAttribute("for","category");
    categoryLabel.innerHTML = "Category";
    row2.appendChild(categoryLabel);
    category = document.createElement("select");
    category.setAttribute("onchange","getSources(category.value)");
    category.style.textAlignLast = "center";
    category.id = "category";
    categories = ["all","business","entertainment","general","health","science","sports","technology"];
    for(i=0;i<categories.length;i++)
    {
        option = document.createElement("option");
        option.innerHTML = categories[i];
        if(i==0)
        {
            option.selected = true;
        }
        option.value = categories[i];
        category.appendChild(option);
    }
    row2.appendChild(category);
    sourceLabel = document.createElement("label");
    sourceLabel.id = "sourceLabel";
    sourceLabel.setAttribute("for","source");
    sourceLabel.innerHTML = "Source";
    row2.appendChild(sourceLabel);
    source = document.createElement("select");
    source.id = "source";
    source.style.textAlignLast = "center";
    option = document.createElement("option");
    option.innerHTML = "all";
    option.value = "None";
    option.selected = true;
    source.appendChild(option);

    row2.appendChild(source);
    searchForm.appendChild(row2);

    row3 = document.createElement("div");
    row3.className = "row3";
    search = document.createElement("button");
    search.id = "searchButton";
    search.setAttribute("type","submit");
    search.setAttribute("form","formId")
    search.innerHTML = "Search";
    row3.append(search);
    reset = document.createElement("input");
    reset.id = "reset";
    reset.setAttribute("type","reset");
    reset.value = "Clear";
    row3.append(reset);
    searchForm.appendChild(row3);
    formDiv.appendChild(searchForm);
 
}
function addSources(sources)
{
    source = document.getElementById("source");
    source.innerHTML = '';
    source.style.textAlign = "center";
    option = document.createElement("option");
    option.innerHTML = "all";
    option.value = "None";
    option.selected = true;
    source.appendChild(option);
    x = 0
    if(sources.length < 10)
    {
        x = sources.length;
    }
    else
    {
        x = 10
    }
    for(i=0;i<x;i++)
    {
        option = document.createElement("option");
        option.innerHTML = sources[i]["name"];
        option.value = sources[i]["id"];
        source.appendChild(option);
    }

}

function formReset(event)
{
    event.preventDefault();
    document.getElementById("keyword").value = '';
    document.getElementById("keyword").style.border = 'solid 1px red';
    document.getElementById("category").selectedIndex = 0;
    document.getElementById("source").selectedIndex = 0;
    document.getElementById("from").valueAsDate =  new Date(today.getFullYear(), today.getMonth(), today.getDate()-7);
    document.getElementById("to").valueAsDate =  new Date();
    document.getElementById("articles-div").innerHTML = "";
}



function formSubmit(event)
{
    event.preventDefault();
    keyWordValue = document.getElementById("keyword").value;
    fromValue = document.getElementById("from").value;
    toValue = document.getElementById("to").value;
    sourceValue = document.getElementById("source").value;
    categoryValue = document.getElementById("category").value;
    if(toValue < fromValue)
    {
        alert("Incorrect time");
        return;
    }
    params = 'keyword='+keyWordValue+"&from="+fromValue+"&to="+toValue+"&source="+sourceValue;
    xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.onreadystatechange = function () 
    {
        if(this.readyState == 4 && this.status == 200)
        {
            response = xhr.responseText;
            json = JSON.parse(response);
            displayArticles(json);
        }
        else if(this.readyState == 4 && this.status == 404)
        {
            response = xhr.responseText;
            alert(response);
            return;
        }
    };
    xhr.open("GET","/searchForm?"+params,true);
    try
    {
        xhr.send();
    }
    catch
    {
        window.alert("JSON file not found");
        return;
    } 
    
}

function displayArticles(articles)
{
    articlesDiv = document.getElementById("articles-div");
    articlesDiv.style.display = "block";
    articlesDiv.innerHTML = '';
    if(articles.length==0)
    {
        articlesDiv.innerHTML = "<p style ='margin-left:250px'> No results </p>";
        return;
    }
    
    else if(articles.length >0 && articles.length < 5)
    {
        createArticles(articles,0,articles.length,false);
    }
    else
    {
        createArticles(articles,0,5,false);
        createShowMoreButton(articles,5);
    }  
}

function createArticles(articles,l,h,flag)
{
    if(l==0)
    {
        document.getElementById("articles-div").innerHTML = '';
    }
    for(i=l;i<h;i++)
    {
        article = document.createElement("div");
        article.className = "article";
        article.id = "article";
        article.style.overflow = "hidden"

        article.setAttribute("onclick","addMoreContent(\""+i+"\")");
        imageDiv = document.createElement("div");
        imageDiv.style.float = "left";
        imageDiv.style.marginLeft = "15px";
        imageDiv.style.marginTop = "10px"
        imageDiv.style.marginBottom = "15px";

        img  = document.createElement("img");
        img.setAttribute("src",articles[i]["urlToImage"]);
        img.style.height = "75px";
        img.style.width = "75px";
        img.style.objectFit = "cover";
        imageDiv.appendChild(img);
        article.appendChild(imageDiv);

        contentDiv = document.createElement("div");
        contentDiv.style.alignContent = "left";
        contentDiv.id = "contentDiv";
        title = document.createElement("div");

        title.style.fontWeight='bold';
        title.style.fontSize = '14px';  
        title.innerHTML = articles[i]["title"]+" <br>";
        contentDiv.appendChild(title);
        description = document.createElement("div");
        description.id = "description";
        description.style.fontSize = '12px';
        descriptionText = articles[i]["description"];
        descriptionArr = descriptionText.split(" ");
        array = [];
        text = "";
        for(j=0;j<descriptionArr.length;j++)
        {
            if(text.length < 90)
            {
                array.push(descriptionArr[j]);
                text+=descriptionArr[j]+" ";
            }
        }
        if(descriptionText.length >= 90)
        {
            text = array.slice(0,array.length-1).join(" ");
            text+="...";
        }
        description.innerHTML = text+" <br>";
        description.style.whiteSpace = "nowrap";
        description.style.textOverflow = 'ellipsis';
        description.style.overflow = "hidden";
        contentDiv.appendChild(description);
        article.appendChild(contentDiv);
        articlesDiv.appendChild(article);


        expandedArticle = document.createElement("div");
        expandedArticle.id = "expandedArticle";
        expandedArticle.className = "expandedArticle";
        expandedArticle.style.display = "none";
        
        expandedImageDiv = document.createElement("div");
        expandedImageDiv.style.float = "left";
        expandedImageDiv.style.marginLeft = "15px";
        expandedImageDiv.style.marginTop = "10px"
        expandedImg  = document.createElement("img");
        expandedImg.setAttribute("src",articles[i]["urlToImage"]);
        expandedImg.style.height = "75px";
        expandedImg.style.width = "75px";
        expandedImg.style.objectFit = "cover";
        expandedImageDiv.appendChild(expandedImg);
        expandedArticle.appendChild(expandedImageDiv);
        closeButton = document.createElement("div");
        closeButton.style.float = ""
        closeButton.style.marginLeft = "620px";
        closeButton.innerHTML = "&times";
        closeButton.style.fontSize = "22px";
        closeButton.setAttribute("onclick","reduceContent(\""+i+"\")");
        closeButton.style.color = "purple";
        expandedArticle.appendChild(closeButton);

        expandedContentDiv = document.createElement("div");
       
        expandedContentDiv.id = "expandedContentDiv";
        expandedTitle = document.createElement("div");
        expandedTitle.style.fontWeight='bold';
        expandedTitle.style.fontSize = '14px';  
        expandedTitle.innerHTML = articles[i]["title"]+" <br>";
        expandedContentDiv.appendChild(expandedTitle);
        expandedDescription = document.createElement("div");
        expandedDescription.style.overflow = "hidden"
        expandedDescription.id = "expandedDescription";
        expandedDescription.style.fontSize = '12px';
        date= new Date(articles[i]["publishedAt"]);
        dd = date.getDate();
        mm = date.getMonth()+1;
        yy = date.getFullYear();
        if(dd<10) 
        {
            dd="0"+dd;
        } 
        if(mm<10) 
        {
            mm="0"+mm;
        } 
        dateString = mm+"/"+dd+"/"+yy;

        expandedDescription.innerHTML = "<div style='margin-top:1px'><span style='font-weight:bold'>Author:</span> "+articles[i]["author"]+"</div>";
        expandedDescription.innerHTML+="<div style='margin-top:3px'><span style='font-weight:bold'>Source:</span> "+articles[i]["source"]["name"]+"</div>";
        expandedDescription.innerHTML+="<div style='margin-top:3px'><span style='font-weight:bold'>Date:</span> "+dateString+"</div>";
        expandedDescription.innerHTML+= "<div style='margin-top:3px'>"+articles[i]["description"]+"</div>";
        expandedDescription.innerHTML+= "<div style='margin-top:3px'><a href='"+articles[i]["url"]+"' target='_blank'> See Original Post </a></div>";
    
        expandedContentDiv.appendChild(expandedDescription);
        expandedArticle.appendChild(expandedContentDiv);
        articlesDiv.appendChild(expandedArticle);

        articlesDiv.innerHTML+="<br>";
    }
    if(flag)
    {
        createShowLessButton(articles);
    }
}

function createShowMoreButton(articles,h)
{
    showMore = document.createElement("button");
    showMore.id = "showMore";
    showMore.style.height = "30px";
    showMore.style.width = "100px";

    if((articles.length - h) <=10)
    {
        showMore.addEventListener("click",function()
        {
            document.getElementById("articles-div").removeChild(showMore);
            createArticles(articles,5,articles.length,true);
        });
    }
    else
    {
        showMore.addEventListener("click",function()
        {
            document.getElementById("articles-div").removeChild(showMore);
            createArticles(articles,5,15,true);
        });
    }
    showMore.innerHTML = "Show More";
    document.getElementById("articles-div").appendChild(showMore);
}

function createShowLessButton(articles)
{
    showLess = document.createElement("button");
    showLess.id = "showLess";
    showLess.style.height = "30px";
    showLess.style.width = "100px";
    
    showLess.addEventListener("click",function()
    {
        createArticles(articles,0,5,false);
         createShowMoreButton(articles,5);
    });
    showLess.innerHTML = "Show Less";
    document.getElementById("articles-div").appendChild(showLess);
}

function addMoreContent(i)
{
    expandedArticle = document.getElementsByClassName("expandedArticle")[i]
    expandedArticle.style.display = "block";
    document.getElementsByClassName("article")[i].style.display = "none";
}

function reduceContent(i)
{
    article = document.getElementsByClassName("article")[i]
    article.style.display = "block";
    document.getElementsByClassName("expandedArticle")[i].style.display = "none";
}


function fetchHeadlines()
{
    xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.onreadystatechange = function () 
    {
        if(this.readyState == 4 && this.status == 200)
        {
            response = xhr.responseText;
            json = JSON.parse(response);
            parse(json);
        }
    };
    xhr.open("GET","/headlines",true);
    try
    {
        xhr.send();
    }
    catch
    {
        window.alert("JSON file not found");
        return;
    }
}

function parse(json)
{
    document.getElementById("news").style.backgroundColor = "#555555";
    document.getElementById("news").style.color = "white";
    document.getElementById("search").style.backgroundColor = "";
    document.getElementById("search").style.color = "black";
    document.getElementById("news").onmouseover = function()
    {
        this.style.backgroundColor = "green";
        this.style.color = "white";
    };
    document.getElementById("news").onmouseout = function()
    {
        this.style.backgroundColor = "#555555";
        this.style.color = "white";
    };
    
    document.getElementById("search").onmouseover = function()
    {
        this.style.backgroundColor = "green";
        this.style.color = "white";
    };
    document.getElementById("search").onmouseout= function()
    {
        this.style.backgroundColor = "";
        this.style.color = "black";
    };

    document.getElementById("display").style.display = 'block';
    document.getElementById("form-div").style.display = 'none';
    document.getElementById("articles-div").style.display = 'none';
    carouselDiv = document.getElementById("carousel");
    for(key in json)
    {
        if(key=="topHeadlines")
        {
            createCarouselImages(json[key],0);
        }
        else if(key=="wordCloud")
        {
            displayWordCloud(json[key]);
        }
        else if(key=="cnn")
        {
            cnn(json[key]);
        }
        else
        {
            fox(json[key]);
        }
    }
}

function createCarouselImages(headlines,i)
{
    if (i == headlines.length) {i= 0}
    carouselDiv.innerHTML = '';
    img = document.createElement("img");
    img.setAttribute("src",headlines[i]["urlToImage"]);
    img.style.width = "450px";
    img.style.height = "300px";
    img.style.objectFit = "cover";
    carouselDiv.setAttribute("onclick","window.open(\""+headlines[i]["url"]+"\")");
    carouselDiv.appendChild(img);
    content = document.createElement("div");
    content.className = "content-div";
    title = document.createElement("div");
    title.style.padding = "5px";
    title.style.fontWeight='bold';
    title.style.fontSize = '14px';  
    title.style.color = "white";
    title.innerHTML = headlines[i]["title"];
    content.appendChild(title);
    description = document.createElement("div");
    description.style.padding='10px';
    description.style.fontSize = '12px';
    description.innerHTML = headlines[i]["description"];
    description.style.color = "white";
    description.style.textOverflow = 'ellipsis';
    content.appendChild(description);
    carouselDiv.appendChild(content);
    i++; 
    setTimeout(createCarouselImages, 5000,headlines,i);
}


function displayWordCloud(wordCloud)
{
    document.getElementById("wordcloud").innerHTML = '';
    var margin = {top: 0, right: 10, bottom: 10, left: 10},
    width = 330 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

   var svg = d3.select("#wordcloud").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

     var layout = d3.layout.cloud()
  .size([width, height])
  .words(wordCloud.map(function(d) { return {text: d[0],size: 9*d[1]}; }))
  .padding(4.5)        
  .fontSize(function(d) { return d.size; })
  .rotate(function() { return ~~(Math.random() * 2) * 90; })      
  .on("end", draw);

  layout.start();

    function draw(words) 
    {
        svg
        .append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .selectAll("text")
            .data(words)
        .enter().append("text")
            .style("font-size", function(d) { return d.size +"px";})
            .style("fill", "black")
            .attr("text-anchor", "middle")
            .style("font-family", "Impact")
            .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });
    }

}

function cnn(headlines)
{
    cnnCards = document.getElementsByClassName("cnn-table")[0];
    cnnCards.innerHTML = '';
    tr = document.createElement("tr");
    for(i=0;i<4;i++)
    {
        td = document.createElement("td");
        card = document.createElement("div");
        card.className = "news-card";
        if(i < headlines.length)
        {
            card.setAttribute("onclick","window.open(\""+headlines[i]["url"]+"\")");
            imageDiv = document.createElement("div");
            img  = document.createElement("img");
            img.setAttribute("src",headlines[i]["urlToImage"]);
            img.style.height = "150px";
            img.style.width = "215px";
            img.style.objectFit = "cover";
            img.style.borderRadius = "2px";
            imageDiv.appendChild(img);
            card.appendChild(imageDiv);
            title = document.createElement("div");
            title.style.textAlign = "center";
            title.style.padding = "5px";
            title.style.fontWeight='bold';
            title.style.fontSize = '13px';  
            title.innerHTML = headlines[i]["title"]+" <br>";
            card.appendChild(title);
            description = document.createElement("div");
            description.style.textAlign = "center";
            description.style.padding='12x';
            description.style.fontSize = '12px';
            description.innerHTML = headlines[i]["description"]+" <br>";
            card.appendChild(description);
        }
        td.appendChild(card);
        tr.appendChild(td);
    }
   
    cnnCards.appendChild(tr);

}

function fox(headlines)
{
    foxCards = document.getElementsByClassName("fox-table")[0];
    tr = document.createElement("tr");
    foxCards.innerHTML = '';
    for(i=0;i<4;i++)
    {
        td = document.createElement("td");
        card = document.createElement("div");
        card.className = "news-card";
        if(i<headlines.length)
        {
            card.setAttribute("onclick","window.open(\""+headlines[i]["url"]+"\")");
            imageDiv = document.createElement("div");
            img  = document.createElement("img");
            img.setAttribute("src",headlines[i]["urlToImage"]);
            img.style.height = "150px";
            img.style.width = "215px";
            img.style.objectFit = "cover";
            img.style.borderRadius = "2px";
            imageDiv.appendChild(img);
            card.appendChild(imageDiv);
            title = document.createElement("div");
            title.style.textAlign = "center";
            title.style.padding = "5px";
            title.style.fontWeight='bold';
            title.style.fontSize = '13px';  
            title.innerHTML = headlines[i]["title"]+" <br>";
            card.appendChild(title);
            description = document.createElement("div");
            description.style.textAlign = "center";
            description.style.padding='12px';
            description.style.fontSize = '12px';
            description.innerHTML = headlines[i]["description"]+" <br>";
            card.appendChild(description);
        }
        td.appendChild(card);
        tr.appendChild(td);
    }
    foxCards.appendChild(tr);
    foxCards.innerHTML+="<br><br><br>";
}
