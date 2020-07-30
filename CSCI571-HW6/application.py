from newsapi import NewsApiClient
from newsapi.newsapi_exception import NewsAPIException
from flask import Flask, jsonify, send_file,request,Response
import string
application = Flask(__name__)

newsapi = NewsApiClient(api_key='a752b02666e34b3d8880c9977504e551')


@application.route('/headlines',methods=['GET'])
def getHeadlines():
    allTopHeadlines = newsapi.get_top_headlines(sources=None,language='en',country= 'us',page_size=30)
    sliderHeadlines = []
    for article in allTopHeadlines["articles"]:
        if len(sliderHeadlines) < 5:
            if article["source"] and article["source"]["name"]and article["source"]["id"] and article["author"] and article["title"] and article["description"] and article["url"] and article["urlToImage"] and article["publishedAt"] and article["content"]:
                sliderHeadlines.append(article)
    
    foxTopHeadlines = newsapi.get_top_headlines(sources='fox-news',language = 'en',page_size=30)
    foxHeadlines = []
    for article in foxTopHeadlines["articles"]:
        if len(foxHeadlines) < 4:
            if article["source"] and article["source"]["name"] and article["source"]["id"]and article["author"] and article["title"] and article["description"] and article["url"] and article["urlToImage"] and article["publishedAt"] and article["content"]:
                foxHeadlines.append(article)

    cnnTopHeadlines = newsapi.get_top_headlines(sources='cnn',language = 'en',page_size=30)
    cnnHeadlines = []
    for article in cnnTopHeadlines["articles"]:
        if len(cnnHeadlines) < 4:
            if article["source"] and article["source"]["name"] and article["source"]["id"]and article["author"] and article["title"] and article["description"] and article["url"] and article["urlToImage"] and article["publishedAt"] and article["content"]:
                cnnHeadlines.append(article)

    wordCloudHeadlines = []
    for article in allTopHeadlines["articles"]:
        if article["source"] and article["source"]["name"] and article["source"]["id"]and article["author"] and article["title"] and article["description"] and article["url"] and article["urlToImage"] and article["publishedAt"] and article["content"]:
                wordCloudHeadlines.append(article)
    
    titles = []
    mostFrequent = {}
    mostFrequentWithoutStop = {}
    stopWords = []
    with open('stopwords.txt') as fp:
        for line in fp:
            stopWords.append(line.strip())
    
    for headline in wordCloudHeadlines:
        titles.append(headline["title"])
       
    for title in titles:
        words = title.split(" ")
        for word in words:
            if word not in string.punctuation and word.isalnum():
                if word !='':
                    if word not in mostFrequent:
                        mostFrequent[word]=1
                    mostFrequent[word]+=1
    
    for k,v in mostFrequent.items():
        if k.lower() not in stopWords:
            mostFrequentWithoutStop[k] = v
    
    mostFrequentDict = dict(sorted(mostFrequentWithoutStop.items(),key=lambda x:x[1],reverse=True))
    mostFrequentWithoutStop = list(map(lambda x:[x[0],x[1]],mostFrequentDict.items()))[:30]

    returnObject = {'topHeadlines':sliderHeadlines,'wordCloud':mostFrequentWithoutStop,'cnn':cnnHeadlines,'fox':foxHeadlines}
    return jsonify(returnObject)


@application.route('/getSources',methods=['GET'])
def getSources():
    category = request.args.get("category")
    if category == "all":
        category = None    
    sources = newsapi.get_sources(category=category,language='en',country='us')
    return jsonify(sources["sources"])
    

@application.route('/searchForm',methods=['GET'])
def getArticles():
    keyWord = request.args.get("keyword")
    fromValue = request.args.get('from')
    toValue = request.args.get('to')
    source = request.args.get('source')
    if source == "None":
        source = None
    try:
        articlesJson = newsapi.get_everything(q=keyWord, sources=source,from_param=fromValue, to=toValue, language='en', sort_by= 'publishedAt', page_size=30)
    except NewsAPIException as e:
        return Response(e.get_message(),status=404)

    articles = []
    for article in articlesJson["articles"]:
        if article["author"] and article["title"] and article["description"] and article["url"] and article["urlToImage"] and article["publishedAt"] and article["source"] and article["source"]["name"]:
            articles.append(article)
   
    return jsonify(articles)


@application.route('/')
def slider():
    return application.send_static_file('index.html')




if __name__ == "__main__":
    application.debug = True
    application.run()
